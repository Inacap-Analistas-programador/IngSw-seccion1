# Documentación de Seguridad - Frontend GIC

## Resumen de Mejoras de Seguridad Implementadas

Este documento describe las medidas de seguridad implementadas en el frontend de la plataforma GIC (Guías y Scouts de Chile) para proteger datos sensibles de menores y dirigentes.

---

## 1. Autenticación Segura con JWT

### Implementación
- **Archivo**: `src/services/authService.js`
- **Características**:
  - Tokens JWT almacenados en `sessionStorage` (más seguro que `localStorage`)
  - Validación de expiración de tokens en el cliente
  - Tokens de acceso con validez de 15 minutos
  - Tokens de refresco con validez de 7 días
  - Rotación automática de tokens de refresco

### Protección contra Brute Force
- Máximo de 5 intentos de login fallidos
- Bloqueo de cuenta por 1 hora después de exceder intentos
- Registro de intentos fallidos en `sessionStorage`

### Timeout de Sesión
- Sesión expira automáticamente después de 15 minutos de inactividad
- Monitoreo de actividad del usuario (mouse, teclado, scroll)
- Redirección automática al login cuando expira la sesión

---

## 2. Sanitización y Validación de Entradas

### Implementación
- **Archivo**: `src/utils/inputSanitizer.js`
- **Funciones disponibles**:
  - `sanitizeText()` - Elimina HTML y scripts de texto general
  - `sanitizeEmail()` - Valida y normaliza emails
  - `sanitizeRUT()` - Valida y formatea RUTs chilenos
  - `sanitizePhone()` - Valida números de teléfono
  - `sanitizeName()` - Valida nombres con caracteres especiales latinos
  - `sanitizeAddress()` - Limpia direcciones permitiendo caracteres comunes
  - `sanitizeDate()` - Valida formato YYYY-MM-DD
  - `validatePassword()` - Valida complejidad de contraseñas

### Protección XSS
- Detección de patrones peligrosos:
  - `<script>` tags
  - `javascript:` URLs
  - Event handlers (`onclick`, `onerror`, etc.)
  - `<iframe>`, `<embed>`, `<object>` tags
  - `eval()` y similares
- Escape de caracteres especiales HTML
- Validación estricta de formatos

---

## 3. Cliente HTTP Seguro

### Implementación
- **Archivo**: `src/services/httpClient.js`
- **Características**:
  - Interceptores de peticiones para agregar tokens JWT
  - Protección CSRF con tokens en headers
  - Manejo automático de tokens expirados
  - Reintento automático en errores de CSRF
  - Credentials: 'include' para cookies seguras

### Headers de Seguridad
Todos los requests incluyen:
- `Authorization: Bearer <token>`
- `X-CSRF-Token: <csrf_token>`
- `Content-Type: application/json`

---

## 4. Headers de Seguridad HTTP

