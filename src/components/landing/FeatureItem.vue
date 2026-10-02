<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
}>()
</script>

<template>
  <div class="relative">
    <dt>
      <span
        aria-hidden="true"
        class="absolute flex size-12 items-center justify-center rounded-md bg-sky-300 text-slate-900"
      >
        <span :class="icon" class="text-2xl" />
      </span>
      <span class="text-gradient ml-16 block text-lg leading-6 font-medium">{{ title }}</span>
    </dt>
    <dd class="mt-2 ml-16 text-base text-slate-400">{{ description }}</dd>
  </div>
</template>
