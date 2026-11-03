# Space Trader Front Constitution

## Core Principles

Each principle is a gate that `/speckit-plan`'s "Constitution Check" MUST
verify. The rule's text and its rationale live in the linked document; if they
change there, this constitution stays untouched.

### I. Layers with one-way dependencies

The plan respects the layers and their dependency rules.
Source: `doc/architecture.md` (Layers, Rules per layer).

### II. The back's contract is the single source of truth

The front consumes the back's OpenAPI contract: types, errors and mocks come
from the generated types, nothing is invented or hand-edited, and `error.code`
is handled as an open set. Source: `doc/architecture.md` (api/, Back) and
`doc/testing.md`.

### III. The smallest structure that satisfies SOLID

Each new piece of state, composable or store is justified against a smaller
option. Source: `doc/conventions.md` (Design principles) and `AGENTS.md`
(Ask before generating).

### IV. Tested the way the user would use it (NON-NEGOTIABLE)

The plan's "Testing" section names, for each change, the test that covers it
and its type (unit, component or e2e), and the feature has at least one test
that exercises it the way a user would; when an e2e test doesn't apply, it
says why. Source: `doc/testing.md` and `doc/workflow.md` (Proposals).

### V. Quality checked by tools, without silencing errors

Lint, format and type-check clean, with no new suppression (type checker,
lint or format) unless the user approved it and the plan justifies it in
"Complexity Tracking". Source: `AGENTS.md` (Code style, Static analysis).

### VI. Framework and installed libraries before own code

Each mechanism the plan picks is the one Vue or an installed library
provides, checked against the docs of the installed version; own code instead
is justified. Source: `AGENTS.md` (Discover, don't guess),
`doc/dependencies.md` and `doc/conventions.md`.

## Additional Constraints

Stack, libraries, styling and research order: `AGENTS.md`,
`doc/dependencies.md`, `doc/conventions.md` and `doc/ui.md`.

## Development Workflow

Proposals, learning mode, decisions and installs: `doc/workflow.md`.
Recording decisions: `AGENTS.md` (Where documentation lives).

## Governance

- `AGENTS.md` and `doc/*.md` are the source of truth. This constitution only
  lists the plan's gates and doesn't repeat their text, so it can't drift out
  of sync.
- If this constitution disagrees with `AGENTS.md`, `doc/*.md` or a skill, the
  user MUST be warned before acting, quoting both sources.
- Amendments: proposed to the user and applied only with their approval. It
  changes only when a gate is added, removed or redefined, not when a linked
  document's detail changes.
- Semantic versioning: MAJOR when a gate is removed or redefined; MINOR when
  one is added; PATCH for wording.
- Compliance: a violation in the plan is accepted only when justified in its
  "Complexity Tracking" section.

**Version**: 3.0.0 | **Ratified**: 2026-10-30 | **Last Amended**: 2026-11-03
