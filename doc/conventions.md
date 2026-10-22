# Vue conventions and design principles

## Conventions

The parts of the official [Vue style guide](https://vuejs.org/style-guide)
that a tool can check are enforced by lint (`eslint.config.ts`) and Prettier
(`.prettierrc.json`). No tool checks the rules below: apply them when writing
code.

Project-specific:

- `lang="ts"` in every `<script setup>`.
- Style with Tailwind utility classes in templates; they need no scoping
  mechanism. New design tokens go in the `@theme` block in
  `src/assets/main.css`, not a new config file. A component's own CSS must be
  `scoped` or a CSS Module (lint checks it); global CSS goes in `main.css`.
- Avoid descendant variants (`[&_p]:…`, `*:…`) that style a child component's
  internals; use its props or styling API instead.
- Prefer `computed` over a watcher that just derives a value; reach for
  `watch`/`watchEffect` only for side effects.

From the style guide (Priority B, strongly recommended — follow unless there's
a reason not to):

- SFC filenames in PascalCase or kebab-case, consistently.
- Prefix generic, app-wide-styled base components with `Base`/`App`/`V`
  (e.g. `BaseButton`).
- Prefix a child component tightly coupled to one parent with the parent's
  name (`TodoListItem`).
- Component name word order: general → specific (`SearchButtonClear`).
- Full words over abbreviations in component names.
- Keep template expressions simple; move logic into computed properties or
  methods.
- Split a complex computed into several smaller, well-named ones.

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
