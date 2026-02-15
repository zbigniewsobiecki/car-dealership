#!/bin/bash
set -e

echo "=== Car Dealership Project Setup for CASCADE ==="
echo "Agent profile: ${AGENT_PROFILE_NAME:-not set}"

# =============================================================================
# Helper functions
# =============================================================================
log_info() {
  echo "[INFO] $1"
}

log_warn() {
  echo "[WARN] $1"
}

log_error() {
  echo "[ERROR] $1"
}

# Detect OS
detect_os() {
  case "$(uname -s)" in
    Darwin*) echo "macos" ;;
    Linux*)  echo "linux" ;;
    *)       echo "unknown" ;;
  esac
}

OS=$(detect_os)
log_info "Detected OS: $OS"

# Get the project root directory (parent of .cascade)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
log_info "Project root: $PROJECT_ROOT"

# Change to project root for all subsequent commands
cd "$PROJECT_ROOT"

# =============================================================================
# 0. Prerequisites Check
# =============================================================================
echo ""
echo "--- Checking Prerequisites ---"

# Check for Node.js
if ! command -v node &> /dev/null; then
  log_error "Node.js is not installed"
  exit 1
fi
log_info "Node.js: $(node --version)"

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
  log_warn "pnpm not found, attempting to install via corepack..."
  if command -v corepack &> /dev/null; then
    corepack enable
    corepack prepare pnpm@latest --activate
  else
    log_error "Neither pnpm nor corepack found. Please install pnpm."
    exit 1
  fi
fi
log_info "pnpm: $(pnpm --version)"

# =============================================================================
# 1. Install Dependencies (only for certain agents)
# =============================================================================
case "$AGENT_PROFILE_NAME" in
  implementation|respond-to-review|review|respond-to-ci)
    echo ""
    echo "--- Installing Dependencies ---"
    CI=true PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 pnpm install
    log_info "Dependencies installed"
    ;;
  *)
    echo ""
    log_info "Skipping dependency installation (agent: ${AGENT_PROFILE_NAME:-unknown})"
    ;;
esac

# =============================================================================
# 2. PostgreSQL Setup
# =============================================================================
echo ""
echo "--- PostgreSQL Setup ---"

start_postgres_macos() {
  # On macOS, PostgreSQL runs as the current user, not 'postgres'
  if command -v brew &> /dev/null; then
    # Check which postgresql is installed
    local pg_service=""
    for ver in 17 16 15 14 13; do
      if brew list "postgresql@$ver" &> /dev/null; then
        pg_service="postgresql@$ver"
        break
      fi
    done

    if [ -z "$pg_service" ] && brew list postgresql &> /dev/null; then
      pg_service="postgresql"
    fi

    if [ -z "$pg_service" ]; then
      log_info "PostgreSQL not installed, installing postgresql@16..."
      brew install postgresql@16
      pg_service="postgresql@16"
    fi

    log_info "Using $pg_service"

    # Start the service
    if ! pg_isready -q 2>/dev/null; then
      log_info "Starting PostgreSQL..."
      brew services start "$pg_service" 2>/dev/null || true

      # Wait for it to be ready
      for i in {1..15}; do
        if pg_isready -q 2>/dev/null; then
          break
        fi
        log_info "Waiting for PostgreSQL... ($i/15)"
        sleep 1
      done
    fi
  else
    log_error "Homebrew not found on macOS. Please install PostgreSQL manually."
    return 1
  fi
}

