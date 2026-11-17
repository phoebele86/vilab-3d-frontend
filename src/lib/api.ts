const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1'

export const getJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) throw new Error(`API request failed with status ${response.status}`)
  return response.json() as Promise<T>
}
