# Índice de clases

Busca aquí el concepto (Ctrl+F) para saber en qué PDF y sección está.

## PDFs

| Nº | PDF | Tema | Código de referencia |
| --- | --- | --- | --- |
| 01 | [01-typescript-en-client-ts.pdf](01-typescript-en-client-ts.pdf) | Sintaxis TypeScript usada en el cliente HTTP | `src/api/client.ts`, `src/api/errors/ApiError.ts`, `src/api/errors/toApiError.ts` |

## Conceptos

| Concepto | PDF | Sección |
| --- | --- | --- |
| Anotaciones de tipo (`x: T`) | 01 | 1 |
| Tipos que se borran al compilar; tipos vs valores | 01 | 1 |
| Módulos: `export`, `import`, interfaz pública de un archivo | 01 | 2 |
| Rutas de import relativas (`./`) y alias (`@/`) | 01 | 2 |
| `import type { X }` e `import { valor, type X }` | 01 | 2 |
| Alias con `type` | 01 | 3 |
| Tipos literales y uniones (`'a' \| 'b'`) | 01 | 3 |
| `interface`, propiedades opcionales (`?`), `readonly` | 01 | 4 |
| `interface A extends B` | 01 | 4 |
| Acceso indexado (`T['clave']`) | 01 | 5 |
| Tipos generados del OpenAPI (`components['schemas'][…]`) | 01 | 5 |
| Desestructuración de objetos | 01 | 6 |
| Rest (`...resto`) y spread (`{ ...obj }`); el orden importa | 01 | 6 |
| Parámetros desestructurados y valores por defecto | 01 | 6 |
| Clases, `constructor`, `super`, herencia | 01 | 7 |
| Errores propios: `extends Error`, `this.name`, `instanceof` | 01 | 7 |
| `Promise<T>`, `async`/`await` | 01 | 8 |
| `try`/`catch`, `.catch()`, `throw await` | 01 | 8 |
| `any` frente a `unknown` | 01 | 9 |
| Narrowing (`typeof`, `instanceof`, `Array.isArray`, `&&`) | 01 | 10 |
| Narrowing por descarte (código después de un `return`) | 01 | 10, 11 |
| `typeof null === 'object'` | 01 | 10 |
| Predicados de tipo (`x is T`) | 01 | 11 |
| Validación en runtime atada a los tipos | 01 | 11 |
| "Parse, don't validate" | 01 | 11 |
| Aserciones (`as`): ensanchar frente a afirmar | 01 | 12 |
| Arrays de solo lectura (`readonly string[]`) | 01 | 12 |
| Genéricos (`<T>`) y restricciones (`T extends X`) | 01 | 13 |
| `Record`, firmas de índice (`{ [key: string]: T }`) | 01 | 14 |
| `Pick`, `Omit` | 01 | 14 |
| `Extract`, `Exclude` | 01 | 14 |
| `never` y comprobaciones en tiempo de compilación (`AssertNoOverlap`) | 01 | 15 |
| Responsabilidad única: partir un módulo en archivos; dependencias sin ciclos | 01 | 16 |
| `import.meta.env` (variables `VITE_`), `new URL(path, base)` | 01 | 17 |
| Flujo de errores de `apiFetch` (los 5 finales posibles) | 01 | 18 |
