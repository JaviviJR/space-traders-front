# Data Model: Confirmación de email tras el registro

No hay persistencia en el front. Las entidades son el dato que llega en el enlace y el
estado de la confirmación en pantalla.

## Enlace de confirmación (`search`)

- **Qué es**: el query string de `/confirm-email?id=…&expires=…&token=…&signature=…`,
  leído de `window.location.search` (incluye el `?` inicial).
- **Reglas**: opaco y firmado. No se parsea, valida, recodifica, reordena ni recorta
  (FR-003). Una dirección sin parámetros se envía igual y el back la rechaza (caso límite
  "Dirección sin datos del enlace").
- **Caducidad**: una hora, la comprueba el back.

## Estado de la confirmación (`ConfirmEmailStatus`)

Valores: `pending` | `confirmed` | `invalid` | `failed`.

| Estado | Qué se ve | Acciones | ¿Se puede cerrar? |
|---|---|---|---|
| `pending` | Icono de carga + "Confirmando…" | — | No (FR-012) |
| `confirmed` | Check + "Cuenta confirmada" | "Iniciar sesión" | Sí |
| `invalid` | Aviso + texto de enlace no válido (FR-006) | "Iniciar sesión" | Sí |
| `failed` | Aviso + "No hemos podido confirmar tu cuenta. Comprueba tu conexión e inténtalo de nuevo." | "Reintentar" | Sí |

### Transiciones

```text
(abrir modal) ──► pending
pending ── 200 ─────────────────────────► confirmed   + router.replace('/')
pending ── 400 invalid_email_confirmation ► invalid    + router.replace('/')
pending ── otro ApiError (red, 5xx…) ───► failed      (el enlace se conserva)
failed  ── Reintentar ──────────────────► pending
pending ── nuevo intento ───────────────► ignorado (FR-008)
```

`confirmed` e `invalid` son finales: no hay transición de salida salvo cerrar el modal o
"Iniciar sesión".
