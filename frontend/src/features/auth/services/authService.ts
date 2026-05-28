import { apiFetch } from '../../../services/apiClient'
import type { AuthUser, Role } from '../types'

interface LoginApiResponse {
  token: string
  correo: string
  nombreCompleto: string
  rol: string
  expiracion: string
}

// Maps backend Rol enum values to the frontend Role used for routing/access control.
// cargo (the raw backend value) is preserved separately for display purposes.
const ROLE_MAP: Record<string, Role> = {
  Presidente:     'SuperAdministrador',
  Vicepresidente: 'SuperAdministrador',
  Secretario:     'Administrador',
  Vocal:          'Administrador',
  Tesorero:       'Tesorero',
  Fiscal:         'Fiscal',
}

function decodeJwtSub(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return String(payload.sub ?? payload.nameid ?? '')
  } catch {
    return ''
  }
}

export async function loginApi(
  correo: string,
  password: string,
): Promise<{ user: AuthUser; token: string }> {
  const data = await apiFetch<LoginApiResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ Correo: correo, Password: password }),
  })

  const rol = ROLE_MAP[data.rol]
  if (!rol) throw new Error(`Rol no reconocido en el sistema: ${data.rol}`)

  return {
    user: {
      id: decodeJwtSub(data.token),
      nombre: data.nombreCompleto,
      rol,
      cargo: data.rol,
    },
    token: data.token,
  }
}
