<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Message from 'primevue/message'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useRegister } from '@/composables/useRegister'

const {
  name,
  email,
  password,
  passwordConfirmation,
  accountToken,
  loading,
  error,
  passwordMismatch,
  submit,
} = useRegister()

async function handleSubmit() {
  await submit()
}
</script>

<template>
  <section class="mx-auto max-w-md px-4 py-24">
    <h1 class="text-3xl font-bold text-white">Crear cuenta</h1>

    <form class="mt-8 flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-2">
        <label class="text-sm text-slate-400" for="name">Nombre</label>
        <InputText id="name" v-model="name" type="text" autocomplete="name" required />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm text-slate-400" for="email">Email</label>
        <InputText id="email" v-model="email" type="email" autocomplete="email" required />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm text-slate-400" for="password">Contraseña</label>
        <Password
          input-id="password"
          v-model="password"
          :feedback="false"
          toggle-mask
          autocomplete="new-password"
          required
          fluid
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm text-slate-400" for="password-confirmation"
          >Confirmar contraseña</label
        >
        <Password
          input-id="password-confirmation"
          v-model="passwordConfirmation"
          :feedback="false"
          :invalid="passwordMismatch"
          toggle-mask
          autocomplete="new-password"
          required
          fluid
        />
        <Message v-if="passwordMismatch" severity="error" size="small" variant="simple">
          Las contraseñas no coinciden.
        </Message>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm text-slate-400" for="account-token">Token de cuenta</label>
        <InputText id="account-token" v-model="accountToken" type="text" required />
      </div>

      <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>

      <BaseButton type="submit" variant="primary" :disabled="loading || passwordMismatch">
        {{ loading ? 'Creando cuenta…' : 'Crear cuenta' }}
      </BaseButton>
    </form>
  </section>
</template>
