# CARTA GANTT SISTEMA SGICS - PROMPT ERASER.IO

**Proyecto:** Sistema de Gestión Integral para Cursos Scouts (SGICS)  
**Duración Total:** 14 semanas (3.5 meses)  
**Equipo:** 18 desarrolladores en 6 módulos especializados  
**Metodología:** Scrum con sprints de 2 semanas  
**Fecha de Actualización:** 28 Septiembre 2025

---

## PROMPT PARA ERASER.IO - GANTT CHART

```text
Create a comprehensive Gantt chart for SGICS (Scout Course Management System) project with the following structure:

**PROJECT TIMELINE: 14 WEEKS (3.5 MONTHS)**
**METHODOLOGY: Scrum with 2-week sprints**
**TEAM: 18 developers in 6 specialized modules**

**SPRINT STRUCTURE:**
Sprint 0: Project Setup (Weeks 1-2)
Sprint 1: Core Foundation (Weeks 3-4)
Sprint 2: Technical Base (Weeks 5-6)
Sprint 3: Business Logic (Weeks 7-8)
Sprint 4: Integration & Testing (Weeks 9-10)
Sprint 5: UI/UX & Frontend (Weeks 11-12)
Sprint 6: Final Testing & Deployment (Weeks 13-14)

**MODULE TRACKS (6 PARALLEL MODULES):**

**MODULE 1 - INFRASTRUCTURE & DEVOPS**
Team: Ricardo Sanhueza (Lead), Giovanni Pacheco
Tasks:
- Week 1-2: Docker setup + Microsoft SQL Server configuration (Always Encrypted, backups)
- Week 3-4: CI/CD pipeline (GitHub Actions + SonarQube quality gate + Jira automation)
- Week 5-6: Monitoring setup (Prometheus/Grafana + alert rules)
- Week 7-8: Production deployment automation (Docker Compose/AKS)
- Week 9-10: Security hardening + automated backup systems
- Week 11-12: Performance optimization + load testing enablement
- Week 13-14: Final deployment + observability handover

**MODULE 2 - AUTHENTICATION & SECURITY**
Team: Nicolás Irribarra (Lead), Josué Vásquez, Lucas Guerrero
Tasks:
- Week 1-2: JWT authentication system
- Week 3-4: RBAC implementation (6 roles)
- Week 5-6: Rate limiting + security middleware
- Week 7-8: Audit logging system
- Week 9-10: Security testing + penetration tests
- Week 11-12: Password policies + 2FA preparation
- Week 13-14: Security documentation + final hardening

**MODULE 3 - USER INTERFACE & PROFILES**
Team: Lucas Betanzos (Lead), Marisol Sáez, Rodrigo Jara
Tasks:
- Week 1-2: Vue 3 + Vite + TypeScript setup with Tailwind component library
- Week 3-4: Base components + design system tokens in Storybook
- Week 5-6: User profile forms + Pinia stores and validation
- Week 7-8: Dashboard layouts + responsive design with reusable charts
- Week 9-10: Integration with authentication APIs + secured API clients
- Week 11-12: UI/UX refinement + accessibility (WCAG 2.1 AA)
- Week 13-14: Cross-browser testing + performance budgets (Lighthouse)

**MODULE 4 - PREINSCRIPTIONS & FORMS**
Team: Miguel Contreras (Lead), Juan Orrego, Leonardo López
Tasks:
- Week 1-2: State machine design (7 states)
- Week 3-4: Multi-step wizard implementation
- Week 5-6: File upload system + validation
- Week 7-8: Business rules engine
- Week 9-10: Integration testing + workflow validation
- Week 11-12: Email notifications + auto-save
- Week 13-14: End-to-end testing + optimization

**MODULE 5 - PAYMENTS & FINANCE**
Team: Camilo Colivoro (Individual)
Tasks:
- Week 1-2: Payment models + SQL Server schema design (Always Encrypted fields)
- Week 3-4: Individual payment processing + Django integration
- Week 5-6: Batch import system (Excel/CSV) with validation to SQL Server
- Week 7-8: Financial dashboard (Chart.js) aligned with design system
- Week 9-10: Auto-confirmation logic + automated reconciliation testing
- Week 11-12: Reports + KPI dashboards (Power BI connectors)
- Week 13-14: Financial system validation + security (PCI readiness)

**MODULE 6 - QUALITY CONTROL & DOCUMENTATION**
Team: Nicolás González (Lead), Juan Herrera
Tasks:
- Week 1-2: Testing framework setup (pytest/vitest) + SonarQube project bootstrap
- Week 3-4: Unit tests + coverage configuration + Sonar quality profiles
- Week 5-6: Integration tests + API documentation (OpenAPI/AsyncAPI)
- Week 7-8: E2E testing (Playwright) + Jira traceability dashboards
- Week 9-10: Performance testing + load testing (k6)
- Week 11-12: Documentation completion + QA gates in GitHub Actions
- Week 13-14: Final testing + deployment validation + Jira release notes

**MILESTONES & DEPENDENCIES:**
Week 2: ✓ Environment ready (Docker, SQL Server, Jira projects)
Week 4: ✓ Authentication system functional + SonarQube quality gate active
Week 6: ✓ Basic UI components (Vue 3 + Vite) + SQL Server schema stable
Week 8: ✓ Core business logic implemented
Week 10: ✓ System integration complete
Week 12: ✓ UI/UX finalized + quality gates passing
Week 14: ✓ Production deployment ready + runbook approved

**CRITICAL PATH:**
Infrastructure Setup → Authentication → Database Models → Business Logic → UI Integration → Testing → Deployment

**RESOURCE ALLOCATION:**
- Backend developers: 50% (9 people)
- Frontend developers: 28% (5 people)  
- DevOps/Infrastructure: 11% (2 people)
- QA/Testing: 11% (2 people)

**RISK FACTORS:**
- Week 3-4: Authentication + SonarQube pipeline integration risk
- Week 7-8: State machine integration + transactional workflows risk
- Week 11-12: UI/UX iteration + performance budget risk
- Week 13-14: Production deployment (SQL Server HA + observability) risk

Use different colors for each module track:
- Blue: Infrastructure & DevOps
- Red: Authentication & Security  
- Green: User Interface & Profiles
- Orange: Preinscriptions & Forms
- Purple: Payments & Finance
- Gray: Quality Control & Documentation

Show dependencies with arrows, milestones with diamonds, and critical path with bold lines.
Include team member names in task bars and show parallel vs sequential tasks clearly.
```

