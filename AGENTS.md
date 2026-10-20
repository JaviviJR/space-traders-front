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

Install new capabilities with `npm install <package>`, then configure it the
way its own docs show (Vite plugin, Vue plugin, etc.). Unlike Symfony Flex,
npm has no recipe system that auto-wires config for you — so after installing,
check the library's setup docs yourself rather than guessing the config shape.
Don't hand-roll what a library already does well (routing, icons, HTTP,
dialogs...); check "Official docs" (section 10) before adding anything, and
new dependencies follow the show-first rule in CLAUDE.md.

## Conventions

Project-specific conventions, not covered by the official style guide:

- Composition API only, `<script setup lang="ts">` in every component — no
  Options API, no mixins.
- Shared state lives in Pinia **setup stores** (not the options-style
  `defineStore` with an object). Local, non-shared state lives in composables
  (`src/composables/`) or component `ref`/`reactive`.
- Views go in `src/views/` (lazy-loaded via the router), feature components in
  `src/components/<feature>/`, generic/reusable UI in `src/components/ui/`.
- Only `src/api/` calls `fetch`; it imports nothing from Vue or Pinia. Stores
  and composables call into `src/api/`, never `fetch` directly.
- Style with Tailwind utility classes in templates. New design tokens go in
  the `@theme` block in `src/assets/main.css`, not a new config file.
- Prefer `computed` over a watcher that just derives a value; reach for
  `watch`/`watchEffect` only for side effects.

