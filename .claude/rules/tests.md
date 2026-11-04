---
paths:
  - "src/__tests__/**"
  - "e2e/**"
---

# Tests

- Unit (Vitest): mock the `src/api/` modules with `vi.mock`.
- e2e (Playwright): intercept requests to the back with `page.route()`.
- Mocks follow the back's contract (the generated types in
  `src/types/backend.ts`), not SpaceTraders' API or an invented shape.
- Unit tests that mount `App` need the router plugin, `await router.isReady()`
  and `flushPromises()`, because views are lazy-loaded.
