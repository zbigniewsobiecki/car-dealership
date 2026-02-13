# Car Dealership — Claude Code Project Guide

## Project Structure

TypeScript monorepo (pnpm workspaces + Turborepo):

- `apps/backend/` — Express API server
- `apps/frontend/` — Frontend application
- `packages/shared-types/` — Shared DTOs, enums, interfaces

## Squint Codebase Index

This repository has a Squint index at `.squint.db`. Use it to understand architecture before reading source code. The index is kept in sync with the codebase — always query it rather than relying on hardcoded facts about the architecture.

### Exploration Strategy

Follow a top-down drill-down. Start broad, then narrow based on what you find:

1. `squint overview --json` — get stats, features, module tree, file tree
2. `squint features show <slug> --json` — pick a feature from the overview, see its flows, modules, interactions
3. `squint flows show <slug> --json` — pick a flow, see entry point, ordered interaction steps, definition trace
4. `squint interactions show <id> --json` — drill into a specific module-to-module interaction
5. `squint modules show <path> --json` — see a module's members, interactions, flows
6. `squint symbols show <name> --json` — see a symbol's module, relationships, dependencies, interactions, source code, call sites
7. `squint symbols show --file <path> --json` — aggregate all data across every symbol in a file

### When to Use Squint vs. Reading Code

- **Understanding what a module does** — `squint modules show` is faster than scanning files
- **Finding how two parts of the system connect** — `squint interactions list --json` or drill into a flow
- **Understanding a symbol's role** — `squint symbols show` gives module context, relationships, interactions, and flows in one call
- **Understanding a file's responsibilities** — `squint symbols show --file` aggregates relationships, interactions, and flows for all symbols in the file
- **Tracing a user journey** — `squint flows show` gives the ordered interaction chain
- **Checking what calls what** — `squint symbols show` includes dependencies, dependents, and call sites with source context

All commands default to `.squint.db` in the current directory. If running from a subdirectory, pass `-d <path-to-repo>/.squint.db`.
