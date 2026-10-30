import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import RegisterSuccess from '../components/auth/RegisterSuccess.vue'

function mountNotice() {
  return mount(RegisterSuccess, {
    props: { email: 'ripley@nostromo.test' },
    global: {
      plugins: [PrimeVue],
    },
    // Focus only works on elements attached to the document.
    attachTo: document.body,
  })
}

describe('RegisterSuccess', () => {
  it('muestra el email al que se ha enviado la confirmación', () => {
    const wrapper = mountNotice()

    expect(wrapper.text()).toContain('ripley@nostromo.test')

    wrapper.unmount()
  })

  it('pulsar Entendido emite close', async () => {
    const wrapper = mountNotice()

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)

    wrapper.unmount()
  })

  it('pone el foco en el aviso al montarse', () => {
    const wrapper = mountNotice()

    expect(document.activeElement).toBe(wrapper.element)

    wrapper.unmount()
  })
})
