# Contract: entrada `/confirm-email` y componentes de UI

## Ruta

- Ruta hija de `PublicLayout`, nombre `confirm-email`, ruta `/confirm-email`, mismo
  componente que `home`. Pública.
- Es la dirección a la que apunta el email: `{FRONT_URL}/confirm-email?…`.

## `BaseDialog` (`src/components/ui/BaseDialog.vue`)

- **Props**: `visible` (boolean), `header` (string).
- **Events**: `update:visible` (cierre pedido por la persona), `after-hide` (cuando la
  animación de cierre termina).
- **Slot** por defecto: el contenido.
- **Atributos heredados**: cualquier otro atributo (`id`, `closable`, `close-on-escape`…)
  llega al `Dialog` de PrimeVue.

## `ConfirmEmailDialog` (`src/components/auth/ConfirmEmailDialog.vue`)

- **Props**: `visible` (boolean), `search` (string, el query tal cual).
- **Events**: `update:visible` (cerrar), `after-hide`, `login` (la persona pulsa
  "Iniciar sesión" en `confirmed` o en `invalid`).
- No conoce `AuthDialog`; quien coordina es `PublicLayout`.

## `useConfirmEmail` (`src/composables/useConfirmEmail.ts`)

- **Entrada**: el `search`.
- **Devuelve**: `status` (solo lectura, ver `data-model.md`) y `retry()`.
- **Efectos**: llama a `confirmEmail(search)`; tras 200 o 400 hace `router.replace` a la
  home.

## `confirmEmail` (`src/api/auth.ts`)

- **Entrada**: `search` (string). **Devuelve**: `ConfirmEmailResponse` o lanza `ApiError`.
- Ver `confirm-email-api.md`.
