<!--
  Project override of the core .specify/templates/plan-template.md (spec-kit resolves
  .specify/templates/overrides/ first, and upgrades only replace the core file, so compare
  both after an upgrade). Each change is wrapped in custom:<id> markers; the ids are
  described in doc/spec-kit-implementation/GUIDE.md → Catalog.
  Do not copy this comment or any custom:* marker into the generated plan.md.
-->

# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]

**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]

**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]

**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]

**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]

**Project Type**: [e.g., library/cli/web-service/mobile-app/compiler/desktop-app or NEEDS CLARIFICATION]

**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]

**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]

**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
<!-- custom:dual-research -->
├── research.workflow.md # Phase 0 output, project rules applied
<!-- /custom:dual-research -->
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

<!-- custom:tests-required -->
## Testing

<!--
  ACTION REQUIRED: One row per change in this plan, naming the test that covers it
  the way its caller would use it; the feature as a whole needs at least one test the
  way a user would use it (the constitution's testing gate, if any). Type is one of:
  <<FILL: the project's test types, one line each: name, what it exercises, tool. E.g. "- unit: a function or module through its public API (<test runner>)" and "- e2e: a user journey (<e2e tool>); when none applies, say why">>
  /speckit-tasks turns each row into a test task.
-->

| Change | Test (path) | Type | Why this type |
|--------|-------------|------|---------------|
| [e.g., <<FILL: a change in this project>>] | [e.g., <<FILL: its test file>> (new)] | [unit] | [why this type fits how the change is called] |

<!-- /custom:tests-required -->
<!-- custom:sessions -->
<!--
  /speckit-tasks copies the close checks below into the "Close" column of its Sessions table.
-->

**Session close checks**: <<FILL: the commands that end every session, e.g. lint, format, type-check, unit tests>>; plus <<FILL: the end-to-end commands, or remove this clause>> in sessions that add or change an e2e test or touch code an e2e test covers, and always in the feature's last session.
<!-- /custom:sessions -->

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
