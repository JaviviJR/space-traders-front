## Dual research (experimental)

Why: compare what the project's rules change against spec-kit's default.

- Write the same decisions twice in the feature directory:
  - `research.md`: as described above, untouched, with its scope
    (`NEEDS CLARIFICATION` items, dependencies, integrations) and its
    `Decision` / `Rationale` / `Alternatives considered` format. The other
    `speckit-*` commands read this one.
  - `research.workflow.md`: applying `AGENTS.md` and `doc/workflow.md`. It
    also includes the spec's closed decisions with their rejected
    alternatives; each `Rationale` cites the official docs, and only when the
    docs and issues don't settle it, the installed source file it rests on,
    labelled as a code-derived inference and flagged when the decision is
    presented in chat.
- Revisit when the user says the comparison no longer adds anything; then
  remove this preset and decide whether existing `research.workflow.md` files
  are deleted or kept.
