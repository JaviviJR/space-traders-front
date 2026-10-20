export class ApiError extends Error {
  readonly status: number
  readonly code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

interface ApiErrorBody {
  error?: {
    code?: string
    message?: string
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(path, import.meta.env.VITE_API_URL)
  const { body, headers, ...rest } = options

  const response = await fetch(url, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorBody: ApiErrorBody | null = await response.json().catch(() => null)
    throw new ApiError(
      errorBody?.error?.message ?? response.statusText,
      response.status,
      errorBody?.error?.code,
    )
  }

  return (await response.json()) as T
}
