import { describe, it, expect } from 'vitest'

import { flushPromises, mount } from '@vue/test-utils'
import App from '../App.vue'
import router from '../router'

async function mountAtRoot() {
  router.push('/')
  await router.isReady()
  const wrapper = mount(App, { global: { plugins: [router] } })
  await flushPromises()
  return wrapper
}

describe('App', () => {
  it('muestra la landing en la ruta raíz', async () => {
    const wrapper = await mountAtRoot()
    expect(wrapper.text()).toContain('Comanda tu flota')
  })

  it('el botón Empezar lleva a /login', async () => {
    const wrapper = await mountAtRoot()
    const start = wrapper.findAll('a').find((a) => a.text() === 'Empezar')
    expect(start?.attributes('href')).toBe('/login')
  })
})
