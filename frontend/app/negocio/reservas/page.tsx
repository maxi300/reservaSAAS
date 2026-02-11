'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/protected-route'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Select } from '@/components/ui/select'
import { apiClient } from '@/lib/api'
import { Cita } from '@/types'
import { formatDate, formatTime, getStatusLabel } from '@/lib/utils'
import { Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react'

export default function ReservasNegocioPage() {
  return (
    <ProtectedRoute allowedRoles={['negocio']}>
      <DashboardLayout>
        <ReservasNegocioContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function ReservasNegocioContent() {
  const [reservas, setReservas] = useState<Cita[]>([])
  const [filtroEstado, setFiltroEstado] = useState('todas')
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => {
    loadReservas()
  }, [])

  async function loadReservas() {
    try {
      setIsLoading(true)
      const data = await apiClient.getCitas()
      const lista = Array.isArray(data) ? data : data.results || []
      setReservas(lista)
    } catch (err) {
      console.error('Error loading reservas:', err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleConfirmar(id: number) {
    setUpdatingId(id)
    try {
      await apiClient.updateCita(id, { estado: 'confirmada' })
      setReservas((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: 'confirmada' } : r))
      )
    } catch (err) {
      console.error('Error confirming reserva:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleCancelar(id: number) {
    if (!window.confirm('¿Deseas cancelar esta reserva?')) return

    setUpdatingId(id)
    try {
      await apiClient.cancelarCita(id)
      setReservas((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: 'cancelada' } : r))
      )
    } catch (err) {
      console.error('Error canceling reserva:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  const reservasFiltradas = reservas.filter(
    (r) => filtroEstado === 'todas' || r.estado === filtroEstado
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Reservas Recibidas</h1>
        <p className="text-muted-foreground">Administra las reservas de tus clientes</p>
      </div>

      {/* Filtro */}
      <div className="mb-8">
        <Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="todas">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="confirmada">Confirmadas</option>
          <option value="cancelada">Canceladas</option>
        </Select>
      </div>

      {/* Reservas */}
      {reservasFiltradas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              {reservas.length === 0 ? 'No hay reservas aún' : 'No hay reservas con ese estado'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservasFiltradas.map((reserva) => (
            <Card key={reserva.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Información */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {reserva.cliente_data?.first_name || `Cliente #${reserva.cliente}`}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(reserva.fecha)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTime(reserva.hora)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Teléfono: {reserva.cliente_data?.telefono || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Estado y Acciones */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <Badge
                      variant={
                        reserva.estado === 'confirmada'
                          ? 'success'
                          : reserva.estado === 'cancelada'
                          ? 'destructive'
                          : 'warning'
                      }
                      className="w-fit"
                    >
                      {getStatusLabel(reserva.estado)}
                    </Badge>

                    {reserva.estado === 'pendiente' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleConfirmar(reserva.id)}
                          disabled={updatingId === reserva.id}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelar(reserva.id)}
                          disabled={updatingId === reserva.id}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rechazar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
