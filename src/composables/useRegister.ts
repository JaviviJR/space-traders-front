import { computed, ref } from 'vue'
import { register } from '@/api/auth'
import { ApiError } from '@/api/errors/ApiError'
import type { RegisterUserResponse } from '@/api/auth'

export function useRegister() {
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const passwordConfirmation = ref('')
  const accountToken = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const passwordMismatch = computed(
    () =>
      passwordConfirmation.value.length > 0 &&
      password.value !== passwordConfirmation.value,
  )

  async function submit(): Promise<RegisterUserResponse | null> {
    error.value = null

    if (passwordMismatch.value) {
      error.value = 'Las contraseñas no coinciden.'
      return null
    }

    loading.value = true

    try {
      return await register({
        name: name.value,
        email: email.value,
        password: password.value,
        accountToken: accountToken.value,
      })
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          error.value = 'Ya existe una cuenta registrada con ese email.'
        } else if (err.status === 422) {
          error.value =
            err.message ||
            'Revisa los datos del formulario e inténtalo de nuevo.'
        } else {
          error.value =
            'No se ha podido completar el registro. Inténtalo de nuevo.'
        }
      } else {
        error.value =
          'No se ha podido completar el registro. Inténtalo de nuevo.'
      }

      return null
    } finally {
      loading.value = false
    }
  }

  return {
    name,
    email,
    password,
    passwordConfirmation,
    accountToken,
    loading,
    error,
    passwordMismatch,
    submit,
  }
}
