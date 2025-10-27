# Sprint 2 – Backlog Detallado
Fecha Inicio (estimada): 2025-09-29  
Duración: 2 semanas  
Objetivo Sprint: Establecer la base ejecutable del producto (infra repos, pipeline, autenticación, autorización, preinscripciones MVP, subida de archivos inicial, auditoría y trazabilidad básica).

## 1. Meta de Sprint (Sprint Goal)
"Contar con una plataforma mínima operativa donde un usuario pueda registrarse, iniciar sesión, crear una preinscripción y adjuntar su ficha médica (placeholder), con control de roles y auditoría básica activa bajo un pipeline automatizado."

## 2. Alcance (Must Have)
- Repositorios creados (frontend/backend) con pipeline CI (lint + tests).
- Autenticación (registro, login, refresh / forgot password opcional si hay tiempo).
- RBAC básico (roles predefinidos + asignación manual por endpoint admin).
- CRUD inicial de preinscripciones (crear, ver listado propio, ver detalle, actualizar estados controlados internamente). 
- Subida de archivo (ficha) simple con validaciones de tamaño y tipo (sin AV real todavía, stub).
- Audit logging transversal para operaciones mutativas.
- Configuración inicial de observabilidad (estructura logs + tracer esqueleto).

## 3. Historias de Usuario

### HU-Auth-001 Registro de Usuario
Como invitado quiero registrarme para iniciar una preinscripción.
Criterios Aceptación:
- Email único, contraseña con política mínima (8+ caracteres, 1 número, 1 letra).
- Al registrar: crea user + persona (placeholder datos básicos).
- Respuesta oculta hash.
Definición de Hecho (DoD): Tests unitarios validan política; endpoint documentado.
Estimación: 5 pts.

### HU-Auth-002 Login
Como usuario registrado quiero iniciar sesión para acceder a mis datos.
Criterios: Token JWT (exp configurable), bloqueo 5 intentos fallidos (en memoria/Redis).
DoD: Test de intento fallido; validación de token en endpoint protegido.
Estimación: 3 pts.

### HU-Auth-003 Asignación de Roles (Admin)
Como admin quiero asignar roles a usuarios para controlar acceso.
Criterios: Endpoint POST /admin/roles/assign (user_id, role). Sin duplicados.
DoD: Audit log registra asignación; prueba de acceso denegado a usuario sin rol.
Estimación: 3 pts.

### HU-Pre-001 Crear Preinscripción
Como usuario quiero crear mi preinscripción para iniciar el proceso.
Criterios: Estado inicial BORRADOR; valida unicidad por persona activa.
DoD: Audit log; test crea y recupera.
Estimación: 5 pts.

### HU-Pre-002 Editar Datos Preinscripción (Borrador)
Como usuario quiero editar mientras está en BORRADOR.
Criterios: No permite si estado != BORRADOR.
DoD: Test estado; respuesta sin campos internos.
Estimación: 3 pts.

### HU-Pre-003 Enviar Preinscripción
Como usuario quiero enviar mi preinscripción para validación.
Criterios: Cambia a ENVIADA; registra historial estado.
DoD: Audit + preinscripcion_estado_hist creado.
Estimación: 3 pts.

### HU-File-001 Subir Ficha Médica (Stub)
Como usuario quiero subir mi ficha para completar requisitos.
Criterios: Tipos permitidos (pdf, jpg, png), size < 5MB.
DoD: Metadata en DB + hash; archivo en storage local; placeholder AV_result PENDING.
Estimación: 5 pts.

### HU-RBAC-001 Middleware Autorización
Como sistema necesito validar accesos según rol.
Criterios: Bloquea acceso a endpoint admin si no rol Admin.
DoD: Test unitario + integración.
Estimación: 5 pts.

### HU-Audit-001 Registro de Auditoría
Como sistema quiero registrar acciones para trazabilidad.
Criterios: Cada POST/PUT/DELETE guarda actor, entidad, payload recortado.
DoD: Log visible (consulta directa). Pruebas de inserción.
Estimación: 5 pts.

### HU-Obs-001 Estructura de Logs y Trazas
Como equipo quiero formato unificado de logs para monitoreo.
Criterios: JSON logs con campos timestamp, level, trace_id, user_id (si aplica).
DoD: Config central + ejemplo en Auth y Preinscripciones.
Estimación: 3 pts.

## 4. Tareas Técnicas (Mapeo)
| Historia | Tareas | Estimación (pts) |
|----------|--------|------------------|
| HU-Auth-001 | Modelo User, hash argon2, endpoint POST /auth/register | 5 |
| HU-Auth-002 | Endpoint POST /auth/login, rate limit, refresh token (si tiempo) | 3 |
| HU-Auth-003 | Tabla role_assignments, endpoint admin, middleware audit | 3 |
| HU-RBAC-001 | Middleware roles + pruebas | 5 |
| HU-Pre-001 | Modelo Preinscripcion, migración DB, endpoint create | 5 |
| HU-Pre-002 | Endpoint update (PUT) con validación estado | 3 |
| HU-Pre-003 | Endpoint POST /preinscripciones/{id}/enviar + historial estado | 3 |
| HU-File-001 | Storage local carpeta /uploads, endpoint upload, validaciones, hash | 5 |
| HU-Audit-001 | Middleware + tabla audit_logs + hook mutaciones | 5 |
| HU-Obs-001 | Config logger + tracer provider stub | 3 |
| Infra | Repos + Dockerfile + CI (lint/test/build) | 8 |
| DB Base | Script migraciones iniciales (users, roles, preinscripciones, archivos, audit_logs) | 5 |

Total Aproximado: 56 pts (revisar capacidad equipo; ajustar si necesario).

## 5. Fuera de Alcance (Sprint 2)
- Importador batch de pagos.
- Confirmación automática por pago.
- Paneles financieros o dashboards.
- Antivirus real (solo stub).
- Comunicación masiva.

## 6. Criterios de Aceptación del Sprint
- Todos los endpoints críticos cubiertos con tests (≥70% statements módulos creados).
- Pipeline CI verde (lint + tests) en merge a develop.
- Documento arquitectura actualizado a versión 0.1 (o 0.2 si se ajusta durante sprint).
- Demo: flujo completo registro → login → crear/editar/enviar preinscripción → subir archivo → ver audit log.

## 7. Riesgos Específicos Sprint 2
| Riesgo | Mitigación |
|--------|------------|
| Retraso en configuración CI | Priorizar tarea Infra primero |
| Complejidad RBAC | Empezar con roles estáticos + expansión posterior |
| Falta de definición de campos preinscripción | Implementar set mínimo y permitir extensión | 

## 8. Definición de Hecho (DoD) Global
- Código en main/develop con PR revisada.
- Tests y lint sin errores.
- Migraciones aplicadas en entorno dev.
- Documentado en README o wiki el uso de endpoints.
- Sin vulnerabilidades críticas abiertas (scanner dependencias).

## 9. Métricas a Recolectar
- Lead time historia (creación → merge).
- % de tests pasados y cobertura.
- Frecuencia de despliegue (al menos 1 a dev tras cada merge relevante).
- Defectos encontrados en demo (objetivo: <= 3 menores, 0 críticos).

## 10. Plan de Demo
1. Registrar usuario y login (mostrar JWT).
2. Crear preinscripción y edición en BORRADOR.
3. Enviar preinscripción (estado cambia a ENVIADA + historial).
4. Subir archivo ficha (mostrar metadata en DB).
5. Asignar rol admin a otro usuario y probar endpoint protegido.
6. Consultar audit logs filtrando por actor.

---
