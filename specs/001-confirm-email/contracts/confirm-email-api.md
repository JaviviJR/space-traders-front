# Contract: `POST /auth/confirm-email` (consumido por el front)

Fuente de verdad: el OpenAPI del back, generado en `src/types/backend.ts`
(`paths['/auth/confirm-email']`, `components['schemas']['ConfirmEmailResponse']`). Este
archivo solo fija lo que el front DEBE enviar y cómo interpreta cada respuesta.

## Petición

- Método `POST`, ruta `/auth/confirm-email` + el query recibido, byte a byte.
- Sin body y, por tanto, sin `Content-Type` (research R3).
- `Accept-Language: es`, como cualquier petición de `client.ts`.
- Pública: sin credenciales.

## Respuestas

| Status | Cuerpo | Estado en el front |
|---|---|---|
| 200 | `{ data: ConfirmEmailResponse }` (`confirmed` siempre `true`) | `confirmed` |
| 400 | `{ error: ApiError }` con `code: "invalid_email_confirmation"` | `invalid` |
| sin respuesta | — (`client.ts` lanza `ApiError` `network_error`, status 0) | `failed` |
| cualquier otro error | `ApiError` con otro `code` | `failed` |

El front no lee `error.message` (siempre en inglés) ni ramifica por `status`.
