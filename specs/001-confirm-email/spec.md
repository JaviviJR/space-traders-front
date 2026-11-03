# Feature Specification: Confirmación de email tras el registro

**Feature Branch**: `confirmation-email-spec-kit`

**Created**: 2026-10-31

**Status**: Draft

**Input**: User description: "Confirmación de email tras el registro: al abrir el enlace del
email, el usuario ve la landing con un modal que confirma la cuenta sola, informa del
resultado y le lleva a iniciar sesión."

## Clarifications

### Session 2026-10-31

- Q: ¿Se puede cerrar el modal mientras la cuenta se está confirmando? → A: No; sin botón de
  cerrar ni Escape mientras confirma. En los demás estados sí se puede cerrar.
- Q: Cuando el enlace no es válido, ¿el modal ofrece también un botón "Iniciar sesión"? →
  A: Sí; el mismo botón y el mismo paso al login que en el estado "confirmada".
- Q: ¿Qué texto exacto muestra el estado de error de red o del servidor? → A: "No hemos
  podido confirmar tu cuenta. Comprueba tu conexión e inténtalo de nuevo."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Confirmar la cuenta desde el enlace del email (Priority: P1)

Una persona se acaba de registrar y abre el enlace de confirmación que ha recibido por
email. Ve la landing con un modal encima que, sin que tenga que pulsar nada, indica que
está confirmando la cuenta. Cuando termina, el modal dice que la cuenta está confirmada y
le ofrece "Iniciar sesión"; al pulsarlo, este modal se cierra y se abre el de login.

**Why this priority**: sin esto el enlace del email no lleva a ninguna parte y nadie que se
registre puede completar el alta. Es el recorrido que da valor por sí solo.

**Independent Test**: se prueba completo abriendo un enlace válido: la cuenta queda
confirmada, se ve el mensaje de éxito y "Iniciar sesión" abre el login.

**Acceptance Scenarios**:

1. **Given** un enlace de confirmación válido, **When** la persona lo abre, **Then** ve la
   landing con el modal de confirmación encima y un estado "confirmando" con su icono,
   sin pulsar ningún botón.
2. **Given** la confirmación en curso, **When** el back confirma la cuenta, **Then** el
   modal muestra que la cuenta está confirmada, con su icono, y un botón "Iniciar sesión".
3. **Given** el mensaje de cuenta confirmada, **When** la persona pulsa "Iniciar sesión",
   **Then** el modal de confirmación se cierra y, una vez cerrado, se abre el de login.
4. **Given** una cuenta ya confirmada por este enlace, **When** la persona recarga la página
   o vuelve atrás, **Then** queda en la home sin modal y la confirmación no se repite.

---

### User Story 2 - Enlace no válido o caducado (Priority: P2)

La persona abre un enlace que no sirve: ha caducado (pasó más de una hora), está
incompleto, se ha manipulado o ya se usó. El modal le explica en español qué ha pasado y
qué puede hacer, sin distinguir la causa, porque el back tampoco la distingue.

**Why this priority**: es el fallo más probable (enlaces caducados) y, sin un mensaje
claro, la persona no sabe si su cuenta existe ni qué hacer.

**Independent Test**: se prueba abriendo un enlace manipulado o caducado: aparece el texto
de enlace no válido y recargar no vuelve a intentarlo.

**Acceptance Scenarios**:

1. **Given** un enlace no válido, caducado, manipulado o incompleto, **When** la persona lo
   abre, **Then** el modal muestra, con su icono, el texto "El enlace no es válido o ha
   caducado. Si ya confirmaste tu cuenta, inicia sesión; si no, podrás pedir un enlace
   nuevo." y un botón "Iniciar sesión".
2. **Given** el mensaje de enlace no válido, **When** la persona pulsa "Iniciar sesión",
   **Then** el modal de confirmación se cierra y, una vez cerrado, se abre el de login.
3. **Given** el mensaje de enlace no válido, **When** la persona recarga la página o
   vuelve atrás, **Then** queda en la home sin modal y no se repite el intento.

---

### User Story 3 - Error de conexión y reintento (Priority: P3)

Si la confirmación no llega a completarse por un problema de red o del servidor, el modal
muestra un error genérico con un botón "Reintentar" que vuelve a intentarlo con el mismo
enlace.

**Why this priority**: es un caso poco frecuente, pero sin él la persona tendría que volver
al email para reintentar, o pensaría que su enlace no vale.

**Independent Test**: se prueba simulando un fallo de red: aparece el error genérico,
"Reintentar" vuelve a intentarlo y, si esta vez funciona, se ve el éxito.

**Acceptance Scenarios**:

1. **Given** un fallo de red o del servidor durante la confirmación, **When** termina el
   intento, **Then** el modal muestra, con su icono, el texto "No hemos podido confirmar
   tu cuenta. Comprueba tu conexión e inténtalo de nuevo." y un botón "Reintentar".
2. **Given** el mensaje de error genérico, **When** la persona pulsa "Reintentar",
   **Then** se vuelve a intentar con el mismo enlace y el modal vuelve al estado
   "confirmando".
