import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'

export function useAuth() {
  const [isReady, setIsReady] = useState(false)
  const usuario = useAuthStore((state) => state.usuario)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const loadUsuario = useAuthStore((state) => state.loadUsuario)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    loadUsuario().finally(() => setIsReady(true))
  }, [loadUsuario])

  return {
    usuario,
    isAuthenticated,
    isReady,
    logout,
  }
}
