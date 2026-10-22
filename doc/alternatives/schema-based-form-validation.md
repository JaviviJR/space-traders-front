# Schema-based form validation

Context: alternative to writing the client-side validation rules by hand in
each form's composable (first case:
[useRegister.ts](../../src/composables/useRegister.ts)), where errors are shown
through `useFormErrors` like the back's.

Revisit when several forms repeat the same rules and wiring. Two variants:

- Validators generated from the back's OpenAPI spec (e.g. Zod or Valibot
  schemas): the rules can't drift from the back. `openapi-typescript` only
  generates types, so it drops keywords like `minLength` or `format`; this
  needs another generator. Worth it once the spec declares every rule: today
  it only has `password.minLength`, not non-blank fields or the email format.
- A validation or forms library with hand-written schemas (e.g. Zod, PrimeVue
  Forms): shared rule and message wiring across many forms, but the rules are
  still copied by hand, so it doesn't fix drift.

Before choosing either, follow [dependencies.md](../dependencies.md).
