# Hand-rolled `reactive()` store

Context: alternative to Pinia for state shared by several views, in
[architecture.md](../architecture.md#rules-per-layer).

The
[official Vue guide on state management](https://vuejs.org/guide/scaling-up/state-management)
backs choosing Pinia: it recommends Pinia over a hand-rolled store
(`reactive()` in a module) when the team needs stronger conventions, Vue
Devtools integration (timeline, time-travel) or SSR.
