# Guía Rápida de Seguridad - GIC

## 🚀 Inicio Rápido

### Verificar Estado de Seguridad
```bash
# Desde la raíz del proyecto
python3 scripts/verify_security.py
```

### Ejecutar Checks de Django
```bash
cd backend
python manage.py check --deploy
```

---

## 🔑 Configuración de Producción

### 1. Generar SECRET_KEY Segura
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### 2. Variables de Entorno Obligatorias
```bash
# Copiar y modificar el ejemplo
cp backend/.env.example backend/.env.production

# Editar con valores reales:
DJANGO_SECRET_KEY=<clave-generada-en-paso-1>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=tudominio.com,www.tudominio.com
DB_NAME=gic_db
DB_USER=gic_user
DB_PASSWORD=<password-seguro>
DB_HOST=localhost
EMAIL_HOST_PASSWORD=<api-key-sendgrid>
```

### 3. Instalar Dependencias de Seguridad
```bash
cd backend
pip install argon2-cffi  # Para hashing de contraseñas más seguro
```

### 4. Ejecutar Migraciones
```bash
cd backend
python manage.py migrate
```

Esto creará las tablas necesarias para token blacklist.

---

## 🛡️ Características de Seguridad Implementadas

### Autenticación
- ✅ JWT con tokens de 15 minutos
- ✅ Refresh tokens con rotación automática
- ✅ Blacklist de tokens al logout
- ✅ Rate limiting: 5 intentos/minuto en login

### Protección contra Ataques
- ✅ Brute force: Bloqueo después de 5 intentos fallidos (15 minutos)
- ✅ XSS: Middleware de detección y bloqueo
- ✅ CSRF: Tokens y cookies seguras
- ✅ User enumeration: Mensajes de error genéricos

### Contraseñas
- ✅ Mínimo 12 caracteres
- ✅ Hashing con Argon2 (requiere argon2-cffi)
- ✅ Validadores: similitud, comunes, numéricos

### Headers de Seguridad
- ✅ Content-Security-Policy
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection
- ✅ Strict-Transport-Security (HSTS)
- ✅ Referrer-Policy
- ✅ Permissions-Policy

### Logging
- ✅ Logs separados para seguridad
- ✅ Registro de intentos de login (exitosos y fallidos)
- ✅ Registro de accesos a rutas sensibles
- ✅ Rotación automática (15MB, 10 backups)

---

## 📝 Logs de Seguridad

### Ubicación
```
backend/logs/django.log      # Logs generales
backend/logs/security.log    # Logs de seguridad
```

### Ver Logs en Tiempo Real
```bash
# Logs de seguridad
tail -f backend/logs/security.log

# Filtrar intentos fallidos
grep "Failed login" backend/logs/security.log

# Contar intentos de XSS bloqueados
grep "XSS attempt blocked" backend/logs/security.log | wc -l
```

