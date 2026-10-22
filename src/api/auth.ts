import { apiFetch } from './client'
import type { components } from '@/types/backend'

export type RegisterUserRequest = components['schemas']['RegisterUserRequest']
export type RegisterUserResponse = components['schemas']['RegisterUserResponse']

export async function register(payload: RegisterUserRequest): Promise<RegisterUserResponse> {
  const response = await apiFetch<{ data: RegisterUserResponse }>('/auth/register', {
    method: 'POST',
    body: payload,
  })

  return response.data
}
