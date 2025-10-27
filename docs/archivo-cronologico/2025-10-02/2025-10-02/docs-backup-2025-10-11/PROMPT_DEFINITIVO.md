
## Contexto del Proyecto
- Nombre: Sistema de Gestión Integral para Cursos Scouts (SGICS)
- Cliente: Scouts de Chile – Región del Bío-Bío
- Metodología: Scrum (6 sprints, 2 semanas)
- Periodo: 29-Sep-2025 a 20-Dic-2025
- Equipo: 14 devs en 6 módulos
- Repositorio monorepo: `codigo/backend` (Django 5 + DRF + SimpleJWT + Celery/Redis), `codigo/frontend` (Vue 3 + Vite + Tailwind + Pinia), Docker/Compose.
- Base de datos objetivo: Microsoft SQL Server 2019 (modelo físico sincronizado desde PowerDesigner). En dev actual hay SQLite; hay scripts T-SQL en `codigo/backend/db/`.
- Calidad y Observabilidad: SonarQube (Quality Gate ≥80% cobertura, 0 vulns críticas), Prometheus/Grafana, health checks `/healthz` `/readyz`.
- Gestión Ágil: Jira Software (nomenclatura ramas `feature/PROY-###-...` y despliegues reportados).

## Objetivos de Negocio y Técnicos (resumen)
- Digitalizar 100% procesos (preinscripción → acreditación) con trazabilidad total.
- Reducir tiempos de acreditación a ≤ 15 días.
- Conciliar ≥ 90% pagos en < 24h.
- Disponibilidad mensual ≥ 99.5%; respuesta p95 < 2 s.

## Alcance Funcional Prioritario (Must/Should)
- Must: Autenticación JWT + RBAC; flujo de preinscripción y estados; pagos individuales y masivos; certificados; dashboard con KPIs; auditoría.
- Should: Notificaciones automáticas; reportes financieros; import masiva; acreditación con QR; comunicaciones masivas.

## Restricciones y Lineamientos
- Seguridad: OWASP Top 10, cifrado en tránsito, Always Encrypted para datos sensibles, rate limiting, logs/auditoría.
- Datos: SQL Server 2019, índices y FKs, procedimientos/funciones clave, triggers de updated_at y de log de estados.
- Calidad: Quality Gate SonarQube obligatorio; cobertura backend ≥ 80% y frontend ≥ 70%.
- CI/CD: GitHub Actions con etapas lint → test (pytest/vitest) → coverage → build → sonar → release on tag.

---

## Prompt (para pedir entregables técnicos)
Actúa como Tech Lead Full‑Stack y DevOps. Con el contexto de SGICS y el código de este repo, tu misión es entregar artefactos listos para usar. Sigue estas instrucciones con precisión.

1) Entradas y Supuestos
- Stack real:
  - Backend: Django 5.0.4 + DRF + SimpleJWT, Celery 5 + Redis, logging JSON, apps: `users`, `preinscriptions`, `files`, `audit`.
  - Frontend: Vue 3 + TS + Vite 5 + Tailwind 3 + Pinia + Vue Router + Vee-Validate.
  - DB: Objetivo MS SQL Server 2019; en dev actual SQLite. Scripts SQL en `codigo/backend/db/`.
- Flujos clave: Preinscripción (wizard), validación territorial/documental, pagos, confirmación automática, acreditación con QR, dashboards, notificaciones.
- Calidad: sonar gate, tests unitarios, coverage reports.
- Gestión: ramas `feature/PROY-###-slug` con referencia Jira.
- Si falta detalle, haz 1-2 supuestos razonables y documenta.

2) Entregables obligatorios
- Código y archivos completos, no solo snippets. Ubícalos en las rutas correctas de este repo.
- Tests mínimos (happy path + 1 borde) por módulo afectado.
- Documentación breve (README o comentarios) y comandos para correr en Windows PowerShell.
- Cambios de configuración (Dockerfile, compose, settings) si son necesarios para que funcione.