3. **Given** el mensaje de error genérico, **When** la persona recarga la página,
   **Then** el enlace se conserva y la confirmación se intenta de nuevo.

---

### Edge Cases

- **Doble envío**: si se pulsa "Reintentar" varias veces seguidas, o cualquier otra acción
  intenta confirmar mientras ya hay un intento en curso, solo hay un intento a la vez.
- **Enlace ya usado**: abrir de nuevo un enlace que ya confirmó la cuenta se trata como lo
  que responda el back; si lo rechaza, se ve el texto de enlace no válido, que ya indica
  "si ya confirmaste tu cuenta, inicia sesión".
- **Dirección sin datos del enlace**: abrir la dirección de confirmación sin los datos del
  enlace se trata como un enlace no válido.
- **Cerrar el modal**: mientras confirma no se puede cerrar, para que la persona siempre vea
  el resultado; en los demás estados sí, y queda en la landing.
- **Recargar o volver atrás tras una respuesta definitiva**: no repite la confirmación (ver
  US1 escenario 4 y US2 escenario 2).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Al abrir el enlace de confirmación, el sistema MUST mostrar la landing con un
  modal de confirmación encima, con el título "Confirmar email" y el mismo aspecto que los
  modales de login y registro.
- **FR-002**: El sistema MUST iniciar la confirmación automáticamente al abrir el enlace, sin
  acción de la persona, y mostrar el texto "Confirmando…" mientras dura.
- **FR-003**: El sistema MUST enviar al back los datos del enlace exactamente como llegaron,
  sin interpretarlos ni alterarlos, porque el back los verifica con una firma.
- **FR-004**: Si el back confirma la cuenta, el sistema MUST mostrar el texto "Cuenta
  confirmada" y ofrecer "Iniciar sesión".
- **FR-005**: Al pulsar "Iniciar sesión" (en el estado confirmada o en el de enlace no
  válido), el sistema MUST cerrar el modal de confirmación y
  abrir el de login solo cuando el primero haya terminado de cerrarse; nunca se ven los
  dos a la vez.
- **FR-006**: Si el back rechaza el enlace, el sistema MUST mostrar el texto "El enlace no es
  válido o ha caducado. Si ya confirmaste tu cuenta, inicia sesión; si no, podrás pedir un
  enlace nuevo.", sin mostrar el mensaje original del back, y ofrecer "Iniciar sesión" con
  el mismo comportamiento que en FR-005.
- **FR-007**: Ante un error de red o del servidor, el sistema MUST mostrar el texto "No hemos
  podido confirmar tu cuenta. Comprueba tu conexión e inténtalo de nuevo." y un botón
  "Reintentar" que repite la confirmación con el mismo enlace.
- **FR-008**: El sistema MUST NOT tener más de un intento de confirmación en curso a la vez.
- **FR-009**: Tras una respuesta definitiva (confirmada o enlace rechazado), el sistema MUST
  dejar a la persona en la home de forma que recargar o volver atrás no repita la
  confirmación ni reabra el modal.
- **FR-010**: Tras un error de red o del servidor, el sistema MUST conservar el enlace para
  que reintentar o recargar vuelva a intentarlo.
- **FR-011**: Cada estado (confirmando, confirmada, enlace no válido, error) MUST mostrar un
  icono propio y decorativo; el texto transmite el significado por sí solo. La animación
  del estado "confirmando" MUST respetar la preferencia de movimiento reducido.
- **FR-012**: Mientras la confirmación está en curso, el modal MUST NOT poder cerrarse (ni
  con botón ni con Escape); en los estados confirmada, enlace no válido y error, la persona
  MUST poder cerrarlo.

### Key Entities

- **Enlace de confirmación**: dirección que el back envía por email tras el registro. Sus
  datos son opacos para el front (van firmados) y caduca a la hora.
- **Estado de la confirmación**: confirmando, confirmada, enlace no válido o error
  (recuperable con "Reintentar").

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Con un enlace válido, la persona ve su cuenta confirmada sin pulsar nada y
  llega al formulario de login con una sola acción más ("Iniciar sesión").
- **SC-002**: En el 100 % de los casos de enlace rechazado o error, la persona ve un mensaje
  en español que le dice qué puede hacer a continuación; nunca un mensaje en inglés ni una
  pantalla sin salida.
- **SC-003**: Recargar o volver atrás tras una respuesta definitiva produce 0 intentos de
  confirmación adicionales.
- **SC-004**: Pulsar "Reintentar" repetidamente nunca produce más de un intento simultáneo.

## Assumptions

- El back expone la confirmación como un servicio público que recibe los datos del enlace
  tal cual y responde "confirmada" o "enlace no válido"; no inicia sesión ni devuelve
  credenciales.
- La caducidad de una hora y la verificación de la firma son responsabilidad del back.
- El enlace del email apunta a una dirección del propio front.
- Los textos de la interfaz son en español, como el resto de la app.
- Fuera de alcance: el formulario para pedir un enlace nuevo dentro del caso de enlace no
  válido (feature posterior), el botón de reenvío en el aviso de registro completado
  (descartado) y el manejo en login de una cuenta sin verificar.
