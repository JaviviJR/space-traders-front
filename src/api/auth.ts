import { apiFetch } from './client'
import type { components } from '@/types/backend'

export type RegisterPayload = components['schemas']['RegisterUser']
export type RegisteredUser = components['schemas']['RegisteredUser']

export async function register(payload: RegisterPayload): Promise<RegisteredUser> {
  const response = await apiFetch<{ data: RegisteredUser }>('/auth/register', {
    method: 'POST',
    body: payload,
  })

  return response.data
}
