<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import HeroCodePanel from './HeroCodePanel.vue'
</script>

<template>
  <section class="relative isolate overflow-hidden">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 mask-t-from-70%">
      <div class="absolute -top-40 -left-40 size-128 rounded-full bg-cyan-500/15 blur-3xl" />
      <div class="absolute -top-40 -right-40 size-128 rounded-full bg-sky-500/10 blur-3xl" />
    </div>

    <div
      class="mx-auto grid max-w-7xl items-center gap-x-8 gap-y-16 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20 xl:gap-x-16"
    >
      <div>
        <h1 class="text-gradient font-display text-4xl tracking-tight text-balance sm:text-5xl">
          Comanda tu flota en el universo SpaceTraders
        </h1>
        <p class="mt-3 text-xl tracking-tight text-slate-400">
          Gestiona naves, comercia entre sistemas y cumple contratos desde un panel pensado para
          jugar a SpaceTraders sin escribir peticiones a mano.
        </p>
        <div class="mt-8 flex flex-wrap gap-4">
          <BaseButton :to="{ name: 'login' }">Empezar</BaseButton>
          <BaseButton href="#features" variant="secondary">Ver características</BaseButton>
        </div>
      </div>

      <HeroCodePanel />
    </div>
  </section>
</template>
