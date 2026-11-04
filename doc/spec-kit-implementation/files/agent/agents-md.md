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

When a decision that isn't visible in the code is closed or changes, record it
in the same change that applies it: in the `doc/*.md` whose trigger covers it
when it applies to several files, or as a comment in the file when it's
specific to one (a header comment when it's about the whole file, a one-line
comment next to a local trap). Write the comment only when removing it would
likely lead a future reader to "simplify" the code back into the problem it
avoids. Docs describe the mechanism and how to add a case, not an inventory of
what the code already says.

## Done when

A change isn't done until <<FILL: the checks every change must pass, e.g. lint, format, type-check, unit tests, with their commands>> pass;
plus <<FILL: the end-to-end command, or remove this clause>> when the change
adds or changes an end-to-end test or touches code one covers.

## Testing

Every proposed change says what will be tested and how: which test covers it
(new or updated, with its path), and whether an end-to-end test applies or
why not. The project's test types:

- <<FILL: one line per test type: name, what it exercises, tool. E.g. "unit: a function or module through its public API (<test runner>)" and "e2e: a user journey (<e2e tool>)">>

## Working agreements

How the user wants to work with Claude. Loaded automatically every session:

@doc/workflow.md
