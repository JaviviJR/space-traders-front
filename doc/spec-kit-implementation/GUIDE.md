# Spec-kit with project customizations

A portable kit to set up [spec-kit](https://github.github.io/spec-kit/) with
Claude Code in another repository, plus a catalog of optional customizations
to spec-kit's default behaviour and to how Claude works with the user. Copy
this whole folder to the target repo's `doc/` and follow the steps below.

## How the kit works

- `files/` holds every file to install, under neutral names (`claude-md.md`,
  `agents-md.md`…). They aren't stored under their real names because Claude
  Code discovers nested `CLAUDE.md` files and `.claude/skills/` folders in
  subdirectories: a real-named copy here would load into the session as if it
  were the project's own. Step 3 copies each one to its real path.
- The base (below) is always installed. Every optional customization has an
  id, and its rules and template changes are wrapped in markers in every file
  that carries them:

  ```
  <!-- custom:<id> -->
  …
  <!-- /custom:<id> -->
  ```

  Dropping a customization means deleting its blocks, markers included. A
  marker can sit inside another one's block (e.g. `record-decisions` inside
  `dual-research`): deleting the outer block removes the inner one too.
- Some blocks in the template overrides carry `replaces-core` in their
  opening marker: the core template (`.specify/templates/<same name>.md`) has
  other text there, or an empty block marks core text the customization
  removed. To drop one, replace the block with the matching core lines.
- `<<FILL: …>>` marks a value specific to the target project (stack,
  commands, language). They use a different syntax from spec-kit's own
  `[PLACEHOLDER]`s so a search finds only these.
- The descriptions below are for the person choosing; the copied files carry
  only the rules Claude follows. This guide is never loaded automatically, and
  it keeps every entry, so a customization dropped today can be added back
  later from `files/`.

## Prerequisites

