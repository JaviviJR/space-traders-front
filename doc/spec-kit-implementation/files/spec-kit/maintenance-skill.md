---
name: "spec-kit-maintenance"
description: "Rules for changing this project's spec-kit setup. Use when running the specify CLI, upgrading spec-kit, adding, removing or editing a preset, changing the Claude integration or its options, or when a task would edit files spec-kit generates (.claude/skills/speckit-*, .specify/)."
---

## Running the CLI

- Run it from the repo root, always as
  `uvx --from git+https://github.com/github/spec-kit.git@v<version> specify …`, where
  `<version>` is the one in `.specify/integration.json`. Without the pin, `uvx` runs the
  latest release, and a command like `integration upgrade` would bring new templates and
  skills unnoticed.
- Present each command that changes files before running it.

## Generated files

Never edit by hand what spec-kit generates or installs: `.claude/skills/speckit-*`,
`.specify/templates/*.md`, `.specify/scripts/`, `.specify/presets/`. An upgrade or a
`--force` regenerates them and undoes the edit. Change spec-kit's behaviour only through
its mechanisms: a preset in `presets/<id>/`, the integration options, or
`.specify/extensions.yml`.

## Presets

- A preset's source lives in `presets/<id>/` (tracked); installing it copies it into
  `.specify/presets/<id>/`. To change one, edit `presets/<id>/` and run
  `specify preset update <id> --dev presets/<id>`.
- Each replaced template starts with a comment listing its differences from the core
  template; keep it accurate when editing the template.
- `.specify/templates/overrides/` takes precedence over presets: don't add an override for
  a template a preset replaces. `specify preset resolve <template>` shows which layer wins.
- Installing, updating or removing a preset resets `disable-model-invocation` in the
  skills it touches. After every such change, run
  `specify integration upgrade claude --force` and check that
  `grep -L "disable-model-invocation: true" .claude/skills/speckit-*/SKILL.md` prints
  nothing.

## Integration options

- `--no-model-invocation` keeps every core `speckit-*` skill user-invocable only, so you
  can't launch a phase (e.g. `/speckit-implement`) on your own. An `integration upgrade`
  that passes `--integration-options` replaces the stored ones: always include it.
- If an extension's mandatory hook runs a core command, this option breaks that hook:
  tell the user before installing such an extension.

## Upgrading spec-kit

Raising the version is a change of its own, proposed to the user with what the release
notes between both versions change.

1. Run `specify integration upgrade claude` with the new version (the constitution and
   `specs/` are left untouched). If it stops on locally modified files, show them to the
   user; rerun with `--force` only once they agree.
2. Check `.specify/integration.json` records the new version and the options.
3. Compare each template a preset replaces with the new core template
   (`.specify/templates/<name>.md`): the differences must be only those listed in its
   header comment. Report any new core text and, with the user's agreement, bring it into
   `presets/<id>/` and update the preset.
4. Run the `disable-model-invocation` check above, and check that each preset's appended
   section is still at the end of its `speckit-*` skill.

## Adding something back

The kit this setup came from stays in the repo, in `<<FILL: the kit folder's path>>`. To
add back a section, a skill or the experimental preset, take it from there as its
`GUIDE.md` says.
