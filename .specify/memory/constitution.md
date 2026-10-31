<!--
Sync Impact Report
- Version change: (plantilla sin versión) → 1.0.0
- Modified principles (plantilla → nuevo):
  - [PRINCIPLE_1_NAME] → I. Capas con dependencias en un solo sentido
  - [PRINCIPLE_2_NAME] → II. El contrato del back es la única fuente de verdad
  - [PRINCIPLE_3_NAME] → III. La estructura más pequeña que cumpla SOLID
  - [PRINCIPLE_4_NAME] → IV. Probado como lo usaría el usuario (NON-NEGOTIABLE)
  - [PRINCIPLE_5_NAME] → V. Calidad comprobada por herramientas, sin silenciar errores
- Added sections: Additional Constraints, Development Workflow (rellenan
  [SECTION_2_NAME] y [SECTION_3_NAME])
- Removed sections: ninguna
- Templates requiring updates: ninguna (plan-template.md, spec-template.md y
  tasks-template.md leen la constitución en tiempo de ejecución)
- Follow-up TODOs: ninguno
- Fuentes inferidas: AGENTS.md, doc/workflow.md, doc/architecture.md,
  doc/conventions.md, doc/testing.md, doc/dependencies.md, doc/ui.md
-->

# Space Trader Front Constitution

## Core Principles

### I. Capas con dependencias en un solo sentido

- Las dependencias DEBEN seguir el orden Vista → Componentes → Store / Composable →
  capa API (`src/api/`) → `fetch`, nunca al revés.
- Un componente NUNCA llama a la API ni a `fetch`; `src/api/` NUNCA importa nada de
  Vue ni de Pinia.
- Las vistas DEBEN ser finas: leen parámetros de ruta y componen componentes.
- El front solo conoce el contrato del back (BFF), nunca la API de SpaceTraders.

**Justificación**: separar quién renderiza, quién guarda estado y quién habla con
el back permite cambiar una capa (p. ej. el cliente HTTP) sin tocar las demás.
Detalle en `doc/architecture.md`.

### II. El contrato del back es la única fuente de verdad

- Los tipos de `src/types/` DEBEN generarse con `npm run generate:types` y NUNCA se
  editan a mano.
- Cada función de `src/api/` DEBE devolver datos tipados o lanzar `ApiError` (o una
  subclase que corresponda a un esquema de error del contrato).
- La lógica DEBE ramificar por el `code` del error, nunca por `status` ni por el
  texto de `message`.
- Los mocks de los tests DEBEN seguir el contrato generado, no una forma inventada
  ni la de SpaceTraders.

**Justificación**: si el front inventa formas de datos, se desincroniza del back
sin que el type-check lo detecte.

### III. La estructura más pequeña que cumpla SOLID

- Ante la duda DEBE elegirse la opción más pequeña: estado local (`ref`) antes que
  un composable, y un composable antes que un store de Pinia.
- La lógica de un solo componente se queda en él, salvo que llame a `src/api/` o
  tenga estado y efectos propios: entonces va a un composable.
- Un store de Pinia (formato _setup_) SOLO cuando varias vistas comparten estado.
- Los componentes aplican SOLID adaptado a Vue: un componente renderiza; añadir un
  componente nuevo antes que ramificar uno existente por una prop de tipo/modo;
  props y valores de retorno mínimos.
- Cuando la tarea no especifica estado, flujo de datos o estilos, se DEBE preguntar
  antes de generar.

**Justificación**: cada capa extra es código que mantener; solo se añade cuando un
segundo uso real la justifica. Detalle en `doc/conventions.md`.

### IV. Probado como lo usaría el usuario (NON-NEGOTIABLE)

- Una funcionalidad NO está terminada hasta que tiene un test que la ejercita como
  lo haría un usuario: montar el componente o la vista e interactuar con ella, o un
  flujo e2e para un recorrido de usuario. "No ha lanzado error" no cuenta.