- [uv](https://docs.astral.sh/uv/) (spec-kit runs with `uvx`, no install).
- [Claude Code](https://code.claude.com/docs).
- A git repository.

## Base (always installed)

- **Pinned version**: `uvx … specify` would otherwise pull the latest
  spec-kit, and an upgrade could bring new templates and skills unnoticed.
  The version is pinned in every command and raised on purpose; spec-kit is
  customized only through its own mechanisms (overrides, presets, integration
  options, extensions), never by editing generated files, so an upgrade never
  undoes a project change. Claude never runs the CLI; the user does.
- **Announced deviations**: when a project rule makes Claude skip or change a
  step of a `speckit-*` skill, it says so at that moment: one line when a
  written rule settles it; otherwise it handles it as a conflict between
  sources (AGENTS.md → Conflicts between sources) and waits.

Both live unmarked in `workflow.md` → Spec-kit features; the conflicts
section in `agents-md.md`.

## Catalog

| Id | Area | Blocks in |
|---|---|---|
| `options` | Claude + spec-kit | workflow.md |
| `learning-mode` | Claude | workflow.md |
| `preferences` | Claude | workflow.md |
| `record-decisions` | Claude | agents-md.md, workflow.md |
| `tests-required` | spec-kit | plan-template.md, tasks-template.md |
| `sessions` | spec-kit | workflow.md, plan-template.md, tasks-template.md; the whole feature-session-skill.md; init option |
| `dual-research` | spec-kit | workflow.md, plan-template.md, feature-session-skill.md |
| `constitution-gates` | spec-kit | step 5 below (no file blocks) |

#### `options`

- **Default**: Claude picks an approach or gives a short list;
  `/speckit-clarify` asks each question with one line per option;
  `/speckit-plan` makes the technical decisions and writes them straight into
  the research file, and settles on its own a requirement that clashes with a
  project rule.
- **With it**: when several approaches are viable, Claude explains each one,
  says what the official docs recommend (or that they have no stance),
  compares the complexity of the resulting code, says under which condition
  another option would win, and ends with a recommendation, one decision at a
  time. The same applies in spec-kit:
  - `/speckit-clarify`: questions that clash with a rule or change something
    hard to undo (an external contract, the flow the user sees, state that
    persists) use this format; simple ones keep the skill's short one.
  - `/speckit-plan`: each decision with several viable approaches is
    presented in chat before anything is written.
  - `/speckit-plan` conflicts: the user picks one of three routes: change the
    spec (back to `/speckit-clarify`), change the project rule, or keep the
    exception justified in "Complexity Tracking".

#### `learning-mode`

- **Default**: Claude makes the change and summarizes it; the user approves
  it in the permission prompt.
- **With it**: every change is explained first as a guided exercise, naming
  the concepts involved, with code (a snippet, a diff, a minimal example)
  when it makes the explanation clearer, and the list of files affected.
  Structural changes split into what it does and why this design. Claude says
  which skill a decision comes from, invites questions and applies nothing
  until the user has no more doubts. A list of concepts the user already
  knows is only named, not explained, and is updated when the user says they
  know or forgot one.
- **Fill**: what the user is learning, the framework or language, and the
  known concepts (may start empty).

#### `preferences`

Four independent bullets; delete the ones you don't want:

- **Language**: chat, documentation and feature artifacts languages, set
  separately. **Fill**: the three languages.
- **User-run commands**: Claude never runs the listed commands, even when
  the permission mode would allow it; it gives them in one block with a note
  per command and a docs link, the user runs them, and Claude verifies by
  reading files. **Fill**: which commands (e.g. package installs).
- **No AI attribution**: Claude Code adds `Co-Authored-By: Claude` to commits
  by default; with it, commits carry no AI attribution line.
- **Subagent model**: Claude picks a subagent's model by how much judgment the
  task needs: a cheap model for closed, checkable tasks (search, summarize,
  run and report); a stronger one for design calls or anything hard to undo.

#### `record-decisions`

- **With it**: when a decision is closed, it's recorded in the same change:
  in a `doc/*.md` when it applies to several files, in a comment in the file
  when it's specific to one. Docs describe mechanisms, not inventories of
  what the code already says; a single case never becomes a doc rule.
- **Where**: `agents-md.md` (Where documentation lives), plus one sentence
  inside `dual-research` in `workflow.md`.

#### `tests-required`

- **Default**: tests are optional ("only if the spec asks for them"), written
  first and failing (TDD), and tasks say "commit after each task".
- **With it**: the plan has a Testing section with one row per change (which
  test, which type, why); each row becomes a test task in the same phase as
  the code it covers. No TDD, no commit per task.
- **Fill**: the project's test types and an example row in
  `plan-template.md`.

#### `sessions`

- **Default**: `tasks.md` suggests parallel work by team members;
  `/speckit-implement` runs every phase in one go, creates or rewrites ignore
  files (`.gitignore`, `.prettierignore`, linter ignores, a `.dockerignore`
  when a Dockerfile exists), and Claude may launch it on its own when
  `/speckit-analyze` or `/speckit-converge` suggest it. There's no commit
  format.
- **With it**:
  - `tasks.md` groups tasks by user story and ends with a Sessions table, one
    row per work session with its close checks and the exact command to
    start it.
  - Each row runs in a new Claude Code conversation with
    `/feature-session <dir> <id>`, which reads the context from the feature's
    artifacts, not from chat history. Progress is the `[X]` marks in
    `tasks.md`.
  - Once the user says a session is all OK, Claude commits it as
    `<type>(<feature>): <session> <summary>` with `Session:` and `Tasks:`
    trailers, queryable with `git log`. Outside a session, the user commits.
  - `/speckit-converge`'s phase gets its own Sessions table, numbered after
    the last session.
  - `/speckit-implement` is never run, and the integration option
    `--no-model-invocation` marks every core `speckit-*` skill as
    user-invocable only, which also keeps their descriptions out of every
    session's context. The rule lists when the option has to be re-applied.
- **Fill**: the session close checks in `plan-template.md` and
  `tasks-template.md`.
- **Without it**: features are implemented with `/speckit-implement`; drop
  the init option in step 2 too.

#### `dual-research`

- **Default**: spec-kit writes `research.md`.
- **With it**: it also writes `research.workflow.md` with the same decisions
  under the project's rules: cites the official docs, keeps the spec's closed
  decisions with their rejected alternatives and, with `record-decisions`,
  says where else each decision is recorded. `/feature-session` reads this
  one.
- **Why**: compare what the project's rules change against spec-kit's
  default. Experimental: drop it when the comparison stops adding anything.

#### `constitution-gates`

- **Default**: the constitution holds the rules written out in it.
- **With it**: each principle is only a gate the plan must pass, linking to
  the doc where the rule lives, so the two can't drift apart. Exceptions are
  justified in "Complexity Tracking", a disagreement with another source is
  flagged before acting, and the constitution is versioned with semver as
  gates are added, removed or redefined.
- **Where**: the text passed to `/speckit-constitution` in step 5. Until the
  project has `doc/*.md` files to link to, a gate can hold its rule directly.

## Installation

Run every command from the target repo's root.

### 1. Pick a spec-kit version

Pick a release from
[spec-kit's releases](https://github.com/github/spec-kit/releases). Every
command below uses `@v<version>`; never run `specify` without it.

### 2. Initialize spec-kit

```sh
uvx --from git+https://github.com/github/spec-kit.git@v<version> specify init --here --integration claude --integration-options "--no-model-invocation"
```

- `--here`: initialize in the current directory.
- `--integration claude`: generate Claude Code skills (`.claude/skills/speckit-*`).
- `--integration-options "--no-model-invocation"`: only with `sessions`.

Flag names can change between versions: check `specify init --help` for the
pinned one, and the
[Claude integration docs](https://github.github.io/spec-kit/integrations/claude.html).
Afterwards `.specify/integration.json` records the version and the options.

### 3. Copy the files

If the repo already has a `CLAUDE.md`, don't overwrite it: add `@AGENTS.md`
to it. If it already has an `AGENTS.md`, merge `files/agents-md.md` into it
instead of copying, keeping the import of `doc/workflow.md`. Skip the last
line if you drop `sessions`.

```sh
KIT=doc/spec-kit-implementation/files
mkdir -p .specify/templates/overrides .claude/skills/feature-session
cp "$KIT/claude-md.md" CLAUDE.md
cp "$KIT/agents-md.md" AGENTS.md
cp "$KIT/workflow.md" doc/workflow.md
cp "$KIT/plan-template.md" .specify/templates/overrides/plan-template.md
cp "$KIT/tasks-template.md" .specify/templates/overrides/tasks-template.md
cp "$KIT/feature-session-skill.md" .claude/skills/feature-session/SKILL.md
```

### 4. Drop the customizations you don't want

For each id you drop, using the catalog's "Blocks in" column:

1. Delete every `custom:<id>` block in the copied files, markers included.
2. Where the opening marker says `replaces-core`, put back the matching lines
   from the core template (`.specify/templates/plan-template.md` or
   `tasks-template.md`).
3. If an override ends up with no `custom:` blocks, delete the override file:
   the core template then applies and upgrades reach it.

The markers of the customizations you keep can stay: they mark what to
compare after an upgrade and what to delete later.

### 5. Create the constitution

Run `/speckit-constitution` in Claude Code followed by the project's
principles. With `constitution-gates`, add this text after them:

```text
Each principle is a gate that /speckit-plan's "Constitution Check" must verify.
The rule's text and its rationale live in the linked document (AGENTS.md or a
doc/*.md); if they change there, the constitution stays untouched. A principle
whose rule has no document yet states it directly, and moves to a link when
the document exists.
Governance:
- AGENTS.md and doc/*.md are the source of truth; the constitution only lists
  the gates and doesn't repeat their text.
- If the constitution disagrees with AGENTS.md, a doc/*.md or a skill, warn the
  user before acting, quoting both sources.
- Amendments are proposed to the user and applied only with their approval;
  the constitution changes only when a gate is added, removed or redefined.
- Semantic versioning: MAJOR when a gate is removed or redefined, MINOR when
  one is added, PATCH for wording.
- A violation in a plan is accepted only when justified in its "Complexity
  Tracking" section.
```

With `tests-required`, include a testing gate (every change names the test
that covers it, at least one test exercises the feature as a user would), so
the templates' references to "the constitution's testing gate" resolve.

### 6. Fill the placeholders and check

Replace every `<<FILL: …>>`, then check that none is left and that only the
customizations you kept still have markers:

```sh
grep -rn "<<FILL" CLAUDE.md AGENTS.md doc/workflow.md .specify/templates/overrides .claude/skills/feature-session
grep -rhoE "custom:[a-z-]+" AGENTS.md doc/workflow.md .specify/templates/overrides .claude/skills/feature-session | sort -u
```

The first command must print nothing; the second, only the ids you kept.

### 7. First feature

`/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks`
→ `/speckit-analyze`, reviewing each phase's output before the next. With
`sessions`, implement each row of the Sessions table in a new conversation
with the command in its "Command" column.

## After a spec-kit upgrade

- Compare each override with the new core template (e.g.
  `diff .specify/templates/tasks-template.md .specify/templates/overrides/tasks-template.md`):
  the differences should be only the `custom:` blocks. Bring any other new
  core text into the override.
- With `sessions`, check that the `speckit-*` skills still have
  `disable-model-invocation: true`, and re-apply as the rule in
  `doc/workflow.md` says.

## Adding a customization back later

Its blocks are still in `files/`: copy each one into the installed file at
the same place, and fill its `<<FILL>>`s.

## Possible evolution: presets

The rules that only add instructions to one spec-kit phase (the
`/speckit-clarify` and `/speckit-plan` parts of `options`, `dual-research`,
the `/speckit-converge` part of `sessions`) could become a spec-kit
[preset](https://github.github.io/spec-kit/presets/overview.html) with
`append` contributions to the matching command. They would then load only
when that phase runs, instead of in every session. The cost: a CLI step to
enable or disable each one, and re-applying `--no-model-invocation` after
every preset change.
