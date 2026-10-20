import { describe, it, expect, vi } from 'vitest'

import { flushPromises, mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import App from '../App.vue'
import router from '../router'

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
vi.stubGlobal('matchMedia', (query: string) => ({ matches: false, media: query }))

async function mountAtRoot() {
  router.push('/')
  await router.isReady()
  // The auth Dialog teleports to body; stubbing Teleport keeps its content inside the wrapper.
  const wrapper = mount(App, {
    global: { plugins: [router, PrimeVue], stubs: { teleport: true } },
  })
  await flushPromises()
  return wrapper
}

function findButton(wrapper: Awaited<ReturnType<typeof mountAtRoot>>, label: string) {
  return wrapper.findAll('button:not([role="tab"])').find((button) => button.text() === label)
}

function selectedTabLabel(wrapper: Awaited<ReturnType<typeof mountAtRoot>>) {
  return wrapper.find('[role="tab"][aria-selected="true"]').text()
}

describe('App', () => {
  it('muestra la landing en la ruta raíz', async () => {
    const wrapper = await mountAtRoot()
    expect(wrapper.text()).toContain('Comanda tu flota')
  })

  it('el botón Empezar abre el diálogo en la pestaña de registro', async () => {
    const wrapper = await mountAtRoot()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)

    await findButton(wrapper, 'Empezar')?.trigger('click')
    await flushPromises()

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    expect(selectedTabLabel(wrapper)).toBe('Crear cuenta')
  })

  it('el botón Iniciar sesión abre el diálogo en la pestaña de login', async () => {
    const wrapper = await mountAtRoot()

    await findButton(wrapper, 'Iniciar sesión')?.trigger('click')
    await flushPromises()

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    expect(selectedTabLabel(wrapper)).toBe('Iniciar sesión')
  })
})
