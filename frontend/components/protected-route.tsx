'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { Spinner } from '@/components/ui/spinner'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const usuario = useAuthStore((state) => state.usuario)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const loadUsuario = useAuthStore((state) => state.loadUsuario)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      if (!isAuthenticated) {
        await loadUsuario()
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated || !usuario) {
    router.push('/login')
    return null
  }

  if (allowedRoles && !allowedRoles.includes(usuario.rol)) {
    router.push('/unauthorized')
    return null
  }

  return <>{children}</>
}
