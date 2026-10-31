# Space Trader Front Constitution

## Core Principles

Cada principio es una barrera que el "Constitution Check" de `/speckit-plan` DEBE
comprobar. El texto de la regla y su porqué viven en el documento enlazado; si
cambian allí, esta constitución no se toca.

### I. Capas con dependencias en un solo sentido

El plan respeta las capas y sus reglas de dependencia.
Fuente: `doc/architecture.md` (Layers, Rules per layer).

### II. El contrato del back es la única fuente de verdad

Tipos, errores y mocks salen del contrato generado; nada se inventa ni se edita a
mano. Fuente: `doc/architecture.md` (api/, Back) y `doc/testing.md`.

### III. La estructura más pequeña que cumpla SOLID

Cada estado, composable o store nuevo está justificado frente a una opción más
pequeña. Fuente: `doc/conventions.md` (Design principles) y `AGENTS.md`
(Ask before generating).

### IV. Probado como lo usaría el usuario (NON-NEGOTIABLE)

El plan dice qué tests unitarios y e2e cubren cada cambio, o por qué no aplica un
e2e. Fuente: `doc/testing.md` y `doc/workflow.md` (Proposals).

### V. Calidad comprobada por herramientas, sin silenciar errores

Lint, format y type-check limpios, sin silenciar el type checker. Fuente:
`AGENTS.md` (Code style, Static analysis).

## Additional Constraints

Stack, librerías, estilos y orden de investigación: `AGENTS.md`,
`doc/dependencies.md`, `doc/conventions.md` y `doc/ui.md`.

## Development Workflow

Propuestas, modo aprendizaje, decisiones e instalaciones: `doc/workflow.md`.
Registro de decisiones: `AGENTS.md` (Where documentation lives).

## Governance

- `AGENTS.md` y `doc/*.md` son la fuente de verdad. Esta constitución solo enumera
  las barreras del plan y no repite su texto, para que no se desincronice.
- Si esta constitución y `AGENTS.md`, `doc/*.md` o una skill no coinciden, se DEBE
  avisar al usuario antes de actuar, citando ambas fuentes.
- Enmiendas: se proponen al usuario y se aplican solo con su aprobación. Solo
  cambia si se añade, quita o redefine una barrera, no cuando cambia el detalle de
  un documento enlazado.
- Versionado semántico: MAJOR si se elimina o redefine una barrera; MINOR si se
  añade una; PATCH para redacción.
- Cumplimiento: una violación en el plan solo se acepta justificada en su sección
  "Complexity Tracking".

**Version**: 2.0.0 | **Ratified**: 2026-10-30 | **Last Amended**: 2026-10-31
