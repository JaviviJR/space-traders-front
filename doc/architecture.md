# Arquitectura del front

Estructura objetivo. Las carpetas se crean cuando se necesitan por primera vez,
no antes.

## Capas

Vista → Componentes → Store / Composable → Capa API → fetch

Las dependencias solo van en ese sentido: un componente no hace `fetch`, y
`src/api/` no importa nada de Vue ni de Pinia.

## Carpetas

```
src/
├── api/          Único sitio con fetch. client.ts + un archivo por recurso
├── types/        Interfaces TS de los datos (Agent, Ship, Waypoint…)
├── stores/       Pinia: estado compartido por varias vistas (auth, agent)
├── composables/  Lógica reutilizable con estado local (useMarket…)
├── router/       Rutas y guards
├── views/        Una por ruta, cargadas de forma perezosa
├── components/
│   ├── ui/       Genéricos sin lógica de negocio (BaseButton, BaseCard)
│   ├── layout/   Carcasa de la app (AppHeader, AppFooter)
│   └── <feature>/  Una carpeta por funcionalidad (landing, fleet, market…)
├── assets/
└── __tests__/
```

> Nota: si el proyecto crece mucho (decenas de componentes), revisar si
> conviene pasar de carpetas por tipo (`components/`, `stores/`,
> `composables/`) a carpetas por feature/dominio. No es una recomendación
> oficial de Vue, pero es una opinión recurrente en la comunidad (p. ej.
> [certificates.dev](https://certificates.dev/blog/structuring-a-large-vue-app-a-feature-based-folder-architecture)):
> la estructura por tipo se vuelve incómoda a partir de ~50 componentes.

## Reglas por capa

- **views/**: delgadas. Leen parámetros de la ruta y componen componentes.
- **components/**: pintan UI. Props hacia abajo, eventos hacia arriba. Nunca
  llaman a la API.
- **stores/**: estado que usan varias vistas (sesión, datos del agente). Stores
  en formato _setup_. En componentes, leer el estado con `storeToRefs`. La
  [guía oficial de Vue sobre gestión de estado](https://vuejs.org/guide/scaling-up/state-management)
  respalda esta elección: recomienda Pinia frente a un store artesanal
  (`reactive()` en un módulo) cuando el equipo necesita convenciones más
  fuertes, integración con Vue Devtools (timeline, time-travel) o SSR.
- **composables/**: lógica con estado local de una vista o componente. Regla:
  empezar en local y subir a store solo cuando lo necesite más de una vista.
- **api/**: TypeScript puro. Cada función devuelve datos tipados o lanza
  `ApiError`. Quita el envelope `{ data }` (ver abajo) para que los stores
  reciban el recurso directamente.
- **types/**: al principio, generados del OpenAPI de SpaceTraders con
  `openapi-typescript`; después, del OpenAPI de nuestro back.

## Back (BFF)

El back vive en otro repositorio y hace de _Backend for Frontend_: todas las
peticiones del front van a él, y él llama a `api.spacetraders.io`.

- El front solo conoce el contrato del back (`VITE_API_URL`), nunca la API de
  SpaceTraders directamente.

## Tests

- Unitarios (Vitest): simular los módulos de `src/api/` con `vi.mock`.
- e2e (Playwright): interceptar las peticiones al back con `page.route()`.
  Los mocks siguen el contrato del back, no el de SpaceTraders.
- Unos pocos e2e contra el back real, más adelante, para los flujos críticos.
- Los tests unitarios que montan `App` necesitan el plugin del router y
  `await router.isReady()` más `flushPromises()`, porque las vistas se cargan
  de forma perezosa.
- El alias `@` apunta a `src/` (`vite.config.ts`; `vitest.config.ts` hereda
  esa config, así que los tests también tienen el alias). Los tests unitarios
  viven en `src/__tests__/`; `e2e/` tiene las specs de Playwright y está
  excluido de Vitest.

## Pendiente de decidir

- Formato exacto de los errores: comprobar con una respuesta real de
  SpaceTraders antes de fijarlo.
- Proxy de Vite (`server.proxy`) hacia el back en desarrollo: al conectar el
  primer endpoint.
- Internacionalización (`vue-i18n`): los textos están en español por ahora.
