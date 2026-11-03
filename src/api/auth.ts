import { apiFetch } from './client'
import type { components } from '@/types/backend'

export type RegisterUserRequest = components['schemas']['RegisterUserRequest']
export type RegisterUserResponse = components['schemas']['RegisterUserResponse']
export type ConfirmEmailResponse = components['schemas']['ConfirmEmailResponse']

export async function register(
  payload: RegisterUserRequest,
): Promise<RegisterUserResponse> {
  return apiFetch<RegisterUserResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  })
}

/**
 * Takes the link's query string as received (`window.location.search`), not
 * an object: the back verifies it with an HMAC signature, and decoding and
 * re-encoding it (e.g. through `route.query`) can change `%2F` or `+` and
 * break the signature.
 */
export async function confirmEmail(
  search: string,
): Promise<ConfirmEmailResponse> {
  return apiFetch<ConfirmEmailResponse>(`/auth/confirm-email${search}`, {
    method: 'POST',
  })
}
