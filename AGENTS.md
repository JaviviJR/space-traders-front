# AGENTS.md

This is a Vue 3 + Vite + TypeScript SPA. Don't assume a library is available
unless it's listed in `package.json`.

## Ask before generating

If the task doesn't specify, ask rather than guess:

- State: a new Pinia store, a composable, or local component state?
- Data flow: does this need a new `src/api/` module, or does an existing one
  cover it?
- Styling: Tailwind utility classes, or does this warrant a new `@theme`
  token?

If you can't ask, state the assumption you're making and pick the smallest
option (e.g. local `ref` over a Pinia store) rather than scaffolding more than
asked.

## Everyday workflow

- You're inside the container: run the npm scripts directly, not `./dev` or
  `docker compose` (those are for the host).
- The scripts live in `package.json`. What their names don't tell you:
  - `npm run lint` and `npm run format` rewrite files in place.
  - `npm run format` only covers `src/`.
  - `npm run generate:types` regenerates the back's contract types
    (gitignored) from its OpenAPI spec. Run it after the back's API contract
    changes; it needs the back reachable at the URL in the script.
  - Tests: see [doc/testing.md](doc/testing.md#commands).

## Code style

oxlint and ESLint (`npm run lint`), Prettier (`npm run format`). A change
isn't done until lint, format and type-check are clean. `eslint-plugin-oxlint`
turns off the ESLint rules oxlint already covers, so a lint config change may
need edits in both `.oxlintrc.json` and `eslint.config.ts`.

Lint and Prettier enforce the parts of the Vue style guide a tool can check;
the rules that are judgment calls live in
[doc/conventions.md](doc/conventions.md#conventions).

## Static analysis

`vue-tsc --build` (part of `npm run build` and `npm run type-check`) is the
type checker. Fix the cause of a type error; don't reach for `any`, a
non-null assertion (`!`), or `// @ts-ignore` to silence it without asking
first.

## Discover, don't guess

Framework APIs change between major versions (Vue 2→3, Vue Router 3→4→5,
Pinia options→setup stores) and your training data may be stale. Look things
up instead of relying on memory:

- `package.json` / `package-lock.json`: exact installed versions — check
  before assuming an API shape.
- Vue Devtools (bundled via `vite-plugin-vue-devtools` in `vite.config.ts`):
  inspect the live component tree, props, Pinia state, router state and
  emitted events at runtime, instead of guessing what a component renders.
- `npm run type-check`: the real type error, not a guessed one — read it
  before changing code.
- Browser console and DevTools Network tab: when something fails, check them
  before changing code — a thrown error, a rejected fetch, or a response
  shape that doesn't match the generated types usually shows up there before
  it shows up in the source.

## Conflicts between sources

When two sources disagree (two skills, a skill and this file, or either of them and the official docs), tell the user before acting: name both sources, quote what each says, and say which one you will follow and why.

## Decision docs

They are not loaded automatically: read only the ones whose trigger matches
the task.

- [doc/architecture.md](doc/architecture.md): read before creating a file or
  folder under `src/`, adding a view, store, composable or `src/api/` module,
  deciding which layer owns a piece of logic, or changing how the front talks
  to the back (base URL, CORS, error format).
- [doc/conventions.md](doc/conventions.md): read before writing or reviewing
  a `.vue` component, a Pinia store or a composable, or naming a component.
- [doc/testing.md](doc/testing.md): read before writing or changing a test,
  mocking `src/api/` or the back, running Vitest or Playwright, or writing
  the testing part of a proposal.
- [doc/dependencies.md](doc/dependencies.md): read before adding or upgrading
  a dependency, using a library in code for the first time, looking up a
  library's API or docs, or diagnosing a bug inside a third-party library.
- [doc/ui.md](doc/ui.md): read before working on UI (templates, styles,
  layout), suggesting design improvements, or choosing a UI/component
  library.

## Where documentation lives

- `doc/*.md` and this file describe the generic mechanism and how to add a
  case (steps, rules, conventions), not an inventory of implementations.
  Don't copy lists the code already expresses (routes, stores, type fields,
  endpoints, the components in a folder) or literal config values (URLs,
  ports, env vars, tool options): say what they do and point to the file.
- When a decision is closed or changes, record it in the same change that
  applies it:
  - A mechanism that applies to several files: the `doc/*.md` whose trigger
    above covers it.
  - Something specific to one component, store, composable or module (why
    this value, what it deliberately doesn't do, which alternatives were
    rejected for it): a comment in that file — a `/** */` header at the top
    of the `<script setup>` or the `.ts` file when it's about the whole file,
    a one-line `//` next to the line when it's a local trap. Only write it
    when removing it would likely lead a future reader to "simplify" the code
    back into the problem it avoids.
- A single case never becomes a `doc/*.md` rule. When a second case appears,
  propose to the user whether to generalize it into `doc/` or keep a comment
  in each file.
- Record only what was decided: what won't be done isn't recorded, except a
  rejected alternative's one-sentence summary with the condition to revisit
  it. When a decision changes, rewrite the existing text instead of appending
  a note.

## Working agreements

How the user wants to work with Claude. Loaded automatically every session:

@doc/workflow.md
