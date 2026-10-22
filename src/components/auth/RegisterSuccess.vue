<script setup lang="ts">
const { email } = defineProps<{
  email: string
}>()
</script>

<template>
  <div class="flex flex-col gap-3 py-4 text-center">
    <h2 class="text-lg font-semibold text-white">Revisa tu correo</h2>
    <p class="text-sm text-slate-400">
      Hemos enviado un enlace de confirmación a
      <strong class="font-semibold break-all text-white">{{ email }}</strong
      >. Ábrelo para activar tu cuenta.
    </p>
    <p class="text-sm text-slate-400">Si no lo ves, revisa la carpeta de spam.</p>
  </div>
</template>
