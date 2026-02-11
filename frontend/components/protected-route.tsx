'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Spinner } from '@/components/ui/spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const { usuario, isAuthenticated, isReady } = useAuth()

  if (!isReady) {
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
