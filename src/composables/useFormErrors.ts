/**
 * A form's error state, the part every form that calls the API shares:
 * distributing a 422's `violations` per field (`_global` and keys the form
 * doesn't recognise go to the general errors), a Spanish message for codes
 * without a form-specific meaning, merging the form's client-rule errors in,
 * and when each kind of error shows and clears ("reward early, punish late").
 *
 * It deliberately leaves out `loading`, the submit `try/finally` and the
 * form-specific codes (e.g. 409 `email_already_registered`): each form's
 * composable handles those first, because each one does something different,
 * and delegates the rest here. Used by one form for now: when a second one
 * uses it, propose moving this mechanism into `doc/architecture.md`.
 */
import { computed, readonly, shallowRef, toValue, watch } from 'vue'
import type { ComputedRef, MaybeRefOrGetter, Ref, WatchSource } from 'vue'
import { ApiError, ApiErrorValidation } from '@/api/errors/ApiError'
import type { ApiErrorCode } from '@/api/errors/ApiError'

export type FieldErrors<Field extends string> = Partial<
  Record<Field, readonly string[]>
>

export interface UseFormErrorsOptions<Field extends string> {
  /** The fields the form recognises, each with the value whose change clears its back errors. */
  fields: Record<Field, WatchSource<unknown>>
  /** Errors from the form's own rules, derived from the values (a `computed`). */
  clientErrors?: MaybeRefOrGetter<FieldErrors<Field>>
}

export interface FormErrors<Field extends string> {
  fieldErrors: ComputedRef<FieldErrors<Field>>
  generalErrors: Readonly<Ref<readonly string[]>>
  markSubmitted: () => void
  setFromApiError: (error: ApiError) => void
  setFieldError: (field: Field, message: string) => void
  clear: () => void
}

// `error.message` is always English, so codes with no meaning specific to a
// form get these texts instead.
const genericMessages: Partial<Record<ApiErrorCode, string>> = {
  network_error:
    'No se ha podido conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.',
  internal_error:
    'Se ha producido un error en el servidor. Inténtalo de nuevo más tarde.',
  http_error: 'No se ha podido completar la petición. Inténtalo de nuevo.',
  unrecognized: 'Se ha producido un error inesperado. Inténtalo de nuevo.',
}

const clientErrorFallback =
  'No se ha podido completar la petición. Revisa los datos e inténtalo de nuevo.'
const serverErrorFallback =
  'El servicio no está disponible en este momento. Inténtalo de nuevo más tarde.'

function genericMessage(error: ApiError): string {
  return (
    genericMessages[error.code] ??
    (error.status >= 500 ? serverErrorFallback : clientErrorFallback)
  )
}

export function useFormErrors<Field extends string>({
  fields,
  clientErrors,
}: UseFormErrorsOptions<Field>): FormErrors<Field> {
  const submitted = shallowRef(false)
  // Replaced as a whole on every change instead of mutated, so a shallowRef is enough.
  const backFieldErrors = shallowRef<FieldErrors<Field>>({})
  const generalErrors = shallowRef<readonly string[]>([])

  function isField(key: string): key is Field {
    return Object.hasOwn(fields, key)
  }

  const fieldNames = Object.keys(fields).filter(isField)

  const fieldErrors = computed(() => {
    const client: FieldErrors<Field> = submitted.value
      ? (toValue(clientErrors) ?? {})
      : {}
    const merged: FieldErrors<Field> = {}

    for (const field of fieldNames) {
      const messages = [
        ...(client[field] ?? []),
        ...(backFieldErrors.value[field] ?? []),
      ]
      if (messages.length > 0) merged[field] = messages
    }

    return merged
  })

  // The front can't re-check a back rule, so its message goes once the value
  // that caused it changes.
  for (const field of fieldNames) {
    watch(fields[field], () => {
      if (backFieldErrors.value[field] === undefined) return
      const next = { ...backFieldErrors.value }
      delete next[field]
      backFieldErrors.value = next
    })
  }

  function markSubmitted(): void {
    submitted.value = true
    generalErrors.value = []
  }

  function setFromApiError(error: ApiError): void {
    if (!(error instanceof ApiErrorValidation)) {
      backFieldErrors.value = {}
      generalErrors.value = [genericMessage(error)]
      return
    }

    const nextFieldErrors: FieldErrors<Field> = {}
    const nextGeneralErrors: string[] = []

    // `_global` is never a field name, so it lands here with unknown keys.
    for (const [key, messages] of Object.entries(error.violations)) {
      if (isField(key)) {
        nextFieldErrors[key] = messages
      } else {
        nextGeneralErrors.push(...messages)
      }
    }

    backFieldErrors.value = nextFieldErrors
    generalErrors.value = nextGeneralErrors
  }

  function setFieldError(field: Field, message: string): void {
    const next = { ...backFieldErrors.value }
    next[field] = [message]
    backFieldErrors.value = next
  }

  function clear(): void {
    submitted.value = false
    backFieldErrors.value = {}
    generalErrors.value = []
  }

  return {
    fieldErrors,
    generalErrors: readonly(generalErrors),
    markSubmitted,
    setFromApiError,
    setFieldError,
    clear,
  }
}
