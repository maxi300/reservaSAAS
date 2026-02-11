'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  BarChart3,
  Clock,
  CreditCard,
  Home,
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  roles?: string[]
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ['admin', 'negocio', 'cliente'],
  },
  {
    href: '/reservas',
    label: 'Mis Reservas',
    icon: <Calendar className="h-5 w-5" />,
    roles: ['cliente'],
  },
  {
    href: '/buscar-servicios',
    label: 'Buscar Servicios',
    icon: <Home className="h-5 w-5" />,
    roles: ['cliente'],
  },
  {
    href: '/negocio/servicios',
    label: 'Mis Servicios',
    icon: <Clock className="h-5 w-5" />,
    roles: ['negocio'],
  },
  {
    href: '/negocio/reservas',
    label: 'Reservas Recibidas',
    icon: <Calendar className="h-5 w-5" />,
    roles: ['negocio'],
  },
  {
    href: '/negocio/suscripcion',
    label: 'Suscripción',
    icon: <CreditCard className="h-5 w-5" />,
    roles: ['negocio'],
  },
  {
    href: '/admin/usuarios',
    label: 'Usuarios',
    icon: <Users className="h-5 w-5" />,
    roles: ['admin'],
  },
  {
    href: '/admin/estadisticas',
    label: 'Estadísticas',
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ['admin'],
  },
  {
    href: '/admin/planes',
    label: 'Planes',
    icon: <Settings className="h-5 w-5" />,
    roles: ['admin'],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { usuario } = useAuth()

  const filteredItems = navItems.filter(
    (item) => !item.roles || (usuario && item.roles.includes(usuario.rol))
  )

  return (
    <aside className="w-64 bg-card border-r border-border h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-6">
        <nav className="space-y-2">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
