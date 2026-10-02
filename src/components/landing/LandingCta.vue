<template>
  <section class="mx-auto max-w-6xl px-4 pb-24">
    <div
      class="rounded-2xl border border-cyan-300/20 bg-linear-to-br from-indigo-500/10 to-cyan-400/10 px-6 py-12 text-center"
    >
      <h2 class="text-3xl font-bold text-white">¿Listo para despegar?</h2>
      <p class="mt-4 text-slate-400">Registra tu agente o entra con el que ya tienes.</p>
      <RouterLink
        :to="{ name: 'login' }"
        class="mt-8 inline-block rounded-full bg-cyan-300 px-6 py-2.5 font-medium text-slate-950 hover:bg-cyan-200"
      >
        Crear agente o iniciar sesión
      </RouterLink>
    </div>
  </section>
</template>
