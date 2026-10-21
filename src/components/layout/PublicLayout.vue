<script setup lang="ts">
import { provide, readonly, ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AuthDialog from '@/components/auth/AuthDialog.vue'
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
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-900 text-slate-400">
    <AppHeader />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
    <AuthDialog />
  </div>
</template>
