# 🚀 Guía Rápida de Inicio - Backend GIC

## ⚡ Para Desarrolladores Frontend

### 1. Iniciar el Backend (Solo la primera vez o si hay cambios)

```bash
cd backend
pip3 install -r requirements.txt
python3 manage.py migrate
```

### 2. Ejecutar el Servidor de Desarrollo

```bash
cd backend
python3 manage.py runserver 0.0.0.0:8000
```

✅ Backend corriendo en: **http://localhost:8000**

---

## 🔗 URLs Importantes

| Recurso | URL | Descripción |
|---------|-----|-------------|
| API Base | http://localhost:8000/api/ | Punto de entrada de la API |
| Swagger Docs | http://localhost:8000/api/docs/ | Documentación interactiva |
| Admin Panel | http://localhost:8000/admin/ | Panel de administración |
| Login | POST /api/auth/login/ | Endpoint de autenticación |
| CSRF Token | GET /api/auth/csrf-token/ | Obtener token CSRF |

---

## 🔐 Autenticación Rápida

### Login desde el Frontend

```javascript
// Axios example
const response = await axios.post('http://localhost:8000/api/auth/login/', {
  email: 'usuario@example.com',
  password: 'password123'
});

const { accessToken, refreshToken, user } = response.data;
localStorage.setItem('accessToken', accessToken);
```

### Hacer Peticiones Autenticadas

```javascript
// Agregar token en headers
const response = await axios.get('http://localhost:8000/api/cursos/', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

---

## 📋 Endpoints Principales

### Autenticación
- `POST /api/auth/login/` - Iniciar sesión
- `GET /api/auth/me/` - Usuario actual
- `POST /api/auth/logout/` - Cerrar sesión
- `POST /api/auth/token/refresh/` - Refrescar token

### Recursos
- `GET /api/cursos/` - Listar cursos
- `GET /api/personas/` - Listar personas
- `GET /api/maestros/` - Datos maestros
- `GET /api/pagos/` - Gestión de pagos
- `GET /api/geografia/` - Datos geográficos

Ver `/api/docs/` para documentación completa.

---

## 🔧 Comandos Útiles

### Crear Superusuario (Acceso Admin)
```bash
python3 manage.py createsuperuser
```

### Ver Logs del Servidor
```bash
tail -f /tmp/django_server.log
```

### Ejecutar Tests
```bash
python3 -m pytest
```

### Verificar Estado
```bash
python3 manage.py check
```

---

## ❓ Troubleshooting

### El servidor no inicia
```bash
# Verificar si el puerto está ocupado
lsof -i :8000
# Matar proceso si es necesario
kill -9 <PID>
```

### Error de CORS
✅ Ya configurado para:
- http://localhost:3000
- http://localhost:5173

Si usas otro puerto, contacta al equipo backend.

### Error 401 Unauthorized
- Verifica que el token esté en el header
- El token expira en 60 minutos, usa refresh token

### Error 429 Too Many Requests
- Rate limit alcanzado
- Espera un momento antes de reintentar
- Login: máximo 5 intentos por minuto

---

## 📚 Documentación Completa

Para más detalles, revisa:

- **BACKEND_SETUP.md** - Configuración completa
- **FRONTEND_INTEGRATION.md** - Ejemplos de código React
- **SECURITY_CHECKLIST.md** - Seguridad implementada
- **COMPLETED_STATUS.md** - Estado del proyecto

---

## 💡 Tips

1. **Swagger UI** es tu amigo - prueba los endpoints ahí primero
2. Guarda el **accessToken** en localStorage
3. Intercepta respuestas 401 para refrescar el token automáticamente
4. El backend ya tiene **CORS** configurado para tu frontend
5. Usa **Bearer** token en el header Authorization

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa la documentación en `/api/docs/`
2. Verifica los logs del servidor
3. Consulta BACKEND_SETUP.md
4. Contacta al equipo backend

---

✅ **El backend está 100% funcional y listo para usar**

Última actualización: 2025-11-15
