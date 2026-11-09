# AGENTS.md

This is a Vue 3 + Vite + TypeScript SPA: the front end of a SpaceTraders
client.

## Ask before generating

If the task doesn't specify, ask rather than guess:

- State: local component state, a composable, or a Pinia store?
- Data: a new `src/api/` module, or does an existing one cover it?
- UI: a PrimeVue component, plain markup with Tailwind, or a new `@theme`
  token?

If you can't ask, say what you're assuming and pick the smallest option
(a local `ref` over a store).

## Adding features: a library, not hand-rolling

New capabilities come from an npm package, configured the way its own docs show
(Vite plugin, Vue plugin…). Don't skip a good-fit library because it isn't
installed yet; installing it is one command.

Read [doc/libraries.md](doc/libraries.md) before looking up a library's API,
choosing or suggesting a library (UI ones included), adding or upgrading a
dependency, or diagnosing a bug inside a third-party library. It lists where
each library's docs live and the research order for bugs.

## Architecture

- The back lives in another repository and is a BFF: the front only knows its
  contract (`src/types/backend.ts`), never the SpaceTraders API. Its CORS
  config (which front origins it allows) lives there too, so a CORS error is
  fixed in the back, not here.
- Dependencies flow one way: view → component → composable/store →
  `src/api/` → `fetch`. Components never call the API; `src/api/client.ts` is
  the only place that calls `fetch`.
- Views are thin: they read route params and compose components.
- Logic stays in its component unless it calls `src/api/` or has its own state
  and side effects; then it goes to a composable. A Pinia store (setup syntax,
  read with `storeToRefs`) only when several views share the state.

## API layer and error handling

- Plain TypeScript: imports nothing from Vue or Pinia. Each function returns
  typed data or throws `ApiError`.
- `ApiError` (in `src/api/errors/`) is the base; each contract error schema
  that extends it gets a subclass with the same name and its extra fields, and
  `toApiError.ts` picks the subclass from the response's `code`.
- Error handling branches on `ApiError`'s `code`, never on `status` or the text
  of `message`. Callers catch `ApiError` and use `instanceof` on a subclass
  only when they need its extra fields.
- Import error modules from their own file, not through a re-exporting index.
- When writing an endpoint function, check in the generated types which error
  schema it returns for each status.
- To add an error extension: the back adds it to its contract, run
  `npm run generate:types`, then add the subclass next to `ApiError` and its
  `code` mapping in `toApiError.ts`.

## Conventions

- `<script setup lang="ts">` in every component.
- Use what the stack already does: Vue Router for navigation (by route name,
  not hardcoded paths), PrimeVue components for UI widgets (dialogs, tabs,
  inputs, messages…), Pinia for shared state.
- Before hand-writing a composable around a browser API or a common reactive
  pattern (storage, events, timers, media queries…), check whether VueUse
  covers it. It usually does.
- Style with Tailwind utility classes in templates. New design tokens go in the
  `@theme` block of `src/assets/main.css`, not a new config file. Global CSS
  goes in `main.css` too.
- Don't style a child component's internals with descendant variants
  (`[&_p]:…`, `*:…`); use its props or styling API.
- Prefer `computed` over a watcher that only derives a value; use
  `watch`/`watchEffect` only for side effects.
- UI text is in Spanish (there is no i18n yet).
- `primevue` and `@primevue/themes` stay on major 4, the last MIT-licensed
  one; never upgrade the major. Its docs are the frozen mirror at
  `v4.primevue.org`, not `primevue.org`.

## Design principles (SOLID)

All code follows SOLID, applied to components, composables and stores:

- **Single responsibility**: a component renders; a composable or store holds
  the logic.
- **Open/closed**: add a new component or composable instead of branching an
  existing one on a type/mode prop when the branches don't share markup.
- **Liskov substitution**: every variant of a slot- or prop-driven component
  honors the same contract; no variant needs extra required props.
- **Interface segregation**: props and composable return types are minimal
  and role-specific; a component never accepts props it ignores.
- **Dependency inversion**: components depend on composables and stores, never
  on `src/api/` or `fetch` directly; composables depend on injected state
  (provide/inject, arguments), not global singletons.

## Everyday workflow

- You're inside the dev container: run the npm scripts directly; `./dev` and
  `docker/compose.yml` are for the host.
- `npm run type-check` (`vue-tsc --build`) checks types; `npm run build` runs
  it plus `vite build`.
- When the back's contract changes, run `npm run generate:types` to regenerate
  `src/types/backend.ts`. It reads `http://localhost/api/doc.json`, so the
  back must be running.

## Testing

- Unit: `npx vitest run` (single run; `npm run test:unit` is watch mode), one
  file with `npx vitest run src/__tests__/App.spec.ts`, by name with
  `-t "name"`.
- e2e: there's no display here, so run headless against the preview build:
  `CI=1 npm run build && CI=1 npx playwright test`; one file and browser with
  `CI=1 npx playwright test e2e/register.spec.ts --project=chromium`.
- Unit tests mock the `src/api/` modules with `vi.mock`; e2e tests intercept
  requests to the back with `page.route()`. Mocks follow the back's contract
  (the generated types), not SpaceTraders' API or an invented shape.
- Unit tests that mount `App` need the router plugin, `await router.isReady()`
  and `flushPromises()`, because views are lazy-loaded.

A feature isn't done until it has a test that exercises it the way a user
would (mount the component and interact with it, or an e2e flow for a user
journey), not just "it didn't throw."

## Code style

`npm run lint` and `npm run format` rewrite files in place; `format` only
covers `src/`. `eslint-plugin-oxlint` turns off the ESLint rules oxlint
covers, so a lint rule change may need edits in both `.oxlintrc.json` and
`eslint.config.ts`.
