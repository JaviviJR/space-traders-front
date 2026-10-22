<script setup lang="ts">
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import { isAuthTab, useAuthDialog } from '@/composables/useAuthDialog'

const { visible, activeTab, close, selectTab } = useAuthDialog()

// Autofocus only with a mouse: on touch devices it pops up the keyboard over the dialog.
const hasFinePointer = window.matchMedia('(pointer: fine)').matches
const autofocusRegister = computed(() => hasFinePointer && activeTab.value === 'register')

// Tabs emits update:value as string | number (primevue/tabs/index.d.ts), wider than AuthTab.
function handleTabChange(value: string | number) {
  if (isAuthTab(value)) {
    selectTab(value)
  }
}
</script>

<template>
  <Dialog
    id="auth-dialog"
    header="Accede a SpaceTraders"
    :visible="visible"
    modal
    :draggable="false"
    block-scroll
    :style="{ width: '28rem' }"
    :breakpoints="{ '575px': '90vw' }"
    content-class="overscroll-contain"
    @update:visible="close"
  >
    <Tabs
      :value="activeTab"
      @update:value="handleTabChange"
    >
      <TabList>
        <Tab
          value="login"
          class="flex-1"
        >
          Iniciar sesión
        </Tab>
        <Tab
          value="register"
          class="flex-1"
        >
          Crear cuenta
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="login">
          <LoginForm />
        </TabPanel>
        <TabPanel value="register">
          <RegisterForm
            :autofocus="autofocusRegister"
            @switch-to-login="selectTab('login')"
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Dialog>
</template>
