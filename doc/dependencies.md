# Dependencies and library docs

## Adding features: npm, then its own docs

New capabilities come from an npm package (the user runs the install, see
below), configured the way its own docs show (Vite plugin, Vue plugin, etc.).
Unlike Symfony Flex, npm has no recipe system that auto-wires config for you —
so after installing, check the library's setup docs yourself rather than
guessing the config shape.
Don't hand-roll what a library already does well (routing, icons, HTTP,
dialogs...); check [Library docs](#library-docs) before adding anything, and
new dependencies follow the install rule in
[Steps and installs](workflow.md#steps-and-installs).

## Library docs

- Docs: when unsure how a library API works, or when the version matters,
  check the official docs before writing code, and cite the page when a
  proposal relies on them.
  - Vue, Vue Router, Vite, Vitest and Fontsource publish an `llms.txt` index
    of Markdown pages: `vuejs.org/llms.txt`, `router.vuejs.org/llms.txt`,
    `vite.dev/llms.txt`, `vitest.dev/llms.txt`, `fontsource.org/llms.txt`.
    Fetch the specific page it links to. To search a whole site, download its
    `llms-full.txt` to the scratchpad and grep it instead of reading it into
    context.
  - PrimeVue: `primevue`/`@primevue/themes` stay on major 4, the last MIT
    one — newer majors require a PrimeUI license. The version range in
    `package.json` blocks the next major and the lockfile fixes the exact
    version; don't upgrade the major. Docs for major 4 live at
    `v4.primevue.org`, a frozen mirror (its footer shows the version): index at
    `v4.primevue.org/llms/llms.txt`, per-page Markdown at
    `v4.primevue.org/<page>.md`. Don't follow the URLs listed _inside_ that
    index as given — they point at `primevue.org`, which now redirects to the
    current (paid) major version's site; re-root each one onto
    `v4.primevue.org` before fetching. `tailwindcss-primeui`'s own docs live
    on the same mirror's Tailwind page, no separate index.
  - Pinia, Vue Test Utils, Tailwind, Playwright, Iconify and VueUse have no
    `llms.txt`; use their regular docs (`pinia.vuejs.org`,
    `test-utils.vuejs.org`, `tailwindcss.com/docs`, `playwright.dev`,
    `iconify.design/docs`, `vueuse.org`). VueUse's `/llms.txt` and `.md` URLs
    return its HTML homepage; for Markdown, read
    `packages/<package>/<function>/index.md` from its GitHub repo at the tag
    `v<installed version>` (see `package-lock.json`), not `main`.
  - When a dependency is added to `package.json` (by the user or by Claude),
    check whether its docs site publishes `/llms.txt`. If it does, add it to
    the `llms.txt` bullet; if not, add its regular docs URL to the
    regular-docs bullet. Include this edit in the same change that adds the
    dependency.
- Read installed source and `.d.ts` files under `node_modules/` when the docs
  don't settle the exact behaviour of the installed version.

## Research order for bugs and solutions

- When diagnosing a bug or designing a fix involving a third-party library,
  check in this order: (1) the library's official docs, (2) its GitHub
  issues/discussions for the exact problem (a maintainer may have confirmed a
  pattern or workaround), (3) only then its vendored/installed source
  (`node_modules` or equivalent).
- Reading source to confirm a root cause once docs/issues are exhausted is
  fine. Reading source to _design the fix itself_ is not: ask first, stating
  what's already been checked and why it wasn't enough.
- Any solution that ends up source-derived (not confirmed by docs or an
  issue thread) must be flagged as such when proposed, not presented as a
  documented guarantee.

## Introducing new libraries in code

- The first time a reusable-capability library is used in code (component,
  composable or store) — what
  ["Adding features"](#adding-features-npm-then-its-own-docs) above refers to
  (VueUse, future dialog/table/HTTP libs...) — explain it in three steps, in
  this order: (1) how it would be done without the library, (2) what specific
  problem the library solves in that case, (3) the implementation with the
  library.
- Does not apply to: build/dev tooling (Vite, Vitest, Playwright, ESLint,
  oxlint, Prettier, vue-tsc), the already-settled base trio (Vue, Vue
  Router, Pinia), type-only or codegen packages (`@types/*`,
  openapi-typescript), or fonts/icons (already covered by
  ["Design suggestions"](ui.md#design-suggestions)).
- This explanation repeats every time a new use is introduced, until the
  user asks to stop doing it for that specific case. List of exceptions
  already granted (composable/library → no longer needs the three steps):
  - _(empty for now)_
