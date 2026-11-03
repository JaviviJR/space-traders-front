---
name: "feature-session"
description: "Implement one session (a row of the Sessions table in tasks.md) of a spec-kit feature, following the project's working agreements."
argument-hint: "<feature dir, e.g. specs/001-my-feature> <session id, e.g. S1>"
user-invocable: true
disable-model-invocation: true
---

<!--
  Part of the "sessions" customization (doc/spec-kit-implementation/GUIDE.md → Catalog):
  delete this skill when sessions is dropped. Blocks wrapped in custom:<id> markers belong
  to other customizations; delete them when those are dropped.
-->

## User Input

```text
$ARGUMENTS
```

The first argument is the feature directory, the second the session id. If either is
missing, or the directory has no `tasks.md` with a "Sessions" table listing that
session, stop and ask.

## Steps

1. Follow `AGENTS.md` and `doc/workflow.md` to the letter: they say how changes are
   proposed, confirmed and reviewed in this project. `doc/workflow.md` → "sessions"
   explains this flow and how this session's commit is made.
2. Read `<feature dir>/tasks.md`. The "Sessions" tables (the main one and one per
   `Convergence` phase, if any) say which tasks belong to this session and how it
   closes. Check that every task of earlier sessions is marked `[X]`; if not, stop and
   tell the user which ones are missing.
3. Read `<feature dir>/spec.md` and `plan.md`, and from the research file only the
   decisions cited by this session's tasks: `research.md`
<!-- custom:dual-research -->
   , or `research.workflow.md` when the feature has one
<!-- /custom:dual-research -->
   . Read the `doc/*.md` files whose `AGENTS.md` trigger matches the work.
4. Implement only this session's tasks, one proposal per task or per closely related
   group (list each task ID covered). Do NOT run `/speckit-implement`.
5. Close as the "Sessions" table says: run each check and report each result. If a
   check rewrites files the session didn't touch (e.g. a formatter), keep those edits
   and list them. Mark the finished tasks `[X]` in `tasks.md`.
6. Stop and wait for the user's review. Apply any changes they ask for and wait again.
   Once they say it's all OK, commit the session with the message format in
   `doc/workflow.md` → "sessions", and the rules in "preferences" if any apply to
   commits.
