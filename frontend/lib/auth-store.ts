import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Usuario, AuthResponse } from '@/types'
import { apiClient } from './api'
import Cookies from 'js-cookie'

interface AuthStore {
  usuario: Usuario | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  setUsuario: (usuario: Usuario | null) => void
  loadUsuario: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      usuario: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response: AuthResponse = await apiClient.login(username, password)
          
          // Guardar tokens
          Cookies.set('access_token', response.access, { expires: 7 })
          Cookies.set('refresh_token', response.refresh, { expires: 7 })
          
          // Obtener datos completos del usuario
          const usuarioData = await apiClient.getCurrentUser()
          
          set({
            usuario: usuarioData,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          const message = error.response?.data?.detail || 'Error al iniciar sesión'
          set({
            error: message,
            isLoading: false,
          })
          throw error
        }
      },

      logout: () => {
        Cookies.remove('access_token')
        Cookies.remove('refresh_token')
        set({
          usuario: null,
          isAuthenticated: false,
          error: null,
        })
      },

      setUsuario: (usuario: Usuario | null) => {
        set({
          usuario,
          isAuthenticated: !!usuario,
        })
      },

      loadUsuario: async () => {
        const token = Cookies.get('access_token')
        if (!token) {
          set({ usuario: null, isAuthenticated: false })
          return
        }

        try {
          const usuarioData = await apiClient.getCurrentUser()
          set({
            usuario: usuarioData,
            isAuthenticated: true,
          })
        } catch (error) {
          Cookies.remove('access_token')
          Cookies.remove('refresh_token')
          set({ usuario: null, isAuthenticated: false })
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
