'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/protected-route'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { apiClient } from '@/lib/api'
import { Usuario, Cita } from '@/types'
import { Users, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function EstadisticasAdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <EstadisticasAdminContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function EstadisticasAdminContent() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [citas, setCitas] = useState<Cita[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setIsLoading(true)
      const [usuariosData, citasData] = await Promise.all([
        apiClient.getUsuarios(),
        apiClient.getCitas(),
      ])

      setUsuarios(Array.isArray(usuariosData) ? usuariosData : usuariosData.results || [])
      setCitas(Array.isArray(citasData) ? citasData : citasData.results || [])
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    )
  }

  // Estadísticas por estado de cita
  const citasPorEstado = {
    confirmadas: citas.filter((c) => c.estado === 'confirmada').length,
    pendientes: citas.filter((c) => c.estado === 'pendiente').length,
    canceladas: citas.filter((c) => c.estado === 'cancelada').length,
  }

  // Datos para gráfico
  const statsChart = [
    { name: 'Confirmadas', value: citasPorEstado.confirmadas, fill: '#22c55e' },
    { name: 'Pendientes', value: citasPorEstado.pendientes, fill: '#eab308' },
    { name: 'Canceladas', value: citasPorEstado.canceladas, fill: '#ef4444' },
  ]

  const usuariosPorRol = [
    {
      name: 'Admin',
      usuarios: usuarios.filter((u) => u.rol === 'admin').length,
    },
    {
      name: 'Negocios',
      usuarios: usuarios.filter((u) => u.rol === 'negocio').length,
    },
    {
      name: 'Clientes',
      usuarios: usuarios.filter((u) => u.rol === 'cliente').length,
    },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Estadísticas del Sistema</h1>
        <p className="text-muted-foreground">Visualiza métricas y rendimiento de la plataforma</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usuarios.length}</div>
            <p className="text-xs text-muted-foreground">Usuarios registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Citas</CardTitle>
            <Calendar className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citas.length}</div>
            <p className="text-xs text-muted-foreground">Citas en el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citasPorEstado.confirmadas}</div>
            <p className="text-xs text-muted-foreground">
              {((citasPorEstado.confirmadas / (citas.length || 1)) * 100).toFixed(0)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa Conversión</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((citasPorEstado.confirmadas / (citas.length || 1)) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">De citas confirmadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Citas por Estado */}
        <Card>
          <CardHeader>
            <CardTitle>Citas por Estado</CardTitle>
            <CardDescription>Distribución de estados de citas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statsChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Usuarios por Rol */}
        <Card>
          <CardHeader>
            <CardTitle>Usuarios por Rol</CardTitle>
            <CardDescription>Distribución de usuarios por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usuariosPorRol}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="usuarios" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detalles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Negocios Activos</p>
              <p className="text-3xl font-bold text-foreground">
                {usuarios.filter((u) => u.rol === 'negocio' && u.is_active).length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Clientes Activos</p>
              <p className="text-3xl font-bold text-foreground">
                {usuarios.filter((u) => u.rol === 'cliente' && u.is_active).length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Citas Pendientes</p>
              <p className="text-3xl font-bold text-foreground">
                {citasPorEstado.pendientes}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
