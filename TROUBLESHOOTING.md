# Guía de Solución de Problemas - Plataforma GIC

Esta guía ayuda a resolver los problemas más comunes al iniciar la plataforma GIC.

## Problema: "Failed to fetch" al hacer login

### Síntomas
- El frontend muestra el error "failed to fetch" o "Credenciales inválidas"
- No puedes iniciar sesión con las credenciales de prueba
- El navegador muestra errores de conexión en la consola

### Causas Comunes

#### 1. Backend no está corriendo
**Solución:** Asegúrate de que el backend Django esté corriendo en `http://localhost:8000`

```bash
# En el directorio backend/
cd backend
python manage.py runserver 8000
```

Verifica que puedas acceder a: http://localhost:8000/api/docs/

#### 2. Configuración incorrecta del backend
**Problema:** El backend está usando configuración de producción en lugar de desarrollo.

**Solución:** Copia el archivo de configuración de desarrollo:

```bash
# En el directorio backend/
cd backend
cp .env.development .env
```

El archivo `.env` debe tener:
- `DJANGO_DEBUG=True`
- `SECURE_SSL_REDIRECT=False`
- `CORS_ALLOW_ALL=True`

#### 3. Usuarios de prueba no existen
**Problema:** Los usuarios de prueba no están creados en la base de datos.

**Solución:** Ejecuta el comando de creación de usuarios:

```bash
cd backend
python manage.py create_test_users
```

Esto creará:
- `admin@test.com` / `Admin123!`
- `coordinador@test.com` / `Coord123!`
- `dirigente@test.com` / `Dirig123!`

#### 4. URL del API incorrecta en el frontend
**Problema:** El frontend está intentando conectarse a una URL incorrecta.

**Solución:** Verifica el archivo `.env` en el directorio `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Si modificas este archivo, reinicia el servidor de desarrollo del frontend.

#### 5. Problemas de CORS
**Problema:** El navegador bloquea las peticiones por políticas de CORS.

**Solución:** Asegúrate de que en `backend/.env` tengas:

```env
CORS_ALLOW_ALL=True
```

Y reinicia el backend.

## Inicio Rápido Automatizado

### Opción 1: Script de inicio (Linux/Mac)
```bash
./start-dev.sh
```

### Opción 2: Script de inicio (Windows PowerShell)
```powershell
.\start-dev.ps1
```

Estos scripts automáticamente:
1. ✅ Configuran el archivo `.env` correcto
2. ✅ Instalan dependencias
3. ✅ Crean la base de datos
4. ✅ Crean usuarios de prueba
5. ✅ Inician backend y frontend

## Inicio Manual

### Backend

```bash
# 1. Ir al directorio backend
cd backend

# 2. Configurar entorno de desarrollo
cp .env.development .env

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Aplicar migraciones
python manage.py migrate

# 5. Crear usuarios de prueba
python manage.py create_test_users

# 6. Iniciar servidor
python manage.py runserver 8000
```

### Frontend

```bash
# 1. Ir al directorio frontend
cd frontend

# 2. Instalar dependencias (solo la primera vez)
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: http://localhost:3000

## Credenciales de Prueba

Usa estas credenciales para probar el login:

| Email | Password | Rol |
|-------|----------|-----|
| `admin@test.com` | `Admin123!` | Administrador |
| `coordinador@test.com` | `Coord123!` | Coordinador |
| `dirigente@test.com` | `Dirig123!` | Dirigente |

## Verificación del Backend

Para verificar que el backend está funcionando correctamente:

### 1. Verificar que el servidor responde
```bash
curl http://localhost:8000/api/docs/
```

Deberías ver la documentación de la API (Swagger).

### 2. Probar el endpoint de login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123!"}'
```

Deberías recibir una respuesta JSON con tokens de acceso:
```json
{
  "success": true,
  "accessToken": "...",
  "refreshToken": "...",
  "user": {...}
}
```

### 3. Verificar CORS
```bash
curl -I http://localhost:8000/api/auth/login/ \
  -H "Origin: http://localhost:3000"
```

Deberías ver headers de CORS:
```
access-control-allow-origin: http://localhost:3000
access-control-allow-credentials: true
```

## Verificación del Frontend

### 1. Abrir consola del navegador
1. Abre http://localhost:3000 en tu navegador
2. Presiona F12 para abrir las herramientas de desarrollo
3. Ve a la pestaña "Console" (Consola)
4. Ve a la pestaña "Network" (Red)

### 2. Intenta hacer login
1. Usa una de las credenciales de prueba
2. Observa la pestaña "Network" para ver las peticiones
3. Si ves errores de CORS o de conexión, verifica que el backend esté corriendo

## Problemas Comunes Adicionales

### Puerto ya en uso
Si ves un error como "Address already in use" o "port 8000 is already in use":

```bash
# En Linux/Mac
lsof -ti:8000 | xargs kill -9

# En Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process
```

### Base de datos corrupta
Si la base de datos tiene problemas:

```bash
cd backend
rm db.sqlite3
python manage.py migrate
python manage.py create_test_users
```

### Dependencias desactualizadas
```bash
# Backend
cd backend
pip install -r requirements.txt --upgrade

# Frontend
cd frontend
npm install
```

## Obtener Ayuda

Si ninguna de estas soluciones funciona:

1. Verifica los logs del backend: `/tmp/django.log` (si usaste el script de inicio)
2. Verifica los logs del frontend: `/tmp/vite.log` (si usaste el script de inicio)
3. Verifica la consola del navegador (F12 → Console)
4. Revisa la documentación completa en [README.md](README.md)
5. Abre un issue en el repositorio con:
   - Descripción del problema
   - Pasos para reproducirlo
   - Logs relevantes
   - Sistema operativo y versiones de Python/Node.js

## Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] ✅ Backend corriendo en http://localhost:8000
- [ ] ✅ Frontend corriendo en http://localhost:3000
- [ ] ✅ Archivo `backend/.env` configurado correctamente
- [ ] ✅ Usuarios de prueba creados
- [ ] ✅ CORS habilitado en el backend
- [ ] ✅ Dependencias instaladas (backend y frontend)
- [ ] ✅ Sin errores en logs del backend
- [ ] ✅ Sin errores en consola del navegador
