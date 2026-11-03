import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import Dialog from 'primevue/dialog'
import BaseDialog from '../components/ui/BaseDialog.vue'

function mountDialog() {
  // The Dialog teleports to body; stubbing Teleport keeps its content inside the wrapper.
  return mount(BaseDialog, {
    props: { visible: true, header: 'Título de prueba' },
    attrs: { id: 'test-dialog' },
    slots: { default: '<p>Contenido de prueba</p>' },
    global: {
      plugins: [PrimeVue],
      stubs: { teleport: true },
    },
  })
}

describe('BaseDialog', () => {
  it('muestra la cabecera y el contenido del slot', async () => {
    const wrapper = mountDialog()
    await flushPromises()

    expect(wrapper.find('.p-dialog-title').text()).toBe('Título de prueba')
    expect(wrapper.text()).toContain('Contenido de prueba')
  })

  it('pulsar cerrar emite update:visible con false', async () => {
    const wrapper = mountDialog()
    await flushPromises()

    await wrapper.find('.p-dialog-close-button').trigger('click')

    expect(wrapper.emitted('update:visible')).toEqual([[false]])
  })

  it('emite after-hide cuando el diálogo termina de cerrarse', async () => {
    const wrapper = mountDialog()
    await flushPromises()

    wrapper.findComponent(Dialog).vm.$emit('after-hide')

    expect(wrapper.emitted('after-hide')).toHaveLength(1)
  })

  it('pasa el id al diálogo', async () => {
    const wrapper = mountDialog()
    await flushPromises()

    expect(wrapper.find('#test-dialog').classes()).toContain('p-dialog')
  })
})
