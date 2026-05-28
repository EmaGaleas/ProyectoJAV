import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthState, AuthUser } from '../types'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:            null,
      isAuthenticated: false,
      token:           null,

      setAuth: (user: AuthUser, token?: string) =>
        set({ user, token: token ?? null, isAuthenticated: true }),

      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name:    'jav-auth',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)