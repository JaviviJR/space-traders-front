import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import RegisterForm from '../components/auth/RegisterForm.vue'
import { register } from '../api/auth'
import type { RegisterUserRequest, RegisterUserResponse } from '../api/auth'
import { ApiError, ApiErrorValidation } from '../api/errors/ApiError'

vi.mock('../api/auth', () => ({
  register:
    vi.fn<(payload: RegisterUserRequest) => Promise<RegisterUserResponse>>(),
}))

function mountForm() {
  return mount(RegisterForm, {
    global: {
      plugins: [PrimeVue],
    },
  })
}

type Wrapper = ReturnType<typeof mountForm>

async function fillForm(
  wrapper: Wrapper,
  overrides: Partial<{
    name: string
    email: string
    password: string
    passwordConfirmation: string
    accountToken: string
  }> = {},
) {
  const values = {
    name: 'Ellen Ripley',
    email: 'ripley@nostromo.test',
    password: 'secret123',
    passwordConfirmation: 'secret123',
    accountToken: 'token-abc',
    ...overrides,
  }

  await wrapper.find('#name').setValue(values.name)
  await wrapper.find('#email').setValue(values.email)
  await wrapper.find('#password').setValue(values.password)
  await wrapper
    .find('#password-confirmation')
    .setValue(values.passwordConfirmation)
  await wrapper.find('#account-token').setValue(values.accountToken)
}

async function submitForm(wrapper: Wrapper) {
  await wrapper.find('form').trigger('submit.prevent')
  await flushPromises()
}

