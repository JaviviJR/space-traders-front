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
  registered: [email: string]
}>()

const {
  name,
  email,
  password,
  passwordConfirmation,
  accountToken,
  loading,
  fieldErrors,
  generalErrors,
  submit,
} = useRegister()

const errorIds = {
  name: 'name-errors',
  email: 'email-errors',
  password: 'password-errors',
  passwordConfirmation: 'password-confirmation-errors',
  accountToken: 'account-token-errors',
} as const

// `invalid` already sets aria-invalid on the input; only the description link is ours.
function describedBy(field: keyof typeof errorIds): string | undefined {
  return fieldErrors.value[field] ? errorIds[field] : undefined
}

async function handleSubmit() {
  const user = await submit()

  if (user) {
    emit('registered', user.email)
  }
}
</script>

<template>
  <form
    class="flex flex-col gap-4"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <div
      v-if="generalErrors.length > 0"
      class="flex flex-col gap-2"
    >
      <Message
        v-for="message in generalErrors"
        :key="message"
        severity="error"
        :closable="false"
        >{{ message }}</Message
      >
    </div>

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
        :invalid="fieldErrors.name !== undefined"
        :aria-describedby="describedBy('name')"
        required
      />
      <div
        v-if="fieldErrors.name"
        :id="errorIds.name"
        class="flex flex-col gap-1"
      >
        <Message
          v-for="message in fieldErrors.name"
          :key="message"
          severity="error"
          size="small"
          variant="simple"
          >{{ message }}</Message
        >
      </div>
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
        :invalid="fieldErrors.email !== undefined"
        :aria-describedby="describedBy('email')"
        required
      />
      <div
        v-if="fieldErrors.email"
        :id="errorIds.email"
        class="flex flex-col gap-1"
      >
        <Message
          v-for="message in fieldErrors.email"
          :key="message"
          severity="error"
          size="small"
          variant="simple"
          >{{ message }}</Message
        >
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label
        class="text-sm text-slate-400"
        for="password"
        >Contraseña</label
      >
      <!-- Password puts fallthrough attributes on its wrapper; inputProps reaches the <input>. -->
      <Password
        v-model="password"
        input-id="password"
        :input-props="{ 'aria-describedby': describedBy('password') }"
        :feedback="false"
        :invalid="fieldErrors.password !== undefined"
        toggle-mask
        autocomplete="new-password"
        required
        fluid
      />
      <div
        v-if="fieldErrors.password"
        :id="errorIds.password"
        class="flex flex-col gap-1"
      >
        <Message
          v-for="message in fieldErrors.password"
          :key="message"
          severity="error"
          size="small"
          variant="simple"
          >{{ message }}</Message
        >
      </div>
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
        :input-props="{
          'aria-describedby': describedBy('passwordConfirmation'),
        }"
        :feedback="false"
        :invalid="fieldErrors.passwordConfirmation !== undefined"
        toggle-mask
        autocomplete="new-password"
        required
        fluid
      />
      <div
        v-if="fieldErrors.passwordConfirmation"
        :id="errorIds.passwordConfirmation"
        class="flex flex-col gap-1"
      >
        <Message
          v-for="message in fieldErrors.passwordConfirmation"
          :key="message"
          severity="error"
          size="small"
          variant="simple"
          >{{ message }}</Message
        >
      </div>
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
        :invalid="fieldErrors.accountToken !== undefined"
        :aria-describedby="describedBy('accountToken')"
        required
      />
      <div
        v-if="fieldErrors.accountToken"
        :id="errorIds.accountToken"
        class="flex flex-col gap-1"
      >
        <Message
          v-for="message in fieldErrors.accountToken"
          :key="message"
          severity="error"
          size="small"
          variant="simple"
          >{{ message }}</Message
        >
      </div>
    </div>

    <BaseButton
      type="submit"
      variant="primary"
      :disabled="loading"
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
