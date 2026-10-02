<script setup lang="ts">
const links = [
  { label: 'Documentación de la API', href: 'https://docs.spacetraders.io' },
  { label: 'SpaceTraders', href: 'https://spacetraders.io' },
  { label: 'GitHub', href: 'https://github.com/SpaceTradersAPI' },
]
</script>

<template>
  <footer class="border-t border-slate-800/60">
    <div
      class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:justify-between"
    >
      <p class="text-slate-500">Cliente no oficial de SpaceTraders.</p>
      <ul class="flex flex-wrap gap-6">
        <li v-for="link in links" :key="link.href">
          <a
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-cyan-300"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>
    </div>
  </footer>
</template>
