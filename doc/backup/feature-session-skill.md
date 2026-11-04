---
name: "feature-session"
description: "Implement one session (a row of the Sessions table in tasks.md) of a spec-kit feature, following the project's working agreements."
argument-hint: "<feature dir, e.g. specs/001-my-feature> <session id, e.g. S1>"
user-invocable: true
disable-model-invocation: true
---

## User Input

```text
$ARGUMENTS
```

The first argument is the feature directory, the second the session id. If either is
missing, or the directory has no `tasks.md` with a "Sessions" table listing that
session, stop and ask.

## How sessions work

A feature is implemented one row of its "Sessions" table at a time, each in a new
Claude Code conversation started with this command. The context comes from the
feature's artifacts, not from chat history. Progress is the `[X]` marks in `tasks.md`.

## Steps

1. Follow `AGENTS.md` and the files it imports to the letter: they say how changes are
   proposed, confirmed and reviewed in this project.
2. Read `<feature dir>/tasks.md`. The "Sessions" tables (the main one and one per
   `Convergence` phase, if any) say which tasks belong to this session and how it
   closes. Check that every task of earlier sessions is marked `[X]`; if not, stop and
   tell the user which ones are missing.
3. Read `<feature dir>/spec.md` and `plan.md`, and from `research.md` only the
   decisions cited by this session's tasks. Read the `doc/*.md` files whose `AGENTS.md`
   trigger matches the work.
4. Implement only this session's tasks, one proposal per task or per closely related
   group (list each task ID covered). Do NOT run `/speckit-implement`.
5. Close as the "Sessions" table says: run each check in its "Close" column and report
   each result. If a check rewrites files the session didn't touch (e.g. a formatter),
   keep those edits and list them. Mark the finished tasks `[X]` in `tasks.md`.
6. Stop and wait for the user's review. Apply any changes they ask for and wait again.
7. Once they say it's all OK, commit the session. Commit only at this step, once per
   session, not per task. Message format:

   ```
   <type>(<NNN-feature>): <session id> <summary>

   <optional body: what else the session touched>

   Session: <NNN-feature> <session id>
   Tasks: <task IDs>
   ```

   `<type>` is the Conventional Commits type of the main change. The feature goes in
   the scope because the spec defines it as a section of the codebase; a session isn't
   one, so it goes in the description. The trailers let
   `git log --format='%(trailers:key=Session)'` list the sessions.
