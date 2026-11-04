To install this kit, paste into a Claude Code session started at the target repo's root
(adjust the path if you copied the folder elsewhere):
`Read doc/spec-kit-implementation/GUIDE.md and follow it to set up this repository.`

# Agent and spec-kit setup kit

You are the agent installing this kit. This guide tells you how. Below, `<kit>` is the
folder this guide is in, relative to the repo root.

## What the kit is

Two layers of customizations, installed in order:

1. **Agent layer** (`<kit>/files/agent/`): how Claude works in the repo: `CLAUDE.md`,
   `AGENTS.md` and `doc/workflow.md`. It never mentions spec-kit, so small changes can be
   made without spec-kit's flow, and it can be installed alone.
2. **Spec-kit layer** (`<kit>/files/spec-kit/`): a spec-kit preset and two skills. It
   loads only inside its skills. It may refer to the agent layer (`AGENTS.md` → Done
   when, Testing; `doc/workflow.md` → Options, "if that section exists"), never the other
   way round. It requires the agent layer.

How the files work:

- They are stored under neutral names (`claude-md.md`, `feature-session-skill.md`…)
  because Claude Code discovers `CLAUDE.md` files and `.claude/skills/` folders in
  subdirectories: a real-named copy here would load as if it were the project's own. You
  copy each one to its real path.
- Every optional part is a `##` section (in the preset, a whole file): dropping it means
  deleting it. In `workflow.md` → Preferences, each bullet is dropped on its own. Nothing
  else needs editing when something is dropped.
- `<<FILL: …>>` marks a value specific to the project. They use a different syntax from
  spec-kit's own `[PLACEHOLDER]`s so a search finds only these.

## How you work during the setup

- Never invent a `<<FILL>>` value: ask the user, offering what you found in the repo
  (stack, scripts, existing docs) as a suggestion.
- Before each step that writes a file or runs a command that changes state, say what it
  will change and wait for the user's confirmation.
- When an existing rule in the repo contradicts the kit, name both, quote them and ask
  which one wins before writing.
- When a decision has several viable approaches, explain each and recommend one.
- Feature artifacts stay in English, spec-kit's default. If the user wants another
  language, see Part 2 → Artifact language.

## Step 0: detect the situation

Before changing anything, check and report to the user:

- Whether `CLAUDE.md` and `AGENTS.md` exist, and whether `CLAUDE.md` imports
  `@AGENTS.md`. Whether `doc/workflow.md` exists.
- Whether spec-kit is installed (`.specify/integration.json`): its version, integration
  and options (`raw_options`).
- If installed: files in `.specify/templates/overrides/`; whether
  `.specify/memory/constitution.md` has real content (not the template's placeholders);
  features in `specs/` with unfinished tasks.
- Whether `uv` is available (`uv --version`). If not, give the user the install command
  from <https://docs.astral.sh/uv/getting-started/installation/> and wait: never install
  it yourself.

## Part 1: agent layer

### Copy or merge

- **None of them exists**: copy `<kit>/files/agent/claude-md.md` → `CLAUDE.md`,
  `agents-md.md` → `AGENTS.md`, `workflow.md` → `doc/workflow.md`.
- **Some exist**: merge, never overwrite or delete existing content:
  - Only `AGENTS.md`: create `CLAUDE.md` from `claude-md.md` (it imports `@AGENTS.md`).
  - Only `CLAUDE.md`: create `AGENTS.md`, and put `@AGENTS.md` at the top of `CLAUDE.md`;
    its existing content stays below the import.
  - Both: add the import to `CLAUDE.md` if missing.
  - Add the kit's sections missing from `AGENTS.md`, and copy `doc/workflow.md` (or merge
    it if it exists) with `AGENTS.md`'s import of it.
  - Where an existing section covers the same ground as a kit section (e.g. a list of
    checks vs Done when), show both and let the user pick: merge into the kit's section,
    keep theirs, or keep both.
  - If the existing files are small or disorganized, you may also offer to normalize:
    move everything into `AGENTS.md` under the kit's sections, leaving `CLAUDE.md` with
    the import only. Do it only with the user's explicit agreement.

### Pick the sections

Explain each optional section to the user from this table and ask which ones to keep.
Delete the rest. If `doc/workflow.md` ends up empty, delete it and the "Working
agreements" section of `AGENTS.md`.

