# Estimación de complejidad y tamaño por módulos — SGICS

Fecha: 2025-10-07
Autor: Equipo Técnico (generado)

Propósito: ofrecer una medición práctica de la complejidad y tamaño de las historias/epics por módulo para ayudar en asignación de recursos, planificación de sprint y gestión de riesgos.

Supuestos y convención de estimación
- Unidad: Story Points (SP) en escala Fibonacci razonable (1,2,3,5). Para esta guía se asume: 1 SP ≈ 1 developer-day (8 horas) para un desarrollador medio en el contexto del proyecto. Ajusta esta equivalencia según la velocidad real del equipo.
- Sprint: 2 semanas (10 working days) por desarrollador.
- Riesgo: categoría (Bajo / Medio / Alto) basada en incertidumbre técnica, dependencias externas y seguridad.
- Complejidad: índice 1-10 (1 = trivial, 10 = muy complejo).
- Prioridad: Alta / Media / Baja.

Metodología: sumamos los Story Points de las historias planeadas por Epic/module y devolvemos: total SP, person-days estimados (≈SP), complejidad, riesgo, dependencias, tareas mínimas y recomendaciones de asignación.

---

Resumen por módulo (alto nivel)

1) Autenticación y Control de Roles (Epic: SGICS-E-AUTH)
- Historias incluidas (ejemplos): SGICS-201 (5), SGICS-202 (2), SGICS-203 (5)
- Total estimado: 12 SP → ≈ 12 person-days
- Complejidad (1-10): 8
- Riesgo: Alto (seguridad, manejo de tokens, vulnerabilidades comunes)
- Prioridad: Alta
- Dependencias: DB users, integration with frontend auth store, secrets for JWT
- Subtareas típicas:
  - Model/migration (si aplica)
  - Serializers + Views (DRF)
  - Token configuration (SimpleJWT settings)
  - Permission classes / decorators
  - Tests (unit + integration)
  - Documentación (README auth usage)
- Recomendación de recursos para 1 sprint: 2 backend devs (pueden completar en 1 sprint si trabajan full-time), 1 reviewer.
- Mitigación de riesgo: incluir code review obligatorio, tests de seguridad básicos, usar linters y Sonar para detectar issues.

2) Preinscripciones (Epic: SGICS-E-PREINS)
- Historias incluidas: SGICS-401 (5), SGICS-401b (3)
- Total estimado: 8 SP → ≈ 8 person-days
- Complejidad: 6
- Riesgo: Medio (integración con personas existentes, validación RUT)
- Prioridad: Alta
- Dependencias: Endpoints persons, courses, file upload (para pasos posteriores)
- Subtareas típicas:
  - Model/Preinscription migration
  - API endpoints (search-by-rut, create preinscription)
  - Frontend wizard step 1 implementation
  - Tests backend + vitest for the wizard step
- Recomendación: 1 backend dev + 1 frontend dev (o 2 full-stack devs) durante la sprint.

3) Dashboard & Cursos (Epic: SGICS-E-DASH)
- Historias incluidas: SGICS-304 (5) + tareas de UI (301-303 sumadas opcionalmente)
- Total estimado: 5 - 14 SP dependiendo del alcance (solo SGICS-304 = 5 SP; completo UI infra = 14 SP)
- Complejidad: 5 (solo lógica) - 7 (con UI + design system)
- Riesgo: Medio
- Prioridad: Alta
- Dependencias: Cursos API, pagos API, equipo del curso (datos de team), frontend design tokens
- Subtareas típicas:
  - Endpoint agregados (si backend no provee agregados)
  - Componentes: CourseList, CourseCard, KPI cards
  - Lógica semáforo (unidad y tests)
  - Storybook/Design system integration (si aplica)
- Recomendación: 2 frontend devs + 1 backend ad-hoc; dividir en "backend suministro de datos" (1-2 SP) y "frontend UI" (rest).

4) Pagos (Epic: SGICS-E-PAY)
- Historias incluidas: SGICS-501 (5), SGICS-502 (3)
- Total estimado: 8 SP → ≈ 8 person-days
- Complejidad: 6
- Riesgo: Alto-medio (procesamiento financiero, integridad de datos)
- Prioridad: Alta
- Dependencias: Preinscriptions model, legacy endpoints (fallback), file uploads (comprobantes)
- Subtareas típicas:
  - Model Payment + migration
  - Endpoints POST/GET + validation stub
  - Fallback adapter a legacy endpoint (Factory pattern)
  - Tests (unit/integration)
- Recomendación: 1-2 backend devs; colaboración con QA para testear escenarios edge.