---

## INSTRUCCIONES DE USO EN ERASER.IO

### Pasos para Crear el Gantt:

1. **Acceder a Eraser.io:** https://app.eraser.io/
2. **Seleccionar:** "Flow Chart" o "Autodetect"
3. **Copiar y pegar** el prompt completo de arriba
4. **Generar** el diagrama automáticamente
5. **Ajustar manualmente:**
   - Colores por módulo
   - Posición de barras temporales
   - Flechas de dependencias
   - Diamantes para hitos

### Configuración Recomendada:
- **Orientación:** Horizontal (landscape)
- **Escala temporal:** Semanal
- **Colores:** Consistentes por módulo
- **Tamaño:** A3 o A4 horizontal

### Elementos Clave a Verificar:
- ✅ 6 tracks paralelos (módulos)
- ✅ 14 semanas de duración
- ✅ 7 sprints claramente marcados
- ✅ Hitos cada 2 semanas
- ✅ Dependencias críticas marcadas
- ✅ Nombres de responsables visible
- ✅ Código de colores por módulo

---

## ALTERNATIVA SIMPLIFICADA PARA ERASER.IO

Si el prompt anterior es muy complejo, usa esta versión simplificada:

```text
Create a Gantt chart for SGICS project:

14 weeks total, 6 parallel modules:

Module 1 (Blue): Infrastructure - Weeks 1-14 (Ricardo S., Giovanni P.)
Module 2 (Red): Authentication - Weeks 1-14 (Nicolás I., Josué V., Lucas G.)
Module 3 (Green): Frontend UI - Weeks 1-14 (Lucas B., Marisol S., Rodrigo J.)
Module 4 (Orange): Forms/States - Weeks 1-14 (Miguel C., Juan O., Leonardo L.)
Module 5 (Purple): Payments - Weeks 1-14 (Camilo C.)
Module 6 (Gray): Testing/QA - Weeks 1-14 (Nicolás G., Juan H.)

Milestones every 2 weeks: Setup, Auth, UI Base, Logic, Integration, Testing, Deploy

Show dependencies and critical path.
```

**¡Copia cualquiera de los dos prompts en Eraser.io para generar tu Carta Gantt profesional!**