---
paths:
  - "src/**/*.vue"
---

# Vue components

- `lang="ts"` in every `<script setup>`.
- Style with Tailwind utility classes in templates. New design tokens go in the
  `@theme` block of `src/assets/main.css`, not a new config file. Global CSS
  goes in `main.css` too.
- Don't style a child component's internals with descendant variants
  (`[&_p]:…`, `*:…`); use its props or styling API.
- Prefer `computed` over a watcher that only derives a value; use
  `watch`/`watchEffect` only for side effects.
- UI text is in Spanish (there is no i18n yet).
