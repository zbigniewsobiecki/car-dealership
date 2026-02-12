#!/bin/bash
set -e

echo "=== Car Dealership Project Setup for CASCADE ==="
echo "Agent profile: ${AGENT_PROFILE_NAME:-not set}"

# =============================================================================
# 0. Install Dependencies (only for implementation and respond-to-review agents)
# =============================================================================
if [ "$AGENT_PROFILE_NAME" = "implementation" ] || [ "$AGENT_PROFILE_NAME" = "respond-to-review" ]; then
  echo ""
  echo "--- Installing Dependencies ---"
  CI=true PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 pnpm install
  echo "Dependencies installed"
else
  echo ""
  echo "--- Skipping dependency installation (agent: ${AGENT_PROFILE_NAME:-unknown}) ---"
fi

# =============================================================================
# 1. PostgreSQL - Install if needed, then start
# =============================================================================
echo ""
echo "--- PostgreSQL Setup ---"

# Check if PostgreSQL SERVER is installed (not just client)
PG_CTL_PATH=$(find /usr/lib/postgresql -name pg_ctl 2>/dev/null | head -1)
if [ -z "$PG_CTL_PATH" ]; then
  echo "PostgreSQL server not found, installing..."
  if command -v apt-get &> /dev/null; then
    apt-get update && apt-get install -y postgresql postgresql-client
    PG_VERSION=$(ls /usr/lib/postgresql/ | sort -V | tail -1)
    echo "Installed PostgreSQL version: $PG_VERSION"
    mkdir -p /var/lib/postgresql/data
    chown postgres:postgres /var/lib/postgresql/data
    su postgres -c "/usr/lib/postgresql/$PG_VERSION/bin/initdb -D /var/lib/postgresql/data"
    echo "PostgreSQL data directory initialized"
  elif command -v brew &> /dev/null; then
    brew install postgresql@14
  else
    echo "ERROR: Cannot install PostgreSQL - no supported package manager"
    exit 1
  fi
fi

# Start PostgreSQL if not running
if ! pg_isready -q 2>/dev/null; then
  echo "Starting PostgreSQL..."

  if [ -d /var/lib/postgresql/data ] && [ "$(ls -A /var/lib/postgresql/data 2>/dev/null)" ]; then
    PG_DATA="/var/lib/postgresql/data"
    PG_LOG="/tmp/postgres.log"
    echo "Found PostgreSQL data directory: $PG_DATA"

    PG_CTL=$(find /usr/lib/postgresql -name pg_ctl 2>/dev/null | head -1)
    if [ -z "$PG_CTL" ]; then
      PG_CTL="pg_ctl"
    fi
    echo "Using pg_ctl: $PG_CTL"

    mkdir -p /run/postgresql 2>/dev/null || true
    chown postgres:postgres /run/postgresql 2>/dev/null || true
    echo "Runtime directory /run/postgresql ready"

    if su postgres -c "$PG_CTL status -D $PG_DATA" 2>&1 | grep -q "server is running"; then
      echo "PostgreSQL already running"
    else
      echo "Starting PostgreSQL with pg_ctl..."
      if su postgres -c "$PG_CTL start -D $PG_DATA -l $PG_LOG -w" 2>&1; then
        echo "PostgreSQL started successfully"
      else
        echo "pg_ctl start failed with exit code $?"
        echo "PostgreSQL log contents:"
        cat $PG_LOG 2>/dev/null || echo "No log file found"
        echo "Data directory contents:"
        ls -la $PG_DATA 2>/dev/null | head -10
      fi
    fi
  elif command -v brew &> /dev/null; then
    brew services start postgresql@14 2>/dev/null || brew services start postgresql 2>/dev/null || true
  elif command -v pg_ctlcluster &> /dev/null; then
    pg_ctlcluster $(pg_lsclusters -h | head -1 | awk '{print $1, $2}') start 2>/dev/null || true
  elif command -v pg_ctl &> /dev/null; then
    su postgres -c "pg_ctl start -D /var/lib/postgresql/data -l /tmp/postgres.log" 2>/dev/null || true
  fi

  # Wait for PostgreSQL to be ready
  for i in {1..10}; do
    if pg_isready -q 2>/dev/null; then
      break
    fi
    echo "Waiting for PostgreSQL... ($i/10)"
    sleep 1
  done
fi

if pg_isready -q 2>/dev/null; then
  echo "PostgreSQL is running"
else
  echo "WARNING: PostgreSQL failed to start"
fi

# =============================================================================
# 2. Create PostgreSQL databases and user
# =============================================================================
if pg_isready -q 2>/dev/null; then
  echo "Setting up PostgreSQL databases..."

  # Create car_dealership database
  if ! psql -U postgres -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw car_dealership; then
    echo "Creating car_dealership database..."
    psql -U postgres -c "CREATE DATABASE car_dealership;" 2>/dev/null || true
  else
    echo "Database car_dealership already exists"
  fi

  # Create car_dealership_test database
  if ! psql -U postgres -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw car_dealership_test; then
    echo "Creating car_dealership_test database..."
    psql -U postgres -c "CREATE DATABASE car_dealership_test;" 2>/dev/null || true
  else
    echo "Database car_dealership_test already exists"
  fi

  echo "PostgreSQL database setup complete"
fi

# =============================================================================
# 3. Run migrations
# =============================================================================
echo ""
echo "--- Database Migrations ---"

if pg_isready -q 2>/dev/null; then
  echo "Running migrations on car_dealership..."
  DB_NAME=car_dealership pnpm --filter @car-dealership/backend run migrate 2>&1 || echo "Migration failed on car_dealership - may need manual intervention"

  echo "Running migrations on car_dealership_test..."
  DB_NAME=car_dealership_test pnpm --filter @car-dealership/backend run migrate 2>&1 || echo "Migration failed on car_dealership_test - may need manual intervention"
else
  echo "PostgreSQL not ready, skipping migrations"
fi

# =============================================================================
# 4. Install Playwright Chromium (for E2E tests)
# =============================================================================
echo ""
echo "--- Playwright Browser Setup ---"

if npx playwright install chromium; then
  echo "Playwright Chromium installed"
else
  echo "WARNING: Playwright Chromium install failed - E2E tests may not work"
fi

# =============================================================================
# Summary
# =============================================================================
echo ""
echo "=== Car Dealership Setup Complete ==="
echo "PostgreSQL: $(pg_isready 2>&1 || echo 'not running')"
