# Quick Start - ReservaSaaS

## Inicio Rápido en 5 Minutos

### Terminal 1: Backend

```bash
# Navegar a backend
cd backend

# Activar entorno virtual
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate  # Windows

# Ejecutar servidor
python manage.py runserver
```

✅ Backend listo en: `http://localhost:8000`

### Terminal 2: Frontend

```bash
# En otra terminal, navegar a frontend
cd frontend

# Instalar dependencias (primera vez)
npm install

# Ejecutar servidor
npm run dev
```

✅ Frontend listo en: `http://localhost:3000`

## Primero Acceso

### 1. Ir a http://localhost:3000
### 2. Se redirige automáticamente a `/login`
### 3. Usar credenciales de demo:

**Como Cliente:**
- Usuario: `cliente1`
- Contraseña: `cliente123`

**Como Negocio:**
- Usuario: `negocio1`
- Contraseña: `negocio123`

**Como Administrador:**
- Usuario: `admin`
- Contraseña: `admin123`

## Lo que Verás

### Cliente
- Dashboard con estadísticas
- Búsqueda de servicios disponibles
- Crear nueva reserva
- Ver historial de reservas

### Negocio
- Dashboard de negocio
- Crear y editar servicios
- Ver reservas recibidas
- Gestionar suscripciones

### Admin
- Dashboard con métricas globales
- Gestión de todos los usuarios
- Estadísticas y gráficos
- Gestión de planes

## Comandos Útiles

### Backend

```bash
# Crear nuevo usuario
python manage.py createsuperuser

# Limpiar migraciones
python manage.py migrate --run-syncdb

# Shell interactivo
python manage.py shell

# Resetear base de datos
rm db.sqlite3
python manage.py migrate
```

### Frontend

```bash
# Build para producción
npm run build

# Ejecutar versión producción
npm start

# Linting
npm run lint

# Limpiar node_modules
rm -rf node_modules
npm install
```

## Estructura de Carpetas (Conceptual)

```
ReservaSaaS/
├── Backend (Django)
│   └── APIs REST
├── Frontend (Next.js)
│   ├── Login
│   ├── Dashboard Cliente
│   ├── Dashboard Negocio
│   └── Dashboard Admin
└── Base de Datos (SQLite)
```

## Flujo Principal

```
1. Usuario accede a http://localhost:3000
         ↓
2. Ingresa credenciales en /login
         ↓
3. Backend valida en POST /api/token/
         ↓
4. Frontend guarda token JWT
         ↓
5. Frontend carga datos según rol
         ↓
6. Usuario ve dashboard personalizado
```

## Características por Rol

### 👤 Cliente
- Buscar servicios
- Crear reservas
- Cancelar reservas
- Ver historial

### 🏢 Negocio
- Crear servicios
- Ver reservas recibidas
- Confirmar/rechazar reservas
- Elegir plan de suscripción

### 👨‍💼 Administrador
- Ver todos los usuarios
- Activar/desactivar usuarios
- Ver estadísticas del sistema
- Gestionar planes

## Errores Comunes

### "Cannot reach backend"
- ✅ Verifica que backend esté en `http://localhost:8000`
- ✅ Revisa `.env.local` tenga `NEXT_PUBLIC_API_URL=http://localhost:8000/api`

### "Las dependencias no instalan"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Base de datos corrupta"
```bash
cd backend
rm db.sqlite3
python manage.py migrate
```

## Próximos Pasos

1. **Explorar el código**: Revisa `/app` para ver las páginas
2. **Entender la API**: Visita `http://localhost:8000/api/`
3. **Leer documentación**:
   - `SETUP.md` - Setup detallado
   - `ESTRUCTURA_FRONTEND.md` - Estructura del código
   - `frontend/README.md` - Documentación del frontend

## Recursos Útiles

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [TypeScript](https://www.typescriptlang.org/docs/)

## Soporte

Contacta al equipo de desarrollo para preguntas o problemas.

---

**¡Listo para empezar! 🚀**
