---

description: "Task list for feature implementation"
---

# Tasks: Confirmación de email tras el registro

**Input**: Design documents from `/specs/001-confirm-email/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: incluidos. La constitución (principio IV, NON-NEGOTIABLE) y la sección Testing
de plan.md los exigen. No se impone TDD: cada test se escribe junto a su implementación,
dentro de la misma fase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- SPA de un solo proyecto: `src/`, tests unitarios en `src/__tests__/`, e2e en `e2e/`
  (ver plan.md → Project Structure).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: dejar limpia la documentación que el plan cita como fuente.

- [X] T001 [P] Arreglar el texto roto de la regla de `api/` en doc/architecture.md: la línea "It str  - Errors live…" (frase cortada y pegada a la viñeta siguiente) y el fragmento duplicado "check fails `npm run type-check` if one overlaps a contract code." tras la viñeta que ya termina así. Sin cambiar contenido ni pasar herramientas sobre `doc/` (research R11)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: piezas que necesitan todas las historias: la petición sin `Content-Type`, el
wrapper de modales y la función de API.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 [P] En src/api/client.ts, añadir `Content-Type: application/json` solo cuando `body` no es `undefined` (igual que el `JSON.stringify`), con un comentario `//` de una línea: la cabecera describe el body y, sin él, provocaría un preflight CORS innecesario (research R3). La llamada de registro, con body, se comporta igual
- [X] T003 [P] Ampliar src/__tests__/client.spec.ts: una petición sin body no envía `Content-Type`; una con body envía `Content-Type: application/json`
- [X] T004 [P] Crear src/components/ui/BaseDialog.vue: envuelve el `Dialog` de PrimeVue con la configuración que hoy tiene `AuthDialog` (modal, `:draggable="false"`, `block-scroll`, ancho `28rem`, breakpoint `575px` → `90vw`, `content-class="overscroll-contain"`); props `visible` y `header`; emite `update:visible` y `after-hide`; slot por defecto; el resto de atributos (`id`, `closable`, `close-on-escape`) llegan al `Dialog` por fallthrough. Cabecera `/** */` con: por qué existe, la regla "un diálogo por tarea" con su excepción de simplicidad, y las dos alternativas rechazadas con su condición para revisarlas (research R7, contracts/ui-confirm-email.md)
- [X] T005 [P] Crear src/__tests__/BaseDialog.spec.ts: pinta slot y cabecera, reenvía el cierre (`update:visible`) y `after-hide`, pasa `id` al diálogo
- [X] T006 Sustituir en src/components/auth/AuthDialog.vue el `Dialog` y sus atributos por `BaseDialog`, sin cambiar pestañas, `RegisterSuccess` ni el reset en `after-hide` (depende de T004)
- [X] T007 Ejecutar src/__tests__/AuthDialog.spec.ts sin cambios; si envolver el `Dialog` cambia cómo lo localiza, ajustar solo eso y avisar al usuario (depende de T006)
- [X] T008 [P] Añadir `confirmEmail(search: string)` en src/api/auth.ts: `POST` a `/auth/confirm-email` + `search` tal cual, sin body, devolviendo `ConfirmEmailResponse` de src/types/backend.ts; comentario de por qué recibe un string y no un objeto (firma HMAC, research R2, contracts/confirm-email-api.md)

**Checkpoint**: lint, format, type-check y Vitest limpios; `AuthDialog` funciona igual sobre `BaseDialog`.

---

## Phase 3: User Story 1 - Confirmar la cuenta desde el enlace del email (Priority: P1) 🎯 MVP

**Goal**: el enlace del email abre la landing con el modal, confirma solo y lleva al login.

**Independent Test**: con un enlace válido, la cuenta queda confirmada, se ve "Cuenta
confirmada", "Iniciar sesión" abre el login y recargar no repite la petición.

### Implementation for User Story 1

