<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuthDialog } from '@/composables/useAuthDialog'

const { visible, openLogin } = useAuthDialog()
</script>

<template>
  <header>
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
      <RouterLink
        :to="{ name: 'home' }"
        class="bg-linear-to-r from-sky-400 via-indigo-400 to-blue-400 bg-clip-text font-display text-lg tracking-tight text-transparent"
      >
        SpaceTraders
      </RouterLink>
      <BaseButton
        :aria-expanded="visible"
        :aria-controls="visible ? 'auth-dialog' : undefined"
        @click="openLogin"
      >
        Iniciar sesión
      </BaseButton>
    </nav>
  </header>
</template>
