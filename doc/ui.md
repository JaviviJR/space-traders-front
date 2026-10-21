# UI

## Design suggestions

- The user has little design experience. When working on UI, proactively
  suggest improvements even when not asked: layout, spacing, typography,
  color and contrast, responsive behavior, accessibility, states (hover,
  focus, loading, empty, error) and small animations. Explain the reasoning
  in Spanish, so the user learns the design principle behind each suggestion.
- Also suggest ready-made components or libraries worth integrating (icons,
  dialogs, dropdowns, toasts, tables, charts…). Only suggest libraries that
  work with Tailwind and support the Tailwind major version in
  `package.json`: check both before suggesting it, and cite the library's
  docs page. Follow the
  [UI library styling policy](#ui--component-libraries) below. They must
  also support Vue 3 and be actively maintained. For each, say what it adds,
  its cost (bundle size, learning curve) and whether building it ourselves
  would be simpler.
- Keep suggestions as a short list, separate from the requested change, so
  the user can pick which to apply. They follow
  [Learning mode](workflow.md#learning-mode) (shown first, applied only once
  the user agrees), and adding a library follows the dependency rule in
  [Steps and installs](workflow.md#steps-and-installs). Use the
  `frontend-design` skill for visual direction and `web-design-guidelines` to
  review UI code.

## UI / component libraries

Prefer unstyled or Tailwind-styled libraries (styled with Tailwind classes we
control) over libraries that ship their own CSS theme. A library with its
own theme system is acceptable if its design tokens are overridable and are
reconfigured to match our own `@theme` palette, instead of adopting its
default preset as-is.
