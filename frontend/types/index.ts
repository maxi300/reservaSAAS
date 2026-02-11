export interface Usuario {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  rol: 'admin' | 'negocio' | 'cliente'
  telefono?: string
  negocio?: string
  is_active: boolean
}

export interface Servicio {
  id: number
  negocio: number
  nombre: string
  duracion: number
  precio: string
}

export interface Cita {
  id: number
  negocio: number
  cliente: number
  servicio: number
  fecha: string
  hora: string
  estado: 'pendiente' | 'confirmada' | 'cancelada'
  cliente_data?: Usuario
  negocio_data?: Usuario
  servicio_data?: Servicio
}

export interface Plan {
  id: number
  nombre: string
  precio_mensual: string
  max_citas: number
}

export interface Suscripcion {
  id: number
  negocio: number
  plan: number
  fecha_inicio: string
  activa: boolean
}

export interface AuthResponse {
  access: string
  refresh: string
  usuario: {
    id: number
    username: string
    rol: 'admin' | 'negocio' | 'cliente'
  }
}

export interface ApiResponse<T> {
  data?: T
  results?: T[]
  count?: number
  next?: string
  previous?: string
  detail?: string
}
