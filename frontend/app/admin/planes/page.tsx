'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/protected-route'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { apiClient } from '@/lib/api'
import { Plan } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { CreditCard } from 'lucide-react'

export default function PlanesAdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <PlanesAdminContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function PlanesAdminContent() {
  const [planes, setPlanes] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPlanes()
  }, [])

  async function loadPlanes() {
    try {
      setIsLoading(true)
      const data = await apiClient.getPlanes()
      const lista = Array.isArray(data) ? data : data.results || []
      setPlanes(lista)
    } catch (err) {
      console.error('Error loading planes:', err)
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Planes de Suscripción</h1>
        <p className="text-muted-foreground">Gestiona los planes disponibles para negocios</p>
      </div>

      {/* Planes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planes.map((plan) => (
          <Card key={plan.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
              <h3 className="text-lg font-semibold text-foreground">{plan.nombre}</h3>
            </div>
            <CardContent className="flex-1 pt-6">
              <div className="mb-6">
                <div className="text-3xl font-bold text-foreground mb-2">
                  {formatCurrency(plan.precio_mensual)}
                </div>
                <p className="text-sm text-muted-foreground">/mes</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <CreditCard className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Citas mensuales</p>
                    <p className="font-semibold text-foreground">{plan.max_citas}</p>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Plan ID</p>
                <p className="text-sm font-mono text-foreground">#{plan.id}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumen */}
      {planes.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Resumen de Planes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {planes.map((plan) => (
                <div key={plan.id} className="flex justify-between items-center p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-semibold text-foreground">{plan.nombre}</p>
                    <p className="text-sm text-muted-foreground">{plan.max_citas} citas/mes</p>
                  </div>
                  <Badge variant="secondary">{formatCurrency(plan.precio_mensual)}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
