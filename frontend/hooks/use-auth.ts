import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'

export function useAuth() {
  const [isReady, setIsReady] = useState(false)
  const usuario = useAuthStore((state) => state.usuario)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)
  const loadUsuario = useAuthStore((state) => state.loadUsuario)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    loadUsuario().finally(() => setIsReady(true))
  }, [loadUsuario])

  return {
    usuario,
    isAuthenticated,
    isReady,
    isLoading,
    error,
    login,
    logout,
  }
}
