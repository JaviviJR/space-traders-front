import { describe, it, expect } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { isAuthTab, useAuthDialog } from '../composables/useAuthDialog'

describe('useAuthDialog', () => {
  it('throws when no ancestor provides the auth dialog', () => {
    const ConsumerComponent = defineComponent({
      setup() {
        useAuthDialog()
        return () => null
      },
    })

    expect(() => mount(ConsumerComponent)).toThrow(
      'useAuthDialog() necesita un componente antepasado que lo provea (PublicLayout).',
    )
  })
})

describe('isAuthTab', () => {
  it.each(['login', 'register'])('accepts %s', (value) => {
    expect(isAuthTab(value)).toBe(true)
  })

  it.each(['signup', '', 'Login', 0, 1])('rejects %s', (value) => {
    expect(isAuthTab(value)).toBe(false)
  })
})
