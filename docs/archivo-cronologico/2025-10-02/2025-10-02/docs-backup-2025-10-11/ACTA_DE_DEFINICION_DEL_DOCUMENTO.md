# Acta de Definición del Documento

Fecha: 02-10-2025  
Proyecto: SGICS — Sistema de Gestión de Inscripciones, Cursos y Scouts  
Código de documento: SGICS-AD-001  
Versión: 1.0 (Borrador)  
Estado: Pendiente de aprobación

---

## 1. Propósito y alcance
Este documento define el objetivo, el alcance, las responsabilidades, la estructura y los criterios de aceptación de la documentación oficial del proyecto SGICS. Sirve como referencia única para la preparación, mantenimiento y control de cambios de la documentación técnica y funcional del sistema.

Alcance de la documentación cubierta:
- Arquitectura del sistema y decisiones de diseño.
- APIs y contratos del backend (Django/DRF/JWT) y endpoints legacy `/api/legacy/*` hacia SQL Server.
- Aplicación frontend (Vue 3 + Pinia + Vite) y flujos de UI.
- Integración con base de datos legada (SQL Server 2019): funciones, vistas y procedimientos T‑SQL.
- Guías operativas: despliegue con Docker, dev y tests, métricas/healthchecks.
- Manuales de usuario para los 6 módulos de UI: Dashboard, Cursos, Preinscripciones, Pagos, Archivos, Notificaciones.

Fuera de alcance de este documento:
- Contratos comerciales o legales.
- Procesos organizacionales ajenos al producto.

## 2. Contexto y antecedentes
SGICS moderniza la gestión de inscripciones y cursos, preservando como fuente de verdad un sistema leg legado en SQL Server. La plataforma actual incorpora:
- Backend: Django + DRF + SimpleJWT, con endpoints proxy legacy bajo `/api/legacy/*`.
- Frontend: SPA en Vue 3 (Pinia, Vite, Vitest) con navegación consolidada a 6 módulos.
- Integración de KPIs y resúmenes por curso en Dashboard, priorizando datos de SQL Server.
- UX de Preinscripción con búsqueda por RUT y selección inicial de curso.

## 3. Definiciones y acrónimos
- SGICS: Sistema de Gestión de Inscripciones, Cursos y Scouts.
- DRF: Django REST Framework.
- JWT: JSON Web Token.
- UI/UX: Interfaz/Experiencia de Usuario.
- KPI: Indicador Clave de Desempeño.
- Legacy: Sistema de registro en SQL Server.

## 4. Partes interesadas, roles y responsabilidades
- Product Owner: Valida alcance, aceptación funcional y prioriza cambios.
- Tech Lead/Arquitectura: Aprueba decisiones técnicas y lineamientos de calidad.
- Equipo Backend: Mantiene contratos de API y documentación de endpoints/migrations.
- Equipo Frontend: Mantiene guías de UI, componentes, rutas y pruebas.
- QA: Revisa criterios de aceptación, planes de prueba y cobertura.
- Operaciones/DevOps: Mantiene guías de despliegue y observabilidad.

## 5. Estructura del documento (guía de contenidos)
La documentación del proyecto se organiza en:
1. Requerimientos y alcance funcional.
2. Arquitectura: vista lógica, física y decisiones (ADR cuando aplique).
3. Backend: 
   - Modelos, serializers, vistas, permisos.
   - Endpoints REST y `/api/legacy/*` (mapeo a SQL Server).
   - Health/ready/metrics.
4. Frontend:
   - Rutas, stores de Pinia, componentes clave.
   - Testing (Vitest) y pautas de estilo.
5. Integraciones/DB:
   - T‑SQL (funciones, vistas, procedimientos).
   - Alias de conexiones y helpers de acceso.
6. Operaciones:
   - Docker/Docker Compose, variables, ejecución local/CI.
   - Observabilidad básica.
7. Manuales de usuario por módulo:
   - Dashboard, Cursos, Preinscripciones, Pagos, Archivos, Notificaciones.
8. Plan de pruebas y criterios de aceptación.
9. Control de cambios (changelog) y versionado semántico.

## 6. Requerimientos clave y fuentes de verdad
- Los datos operativos se originan en SQL Server (legacy). El backend expone endpoints `/api/legacy/*` que se priorizan en el frontend.
- La UI se limita a 6 módulos principales:
  1) Dashboard (KPIs, cursos vigentes y fechas próximas)
  2) Cursos (lista, filtros por rama y semáforo, pagos al día)
  3) Preinscripciones (selección de curso + búsqueda por RUT)
  4) Pagos (búsqueda por grupo con fallback a API estándar)
  5) Archivos (gestión de documentos)
  6) Notificaciones (incluye correos masivos)
- Seguridad: autenticación JWT, rutas privadas protegidas en frontend.

Referencias en el repositorio:
- Backend: `codigo/backend/` (Django), helpers de MSSQL en `integration/legacy_mssql.py` y vistas en `views_legacy.py`.
- Frontend: `codigo/frontend/` (Vue 3 + Vite), rutas y stores en `src/router` y `src/stores`.
- SQL Server: scripts en `codigo/backend/db/`.

## 7. Supuestos y dependencias
- Conectividad a SQL Server 2019 disponible en entornos de dev/qa/prod.
- El esquema legacy permanece estable; cambios se documentan y versionan.
- CI ejecuta pruebas de backend y frontend; fallos bloquean merge a ramas protegidas.
- Docker como mecanismo de ejecución local y empaquetado.

## 8. Criterios de aceptación de la documentación
- Cada cambio público de API/UI se refleja con:
  - Descripción, ejemplos, estados y errores esperados.
  - Impacto en pruebas automatizadas.
- Diagramas o flujos se actualizan cuando cambia el proceso o arquitectura.
- Manuales de usuario cubren el “happy path” y 1–2 escenarios límite.
- El índice de contenidos está consistente con la estructura del repo.

## 9. Exclusiones explícitas
- Métricas de negocio fuera del alcance del sistema (p. ej., indicadores financieros corporativos no disponibles en legacy).
- Conexiones a sistemas externos no enumerados en Integraciones.

## 10. Riesgos y mitigaciones
- Cambios imprevistos en el esquema legacy → Mitigación: contrato de compatibilidad + feature flags y endpoints de fallback.
- Divergencia entre UI y datos reales → Mitigación: UI “legacy-first” con validaciones, tests de contrato y smoke tests.
- Disponibilidad de SQL Server en QA/CI → Mitigación: mocks/fixtures y pruebas de integración segmentadas.

## 11. Versionado y control de cambios
- Versionado semántico (MAJOR.MINOR.PATCH) para la documentación.
- Changelog en `docs/` con entradas vinculadas a PRs.
- Revisión obligatoria de Tech Lead y Product Owner para versiones mayores.

## 12. Calendario de revisión y aprobaciones
- Revisión trimestral o ante cambios significativos de arquitectura o alcance.

| Rol                     | Nombre                | Firma           | Fecha       |
|-------------------------|-----------------------|-----------------|-------------|
| Product Owner           |                       |                 |             |
| Tech Lead / Arquitecto  |                       |                 |             |
| QA Lead                 |                       |                 |             |
| Operaciones / DevOps    |                       |                 |             |

## 13. Anexos y referencias
- Documentos previos en `docs/legacy/` y `docs/schema/`.
- Especificaciones de endpoints en README de cada módulo y/o Postman/Insomnia.
- ADRs cuando existan decisiones arquitecturales relevantes.

---

Responsable de la acta:  
Nombre: __________________________  
Cargo: ___________________________  
Fecha: 02-10-2025
