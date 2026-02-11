'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/protected-route'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { apiClient } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'
import { Servicio } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function ReservarPage() {
  return (
    <ProtectedRoute allowedRoles={['cliente']}>
      <DashboardLayout>
        <ReservarContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function ReservarContent() {
  const params = useParams()
  const router = useRouter()
  const servicioId = params.id as string
  const usuario = useAuthStore((state) => state.usuario)

  const [servicio, setServicio] = useState<Servicio | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
  })

  useEffect(() => {
    loadServicio()
  }, [servicioId])

  async function loadServicio() {
    try {
      setIsLoading(true)
      const servicios = await apiClient.getServicios()
      const lista = Array.isArray(servicios) ? servicios : servicios.results || []
      const encontrado = lista.find((s) => s.id === parseInt(servicioId))
      if (encontrado) {
        setServicio(encontrado)
      } else {
        setError('Servicio no encontrado')
      }
    } catch (err) {
      setError('Error al cargar el servicio')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.fecha || !formData.hora || !servicio) return

    setIsSaving(true)
    setError('')

    try {
      await apiClient.createCita({
        servicio: servicio.id,
        fecha: formData.fecha,
        hora: formData.hora,
      })

      setSuccess(true)
      setTimeout(() => {
        router.push('/reservas')
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al crear la reserva')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!servicio) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Crear Reserva</h1>
        <p className="text-muted-foreground">{servicio.nombre}</p>
      </div>

      {success && (
        <Alert variant="success" className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Reserva creada exitosamente. Redireccionando...</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Reserva</CardTitle>
          <CardDescription>Completa los datos de tu reserva</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Resumen del Servicio */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Servicio</p>
                <p className="font-semibold">{servicio.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Precio</p>
                <p className="font-semibold">{formatCurrency(servicio.precio)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Duración</p>
                <p className="font-semibold">{servicio.duracion} minutos</p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fecha" className="block text-sm font-medium text-foreground mb-2">
                Fecha *
              </label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                disabled={isSaving}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label htmlFor="hora" className="block text-sm font-medium text-foreground mb-2">
                Hora *
              </label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                disabled={isSaving}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSaving || !formData.fecha || !formData.hora}
              size="lg"
            >
              {isSaving ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creando Reserva...
                </>
              ) : (
                'Confirmar Reserva'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
