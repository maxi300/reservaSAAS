# Estructura del Frontend - ReservaSaaS

## Descripción General

Frontend moderno construido con Next.js 16, TypeScript y Tailwind CSS. Arquitectura limpia y escalable con componentes reutilizables.

## Árbol de Carpetas

```
frontend/
│
├── app/                          # App Router de Next.js 16
│   ├── page.tsx                  # Página raíz (redirige a dashboard)
│   ├── layout.tsx                # Layout global
│   ├── globals.css               # Estilos globales y design tokens
│   │
│   ├── login/
│   │   └── page.tsx              # Página de login con autenticación
│   │
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard dinámico (cliente/negocio/admin)
│   │
│   ├── buscar-servicios/
│   │   └── page.tsx              # Búsqueda y listado de servicios
│   │
│   ├── reservar/
│   │   └── [id]/
│   │       └── page.tsx          # Formulario de nueva reserva
│   │
│   ├── reservas/
│   │   └── page.tsx              # Listado y gestión de reservas (cliente)
│   │
│   ├── negocio/                  # Dashboard del Negocio
│   │   ├── servicios/
│   │   │   └── page.tsx          # Crear/editar servicios
│   │   ├── reservas/
│   │   │   └── page.tsx          # Reservas recibidas
│   │   └── suscripcion/
│   │       └── page.tsx          # Gestión de planes
│   │
│   ├── admin/                    # Dashboard del Administrador
│   │   ├── usuarios/
│   │   │   └── page.tsx          # Gestión de usuarios
│   │   ├── estadisticas/
│   │   │   └── page.tsx          # Estadísticas y gráficas
│   │   └── planes/
│   │       └── page.tsx          # Gestión de planes
│   │
│   └── unauthorized/
│       └── page.tsx              # Página de acceso denegado
│
├── components/                   # Componentes React reutilizables
│   ├── ui/                       # Componentes base (design system)
│   │   ├── button.tsx            # Botón reutilizable con variantes
│   │   ├── card.tsx              # Card con header/content/footer
│   │   ├── input.tsx             # Input text
│   │   ├── select.tsx            # Select dropdown
│   │   ├── badge.tsx             # Badge/tag
│   │   ├── spinner.tsx           # Indicador de carga
│   │   └── alert.tsx             # Alertas (success/error/warning)
│   │
│   ├── navbar.tsx                # Barra de navegación superior
│   ├── sidebar.tsx               # Barra lateral con navegación
│   ├── dashboard-layout.tsx      # Layout del dashboard
│   └── protected-route.tsx       # Componente de ruta protegida
│
├── hooks/                        # React Hooks personalizados
│   └── use-auth.ts               # Hook para autenticación
│
├── lib/                          # Utilidades y lógica compartida
│   ├── api.ts                    # Cliente HTTP con Axios
│   ├── auth-store.ts             # State management con Zustand
│   └── utils.ts                  # Funciones utilitarias
│
├── types/                        # Tipos TypeScript
│   └── index.ts                  # Interfaz de modelos
│
├── public/                       # Archivos estáticos
│   └── [imágenes y assets]
│
├── .env.local                    # Variables de entorno (no commitear)
├── .eslintrc.json                # Configuración ESLint
├── .gitignore                    # Archivos a ignorar
├── next.config.js                # Configuración Next.js
├── package.json                  # Dependencias y scripts
├── postcss.config.js             # Configuración PostCSS
├── tailwind.config.ts            # Configuración Tailwind CSS
├── tsconfig.json                 # Configuración TypeScript
└── README.md                     # Documentación
```

## Componentes Principales

### Autenticación (`auth-store.ts`, `use-auth.ts`)
- Login con usuario y contraseña
- Almacenamiento de tokens JWT en cookies
- Persistencia de sesión
- Logout

### Componentes de UI (`components/ui/`)
- **Button**: Botón con variantes (default, secondary, outline, ghost, link)
- **Card**: Contenedor estilizado con secciones
- **Input**: Campo de texto con validación
- **Select**: Dropdown de opciones
- **Badge**: Etiquetas de estado
- **Spinner**: Indicador de carga
- **Alert**: Alertas de success/error/warning

