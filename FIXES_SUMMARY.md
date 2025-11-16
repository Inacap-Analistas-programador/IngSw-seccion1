# Resumen de Correcciones - Login con Credenciales de Muestra

## Problema Original
El usuario reportó que no podía iniciar sesión con las credenciales de muestra. El backend mostraba el error "failed to fetch", lo que sugería problemas de configuración y conectividad entre el frontend y backend.

## Causas Raíz Identificadas

### 1. Configuración del Backend Incorrecta ❌
**Problema**: El archivo `backend/.env.example` tenía configuraciones de producción:
- `DJANGO_DEBUG=False` - Modo producción activo
- `SECURE_SSL_REDIRECT=True` - Forzaba HTTPS en desarrollo
- Esto causaba que las peticiones desde el frontend fallaran

**Solución**: ✅
- Creado `backend/.env` basado en `.env.development` con configuración correcta
- Actualizado `start-dev.sh` para copiar automáticamente `.env.development` a `.env`
- Creado `start-dev.ps1` para usuarios de Windows PowerShell

### 2. Bug en Creación de Usuarios de Prueba ❌
**Problema**: El comando `create_test_users` verificaba solo el username pero no el email, causando errores de constraint de base de datos al crear usuarios duplicados.

**Solución**: ✅
- Modificado `backend/usuarios/management/commands/create_test_users.py`
- Ahora verifica tanto username como email antes de crear usuarios
- Los scripts de inicio verifican y crean usuarios automáticamente

### 3. Credenciales Incorrectas en Página de Login ❌
**Problema**: La página de login mostraba credenciales incorrectas:
- Mostraba: `coordinador@scout.cl / Scout2024!` (no existe)
- Faltaban las otras credenciales de prueba

**Solución**: ✅
- Actualizado `frontend/src/pages/CoordinatorLogin.jsx`
- Ahora muestra las 3 credenciales válidas:
  - `admin@test.com / Admin123!`
  - `coordinador@test.com / Coord123!`
  - `dirigente@test.com / Dirig123!`

### 4. Falta de Documentación para Troubleshooting ❌
**Problema**: No había una guía clara para resolver problemas comunes de inicio.

**Solución**: ✅
- Creado `TROUBLESHOOTING.md` con guía completa de solución de problemas
- Incluye verificaciones paso a paso
- Comandos para diagnosticar problemas comunes

## Verificación de la Solución

### Backend ✅ Funcionando
```bash
$ curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123!"}'

{
  "success": true,
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": 1,
    "email": "admin@test.com",
    "rol": "Administrador"
  }
}
```

### Usuarios de Prueba ✅ Todos Creados
- ✅ admin@test.com / Admin123! (Administrador)
- ✅ coordinador@test.com / Coord123! (Coordinador)
- ✅ dirigente@test.com / Dirig123! (Dirigente)

### CORS ✅ Configurado Correctamente
```bash
$ curl -I http://localhost:8000/api/auth/login/ -H "Origin: http://localhost:3000"

access-control-allow-origin: http://localhost:3000
access-control-allow-credentials: true
```

### Frontend ✅ Mostrando Credenciales Correctas
La página de login ahora muestra todas las credenciales de prueba disponibles.

## Archivos Modificados

1. **backend/.env** (NUEVO)
   - Configuración de desarrollo con advertencia clara
   - DEBUG=True, SSL_REDIRECT=False, CORS_ALLOW_ALL=True

2. **backend/usuarios/management/commands/create_test_users.py**
   - Agregada verificación de email además de username
   - Previene errores de constraint duplicados

3. **frontend/src/pages/CoordinatorLogin.jsx**
   - Actualizada sección de credenciales de desarrollo
   - Muestra las 3 credenciales válidas

4. **start-dev.sh**
   - Agrega configuración automática de .env
   - Crea usuarios de prueba automáticamente
   - Muestra credenciales en la información de inicio

5. **start-dev.ps1** (NUEVO)
   - Versión PowerShell del script de inicio para Windows
   - Misma funcionalidad que start-dev.sh

6. **TROUBLESHOOTING.md** (NUEVO)
   - Guía completa de solución de problemas
   - Pasos de verificación
   - Comandos de diagnóstico

## Cómo Usar la Solución

### Opción 1: Inicio Automático (Recomendado)

**Linux/Mac:**
```bash
./start-dev.sh
```

**Windows PowerShell:**
```powershell
.\start-dev.ps1
```

Los scripts automáticamente:
1. ✅ Configuran el archivo .env correcto
2. ✅ Instalan dependencias
3. ✅ Crean usuarios de prueba
4. ✅ Inician backend (puerto 8000) y frontend (puerto 3000)
5. ✅ Muestran las credenciales de prueba

### Opción 2: Inicio Manual

**Backend:**
```bash
cd backend
cp .env.development .env
pip install -r requirements.txt
python manage.py migrate
python manage.py create_test_users
python manage.py runserver 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Acceso a la Aplicación
1. Abre http://localhost:3000 en tu navegador
2. Ve a la página de login de coordinador
3. Usa cualquiera de las credenciales mostradas en pantalla

## Testing

Todas las credenciales han sido probadas y verificadas:

```bash
# Test admin
✅ admin@test.com / Admin123! → Login exitoso

# Test coordinador
✅ coordinador@test.com / Coord123! → Login exitoso

# Test dirigente
✅ dirigente@test.com / Dirig123! → Login exitoso
```

## Resultado Final

✅ **Problema resuelto completamente**

Los usuarios ahora pueden:
1. Iniciar la aplicación fácilmente con los scripts automatizados
2. Ver las credenciales correctas en la página de login
3. Iniciar sesión exitosamente con cualquiera de las 3 cuentas de prueba
4. Acceder a la documentación de troubleshooting si tienen problemas

El mensaje de error "failed to fetch" ya no debería aparecer cuando:
- Se usa el script de inicio automático, o
- Se configura manualmente el backend con .env.development
