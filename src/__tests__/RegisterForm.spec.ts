import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import RegisterForm from '../components/auth/RegisterForm.vue'
import { register } from '../api/auth'
import type { RegisterUserRequest, RegisterUserResponse } from '../api/auth'
import { ApiError } from '../api/errors/ApiError'

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

async function fillForm(
  wrapper: ReturnType<typeof mountForm>,
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
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

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
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.emitted('registered')).toEqual([['ripley@nostromo.test']])
  })

  it('muestra un aviso y bloquea el envío si las contraseñas no coinciden', async () => {
    const wrapper = mountForm()

    await fillForm(wrapper, { passwordConfirmation: 'otra-contraseña' })

    expect(wrapper.text()).toContain('Las contraseñas no coinciden.')
    expect(
      wrapper.find('button[type="submit"]').attributes('disabled'),
    ).toBeDefined()

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(register).not.toHaveBeenCalled()
  })

  it('muestra el error del backend cuando el email ya está registrado', async () => {
    vi.mocked(register).mockRejectedValue(
      new ApiError({
        code: 'email_already_registered',
        message: 'Email already registered',
        status: 409,
      }),
    )
    const wrapper = mountForm()

    await fillForm(wrapper)
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain(
      'Ya existe una cuenta registrada con ese email.',
    )
    expect(wrapper.emitted('registered')).toBeUndefined()
  })
})
