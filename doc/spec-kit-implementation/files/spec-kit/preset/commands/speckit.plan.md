## Project rules for this phase

- Decisions: before writing `research.md`, present in chat each decision that
  has several viable approaches, one at a time, following `doc/workflow.md` →
  Options if that section exists, and wait for the user's answer.
  `research.md` then records the closed decisions.
- Conflicts (a requirement that contradicts `AGENTS.md`, a `doc/*.md`, a
  closed decision or a constitution gate): present it to the user with three
  routes, and the user picks one:
  1. Change the spec: it goes back through `/speckit-clarify`, which records
     it in Clarifications, then `/speckit-plan` resumes. The plan never edits
     `spec.md`.
  2. Change the project rule (`doc/*.md` or `AGENTS.md`): a separate doc
     change, reviewed on its own, then the plan goes on.
  3. Keep the exception: the plan justifies it in "Complexity Tracking", as
     the constitution requires, and goes on.
- When a project rule makes you skip or change a step above, say so in one
  line, naming the step and the rule.
