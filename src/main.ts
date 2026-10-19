import '@fontsource-variable/inter'
import '@fontsource-variable/lexend'
import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

import App from './App.vue'
import router from './router'

// darkModeSelector: 'none' below makes PrimeVue drop colorScheme.dark entirely
// (verified in @primeuix/styled's transformCSS: the dark branch never emits
// CSS when darkModeSelector is 'none'/false) and always apply colorScheme.light
// unconditionally — so the app's permanently-dark palette is defined here,
// under `light`, not `dark`.
const SpaceTradersPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{sky.300}',
          contrastColor: '{slate.900}',
          hoverColor: '{sky.200}',
          activeColor: '{sky.500}',
        },
        surface: {
          0: '#ffffff',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}',
        },
      },
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: SpaceTradersPreset,
    options: {
      darkModeSelector: 'none',
    },
  },
})

app.mount('#app')
