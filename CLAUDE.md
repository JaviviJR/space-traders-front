# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Vue 3 + Vite + TypeScript SPA: the front end of a SpaceTraders client.

## Commands

- `npm run dev`: Vite dev server on port 5173.
- `npm run type-check`: `vue-tsc --build`. `npm run build` runs it plus
  `vite build`.
- `npm run lint` (oxlint, then ESLint) and `npm run format` (Prettier) rewrite
  files in place; `format` only covers `src/`.
- `npm run generate:types`: regenerates `src/types/backend.ts` (gitignored,
  never edited by hand) from the back's OpenAPI spec at
  `http://localhost/api/doc.json`; the back must be running.
- Unit tests: `npx vitest run` (single run; `npm run test:unit` is watch mode),
  one file with `npx vitest run src/__tests__/App.spec.ts`, by name with
  `-t "name"`.
- e2e: no display here, so run headless against the preview build:
  `CI=1 npm run build && CI=1 npx playwright test`; one file and browser with
  `CI=1 npx playwright test e2e/register.spec.ts --project=chromium`.

`./dev` and `docker/compose.yml` are for the host; inside the container, run
the npm scripts directly.

## Decisions not visible in the code

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
- `primevue` and `@primevue/themes` stay on major 4, the last MIT-licensed
  one; never upgrade the major. Where to find their docs: `library-docs`
  skill.
- A feature isn't done until a test exercises it the way a user would
  (mount and interact, or an e2e flow), not just "it didn't throw".
- `eslint-plugin-oxlint` turns off the ESLint rules oxlint covers, so a lint
  rule change may need edits in both `.oxlintrc.json` and `eslint.config.ts`.
