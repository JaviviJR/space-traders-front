<script setup lang="ts">
const sampleResponse = `{
  "symbol": "MI-AGENTE-1",
  "headquarters": "X1-DF55-A1",
  "credits": 175000,
  "shipCount": 2
}`
</script>

<template>
  <section class="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
    <div>
      <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Comanda tu flota en el universo
        <span class="bg-linear-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
          SpaceTraders
        </span>
      </h1>
      <p class="mt-6 text-lg text-slate-400">
        Gestiona naves, comercia entre sistemas y cumple contratos desde un panel pensado para
        jugar a SpaceTraders sin escribir peticiones a mano.
      </p>
      <div class="mt-8 flex flex-wrap gap-4">
        <RouterLink
          :to="{ name: 'login' }"
          class="rounded-full bg-cyan-300 px-6 py-2.5 font-medium text-slate-950 hover:bg-cyan-200"
        >
          Empezar
        </RouterLink>
        <a
          href="#features"
          class="rounded-full border border-slate-700 px-6 py-2.5 font-medium hover:border-cyan-300"
        >
          Ver características
        </a>
      </div>
    </div>

    <pre
      aria-hidden="true"
      class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/70 p-6 font-mono text-sm text-cyan-200 shadow-lg shadow-cyan-500/10"
    >{{ sampleResponse }}</pre>
  </section>
</template>
