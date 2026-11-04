---
name: library-docs
description: Where to find the official docs for this project's libraries (llms.txt indexes, the PrimeVue v4 mirror, VueUse by tag) and the research order docs → issues → source. Use before looking up a library API, choosing or suggesting a UI/component library, adding or upgrading a dependency, configuring a newly installed package, or diagnosing a bug inside a third-party library.
---

# Library docs

## Adding a capability

New capabilities come from an npm package (the user runs the install),
configured the way its own docs show (Vite plugin, Vue plugin, etc.). npm has
no recipe system that wires config for you, so read the library's setup docs
instead of guessing the config shape. Don't hand-roll what a library already
does well (routing, icons, HTTP, dialogs…).

## Choosing a UI/component library

Prefer unstyled or Tailwind-styled libraries. One with its own theme system is
fine only if its tokens are overridable and get reconfigured to our palette
(Tailwind colors and `@theme` tokens), not its default preset as-is. It must
support Vue 3 and the Tailwind major in `package.json` (check both and cite the
docs page), and be actively maintained.

## Where the docs are

Check the official docs when unsure how an API works or when the version
matters, and cite the page when a proposal relies on it. Exact installed
versions are in `package-lock.json`.

- With an `llms.txt` index of Markdown pages: Vue (`vuejs.org/llms.txt`),
  Vue Router (`router.vuejs.org/llms.txt`), Vite (`vite.dev/llms.txt`),
  Vitest (`vitest.dev/llms.txt`), Fontsource (`fontsource.org/llms.txt`).
  Fetch the specific page it links to. To search a whole site, download its
  `llms-full.txt` to the scratchpad and grep it instead of reading it into
  context.
- PrimeVue 4 (and `tailwindcss-primeui`, on the Tailwind page): frozen mirror
  at `v4.primevue.org` (its footer shows the version). Index at
  `v4.primevue.org/llms/llms.txt`, per-page Markdown at
  `v4.primevue.org/<page>.md`. The URLs listed inside that index point at
  `primevue.org`, which redirects to the current paid major: re-root each one
  onto `v4.primevue.org` before fetching.
- Without `llms.txt`: Pinia (`pinia.vuejs.org`), Vue Test Utils
  (`test-utils.vuejs.org`), Tailwind (`tailwindcss.com/docs`), Playwright
  (`playwright.dev`), Iconify (`iconify.design/docs`), VueUse (`vueuse.org`).
  VueUse's `/llms.txt` and `.md` URLs return its HTML homepage; for Markdown,
  read `packages/<package>/<function>/index.md` from its GitHub repo at tag
  `v<installed version>`, not `main`.
- When a dependency is added to `package.json`, check whether its docs site
  publishes `/llms.txt` and add it to the matching list above, in the same
  change.

## Research order for bugs and fixes

1. The library's official docs.
2. Its GitHub issues/discussions for the exact problem (a maintainer may have
   confirmed a pattern or workaround).
3. Only then its installed source and `.d.ts` files under `node_modules/`.

Reading source to confirm a root cause is fine once docs and issues are
exhausted. Reading source to design the fix itself is not: ask first, saying
what was already checked and why it wasn't enough. Flag any source-derived
solution as such when proposing it, not as a documented guarantee.
