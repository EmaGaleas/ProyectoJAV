export type Role = 'SuperAdministrador' | 'Administrador' | 'Tesorero' | 'Fiscal'

export interface AuthUser {
  id: string
  nombre: string
  rol: Role
  cargo: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  token: string | null
  setAuth: (user: AuthUser, token?: string) => void
  logout: () => void
}