// The text of the messages linked to an input through aria-describedby.
function describedText(wrapper: Wrapper, inputSelector: string): string {
  const describedBy = wrapper.find(inputSelector).attributes('aria-describedby')
  if (describedBy === undefined) return ''
  return wrapper.find(`#${describedBy}`).text()
}

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.mocked(register).mockReset()
  })

  it('envía el payload correcto a register al confirmar el formulario', async () => {
    vi.mocked(register).mockResolvedValue({
      id: 1,
      name: 'Ellen Ripley',
      email: 'ripley@nostromo.test',
    })
    const wrapper = mountForm()

    await fillForm(wrapper)
    await submitForm(wrapper)

    expect(register).toHaveBeenCalledWith({
      name: 'Ellen Ripley',
      email: 'ripley@nostromo.test',
      password: 'secret123',
      accountToken: 'token-abc',
    })
  })

  it('emite registered con el email que devuelve el back cuando el registro va bien', async () => {
    vi.mocked(register).mockResolvedValue({
      id: 1,
      name: 'Ellen Ripley',
      email: 'ripley@nostromo.test',
    })
    const wrapper = mountForm()

    await fillForm(wrapper, { email: 'Ripley@Nostromo.test' })
    await submitForm(wrapper)

    expect(wrapper.emitted('registered')).toEqual([['ripley@nostromo.test']])
  })

  it('al enviar con contraseñas distintas muestra el aviso, no llama a register y deja el botón habilitado', async () => {
    const wrapper = mountForm()

    await fillForm(wrapper, { passwordConfirmation: 'otra-contraseña' })
    await submitForm(wrapper)

    expect(describedText(wrapper, '#password-confirmation')).toBe(
      'Las contraseñas no coinciden.',
    )
    expect(register).not.toHaveBeenCalled()
    expect(
      wrapper.find('button[type="submit"]').attributes('disabled'),
    ).toBeUndefined()
  })

  it('no muestra errores antes del primer envío', async () => {
    const wrapper = mountForm()

    await fillForm(wrapper, {
      email: 'no-es-un-email',
      password: 'corta',
      passwordConfirmation: 'otra',
    })

    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.find('#email').attributes('aria-invalid')).toBeUndefined()
  })

  it('marca como obligatorios los campos vacíos y no llama a register', async () => {
    const wrapper = mountForm()

    await submitForm(wrapper)

    for (const selector of [
      '#name',
      '#email',
      '#password',
      '#password-confirmation',
      '#account-token',
    ]) {
      expect(describedText(wrapper, selector)).toBe(
        'Este campo es obligatorio.',
      )
      expect(wrapper.find(selector).attributes('aria-invalid')).toBe('true')
    }
    expect(register).not.toHaveBeenCalled()
  })

  it('rechaza un email con formato inválido sin llamar a register', async () => {
    const wrapper = mountForm()

    await fillForm(wrapper, { email: 'ripley-at-nostromo' })
    await submitForm(wrapper)

    expect(describedText(wrapper, '#email')).toBe('Introduce un email válido.')
    expect(register).not.toHaveBeenCalled()
  })

  it('rechaza una contraseña de menos de 8 caracteres sin llamar a register', async () => {
    const wrapper = mountForm()

    await fillForm(wrapper, {
      password: 'secret1',
      passwordConfirmation: 'secret1',
    })
    await submitForm(wrapper)

    expect(describedText(wrapper, '#password')).toBe(
      'La contraseña debe tener al menos 8 caracteres.',
    )
    expect(register).not.toHaveBeenCalled()
  })

  it('quita el error de cliente en cuanto se corrige el campo', async () => {
    const wrapper = mountForm()

    await fillForm(wrapper, { email: 'ripley-at-nostromo' })
    await submitForm(wrapper)
    await wrapper.find('#email').setValue('ripley@nostromo.test')

    expect(describedText(wrapper, '#email')).toBe('')
    expect(wrapper.find('#email').attributes('aria-invalid')).toBeUndefined()
  })

  it('muestra cada mensaje de un 422 bajo su campo y _global arriba del formulario', async () => {
    vi.mocked(register).mockRejectedValue(
      new ApiErrorValidation({
        message: 'Validation failed.',
        status: 422,
        violations: {
          _global: ['El registro está cerrado temporalmente.'],
          email: ['Este valor no es una dirección de email válida.'],
          accountToken: ['Este valor no debería estar vacío.'],
        },
      }),
    )
    const wrapper = mountForm()

    await fillForm(wrapper)
    await submitForm(wrapper)

    expect(describedText(wrapper, '#email')).toBe(
      'Este valor no es una dirección de email válida.',
    )
    expect(describedText(wrapper, '#account-token')).toBe(
      'Este valor no debería estar vacío.',
    )
    expect(wrapper.find('#email').attributes('aria-invalid')).toBe('true')
    expect(describedText(wrapper, '#name')).toBe('')
    expect(wrapper.find('form > :first-child').text()).toBe(
      'El registro está cerrado temporalmente.',
    )
  })

  it('quita el error del back de un campo al editar ese campo, no los demás', async () => {
    vi.mocked(register).mockRejectedValue(
      new ApiErrorValidation({
        message: 'Validation failed.',
        status: 422,
        violations: {
          email: ['Este valor no es una dirección de email válida.'],
          accountToken: ['Este valor no debería estar vacío.'],
        },
      }),
    )
    const wrapper = mountForm()

    await fillForm(wrapper)
    await submitForm(wrapper)
    await wrapper.find('#email').setValue('ellen@nostromo.test')

    expect(describedText(wrapper, '#email')).toBe('')
    expect(describedText(wrapper, '#account-token')).toBe(
      'Este valor no debería estar vacío.',
    )
  })

  it('muestra el mensaje genérico cuando el back falla con un 500', async () => {
    vi.mocked(register).mockRejectedValue(
      new ApiError({
        code: 'internal_error',
        message: 'An unexpected error occurred.',
        status: 500,
      }),
    )
    const wrapper = mountForm()

    await fillForm(wrapper)
    await submitForm(wrapper)

    expect(wrapper.text()).toContain(
      'Se ha producido un error en el servidor. Inténtalo de nuevo más tarde.',
    )
    expect(
      wrapper.find('button[type="submit"]').attributes('disabled'),
    ).toBeUndefined()
  })

  it('muestra el mensaje de conexión cuando no hay respuesta del servidor', async () => {
    vi.mocked(register).mockRejectedValue(
      new ApiError({
        code: 'network_error',
        message: 'Network request failed',
        status: 0,
      }),
    )
    const wrapper = mountForm()

    await fillForm(wrapper)
    await submitForm(wrapper)

    expect(wrapper.text()).toContain(
      'No se ha podido conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.',
    )
  })

  it('con un 409 marca el email', async () => {
    vi.mocked(register).mockRejectedValue(
      new ApiError({
        code: 'email_already_registered',
        message: 'This email is already registered.',
        status: 409,
      }),
    )
    const wrapper = mountForm()

    await fillForm(wrapper)
    await submitForm(wrapper)

    expect(describedText(wrapper, '#email')).toBe(
      'Ya existe una cuenta registrada con ese email.',
    )
    expect(wrapper.emitted('registered')).toBeUndefined()
  })

  it('el error del 409 desaparece al cambiar el email', async () => {
    vi.mocked(register).mockRejectedValue(
      new ApiError({
        code: 'email_already_registered',
        message: 'This email is already registered.',
        status: 409,
      }),
    )
    const wrapper = mountForm()

    await fillForm(wrapper)
    await submitForm(wrapper)
    await wrapper.find('#email').setValue('ellen@nostromo.test')

    expect(describedText(wrapper, '#email')).toBe('')
  })
})
