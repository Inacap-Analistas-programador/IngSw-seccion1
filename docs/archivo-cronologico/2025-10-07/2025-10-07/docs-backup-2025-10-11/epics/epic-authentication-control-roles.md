# Epic: Autenticación y Control de Roles (SGICS-E-AUTH)

Tags: epic, auth, backend, sprint2

## Detalles del Epic
- **Impulsor:** Equipo de Desarrollo
- **Aprobador:** @RICARDO CRISTOBAL SANHUEZA ACUNA
- **Personas informadas:** Todos los equipos ()
- **Objetivo:** Entregar una capa de seguridad robusta que permita autenticación y autorización básica para el resto de módulos (preinscripción, pagos, dashboard).
- **Fecha de vencimiento:** 20 de octubre del 2025
- **Principales resultados:** Sistema de autenticación JWT completo, control de roles RBAC, integración frontend básica para rutas privadas.
- **Estado:** En Progreso

## Planteamiento del problema y el alcance
### Debe tener:
- Implementación de autenticación JWT con SimpleJWT (login, refresh, logout).
- Sistema de control de roles (RBAC) con modelos Role y Permission.
- Endpoints para gestión de roles y asignación a usuarios.
- Integración básica frontend (store/auth) para rutas privadas.
- Tests unitarios e integración para todos los endpoints de auth.

### Podría tener:
- Revocación manual de tokens (blacklist avanzada).
- Logs de auditoría para acciones de autenticación.
- Integración con proveedores externos (OAuth2/SAML).
- Interface de administración para gestión de roles.

### Fuera del alcance:
- Autenticación multi-factor (MFA) avanzada.
- Integración con Active Directory o LDAP.
- Sistema de permisos granulares a nivel de campo.
- Dashboard completo de administración de usuarios.

## Resumen
Este epic agrupa todo lo necesario para implementar autenticación basada en JWT y un sistema de control de roles (RBAC) en SGICS. Incluye endpoints de login/refresh/logout, gestión de roles y permisos, y la integración mínima necesaria con el frontend (store/auth) para que las rutas privadas funcionen correctamente.

Objetivo: Entregar una capa de seguridad robusta que permita autenticación y autorización básica para el resto de módulos (preinscripción, pagos, dashboard).

Prioridad: Alta
Riesgo: Alto (manejo de credenciales y tokens)

## Planteamiento del problema
Creemos que implementar autenticación JWT y control de roles RBAC fortalecerá la seguridad del sistema SGICS, y estamos en lo cierto de que esto sucederá al prevenir accesos no autorizados y escaladas de privilegios en módulos críticos como preinscripción y pagos.

---

## Historias incluidas
| Key | Título | Assignee | Story Points | Estado |
|---|---|---:|---:|---:|
| SGICS-201 | Implementar login JWT (SimpleJWT) | Nicolas Irribarra | 5 | To Do |
| SGICS-202 | Refresh y logout | Lucas Guerrero | 2 | To Do |
| SGICS-203 | Gestión de roles y permisos | Axel Villa | 5 | To Do |

---

## Detalle de historias / Acceptance Criteria

### SGICS-201 — Implementar login JWT (SimpleJWT)
- Descripción: Configurar SimpleJWT y crear endpoints de autenticación básicos: login y obtención de tokens.
- Acceptance criteria:
  - `POST /api/auth/login/` devuelve access y refresh tokens para credenciales válidas.
  - `POST /api/auth/refresh/` devuelve nuevo access token usando refresh token válido.
  - Configuración de SimpleJWT con tiempos de expiración apropiados (15min access, 7 días refresh).
  - Tests: login exitoso, credenciales inválidas, refresh token.
- Subtasks sugeridos:
  - Configurar SimpleJWT en settings.py.
  - Crear serializers de login y views.
  - Tests de autenticación y documentación.

### SGICS-202 — Refresh y logout
- Descripción: Implementar endpoints de renovación de tokens y logout con blacklist.
- Acceptance criteria:
  - `POST /api/auth/logout/` invalida el refresh token (blacklist).
  - Tokens en blacklist no pueden ser usados para refresh.
  - Tests de logout y verificación de blacklist.
- Subtasks sugeridos:
  - Configurar blacklist de tokens.
  - Endpoint de logout con invalidación.
  - Tests de logout y blacklist.

### SGICS-203 — Gestión de roles y permisos
- Descripción: Implementar sistema RBAC con modelos Role/Permission y endpoints de gestión.
- Acceptance criteria:
  - Modelos `Role` y `Permission` con relaciones M2M a User.
  - `GET/POST/PUT/DELETE /api/roles/` para CRUD de roles.
  - `POST /api/users/{id}/assign-role/` para asignar roles a usuarios.
  - Permission classes que verifiquen permisos en endpoints protegidos.
  - Tests de RBAC y verificación de permisos.
- Subtasks sugeridos:
  - Modelos Role/Permission + migrations.
  - ViewSets para gestión de roles.
  - Permission classes personalizadas.
  - Tests de permisos y asignación de roles.

---

## Cronograma
## Cronograma
- **Día 1-3 (2025-10-06 a 2025-10-08)**: Implementar login JWT (SGICS-201) y refresh/logout (SGICS-202) en paralelo - Completar subtasks de serializers, views, configuración SimpleJWT, tests y documentación.
- **Día 4-5 (2025-10-09 a 2025-10-10)**: Implementar gestión de roles y permisos (SGICS-203) - Completar subtasks de modelos, serializers, viewsets, permission classes, tests y documentación.
- **Día 6-7 (2025-10-11 a 2025-10-13)**: Integración con frontend, pruebas de aceptación, revisión final y merge a develop.

---

## Hitos y Plazos

| Hito | Fecha objetivo | Criterios |
|---|---:|---|
| Hito 1: Login JWT y refresh/logout implementados y probados | 2025-10-10 | Endpoints funcionales; tests pasando; documentación inicial. |
| Hito 2: Gestión de roles y permisos implementada y probada | 2025-10-13 | CRUD de roles; asignación a usuarios; permission classes funcionales; tests de permisos. |
| Hito 3: Epic completo y mergeado | 2025-10-20 | Integración frontend; pruebas de aceptación; PR aprobado; Definition of Done cumplida. |

---

## Dependencias
- Configuración de Django SimpleJWT en settings.
- Modelo User existente para asociar roles.
- Frontend Vue 3 + Pinia para store de autenticación.

---

## Riesgos y mitigaciones
- Riesgo: exposición de secretos JWT o configuración insegura.
  - Mitigación: usar variables de entorno, rotar secrets regularmente, configurar tiempos de expiración cortos.
- Riesgo: escalada de privilegios por fallas en permission classes.
  - Mitigación: tests exhaustivos de permisos, revisión de código obligatoria, principio de menor privilegio.
- Riesgo: tokens no revocados después de logout.
  - Mitigación: implementar blacklist de tokens, configurar refresh token rotation.

---

## DoD
- Endpoints funcionando con tests (pytest); migrations aplicadas; documentación en `docs/`.
- Sistema RBAC implementado con tests de permisos; permission classes funcionales.
- Integración frontend básica completada; store de autenticación funcional.

---

## Cómo probar
- Crear usuario de prueba; realizar login y verificar tokens JWT válidos.
- Asignar roles al usuario; verificar que permisos se apliquen correctamente en endpoints.
- Probar logout y refresh; verificar que tokens expiren adecuadamente.

Historial: 2025-10-07: creado.