5) Archivos & Validación (Epic: SGICS-E-FILES)
- Historias incluidas: SGICS-402 (3)
- Total estimado: 3 SP → ≈ 3 person-days
- Complejidad: 4
- Riesgo: Medio (mal manejo de archivos puede exponer datos)
- Prioridad: Media
- Dependencias: Storage (local/S3/MinIO), Persons/Preinscriptions
- Subtareas típicas: upload endpoint, metadata model, download, tests, política de tamaños/ tipos
- Recomendación: 1 dev (backend) y un review security for storage config.

6) CI / Calidad / DevOps (Epic: SGICS-E-CI)
- Historias incluidas: SGICS-101 (5), SGICS-102 (2)
- Total estimado: 7 SP → ≈ 7 person-days
- Complejidad: 5
- Riesgo: Medio (si CI falla, se bloquea el flujo)
- Prioridad: Alta
- Dependencias: Acceso a secrets, runners, Sonar token
- Subtareas típicas: create workflows, caching, coverage upload, health endpoints
- Recomendación: 1 DevOps/Backend dev (puede trabajar con 1 sprint dedicado)

7) Tests & QA (Epic: SGICS-E-QA)
- Historias incluidas: SGICS-601 (5), SGICS-602 (3)
- Total estimado: 8 SP → ≈ 8 person-days
- Complejidad: 5
- Riesgo: Medio
- Prioridad: High
- Dependencias: Endpoints implementados, test data
- Subtareas típicas: unit tests, integration tests, vitest components, coverage reports
- Recomendación: QA + 1-2 devs cross-team support

---

Tabla resumida

| Módulo | Epic | SP estimados | Person-days | Complejidad (1-10) | Riesgo | Prioridad | Recomendación de recursos (1 sprint) |
|---|---:|---:|---:|---:|---|---|---|
| Autenticación y Roles | SGICS-E-AUTH | 12 | 12 | 8 | Alto | Alta | 2 backend devs |
| Preinscripciones | SGICS-E-PREINS | 8 | 8 | 6 | Medio | Alta | 1 backend + 1 frontend |
| Dashboard & Cursos | SGICS-E-DASH | 5-14 | 5-14 | 5-7 | Medio | Alta | 2 frontend + 1 backend (según alcance) |
| Pagos | SGICS-E-PAY | 8 | 8 | 6 | Alto-medio | Alta | 1-2 backend devs |
| Archivos | SGICS-E-FILES | 3 | 3 | 4 | Medio | Media | 1 backend dev |
| CI / DevOps | SGICS-E-CI | 7 | 7 | 5 | Medio | Alta | 1 DevOps/Dev |
| Tests & QA | SGICS-E-QA | 8 | 8 | 5 | Medio | Alta | QA + 1-2 devs |

---

Desglose típico de tareas por Story (plantilla)
- Backend
  1. Crear/actualizar model/migration
  2. Crear serializer(s)
  3. Crear viewsets/endpoints y urls
  4. Añadir permisos y validaciones
  5. Crear tests unitarios e integración
  6. Documentar en README
- Frontend
  1. Crear componente(s) y store (Pinia)
  2. Validaciones en formulario (Vee-Validate+yup)
  3. Integración API (fetch/axios wrapper)
  4. Tests de componente (Vitest)
  5. Estilos (Tailwind) y tokens del design system

Cómo usar estas métricas en la planificación
1. Convertir SP a carga real: sumar SP del sprint y dividir por capacidad (ej: 6 devs * 8 días = 48 dev-days). Ajustar la velocidad según histórico.
2. Identificar historias con riesgo alto y marcarlas como "de-risk" (split + spike) en la primera mitad del sprint.
3. Planear reviews de seguridad para Autenticación y Pagos antes del merge a `develop`.
4. Asignar par reviews y pruebas cruzadas entre equipos (al menos 1 revisor externo por PR crítico).
5. Mantener historias pequeñas y crear subtasks técnicas (migrations/tests/docs) para facilitar seguimiento.

Notas finales y recomendaciones
- Estas estimaciones son iniciales y deben calibrarse con la velocidad real del equipo (hacer retroalimentación después del primer sprint).
- Para ítems de alto riesgo (auth, pagos) se recomienda crear spikes técnicos (1-2 SP) si hay incertidumbre mayor y agregar pruebas de concepto antes de la implementación completa.
- Revisar dependencias con legacy (`/api/legacy/*`) y, si es posible, preparar adaptadores (Factory Method) antes del sprint para reducir bloqueos.

Si quieres, genero ahora un CSV con las estimaciones por Epic (para subir a Jira como campo "Original Estimate" o comentario) o añado subtasks automáticos por cada Story. ¿Qué prefieres?