### Layouts
- **Navbar**: Barra superior con info del usuario y logout
- **Sidebar**: Menú lateral adaptativo por rol
- **DashboardLayout**: Layout principal que combina navbar + sidebar

### Rutas Protegidas
- `ProtectedRoute`: Valida autenticación y rol antes de mostrar contenido
- Redirección automática a login si no está autenticado
- Bloqueo por rol con página de acceso denegado

## Flujo de Datos

```
Frontend Login
    ↓
API /token/ (obtener JWT)
    ↓
Guardar tokens en Zustand + Cookies
    ↓
Redirigir a Dashboard
    ↓
Cargar datos según rol
    ↓
Mostrar contenido específico del rol
```

## Estados Globales (Zustand)

### Auth Store
```typescript
- usuario: Usuario | null
- isLoading: boolean
- error: string | null
- isAuthenticated: boolean
- login(): Promise<void>
- logout(): void
- loadUsuario(): Promise<void>
```

## API Integration (`lib/api.ts`)

Cliente HTTP centralizado con:
- Interceptores para agregar token JWT
- Manejo automático de errores 401
- Timeout configurado
- Base URL desde environment variables

**Métodos principales:**
- login()
- getCurrentUser()
- getUsuarios()
- getServicios()
- getCitas()
- createCita()
- updateCita()
- cancelarCita()
- getPlanes()
- getSuscripciones()

## Utilidades (`lib/utils.ts`)

- `formatDate()` - Formatea fechas en español
- `formatCurrency()` - Formatea moneda en COP
- `getStatusColor()` - Retorna clase Tailwind por estado
- `getStatusLabel()` - Etiqueta legible de estado
- `getRoleLabel()` - Etiqueta legible de rol

## Design Tokens (globals.css)

### Colores
- `--background`: Color de fondo principal
- `--foreground`: Color de texto principal
- `--primary`: Color primario (azul)
- `--secondary`: Color secundario (naranja)
- `--accent`: Color de acento (verde)
- `--destructive`: Color de error (rojo)
- `--muted`: Color apagado
- `--border`: Color de bordes

### Radius
- `--radius`: 0.5rem (border-radius)

## Rutas por Rol

### Cliente
- `/dashboard` - Dashboard principal
- `/buscar-servicios` - Búsqueda de servicios
- `/reservar/[id]` - Crear reserva
- `/reservas` - Mis reservas

### Negocio
- `/dashboard` - Dashboard principal
- `/negocio/servicios` - Gestionar servicios
- `/negocio/reservas` - Reservas recibidas
- `/negocio/suscripcion` - Planes de suscripción

### Administrador
- `/dashboard` - Dashboard principal
- `/admin/usuarios` - Gestión de usuarios
- `/admin/estadisticas` - Estadísticas del sistema
- `/admin/planes` - Gestión de planes

## Dependencias Principales

```json
{
  "react": "^19.1.0",
  "next": "^16.0.0",
  "typescript": "^5.3.3",
  "tailwindcss": "^3.4.1",
  "axios": "^1.7.7",
  "zustand": "^4.4.7",
  "date-fns": "^3.0.0",
  "lucide-react": "^0.376.0",
  "recharts": "^2.10.3",
  "js-cookie": "^3.0.5"
}
```

## Convenciones de Código

### Naming
- Componentes: PascalCase (`MyComponent.tsx`)
- Archivos: kebab-case (`my-file.ts`)
- Variables/funciones: camelCase (`myVariable`)

### Estructura de Componentes
```tsx
'use client'

import { imports }

interface Props {
  prop1: string
  prop2?: number
}

export function MyComponent({ prop1, prop2 }: Props) {
  // lógica
  return (
    // JSX
  )
}
```

### Estilos
- Utilizar clases Tailwind CSS
- Usar `cn()` para merge de clases
- Design tokens para colores y medidas

## Performance

- Code splitting automático
- Images optimizadas
- Lazy loading de componentes
- Caching de datos con SWR cuando sea necesario
- CSS optimizado con Tailwind

## Seguridad

- Tokens JWT en cookies HttpOnly
- CORS configurado en backend
- Validación de rutas protegidas
- Protección contra XSS con React
- Sanitización de inputs

---

**Última actualización**: Febrero 2026
