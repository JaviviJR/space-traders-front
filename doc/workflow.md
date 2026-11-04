# Working agreements

How the user works with Claude on this project. Applies to every session.

## Confirmations

- Ask for explicit confirmation before writing any file or running any
  command that changes state, whether or not the file is tracked by git.
  Answering an options question is not approval, and approving one change
  doesn't cover the next.
- Related changes may be grouped into one proposal, provided each change is
  listed explicitly so the approval covers each one.

## Learning mode

- The user is using this project to learn Vue.js while building it with
  Claude. This extends the "Proposals" section below, not a replacement for
  it.
- When proposing a change to project files (Vue components, tests, config,
  Docker), explain it didactically, as if it were a guided exercise: what the
  change does and which Vue concepts it involves (e.g. `ref` vs `reactive`,
  props, emits, Pinia stores, routes), in prose, without pasting the code
  itself.
- When a decision comes from an installed skill, say which skill and why it
  recommends it.
- Invite questions, answer them, and apply the change only once the user says
  they have no more doubts.

### Options

- When a decision has several viable approaches, explain each one
  didactically before the user picks (the user had no prior
  JavaScript/TypeScript/Vue experience, so bare option labels aren't enough):
  what it does, and what the official docs recommend about it (check them
  first) — or say explicitly that they have no stance and it's a project
  decision.
- In each option or rule, compare the resulting code: which is simpler and
  which adds complexity that may be unnecessary (extra state, coordination,
  files touched). Rules are defaults, not dogma: state the condition that
  overrides one on simplicity grounds, or under which another option would
  win.
- End with a recommendation.

### Known concepts

- The concepts listed below are ones the user already knows: name them
  without explaining them. Exception: when one shows up in a way the user
  hasn't seen yet (a new use, option or interaction with another API),
  explain only that new part.
- When the user says they already know a concept, propose adding it here;
  if they say they've forgotten one, propose removing it.
- List:
  - `ref`
  - `computed`
  - `v-if` / `v-else / v-else-if`
  - A composable returning functions the component uses as event handlers
  - `readonly` on a composable's returned state

## Proposals

- File changes: never show a diff or pasted content in chat, regardless of
  whether it's a new file, a small edit or a large rewrite. Explain what
  changed and why, listing every file affected, so the user knows what to
  review. The user reviews the actual change with `git diff` in VSCode.
- Design rationale: for a structural change, split the explanation in two:
  what the change does (functional effect) and why this design specifically —
  what coupling, responsibility or extensibility problem it solves, or which
  principle it applies, and why a simpler alternative wasn't enough. A
  structural proposal without the second part is incomplete.
  - Structural: a new or changed interface (props, emits, a composable's or
    store's public API, an exported function's signature), a design pattern
    introduced, logic moved between layers, or a file, component or
    composable created or extracted.
  - Anything else (a local rename, extracting a method within the same file,
    a typo, a stale reference): the functional effect in one line, naming the
    rule applied.
- When a decision is closed, record it as
  [AGENTS.md → Where documentation lives](../AGENTS.md#where-documentation-lives)
  says, and reply with a one-line summary.
- Testing: every proposal — the initial one or a later split into sequential
  blocks — must say what will be tested and how: which unit test(s)
  (new or updated, with file path) cover the change, and whether an e2e test
  applies (per [testing.md](testing.md)) or doesn't and why. State this
  alongside the files-affected list, not as an afterthought once the change
  is already applied.

## Steps and installs

- Design decisions: one at a time, each following "Options".
- Installation and setup steps: give the commands as one copy-paste block,
  with a short note on what each does and a link to the official docs. The
  user runs them.
- Never run package installs (npm, editor extensions). Give the exact
  command and wait for the result, then verify it by reading files.
- When asked to split a plan into sequential blocks, reorder the explanations
  already given as-is into blocks — don't compress or re-summarize them into
  shorter bullets. The block order must follow a real dependency (install
  before code, model before service); if the plan has none (independent
  blocks, a circular dependency, a block needing decisions from later ones),
  say so and propose how to resolve it instead of forcing an order.

## Commits

- The user commits, except at the close of a `/feature-session` (see
  "Spec-kit features"). Outside it, Claude doesn't ask whether to commit.
- Commits carry no `Co-Authored-By` trailer or any other AI attribution line,
  whatever Claude Code's default says.

## Spec-kit features

- Features are built with spec-kit. Each one goes through `/speckit-specify`,
  `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks` and `/speckit-analyze`,
  each reviewed by the user before the next. Its artifacts live in
  `specs/<NNN-feature>/`.
- Invoking a `/speckit-*` skill authorizes writing that phase's artifacts in
  `specs/<NNN-feature>/` and `.specify/feature.json` without asking; the user
  reviews them with `git diff` before the next phase. Any other file the skill
  would touch (code, `doc/`, templates, the constitution) still needs
  confirmation.
- `/speckit-clarify` questions: a question follows "Options" before the
  skill's table when an option contradicts or relies on a rule in AGENTS.md, a
  `doc/*.md` or a closed decision (e.g. the spec's Assumptions); picks a
  component or mechanism (framework feature vs own code, a library); or
  changes:
  - the contract with the back: endpoints used or changed, what is sent, how
    each `error.code` is handled;
  - routes and URLs: new or changed routes, query params, redirects, guards;
  - the visible flow: which screens, dialogs or steps the user sees, and in
    which order;
  - state persisted on the client (localStorage, sessionStorage, cookies).

  This replaces the skill's one-line-per-option format for those questions.
  Pure-behaviour questions (a value, a duration, a text, an on/off) keep the
  skill's format; when in doubt, use the full one. The table,
  `**Recommended:**`, answering by letter, the 5-question limit and writing
  `spec.md` after each answer stay as the skill says.
- `/speckit-plan` decisions: before writing the research files, present in
  chat each decision that has several viable approaches, following "Options",
  one at a time, waiting for the user's answer. The research files then
  record the closed decisions.
- Conflicts during `/speckit-plan` (a requirement that contradicts a
  `doc/*.md` rule, AGENTS.md, a closed decision or a constitution gate):
  present it following "Options" with three routes, and the user picks one:
  1. Change the spec: it goes back through `/speckit-clarify`, which records
     it in Clarifications, then `/speckit-plan` resumes. The plan never edits
     `spec.md`.
  2. Change the project rule (`doc/*.md` or AGENTS.md): a doc change with its
     own confirmation, then the plan goes on.
  3. Keep the exception: the plan justifies it in "Complexity Tracking", as
     the constitution requires, and goes on.
- Two research files: each `/speckit-plan` writes the same decisions twice in
  `specs/<NNN-feature>/`, to compare what the project's rules change against
  spec-kit's default:
  - `research.md`: as spec-kit writes it, untouched, with its scope
    (`NEEDS CLARIFICATION` items, dependencies, integrations) and its
    `Decision` / `Rationale` / `Alternatives considered` format. The
    `speckit-*` skills read this one, since the scripts look it up by name.
  - `research.workflow.md`: applying AGENTS.md and these working agreements.
    It also includes the spec's closed decisions with their rejected
    alternatives; each `Rationale` cites the official docs, and only when the
    docs and issues don't settle it (per
    [dependencies.md](dependencies.md)), the installed source file it rests
    on (`node_modules/…`), labelled as a code-derived inference and flagged
    when the decision is presented in chat; and each decision says where else
    it gets recorded (docblock/comment or `doc/*.md`). `/feature-session` and
    AGENTS.md use this one.

  Revisit when the user says the comparison no longer adds anything; then
  decide whether existing `research.md` files are deleted or kept.
- Deviations from spec-kit: when a project rule makes Claude depart from what
  a `speckit-*` skill says (skip, replace, add or reorder a step), say so at
  that moment. If a written rule already resolves it, one line naming the
  skill step, the project rule and which one is followed. If not, follow
  [AGENTS.md → Conflicts between sources](../AGENTS.md#conflicts-between-sources)
  and wait for the user's answer before acting.
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
- Session commit message: the session in the subject, to read at a glance in
  `git log --oneline`, and as trailers, to query with
  `git log --format='%(trailers:key=Session)'`:

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
  and "Close" rules, instead of adding
  rows to the existing table (converge only appends). The handoff is
  `/feature-session`, never `/speckit-implement`.
- Never run `/speckit-implement`: it runs every phase in one go and creates or
  rewrites ignore files. Here it would append to `.gitignore` and
  `.prettierignore`, edit the `ignores` in `eslint.config.ts`, and create a
  `.dockerignore` (because `docker/node/Dockerfile` exists).
- Spec-kit's behaviour is changed only through the mechanisms spec-kit
  provides (template overrides in `.specify/templates/overrides/`, presets,
  integration options, `.specify/extensions.yml`). Files it generates
  (`.claude/skills/speckit-*`, `.specify/templates/*.md`,
  `.specify/scripts/`) are never edited by hand, so an upgrade never undoes a
  project change.
- Every core `speckit-*` skill is user-invocable only: the Claude
  integration's `--no-model-invocation` option, stored in
  `.specify/integration.json` and re-applied by every
  `specify integration upgrade claude`, writes `disable-model-invocation: true`
  into them. That way Claude can't launch `/speckit-implement` on its own
  (e.g. when `speckit-analyze` or `speckit-converge` suggest it), and their
  descriptions stay out of every session's context. The user launches every
  phase anyway. Check it again when (see the
  [Claude integration docs](https://github.github.io/spec-kit/integrations/claude.html)):
  - a preset is installed, removed or updated: it resets the affected skills;
    re-apply with `specify integration upgrade claude --force`;
  - an upgrade passes `--integration-options`: it replaces the stored ones,
    so repeat `--no-model-invocation`;
  - an extension's mandatory hook runs a core command: the option breaks that
    hook and has to be dropped.
- Claude runs the spec-kit CLI in the container (uv comes with its image, see
  `docker/node/Dockerfile`), from the repo root, always with
  `uvx --from git+https://github.com/github/spec-kit.git@v<version> specify …`,
  where `<version>` is the one in `.specify/integration.json`, so a command
  like `integration upgrade` doesn't silently pull newer templates and skills.
  Upgrading spec-kit means raising that version on purpose.

## Subagents

- Pick the subagent's model based on how much judgment the task needs:
  - Cheap model (haiku): the task has a closed, verifiable outcome and no
    design decisions — searching for a file/symbol, reading and summarizing a
    log or long file, running a command and reporting its output, mechanical
    multi-file edits (rename, reformat), checking whether something exists.
  - Default/stronger model: the task requires architecture or design choices,
    debugging with a non-obvious cause, reviewing code for subtle bugs,
    writing real business logic, or touches anything hard to undo where a
    near-correct answer could lead to a costly wrong decision.
  - Rule of thumb: if the expected result can be stated as one closed,
    checkable sentence, the cheap model is enough; if the subagent has to
    resolve ambiguity or make a design call, use the default model.

## Language

- Chat with the user in Spanish. Project documentation (`doc/*.md`,
  `AGENTS.md`) in English.
- Constitution (`.specify/memory/constitution.md`): English, like the
  `AGENTS.md` and `doc/` it indexes.
- Feature artifacts (`specs/**`): English, as the `speckit-*` skills generate
  by default. `specs/001-confirm-email/` predates this and stays in Spanish.
