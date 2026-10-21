# Front-end architecture

Target structure. Folders are created when they're first needed, not
before.

## Layers

View → Components → Store / Composable → API layer → fetch

Dependencies only go in that direction: a component doesn't call `fetch`, and
`src/api/` imports nothing from Vue or Pinia.

## Folders

```
src/
├── api/          The only place with fetch. client.ts + one file per resource
├── types/        TS interfaces for the data (Agent, Ship, Waypoint…)
├── stores/       Pinia: state shared by several views (auth, agent)
├── composables/  Reusable logic with local state (useMarket…)
├── router/       Routes and guards
├── views/        One per route, lazy-loaded
├── components/
│   ├── ui/       Generic, no business logic (BaseButton, BaseCard)
│   ├── layout/   App shell (AppHeader, AppFooter)
│   └── <feature>/  One folder per feature (landing, fleet, market…)
├── assets/
└── __tests__/
```

> Note: if the project grows a lot (dozens of components), reconsider
> switching from folders by type (`components/`, `stores/`,
> `composables/`) to folders by feature/domain. It isn't an official Vue
> recommendation, but it's a recurring opinion in the community (e.g.
> [certificates.dev](https://certificates.dev/blog/structuring-a-large-vue-app-a-feature-based-folder-architecture)):
> the by-type structure becomes awkward beyond ~50 components.

## Rules per layer

- **views/**: thin. They read route parameters and compose components.
- **components/**: render UI. Props down, events up. They never call the
  API.
- **stores/**: state used by several views (session, agent data). Stores in
  _setup_ format. In components, read the state with `storeToRefs`. The
  [official Vue guide on state management](https://vuejs.org/guide/scaling-up/state-management)
  backs this choice: it recommends Pinia over a hand-rolled store
  (`reactive()` in a module) when the team needs stronger conventions,
  Vue Devtools integration (timeline, time-travel) or SSR.
- **composables/**: logic with local state for one view or component. Rule:
  start local and move up to a store only when more than one view needs it.
- **api/**: plain TypeScript. Each function returns typed data or throws
  `ApiError`. It strips the `{ data }` envelope so stores receive the
  resource directly.

## Back (BFF)

The back lives in another repository and acts as a _Backend for Frontend_:
every request from the front goes to it, and it calls `api.spacetraders.io`.

- The front only knows the back's contract (`VITE_API_URL`), never the
  SpaceTraders API directly.

## Tests

Test setup (mocking `src/api/`, intercepting the back in e2e, mounting `App`)
lives in [testing.md](testing.md).

## UI / component libraries

The styling policy for UI libraries lives in
[ui.md](ui.md#ui--component-libraries).

## Pending decisions

- Exact error format: check against a real SpaceTraders response before
  settling it.
- Vite proxy (`server.proxy`) to the back in development: when connecting
  the first endpoint.
- Internationalization (`vue-i18n` + `@intlify/unplugin-vue-i18n`): texts are
  in Spanish for now.
