# ReservaSaaS - Frontend Next.js 16

Sistema de gestión de reservas y citas - Frontend moderno con Next.js 16, Tailwind CSS y TypeScript.

## Características

- ✅ Autenticación JWT con protección de rutas
- ✅ Dashboard Cliente - Buscar servicios, crear y gestionar reservas
- ✅ Dashboard Negocio - Gestionar servicios, ver reservas, planes de suscripción
- ✅ Dashboard Administrador - Gestión de usuarios y estadísticas
- ✅ Interfaz intuitiva y responsive
- ✅ Integración completa con API backend Django

## Requisitos

- Node.js 18+ 
- npm o yarn
- Backend Django corriendo en http://localhost:8000

## Instalación

### 1. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Ejecutar servidor de desarrollo

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
frontend/
├── app/
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Página de inicio
│   ├── login/                  # Página de login
│   ├── dashboard/              # Dashboard principal
│   ├── buscar-servicios/       # Búsqueda de servicios
│   ├── reservar/               # Crear reserva
│   ├── reservas/               # Mis reservas (cliente)
│   ├── negocio/                # Dashboards del negocio
│   │   ├── servicios/
│   │   ├── reservas/
│   │   └── suscripcion/
│   ├── admin/                  # Dashboards administrador
│   │   ├── usuarios/
│   │   ├── estadisticas/
│   │   └── planes/
│   └── globals.css             # Estilos globales
├── components/
│   ├── ui/                     # Componentes base reutilizables
│   ├── protected-route.tsx     # Componente de ruta protegida
│   ├── navbar.tsx              # Barra de navegación
│   ├── sidebar.tsx             # Barra lateral
│   └── dashboard-layout.tsx    # Layout del dashboard
├── hooks/
│   └── use-auth.ts             # Hook de autenticación
├── lib/
│   ├── api.ts                  # Cliente HTTP
│   ├── auth-store.ts           # Store de autenticación (Zustand)
│   └── utils.ts                # Utilidades comunes
├── types/
│   └── index.ts                # Tipos TypeScript
└── public/                     # Archivos estáticos
```

## Rutas de la Aplicación

### Públicas
- `/login` - Página de login

### Cliente
- `/dashboard` - Dashboard del cliente
- `/buscar-servicios` - Búsqueda de servicios
- `/reservar/[id]` - Crear reserva
- `/reservas` - Mis reservas

### Negocio
- `/negocio/servicios` - Mis servicios
- `/negocio/reservas` - Reservas recibidas
- `/negocio/suscripcion` - Gestión de suscripción

### Administrador
- `/admin/usuarios` - Gestión de usuarios
- `/admin/estadisticas` - Estadísticas del sistema
- `/admin/planes` - Gestión de planes

## Credenciales de Demo

```
Admin:
  Usuario: admin
  Contraseña: admin123

Negocio:
  Usuario: negocio1
  Contraseña: negocio123

Cliente:
  Usuario: cliente1
  Contraseña: cliente123
```

## Tecnologías

- **Next.js 16** - Framework React
- **TypeScript** - Lenguaje tipado
- **Tailwind CSS** - Estilos CSS
- **Zustand** - State management
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **Recharts** - Gráficas
- **js-cookie** - Gestión de cookies
- **date-fns** - Manejo de fechas

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar servidor producción
npm start

# Lint
npm run lint
```

## Build para Producción

```bash
npm run build
npm start
```

## Notas Importantes

1. El backend debe estar corriendo en http://localhost:8000 para desarrollo
2. Los tokens JWT se almacenan en cookies seguras
3. Las rutas están protegidas por rol de usuario
4. La UI es totalmente responsive para móvil, tablet y desktop

## Integración con Backend

El frontend se comunica con el backend Django a través de:

- **Login**: POST `/api/token/` - Obtener tokens JWT
- **Usuarios**: GET/POST/PATCH `/api/usuarios/`
- **Servicios**: GET/POST/PATCH/DELETE `/api/citas/servicios/`
- **Citas**: GET/POST/PATCH `/api/citas/reserva/`
- **Planes**: GET `/api/pagos/planes/`
- **Suscripciones**: GET/POST `/api/pagos/suscripciones/`

Todos los endpoints requieren autenticación con token JWT en el header:
```
Authorization: Bearer <token>
```
