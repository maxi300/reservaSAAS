'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/protected-route'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/lib/api'
import { Servicio, Usuario } from '@/types'
import { formatCurrency, formatTime } from '@/lib/utils'
import { Clock, DollarSign, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function BuscarServiciosPage() {
  return (
    <ProtectedRoute allowedRoles={['cliente']}>
      <DashboardLayout>
        <BuscarServiciosContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function BuscarServiciosContent() {
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [negociosMap, setNegociosMap] = useState<Record<number, Usuario>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [serviciosFiltrados, setServiciosFiltrados] = useState<Servicio[]>([])

  useEffect(() => {
    loadServicios()
  }, [])

  useEffect(() => {
    const filtrados = servicios.filter((s) =>
      s.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )
    setServiciosFiltrados(filtrados)
  }, [busqueda, servicios])

  async function loadServicios() {
    try {
      setIsLoading(true)
      const data = await apiClient.getServicios()
      const lista = Array.isArray(data) ? data : data.results || []
      setServicios(lista)

      // Cargar información de negocios
      const negocioIds = [...new Set(lista.map((s) => s.negocio))]
      const negocioMap: Record<number, Usuario> = {}

      for (const id of negocioIds) {
        try {
          const usuarios = await apiClient.getUsuarios({ id })
          const negocio = Array.isArray(usuarios)
            ? usuarios[0]
            : usuarios.results?.[0]
          if (negocio) {
            negocioMap[id] = negocio
          }
        } catch (error) {
          console.error(`Error loading negocio ${id}:`, error)
        }
      }

      setNegociosMap(negocioMap)
    } catch (error) {
      console.error('Error loading servicios:', error)
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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Buscar Servicios</h1>
        <p className="text-muted-foreground">Encuentra y reserva los servicios que necesitas</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex gap-4 items-center">
        <Input
          placeholder="Buscar por nombre del servicio..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1"
        />
        <Badge variant="outline">{serviciosFiltrados.length} servicios</Badge>
      </div>

      {/* Servicios Grid */}
      {serviciosFiltrados.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {busqueda ? 'No se encontraron servicios con ese nombre' : 'No hay servicios disponibles'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviciosFiltrados.map((servicio) => {
            const negocio = negociosMap[servicio.negocio]
            return (
              <Card key={servicio.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{servicio.nombre}</CardTitle>
                      <CardDescription>{negocio?.negocio || 'Negocio'}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{formatCurrency(servicio.precio)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-secondary" />
                      <span>{servicio.duracion} minutos</span>
                    </div>
                  </div>

                  <Link href={`/reservar/${servicio.id}`}>
                    <Button className="w-full">Reservar Ahora</Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
