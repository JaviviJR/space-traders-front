/**
 * Turns a non-2xx response into an `ApiError` with a known shape, whatever
 * reached the browser: the back guarantees its envelope, but a proxy's HTML
 * page doesn't, so the defensive parsing lives here and nowhere else.
 *
 * The received code is checked against the generated `apiErrorCodeValues`
 * because the back can deploy a new code before the front regenerates its
 * types ("parse, don't validate").
 */
import { apiErrorCodeValues } from '@/types/backend'
import { ApiError, ApiErrorValidation } from './ApiError'
import type { ApiErrorViolations, ContractApiErrorCode } from './ApiError'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isContractCode(code: unknown): code is ContractApiErrorCode {
  return (
    typeof code === 'string' &&
    (apiErrorCodeValues as readonly string[]).includes(code)
  )
}

function isViolations(value: unknown): value is ApiErrorViolations {
  return (
    isRecord(value) &&
    Object.values(value).every(
      (messages) =>
        Array.isArray(messages) && messages.every((m) => typeof m === 'string'),
    )
  )
}

export async function toApiError(
  response: Response,
  path: string,
): Promise<ApiError> {
  const { status } = response
  const body: unknown = await response.json().catch(() => null)
  const error = isRecord(body) ? body.error : undefined

  if (isRecord(error) && typeof error.message === 'string') {
    if (isContractCode(error.code)) {
      if (error.code !== 'validation_failed') {
        return new ApiError({
          code: error.code,
          message: error.message,
          status,
        })
      }

      if (isViolations(error.violations)) {
        return new ApiErrorValidation({
          message: error.message,
          status,
          violations: error.violations,
        })
      }
    }

    console.error(
      'Unrecognized API error code: regenerate the contract types if the back added it',
      { code: error.code, path, status },
    )
    return new ApiError({
      code: 'unrecognized',
      message: error.message,
      status,
      unrecognizedCode: typeof error.code === 'string' ? error.code : undefined,
    })
  }

  console.error('API error response without the error envelope', {
    path,
    status,
  })
  return new ApiError({
    code: 'unrecognized',
    message: response.statusText,
    status,
  })
}
