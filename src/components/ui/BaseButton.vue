<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import Button from 'primevue/button'

const {
  to,
  href,
  variant = 'primary',
} = defineProps<{
  to?: RouteLocationRaw
  href?: string
  variant?: 'primary' | 'secondary'
}>()

const severity = computed(() => (variant === 'secondary' ? 'secondary' : undefined))
</script>

<template>
  <Button v-if="to" asChild :severity="severity" v-slot="slotProps">
    <RouterLink :to="to" :class="slotProps.class">
      <slot />
    </RouterLink>
  </Button>
  <Button v-else-if="href" as="a" :href="href" :severity="severity">
    <slot />
  </Button>
  <Button v-else :severity="severity">
    <slot />
  </Button>
</template>
