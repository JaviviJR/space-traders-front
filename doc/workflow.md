# Working agreements

How the user works with Claude on this project. Applies to every session.

## Confirmations

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
- When proposing several options, explain each one didactically before the
  user picks (the user had no prior JavaScript/TypeScript/Vue experience, so
  bare option labels aren't enough): what it does, and what the official docs
  recommend about it — or say explicitly that they have no stance and it's a
  project decision.
- In each option or rule, compare the resulting code: which is simpler and
  which adds complexity that may be unnecessary (extra state, coordination,
  files touched). Rules are defaults, not dogma: state the condition that
  overrides one on simplicity grounds.
- When a decision comes from an installed skill, say which skill and why it
  recommends it.
- Invite questions, answer them, and apply the change only once the user says
  they have no more doubts.

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
- Design rationale: when a change is driven by a design pattern, a SOLID
  principle, an architecture decision or a code-quality improvement — however
  small, including a rename or extracting a method — split the explanation in
  two: what the change does (functional effect) and why this design
  specifically — what coupling, responsibility or extensibility problem it
  solves, or which principle it applies, and why a simpler alternative wasn't
  enough. Always explicit, even for small changes. A proposal without the
  second part is incomplete.
  - Revisit note: tried as "always explicit" starting 2026-10-08. After a few
    sessions, consider switching to "only for structural changes
    (interfaces, patterns, layers)" if "always" turns out noisy for trivial
    changes.
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

- Design decisions: one at a time, each with its trade-offs and a
  recommendation.
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

## Spec-kit features

- A feature built with spec-kit goes through `/speckit-specify`,
  `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks` and `/speckit-analyze`,
  each reviewed by the user before the next. Its artifacts live in
  `specs/<NNN-feature>/`.
- `/speckit-tasks` groups tasks by user story (each story touches every layer
  it needs), not by layer, and ends with a "Sessions" table (from
  `.specify/templates/overrides/tasks-template.md`).
- Implementation: one new Claude Code conversation per row of that table,
  started with `/feature-session <feature dir> <session id>`. The context
  comes from the feature's artifacts, not from chat history. Progress is the
  `[X]` marks in `tasks.md`.
- Closing a session: apply the changes, run the session's checks and mark its
  tasks `[X]`, then stop and wait for the user's review. If they ask for
  changes, apply them and wait again; once they say it's all OK, Claude makes
  the session's commit. Only for `/feature-session`; outside it the user
  commits, and Claude doesn't ask whether to commit.
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
- Never run `/speckit-implement`: it runs every phase in one go and creates or
  rewrites ignore files (`.gitignore`, `.prettierignore`, ESLint ignores).
  Its skill, and the deprecated `speckit-taskstoissues`, carry
  `disable-model-invocation: true` so only the user can launch them and their
  descriptions stay out of every session's context. A spec-kit upgrade
  regenerates `.claude/skills/speckit-*`: after one, check that both still
  have it.

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
- Feature artifacts (`specs/**`): content in Spanish, so the user reviews them
  in their own language, but the section headings of the `.specify/templates/`
  and the structural keywords the `speckit-*` skills look for (e.g.
  "Constitution Check", task IDs) stay in English, so the templates and skills
  work unchanged across spec-kit upgrades.
  - Revisit: English would save ~2k tokens per `/feature-session`. When the
    user asks to switch, drop this rule so the `speckit-*` skills generate in
    English as they do by default, and ask whether existing `specs/**` get
    translated or stay as they are.

## Context

- Start a new conversation when a topic is closed. Point the new session to
  `AGENTS.md` and `doc/` instead of carrying the old history.
- Reference files by path instead of pasting their content into chat.
- Ask grouped questions when the answers are independent.
