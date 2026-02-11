'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Menu, LogOut, User } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const { usuario, logout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">R</span>
            </div>
            <h1 className="text-xl font-bold text-foreground hidden sm:inline">ReservaSaaS</h1>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{usuario?.first_name || usuario?.username}</p>
                <p className="text-xs text-muted-foreground">{usuario?.rol === 'negocio' ? 'Negocio' : usuario?.rol === 'cliente' ? 'Cliente' : 'Administrador'}</p>
              </div>
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                {usuario?.first_name?.charAt(0) || usuario?.username?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
