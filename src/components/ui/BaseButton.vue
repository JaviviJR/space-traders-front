<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

const {
  to,
  href,
  variant = 'primary',
} = defineProps<{
  to?: RouteLocationRaw
  href?: string
  variant?: 'primary' | 'secondary'
}>()

const variantClasses = {
  primary:
    'bg-sky-300 font-semibold text-slate-900 hover:bg-sky-200 active:bg-sky-500 focus-visible:outline-sky-300/50',
  secondary:
    'bg-slate-800 font-medium text-white hover:bg-slate-700 active:text-slate-400 focus-visible:outline-white/50',
}

const classes = computed(() => [
  'inline-block rounded-full px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2',
  variantClasses[variant],
])
</script>

<template>
  <RouterLink v-if="to" :to="to" :class="classes"><slot /></RouterLink>
  <a v-else :href="href" :class="classes"><slot /></a>
</template>
