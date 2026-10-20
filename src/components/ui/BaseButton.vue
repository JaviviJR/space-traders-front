<script setup lang="ts">
import { computed, useAttrs } from 'vue'
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

const attrs = useAttrs()
const severity = computed(() => (variant === 'secondary' ? 'secondary' : undefined))
</script>

<template>
  <!-- PrimeVue's asChild only exposes its own slotProps.class (p-button p-component);
       it doesn't forward an external class (inheritAttrs: false, no v-bind="$attrs" on
       this branch), so a class passed to BaseButton would be silently dropped here
       unlike the href/plain branches below. Merging attrs.class by hand is PrimeVue's
       asChild limitation, not an officially documented pattern. -->
  <Button v-if="to" asChild :severity="severity" v-slot="slotProps">
    <RouterLink :to="to" :class="[slotProps.class, attrs.class]">
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
