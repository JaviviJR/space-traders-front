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
- When a decision comes from an installed skill, say which skill and why it
  recommends it.
- Invite questions, answer them, and apply the change only once the user says
  they have no more doubts.

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
  shorter bullets.

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

## Context

- Start a new conversation when a topic is closed. Point the new session to
  `AGENTS.md` and `doc/` instead of carrying the old history.
- Reference files by path instead of pasting their content into chat.
- Ask grouped questions when the answers are independent.
