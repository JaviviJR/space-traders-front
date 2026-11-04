Removed from the spec-kit kit's `tasks-template.md` (preset `project-workflow`), where it
replaced the core's "Parallel Team Strategy" under "Implementation Strategy". It works with
`feature-session-skill.md` and `speckit.converge.md` in this folder.

### Sessions

<!--
  Group the tasks into sessions: each session is one new Claude Code conversation,
  run with `/feature-session <feature dir> <session id>`. Usually one session per
  phase; split a large phase and merge a tiny one (e.g. a one-task Setup) into the
  next. Every task belongs to exactly one session, in execution order. "Close" lists
  the checks that end the session, with their commands, copied from AGENTS.md →
  Done when: its end-to-end check where that section's condition applies to the
  session's tasks, and always in the last session. "Command" is the exact text the
  user pastes into the new conversation, with this feature's real directory and the
  session id filled in.
-->

| Session | Tasks | Close | Command |
|---|---|---|---|
| S1 | T001–T00X | [checks from AGENTS.md → Done when] | `/feature-session specs/[###-feature-name] S1` |
| S2 | ... | ... | ... |
