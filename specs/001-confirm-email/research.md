# Research: Confirmación de email tras el registro

Fuente: decisiones cerradas en `doc/prompts/confirmation-email/01..04` (D1–D6 y las del
mecanismo de modales), adaptadas a las clarificaciones de la spec (sesión 2026-10-31).
No quedaba ningún NEEDS CLARIFICATION en el Technical Context.

## R1 — Cuándo se lanza la confirmación (D1)

- **Decision**: al abrir el modal, sin botón "Confirmar".
- **Rationale**: el contrato del back lo pide así y la spec (FR-002) exige que empiece sola.
- **Alternatives considered**: botón "Confirmar cuenta" (protege de escáneres de enlaces
  de algunos clientes de correo que abren las URLs); descartado porque el contrato no lo
  contempla. Revisar si el back detecta confirmaciones hechas por escáneres.

## R2 — Cómo se envía el enlace al back (D2)

- **Decision**: reenviar `window.location.search` tal cual en un
  `POST /auth/confirm-email`, sin body. `confirmEmail(search)` recibe un string, no un
  objeto `{ id, expires, token, signature }`.
- **Rationale**: el query va firmado (HMAC); Vue Router decodifica y recodifica
  `route.query`, lo que puede cambiar `%2F` o `+` y romper la firma (FR-003). Se pierde el
  tipado de los cuatro parámetros, pero el contrato pide tratarlos como opacos; un
  comentario en la función lo explica.
- **Alternatives considered**: construir el query desde `route.query` con
  `URLSearchParams`; descartado por la recodificación.

## R3 — `Content-Type` solo con body (D6)

- **Decision**: `src/api/client.ts` añade `Content-Type: application/json` solo cuando la
  petición lleva body, igual que ya es condicional el `JSON.stringify`.
- **Rationale**: la cabecera describe un body que, sin body, no existe. Además, front y back
  son orígenes distintos: con esa cabecera la petición deja de ser "simple" para CORS y el
  navegador manda antes un `OPTIONS` (preflight). Sin ella, las peticiones sin body (esta y
  todo `GET` futuro) se lo ahorran. `Accept-Language` está en la lista segura de CORS y no
  provoca preflight. Comprobado con curl: el back acepta este POST con y sin la cabecera, así
  que es corrección y rendimiento, no un bug.
- **Alternatives considered**: dejarlo como está; descartado por el preflight innecesario.
  Un comentario de una línea en `client.ts` evita que alguien lo "simplifique" de vuelta.

## R4 — Respuesta del back y estados (D5 + clarificaciones)

- **Decision**: cualquier 200 es éxito (no se ramifica por `confirmed`, que siempre es
  `true`). `invalid_email_confirmation` → estado `invalid` con el texto propio de la spec
  (no `error.message`, que siempre viene en inglés). Cualquier otro `ApiError` (incluido
  `network_error`) → estado `failed` con el texto "No hemos podido confirmar tu cuenta.
  Comprueba tu conexión e inténtalo de nuevo." y "Reintentar".
- **Rationale**: la lógica ramifica por `code`, nunca por `status` ni por el texto
  (`doc/architecture.md`), y la app ya muestra textos propios por `code` (`useFormErrors`).
  El 400 del contrato usa el esquema base `ApiError` con un `code` concreto, así que no hace
  falta una subclase.
- **Alternatives considered**: mostrar `error.message`; descartado (inglés).

## R5 — Dónde vive el estado (D3)

- **Decision**: composable `src/composables/useConfirmEmail.ts` con un `ref` de estado
  (`pending` | `confirmed` | `invalid` | `failed`), la llamada, el mapeo por `code` y
  `retry()`. Sin `useForm`.
- **Rationale**: solo lo usa este modal, así que no es un store (`doc/architecture.md`:
  empezar local). Sacarlo del componente deja al componente solo renderizando, como
  `useRegister` con `RegisterForm`, y permite probar la lógica aparte. No hay formulario:
  `useForm` añadiría campos y validación que no existen.
- **Alternatives considered**: estado local en el componente (mezcla lógica y render); store
  de Pinia (estado que nadie más comparte).

## R6 — Recarga, botón atrás y doble envío (D4)

- **Decision**: no se lanza un segundo intento mientras hay uno en curso. Tras una respuesta
  definitiva (200 o 400), `useConfirmEmail` hace `router.replace` a la home; tras un error de
  red o servidor no, para que "Reintentar" y la recarga conserven el enlace.
- **Rationale**: `replace` no añade entrada al historial, así que recargar o volver atrás no
  vuelve a mandar el query firmado (el contrato no dice qué devuelve una segunda llamada).
  El `replace` vive en el composable porque es parte de "qué pasa cuando hay respuesta": un
  evento menos entre padre e hijo. Un comentario `/** */` en la cabecera explica ambos
  porqués. (FR-008, FR-009, FR-010.)
- **Alternatives considered**: hacer el `replace` en `PublicLayout` vía evento; descartado
  por añadir un evento sin ganancia.

## R7 — Mecanismo de modales: `BaseDialog` + un diálogo por tarea

