/**
 * The only place that calls `fetch`. Every API function either returns the
 * unwrapped `data` or throws `ApiError`, whatever reaches the browser: the
 * back guarantees its envelope, but a proxy's HTML page or a network failure
 * don't, so the defensive parsing lives here and nowhere else.
 *
 * The back's `code` is an open enum at runtime (it can deploy a new code
 * before the front regenerates its types), so the received code is checked
 * against the generated `apiErrorCodeValues` before the rest of the app sees
 * it as the closed `ApiErrorCode` type.
 */
import { apiErrorCodeValues, type components } from '@/types/backend'

// Aliased because the classes below share the contract schemas' names.
type ContractApiError = components['schemas']['ApiError']
type ContractApiErrorValidation = components['schemas']['ApiErrorValidation']
type ContractApiErrorCode = ContractApiError['code']

// Front-only codes: the back never sends them. `unrecognized` covers an error
// response the contract doesn't describe (unknown code, non-JSON body) and
// `network_error` a request that got no response, so callers still catch a
// single error type. They live here, not in `src/types/`, which is regenerated.
type FrontOnlyApiErrorCode = 'unrecognized' | 'network_error'

// Fails `npm run type-check` if the back adds a code with a front-only name:
// it would have its own meaning there, so the front-only one must be renamed.
type AssertNoOverlap<T extends never> = T

export type ApiErrorCode =
  | ContractApiErrorCode
  | FrontOnlyApiErrorCode
  | AssertNoOverlap<Extract<FrontOnlyApiErrorCode, ContractApiErrorCode>>

interface ApiErrorInit {
  code: ApiErrorCode
  message: ContractApiError['message']
  status: number
  unrecognizedCode?: string
}

export class ApiError extends Error {
  readonly code: ApiErrorCode
  readonly status: number
  /** The raw code the back sent when it isn't in the contract (`code` is then `unrecognized`). */
  readonly unrecognizedCode?: string

  constructor({ code, message, status, unrecognizedCode }: ApiErrorInit) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.unrecognizedCode = unrecognizedCode
  }
}

interface ApiErrorValidationInit extends Pick<ApiErrorInit, 'message' | 'status'> {
  violations: ContractApiErrorValidation['violations']
}

export class ApiErrorValidation extends ApiError {
  readonly violations: ContractApiErrorValidation['violations']

  constructor({ violations, ...init }: ApiErrorValidationInit) {
    super({ ...init, code: 'validation_failed' })
    this.name = 'ApiErrorValidation'
    this.violations = violations
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isContractCode(code: unknown): code is ContractApiErrorCode {
  return typeof code === 'string' && (apiErrorCodeValues as readonly string[]).includes(code)
}

function isViolations(value: unknown): value is ContractApiErrorValidation['violations'] {
  return (
    isRecord(value) &&
    Object.values(value).every(
      (messages) => Array.isArray(messages) && messages.every((m) => typeof m === 'string'),
    )
  )
}

async function toApiError(response: Response, path: string): Promise<ApiError> {
  const { status } = response
  const body: unknown = await response.json().catch(() => null)
  const error = isRecord(body) ? body.error : undefined

  if (isRecord(error) && typeof error.message === 'string') {
    if (isContractCode(error.code)) {
      if (error.code !== 'validation_failed') {
        return new ApiError({ code: error.code, message: error.message, status })
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

  console.error('API error response without the error envelope', { path, status })
  return new ApiError({ code: 'unrecognized', message: response.statusText, status })
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(path, import.meta.env.VITE_API_URL)
  const { body, headers, ...rest } = options

  let response: Response
  try {
    response = await fetch(url, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        // Fixed until the front has i18n; the back translates `violations` with it.
        'Accept-Language': 'es',
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (error) {
    // fetch rejects with TypeError when there's no response; anything else (e.g. an abort) isn't a network failure.
    if (!(error instanceof TypeError)) throw error
    throw new ApiError({ code: 'network_error', message: 'Network request failed', status: 0 })
  }

  if (!response.ok) {
    throw await toApiError(response, path)
  }

  const { data } = (await response.json()) as { data: T }
  return data
}
