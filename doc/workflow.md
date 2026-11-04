# Working agreements

How the user works with Claude on this project. Imported only from
`CLAUDE.local.md`.

## Preferences

- Language: chat with the user in Spanish. Project documentation in English.
- Package installs are blocked by deny rules in `.claude/settings.local.json`.
  When one is needed, give the exact commands as one copy-paste block, with a
  short note on what each does and a link to the official docs, wait for the
  user to run them, then verify the result by reading files.
- Commits and PRs carry no AI attribution (the `attribution` setting in
  `.claude/settings.local.json` turns it off).
- Subagent model: pass a cheap model when the expected result can be stated as
  one closed, checkable sentence; use the default model when the subagent has
  to resolve ambiguity or make a design call.

