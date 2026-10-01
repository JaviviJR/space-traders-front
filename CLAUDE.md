# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Frontend for SpaceTraders built with Vue 3 + Vite + TypeScript, Pinia (state), Vue Router and Tailwind CSS v4. It is still a fresh scaffold: `App.vue` renders a single Tailwind-styled "Hola mundo" page, the router has no routes yet, and there are no stores (Pinia is installed in `main.ts`).

Tailwind is configured from CSS: the `@tailwindcss/vite` plugin is in `vite.config.ts`, `src/assets/main.css` imports Tailwind, and any customization goes in `@theme` blocks there. There is no `tailwind.config.js`.

Requires Node `^22.18.0 || >=24.12.0`.

## Commands

- Node isn't installed on the host; run these inside the container (`./dev.sh sh`). Also run `npm ci` there: `node_modules` holds platform-specific native binaries (rolldown, oxlint), so an install made on a different OS/libc breaks `vite`.
- `npm run dev`: Vite dev server (port 5173)
- `npm run build`: runs type-check (`vue-tsc --build`) and `vite build` in parallel
- `npm run type-check`: type-check only
- `npm run lint`: runs oxlint, then ESLint, both with `--fix`
- `npm run format`: Prettier on `src/`
- `npm run test:unit`: Vitest (jsdom) in watch mode. For a single run use `npx vitest run`; for one file, `npx vitest run src/__tests__/App.spec.ts`; filter by name with `-t "name"`.
- `npm run test:e2e`: Playwright (chromium, firefox, webkit). For one file and browser: `npx playwright test e2e/vue.spec.ts --project=chromium`. Playwright starts `npm run dev` unless a server is already running. Browsers run headed unless `CI` is set, and the container has no display, so there use `CI=1 npm run build && CI=1 npx playwright test` (with `CI` it serves `npm run preview` on port 4173). The image installs the browsers into `/home/ubuntu/.cache/ms-playwright`.

## Architecture notes

- Alias `@` maps to `src/` (set in `vite.config.ts`; `vitest.config.ts` merges that config, so tests get the alias too). Unit tests live in `src/__tests__/`. `e2e/` holds the Playwright specs and is excluded from Vitest.
- Unit and e2e tests assert on the "Hola mundo" text in `App.vue`. Update them when that page changes.
- Linting uses both oxlint and ESLint. `eslint-plugin-oxlint` turns off the ESLint rules oxlint already covers, so a lint config change may need edits in both `.oxlintrc.json` and `eslint.config.ts`.
- The dev environment is a Docker container (`docker/compose.yml`, service `node`, idle on `sleep infinity`) wrapped by `./dev.sh`: `up`, `down`, `build`, `sh`, `sh-root`, `logs`, and any other arguments are passed to `docker compose`. The image (`docker/node/Dockerfile`) is Ubuntu 26.04 with Node from NodeSource (`NODE_MAJOR`) and Playwright's system deps and browsers (`PLAYWRIGHT_VERSION`; keep it in step with `@playwright/test` in `package-lock.json`). The container uses host networking and mounts `APP_DIR` from `docker/.env` at `/home/ubuntu/app` (user `ubuntu`, UID 1000, with passwordless `sudo`). `./dev.sh sh` and `sh-root` open `bash`. `.devcontainer/` attaches VS Code to the same compose service.
