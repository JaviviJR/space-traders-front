import { afterEach, describe, expect, it } from 'vitest'
import { computed, effectScope, nextTick, ref } from 'vue'
import type { EffectScope } from 'vue'
import { ApiError, ApiErrorValidation } from '@/api/errors/ApiError'
import type { ApiErrorCode } from '@/api/errors/ApiError'
import { useFormErrors } from '../composables/useFormErrors'

// The composable's watchers outlive the test unless they run in a scope we stop.
let scope: EffectScope | undefined

afterEach(() => {
  scope?.stop()
  scope = undefined
})

function setup() {
  const email = ref('')
  const password = ref('')
  const clientErrors = computed(() => ({
    password:
      password.value.length < 8
        ? ['La contraseña debe tener al menos 8 caracteres.']
        : [],
  }))

  scope = effectScope()
  const errors = scope.run(() =>
    useFormErrors({ fields: { email, password }, clientErrors }),
  )
  if (errors === undefined) throw new Error('The effect scope did not run.')

  return { email, password, errors }
}

function validationError(violations: Record<string, string[]>) {
  return new ApiErrorValidation({
    message: 'Validation failed.',
    status: 422,
    violations,
  })
}

describe('useFormErrors', () => {
  it('distributes each field message list to that field', () => {
    const { password, errors } = setup()
    password.value = 'long enough'

    errors.markSubmitted()
    errors.setFromApiError(
      validationError({
        email: ['Este valor no es una dirección de email válida.'],
        password: ['La contraseña es demasiado común.', 'Otro mensaje.'],
      }),
    )

    expect(errors.fieldErrors.value).toEqual({
      email: ['Este valor no es una dirección de email válida.'],
      password: ['La contraseña es demasiado común.', 'Otro mensaje.'],
    })
    expect(errors.generalErrors.value).toEqual([])
  })

  it('sends _global and unknown keys to the general errors', () => {
    const { errors } = setup()

    errors.setFromApiError(
      validationError({
        _global: ['Los datos enviados no son válidos.'],
        accountToken: ['El token no es válido.'],
      }),
    )

    expect(errors.generalErrors.value).toEqual([
      'Los datos enviados no son válidos.',
      'El token no es válido.',
    ])
    expect(errors.fieldErrors.value).toEqual({})
  })

  it.each<[ApiErrorCode, number, string]>([
    [
      'network_error',
      0,
      'No se ha podido conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.',
    ],
    [
      'internal_error',
      500,
      'Se ha producido un error en el servidor. Inténtalo de nuevo más tarde.',
    ],
    [
      'http_error',
      404,
      'No se ha podido completar la petición. Inténtalo de nuevo.',
    ],
    [
      'unrecognized',
      418,
      'Se ha producido un error inesperado. Inténtalo de nuevo.',
    ],
    [
      'authentication_required',
      401,
      'No se ha podido completar la petición. Revisa los datos e inténtalo de nuevo.',
    ],
    [
      'spacetraders_unreachable',
      503,
      'El servicio no está disponible en este momento. Inténtalo de nuevo más tarde.',
    ],
  ])('shows the Spanish message for %s (%i)', (code, status, message) => {
    const { errors } = setup()

    errors.setFromApiError(
      new ApiError({ code, message: 'Some English message.', status }),
    )

    expect(errors.generalErrors.value).toEqual([message])
  })

  it('shows client-rule errors only after submit, until the rule passes', async () => {
    const { password, errors } = setup()

    expect(errors.fieldErrors.value).toEqual({})

    errors.markSubmitted()
    expect(errors.fieldErrors.value).toEqual({
      password: ['La contraseña debe tener al menos 8 caracteres.'],
    })

    password.value = 'long enough'
    await nextTick()
    expect(errors.fieldErrors.value).toEqual({})
  })

  it('clears a field back errors when that field changes, not the others', async () => {
    const { email, password, errors } = setup()
    password.value = 'long enough'
    await nextTick()

    errors.markSubmitted()
    errors.setFromApiError(
      validationError({
        email: ['Este valor no es una dirección de email válida.'],
        password: ['La contraseña es demasiado común.'],
      }),
    )

    email.value = 'new@example.com'
    await nextTick()

    expect(errors.fieldErrors.value).toEqual({
      password: ['La contraseña es demasiado común.'],
    })
  })

  it('shows a form-specific error on one field until it changes', async () => {
    const { email, errors } = setup()

    errors.setFieldError('email', 'Ya existe una cuenta con ese email.')
    expect(errors.fieldErrors.value).toEqual({
      email: ['Ya existe una cuenta con ese email.'],
    })

    email.value = 'other@example.com'
    await nextTick()
    expect(errors.fieldErrors.value).toEqual({})
  })

  it('clears the general errors on the next submit', () => {
    const { errors } = setup()

    errors.markSubmitted()
    errors.setFromApiError(
      new ApiError({
        code: 'network_error',
        message: 'Network error.',
        status: 0,
      }),
    )
    expect(errors.generalErrors.value).toHaveLength(1)

    errors.markSubmitted()
    expect(errors.generalErrors.value).toEqual([])
  })
})
