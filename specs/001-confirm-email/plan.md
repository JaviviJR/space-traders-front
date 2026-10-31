# Implementation Plan: Confirmación de email tras el registro

**Branch**: `confirmation-email-spec-kit` | **Date**: 2026-10-31 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-confirm-email/spec.md`

## Summary

Al abrir el enlace del email, la ruta `/confirm-email` muestra la landing con un modal
(`ConfirmEmailDialog`) que reenvía el query firmado tal cual a `POST /auth/confirm-email`
y muestra uno de cuatro estados: confirmando, confirmada, enlace no válido o error con
reintento. "Iniciar sesión" cierra este modal y abre el de login. El trabajo previo
necesario: `client.ts` deja de mandar `Content-Type` sin body, y un `BaseDialog` común
pasa a ser la base de todos los modales (`AuthDialog` incluido). Decisiones y porqués en
[research.md](research.md).

## Technical Context

**Language/Version**: TypeScript ~5.9 + Vue 3.5 (`<script setup lang="ts">`), Vue Router 5

**Primary Dependencies**: PrimeVue 4.5.5 (`Dialog`), Tailwind 4 + Iconify (Lucide);
`fetch` nativo a través de `src/api/client.ts`

**Storage**: N/A

**Testing**: Vitest + Vue Test Utils (`src/__tests__/`), Playwright (`e2e/`)

**Target Platform**: navegadores de escritorio y móvil (proyectos de
`playwright.config.ts`)

**Project Type**: SPA (front) que habla con un BFF en otro repositorio

**Performance Goals**: sin preflight CORS para la confirmación (una sola petición)

**Constraints**: query firmado intocable; nunca dos modales abiertos a la vez (PrimeVue
#6925/#4191); textos en español

**Scale/Scope**: 1 ruta, 2 componentes nuevos, 1 composable nuevo, 1 función de API

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Comprobación | Resultado |
|---|---|---|
| I. Capas en un solo sentido | `ConfirmEmailDialog` no llama a la API: usa `useConfirmEmail`, que usa `confirmEmail` en `src/api/auth.ts`, la única que pasa por `client.ts`. `src/api/` no importa Vue. | PASS |
| II. Contrato del back | `confirmEmail` se tipa con `ConfirmEmailResponse` generado; el 400 se reconoce por `code`; los mocks siguen `src/types/backend.ts`. | PASS |
| III. Estructura mínima | Composable (no store: un solo consumidor). `BaseDialog` antes del tercer modal: justificado en research R7 (se esperan más modales; sigue el precedente de `BaseButton`). Sin `provide`/`inject` nuevo (R10). | PASS |
| IV. Probado como usuario | Tests unitarios montando componentes y la app con router + e2e del recorrido desde el email (sección Testing). | PASS |
| V. Calidad por herramientas | Lint, format, type-check y tests al cerrar cada bloque; sin `any`, `!` ni `@ts-ignore`. | PASS |

**Re-check post-design**: PASS. El diseño de Phase 1 no añade capas ni estado compartido.

## Project Structure

### Documentation (this feature)

```text
specs/001-confirm-email/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── confirm-email-api.md
│   └── ui-confirm-email.md
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── client.ts                       # cambia: Content-Type solo con body (R3)
│   └── auth.ts                         # cambia: + confirmEmail(search) (R2)
├── composables/
│   └── useConfirmEmail.ts              # nuevo (R5, R6)
├── components/
│   ├── ui/BaseDialog.vue               # nuevo (R7)
│   ├── auth/AuthDialog.vue             # cambia: usa BaseDialog (R7)
│   ├── auth/ConfirmEmailDialog.vue     # nuevo (R8, R9)
│   └── layout/PublicLayout.vue         # cambia: abre y coordina el diálogo (R10)
├── router/index.ts                     # cambia: ruta confirm-email (R10)
└── __tests__/
    ├── client.spec.ts                  # amplía
    ├── BaseDialog.spec.ts              # nuevo
    ├── AuthDialog.spec.ts              # debe pasar sin cambios
    ├── ConfirmEmailDialog.spec.ts      # nuevo
    └── App.spec.ts                     # amplía

e2e/
└── confirm-email.spec.ts               # nuevo

doc/architecture.md                     # limpieza de texto (R11)
```

**Structure Decision**: estructura existente por tipo (`doc/architecture.md`); los
componentes de esta feature van en `components/auth/`, junto a `AuthDialog`, y el wrapper
genérico en `components/ui/`, junto a `BaseButton`.

## Testing

- **`src/__tests__/client.spec.ts`** (amplía): sin body no se envía `Content-Type`; con
  body se envía `application/json`.
- **`src/__tests__/BaseDialog.spec.ts`** (nuevo): pinta slot y cabecera, reenvía el cierre
  y `after-hide`, pasa `id` al diálogo.
- **`src/__tests__/AuthDialog.spec.ts`**: debe pasar sin cambios; si envolver el `Dialog`
  cambia cómo lo localiza, se ajusta solo eso y se avisa.
- **`src/__tests__/ConfirmEmailDialog.spec.ts`** (nuevo, `vi.mock('@/api/auth')` con mocks
  según los tipos generados):
  - llama a `confirmEmail` una vez, con el query exacto;
  - "Confirmando…" y luego éxito; mientras confirma no hay botón de cerrar ni cierra con
    Escape;
  - 400 → texto de enlace no válido + "Iniciar sesión";
  - `network_error` → texto de error; "Reintentar" vuelve a llamar, y dos clics seguidos
    sin esperar a que la vista se actualice producen una sola llamada (FR-008);
  - `replace` a la home tras 200 y 400, no tras error de red;
  - "Iniciar sesión" emite `login` (en éxito y en enlace no válido).
- **`src/__tests__/App.spec.ts`** (amplía): entrar en `/confirm-email?…` abre el diálogo
  sobre la landing (app montada con router, `@/api/auth` mockeado).
- **e2e `e2e/confirm-email.spec.ts`** (nuevo; aplica porque es un recorrido de usuario que
  entra desde fuera de la app), con `page.route()`:
  - la petición llega idéntica: POST, sin body, sin `Content-Type`, query byte a byte con
    un token que contiene `%2F` y `+`;
  - 200 → "Cuenta confirmada" y URL en `/`; "Iniciar sesión" cierra y abre el login;
    recargar deja la home sin diálogo y sin segunda petición;
  - 400 → texto de enlace no válido.
- **Manual**: [quickstart.md](quickstart.md) con un enlace real de Mailpit.

## Complexity Tracking

Sin violaciones de la constitución que justificar.
