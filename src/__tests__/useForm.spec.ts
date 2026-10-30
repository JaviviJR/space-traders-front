import { afterEach, describe, expect, it, vi } from 'vitest'
import { computed, effectScope, nextTick, ref } from 'vue'
import type { EffectScope } from 'vue'
import { ApiError } from '@/api/errors/ApiError'
import { useForm } from '../composables/useForm'
import type { FormErrorHandlers } from '../composables/useForm'

// The composable's watchers outlive the test unless they run in a scope we stop.
let scope: EffectScope | undefined

afterEach(() => {
  scope?.stop()
  scope = undefined
})

function setup(errorHandlers?: FormErrorHandlers<'email' | 'password'>) {
  const email = ref('user@example.com')
  const password = ref('long enough')
  const clientErrors = computed(() =>
    password.value.length < 8
      ? { password: ['La contraseña debe tener al menos 8 caracteres.'] }
      : {},
  )
  const action = vi.fn<() => Promise<string>>()

  scope = effectScope()
  const form = scope.run(() =>
    useForm({
      fields: { email, password },
      clientErrors,
      action,
      errorHandlers,
    }),
  )
  if (form === undefined) throw new Error('The effect scope did not run.')

  return { email, password, action, form }
}

const networkError = new ApiError({
  code: 'network_error',
  message: 'Network error.',
  status: 0,
})

describe('useForm', () => {
  it('does not call the action while client rules fail', async () => {
    const { password, action, form } = setup()
    password.value = 'short'

    expect(await form.submit()).toBeNull()
    expect(action).not.toHaveBeenCalled()
  })

  it('shows client-rule errors only after submit, until the rule passes', async () => {
    const { password, form } = setup()
    password.value = 'short'
    await nextTick()

    expect(form.fieldErrors.value).toEqual({})

    await form.submit()
    expect(form.fieldErrors.value).toEqual({
      password: ['La contraseña debe tener al menos 8 caracteres.'],
    })

    password.value = 'long enough'
    await nextTick()
    expect(form.fieldErrors.value).toEqual({})
  })

  it('is loading while the action runs and returns its result', async () => {
    const { action, form } = setup()
    let resolve: (value: string) => void = () => {}
    action.mockReturnValue(
      new Promise((r) => {
        resolve = r
      }),
    )

    const result = form.submit()
    expect(form.loading.value).toBe(true)

    resolve('done')
    expect(await result).toBe('done')
    expect(form.loading.value).toBe(false)
  })

  it('runs the handler for a form-specific code instead of the generic error', async () => {
    const { action, form } = setup({
      email_already_registered: (_error, { setFieldError }) => {
        setFieldError('email', 'Ya existe una cuenta con ese email.')
      },
    })
    action.mockRejectedValue(
      new ApiError({
        code: 'email_already_registered',
        message: 'Email already registered.',
        status: 409,
      }),
    )

    expect(await form.submit()).toBeNull()
    expect(form.fieldErrors.value).toEqual({
      email: ['Ya existe una cuenta con ese email.'],
    })
    expect(form.generalErrors.value).toEqual([])
    expect(form.loading.value).toBe(false)
  })

  it('sends codes without a handler to the form errors', async () => {
    const { action, form } = setup()
    action.mockRejectedValue(networkError)

    expect(await form.submit()).toBeNull()
    expect(form.generalErrors.value).toEqual([
      'No se ha podido conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.',
    ])
    expect(form.loading.value).toBe(false)
  })

  it('rethrows anything that is not an ApiError', async () => {
    const { action, form } = setup()
    const bug = new TypeError('Something broke.')
    action.mockRejectedValue(bug)

    await expect(form.submit()).rejects.toBe(bug)
    expect(form.loading.value).toBe(false)
  })

  it('clears the general errors on the next submit', async () => {
    const { password, action, form } = setup()
    action.mockRejectedValue(networkError)

    await form.submit()
    expect(form.generalErrors.value).toHaveLength(1)

    password.value = 'short'
    await form.submit()
    expect(form.generalErrors.value).toEqual([])
  })
})
