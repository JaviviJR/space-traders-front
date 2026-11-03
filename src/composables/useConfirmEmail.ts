/**
 * The confirm-email dialog's state and request: it confirms as soon as it's
 * called, with the link's query string as received.
 *
 * After a definitive answer it replaces the route with home instead of
 * pushing: the signed URL leaves the history, so reloading or going back
 * doesn't send it again (the contract doesn't say what a second call
 * returns). After a network or server error it won't, so retrying and
 * reloading keep the link.
 */
import { readonly, ref } from 'vue'
import { useRouter } from 'vue-router'
import { confirmEmail } from '@/api/auth'
import { ApiError } from '@/api/errors/ApiError'

export type ConfirmEmailStatus = 'pending' | 'confirmed' | 'invalid' | 'failed'

export function useConfirmEmail(search: string) {
  const router = useRouter()
  const status = ref<ConfirmEmailStatus>('pending')

  // Not `status === 'pending'`: the dialog already shows pending before the first attempt starts.
  let attemptInFlight = false

  async function attempt() {
    if (attemptInFlight) return
    attemptInFlight = true
    status.value = 'pending'

    try {
      await confirmEmail(search)
      status.value = 'confirmed'
      await router.replace({ name: 'home' })
    } catch (err) {
      if (!(err instanceof ApiError)) throw err
      if (err.code !== 'invalid_email_confirmation') {
        status.value = 'failed'
        return
      }

      status.value = 'invalid'
      await router.replace({ name: 'home' })
    } finally {
      attemptInFlight = false
    }
  }

  void attempt()

  // Retrying is the same attempt, so it shares the in-flight guard.
  return { status: readonly(status), retry: attempt }
}