- **Decision**: nuevo `src/components/ui/BaseDialog.vue`, que envuelve el `Dialog` de
  PrimeVue con la configuración que hoy vive en `AuthDialog` (modal, no arrastrable,
  bloqueo de scroll, ancho, breakpoints, `overscroll-contain`). Recibe `visible` y
  `header`, emite `update:visible` y `after-hide`, y pinta el contenido por el slot por
  defecto. Atributos como `id`, `closable` o `close-on-escape` llegan al `Dialog` como
  atributos heredados (fallthrough). `AuthDialog` pasa a usarlo sin cambiar su
  comportamiento. Pasar de un diálogo a otro cierra el primero y abre el siguiente en su
  `after-hide`.
- **Rationale**: "cómo es un modal en esta app" vive en un sitio y los próximos lo heredan;
  sigue el precedente de `BaseButton`. Se hace ahora y no en el tercer modal porque se
  esperan más. Regla por defecto (criterio, no dogma): un diálogo por tarea o punto de
  entrada; los pasos de una misma tarea cambian contenido dentro del diálogo; en cada caso
  gana el código más simple. La regla y las alternativas van en el comentario de cabecera de
  `BaseDialog` (decisión del usuario: comentario por archivo, no sección en `doc/ui.md`).
- **Alternatives considered**:
  - Un único `Dialog` anfitrión con contenido intercambiable (`useModal()` + registro
    tipado). Revisar si coordinar diálogos en el layout se vuelve inmanejable.
  - `DynamicDialog`/`DialogService` de PrimeVue: `data` es `any`, `inject('dialogRef')` no
    está tipado (issue #3947), el contenido no recibe props en 4.5.5 (#7492) y no está
    documentado cambiar el contenido o la cabecera de un diálogo abierto. Revisar si
    PrimeVue lo tipa y deja pasar props.

## R8 — No cerrar mientras confirma (clarificación Q1)

- **Decision**: `ConfirmEmailDialog` pasa a `BaseDialog` `closable` y `close-on-escape`
  enlazados a "el estado no es `pending`".
- **Rationale**: FR-012; garantiza que la persona ve el resultado. Ambas son props del
  `Dialog` de PrimeVue 4 y llegan por fallthrough sin ampliar la interfaz de `BaseDialog`
  (comprobar en `v4.primevue.org/dialog.md` al implementar).
- **Alternatives considered**: añadir una prop `closable` propia a `BaseDialog`;
  innecesario mientras el fallthrough baste.

## R9 — `ConfirmEmailDialog` como diálogo propio

- **Decision**: `src/components/auth/ConfirmEmailDialog.vue`, con cabecera "Confirmar email",
  props `visible` y `search`, usa `useConfirmEmail` y pinta cada estado: "Confirmando…";
  "Cuenta confirmada" + "Iniciar sesión"; texto de enlace no válido + "Iniciar sesión"
  (clarificación Q2); texto de error + "Reintentar". Emite `login` y el cierre normal.
- **Rationale**: es otra tarea con otro punto de entrada (el email); meterlo en `AuthDialog`
  lo llenaría de pantallas y estado ajenos. No conoce `AuthDialog`: solo anuncia que la
  persona quiere iniciar sesión, y decide quien conoce ambos diálogos.
- **Iconos** (sugerencia de diseño aceptada; no se aceptaron aria-live ni mover el foco):
  iconos Lucide por la configuración existente de Iconify/Tailwind (como
  `RegisterSuccess`). Confirmando → círculo de carga que gira solo bajo `motion-safe:`;
  confirmada → check en el color primario; enlace no válido y error → aviso en tono de
  error. Todos `aria-hidden` (FR-011).

## R10 — Ruta `/confirm-email` y coordinación en `PublicLayout`

- **Decision**: ruta hija de `PublicLayout` llamada `confirm-email` que usa el mismo
  componente que la home (`HomeView`), con el import perezoso declarado una sola vez y
  compartido. `PublicLayout` detecta la ruta con `useRoute` y un `watch` inmediato sobre su
  nombre, lee `window.location.search` y abre `ConfirmEmailDialog` pasándole el query. En su
  evento `login`, cierra el diálogo y, en su `after-hide`, llama a su propio `openLogin`. El
  `provide` de `useAuthDialog` no cambia.
- **Rationale**: con el mismo componente, Vue lo reutiliza al pasar de `/confirm-email` a
  `/` y la landing no se vuelve a pintar (un comentario evita que alguien separe los
  imports). `PublicLayout` no se desmonta al navegar entre sus rutas hijas, así que el
  diálogo sobrevive al `replace` de R6. Es el único componente que conoce ambos diálogos,
  así que la coordinación vive en un sitio. Nunca dos diálogos a la vez: cerrar uno anidado
  reactiva el scroll de la página mientras el otro sigue abierto (PrimeVue #6925/#4191); un
  comentario de una línea junto al `after-hide` lo explica (FR-005).
- **Alternatives considered**: `provide`/`inject` o ampliar `useAuthDialog`; descartado:
  solo un sitio lo abre y solo el diálogo necesita su estado, y ampliar `useAuthDialog`
  daría a `AppHeader` y la landing funciones que no usan (segregación de interfaces) y
  mezclaría dos flujos.

## R11 — Limpieza de `doc/architecture.md`

- **Decision**: arreglar el texto roto de la regla de `api/` ("It str  - Errors live…" y el
  fragmento duplicado "check fails `npm run type-check` if one overlaps a contract code.")
  sin cambiar contenido. `doc/` está fuera de lint y Prettier: no pasar herramientas.
- **Rationale**: es el documento que este plan cita como fuente del principio I.
