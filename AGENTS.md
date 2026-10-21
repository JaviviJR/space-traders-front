# AGENTS.md

This is a Vue 3 + Vite + TypeScript SPA. Check `package.json` for exact
versions of Vue, Vite, Pinia, Vue Router and Tailwind in use. Don't assume a
library is available unless it's listed there.

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

## Adding features: npm, then its own docs

Installing and configuring a new library lives in
[doc/dependencies.md](doc/dependencies.md#adding-features-npm-then-its-own-docs).

## Conventions

Project conventions and the Vue style guide (Priority A/B) live in
[doc/conventions.md](doc/conventions.md#conventions).

## Design principles

SOLID adapted to components/composables/stores lives in
[doc/conventions.md](doc/conventions.md#design-principles).

## Everyday workflow

- Run npm scripts directly (no need for `./dev.sh` or `docker compose` from
  inside the container):
  - `npm run dev`: Vite dev server (port 5173)
  - `npm run build`: runs type-check (`vue-tsc --build`) and `vite build` in
    parallel
  - `npm run type-check`: type-check only
  - `npm run lint`: runs oxlint, then ESLint, both with `--fix`
  - `npm run format`: Prettier on `src/`
  - `npm run generate:types`: regenerates `src/types/backend.d.ts` (gitignored)
    from the back's OpenAPI spec via `openapi-typescript`. Run it after the
    back's API contract changes; needs the back reachable at the URL in the
    script.
  - `npm run test:unit` / `npm run test:e2e`: see
    [doc/testing.md](doc/testing.md#commands).
- When something fails, check the browser console and the Network tab before
  changing code — most front-end bugs show up there (a thrown error, a
  rejected fetch, an unexpected response shape) before they show up in the
  source.

## Testing

Where tests go, the definition of done, mocks and test setup live in
[doc/testing.md](doc/testing.md).

## Code style

oxlint and ESLint (`npm run lint`), Prettier (`npm run format`). A change
isn't done until lint, format and type-check are clean. `eslint-plugin-oxlint`
turns off the ESLint rules oxlint already covers, so a lint config change may
need edits in both `.oxlintrc.json` and `eslint.config.ts`.

From the Vue style guide (Priority C, formatting — enforce via lint config
rather than by hand): element/attribute order (`v-for` before `v-if` before
`ref`/`key` before `v-model` before other attributes before `v-on` before
`v-html`/`v-text`), and SFC top-level block order (`<script>`, `<template>`,
`<style>`, consistently).

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
- `npx vue-tsc --noEmit` / `npm run type-check`: the real type error, not a
  guessed one — read it before changing code.
- Browser DevTools (Network tab): the actual response shape from the backend,
  instead of assuming the SpaceTraders envelope.
- Library docs (`llms.txt` indexes, the PrimeVue mirror, `node_modules/`
  source): see [doc/dependencies.md](doc/dependencies.md#library-docs).

## Conflicts between sources

When two sources disagree (two skills, a skill and this file, or either of them and the official docs), tell the user before acting: name both sources, quote what each says, and say which one you will follow and why.

## Decision docs

They are not loaded automatically: read only the ones whose trigger matches
the task.

- [doc/architecture.md](doc/architecture.md): read before creating a file or
  folder under `src/`, adding a view, store, composable or `src/api/` module,
  deciding which layer owns a piece of logic, or changing how the front talks
  to the back (`VITE_API_URL`, dev proxy, error format).
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

When a decision changes, update the file in the same change.

## Working agreements

How the user wants to work with Claude (confirmations, learning mode,
proposals, installs, subagents, language). Loaded automatically every
session:

@doc/workflow.md
