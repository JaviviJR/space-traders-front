# Quickstart: validar la confirmación de email

Guía para comprobar que la feature funciona. Comandos según `doc/testing.md` (aquí no hay
pantalla: e2e con `CI=1`).

## Comprobaciones automáticas

```bash
npm run lint
npm run format
npm run type-check
npx vitest run
CI=1 npm run build && CI=1 npx playwright test e2e/confirm-email.spec.ts --project=chromium
```

Resultado esperado: todo limpio y en verde. El e2e cubre los escenarios de la spec contra
un back interceptado con `page.route()`.

## Comprobación manual con el back real

Requisitos: back levantado y Mailpit en `http://localhost:8025`; front con `npm run dev`
en `http://localhost:5173`.

1. Regístrate con un email nuevo y abre el enlace del correo desde Mailpit.
   - Ves la landing con el modal "Confirmar email", primero "Confirmando…" (sin botón de
     cerrar) y luego "Cuenta confirmada". La URL pasa a `/`.
2. Pulsa "Iniciar sesión": el modal se cierra y después se abre el de login.
3. Recarga: home sin modal. En la pestaña Network no hay una segunda petición a
   `/auth/confirm-email`.
4. Abre otra vez el mismo enlace: el contrato no dice qué responde una segunda llamada;
   anota qué estado aparece (si el back lo rechaza, texto de enlace no válido +
   "Iniciar sesión").
5. Cambia un carácter de `signature` en la URL: texto de enlace no válido.
6. Con el back parado, abre un enlace: texto de error + "Reintentar"; la URL conserva el
   query. Levanta el back y pulsa "Reintentar": "Cuenta confirmada".
7. En la pestaña Network, la petición es un `POST` sin body, sin `Content-Type` y sin
   preflight `OPTIONS`.

Contratos: [confirm-email-api.md](contracts/confirm-email-api.md),
[ui-confirm-email.md](contracts/ui-confirm-email.md). Estados:
[data-model.md](data-model.md).
