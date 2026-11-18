const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1'

export type ApiErrorDetail = {
  code?: string
  [key: string]: unknown
}

export type ApiFailure = {
  status: number
  detail: ApiErrorDetail | null
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, init)
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null)
    const detail = isRecord(body) && isRecord(body.detail) ? body.detail : null
    const cause: ApiFailure = { status: response.status, detail }
    throw new Error(`API request failed with status ${response.status}`, { cause })
  }
  return response.json() as Promise<T>
}

export const getJson = <T>(path: string) => request<T>(path)

export const postJson = <T>(path: string, body: unknown) =>
  request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

export const getApiFailure = (error: unknown): ApiFailure | null =>
  error instanceof Error && isRecord(error.cause) && typeof error.cause.status === 'number'
    ? (error.cause as ApiFailure)
    : null
