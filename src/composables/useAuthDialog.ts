import { inject } from 'vue'
import type { InjectionKey, Ref } from 'vue'

// Provide/inject instead of a store: PublicLayout provides it and it only exists under that layout.

export type AuthTab = 'login' | 'register'

export interface AuthDialogContext {
  visible: Readonly<Ref<boolean>>
  activeTab: Readonly<Ref<AuthTab>>
  openLogin: () => void
  openRegister: () => void
  close: () => void
  selectTab: (tab: AuthTab) => void
}

export const AuthDialogKey: InjectionKey<AuthDialogContext> =
  Symbol('AuthDialog')

export function useAuthDialog(): AuthDialogContext {
  const context = inject(AuthDialogKey, null)

  if (context === null) {
    throw new Error(
      'useAuthDialog() necesita un componente antepasado que lo provea (PublicLayout).',
    )
  }

  return context
}

export function isAuthTab(value: unknown): value is AuthTab {
  return value === 'login' || value === 'register'
}
