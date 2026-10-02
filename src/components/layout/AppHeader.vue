<template>
  <header class="border-b border-slate-800/60">
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      <RouterLink :to="{ name: 'home' }" class="text-lg font-semibold text-cyan-300">
        SpaceTraders
      </RouterLink>
      <RouterLink
        :to="{ name: 'login' }"
        class="rounded-full bg-cyan-300 px-4 py-1.5 text-sm font-medium text-slate-950 hover:bg-cyan-200"
      >
        Iniciar sesión
      </RouterLink>
    </nav>
  </header>
</template>
