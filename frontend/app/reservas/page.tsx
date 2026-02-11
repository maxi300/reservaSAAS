'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/protected-route'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { apiClient } from '@/lib/api'
import { Cita, Servicio } from '@/types'
import { formatDate, formatTime, formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils'
import { Calendar, Clock, DollarSign, X } from 'lucide-react'

export default function ReservasPage() {
  return (
    <ProtectedRoute allowedRoles={['cliente']}>
      <DashboardLayout>
        <ReservasContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function ReservasContent() {
  const [reservas, setReservas] = useState<Cita[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<number | null>(null)
  const [error, setError] = useState('')

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
      setError('Error al cargar las reservas')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCancelarReserva(id: number) {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return
    }

    setCancellingId(id)
    try {
      await apiClient.cancelarCita(id)
      setReservas((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: 'cancelada' } : r))
      )
    } catch (err) {
      console.error('Error cancelando reserva:', err)
    } finally {
      setCancellingId(null)
    }
  }

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
        <h1 className="text-3xl font-bold text-foreground mb-2">Mis Reservas</h1>
        <p className="text-muted-foreground">Visualiza y administra tus reservas</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {reservas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No tienes reservas aún</p>
            <Button className="mt-4">
              <a href="/buscar-servicios">Buscar Servicios</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservas.map((reserva) => (
            <Card key={reserva.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Información Principal */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {reserva.servicio_data?.nombre || `Servicio #${reserva.servicio}`}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(reserva.fecha)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTime(reserva.hora)}
                          </div>
                        </div>
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

                    {reserva.estado !== 'cancelada' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelarReserva(reserva.id)}
                        disabled={cancellingId === reserva.id}
                      >
                        {cancellingId === reserva.id ? (
                          <>
                            <Spinner size="sm" className="mr-2" />
                            Cancelando...
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 mr-1" />
                            Cancelar
                          </>
                        )}
                      </Button>
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
