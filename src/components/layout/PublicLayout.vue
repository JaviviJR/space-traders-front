<script setup lang="ts">
import { provide, readonly, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AuthDialog from '@/components/auth/AuthDialog.vue'
import ConfirmEmailDialog from '@/components/auth/ConfirmEmailDialog.vue'
import { AuthDialogKey } from '@/composables/useAuthDialog'
import type { AuthTab } from '@/composables/useAuthDialog'

const authDialogVisible = ref(false)
const authDialogTab = ref<AuthTab>('login')

function openLogin() {
  authDialogTab.value = 'login'
  authDialogVisible.value = true
}

function openRegister() {
  authDialogTab.value = 'register'
  authDialogVisible.value = true
}

function close() {
  authDialogVisible.value = false
}

function selectTab(tab: AuthTab) {
  authDialogTab.value = tab
}

provide(AuthDialogKey, {
  visible: readonly(authDialogVisible),
  activeTab: readonly(authDialogTab),
  openLogin,
  openRegister,
  close,
  selectTab,
})

const route = useRoute()
// null unmounts the dialog: it confirms on mount, so it only exists while needed.
const confirmEmailSearch = ref<string | null>(null)
const confirmEmailVisible = ref(false)
let openLoginAfterConfirmEmail = false

// Leaving confirm-email (the dialog's replace to home) doesn't close it: it shows the result.
watch(
  () => route.name,
  (name) => {
    if (name === 'confirm-email') {
      // window.location, not route.query: the router re-encodes it and would break the signature.
      confirmEmailSearch.value = window.location.search
      confirmEmailVisible.value = true
    }
  },
  { immediate: true },
)

function handleConfirmEmailLogin() {
  openLoginAfterConfirmEmail = true
  confirmEmailVisible.value = false
}

function handleConfirmEmailAfterHide() {
  confirmEmailSearch.value = null
  // Only once it has finished closing: closing one of two open dialogs re-enables page scroll (PrimeVue #6925).
  if (openLoginAfterConfirmEmail) {
    openLoginAfterConfirmEmail = false
    openLogin()
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-900 text-slate-400">
    <AppHeader />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
    <AuthDialog />
    <ConfirmEmailDialog
      v-if="confirmEmailSearch !== null"
      v-model:visible="confirmEmailVisible"
      :search="confirmEmailSearch"
      @login="handleConfirmEmailLogin"
      @after-hide="handleConfirmEmailAfterHide"
    />
  </div>
</template>
