<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Message from 'primevue/message'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useRegister } from '@/composables/useRegister'

const { autofocus = false } = defineProps<{
  autofocus?: boolean
}>()

const emit = defineEmits<{
  switchToLogin: []
}>()

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
  <form
    class="flex flex-col gap-4"
    @submit.prevent="handleSubmit"
  >
    <div class="flex flex-col gap-2">
      <label
        class="text-sm text-slate-400"
        for="name"
        >Nombre</label
      >
      <InputText
        id="name"
        v-model="name"
        type="text"
        autocomplete="name"
        :autofocus="autofocus"
        required
      />
    </div>

    <div class="flex flex-col gap-2">
      <label
        class="text-sm text-slate-400"
        for="email"
        >Email</label
      >
      <InputText
        id="email"
        v-model="email"
        type="email"
        autocomplete="email"
        required
      />
    </div>

    <div class="flex flex-col gap-2">
      <label
        class="text-sm text-slate-400"
        for="password"
        >Contraseña</label
      >
      <Password
        v-model="password"
        input-id="password"
        :feedback="false"
        toggle-mask
        autocomplete="new-password"
        required
        fluid
      />
    </div>

    <div class="flex flex-col gap-2">
      <label
        class="text-sm text-slate-400"
        for="password-confirmation"
        >Confirmar contraseña</label
      >
      <Password
        v-model="passwordConfirmation"
        input-id="password-confirmation"
        :feedback="false"
        :invalid="passwordMismatch"
        toggle-mask
        autocomplete="new-password"
        required
        fluid
      />
      <Message
        v-if="passwordMismatch"
        severity="error"
        size="small"
        variant="simple"
      >
        Las contraseñas no coinciden.
      </Message>
    </div>

    <div class="flex flex-col gap-2">
      <label
        class="text-sm text-slate-400"
        for="account-token"
        >Token de cuenta</label
      >
      <InputText
        id="account-token"
        v-model="accountToken"
        type="text"
        required
      />
    </div>

    <Message
      v-if="error"
      severity="error"
      :closable="false"
      >{{ error }}</Message
    >

    <BaseButton
      type="submit"
      variant="primary"
      :disabled="loading || passwordMismatch"
    >
      {{ loading ? 'Creando cuenta…' : 'Crear cuenta' }}
    </BaseButton>

    <p class="text-center text-sm text-slate-400">
      ¿Ya tienes cuenta?
      <button
        type="button"
        class="cursor-pointer text-sky-400 hover:underline"
        @click="emit('switchToLogin')"
      >
        Inicia sesión
      </button>
    </p>
  </form>
</template>
