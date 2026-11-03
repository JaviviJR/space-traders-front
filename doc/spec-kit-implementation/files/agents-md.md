# AGENTS.md

<<FILL: one paragraph: what this project is, its stack, and where its dependency list lives (e.g. package.json). Don't assume a library is available unless it's listed there.>>

## Conflicts between sources

When two sources disagree (two skills, a skill and this file, or either of them
and the official docs), tell the user before acting: name both sources, quote
what each says, and say which one you will follow and why.

## Decision docs

They are not loaded automatically: read only the ones whose trigger matches
the task.

<<FILL: one bullet per doc/*.md, "- [doc/<name>.md](doc/<name>.md): read before <trigger>". Leave the list empty until the first doc exists.>>

<!-- custom:record-decisions -->
## Where documentation lives

- `doc/*.md` and this file describe the generic mechanism and how to add a
  case (steps, rules, conventions), not an inventory of implementations.
  Don't copy lists the code already expresses or literal config values: say
  what they do and point to the file.
- When a decision is closed or changes, record it in the same change that
  applies it:
  - A mechanism that applies to several files: the `doc/*.md` whose trigger
    above covers it.
  - Something specific to one file (why this value, what it deliberately
    doesn't do): a comment in that file — a header comment at the top when
    it's about the whole file, a one-line comment next to the line when it's
    a local trap. Only write it when removing it would likely lead a future
    reader to "simplify" the code back into the problem it avoids.
- A single case never becomes a `doc/*.md` rule. When a second case appears,
  propose to the user whether to generalize it into `doc/` or keep a comment
  in each file.
- Record only what was decided: what won't be done isn't recorded. When a
  decision changes, rewrite the existing text instead of appending a note.
<!-- /custom:record-decisions -->

## Working agreements

How the user wants to work with Claude. Loaded automatically every session:

@doc/workflow.md