start_postgres_linux() {
  # Check if PostgreSQL SERVER is installed
  local pg_ctl_path
  pg_ctl_path=$(find /usr/lib/postgresql -name pg_ctl 2>/dev/null | head -1 || true)

  if [ -z "$pg_ctl_path" ]; then
    log_info "PostgreSQL server not found, installing..."
    if command -v apt-get &> /dev/null; then
      sudo apt-get update && sudo apt-get install -y postgresql postgresql-client
      local pg_version
      pg_version=$(ls /usr/lib/postgresql/ | sort -V | tail -1)
      log_info "Installed PostgreSQL version: $pg_version"

      # Initialize if needed
      if [ ! -d /var/lib/postgresql/data ] || [ -z "$(ls -A /var/lib/postgresql/data 2>/dev/null)" ]; then
        sudo mkdir -p /var/lib/postgresql/data
        sudo chown postgres:postgres /var/lib/postgresql/data
        sudo su postgres -c "/usr/lib/postgresql/$pg_version/bin/initdb -D /var/lib/postgresql/data"
        log_info "PostgreSQL data directory initialized"
      fi
    else
      log_error "Cannot install PostgreSQL - apt-get not available"
      return 1
    fi
  fi

  # Start PostgreSQL if not running
  if ! pg_isready -q 2>/dev/null; then
    log_info "Starting PostgreSQL..."

    local pg_data="/var/lib/postgresql/data"
    local pg_log="/tmp/postgres.log"

    if [ -d "$pg_data" ] && [ -n "$(ls -A "$pg_data" 2>/dev/null)" ]; then
      local pg_ctl
      pg_ctl=$(find /usr/lib/postgresql -name pg_ctl 2>/dev/null | head -1 || echo "pg_ctl")

      # Ensure runtime directory exists
      sudo mkdir -p /run/postgresql 2>/dev/null || true
      sudo chown postgres:postgres /run/postgresql 2>/dev/null || true

      # Start server
      if ! sudo su postgres -c "$pg_ctl status -D $pg_data" 2>&1 | grep -q "server is running"; then
        sudo su postgres -c "$pg_ctl start -D $pg_data -l $pg_log -w" 2>&1 || {
          log_error "pg_ctl start failed"
          cat "$pg_log" 2>/dev/null || true
        }
      fi
    elif command -v pg_ctlcluster &> /dev/null; then
      # Debian/Ubuntu cluster management
      local cluster_info
      cluster_info=$(pg_lsclusters -h 2>/dev/null | head -1)
      if [ -n "$cluster_info" ]; then
        sudo pg_ctlcluster $(echo "$cluster_info" | awk '{print $1, $2}') start 2>/dev/null || true
      fi
    fi

    # Wait for PostgreSQL to be ready
    for i in {1..15}; do
      if pg_isready -q 2>/dev/null; then
        break
      fi
      log_info "Waiting for PostgreSQL... ($i/15)"
      sleep 1
    done
  fi
}

# Start PostgreSQL based on OS
case "$OS" in
  macos) start_postgres_macos ;;
  linux) start_postgres_linux ;;
  *) log_warn "Unknown OS, skipping PostgreSQL auto-start" ;;
esac

# Verify PostgreSQL is running
if pg_isready -q 2>/dev/null; then
  log_info "PostgreSQL is running"
else
  log_error "PostgreSQL failed to start"
  # Don't exit - let subsequent steps handle the failure gracefully
fi

# =============================================================================
# 3. Create PostgreSQL databases
# =============================================================================
if pg_isready -q 2>/dev/null; then
  echo ""
  echo "--- Setting up PostgreSQL databases ---"

  # Determine psql command based on OS
  PSQL_CMD="psql"
  if [ "$OS" = "linux" ]; then
    PSQL_CMD="sudo -u postgres psql"
  fi
  # On macOS, connect as current user (typically has superuser rights)

  # Create car_dealership database
  if ! $PSQL_CMD -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw car_dealership; then
    log_info "Creating car_dealership database..."
    if [ "$OS" = "linux" ]; then
      $PSQL_CMD -c "CREATE DATABASE car_dealership;" 2>/dev/null || true
    else
      createdb car_dealership 2>/dev/null || true
    fi
  else
    log_info "Database car_dealership already exists"
  fi

  # Create car_dealership_test database
  if ! $PSQL_CMD -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw car_dealership_test; then
    log_info "Creating car_dealership_test database..."
    if [ "$OS" = "linux" ]; then
      $PSQL_CMD -c "CREATE DATABASE car_dealership_test;" 2>/dev/null || true
    else
      createdb car_dealership_test 2>/dev/null || true
    fi
  else
    log_info "Database car_dealership_test already exists"
  fi

  # On Linux, ensure postgres user has a known password for app connections
  if [ "$OS" = "linux" ]; then
    $PSQL_CMD -c "ALTER USER postgres WITH PASSWORD 'postgres';" 2>/dev/null || true
  fi

  log_info "PostgreSQL database setup complete"
