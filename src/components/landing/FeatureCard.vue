<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
}>()
</script>

<template>
  <article class="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
    <span
      class="flex size-10 items-center justify-center rounded-lg bg-cyan-300/10 text-xl"
      aria-hidden="true"
    >
      {{ icon }}
    </span>
    <h3 class="mt-4 font-semibold text-cyan-300">{{ title }}</h3>
    <p class="mt-2 text-sm text-slate-400">{{ description }}</p>
  </article>
</template>
