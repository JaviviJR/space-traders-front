import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiFetch, ApiError, ApiErrorValidation } from '../api/client'
import type { RegisterUserResponse } from '../api/auth'
import type { components } from '@/types/backend'

type ErrorBody = { error: components['schemas']['ApiError'] }
type ValidationErrorBody = { error: components['schemas']['ApiErrorValidation'] }

const fetchMock = vi.fn<typeof fetch>()

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function rejectionOf(promise: Promise<unknown>): Promise<unknown> {
  return promise.then(
    () => {
      throw new Error('Expected the request to fail')
    },
    (error: unknown) => error,
  )
}

describe('apiFetch', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('VITE_API_URL', 'http://api.test')
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('envía Accept-Language: es', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { data: {} }))

    await apiFetch('/auth/register')

    expect(fetchMock.mock.calls[0]?.[1]?.headers).toMatchObject({ 'Accept-Language': 'es' })
  })

  it('devuelve el contenido de data en una respuesta 2xx', async () => {
    const user: RegisterUserResponse = {
      id: 1,
      name: 'Ellen Ripley',
      email: 'ripley@nostromo.test',
    }
    fetchMock.mockResolvedValue(jsonResponse(201, { data: user }))

    await expect(apiFetch<RegisterUserResponse>('/auth/register')).resolves.toEqual(user)
  })

  it('lanza ApiError con el code y el status del back', async () => {
    const body: ErrorBody = {
      error: { code: 'email_already_registered', message: 'Email already registered' },
    }
    fetchMock.mockResolvedValue(jsonResponse(409, body))

    const error = await rejectionOf(apiFetch('/auth/register'))

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ code: 'email_already_registered', status: 409 })
  })

  it('lanza ApiErrorValidation con las violations en un 422', async () => {
    const body: ValidationErrorBody = {
      error: {
        code: 'validation_failed',
        message: 'Validation failed',
        violations: { email: ['Este valor no es un email válido.'] },
      },
    }
    fetchMock.mockResolvedValue(jsonResponse(422, body))

    const error = await rejectionOf(apiFetch('/auth/register'))

    expect(error).toBeInstanceOf(ApiErrorValidation)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      code: 'validation_failed',
      status: 422,
      violations: { email: ['Este valor no es un email válido.'] },
    })
  })

  it('lanza unrecognized con el code original si el code no está en el contrato', async () => {
    // Deliberately outside the contract: a code the back deployed before the front regenerated its types.
    fetchMock.mockResolvedValue(
      jsonResponse(400, { error: { code: 'brand_new_code', message: 'Something new' } }),
    )

    const error = await rejectionOf(apiFetch('/auth/register'))

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      code: 'unrecognized',
      unrecognizedCode: 'brand_new_code',
      status: 400,
      message: 'Something new',
    })
    expect(console.error).toHaveBeenCalled()
  })

  it('lanza unrecognized si el cuerpo del error no es JSON', async () => {
    fetchMock.mockResolvedValue(
      new Response('<html><body>Bad Gateway</body></html>', {
        status: 502,
        statusText: 'Bad Gateway',
        headers: { 'Content-Type': 'text/html' },
      }),
    )

    const error = await rejectionOf(apiFetch('/auth/register'))

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ code: 'unrecognized', status: 502 })
  })

  it('lanza network_error con status 0 si fetch no obtiene respuesta', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

    const error = await rejectionOf(apiFetch('/auth/register'))

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ code: 'network_error', status: 0 })
  })
})