3) Tareas a realizar ahora
A. Backend (Django/DRF)
- Implementa endpoints REST mínimos para:
  - `GET /api/courses/` y `POST /api/courses/` con filtros por estado y texto.
  - `POST /api/preinscriptions/{id}/submit/` para transición a “Enviado” registrando historial en `audit`.
  - `POST /api/payments/` con validación de comprobante (solo stub ahora) y asociación a preinscripción; si “autoconfirmación” de curso está activa, cambia estado a “Cupo Asignado”.
- Añade validación de RUT chileno reutilizable.
- Exponer `/healthz` y `/readyz`.
- Métricas básicas (si es simple) o deja hooks preparados para Prometheus.

B. Frontend (Vue/Vite)
- Crea vista Dashboard con semáforo de cursos (verde/amarillo/rojo) y KPIs básicos.
- Crea formulario de preinscripción (wizard 3 pasos) con Vee‑Validate y yup, incluyendo carga de ficha médica.
- Integra login con JWT y guarda tokens de forma segura (storage + refresh flow simple).

C. Tests
- Backend: tests de API para cursos, submit preinscripción y pagos (pytest o unittest, el proyecto ya usa Django). Cobertura objetivo ≥ 70% inicial.
- Frontend: tests con Vitest para 2 componentes clave (Dashboard y un paso del wizard).

D. CI/CD y Calidad
- Agrega workflow GitHub Actions que ejecute:
  - `pip install -r codigo/backend/requirements.txt`; `pytest` con coverage y publique reporte.
  - `npm ci` en `codigo/frontend`; `vitest run --coverage` y publique cobertura V8.
  - Cache de dependencias y artifacts de cobertura.
  - Paso de SonarQube (si hay token, usa variable `SONAR_TOKEN`).

4) Criterios de aceptación
- Endpoints funcionales y probados con estados y auditoría.
- Dashboard muestra KPIs y semáforo por curso.
- Wizard de preinscripción valida RUT y permite subir ficha médica.
- Pipeline CI pasa en PR a `main`/`develop`; genera coverage y falla si tests fallan.
- Documentación mínima para ejecutar localmente en Windows (PowerShell).

5) Artefactos esperados (crea/edita donde aplique)
- Backend: serializers, views, urls, tests, utils (RUT), endpoints health/ready, hooks métricas.
- Frontend: vistas `Dashboard.vue`, `PreinscripcionWizard.vue`, store Pinia para auth.
- CI: `.github/workflows/ci.yml` completo con matrices básicas de Python 3.11/Node 20.
- Docs: README corto con comandos de dev y prueba.

6) Comandos de verificación (PowerShell)
- Backend (desde `codigo/backend`):
  - `python -m venv .venv; .\.venv\Scripts\Activate.ps1`
  - `pip install -r requirements.txt`
  - `python manage.py migrate`
  - `pytest -q`
- Frontend (desde `codigo/frontend`):
  - `npm ci`
  - `npm run test`
  - `npm run dev`

7) Riesgos y mitigaciones
- Diferencias SQLite vs SQL Server: encapsular consultas y usar migraciones; probar índices y constraints en scripts T‑SQL.
- Manejo de archivos: abstraer almacenamiento; usar MinIO/S3 en producción.
- Seguridad de JWT: refresco y expiración; rate limit; CORS correctamente configurado.

8) Entregables opcionales (si el tiempo alcanza)
- Exportación OpenAPI consolidada y tests de contrato.
- Scripts de migración de XLSX a staging con validaciones.
- Endpoint `/metrics` con django-prometheus.

---

## Cómo pegar y usar este prompt
- Copia desde “Prompt (para pedir entregables técnicos)” y pégalo en tu asistente IA.
- Adjunta, cuando sea útil, fragmentos de archivos del repo que vayas a modificar.
- Pide siempre: lista de archivos a crear/editar y cómo correrlos en PowerShell.
