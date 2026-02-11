'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/protected-route'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { apiClient } from '@/lib/api'
import { Plan, Suscripcion } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Check, CreditCard } from 'lucide-react'

export default function SuscripcionNegocioPage() {
  return (
    <ProtectedRoute allowedRoles={['negocio']}>
      <DashboardLayout>
        <SuscripcionNegocioContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function SuscripcionNegocioContent() {
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([])
  const [planes, setPlanes] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setIsLoading(true)
      const [susData, planesData] = await Promise.all([
        apiClient.getSuscripciones(),
        apiClient.getPlanes(),
      ])

      setSuscripciones(Array.isArray(susData) ? susData : susData.results || [])
      setPlanes(Array.isArray(planesData) ? planesData : planesData.results || [])
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUpgrade(planId: number) {
    setIsCreating(true)
    try {
      await apiClient.createSuscripcion({ plan: planId })
      loadData()
    } catch (err) {
      console.error('Error upgrading:', err)
    } finally {
      setIsCreating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    )
  }

  const suscripcionActual = suscripciones.find((s) => s.activa)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Mi Suscripción</h1>
        <p className="text-muted-foreground">Administra tu plan de suscripción</p>
      </div>

      {/* Suscripción Actual */}
      {suscripcionActual && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Suscripción Actual</h2>
          <Card className="border-2 border-primary">
            <CardHeader className="bg-primary/5">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Plan Activo</CardTitle>
                  <CardDescription>
                    Desde {formatDate(suscripcionActual.fecha_inicio)}
                  </CardDescription>
                </div>
                <Badge variant="success">Activo</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg font-semibold text-foreground">
                {planes.find((p) => p.id === suscripcionActual.plan)?.nombre || 'Plan'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Planes Disponibles */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Planes Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planes.map((plan) => {
            const esActual = suscripcionActual?.plan === plan.id
            return (
              <Card
                key={plan.id}
                className={`flex flex-col ${esActual ? 'border-2 border-primary' : ''}`}
              >
                <CardHeader className={esActual ? 'bg-primary/5' : ''}>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <CardTitle>{plan.nombre}</CardTitle>
                      <CardDescription>
                        Hasta {plan.max_citas} citas por mes
                      </CardDescription>
                    </div>
                    {esActual && <Badge variant="success">Actual</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pt-6 flex flex-col">
                  <div className="mb-6 flex-1">
                    <div className="text-3xl font-bold text-foreground mb-2">
                      {formatCurrency(plan.precio_mensual)}
                    </div>
                    <p className="text-sm text-muted-foreground">/mes</p>

                    {/* Features */}
                    <div className="mt-6 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>{plan.max_citas} citas mensuales</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Gestión de servicios</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Reportes básicos</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant={esActual ? 'outline' : 'default'}
                    disabled={esActual || isCreating}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {esActual ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Plan Actual
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        {isCreating ? 'Procesando...' : 'Seleccionar'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