- [X] T009 [P] [US1] Crear src/composables/useConfirmEmail.ts: `ref` de estado con los valores de data-model.md "`pending` | `confirmed` | `invalid` | `failed`" (en esta fase solo `pending` → `confirmed`); lanza `confirmEmail(search)` al llamarse; ignora un nuevo intento mientras hay uno en curso (FR-008); tras 200 hace `router.replace` a la home. Cabecera `/** */`: por qué `replace` (recargas y botón atrás) y por qué no se hará tras un error de red (research R5, R6)
- [X] T010 [P] [US1] Añadir en src/router/index.ts la ruta hija de `PublicLayout` `confirm-email` (`/confirm-email`) con el mismo componente que `home`, declarando el import perezoso una sola vez y compartiéndolo; comentario de por qué no separar los imports (research R10)
- [X] T011 [US1] Crear src/components/auth/ConfirmEmailDialog.vue sobre `BaseDialog` con cabecera "Confirmar email"; props `visible` y `search`; usa `useConfirmEmail`; estado `pending`: icono Lucide de carga que gira solo con `motion-safe:` + "Confirmando…"; estado `confirmed`: check en color primario + "Cuenta confirmada" + botón "Iniciar sesión" que emite `login`; iconos `aria-hidden`; mientras el estado es `pending`, `closable` a `false` y no reenviar al padre el `update:visible` del `Dialog` (así Escape no lo cierra); `close-on-escape` se queda en su valor por defecto, porque el `Dialog` solo lo lee al abrirse (research R8); comentario de por qué es un diálogo propio y no una pantalla de `AuthDialog` (research R9) (depende de T009)
- [X] T012 [US1] En src/components/layout/PublicLayout.vue: con `useRoute` y un `watch` inmediato sobre el nombre de ruta, al entrar en `confirm-email` leer `window.location.search` y abrir `ConfirmEmailDialog` pasándole el query; en su `login`, cerrarlo y, en su `after-hide`, llamar al `openLogin` del layout; comentario de una línea junto al `after-hide` (no abrir login mientras el otro se cierra, PrimeVue #6925); el `provide` de `useAuthDialog` no cambia (research R10) (depende de T010, T011)
- [X] T013 [P] [US1] Crear src/__tests__/ConfirmEmailDialog.spec.ts con `vi.mock('@/api/auth')` y mocks según los tipos generados: llama a `confirmEmail` una vez con el query exacto; muestra "Confirmando…" y luego "Cuenta confirmada"; mientras confirma no hay botón de cerrar ni se cierra con Escape; `replace` a la home tras 200; "Iniciar sesión" emite `login` (depende de T011)
- [X] T014 [US1] Ampliar src/__tests__/App.spec.ts: entrar en `/confirm-email?…` abre el diálogo de confirmación sobre la landing (app con router, `await router.isReady()` + `flushPromises()`, `@/api/auth` mockeado) (depende de T012)
- [X] T015 [US1] Crear e2e/confirm-email.spec.ts con `page.route()`: la petición llega como POST, sin body, sin `Content-Type` y con el query byte a byte usando un token con `%2F` y `+`; 200 → "Cuenta confirmada" y URL en `/`; "Iniciar sesión" cierra el diálogo y abre el login; recargar deja la home sin diálogo y sin segunda petición (depende de T002, T012)

**Checkpoint**: User Story 1 funciona y se prueba por sí sola.

---

## Phase 4: User Story 2 - Enlace no válido o caducado (Priority: P2)

**Goal**: un enlace rechazado muestra el texto propio y permite ir al login.

**Independent Test**: un enlace manipulado muestra el texto de enlace no válido con
"Iniciar sesión", y recargar no repite el intento.

### Implementation for User Story 2

- [ ] T016 [US2] En src/composables/useConfirmEmail.ts, mapear `ApiError` con `code` `invalid_email_confirmation` al estado `invalid` y hacer también `router.replace` a la home (ramificar por `code`, nunca por `status` ni `message`, research R4)
- [ ] T017 [US2] En src/components/auth/ConfirmEmailDialog.vue, estado `invalid`: icono de aviso en tono de error + "El enlace no es válido o ha caducado. Si ya confirmaste tu cuenta, inicia sesión; si no, podrás pedir un enlace nuevo." + botón "Iniciar sesión" que emite `login` (FR-006, clarificación Q2) (depende de T016)
- [ ] T018 [P] [US2] Ampliar src/__tests__/ConfirmEmailDialog.spec.ts: 400 `invalid_email_confirmation` → texto de enlace no válido; `replace` a la home; "Iniciar sesión" emite `login` (depende de T017)
- [ ] T019 [P] [US2] Ampliar e2e/confirm-email.spec.ts: respuesta 400 → texto de enlace no válido (depende de T017)

**Checkpoint**: User Stories 1 y 2 funcionan por separado.

---

## Phase 5: User Story 3 - Error de conexión y reintento (Priority: P3)

**Goal**: un fallo de red o del servidor se puede reintentar sin volver al email.

**Independent Test**: simulando un fallo de red, aparece el texto de error, la URL
conserva el query y "Reintentar" vuelve a llamar.

### Implementation for User Story 3

- [ ] T020 [US3] En src/composables/useConfirmEmail.ts, mapear cualquier otro `ApiError` (incluido `network_error`) al estado `failed`, sin `router.replace`; exponer `retry()` que vuelve a `pending` y repite la llamada respetando el bloqueo de FR-008
- [ ] T021 [US3] En src/components/auth/ConfirmEmailDialog.vue, estado `failed`: icono de aviso en tono de error + "No hemos podido confirmar tu cuenta. Comprueba tu conexión e inténtalo de nuevo." + botón "Reintentar" que llama a `retry()` (FR-007, clarificación Q3) (depende de T020)
- [ ] T022 [US3] Ampliar src/__tests__/ConfirmEmailDialog.spec.ts: `network_error` → texto de error; "Reintentar" vuelve a llamar a `confirmEmail`; sin `replace` tras el error; dos clics en "Reintentar" seguidos, sin esperar a que la vista se actualice (el botón desaparece al pasar a `pending`), producen una sola llamada nueva (FR-008, SC-004) (depende de T021)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: cierre según la constitución (principio V) y validación manual.

- [ ] T023 Ejecutar `npm run lint`, `npm run format`, `npm run type-check`, `npx vitest run` y `CI=1 npm run build && CI=1 npx playwright test e2e/confirm-email.spec.ts --project=chromium`; conservar y listar los cambios de Prettier en archivos ajenos
- [ ] T024 Validación manual con un enlace real de Mailpit siguiendo specs/001-confirm-email/quickstart.md (la ejecuta el usuario o la pide)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias; independiente del resto.
- **Foundational (Phase 2)**: bloquea todas las historias.
- **User Stories (Phase 3+)**: dependen de Phase 2. US2 y US3 amplían los archivos que crea
  US1 (`useConfirmEmail.ts`, `ConfirmEmailDialog.vue`, sus tests), así que van en orden
  P1 → P2 → P3.
- **Polish (Phase 6)**: tras las historias.

### User Story Dependencies

- **User Story 1 (P1)**: tras Phase 2.
- **User Story 2 (P2)**: tras US1 (amplía su composable y su diálogo); se prueba por sí sola.
- **User Story 3 (P3)**: tras US1 (ídem); se prueba por sí sola.

### Within Each User Story

- Composable antes que componente; componente antes que coordinación en el layout.
- Cada test, junto a lo que prueba (no se impone escribirlo antes).
- Story complete before moving to next priority

### Parallel Opportunities

- T001 con cualquier tarea.
- Phase 2: T002/T003, T004/T005 y T008 en paralelo; T006 → T007 tras T004.
- US1: T009 y T010 en paralelo; T013 en paralelo con T012.
- US2: T018 y T019 en paralelo.

---

## Parallel Example: User Story 1

```bash
Task: "Crear src/composables/useConfirmEmail.ts (pending → confirmed)"
Task: "Añadir la ruta confirm-email en src/router/index.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 + Phase 2.
2. Phase 3 (US1).
3. **STOP and VALIDATE**: con un enlace válido de Mailpit.

### Incremental Delivery

1. Setup + Foundational → base lista.
2. US1 → validar (MVP).
3. US2 → validar.
4. US3 → validar.

### Parallel Team Strategy

No aplica: un solo desarrollador.

### Sessions

Una conversación nueva por fila: `/feature-session specs/001-confirm-email S1` (ver
`doc/workflow.md` → Spec-kit features).

| Sesión | Tareas | Cierre |
|---|---|---|
| S1 | T001, T002, T003, T008 | lint, format, type-check, Vitest |
| S2 | T004, T005, T006, T007 | ídem; `AuthDialog` igual que antes |
| S3 | T009–T015 (US1) | ídem + e2e de `confirm-email.spec.ts` |
| S4 | T016–T019 (US2) | lint, format, type-check, Vitest + e2e |
| S5 | T020–T022 (US3) | lint, format, type-check, Vitest |
| S6 | T023, T024 | todo + prueba manual de quickstart.md |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Cada tarea se aplica con el flujo de `doc/workflow.md`: propuesta didáctica, dudas y
  aplicar solo cuando el usuario no tenga más.
- Al terminar una tarea, marcarla `[X]` aquí; al cerrar la sesión, Claude hace el commit
  cuando el usuario la ha revisado y dice que todo está bien.
- Stop at any checkpoint to validate story independently
