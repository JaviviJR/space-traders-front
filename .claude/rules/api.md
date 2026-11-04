---
paths:
  - "src/api/**"
---

# src/api/

- Plain TypeScript: imports nothing from Vue or Pinia. Each function returns
  typed data or throws `ApiError`.
- Errors live in `src/api/errors/`: the classes in `ApiError.ts`, the parsing
  of error responses in `toApiError.ts`. `ApiError` is the base; each contract
  error schema that extends it gets a subclass with the same name and its
  extra fields, and the parsing picks the subclass from the response's `code`.
- Logic branches on `code`, never on `status` or the text of `message`.
- `code` is a closed type but an open enum at runtime: the parsing checks it
  against the runtime array the generator emits. An error the contract doesn't
  describe (unknown code, non-JSON body) becomes a front-only code and is
  logged with `console.error`, as a signal to regenerate the types.
- Front-only codes are defined next to the classes, never in `src/types/`; a
  compile-time check fails `npm run type-check` if one overlaps a contract
  code.
- Import error modules from their own file, not through a re-exporting index.
- When writing an endpoint function, check in the generated types which error
  schema it returns for each status. Callers catch `ApiError` and use
  `instanceof` on a subclass only when they need its extra fields.
- To add an error extension: the back adds it to its contract, run
  `npm run generate:types`, then add the subclass next to `ApiError` and its
  `code` mapping in `toApiError.ts`.
