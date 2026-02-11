'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/protected-route'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { apiClient } from '@/lib/api'
import { Usuario } from '@/types'
import { getRoleLabel } from '@/lib/utils'
import { Mail, Phone, Building2, Toggle2 } from 'lucide-react'

export default function UsuariosAdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <UsuariosAdminContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function UsuariosAdminContent() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState('todos')
  const [togglingId, setTogglingId] = useState<number | null>(null)

  useEffect(() => {
    loadUsuarios()
  }, [])

  async function loadUsuarios() {
    try {
      setIsLoading(true)
      const data = await apiClient.getUsuarios()
      const lista = Array.isArray(data) ? data : data.results || []
      setUsuarios(lista)
    } catch (err) {
      console.error('Error loading usuarios:', err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggleActive(usuario: Usuario) {
    setTogglingId(usuario.id)
    try {
      await apiClient.updateUsuario(usuario.id, {
        is_active: !usuario.is_active,
      })
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === usuario.id ? { ...u, is_active: !u.is_active } : u
        )
      )
    } catch (err) {
      console.error('Error updating usuario:', err)
    } finally {
      setTogglingId(null)
    }
  }

  const usuariosFiltrados = usuarios.filter((u) => {
    const matchSearch =
      u.username.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase())
    const matchRol = filtroRol === 'todos' || u.rol === filtroRol
    return matchSearch && matchRol
  })

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
        <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Usuarios</h1>
        <p className="text-muted-foreground">
          Total de usuarios: <span className="font-semibold">{usuarios.length}</span>
        </p>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Input
          placeholder="Buscar por usuario o email..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
          className="px-3 py-2 border border-border rounded-md"
        >
          <option value="todos">Todos los roles</option>
          <option value="admin">Administrador</option>
          <option value="negocio">Negocio</option>
          <option value="cliente">Cliente</option>
        </select>
      </div>

      {/* Tabla de Usuarios */}
      <Card>
        <CardContent className="p-6">
          {usuariosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {usuarios.length === 0 ? 'No hay usuarios' : 'No hay usuarios con esos criterios'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-sm">Usuario</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Rol</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((usuario) => (
                    <tr
                      key={usuario.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-foreground">{usuario.username}</p>
                          <p className="text-sm text-muted-foreground">{usuario.first_name}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm">{usuario.email}</td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={
                            usuario.rol === 'admin'
                              ? 'default'
                              : usuario.rol === 'negocio'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {getRoleLabel(usuario.rol)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={usuario.is_active ? 'success' : 'destructive'}
                        >
                          {usuario.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(usuario)}
                          disabled={togglingId === usuario.id}
                        >
                          <Toggle2 className="h-4 w-4 mr-1" />
                          {usuario.is_active ? 'Desactivar' : 'Activar'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-1">Administradores</p>
              <p className="text-3xl font-bold text-foreground">
                {usuarios.filter((u) => u.rol === 'admin').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-1">Negocios</p>
              <p className="text-3xl font-bold text-foreground">
                {usuarios.filter((u) => u.rol === 'negocio').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-1">Clientes</p>
              <p className="text-3xl font-bold text-foreground">
                {usuarios.filter((u) => u.rol === 'cliente').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
