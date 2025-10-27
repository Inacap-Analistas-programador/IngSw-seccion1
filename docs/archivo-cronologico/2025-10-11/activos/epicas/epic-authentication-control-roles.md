# Epic: Autenticación y Control de Roles (SGICS-E-AUTH)# Epic: Autenticación y Control de Roles (SGICS-E-AUTH)



**Vencimiento**: 2025-10-20 | **Estado**: En Progreso | **Puntos**: 12Tags: epic, auth, backend, sprint2



## Objetivo**Vencimiento**: 2025-10-20 | **Estado**: En Progreso | **Puntos**: 12

Sistema de autenticación JWT + RBAC para proteger módulos críticos (preinscripción, pagos, dashboard).

## Objetivo

## AlcanceSistema de autenticación JWT + RBAC para proteger módulos críticos (preinscripción, pagos, dashboard).

### ✅ Debe tener:

- JWT con SimpleJWT (login/refresh/logout)## Alcance

- Sistema RBAC (Role/Permission)### Debe tener:

- Endpoints gestión roles + asignación usuarios- Implementación de autenticación JWT con SimpleJWT (login, refresh, logout).

- Integración frontend básica (store/auth, rutas privadas)- Sistema de control de roles (RBAC) con modelos Role y Permission.

- Tests unitarios + integración- Endpoints para gestión de roles y asignación a usuarios.

- Integración básica frontend (store/auth) para rutas privadas.

### ⚠️ Fuera del alcance:- Tests unitarios e integración para todos los endpoints de auth.

- MFA avanzada

- Active Directory/LDAP### Podría tener:

- Permisos granulares nivel campo- Revocación manual de tokens (blacklist avanzada).

- Dashboard completo admin usuarios- Logs de auditoría para acciones de autenticación.

- Integración con proveedores externos (OAuth2/SAML).

**Prioridad**: Alta | **Riesgo**: Alto (credenciales)- Interface de administración para gestión de roles.



## Historias### Fuera del alcance:

| Key | Título | Assignee | Story Points | Estado |- Autenticación multi-factor (MFA) avanzada.

|---|---|---:|---:|---:|- Integración con Active Directory o LDAP.

| SGICS-201 | Login JWT (SimpleJWT) | Nicolas Irribarra | 5 | To Do |- Sistema de permisos granulares a nivel de campo.

| SGICS-202 | Refresh y logout | Lucas Guerrero | 2 | To Do |- Dashboard completo de administración de usuarios.

| SGICS-203 | Gestión roles y permisos | Axel Villa | 5 | To Do |

**Prioridad**: Alta | **Riesgo**: Alto (credenciales)

## SGICS-201 — Login JWT

- `POST /api/auth/login/` → access + refresh tokens---

- `POST /api/auth/refresh/` → nuevo access token

- Configuración SimpleJWT (15min access, 7 días refresh)## Historias incluidas

- Tests: login exitoso, credenciales inválidas| Key | Título | Assignee | Story Points | Estado |

|---|---|---:|---:|---:|

## SGICS-202 — Refresh y Logout  | SGICS-201 | Implementar login JWT (SimpleJWT) | Nicolas Irribarra | 5 | To Do |

- `POST /api/auth/logout/` → invalidar refresh (blacklist)| SGICS-202 | Refresh y logout | Lucas Guerrero | 2 | To Do |

- Tokens blacklist no pueden refresh| SGICS-203 | Gestión de roles y permisos | Axel Villa | 5 | To Do |

- Tests logout + verificación blacklist

---

## SGICS-203 — Roles RBAC

- Modelos `Role`/`Permission` + M2M a User## Detalle de historias / Acceptance Criteria

- `GET/POST/PUT/DELETE /api/roles/` (CRUD)

- `POST /api/users/{id}/assign-role/`### SGICS-201 — Implementar login JWT (SimpleJWT)

- Permission classes endpoints protegidos- Descripción: Configurar SimpleJWT y crear endpoints de autenticación básicos: login y obtención de tokens.

- Tests RBAC + verificación permisos- Acceptance criteria:

  - `POST /api/auth/login/` devuelve access y refresh tokens para credenciales válidas.

## Cronograma  - `POST /api/auth/refresh/` devuelve nuevo access token usando refresh token válido.

- **Oct 6-8**: Login JWT + refresh/logout (SGICS-201, 202)  - Configuración de SimpleJWT con tiempos de expiración apropiados (15min access, 7 días refresh).

- **Oct 9-10**: Roles y permisos (SGICS-203)    - Tests: login exitoso, credenciales inválidas, refresh token.

- **Oct 11-13**: Integración frontend + tests- Subtasks sugeridos:

  - Configurar SimpleJWT en settings.py.

## Dependencias  - Crear serializers de login y views.

- Django SimpleJWT, Modelo User, Vue 3 + Pinia  - Tests de autenticación y documentación.



## Riesgos### SGICS-202 — Refresh y logout

- **JWT secrets**: Variables entorno + rotación- Descripción: Implementar endpoints de renovación de tokens y logout con blacklist.

- **Escalada privilegios**: Tests exhaustivos + code review  - Acceptance criteria:

- **Tokens no revocados**: Blacklist + rotation  - `POST /api/auth/logout/` invalida el refresh token (blacklist).

  - Tokens en blacklist no pueden ser usados para refresh.

## DoD  - Tests de logout y verificación de blacklist.

✅ Endpoints + tests (pytest) + docs  - Subtasks sugeridos:

✅ RBAC + permission classes + tests    - Configurar blacklist de tokens.

✅ Frontend store + rutas privadas    - Endpoint de logout con invalidación.

  - Tests de logout y blacklist.

## Testing

```bash### SGICS-203 — Gestión de roles y permisos

pytest tests/auth/- Descripción: Implementar sistema RBAC con modelos Role/Permission y endpoints de gestión.

npm run test:auth- Acceptance criteria:

```  - Modelos `Role` y `Permission` con relaciones M2M a User.
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
- **Oct 6-8**: Login JWT + refresh/logout (SGICS-201, 202)
- **Oct 9-10**: Roles y permisos (SGICS-203)  
- **Oct 11-13**: Integración frontend + tests

## Dependencias
- Django SimpleJWT, Modelo User, Vue 3 + Pinia

## Riesgos
- **JWT secrets**: Variables entorno + rotación
- **Escalada privilegios**: Tests exhaustivos + code review  
- **Tokens no revocados**: Blacklist + rotation

## DoD
✅ Endpoints + tests (pytest) + docs  
✅ RBAC + permission classes + tests  
✅ Frontend store + rutas privadas  

## Testing
```bash
# Backend
pytest tests/auth/
# Frontend  
npm run test:auth
```
