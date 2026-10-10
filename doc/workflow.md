# Working agreements

How the user works with Claude on this project. Applies to every session.

## Confirmations

- Ask explicit confirmation before writing any file, or running commands that
  change state. This applies regardless of whether the file is tracked by
  git.
- Option answers are not approval. Approval for one change does not extend to
  the next.
- Related changes may be grouped into one proposal, provided each change is
  listed explicitly so the approval covers each one.
- Reading files and running tests, lint, format, type-check or build need no
  confirmation.

## Learning mode

- The user is using this project to learn Vue.js while building it with
  Claude. This extends the "Proposals" section below, not a replacement for
  it: proposals still never show a diff or pasted code in chat.
- When proposing a change to project files (Vue components, tests, config,
  Docker), explain it didactically, as if it were a guided exercise: what the
  change does and which Vue concepts it involves (e.g. `ref` vs `reactive`,
  props, emits, Pinia stores, routes), in prose, without pasting the code
  itself. The user reviews the actual code with `git diff` in VSCode.
- Write those explanations in Spanish.
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
- When a decision is closed, write it to the relevant `doc/*.md` file and
  reply with a one-line summary.

## Design suggestions

- The user has little design experience. When working on UI, proactively
  suggest improvements even when not asked: layout, spacing, typography,
  color and contrast, responsive behavior, accessibility, states (hover,
  focus, loading, empty, error) and small animations. Explain the reasoning
  in Spanish, so the user learns the design principle behind each suggestion.
- Also suggest ready-made components or libraries worth integrating (icons,
  dialogs, dropdowns, toasts, tables, charts…). Only suggest libraries that
  work with Tailwind and support the Tailwind major version in
  `package.json` (currently v4): check it in the library's docs before
  suggesting it, and cite the page. Prefer unstyled or Tailwind-styled ones
  (styled with Tailwind classes we control) over libraries that ship their
  own CSS theme. They must also support Vue 3 and be actively maintained.
  For each, say what it adds, its cost (bundle size, learning curve) and
  whether building it ourselves would be simpler.
- Keep suggestions as a short list, separate from the requested change, so
  the user can pick which to apply. They follow Learning mode above (shown
  first, applied only once the user agrees), and adding a library follows the
  dependency rule in "Steps and installs" below. Use the `frontend-design`
  skill for visual direction and `web-design-guidelines` to review UI code.

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

- Never launch a subagent (the `Agent` tool, any `subagent_type`) without
  asking first and getting an explicit yes/no. This applies even when the
  task looks like a good fit for one; the user has no prior experience
  judging that tradeoff and wants to decide every time.
- The ask must let the user pick one of:
  - Approve launching the subagent as proposed.
  - Ask why a subagent is needed for this step, before deciding.
  - Do the work themselves (run the command, read the file, etc.) and paste
    the result back, instead of a subagent doing it.
- State plainly what the subagent would do and why delegating it helps (e.g.
  keeps noisy tool output out of the main context), so the user can make an
  informed choice or do it manually instead.
- When proposing a subagent, also propose a model for it, based on how much
  judgment the task needs:
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
