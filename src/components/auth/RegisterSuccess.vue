<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { email } = defineProps<{
  email: string
}>()

const emit = defineEmits<{
  close: []
}>()

// It replaces the form whose submit button had focus: without this, focus drops to <body>, outside the dialog.
const notice = useTemplateRef('notice')

onMounted(() => {
  notice.value?.focus()
})
</script>

<template>
  <div
    ref="notice"
    tabindex="-1"
    class="flex flex-col items-center gap-3 py-4 text-center outline-none"
  >
    <span
      class="icon-[lucide--mail-check] size-10 text-sky-400"
      aria-hidden="true"
    />
    <p class="text-sm text-slate-400">
      Hemos enviado un enlace de confirmación a
      <strong class="font-semibold break-all text-white">{{ email }}</strong
      >. Ábrelo para activar tu cuenta.
    </p>
    <p class="text-sm text-slate-400">
      Si no lo ves, revisa la carpeta de spam.
    </p>
    <BaseButton
      variant="primary"
      class="mt-2 w-full"
      @click="emit('close')"
    >
      Entendido
    </BaseButton>
  </div>
</template>
