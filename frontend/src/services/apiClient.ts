import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5209'

export class ApiError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// Configuración global de Axios para replicar el comportamiento exacto de tu fetch anterior
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    // El backend espera este header explícitamente en todas las peticiones
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Mantenemos apiFetch intacto para el resto del proyecto, pero impulsado por Axios
export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  }

  if (!(options?.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) headers['Authorization'] = `Bearer ${token}`

  let data = options?.body;
  if (typeof data === 'string' && headers['Content-Type'] === 'application/json') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      // Ignorar error de parseo
    }
  }

  try {
    const res = await apiClient.request<T>({
      url: path,
      method: options?.method ?? 'GET',
      headers,
      data: data instanceof FormData ? options?.body : data,
    })
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const body = error.response.data || {}
      throw new ApiError(error.response.status, body.mensaje ?? body.error ?? `Error ${error.response.status}`)
    }
    throw new ApiError(500, 'Error de conexión con el servidor')
  }
}