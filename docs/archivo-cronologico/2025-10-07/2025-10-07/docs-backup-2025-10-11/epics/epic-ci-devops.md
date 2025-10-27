# Epic: CI / Calidad / DevOps (SGICS-E-CI)

Tags: epic, ci, devops, infra, sprint2

## Detalles del Epic
- **Impulsor:** Equipo de Ingeniería
- **Aprobador:** @RICARDO CRISTOBAL SANHUEZA ACUNA
- **Personas informadas:** Todos los equipos ()
- **Objetivo:** Implementar el workflow CI básico que ejecute tests, linters, genere artifacts de coverage y permita la integración segura en PRs.
- **Fecha de vencimiento:** 20 de octubre del 2025
- **Principales resultados:** Pipeline CI/CD funcional con GitHub Actions, endpoints de health check y integración opcional con SonarQube.
- **Estado:** En Progreso

## Planteamiento del problema
Actualmente el proyecto carece de un sistema de integración continua que permita validar automáticamente la calidad del código, ejecutar tests y garantizar que los cambios no introduzcan regresiones. Esta ausencia genera riesgos de integración, dificulta la detección temprana de errores y complica el proceso de revisión de PRs. Además, la falta de endpoints de health check impide el monitoreo efectivo del estado de la aplicación en diferentes ambientes.

El alcance de este epic se centra en implementar un pipeline básico de CI/CD con GitHub Actions que ejecute tests, linters y genere reportes de coverage, junto con endpoints básicos de health check. No incluye despliegue automatizado a producción ni configuraciones avanzadas de infraestructura en esta fase.

## Planteamiento del problema y el alcance
### Debe tener:
- Workflow GitHub Actions que ejecute pytest (backend) y vitest (frontend).
- Linters configurados (black/isort para backend, prettier/eslint para frontend).
- Endpoints /healthz y /readyz para health checks.
- Artifacts de coverage generados y almacenados.
- Documentación de configuración y troubleshooting.

### Podría tener:
- Integración con SonarQube para análisis de calidad (si token disponible).
- Cache de dependencias para acelerar builds.
- Notificaciones de Slack/Teams para fallos de CI.
- Build y push de imágenes Docker para ambientes de prueba.

### Fuera del alcance:
- Despliegue automatizado a producción.
- Configuración de infraestructura completa (Kubernetes, etc.).
- Monitoreo avanzado con métricas y alertas.
- Gestión de secrets avanzada más allá de GitHub Secrets.

## Resumen
Epic responsable de asegurar pipelines reproducibles y controles de calidad: GitHub Actions CI para backend/frontend, integración con SonarQube (opcional), endpoints health y readiness.

Objetivo: Implementar el workflow CI básico que ejecute tests, linters, genere artifacts de coverage y permita la integración segura en PRs.

Prioridad: Alta
Riesgo: Medio

---

## Historias incluidas
| Key | Título | Assignee | Story Points | Estado |
|---|---|---:|---:|---:|
| SGICS-101 | CI: GitHub Actions setup | Ricardo Sanhueza | 5 | To Do |
| SGICS-102 | Health endpoints | Giovanni Pacheco | 2 | To Do |

---

## Detalle de historias / Acceptance Criteria

### SGICS-101 — CI: GitHub Actions setup
- Descripción: Workflow CI que corra pytest en backend y vitest en frontend, suba coverage artifacts y ejecute Sonar si token presente.
- Acceptance criteria:
  - `.github/workflows/ci.yml` presente y ejecutable en PRs.
  - Tests se ejecutan y PR falla si hay fallos.
  - Artifacts de coverage subidos.
- Subtasks sugeridos:
  - Crear workflow YAML.
  - Configurar cache de pip/npm.
  - Documentar cómo añadir `SONAR_TOKEN`.

### SGICS-102 — Health endpoints
- Descripción: Endpoints `/healthz` y `/readyz` en backend.
- Acceptance criteria:
  - Ambos endpoints devuelven 200 cuando la app está operativa.
  - Documentados y utilizados por healthchecks en despliegue.

---

## Dependencias
- Acceso a GitHub Actions runners.
- Secrets: `SONAR_TOKEN` para SonarQube (opcional) y credenciales de Docker Registry si se hace build/push.

---

## Riesgos y mitigaciones
- Riesgo: CI lento por dependencias sin cache.
  - Mitigación: configurar cache y matrices con versiones fijas.
- Riesgo: secretos expuestos.
  - Mitigación: usar GitHub secrets y restringir permisos.

---

## Hitos y plazos

| Hito | Fecha objetivo | Criterios |
|---|---:|---|
| Hito 1: Workflow CI básico implementado | 2025-10-12 | GitHub Actions configurado; tests backend y frontend ejecutándose; linters funcionando. |
| Hito 2: Health endpoints y coverage implementados | 2025-10-17 | Endpoints /healthz y /readyz funcionales; artifacts de coverage generados; documentación completa. |
| Hito 3: Epic completo y optimizado | 2025-10-20 | Cache configurado; integración SonarQube opcional; troubleshooting documentado; Definition of Done cumplida. |

---

## DoD
- Workflow en repo funcionando correctamente; documentación de cómo correr localmente.
- Endpoints de health check implementados y probados.
- Pasos de troubleshooting y configuración documentados.

---

## Cómo probar
- Crear PR de prueba; verificar que CI se ejecute correctamente y falle con tests rotos.
- Verificar endpoints /healthz y /readyz en desarrollo y staging.

Historial: 2025-10-07: creado.