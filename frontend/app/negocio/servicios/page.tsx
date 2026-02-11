'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/protected-route'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { apiClient } from '@/lib/api'
import { Servicio } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Clock, DollarSign, Plus, Edit2, Trash2 } from 'lucide-react'
import { useState as useStateModal } from 'react'

export default function ServiciosNegocioPage() {
  return (
    <ProtectedRoute allowedRoles={['negocio']}>
      <DashboardLayout>
        <ServiciosNegocioContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function ServiciosNegocioContent() {
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    nombre: '',
    duracion: '',
    precio: '',
  })

  useEffect(() => {
    loadServicios()
  }, [])

  async function loadServicios() {
    try {
      setIsLoading(true)
      const data = await apiClient.getServicios()
      const lista = Array.isArray(data) ? data : data.results || []
      setServicios(lista)
    } catch (err) {
      console.error('Error loading servicios:', err)
      setError('Error al cargar los servicios')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.nombre || !formData.duracion || !formData.precio) return

    try {
      setError('')
      if (editingId) {
        await apiClient.updateServicio(editingId, {
          nombre: formData.nombre,
          duracion: parseInt(formData.duracion),
          precio: parseFloat(formData.precio),
        })
        setSuccess('Servicio actualizado')
        setEditingId(null)
      } else {
        await apiClient.createServicio({
          nombre: formData.nombre,
          duracion: parseInt(formData.duracion),
          precio: parseFloat(formData.precio),
        })
        setSuccess('Servicio creado')
      }

      setFormData({ nombre: '', duracion: '', precio: '' })
      setShowForm(false)
      loadServicios()

      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al guardar el servicio')
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('¿Estás seguro?')) return

    try {
      await apiClient.deleteServicio(id)
      setServicios((prev) => prev.filter((s) => s.id !== id))
      setSuccess('Servicio eliminado')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Error al eliminar el servicio')
    }
  }

  function handleEdit(servicio: Servicio) {
    setFormData({
      nombre: servicio.nombre,
      duracion: servicio.duracion.toString(),
      precio: servicio.precio,
    })
    setEditingId(servicio.id)
    setShowForm(true)
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Mis Servicios</h1>
          <p className="text-muted-foreground">Gestiona los servicios que ofreces</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ nombre: '', duracion: '', precio: '' }); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {success && (
        <Alert variant="success" className="mb-6">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Servicio' : 'Crear Nuevo Servicio'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nombre del Servicio *
                </label>
                <Input
                  placeholder="Ej: Corte de Cabello"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Duración (minutos) *
                  </label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={formData.duracion}
                    onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Precio *
                  </label>
                  <Input
                    type="number"
                    placeholder="50000"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? 'Actualizar' : 'Crear'} Servicio
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    setFormData({ nombre: '', duracion: '', precio: '' })
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Servicios List */}
      {servicios.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No has creado servicios aún</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Servicio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((servicio) => (
            <Card key={servicio.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardTitle className="text-lg">{servicio.nombre}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-secondary" />
                    <span className="text-sm">{servicio.duracion} minutos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">{formatCurrency(servicio.precio)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEdit(servicio)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleDelete(servicio.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
