import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, formatStr: string = 'dd/MM/yyyy') {
  try {
    return format(new Date(date), formatStr, { locale: es })
  } catch {
    return date
  }
}

export function formatTime(time: string) {
  return time.slice(0, 5)
}

export function formatCurrency(value: string | number) {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(num)
}

export function getStatusColor(estado: string) {
  const colors: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmada: 'bg-green-100 text-green-800 border-green-300',
    cancelada: 'bg-red-100 text-red-800 border-red-300',
  }
  return colors[estado] || colors.pendiente
}

export function getStatusLabel(estado: string) {
  const labels: Record<string, string> = {
    pendiente: 'Pendiente',
    confirmada: 'Confirmada',
    cancelada: 'Cancelada',
  }
  return labels[estado] || estado
}

export function getRoleLabel(rol: string) {
  const labels: Record<string, string> = {
    admin: 'Administrador',
    negocio: 'Negocio',
    cliente: 'Cliente',
  }
  return labels[rol] || rol
}
