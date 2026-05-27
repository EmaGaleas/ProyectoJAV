import { create } from 'zustand'
import type { AuthState, AuthUser } from '../types'

export const useAuthStore = create<AuthState>((set) => ({
  user:            null,
  isAuthenticated: false,
  token:           null,

  setAuth: (user: AuthUser, token?: string) =>
    set({ user, token, isAuthenticated: true }),

  logout: () =>
    set({ user: null, token: null, isAuthenticated: false }),
}))