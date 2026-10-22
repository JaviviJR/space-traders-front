# Vue conventions and design principles

## Conventions

Project-specific conventions, not covered by the official style guide:

- Composition API only, `<script setup lang="ts">` in every component — no
  Options API, no mixins.
- Style with Tailwind utility classes in templates. New design tokens go in
  the `@theme` block in `src/assets/main.css`, not a new config file.
- Prefer `computed` over a watcher that just derives a value; reach for
  `watch`/`watchEffect` only for side effects.

From the official [Vue style guide](https://vuejs.org/style-guide), Priority A
(essential, non-negotiable):

- Multi-word component names (`TodoItem`, not `Todo`) — avoids clashes with
  current/future HTML elements. Root `App` is exempt.
- Props declared with at least their type(s) — never a bare array like
  `['status']`.
- `v-for` always has a unique `:key` (required on components).
- Never `v-if` and `v-for` on the same element — filter via a computed
  property, or wrap in `<template>`.
- Component-scoped styling. Tailwind utility classes in the template need no
  scoping mechanism. A component's own CSS goes in a `<style scoped>` block
  (or CSS Modules), except in the root `App` and layout components. Avoid
  descendant variants (`[&_p]:…`, `*:…`) that style a child component's
  internals; use its props or styling API instead.

Priority B (strongly recommended — follow unless there's a reason not to):

- One component per file; SFC filename in PascalCase or kebab-case,
  consistently.
- Prefix generic, app-wide-styled base components with `Base`/`App`/`V`
  (e.g. `BaseButton`).
- Prefix a child component tightly coupled to one parent with the parent's
  name (`TodoListItem`).
- Component name word order: general → specific (`SearchButtonClear`).
- Self-close components with no content in SFCs; never in in-DOM templates.
- PascalCase for component names in SFC templates.
- Full words over abbreviations in component names.
- Props: camelCase in JS, kebab-case in in-DOM templates.
- Multiple attributes on an element → one per line.
- Keep template expressions simple; move logic into computed properties or
  methods.
- Split a complex computed into several smaller, well-named ones.
- Quote every non-empty attribute value.
- Use directive shorthands (`:`, `@`, `#`) consistently — always or never.

One style-guide pair is cross-referenced elsewhere, not repeated here:
component/attribute ordering and SFC block order are formatting (Priority C),
not checked by lint today — see [Code style](../AGENTS.md#code-style).

## Design principles

Write code that follows SOLID, adapted to components/composables/stores:

- **Single responsibility.** A component renders; a composable or store holds
  logic.
- **Open/closed.** Add a new component or composable instead of branching an
  existing one on a type/mode prop when the branches don't share markup.
- **Liskov substitution.** A component that accepts a slot or prop-driven
  variant honors the same contract across variants — no variant that needs
  extra required props.
- **Interface segregation.** Keep props/composable return types minimal and
  role-specific. Don't make a component accept props it ignores.
- **Dependency inversion.** Components depend on composables/stores, not on
  `src/api/` or `fetch` directly; composables depend on injected state, not
  global singletons.

Logic used by one component stays in it, unless it calls `src/api/` or has its
own state and side effects: then it goes to a composable (components never
call the API). A store only when several views share the state. Prefer the
smallest structure that satisfies these principles.
