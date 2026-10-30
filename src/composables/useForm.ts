/**
 * A form's lifecycle, the part every form that calls the API shares: whether
 * it has been submitted, `loading`, the steps of a submit and when each kind
 * of error shows ("reward early, punish late": client-rule errors only after
 * the first submit, general errors cleared on every submit). What is wrong is
 * `useFormErrors`' job; this decides when it shows.
 *
 * Each form passes the parts that change: the `action` that calls the API and
 * a map of its own error codes (e.g. 409 `email_already_registered`). A map by
 * `code` rather than an `onError` callback, so a form can't branch on `status`
 * or `message`. Used by one form for now: when a second one uses it, propose
 * moving this mechanism into `doc/architecture.md`.
 */
import { readonly, shallowRef, toValue } from 'vue'
import type { MaybeRefOrGetter, WatchSource } from 'vue'
import { ApiError } from '@/api/errors/ApiError'
import type { ApiErrorCode } from '@/api/errors/ApiError'
import { useFormErrors } from '@/composables/useFormErrors'
import type { FieldErrors } from '@/composables/useFormErrors'

// Part of this composable's API (`clientErrors`), so forms don't import useFormErrors.
export type { FieldErrors }

export interface FormErrorHelpers<Field extends string> {
  setFieldError: (field: Field, message: string) => void
}

export type FormErrorHandlers<Field extends string> = Partial<
  Record<
    ApiErrorCode,
    (error: ApiError, helpers: FormErrorHelpers<Field>) => void
  >
>

export interface UseFormOptions<Field extends string, Result> {
  /** The fields the form recognises, each with the value whose change clears its back errors. */
  fields: Record<Field, WatchSource<unknown>>
  /** Errors from the form's own rules, derived from the values (a `computed`). */
  clientErrors?: MaybeRefOrGetter<FieldErrors<Field>>
  /** The API call; only runs when the client rules pass. */
  action: () => Promise<Result>
  /** The codes this form gives its own meaning to; the rest go to `useFormErrors`. */
  errorHandlers?: FormErrorHandlers<Field>
}

export function useForm<Field extends string, Result>({
  fields,
  clientErrors,
  action,
  errorHandlers = {},
}: UseFormOptions<Field, Result>) {
  const submitted = shallowRef(false)
  const loading = shallowRef(false)

  const {
    fieldErrors,
    generalErrors,
    setFromApiError,
    setFieldError,
    clearGeneralErrors,
  } = useFormErrors<Field>({
    fields,
    clientErrors: () => (submitted.value ? (toValue(clientErrors) ?? {}) : {}),
  })

  function hasClientErrors(): boolean {
    const errors: FieldErrors<Field> = toValue(clientErrors) ?? {}
    return Object.values<readonly string[] | undefined>(errors).some(
      (messages) => messages !== undefined && messages.length > 0,
    )
  }

  async function submit(): Promise<Result | null> {
    submitted.value = true
    clearGeneralErrors()

    if (hasClientErrors()) return null

    loading.value = true

    try {
      return await action()
    } catch (err) {
      // client.ts turns every API failure into an ApiError; anything else is a bug.
      if (!(err instanceof ApiError)) throw err

      const handler = errorHandlers[err.code]
      if (handler) {
        handler(err, { setFieldError })
      } else {
        setFromApiError(err)
      }

      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    fieldErrors,
    generalErrors,
    submit,
  }
}
