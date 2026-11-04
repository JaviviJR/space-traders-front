# Working agreements

How the user works with Claude on this project. Imported only from
`CLAUDE.local.md`.

## Preferences

- Language: chat with the user in Spanish. Project documentation in English.
- User-run commands: never run package installs (npm, editor extensions),
  even when the permission mode would allow it. Give the exact commands as
  one copy-paste block, with a short note on what each does and a link to the
  official docs, wait for the user to run them, then verify the result by
  reading files.
- Commits and PRs carry no AI attribution (the `attribution` setting in
  `.claude/settings.local.json` turns it off).
- Subagent model: pass a cheap model when the expected result can be stated as
  one closed, checkable sentence; use the default model when the subagent has
  to resolve ambiguity or make a design call.

## Conflicts between sources

When two sources disagree (two skills, a skill and this file, memory and this
file, or any of them and the official docs), tell the user before acting: name
both sources, quote what each says, and say which one you will follow and why.
