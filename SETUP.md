# Instrucciones de Setup - ReservaSaaS

## Descripción General

ReservaSaaS es una plataforma integral de gestión de reservas y citas con:
- **Backend**: Django REST Framework (Python)
- **Frontend**: Next.js 16 (TypeScript + React)
- **Base de Datos**: SQLite (desarrollo) / PostgreSQL (producción)

## Estructura del Proyecto

```
/
├── backend/          # API Django REST
├── frontend/         # Frontend Next.js 16
└── docker-compose.yml
```

## Prerequisitos

- Python 3.9+
- Node.js 18+
- npm o yarn
- git

## Setup Backend

### 1. Navegar a la carpeta backend

```bash
cd backend
```

### 2. Crear entorno virtual

```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

### 3. Instalar dependencias

```bash
pip install -r requisitos.txt
```

### 4. Aplicar migraciones

```bash
python manage.py migrate
```

### 5. Crear superusuario (admin)

```bash
python manage.py createsuperuser
```

Alternativamente, usa las credenciales de demo:
- Usuario: admin
- Contraseña: admin123

### 6. Ejecutar servidor

```bash
python manage.py runserver
```

El backend estará disponible en `http://localhost:8000`

API Documentation: `http://localhost:8000/api/`
Admin Panel: `http://localhost:8000/admin/`

## Setup Frontend

### 1. Navegar a la carpeta frontend

```bash
cd frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 4. Ejecutar servidor de desarrollo

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## Credenciales de Demo

Una vez que el backend esté corriendo, usa estas credenciales:

### Admin
- Usuario: admin
- Contraseña: admin123
- Rol: Administrador

### Negocio
- Usuario: negocio1
- Contraseña: negocio123
- Rol: Negocio (puede crear servicios, recibir reservas)

### Cliente
- Usuario: cliente1
- Contraseña: cliente123
- Rol: Cliente (puede buscar servicios y hacer reservas)

## Funcionalidades por Rol

### Dashboard Cliente
- ✅ Buscar servicios disponibles
- ✅ Crear reservas
- ✅ Ver mis reservas
- ✅ Cancelar reservas
- ✅ Estadísticas personales

### Dashboard Negocio
- ✅ Crear y gestionar servicios
- ✅ Ver reservas recibidas
- ✅ Confirmar/rechazar reservas
- ✅ Gestionar suscripciones
- ✅ Ver planes disponibles
- ✅ Estadísticas de negocio

### Dashboard Administrador
- ✅ Gestión de usuarios
- ✅ Activar/desactivar usuarios
- ✅ Filtrar por rol
- ✅ Estadísticas del sistema
- ✅ Visualización de gráficas
- ✅ Gestión de planes

## Endpoints Principales API

### Autenticación
- `POST /api/token/` - Obtener tokens JWT
- `POST /api/token/refresh/` - Refrescar token
- `GET /api/usuarios/me/` - Info del usuario actual

### Usuarios
- `GET /api/usuarios/` - Listar usuarios (admin)
- `PATCH /api/usuarios/{id}/` - Actualizar usuario

### Servicios
- `GET /api/citas/servicios/` - Listar servicios
- `POST /api/citas/servicios/` - Crear servicio
- `PATCH /api/citas/servicios/{id}/` - Actualizar servicio
- `DELETE /api/citas/servicios/{id}/` - Eliminar servicio

### Citas/Reservas
- `GET /api/citas/reserva/` - Listar citas
- `POST /api/citas/reserva/` - Crear cita
- `PATCH /api/citas/reserva/{id}/` - Actualizar cita
- `GET /api/citas/reserva/?fecha=YYYY-MM-DD` - Filtrar por fecha

### Planes y Suscripciones
- `GET /api/pagos/planes/` - Listar planes
- `GET /api/pagos/suscripciones/` - Listar suscripciones
- `POST /api/pagos/suscripciones/` - Crear suscripción

## Tecnologías Utilizadas

### Backend
- Django 5.2
- Django REST Framework
- django-filter
- djangorestframework-simplejwt
- python-dateutil

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Axios
- Lucide React (iconos)
- Recharts (gráficas)
- date-fns

## Development Workflow

1. **Inicia el backend**:
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **En otra terminal, inicia el frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Abre en tu navegador**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Admin Django: http://localhost:8000/admin

## Build para Producción

### Backend
```bash
cd backend
python manage.py collectstatic
gunicorn configuraciones.wsgi
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## Notas Importantes

1. Los tokens JWT expiran en 24 horas
2. Las cookies son seguras (HttpOnly)
3. Las rutas están protegidas por autenticación y rol
4. La base de datos SQLite es solo para desarrollo
5. Para producción usa PostgreSQL o MySQL
6. Todos los endpoints requieren el header `Authorization: Bearer <token>`

## Troubleshooting

### El frontend no se conecta al backend
- Verifica que el backend esté corriendo en `http://localhost:8000`
- Confirma que la variable `NEXT_PUBLIC_API_URL` está bien configurada
- Revisa la consola del navegador para errores de CORS

### Error de migraciones
```bash
python manage.py migrate --run-syncdb
```

### Limpiar base de datos
```bash
rm backend/db.sqlite3
python manage.py migrate
```

## Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

---

**Última actualización**: Febrero 2026