| Section | File | Without it (Claude Code's default) | With it | Fill |
|---|---|---|---|---|
| Intro (base) | `AGENTS.md` | Claude infers the stack by exploring. | Claude knows the stack and doesn't assume a library that isn't in the dependency list. | The paragraph. |
| Conflicts between sources (base) | `AGENTS.md` | Claude picks between disagreeing sources silently. | It names both, quotes them and says which it follows and why, before acting. | — |
| Decision docs (base) | `AGENTS.md` | No index of project docs. | Each `doc/*.md` is read only when its trigger matches the task; closed decisions are recorded in the same change, in a doc or a code comment. | One bullet per doc; may start empty. |
| Done when (base) | `AGENTS.md` | Claude decides which checks to run. | A change is done only when the listed checks pass, plus end-to-end when it applies. | The checks and their commands. |
| Testing | `AGENTS.md` | Proposals don't have to name tests. | Every proposed change says which test covers it and whether an end-to-end test applies. | The project's test types. |
| Preferences → Language | `doc/workflow.md` | Claude answers in the user's language; docs in whatever it picks. | Chat and documentation languages fixed. | Both languages. |
| Preferences → User-run commands | `doc/workflow.md` | Claude runs whatever the permission mode allows. | The listed commands are given to the user in one block with a note and a docs link each; Claude verifies by reading files. | Which commands. |
| Preferences → No AI attribution | `doc/workflow.md` | Commits get a `Co-Authored-By: Claude` trailer. | No AI attribution line. | — |
| Preferences → Subagent model | `doc/workflow.md` | Subagents run on the session's model. | A cheap model for closed, checkable tasks; the default one for judgment calls. | — |
| Options | `doc/workflow.md` | Claude picks an approach or gives a short list. | Each viable approach explained with what the docs say and the complexity it adds, a recommendation, one decision at a time. Spec-kit's clarify and plan use it too. | — |
| Learning mode | `doc/workflow.md` | Claude makes the change and summarizes it. | Every change explained as a guided exercise, with the concepts involved; nothing applied until the user has no more doubts; a list of known concepts only named. | What the user learns, the framework, known concepts. |

Then fill every `<<FILL>>` left in these files.

## Part 2: spec-kit layer

Requires Part 1. Pieces:

| Piece | Source | Installed at | Without it (spec-kit's default) | With it |
|---|---|---|---|---|
| Preset `project-workflow` | `<kit>/files/spec-kit/preset/` | `presets/project-workflow/` | Clarify asks with one line per option; plan decides alone and settles clashes with project rules itself; tests optional and TDD; `tasks.md` suggests parallel team work; `/speckit-implement` runs everything in one go. | Clarify and plan present decisions following `doc/workflow.md` → Options (if it exists) and plan resolves rule conflicts with the user; plan has a Testing section and each row becomes a test task, no TDD; `tasks.md` ends with a Sessions table. |
| Skill `feature-session` | `<kit>/files/spec-kit/feature-session-skill.md` | `.claude/skills/feature-session/SKILL.md` | — | Each Sessions row is implemented in a new conversation, closed with its checks and reviewed by the user, then committed with `Session:` and `Tasks:` trailers. |
| Skill `spec-kit-maintenance` | `<kit>/files/spec-kit/maintenance-skill.md` | `.claude/skills/spec-kit-maintenance/SKILL.md` | — | Loads when spec-kit's setup changes: pinned CLI, no edits to generated files, presets, integration options, upgrades. |

All three go together: the preset's Sessions table needs `feature-session`, and the
preset needs the maintenance rules.

### 1. Version

Ask the user which spec-kit release to use, at least `1.2.5` (the preset's
`requires`), from <https://github.com/github/spec-kit/releases>. Every command below is
`uvx --from git+https://github.com/github/spec-kit.git@v<version> specify …`, run from
the repo root; never run it without the pin. If spec-kit is installed, use its version
unless the user decides to upgrade (as a change of its own, following the maintenance
skill).

### 2. Install or adapt spec-kit

- **Not installed**:
  `specify init --here --integration claude --integration-options "--no-model-invocation"`.
  In a non-empty directory it asks for confirmation and fails without a terminal: add
  `--force`, which merges into the existing files (it writes only `.claude/skills/` and
  `.specify/`). Check flag names with `specify init --help` for the pinned version.
- **Installed**:
  - Version below `1.2.5`: the preset can't be installed; propose the upgrade first.
  - Version above `1.2.5`: before installing the preset, compare its two templates with
    the core ones (`.specify/templates/plan-template.md`, `tasks-template.md`) and report
    differences beyond those listed in each template's header comment.
  - Options without `--no-model-invocation`: run
    `specify integration upgrade claude --force --integration-options "--no-model-invocation"`
    (keeping any other stored options). It regenerates the `speckit-*` skills: first
    show the user any hand edits in them (`git log`/`git diff` on `.claude/skills/speckit-*`),
    which will be lost.
  - Overrides of `plan-template` or `tasks-template` in `.specify/templates/overrides/`
    take precedence over the preset. For each one, diff it against the core template,
    show the user each difference and ask whether to bring it into the preset's template
    (in `presets/project-workflow/`, also adding it to the header comment) or drop it.
    Then delete the override. Overrides of other templates stay.
  - Features in progress keep their current flow; the new templates apply to new
    features. Without a Sessions table, `/feature-session` doesn't apply to them: tell
    the user.

### 3. Preset and skills

Copy `<kit>/files/spec-kit/preset/` to `presets/project-workflow/` (outside `.specify/`,
so it's tracked and editable), then:

```sh
specify preset add --dev presets/project-workflow
specify integration upgrade claude --force
```

Installing a preset resets `disable-model-invocation` in the skills it touches; the
upgrade restores it and keeps the preset's appended sections.

Copy the two skills to their paths in the table above. In the maintenance skill, fill the
kit folder's path (`<kit>`).

### 4. Artifact language

Only if the user wants feature artifacts in a language other than English. Add this
section to the preset's existing command files (`commands/speckit.clarify.md`,
`speckit.plan.md`, `speckit.converge.md`), and create append files with it for
`speckit.specify`, `speckit.tasks` and `speckit.checklist`, each with its entry in
`preset.yml` (`type: "command"`, `strategy: "append"`):

```markdown
## Artifact language

Write the text of the artifacts this command creates or edits in <language>. Keep the
template's headings and identifiers as they are.
```

Then update the preset as the maintenance skill says.

### 5. Constitution

You can't run `/speckit-constitution` (the integration option makes it user-only). Ask
the user for the project's principles; for each one, find the `AGENTS.md` section or
`doc/*.md` where its rule lives. Then give the user the full command to run: the
principles (each as a gate with its `Source:`, or with its rule stated directly when no
document has it yet) followed by this text:

```text
Each principle is a gate that /speckit-plan's "Constitution Check" must verify. The
rule's text and its rationale live in the linked document (AGENTS.md or a doc/*.md); if
they change there, the constitution stays untouched. A principle whose rule has no
document yet states it directly, and moves to a link when the document exists.
Governance:
- AGENTS.md and doc/*.md are the source of truth; the constitution only lists the gates
  and doesn't repeat their text.
- If the constitution disagrees with AGENTS.md, a doc/*.md or a skill, warn the user
  before acting, quoting both sources.
- Amendments are proposed to the user and applied only with their approval; the
  constitution changes only when a gate is added, removed or redefined.
- Semantic versioning: MAJOR when a gate is removed or redefined, MINOR when one is
  added, PATCH for wording.
- A violation in a plan is accepted only when justified in its "Complexity Tracking"
  section.
```

- Don't add a gate for the checks in `AGENTS.md` → Done when: they're verified when each
  change closes.
- If `AGENTS.md` has Testing, suggest a testing gate: every change names the test that
  covers it, and the feature has at least one test that exercises it the way a user
  would. `plan-template.md` refers to it.
- If a constitution already exists, running the command restructures it: tell the user
  and propose it as a change of its own.

### 6. Check

- `grep -rn "<<FILL" CLAUDE.md AGENTS.md doc/workflow.md presets .claude/skills/feature-session .claude/skills/spec-kit-maintenance`
  prints nothing.
- `grep -L "disable-model-invocation: true" .claude/skills/speckit-*/SKILL.md` prints
  nothing.
- `grep -n "Project rules for this phase" .claude/skills/speckit-{clarify,plan,converge}/SKILL.md`
  finds the three.
- `specify preset resolve plan-template` and `tasks-template` show
  `project-workflow` as the top layer.

### 7. First feature

Tell the user the flow: `/speckit-specify` → `/speckit-clarify` → `/speckit-plan` →
`/speckit-tasks` → `/speckit-analyze`, reviewing each phase's output before the next.
Then each row of the Sessions table is run in a new conversation with the command in its
"Command" column. Never `/speckit-implement`: it runs every phase in one go and rewrites
ignore files.

## Experimental: dual research

`<kit>/files/spec-kit/experimental/dual-research/` is a separate preset (append to
`speckit.plan`): the plan also writes `research.workflow.md`, the same decisions under the
project's rules, to compare against spec-kit's default `research.md`. Nothing else reads
it; `/feature-session` always reads `research.md`. Offer it only if the user wants that
comparison; install it like the main preset (into `presets/dual-research/`), and remove
it when the comparison stops adding anything.