fi

# =============================================================================
# 4. Environment file setup
# =============================================================================
echo ""
echo "--- Environment Setup ---"

setup_env_file() {
  local env_example="$1"
  local env_file="$2"
  local db_name="$3"

  if [ ! -f "$env_file" ]; then
    if [ -f "$env_example" ]; then
      cp "$env_example" "$env_file"
      log_info "Created $env_file from example"

      # Update DB_NAME if specified
      if [ -n "$db_name" ]; then
        sed -i.bak "s/^DB_NAME=.*/DB_NAME=$db_name/" "$env_file" 2>/dev/null || \
          sed -i '' "s/^DB_NAME=.*/DB_NAME=$db_name/" "$env_file" 2>/dev/null || true
        rm -f "${env_file}.bak" 2>/dev/null || true
      fi

      # On macOS, use current user as DB_USER
      if [ "$OS" = "macos" ]; then
        sed -i.bak "s/^DB_USER=.*/DB_USER=$(whoami)/" "$env_file" 2>/dev/null || \
          sed -i '' "s/^DB_USER=.*/DB_USER=$(whoami)/" "$env_file" 2>/dev/null || true
        sed -i.bak "s/^DB_PASSWORD=.*/DB_PASSWORD=/" "$env_file" 2>/dev/null || \
          sed -i '' "s/^DB_PASSWORD=.*/DB_PASSWORD=/" "$env_file" 2>/dev/null || true
        rm -f "${env_file}.bak" 2>/dev/null || true
      fi
    else
      log_warn "No .env.example found at $env_example"
    fi
  else
    log_info "$env_file already exists"
  fi
}

# Setup backend .env
setup_env_file \
  "$PROJECT_ROOT/apps/backend/.env.example" \
  "$PROJECT_ROOT/apps/backend/.env" \
  "car_dealership"

# Setup frontend .env (if needed)
if [ -f "$PROJECT_ROOT/apps/frontend/.env.example" ]; then
  setup_env_file \
    "$PROJECT_ROOT/apps/frontend/.env.example" \
    "$PROJECT_ROOT/apps/frontend/.env" \
    ""
fi

# =============================================================================
# 5. Run migrations
# =============================================================================
echo ""
echo "--- Database Migrations ---"

if pg_isready -q 2>/dev/null; then
  log_info "Running migrations on car_dealership..."
  DB_NAME=car_dealership pnpm --filter @car-dealership/backend run migrate 2>&1 || \
    log_warn "Migration failed on car_dealership - may need manual intervention"

  log_info "Running migrations on car_dealership_test..."
  DB_NAME=car_dealership_test pnpm --filter @car-dealership/backend run migrate 2>&1 || \
    log_warn "Migration failed on car_dealership_test - may need manual intervention"
else
  log_warn "PostgreSQL not ready, skipping migrations"
fi

# =============================================================================
# 6. Install Playwright Chromium (only for E2E tests)
# =============================================================================
case "$AGENT_PROFILE_NAME" in
  implementation|respond-to-review|respond-to-ci|"")
    echo ""
    echo "--- Playwright Browser Setup ---"
    # Playwright is in the frontend package, so use pnpm exec
    if pnpm --filter @car-dealership/frontend exec playwright install chromium 2>&1; then
      log_info "Playwright Chromium installed"
    else
      log_warn "Playwright Chromium install failed - E2E tests may not work"
    fi
    ;;
  *)
    log_info "Skipping Playwright install (agent: $AGENT_PROFILE_NAME)"
    ;;
esac

# =============================================================================
# Summary
# =============================================================================
echo ""
echo "=== Car Dealership Setup Complete ==="
echo "OS: $OS"
echo "PostgreSQL: $(pg_isready 2>&1 || echo 'not running')"
echo "Node: $(node --version)"
echo "pnpm: $(pnpm --version)"
