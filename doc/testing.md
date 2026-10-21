# Testing

Unit tests (Vitest + Vue Test Utils) go in `src/__tests__/`; e2e tests
(Playwright) go in `e2e/`. A feature isn't done until it has a test that
exercises it the way a user would — mounting the component/view and
interacting with it, or an e2e flow for a user journey — not just "it didn't
throw." Mocks in tests must follow the backend's response contract
([architecture.md](architecture.md)), not an invented shape.

## Commands

- `npm run test:unit`: Vitest (jsdom) in watch mode. For a single run use
  `npx vitest run`; for one file, `npx vitest run src/__tests__/App.spec.ts`;
  filter by name with `-t "name"`.
- `npm run test:e2e`: Playwright (chromium, firefox, webkit). For one file
  and browser: `npx playwright test e2e/vue.spec.ts --project=chromium`.
  Playwright starts `npm run dev` unless a server is already running.
  Browsers run headed unless `CI` is set, and there is no display here, so
  use `CI=1 npm run build && CI=1 npx playwright test` (with `CI` it
  serves `npm run preview` on port 4173).

## Test setup

- Unit (Vitest): mock the `src/api/` modules with `vi.mock`.
- e2e (Playwright): intercept requests to the back with `page.route()`.
  Mocks follow the back's contract, not SpaceTraders'.
- A few e2e tests against the real back, later on, for the critical flows.
- Unit tests that mount `App` need the router plugin and
  `await router.isReady()` plus `flushPromises()`, because views are
  lazy-loaded.
- The `@` alias points to `src/` (`vite.config.ts`; `vitest.config.ts`
  inherits that config, so tests also have the alias). Unit tests live in
  `src/__tests__/`; `e2e/` holds the Playwright specs and is excluded from
  Vitest.

## Pending decisions

- Test coverage (`@vitest/ui` + `@vitest/coverage-v8`): interactive
  visualization of Vitest coverage.
