<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
    <div class="rounded-2xl bg-panel/80 px-6 py-12 text-center ring-1 ring-white/10">
      <h2 class="text-gradient font-display text-4xl tracking-tight text-balance">
        ¿Listo para despegar?
      </h2>
      <p class="mt-4 text-slate-400">Registra tu agente o entra con el que ya tienes.</p>
      <BaseButton :to="{ name: 'login' }" class="mt-8">Crear agente o iniciar sesión</BaseButton>
    </div>
  </section>
</template>
