#!/bin/bash
# Post-edit verification suite for CASCADE agent
# Runs diagnostics and/or tests based on scope argument
#
# Usage: .cascade/on-verify.sh <scope>
#   scope: diagnostics | tests | full (default: full)
#
# Exit codes:
#   0  - All checks passed
#   1  - Lint errors found
#   2  - Type errors found
#   3  - Both lint and type errors found
#   4  - Test failures
#   5  - Multiple failure types (diagnostics + tests)

set -uo pipefail

SCOPE="${1:-full}"

# Get the project root (where this script lives)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

LINT_EXIT=0
TYPE_EXIT=0
TEST_EXIT=0
LINT_OUTPUT=""
TYPE_OUTPUT=""
TEST_OUTPUT=""

# --- Diagnostics: Lint + Type Check (turbo-orchestrated across all workspaces) ---
if [ "$SCOPE" = "diagnostics" ] || [ "$SCOPE" = "full" ]; then
  # Lint across all workspaces via turbo
  LINT_OUTPUT=$(pnpm run lint 2>&1)
  LINT_EXIT=$?

  # Type check across all workspaces via turbo
  TYPE_OUTPUT=$(pnpm run type-check 2>&1)
  TYPE_EXIT=$?
fi

# --- Tests: Unit tests (integration tests require PostgreSQL, opt-in via env var) ---
if [ "$SCOPE" = "tests" ] || [ "$SCOPE" = "full" ]; then
  # Run unit tests across all workspaces
  TEST_OUTPUT=$(pnpm run test:unit 2>&1)
  TEST_EXIT=$?

  # Integration tests only if RUN_INTEGRATION_TESTS=1 (requires PostgreSQL)
  if [ "${RUN_INTEGRATION_TESTS:-0}" = "1" ]; then
    # Ensure PostgreSQL is running
    if [ -f "$SCRIPT_DIR/ensure-services.sh" ]; then
      "$SCRIPT_DIR/ensure-services.sh" 2>&1
    fi

    INTEGRATION_OUTPUT=$(pnpm run test:integration 2>&1)
    INTEGRATION_EXIT=$?

    if [ $INTEGRATION_EXIT -ne 0 ]; then
      TEST_OUTPUT="$TEST_OUTPUT"$'\n'"=== Integration Tests ==="$'\n'"$INTEGRATION_OUTPUT"
      TEST_EXIT=$INTEGRATION_EXIT
    fi
  fi
fi

# --- Output results ---
HAS_ERRORS=false

if [ $LINT_EXIT -ne 0 ]; then
  HAS_ERRORS=true
  echo "=== ESLint ==="
  echo "$LINT_OUTPUT"
  echo ""
fi

if [ $TYPE_EXIT -ne 0 ]; then
  HAS_ERRORS=true
  echo "=== TypeScript ==="
  echo "$TYPE_OUTPUT"
  echo ""
fi

if [ $TEST_EXIT -ne 0 ]; then
  HAS_ERRORS=true
  echo "=== Tests ==="
  echo "$TEST_OUTPUT"
  echo ""
fi

if [ "$HAS_ERRORS" = false ]; then
  echo "All checks passed."
fi

# --- Determine final exit code ---
DIAG_FAILED=false
if [ $LINT_EXIT -ne 0 ] || [ $TYPE_EXIT -ne 0 ]; then
  DIAG_FAILED=true
fi

if [ "$DIAG_FAILED" = true ] && [ $TEST_EXIT -ne 0 ]; then
  exit 5
elif [ $LINT_EXIT -ne 0 ] && [ $TYPE_EXIT -ne 0 ]; then
  exit 3
elif [ $LINT_EXIT -ne 0 ]; then
  exit 1
elif [ $TYPE_EXIT -ne 0 ]; then
  exit 2
elif [ $TEST_EXIT -ne 0 ]; then
  exit 4
else
  exit 0
fi
