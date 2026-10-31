<script setup lang="ts">
/**
 * The dialog the email's confirmation link opens: it confirms on mount and
 * shows the result.
 *
 * Its own dialog, not a screen of AuthDialog: it's another task with another
 * entry point (the email), and AuthDialog would take on state and screens
 * that aren't its own. It doesn't know AuthDialog either: it only emits
 * `login`, and the layout, which knows both, opens the next one.
 */
import { computed } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseDialog from '@/components/ui/BaseDialog.vue'
import { useConfirmEmail } from '@/composables/useConfirmEmail'

const { visible, search } = defineProps<{
  visible: boolean
  search: string
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'after-hide': []
  login: []
}>()

const { status, retry } = useConfirmEmail(search)

// Not closable while confirming, so the person always sees the result.
const isPending = computed(() => status.value === 'pending')

// Escape is blocked here, not by binding close-on-escape: the Dialog only reads it when it opens, in pending.
function handleUpdateVisible(value: boolean) {
  if (isPending.value) return
  emit('update:visible', value)
}
</script>

<template>
  <BaseDialog
    header="Confirmar email"
    :visible="visible"
    :closable="!isPending"
    @update:visible="handleUpdateVisible"
    @after-hide="emit('after-hide')"
  >
    <div class="flex flex-col items-center gap-3 py-4 text-center">
      <template v-if="status === 'pending'">
        <span
          class="icon-[lucide--loader-circle] size-10 text-primary motion-safe:animate-spin"
          aria-hidden="true"
        />
        <p class="text-sm text-slate-400">Confirmando…</p>
      </template>
      <template v-else-if="status === 'confirmed'">
        <span
          class="icon-[lucide--circle-check] size-10 text-primary"
          aria-hidden="true"
        />
        <p class="text-sm text-slate-400">Cuenta confirmada</p>
        <BaseButton
          variant="primary"
          class="mt-2 w-full"
          @click="emit('login')"
        >
          Iniciar sesión
        </BaseButton>
      </template>
      <template v-else-if="status === 'invalid'">
        <span
          class="icon-[lucide--circle-alert] size-10 text-red-400"
          aria-hidden="true"
        />
        <p class="text-sm text-slate-400">
          El enlace no es válido o ha caducado. Si ya confirmaste tu cuenta,
          inicia sesión; si no, podrás pedir un enlace nuevo.
        </p>
        <BaseButton
          variant="primary"
          class="mt-2 w-full"
          @click="emit('login')"
        >
          Iniciar sesión
        </BaseButton>
      </template>
      <template v-else-if="status === 'failed'">
        <span
          class="icon-[lucide--circle-alert] size-10 text-red-400"
          aria-hidden="true"
        />
        <p class="text-sm text-slate-400">
          No hemos podido confirmar tu cuenta. Comprueba tu conexión e inténtalo
          de nuevo.
        </p>
        <BaseButton
          variant="primary"
          class="mt-2 w-full"
          @click="retry()"
        >
          Reintentar
        </BaseButton>
      </template>
    </div>
  </BaseDialog>
</template>
