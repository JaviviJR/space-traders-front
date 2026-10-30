/**
 * The only place that calls `fetch`. Every API function either returns the
 * unwrapped `data` or throws `ApiError` (see `errors/`), including when the
 * request gets no response at all.
 */
import { ApiError } from './errors/ApiError'
import { toApiError } from './errors/toApiError'

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
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
    throw new ApiError({
      code: 'network_error',
      message: 'Network request failed',
      status: 0,
    })
  }

  if (!response.ok) {
    throw await toApiError(response, path)
  }

  const { data } = (await response.json()) as { data: T }
  return data
}
