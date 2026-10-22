# Índice de clases

Busca aquí el concepto (Ctrl+F) para saber en qué PDF y sección está.

## PDFs

| Nº | PDF | Tema | Código de referencia |
| --- | --- | --- | --- |
| 01 | [01-typescript-en-client-ts.pdf](01-typescript-en-client-ts.pdf) | Sintaxis TypeScript usada en el cliente HTTP | `src/api/client.ts` |

## Conceptos

| Concepto | PDF | Sección |
| --- | --- | --- |
| Anotaciones de tipo (`x: T`) | 01 | 1 |
| Tipos que se borran al compilar; tipos vs valores | 01 | 1 |
| `import { type X }` (importar solo un tipo) | 01 | 1 |
| Alias con `type` | 01 | 2 |
| Tipos literales y uniones (`'a' \| 'b'`) | 01 | 2 |
| `interface`, propiedades opcionales (`?`), `readonly` | 01 | 3 |
| `interface A extends B` | 01 | 3 |
| Acceso indexado (`T['clave']`) | 01 | 4 |
| Tipos generados del OpenAPI (`components['schemas'][…]`) | 01 | 4 |
| Desestructuración de objetos | 01 | 5 |
| Rest (`...resto`) y spread (`{ ...obj }`); el orden importa | 01 | 5 |
| Parámetros desestructurados y valores por defecto | 01 | 5 |
| Clases, `constructor`, `super`, herencia | 01 | 6 |
| Errores propios: `extends Error`, `this.name`, `instanceof` | 01 | 6 |
| `Promise<T>`, `async`/`await` | 01 | 7 |
| `try`/`catch`, `.catch()`, `throw await` | 01 | 7 |
| `any` frente a `unknown` | 01 | 8 |
| Narrowing (`typeof`, `instanceof`, `Array.isArray`, `&&`) | 01 | 9 |
| Narrowing por descarte (código después de un `return`) | 01 | 9, 10 |
| `typeof null === 'object'` | 01 | 9 |
| Predicados de tipo (`x is T`) | 01 | 10 |
| Validación en runtime atada a los tipos | 01 | 10 |
| Aserciones (`as`): ensanchar frente a afirmar | 01 | 11 |
| Arrays de solo lectura (`readonly string[]`) | 01 | 11 |
| Genéricos (`<T>`) y restricciones (`T extends X`) | 01 | 12 |
| `Record`, firmas de índice (`{ [key: string]: T }`) | 01 | 13 |
| `Pick`, `Omit` | 01 | 13 |
| `Extract`, `Exclude` | 01 | 13 |
| `never` y comprobaciones en tiempo de compilación (`AssertNoOverlap`) | 01 | 14 |
| `import.meta.env` (variables `VITE_`), `new URL(path, base)` | 01 | 15 |
| Flujo de errores de `apiFetch` (los 5 finales posibles) | 01 | 16 |
