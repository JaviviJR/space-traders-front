<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="mx-auto max-w-md px-4 py-24 text-center">
    <h1 class="text-3xl font-bold text-white">Iniciar sesión</h1>
    <p class="mt-4 text-slate-400">Próximamente.</p>
    <p class="mt-8 text-sm text-slate-400">
      ¿No tienes cuenta?
      <RouterLink :to="{ name: 'register' }" class="text-sky-400 hover:underline"
        >Regístrate</RouterLink
      >
    </p>
  </section>
</template>
