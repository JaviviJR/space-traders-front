# Working agreements

How the user works with Claude on this project. Applies to every session.

Each `custom:<id>` block below is an optional customization. What it changes,
why it exists and what it depends on is in
`doc/spec-kit-implementation/GUIDE.md` → Catalog. To drop one, delete its
block here and in every other file the catalog lists for it.

## Spec-kit features

- Features are built with spec-kit. Each one goes through `/speckit-specify`,
  `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks` and `/speckit-analyze`,
  each reviewed by the user before the next. Its artifacts live in
  `specs/<NNN-feature>/`.
- Spec-kit's behaviour is changed only through the mechanisms spec-kit
  provides (template overrides in `.specify/templates/overrides/`, presets,
  integration options, `.specify/extensions.yml`). Files it generates
  (`.claude/skills/speckit-*`, `.specify/templates/*.md`,
  `.specify/scripts/`) are never edited by hand, so an upgrade never undoes a
  project change.
- Claude never runs the spec-kit CLI. The user runs it from the repo root
  with
  `uvx --from git+https://github.com/github/spec-kit.git@v<version> specify …`,
  where `<version>` is the one in `.specify/integration.json`, so a command
  like `integration upgrade` doesn't silently pull newer templates and skills.
  Upgrading spec-kit means raising that version on purpose.
- Deviations from spec-kit: when a project rule makes Claude depart from what
  a `speckit-*` skill says (skip, replace, add or reorder a step), say so at
  that moment. If a written rule already resolves it, one line naming the
  skill step, the project rule and which one is followed. If not, follow
  AGENTS.md → Conflicts between sources and wait for the user's answer before
  acting.

<!-- custom:dual-research -->
### dual-research

Why: compare what the project's rules change against spec-kit's default.

- Each `/speckit-plan` writes the same decisions twice in
  `specs/<NNN-feature>/`:
  - `research.md`: as spec-kit writes it, untouched, with its scope
    (`NEEDS CLARIFICATION` items, dependencies, integrations) and its
    `Decision` / `Rationale` / `Alternatives considered` format. The
    `speckit-*` skills read this one, since the scripts look it up by name.
  - `research.workflow.md`: applying AGENTS.md and these working agreements.
    It also includes the spec's closed decisions with their rejected
    alternatives; each `Rationale` cites the official docs, and only when the
    docs and issues don't settle it, the installed source file it rests on,
    labelled as a code-derived inference and flagged when the decision is
    presented in chat.
<!-- custom:record-decisions -->
    Each decision says where else it gets recorded (a comment in the file or
    a `doc/*.md`).
<!-- /custom:record-decisions -->
    `/feature-session` uses this one.

  Revisit when the user says the comparison no longer adds anything; then
  decide whether existing `research.md` files are deleted or kept.
<!-- /custom:dual-research -->

<!-- custom:sessions -->
### sessions

Why: one developer reviewing each step; each session starts from the
feature's artifacts, not from a long chat history.

- `/speckit-tasks` groups tasks by user story (each story touches every layer
  it needs), not by layer, and ends with a "Sessions" table (from
  `.specify/templates/overrides/tasks-template.md`) whose "Command" column
  holds the exact `/feature-session` line to paste for each row.
- Implementation: one new Claude Code conversation per row of that table,
  started with `/feature-session <feature dir> <session id>`. The context
  comes from the feature's artifacts, not from chat history. Progress is the
  `[X]` marks in `tasks.md`.
- Closing a session: apply the changes, run the session's checks and mark its
  tasks `[X]`, then stop and wait for the user's review. If they ask for
  changes, apply them and wait again; once they say it's all OK, Claude makes
  the session's commit.
- Commits: the user commits, except at the close of a `/feature-session`.
  Outside it, Claude doesn't ask whether to commit. The session commit puts
  the session in the subject, to read at a glance in `git log --oneline`, and
  as trailers, to query with `git log --format='%(trailers:key=Session)'`:

  ```
  <type>(<NNN-feature>): <session id> <summary>

  <optional body: what else the session touched>

  Session: <NNN-feature> <session id>
  Tasks: <task IDs>
  ```

  `<type>` is the Conventional Commits type of the main change. The feature
  goes in the scope because the spec defines it as a section of the codebase;
  a session isn't one, so it goes in the description.
- `/speckit-converge` (optional, once every session is done): the
  `/feature-session` sessions count as the `/speckit-implement` run it
  requires. If it appends a `## Phase N: Convergence`, Claude ends that same
  section with its own `### Sessions` table, numbered after the last session
  and following the template's columns (including "Command") and its grouping
  and "Close" rules, instead of adding rows to the existing table (converge
  only appends). The handoff is `/feature-session`, never
  `/speckit-implement`.
- Never run `/speckit-implement`: it runs every phase in one go and creates or
  rewrites ignore files (`.gitignore`, `.prettierignore`, linter ignores, a
  `.dockerignore` when a Dockerfile exists).
