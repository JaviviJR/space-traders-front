import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import Dialog from 'primevue/dialog'
import AuthDialog from '../components/auth/AuthDialog.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'
import { AuthDialogKey } from '../composables/useAuthDialog'
import type { AuthDialogContext, AuthTab } from '../composables/useAuthDialog'

// jsdom has no ResizeObserver, and PrimeVue's TabList observes its size on mount.
vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
)

// jsdom has no matchMedia; AuthDialog reads '(pointer: fine)' to decide on autofocus.
function stubPointer(fine: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: fine,
    media: query,
  }))
}

function mountDialog(initialTab: AuthTab, { finePointer = true } = {}) {
  stubPointer(finePointer)
  const context: AuthDialogContext = {
    visible: ref(true),
    activeTab: ref<AuthTab>(initialTab),
    openLogin: vi.fn<() => void>(),
    openRegister: vi.fn<() => void>(),
    close: vi.fn<() => void>(),
    selectTab: vi.fn<(tab: AuthTab) => void>(),
  }

  // The Dialog teleports to body; stubbing Teleport keeps its content inside the wrapper.
  const wrapper = mount(AuthDialog, {
    global: {
      plugins: [PrimeVue],
      provide: { [AuthDialogKey]: context },
      stubs: { teleport: true },
    },
  })

  return { wrapper, context }
}

function findTab(
  wrapper: ReturnType<typeof mountDialog>['wrapper'],
  label: string,
) {
  return wrapper.findAll('[role="tab"]').find((tab) => tab.text() === label)
}

describe('AuthDialog', () => {
  it('muestra el formulario de registro cuando la pestaña activa es register', async () => {
    const { wrapper } = mountDialog('register')
    await flushPromises()

    expect(findTab(wrapper, 'Crear cuenta')?.attributes('aria-selected')).toBe(
      'true',
    )
    expect(wrapper.find('form').isVisible()).toBe(true)
    expect(wrapper.find('#name').exists()).toBe(true)
  })

  it('pulsar la pestaña de login llama a selectTab con login', async () => {
    const { wrapper, context } = mountDialog('register')
    await flushPromises()

    await findTab(wrapper, 'Iniciar sesión')?.trigger('click')

    expect(context.selectTab).toHaveBeenCalledWith('login')
  })

  it('cerrar el diálogo llama a close', async () => {
    const { wrapper, context } = mountDialog('login')
    await flushPromises()

    await wrapper.find('.p-dialog-close-button').trigger('click')

    expect(context.close).toHaveBeenCalled()
  })

  it('el enlace Inicia sesión del registro llama a selectTab con login', async () => {
    const { wrapper, context } = mountDialog('register')
    await flushPromises()

    const link = wrapper
      .findAll('form button')
      .find((button) => button.text() === 'Inicia sesión')
    await link?.trigger('click')

    expect(context.selectTab).toHaveBeenCalledWith('login')
  })

  it('cambia el formulario por el aviso de revisar el correo tras registrarse', async () => {
    const { wrapper } = mountDialog('register')
    await flushPromises()

    wrapper
      .findComponent(RegisterForm)
      .vm.$emit('registered', 'ripley@nostromo.test')
    await flushPromises()

    expect(wrapper.find('form').exists()).toBe(false)
    expect(wrapper.text()).toContain('Revisa tu correo')
    expect(wrapper.text()).toContain('ripley@nostromo.test')
  })

  it('vuelve a mostrar el formulario vacío cuando el diálogo termina de cerrarse', async () => {
    const { wrapper } = mountDialog('register')
    await flushPromises()

    wrapper
      .findComponent(RegisterForm)
      .vm.$emit('registered', 'ripley@nostromo.test')
    await flushPromises()
    wrapper.findComponent(Dialog).vm.$emit('after-hide')
    await flushPromises()

    expect(wrapper.text()).not.toContain('Revisa tu correo')
    expect(wrapper.find<HTMLInputElement>('#name').element.value).toBe('')
  })

  it('pone autofocus en Nombre con ratón, pero no en pantallas táctiles', async () => {
    const withMouse = mountDialog('register', { finePointer: true })
    await flushPromises()
    expect(
      withMouse.wrapper.find('#name').attributes('autofocus'),
    ).toBeDefined()

    const withTouch = mountDialog('register', { finePointer: false })
    await flushPromises()
    expect(
      withTouch.wrapper.find('#name').attributes('autofocus'),
    ).toBeUndefined()
  })
})
