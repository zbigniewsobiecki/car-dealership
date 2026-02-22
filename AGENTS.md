# Car Dealership — Agent Guide for Squint Exploration

This repository has a Squint codebase index (`.squint.db`) that provides structured access to the architecture. Agents should query Squint (via Bash tool with `--json`) to understand architecture rather than manually searching code. The index is kept in sync — never cache or hardcode results.

## How to Explore

All commands accept `--json` for structured output. Run from the repository root.

### Start Broad

```bash
# What does this codebase do? How big is it?
squint overview --json

# What are the product-level features?
squint features --json

# How many symbols, modules, interactions, flows?
squint stats --json
```

### Drill Into a Feature

Pick a feature slug from `squint features --json`, then:

```bash
squint features show <slug> --json
```

This returns the feature's flows, modules involved, and interactions. Pick a flow slug to drill deeper.

### Drill Into a Flow

```bash
squint flows show <slug> --json
```

This returns the entry point (with definition details), ordered interaction steps, modules involved, and the definition-level call trace. Each step references an interaction ID you can drill into.

### Drill Into Interactions and Modules

```bash
# A specific module-to-module interaction
squint interactions show <id> --json

# A module's members, interactions, flows, features
squint modules show <path> --json

# The full module tree
squint modules --tree
```

### Drill Into Symbols and Files

```bash
# Everything about a symbol: module, relationships, dependencies,
# dependents, interactions, flows, source code, call sites
squint symbols show <name> --json

# Disambiguate when multiple symbols share a name
squint symbols show <name> --file <path> --json
squint symbols show --id <id> --json

# Aggregate all data for every symbol in a file
squint symbols list --file <path> --json

# List symbols with filters
squint symbols --kind <kind> --json
squint symbols --file <path> --json

# File details: definitions, imports, imported-by
squint files show <path> --json
```

### Trace Relationships and Dependencies

```bash
# Annotated relationships between symbols
squint relationships --json

# A specific relationship with full context
squint relationships show --from-id <id> --to-id <id> --json

# Call graph trace from a symbol
squint flows trace --name <symbol> --json

# Inheritance trees
squint hierarchy --type extends
squint hierarchy --type implements
```

### Find Gaps

```bash
# Unannotated symbols, relationships, empty modules, unassigned symbols
squint gaps --json
```

## Decision Tree

| Question | Command |
|----------|---------|
| What does this codebase do? | `squint overview --json` |
| What are the product features? | `squint features --json` |
| How does feature X work? | `squint features show <slug> --json` |
| What happens in user journey Y? | `squint flows show <slug> --json` |
| What does module M do? | `squint modules show <path> --json` |
| How do modules A and B interact? | `squint interactions show <id> --json` |
| What does symbol S do and who uses it? | `squint symbols show <name> --json` |
| What's in this file and how does it connect? | `squint symbols list --file <path> --json` |
| What does this symbol depend on? | `squint symbols show <name> --json` (check `dependencies`) |
| What depends on this symbol? | `squint symbols show <name> --json` (check `dependents`, `callSites`) |
| Which interactions involve this symbol? | `squint symbols show <name> --json` (check `interactions`) |
| What's missing or incomplete? | `squint gaps --json` |

## Tips

- Always use `--json` when processing output programmatically.
- Start from the top (overview/features) and drill down. Don't jump straight to symbol-level queries without context.
- `squint symbols list --file <path> --json` is the most efficient way to understand a file's full architectural role.
- When a symbol name is ambiguous, the error message lists all matches with IDs and file paths. Use `--id` or `--file` to disambiguate.
- Interaction IDs appear in `flows show` output (each step references one). Use them to drill into `interactions show`.
- Don't cache or hardcode Squint results — always query live. The index is rebuilt as the codebase evolves.