- Tests unitarios (Vitest + Vue Test Utils) en `src/__tests__/`, mockeando los
  módulos de `src/api/`; e2e (Playwright) en `e2e/`, interceptando el back con
  `page.route()`.
- Cada propuesta DEBE indicar qué tests (nuevos o actualizados, con ruta) cubren el
  cambio y si aplica un e2e o por qué no, antes de aplicarla.

**Justificación**: un test que solo comprueba que algo no falla no protege el
comportamiento que el usuario ve. Detalle en `doc/testing.md`.

### V. Calidad comprobada por herramientas, sin silenciar errores

- Un cambio NO está terminado hasta que `npm run lint`, `npm run format` y
  `npm run type-check` están limpios.
- Los errores de tipos DEBEN corregirse en su causa: NUNCA `any`, aserción no nula
  (`!`) ni `// @ts-ignore` sin preguntar antes.
- Las reglas del estilo de Vue que ninguna herramienta comprueba (`doc/conventions.md`)
  DEBEN aplicarse al escribir código.

**Justificación**: silenciar el type checker esconde justo los fallos que el
contrato generado (principio II) existe para detectar.

## Additional Constraints

- Stack: Vue 3 + Vite + TypeScript, `<script setup lang="ts">`, Composition API.
- Solo se usan librerías listadas en `package.json`. Las instalaciones las ejecuta
  el usuario; se le da el comando exacto y se verifica leyendo archivos.
- Estilos con utilidades de Tailwind; los tokens nuevos van en el bloque `@theme`
  de `src/assets/main.css`. El CSS propio de un componente DEBE ser `scoped` o CSS
  Module.
- PrimeVue y `@primevue/themes` se quedan en la major 4 (la última MIT); sus tokens
  se reconfiguran para usar nuestra paleta.
- Ante una API de librería o un bug de terceros: primero la documentación oficial,
  luego sus issues y solo después el código fuente instalado. Una solución
  derivada del código fuente DEBE marcarse como tal. Detalle en `doc/dependencies.md`.
- Textos de la interfaz en español hasta que exista internacionalización.

## Development Workflow

- Ningún cambio se aplica sin una propuesta aprobada. La propuesta lista cada
  archivo afectado, explica qué hace el cambio y por qué este diseño (qué
  acoplamiento o responsabilidad resuelve y por qué una alternativa más simple no
  bastaba), e incluye su plan de tests (principio IV).
- Modo aprendizaje: las propuestas se explican de forma didáctica, en prosa y sin
  pegar código ni diffs; el usuario revisa el cambio real con `git diff`. Se aplica
  solo cuando el usuario dice que no le quedan dudas.
- Las decisiones de diseño se toman de una en una, con sus pros y contras y una
  recomendación.
- Las decisiones cerradas se registran en el mismo cambio que las aplica: en el
  `doc/*.md` correspondiente si afectan a varios archivos, o en un comentario en el
  propio archivo si son locales.
- Detalle completo en `doc/workflow.md`.

## Governance

- Esta constitución resume los principios no negociables del proyecto. `AGENTS.md`
  y `doc/*.md` contienen el detalle y las reglas de trabajo; cada principio enlaza
  su documento de origen.
- Si esta constitución y `AGENTS.md`, `doc/*.md` o una skill no coinciden, se DEBE
  avisar al usuario antes de actuar, citando ambas fuentes y diciendo cuál se
  seguirá y por qué.
- Procedimiento de enmienda: toda modificación se propone al usuario, se aprueba
  explícitamente y se aplica en el mismo cambio que actualiza los documentos de
  origen afectados.
- Versionado semántico: MAJOR si se elimina o redefine un principio; MINOR si se
  añade un principio o sección, o se amplía de forma material; PATCH para
  aclaraciones y redacción.
- Cumplimiento: cada plan (`/speckit-plan`) DEBE pasar el "Constitution Check"; una
  violación solo se acepta si se justifica en la sección de complejidad del plan.

**Version**: 1.0.0 | **Ratified**: 2026-10-30 | **Last Amended**: 2026-10-30
