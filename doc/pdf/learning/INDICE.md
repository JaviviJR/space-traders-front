# Índice de clases

Busca aquí el concepto (Ctrl+F) para saber en qué PDF y sección está.

## PDFs

| Nº | PDF | Tema | Código de referencia |
| --- | --- | --- | --- |
| 01 | [01-typescript-en-client-ts.pdf](01-typescript-en-client-ts.pdf) | Sintaxis TypeScript usada en el cliente HTTP | `src/api/client.ts`, `src/api/errors/ApiError.ts`, `src/api/errors/toApiError.ts` |
| 02 | [02-validacion-formulario-registro.pdf](02-validacion-formulario-registro.pdf) | Reactividad de Vue aplicada a la validación del formulario de registro | `src/composables/useRegister.ts`, `src/composables/useForm.ts`, `src/composables/useFormErrors.ts`, `src/components/auth/RegisterForm.vue`, `src/__tests__/RegisterForm.spec.ts`, `src/__tests__/useForm.spec.ts`, `src/__tests__/useFormErrors.spec.ts`, `e2e/register.spec.ts` |

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
| `ref` y `.value`: leer suscribe, escribir avisa | 02 | 1 |
| `shallowRef`: reactivo solo al reemplazar; copiar y asignar en vez de mutar | 02 | 2 |
| `computed`: valor derivado y cacheado; derivar en vez de sincronizar | 02 | 3 |
| `watch`: efectos ante un cambio; `computed` frente a `watch`; `flush: 'pre'` | 02 | 4 |
| `readonly`: exponer estado sin permitir escribirlo | 02 | 5 |
| Seguimiento de dependencias en tiempo de ejecución | 02 | 6 |
| Dependencias condicionales (ramas de un `if` o ternario) | 02 | 7 |
| Computed perezoso: "sucio" frente a "ejecutado"; caché | 02 | 8 |
| Efectos (render, `watch`) frente a computeds al recibir un aviso | 02 | 8 |
| Render encolado, `nextTick` | 02 | 9 |
| Cadena refs → computed → computed → render; cuándo se ejecuta `clientErrors` | 02 | 10, 24 |
| Composables: qué son, estado propio por llamada | 02 | 11 |
| Composables en capas: cada capa una responsabilidad, solo habla con la de al lado | 02 | 12 |
| `MaybeRefOrGetter` y `toValue` | 02 | 13 |
| Getter ejecutado dentro de un computed: sus lecturas son dependencias del computed | 02 | 7, 10, 13 |
| `Partial<Record<K, V>>` para errores por campo (`FieldErrors<Field>`) | 02 | 14 |
| Genéricos inferidos de los argumentos (`useForm<Field, Result>`) | 02 | 14 |
| Reexportar un tipo (`export type { X }`); no es un barrel | 02 | 14 |
| Inversión de control / Template Method: pasar funciones a un composable | 02 | 15 |
| Mapa por código (`Partial<Record<ApiErrorCode, fn>>`) frente a callback `onError` | 02 | 15 |
| `v-if`, `v-for` y `:key` | 02 | 16 |
| `v-bind` (`:prop`); un atributo con `undefined` desaparece del DOM | 02 | 17 |
| `as const` y `keyof typeof` | 02 | 17 |
| `defineEmits`: props hacia abajo, eventos hacia arriba | 02 | 18 |
| Atributos fallthrough; `inputProps` de PrimeVue `Password` | 02 | 19 |
| `novalidate`, `required`, `aria-invalid`, `aria-describedby` | 02 | 20 |
| No deshabilitar el botón por errores de validación | 02 | 20 |
| Reglas del cliente copiadas del back; `NotBlank` sin `trim` | 02 | 21 |
| Contar caracteres por code points (`[...str].length`) frente a `.length` | 02 | 21 |
| Decidir por `err.code` y no por `err.status`; relanzar errores desconocidos | 02 | 22 |
| `try`/`catch`/`finally` para `loading` | 02 | 22 |
| "Reward early, punish late": cuándo aparece y desaparece cada error | 02 | 23 |
| Qué está mal (`useFormErrors`) frente a cuándo se ve (`useForm`) | 02 | 12, 23 |
| Vue Test Utils: `mount`, `setValue`, `trigger`, `emitted` | 02 | 26 |
| `vi.mock`, `vi.mocked`, `mockRejectedValue`, `mockReset` | 02 | 26 |
| `flushPromises` frente a `nextTick` | 02 | 26 |
| Comprobar mensajes a través de `aria-describedby` en tests | 02 | 26 |
| Un refactor se demuestra con los tests que no cambian | 02 | 26 |
| Tests de composables sin componente: `effectScope`, `scope.run`, `scope.stop` | 02 | 27 |
| Probar `loading` con una promesa resuelta a mano; `rejects.toBe` | 02 | 27 |
| Playwright: `page.route`, `route.fulfill`, `route.abort` | 02 | 28 |
| `getByRole`, `getByLabel`, `toHaveAccessibleDescription` | 02 | 28 |