From the official [Vue style guide](https://vuejs.org/style-guide), Priority A
(essential, non-negotiable):

- Multi-word component names (`TodoItem`, not `Todo`) — avoids clashes with
  current/future HTML elements. Root `App` is exempt.
- Props declared with at least their type(s) — never a bare array like
  `['status']`.
- `v-for` always has a unique `:key` (required on components).
- Never `v-if` and `v-for` on the same element — filter via a computed
  property, or wrap in `<template>`.
- Component-scoped styling (`scoped`, CSS Modules, or a class convention) on
  every component except the root `App`/layout components.

Priority B (strongly recommended — follow unless there's a reason not to):

- One component per file; SFC filename in PascalCase or kebab-case,
  consistently.
- Prefix generic, app-wide-styled base components with `Base`/`App`/`V`
  (e.g. `BaseButton`).
- Prefix a child component tightly coupled to one parent with the parent's
  name (`TodoListItem`).
- Component name word order: general → specific (`SearchButtonClear`).
- Self-close components with no content in SFCs; never in in-DOM templates.
- PascalCase for component names in SFC templates.
- Full words over abbreviations in component names.
- Props: camelCase in JS, kebab-case in in-DOM templates.
- Multiple attributes on an element → one per line.
- Keep template expressions simple; move logic into computed properties or
  methods.
- Split a complex computed into several smaller, well-named ones.
- Quote every non-empty attribute value.
- Use directive shorthands (`:`, `@`, `#`) consistently — always or never.

One style-guide pair is cross-referenced elsewhere, not repeated here:
component/attribute ordering and SFC block order are formatting, enforced by
lint/Prettier — see section 8 (Code style).

## Design principles

Write code that follows SOLID, adapted to components/composables/stores:

- **Single responsibility.** A component renders; a composable or store holds
  logic. Don't let a component reach into `src/api/` directly — go through a
  store or composable.
- **Open/closed.** Add a new component or composable instead of branching an
  existing one on a type/mode prop when the branches don't share markup.
- **Liskov substitution.** A component that accepts a slot or prop-driven
  variant honors the same contract across variants — no variant that needs
  extra required props.
- **Interface segregation.** Keep props/composable return types minimal and
  role-specific. Don't make a component accept props it ignores.
- **Dependency inversion.** Components depend on composables/stores, not on
  `src/api/` or `fetch` directly; composables depend on injected state, not
  global singletons.

Don't introduce a composable or store for logic used in exactly one component.
Prefer the smallest structure that satisfies these principles.

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
  - `npm run test:unit`: Vitest (jsdom) in watch mode. For a single run use
    `npx vitest run`; for one file, `npx vitest run src/__tests__/App.spec.ts`;
    filter by name with `-t "name"`.
  - `npm run test:e2e`: Playwright (chromium, firefox, webkit). For one file
    and browser: `npx playwright test e2e/vue.spec.ts --project=chromium`.
    Playwright starts `npm run dev` unless a server is already running.
    Browsers run headed unless `CI` is set, and there is no display here, so
    use `CI=1 npm run build && CI=1 npx playwright test` (with `CI` it
    serves `npm run preview` on port 4173).
- When something fails, check the browser console and the Network tab before
  changing code — most front-end bugs show up there (a thrown error, a
  rejected fetch, an unexpected response shape) before they show up in the
  source.

## Testing

Unit tests (Vitest + Vue Test Utils) go in `src/__tests__/`; e2e tests
(Playwright) go in `e2e/`. A feature isn't done until it has a test that
exercises it the way a user would — mounting the component/view and
interacting with it, or an e2e flow for a user journey — not just "it didn't
throw." Mocks in tests must follow the backend's response contract
(`doc/architecture.md`), not an invented shape.

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
- Docs: when unsure how a library API works, or when the version matters,
  check the official docs before writing code, and cite the page when a
  proposal relies on them.
  - Vue, Vue Router, Vite, Vitest and Fontsource publish an `llms.txt` index
    of Markdown pages: `vuejs.org/llms.txt`, `router.vuejs.org/llms.txt`,
    `vite.dev/llms.txt`, `vitest.dev/llms.txt`, `fontsource.org/llms.txt`.
    Fetch the specific page it links to. To search a whole site, download its
    `llms-full.txt` to the scratchpad and grep it instead of reading it into
    context.
  - PrimeVue: this project pins `primevue`/`@primevue/themes` to
    `4.5.5`/`4.5.4` (the last MIT release — newer majors require a PrimeUI
    license). Docs for that exact version live at `v4.primevue.org`, a frozen
    mirror (footer confirms "PrimeVue 4.5.5"): index at
    `v4.primevue.org/llms/llms.txt`, per-page Markdown at
    `v4.primevue.org/<page>.md`. Don't follow the URLs listed *inside* that
    index as given — they point at `primevue.org`, which now redirects to the
    current (paid) major version's site; re-root each one onto
    `v4.primevue.org` before fetching. `tailwindcss-primeui`'s own docs live
    on the same mirror's Tailwind page, no separate index.
  - Pinia, Vue Test Utils, Tailwind, Playwright and Iconify have no
    `llms.txt`; use their regular docs (`pinia.vuejs.org`,
    `test-utils.vuejs.org`, `tailwindcss.com/docs`, `playwright.dev`,
    `iconify.design/docs`).
  - When a dependency is added to `package.json` (by the user or by Claude),
    check whether its docs site publishes `/llms.txt`. If it does, add it to
    the first bullet; if not, add its regular docs URL to the second. Include
    this edit in the same change that adds the dependency.
- Read installed source and `.d.ts` files under `node_modules/` when the docs
  don't settle the exact behaviour of the installed version.

## Conflicts between sources

When two sources disagree (two skills, a skill and this file, or either of them and the official docs), tell the user before acting: name both sources, quote what each says, and say which one you will follow and why.

## Architecture decisions

Read this before designing or generating code that touches its area:

- `doc/architecture.md`: layer rules (views → components →
  stores/composables → `src/api/` → fetch), folder structure, the response
  envelope (`{ data }` / `{ data, meta }`), and the BFF contract with the
  backend.

When a decision changes, update the file in the same change.

## Working agreements

How the user wants to work with Claude (confirmations, proposals, learning
mode, design suggestions, installs, language). Read `doc/workflow.md` at the
start of every session.