### Content Security Policy (CSP)
Configurado en `index.html`:
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
connect-src 'self' http://localhost:8000 https:;
frame-ancestors 'none';
```

### Otros Headers
- `X-Content-Type-Options: nosniff` - Previene MIME sniffing
- `X-Frame-Options: DENY` - Previene clickjacking
- `X-XSS-Protection: 1; mode=block` - Habilita filtro XSS del navegador
- `Referrer-Policy: strict-origin-when-cross-origin` - Controla información de referrer
- `Permissions-Policy` - Deshabilita geolocation, microphone, camera

---

## 5. Rutas Protegidas

### Implementación
- **Archivo**: `src/components/auth/ProtectedRoute.jsx`
- **Uso**:
```jsx
<Route 
  path="/dashboard/*" 
  element={
    <ProtectedRoute requiredRole="coordinador">
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Características
- Verificación de autenticación antes de renderizar
- Control de acceso basado en roles
- Redirección automática al login si no autenticado
- Redirección a página de acceso denegado si rol incorrecto

---

## 6. Auditoría y Logging

### Sistema de Auditoría
Implementado en `authService.js`:
- Registro de eventos críticos:
  - `LOGIN_SUCCESS` - Login exitoso
  - `LOGIN_FAILED` - Login fallido
  - `LOGOUT` - Cierre de sesión
  - `ACCOUNT_LOCKED` - Cuenta bloqueada
  - `SESSION_TIMEOUT` - Sesión expirada

### Información Registrada
- Acción realizada
- Timestamp
- User Agent
- Email del usuario
- Detalles adicionales

### Almacenamiento
- Logs guardados en `sessionStorage` (máximo 50 entradas)
- TODO: Enviar logs al backend para almacenamiento permanente

---

## 7. Protección de Datos de Menores

### Validación de Edad
- Función `validateMinorAge()` determina si es menor de edad
- Requiere consentimiento parental para menores
- Protección especial para datos de menores de 18 años

### Campos Sensibles Protegidos
- RUT
- Fecha de nacimiento
- Dirección
- Teléfono
- Datos médicos
- Contacto de emergencia

---

## 8. Configuración de Producción

### Variables de Entorno
Archivo `.env.example` proporciona plantilla:
```
VITE_API_BASE_URL=https://api.gic.scouts.cl
VITE_APP_MODE=production
VITE_SESSION_TIMEOUT=15
VITE_MAX_LOGIN_ATTEMPTS=5
VITE_ENABLE_CSRF=true
```

### HTTPS
- API Base URL usa HTTPS en producción automáticamente
- Configurado en `src/config/constants.js`
- Fallback a localhost en desarrollo

### Build de Producción
- Source maps deshabilitados para evitar exposición de código
- Code splitting para reducir superficie de ataque
- Chunks separados por vendor para mejor cacheo

---

## 9. Mejores Prácticas Implementadas

### Almacenamiento
- ✅ `sessionStorage` en lugar de `localStorage` para datos sensibles
- ✅ Tokens nunca almacenados en cookies sin `httpOnly`
- ✅ Limpieza automática de datos al cerrar sesión

### Contraseñas
- ✅ Mínimo 8 caracteres
- ✅ Requiere mayúsculas, minúsculas, números y símbolos
- ✅ Nunca se almacenan en el cliente
- ✅ Tipo `password` en inputs para ocultar texto

### Formularios
- ✅ Validación en cliente Y servidor
- ✅ Sanitización de todas las entradas
- ✅ Atributos `required`, `minLength`, `maxLength`
- ✅ Prevención de doble submit con estado `loading`

### Comunicación
- ✅ HTTPS en producción
- ✅ Credentials: 'include' para cookies
- ✅ Validación de respuestas del servidor
- ✅ Manejo de errores sin exponer detalles internos

---

## 10. Pendientes y Recomendaciones

### Backend Requerido
- [ ] Implementar endpoint `/api/auth/login` con JWT real
- [ ] Implementar endpoint `/api/csrf-token`
- [ ] Implementar endpoint `/api/auth/refresh` para renovar tokens
- [ ] Implementar endpoint `/api/audit/logs` para almacenar logs
- [ ] Configurar CORS correctamente
- [ ] Implementar rate limiting en el backend

### Frontend
- [ ] Implementar MFA (autenticación de dos factores)
- [ ] Agregar captcha en formulario de login
- [ ] Implementar detección de bots
- [ ] Agregar monitoreo con Sentry o similar
- [ ] Implementar Service Worker para cacheo seguro
- [ ] Agregar tests de seguridad automatizados

### Infraestructura
- [ ] Configurar WAF (Web Application Firewall)
- [ ] Implementar DDoS protection
- [ ] Configurar CDN con headers de seguridad
- [ ] Configurar certificados SSL/TLS válidos
- [ ] Implementar monitoreo de seguridad en tiempo real

---

## 11. Testing de Seguridad

### Tests Recomendados
```bash
# Escaneo de vulnerabilidades en dependencias
npm audit

# Análisis de código estático
npm run lint

# Tests de penetración (usar herramientas como OWASP ZAP)
# Tests de XSS, CSRF, SQL Injection, etc.
```

### Checklist de Seguridad Pre-Deploy
- [ ] Todas las dependencias actualizadas
- [ ] Sin vulnerabilidades en `npm audit`
- [ ] Variables de entorno configuradas
- [ ] HTTPS habilitado
- [ ] CSP configurado correctamente
- [ ] Source maps deshabilitados
- [ ] Credenciales de desarrollo removidas
- [ ] Logs de desarrollo deshabilitados

---

## 12. Contacto de Seguridad

Para reportar vulnerabilidades de seguridad:
- Email: security@scouts.cl
- No publicar vulnerabilidades públicamente
- Tiempo de respuesta esperado: 48 horas

---

## Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Ley de Protección de Datos Personales Chile](https://www.bcn.cl/leychile/navegar?idNorma=141599)

---

**Última actualización**: 2024-11-15  
**Versión**: 1.0.0  
**Responsable**: Equipo de Desarrollo GIC