### Eventos Registrados
- Login exitoso con IP y user ID
- Intentos de login fallidos con contador
- Bloqueos por brute force
- Accesos a rutas sensibles (/api/auth/*, /api/usuarios/*, /api/pagos/*, /admin/*)
- Errores 401/403 (autenticación/autorización)
- Intentos de XSS bloqueados

---

## 🔍 Testing de Seguridad

### Test Manual de Rate Limiting
```bash
# Hacer 6 intentos de login fallidos rápidamente
for i in {1..6}; do 
  curl -X POST http://localhost:8000/api/auth/login/ \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'; 
  echo ""
done

# El 6to debe retornar 429 (Too Many Requests)
```

### Test de Headers de Seguridad
```bash
# En desarrollo
curl -I http://localhost:8000/api/

# En producción
curl -I https://tudominio.com/api/

# Verificar que incluya:
# Content-Security-Policy
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
```

### Test de Token Blacklist
```bash
# 1. Login y obtener tokens
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@test.com","password":"password123"}'

# 2. Logout con refresh token
curl -X POST http://localhost:8000/api/auth/logout/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"refresh_token":"<refresh_token>"}'

# 3. Intentar usar el refresh token - debe fallar
curl -X POST http://localhost:8000/api/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh":"<refresh_token>"}'
```

---

## 🚨 Respuesta a Incidentes

### Usuario Bloqueado por Intentos Fallidos
El bloqueo es automático y temporal (15 minutos). El usuario debe:
1. Esperar 15 minutos, o
2. Contactar al administrador para reset manual

### Reset Manual de Bloqueo (Django Shell)
```bash
cd backend
python manage.py shell

>>> from django.core.cache import cache
>>> # Para un email específico
>>> cache.delete('login_attempts_email_usuario@example.com')
>>> # Para una IP específica
>>> cache.delete('login_attempts_ip_192.168.1.1')
```

### Limpiar Tokens Blacklist Expirados
```bash
cd backend
python manage.py flushexpiredtokens
```

Ejecutar periódicamente (recomendado: diario mediante cron).

---

## 📊 Monitoreo en Producción

### Métricas Clave a Monitorear
1. **Intentos fallidos de login**: `grep "Failed login" logs/security.log | wc -l`
2. **Bloqueos por brute force**: `grep "too many failed attempts" logs/security.log | wc -l`
3. **Intentos XSS**: `grep "XSS attempt blocked" logs/security.log | wc -l`
4. **Errores 401/403**: `grep "Authentication/Authorization failure" logs/security.log | wc -l`

### Alertas Recomendadas
- Más de 100 intentos fallidos de login por hora
- Más de 10 intentos de XSS por hora
- Patrones de ataque distribuido (muchas IPs diferentes)
- Acceso no autorizado a datos de menores

---

## ⚙️ Configuraciones Importantes

### Timeouts
- **Access Token**: 15 minutos
- **Refresh Token**: 7 días
- **Lockout por brute force**: 15 minutos
- **Session cookie**: 24 horas
- **Password reset**: 1 hora

### Rate Limits
- **Login anónimo**: 5 intentos/minuto
- **API anónima**: 100 requests/hora
- **API autenticada**: 1000 requests/hora

### Cookies
- **HttpOnly**: Sí (previene acceso desde JavaScript)
- **Secure**: Sí en producción (solo HTTPS)
- **SameSite**: Lax (previene CSRF)

---

## 🔄 Mantenimiento Regular

### Semanal
- [ ] Revisar logs de seguridad
- [ ] Verificar intentos sospechosos
- [ ] Limpiar tokens blacklist: `python manage.py flushexpiredtokens`

### Mensual
- [ ] Actualizar dependencias: `pip list --outdated`
- [ ] Revisar permisos de usuarios
- [ ] Backup de logs importantes

### Trimestral
- [ ] Ejecutar `python manage.py check --deploy`
- [ ] Ejecutar `scripts/verify_security.py`
- [ ] Revisar y actualizar validadores de contraseña si necesario
- [ ] Auditoría de accesos a datos sensibles

### Anual
- [ ] Rotar SECRET_KEY
- [ ] Auditoría de seguridad externa (recomendado)
- [ ] Revisar y actualizar políticas de seguridad

---

## 📚 Recursos Adicionales

### Documentación
- `SECURITY_AUDIT_2025.md` - Auditoría completa de seguridad
- `SECURITY_FIXES.md` - Detalles de correcciones implementadas
- `backend/.env.example` - Template de configuración

### Librerías Utilizadas
- `djangorestframework-simplejwt` - JWT authentication
- `django-cors-headers` - CORS configuration
- `argon2-cffi` - Password hashing (opcional pero recomendado)

### Enlaces Útiles
- [Django Security Best Practices](https://docs.djangoproject.com/en/stable/topics/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

---

## 💡 Tips de Desarrollo

### Desarrollo Local
- DEBUG=True está permitido
- CORS_ALLOW_ALL=True está permitido
- Logs se muestran en consola
- SQLite es suficiente

### Staging/Producción
- DEBUG=False obligatorio
- CORS_ALLOWED_ORIGINS específico
- Logs en archivos con rotación
- MySQL/PostgreSQL recomendado
- SSL/HTTPS obligatorio

### Git
- **NUNCA** commitear `.env` con credenciales reales
- Usar `.env.example` como template
- Los logs (`backend/logs/`) ya están en `.gitignore`

---

## 🆘 Soporte

### Reportar Vulnerabilidad
Email: security@gic.scouts.cl
Respuesta: < 48 horas laborales

### Preguntas Técnicas
Consultar `SECURITY_AUDIT_2025.md` para detalles técnicos completos.

---

**Última actualización:** 17 de Noviembre, 2025  
**Versión:** 1.0.0
