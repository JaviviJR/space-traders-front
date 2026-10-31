import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import Dialog from 'primevue/dialog'
import { createMemoryHistory, createRouter } from 'vue-router'
import ConfirmEmailDialog from '../components/auth/ConfirmEmailDialog.vue'
import { confirmEmail } from '../api/auth'
import type { ConfirmEmailResponse } from '../api/auth'
import { ApiError } from '../api/errors/ApiError'

vi.mock('@/api/auth')

// A signed query with characters that re-encoding would change.
const search = '?id=1&expires=1700000000&token=a%2Fb+c&signature=d4e5'

// The test resolves it by hand, to see the pending state before the answer.
function deferConfirmEmail() {
  let resolve: (value: ConfirmEmailResponse) => void = () => {}
  vi.mocked(confirmEmail).mockReturnValue(
    new Promise((promiseResolve) => {
      resolve = promiseResolve
    }),
  )
  return { resolve: () => resolve({ confirmed: true }) }
}

const backMessage = 'The email confirmation link is invalid or has expired.'

// The contract's 400: the real class, so the composable's instanceof check sees it.
function rejectAsInvalidLink() {
  vi.mocked(confirmEmail).mockRejectedValue(
    new ApiError({
      code: 'invalid_email_confirmation',
      message: backMessage,
      status: 400,
    }),
  )
}

function mountDialog() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', name: 'home', component: { render: () => null } }],
  })
  const replace = vi.spyOn(router, 'replace')

  // The Dialog teleports to body; stubbing Teleport keeps its content inside the wrapper.
  const wrapper = mount(ConfirmEmailDialog, {
    props: { visible: true, search },
    global: { plugins: [PrimeVue, router], stubs: { teleport: true } },
  })

  return { wrapper, replace }
}

// What the Dialog emits on Escape or its close button; the real key press is covered in e2e.
function requestClose(wrapper: ReturnType<typeof mountDialog>['wrapper']) {
  wrapper.findComponent(Dialog).vm.$emit('update:visible', false)
}

describe('ConfirmEmailDialog', () => {
  beforeEach(() => {
    vi.mocked(confirmEmail).mockReset()
  })

  it('llama a confirmEmail una vez, con el query tal cual', async () => {
    deferConfirmEmail()
    mountDialog()
    await flushPromises()

    expect(confirmEmail).toHaveBeenCalledTimes(1)
    expect(confirmEmail).toHaveBeenCalledWith(search)
  })

  it('muestra Confirmando… y, cuando el back responde, Cuenta confirmada', async () => {
    const request = deferConfirmEmail()
    const { wrapper } = mountDialog()
    await flushPromises()

    expect(wrapper.find('.p-dialog-title').text()).toBe('Confirmar email')
    expect(wrapper.text()).toContain('Confirmando…')

    request.resolve()
    await flushPromises()

    expect(wrapper.text()).not.toContain('Confirmando…')
    expect(wrapper.text()).toContain('Cuenta confirmada')
  })

  it('no se puede cerrar mientras confirma, y sí cuando termina', async () => {
    const request = deferConfirmEmail()
    const { wrapper } = mountDialog()
    await flushPromises()

    expect(wrapper.find('.p-dialog-close-button').exists()).toBe(false)
    requestClose(wrapper)
    expect(wrapper.emitted('update:visible')).toBeUndefined()

    request.resolve()
    await flushPromises()

    expect(wrapper.find('.p-dialog-close-button').exists()).toBe(true)
    requestClose(wrapper)
    expect(wrapper.emitted('update:visible')).toEqual([[false]])
  })

  it('sustituye la ruta por la home cuando la cuenta queda confirmada', async () => {
    const request = deferConfirmEmail()
    const { replace } = mountDialog()
    await flushPromises()

    expect(replace).not.toHaveBeenCalled()

    request.resolve()
    await flushPromises()

    expect(replace).toHaveBeenCalledWith({ name: 'home' })
  })

  it('pulsar Iniciar sesión emite login', async () => {
    vi.mocked(confirmEmail).mockResolvedValue({ confirmed: true })
    const { wrapper } = mountDialog()
    await flushPromises()

    const button = wrapper
      .findAll('button')
      .find((candidate) => candidate.text() === 'Iniciar sesión')
    await button?.trigger('click')

    expect(wrapper.emitted('login')).toHaveLength(1)
  })

  describe('con un enlace no válido', () => {
    it('muestra el texto de enlace no válido, no el mensaje del back', async () => {
      rejectAsInvalidLink()
      const { wrapper } = mountDialog()
      await flushPromises()

      expect(wrapper.text()).toContain(
        'El enlace no es válido o ha caducado. Si ya confirmaste tu cuenta, inicia sesión; si no, podrás pedir un enlace nuevo.',
      )
      expect(wrapper.text()).not.toContain('Confirmando…')
      expect(wrapper.text()).not.toContain(backMessage)
    })

    it('sustituye la ruta por la home', async () => {
      rejectAsInvalidLink()
      const { replace } = mountDialog()
      await flushPromises()

      expect(replace).toHaveBeenCalledWith({ name: 'home' })
    })

    it('pulsar Iniciar sesión emite login', async () => {
      rejectAsInvalidLink()
      const { wrapper } = mountDialog()
      await flushPromises()

      const button = wrapper
        .findAll('button')
        .find((candidate) => candidate.text() === 'Iniciar sesión')
      await button?.trigger('click')

      expect(wrapper.emitted('login')).toHaveLength(1)
    })
  })
})
