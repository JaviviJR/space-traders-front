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

## Reglas por capa

- **views/**: delgadas. Leen parámetros de la ruta y componen componentes.
- **components/**: pintan UI. Props hacia abajo, eventos hacia arriba. Nunca
  llaman a la API.
- **stores/**: estado que usan varias vistas (sesión, datos del agente). Stores
  en formato *setup*. En componentes, leer el estado con `storeToRefs`.
- **composables/**: lógica con estado local de una vista o componente. Regla:
  empezar en local y subir a store solo cuando lo necesite más de una vista.
- **api/**: TypeScript puro. Cada función devuelve datos tipados o lanza
  `ApiError`. Quita el envelope `{ data }` (ver abajo) para que los stores
  reciban el recurso directamente.
- **types/**: al principio, generados del OpenAPI de SpaceTraders con
  `openapi-typescript`; después, del OpenAPI de nuestro back.

## Envelope de las respuestas

La API de SpaceTraders no devuelve los datos directamente, sino envueltos en una
propiedad `data` (el *envelope*). `GET /my/agent` devuelve:

```json
{
  "data": {
    "symbol": "MI-AGENTE-1",
    "credits": 175000
  }
}
```

El agente es lo de dentro. El envelope deja sitio para información que no es el
recurso, como la paginación en las listas (`GET /my/ships`):

```json
{
  "data": [{ "symbol": "MI-AGENTE-1-1" }, { "symbol": "MI-AGENTE-1-2" }],
  "meta": { "total": 2, "page": 1, "limit": 10 }
}
```

`src/api/` quita el envelope para que el resto de la app trabaje con el recurso
(`agent.credits`, no `agent.data.credits`):

```ts
export function getMyAgent() {
  return apiFetch<{ data: Agent }>('/my/agent').then((response) => response.data)
}
```

En las listas paginadas, la función devuelve también `meta`.

## Back (BFF)

El back vive en otro repositorio y hace de *Backend for Frontend*: todas las
peticiones del front van a él, y él llama a `api.spacetraders.io`.

- El front solo conoce el contrato del back (`VITE_API_URL`), nunca la API de
  SpaceTraders directamente.
- Los endpoints sin lógica propia reenvían la respuesta de SpaceTraders tal cual.
  Los que tienen lógica propia usan el mismo envelope: `{ data }` para un
  recurso, `{ data, meta }` para listas paginadas.
- Los errores tienen un único formato, sean del back o de SpaceTraders.
- El token del agente de SpaceTraders vive solo en el back. El front se
  autentica contra el back con su propia sesión (cookie `httpOnly` preferida).
- Los reinicios del universo de SpaceTraders invalidan los tokens de agente;
  los gestiona el back.

## Tests

- Unitarios (Vitest): simular los módulos de `src/api/` con `vi.mock`.
- e2e (Playwright): interceptar las peticiones al back con `page.route()`.
  Los mocks siguen el contrato del back, no el de SpaceTraders.
- Unos pocos e2e contra el back real, más adelante, para los flujos críticos.

## Pendiente de decidir

- Formato exacto de los errores: comprobar con una respuesta real de
  SpaceTraders antes de fijarlo.
- Proxy de Vite (`server.proxy`) hacia el back en desarrollo: al conectar el
  primer endpoint.
- Internacionalización (`vue-i18n`): los textos están en español por ahora.
