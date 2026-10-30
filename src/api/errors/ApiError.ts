/**
 * The error every API function throws. Its fields come from the contract's
 * error schemas, plus `status` (not in the body) and front-only codes.
 *
 * `code` is a closed type here, although the back treats it as an open enum
 * at runtime: `toApiError.ts` checks the received code before building one of
 * these, so the rest of the app can trust the type.
 */
import type { components } from '@/types/backend'

// Aliased because the classes below share the contract schemas' names.
type ContractApiError = components['schemas']['ApiError']
type ContractApiErrorValidation = components['schemas']['ApiErrorValidation']
export type ContractApiErrorCode = ContractApiError['code']

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

export type ApiErrorViolations = ContractApiErrorValidation['violations']

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

interface ApiErrorValidationInit extends Pick<
  ApiErrorInit,
  'message' | 'status'
> {
  violations: ApiErrorViolations
}

export class ApiErrorValidation extends ApiError {
  readonly violations: ApiErrorViolations

  constructor({ violations, ...init }: ApiErrorValidationInit) {
    super({ ...init, code: 'validation_failed' })
    this.name = 'ApiErrorValidation'
    this.violations = violations
  }
}
