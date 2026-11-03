<script setup lang="ts">
/**
 * The app's modal: wraps PrimeVue's Dialog with the configuration every modal
 * shares, so a new modal only supplies its header and content.
 *
 * Default rule (a criterion, not dogma): one dialog per task or entry point;
 * the steps of a single task swap content inside their dialog. Moving from one
 * dialog to another closes the first and opens the next on its after-hide.
 * In each case, the simplest code wins.
 *
 * Any other attribute (id, closable, close-on-escape…) reaches the Dialog by
 * fallthrough, so this interface doesn't grow a prop per Dialog option.
 */
import Dialog from 'primevue/dialog'

const { visible, header } = defineProps<{
  visible: boolean
  header: string
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'after-hide': []
}>()
</script>

<template>
  <Dialog
    :header="header"
    :visible="visible"
    modal
    :draggable="false"
    block-scroll
    :style="{ width: '28rem' }"
    :breakpoints="{ '575px': '90vw' }"
    content-class="overscroll-contain"
    @update:visible="emit('update:visible', $event)"
    @after-hide="emit('after-hide')"
  >
    <slot />
  </Dialog>
</template>
