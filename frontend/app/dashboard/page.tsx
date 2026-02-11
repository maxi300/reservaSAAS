'use client'

import { useAuth } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/protected-route'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, Users, BarChart3, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { Cita, Usuario } from '@/types'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { usuario } = useAuth()
  const [stats, setStats] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      if (usuario?.rol === 'cliente') {
        const citas = await apiClient.getCitas()
        const total = Array.isArray(citas) ? citas.length : citas.count || 0
        const confirmadas = (Array.isArray(citas) ? citas : citas.results || []).filter(
          (c: Cita) => c.estado === 'confirmada'
        ).length
        setStats({
          totalReservas: total,
          confirmadas,
          pendientes: total - confirmadas,
        })
      } else if (usuario?.rol === 'negocio') {
        const citas = await apiClient.getCitas()
        const total = Array.isArray(citas) ? citas.length : citas.count || 0
        const confirmadas = (Array.isArray(citas) ? citas : citas.results || []).filter(
          (c: Cita) => c.estado === 'confirmada'
        ).length
        setStats({
          totalReservas: total,
          confirmadas,
          pendientes: total - confirmadas,
        })
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (usuario?.rol === 'cliente') {
    return <ClientDashboard stats={stats} />
  } else if (usuario?.rol === 'negocio') {
    return <NegocioDashboard stats={stats} />
  } else if (usuario?.rol === 'admin') {
    return <AdminDashboard stats={stats} />
  }

  return null
}

function ClientDashboard({ stats }: any) {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Cliente</h1>
        <p className="text-muted-foreground">Gestiona tus reservas y búsqueda de servicios</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReservas || 0}</div>
            <p className="text-xs text-muted-foreground">Todas tus reservas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmadas || 0}</div>
            <p className="text-xs text-muted-foreground">Reservas confirmadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendientes || 0}</div>
            <p className="text-xs text-muted-foreground">Reservas pendientes</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Buscar Servicios</CardTitle>
            <CardDescription>Encuentra y reserva servicios disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/buscar-servicios">
              <Button className="w-full">Explorar Servicios</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mis Reservas</CardTitle>
            <CardDescription>Administra todas tus reservas</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/reservas">
              <Button variant="outline" className="w-full">
                Ver Reservas
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function NegocioDashboard({ stats }: any) {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Negocio</h1>
        <p className="text-muted-foreground">Gestiona tus servicios y reservas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReservas || 0}</div>
            <p className="text-xs text-muted-foreground">Reservas recibidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmadas || 0}</div>
            <p className="text-xs text-muted-foreground">Reservas confirmadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendientes || 0}</div>
            <p className="text-xs text-muted-foreground">Reservas pendientes</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mis Servicios</CardTitle>
            <CardDescription>Administra tus servicios</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/negocio/servicios">
              <Button className="w-full">Ver Servicios</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reservas Recibidas</CardTitle>
            <CardDescription>Gestiona las reservas</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/negocio/reservas">
              <Button variant="outline" className="w-full">
                Ver Reservas
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mi Suscripción</CardTitle>
            <CardDescription>Gestiona tu plan</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/negocio/suscripcion">
              <Button variant="outline" className="w-full">
                Ver Suscripción
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AdminDashboard({ stats }: any) {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Administrador</h1>
        <p className="text-muted-foreground">Administra el sistema y visualiza estadísticas</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Usuarios</CardTitle>
            <CardDescription>Gestiona usuarios del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/usuarios">
              <Button className="w-full">Ir a Usuarios</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
            <CardDescription>Visualiza estadísticas del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/estadisticas">
              <Button variant="outline" className="w-full">
                Ver Estadísticas
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planes</CardTitle>
            <CardDescription>Gestiona los planes de suscripción</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/planes">
              <Button variant="outline" className="w-full">
                Ver Planes
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
