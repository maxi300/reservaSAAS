import axios, { AxiosError, AxiosInstance } from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

class APIClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Interceptor para agregar token
    this.instance.interceptors.request.use((config) => {
      const token = Cookies.get('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Interceptor para manejo de errores
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          Cookies.remove('access_token')
          Cookies.remove('refresh_token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async login(username: string, password: string) {
    const response = await this.instance.post('/token/', {
      username,
      password,
    })
    return response.data
  }

  async refreshToken(refresh_token: string) {
    const response = await this.instance.post('/token/refresh/', {
      refresh: refresh_token,
    })
    return response.data
  }

  async getCurrentUser() {
    const response = await this.instance.get('/usuarios/me/')
    return response.data
  }

  // Usuarios endpoints
  async getUsuarios(filters?: Record<string, any>) {
    const response = await this.instance.get('/usuarios/', { params: filters })
    return response.data
  }

  async updateUsuario(id: number, data: Record<string, any>) {
    const response = await this.instance.patch(`/usuarios/${id}/`, data)
    return response.data
  }

  // Servicios endpoints
  async getServicios(filters?: Record<string, any>) {
    const response = await this.instance.get('/citas/servicios/', { params: filters })
    return response.data
  }

  async createServicio(data: Record<string, any>) {
    const response = await this.instance.post('/citas/servicios/', data)
    return response.data
  }

  async updateServicio(id: number, data: Record<string, any>) {
    const response = await this.instance.patch(`/citas/servicios/${id}/`, data)
    return response.data
  }

  async deleteServicio(id: number) {
    await this.instance.delete(`/citas/servicios/${id}/`)
  }

  // Citas/Reservas endpoints
  async getCitas(filters?: Record<string, any>) {
    const response = await this.instance.get('/citas/reserva/', { params: filters })
    return response.data
  }

  async createCita(data: Record<string, any>) {
    const response = await this.instance.post('/citas/reserva/', data)
    return response.data
  }

  async updateCita(id: number, data: Record<string, any>) {
    const response = await this.instance.patch(`/citas/reserva/${id}/`, data)
    return response.data
  }

  async cancelarCita(id: number) {
    const response = await this.instance.patch(`/citas/reserva/${id}/`, {
      estado: 'cancelada',
    })
    return response.data
  }

  // Planes y Suscripciones endpoints
  async getPlanes() {
    const response = await this.instance.get('/pagos/planes/')
    return response.data
  }

  async getSuscripciones() {
    const response = await this.instance.get('/pagos/suscripciones/')
    return response.data
  }

  async createSuscripcion(data: Record<string, any>) {
    const response = await this.instance.post('/pagos/suscripciones/', data)
    return response.data
  }
}

export const apiClient = new APIClient()
