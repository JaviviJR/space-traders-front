# Feature-based folders

Context: alternative to the by-type folder structure in
[architecture.md](../architecture.md#folders).

If the project grows a lot (dozens of components), reconsider switching from
folders by type (`components/`, `stores/`, `composables/`) to folders by
feature/domain. It isn't an official Vue recommendation, but it's a recurring
opinion in the community (e.g.
[certificates.dev](https://certificates.dev/blog/structuring-a-large-vue-app-a-feature-based-folder-architecture)):
the by-type structure becomes awkward beyond ~50 components.