- Every core `speckit-*` skill is user-invocable only: the Claude
  integration's `--no-model-invocation` option, stored in
  `.specify/integration.json` and re-applied by every
  `specify integration upgrade claude`, writes `disable-model-invocation: true`
  into them. That way Claude can't launch `/speckit-implement` on its own
  (e.g. when `speckit-analyze` or `speckit-converge` suggest it), and their
  descriptions stay out of every session's context. Check it again when (see
  the [Claude integration docs](https://github.github.io/spec-kit/integrations/claude.html)):
  - a preset is installed, removed or updated: it resets the affected skills;
    re-apply with `specify integration upgrade claude --force`;
  - an upgrade passes `--integration-options`: it replaces the stored ones,
    so repeat `--no-model-invocation`;
  - an extension's mandatory hook runs a core command: the option breaks that
    hook and has to be dropped.
<!-- /custom:sessions -->

## Working with Claude

<!-- custom:options -->
### options

Why: the user picks knowing what each choice costs, in chat and in every
spec-kit phase that decides something.

- When a decision has several viable approaches, explain each one before the
  user picks: what it does, and what the official docs recommend about it
  (check them first) — or say explicitly that they have no stance and it's a
  project decision.
- In each option, compare the resulting code: which is simpler and which adds
  complexity that may be unnecessary (extra state, coordination, files
  touched). Say under which condition another option would win.
- When an option clashes with a project rule: rules are defaults, not dogma;
  say under which condition breaking it would pay off on simplicity grounds.
- End with a recommendation.
- Decisions go one at a time: present one, wait for the user's answer, then
  the next.
- `/speckit-clarify` questions: a question follows these rules before the
  skill's table when one of its options contradicts or relies on a rule in
  AGENTS.md, a `doc/*.md` or a closed decision (e.g. the spec's Assumptions),
  or when it changes something hard to undo: an external contract, the flow
  the user sees, or state that persists. Other questions keep the skill's
  format. The table, `**Recommended:**`, answering by letter, the limit of 5
  questions and writing `spec.md` after each answer stay as the skill says.
- `/speckit-plan` decisions: before writing the research, present in chat
  each decision that has several viable approaches, following these rules.
  The research then records the closed decisions.
- Conflicts during `/speckit-plan` (a requirement that contradicts a
  `doc/*.md` rule, AGENTS.md, a closed decision or a constitution gate):
  present it following these rules with three routes, and the user picks one:
  1. Change the spec: it goes back through `/speckit-clarify`, which records
     it in Clarifications, then `/speckit-plan` resumes. The plan never edits
     `spec.md`.
  2. Change the project rule (`doc/*.md` or AGENTS.md): a separate doc
     change, reviewed on its own, then the plan goes on.
  3. Keep the exception: the plan justifies it in "Complexity Tracking", as
     the constitution requires, and goes on.
<!-- /custom:options -->

<!-- custom:learning-mode -->
### learning-mode

Why: the user is using this project to learn <<FILL: what the user is learning, e.g. the framework>>.

- Explain every change didactically, as if it were a guided exercise: what
  it does and which concepts of <<FILL: framework or language>> it involves.
  When code makes the explanation clearer, show it — a snippet from a file, a
  diff, or a minimal example of a concept — alongside the explanation, never
  instead of it. List every file affected; the user reviews the actual change
  in the permission prompt or with `git diff`.
- Design rationale: for a structural change, split the explanation in two:
  what the change does (functional effect) and why this design specifically —
  what coupling, responsibility or extensibility problem it solves, or which
  principle it applies, and why a simpler alternative wasn't enough. A
  structural explanation without the second part is incomplete.
  - Structural: a new or changed interface (a component's inputs/outputs, a
    module's public API, an exported function's signature), a design pattern
    introduced, logic moved between layers, or a file or module created or
    extracted.
  - Anything else (a local rename, extracting a function within the same
    file, a typo, a stale reference): the functional effect in one line,
    naming the rule applied.
- When a decision comes from an installed skill, say which skill and why it
  recommends it.
- Invite questions, answer them, and apply the change only once the user says
  they have no more doubts.
- Known concepts: the ones listed below are concepts the user already knows:
  name them without explaining them. Exception: when one shows up in a way
  the user hasn't seen yet (a new use, option or interaction with another
  API), explain only that new part. When the user says they already know a
  concept, propose adding it here; if they say they've forgotten one, propose
  removing it.
  - <<FILL: known concepts, one per line; may start empty>>
<!-- /custom:learning-mode -->

<!-- custom:preferences -->
### preferences

Each bullet is independent: delete the ones that don't apply.

- Language: chat with the user in <<FILL: chat language>>. Project
  documentation (`doc/*.md`, `AGENTS.md`) and the constitution in
  <<FILL: documentation language>>. Feature artifacts (`specs/**`) in
  <<FILL: artifacts language; spec-kit generates English by default>>.
- User-run commands: never run <<FILL: which commands, e.g. package installs (package managers, editor extensions)>>,
  even when the permission mode would allow it. Give the exact commands as
  one copy-paste block, with a short note on what each does and a link to the
  official docs, wait for the user to run them, then verify the result by
  reading files.
- Commits carry no `Co-Authored-By` trailer or any other AI attribution line,
  whatever Claude Code's default says.
- Subagent model, picked by how much judgment the task needs:
  - Cheap model: the task has a closed, verifiable outcome and no design
    decisions — searching for a file/symbol, reading and summarizing a log
    or long file, running a command and reporting its output, mechanical
    multi-file edits (rename, reformat), checking whether something exists.
  - Default/stronger model: the task requires architecture or design choices,
    debugging with a non-obvious cause, reviewing code for subtle bugs,
    writing real business logic, or touches anything hard to undo where a
    near-correct answer could lead to a costly wrong decision.
  - Rule of thumb: if the expected result can be stated as one closed,
    checkable sentence, the cheap model is enough; if the subagent has to
    resolve ambiguity or make a design call, use the default model.
<!-- /custom:preferences -->
