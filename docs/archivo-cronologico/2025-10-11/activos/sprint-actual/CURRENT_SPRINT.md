# Sprint 2 Status - SGICS# Estado Actual Sprint 2 - SGICS

**Fecha actualización**: 2025-10-11  

**Sprint**: 13-24 Oct 2025 | **SM**: Ricardo Sanhueza | **Update**: 2025-10-11**Sprint**: N2 (13-24 octubre 2025)  

**Scrum Master**: Ricardo Sanhueza

---

---

## 🚨 STATUS CRÍTICO

## 🚨 ESTADO CRÍTICO - ACCIÓN REQUERIDA

### Participación: 2/15 (13%)

- **Activos**: Ricardo Sanhueza, nilsonGuerraInacap  ### Participación Equipos

- **Sin actividad**: 13 integrantes (87%)- **Activos**: 2/15 integrantes (13%) 

- **Contributors**: Ricardo Sanhueza, nilsonGuerraInacap

### Progreso Módulos- **Equipos sin actividad**: Grupos A, H, Z (75% del equipo)



| Grupo | Módulo | Lead | Estado | % | Crítico |### Progreso por Módulo

|---|---|---|---:|---:|---|

| **C** | DevOps/CI | Giovanni Porfirio | ✅ | 60% | Apps health endpoints |#### ✅ Grupo C - DevOps/Personas (60% completo)

| **B** | Pagos/QA | Nicolas Gonzalez | 🟡 | 25% | Models, APIs, tests |  - **Lead**: Giovanni Porfirio

| **A** | Auth | Nicolas Irribarra | 🔴 | 15% | JWT, roles, permisos |- **Activo**: Ricardo Sanhueza  

| **H** | Preinsc/Files | Miguel Castillo | 🔴 | 10% | Wizard, upload |- **Estado**: CI/CD configurado, Docker listo

| **Z** | Perfiles | [Sin lead] | 🔴 | 0% | Todo pendiente |- **Pendiente**: Apps courses, health endpoints



---#### 🟡 Grupo B - Pagos/QA (25% completo)

- **Lead**: Nicolas Gonzalez

## ⏰ ACCIONES URGENTES (Próximas 48h)- **Activo**: nilsonGuerraInacap (3 commits)

- **Estado**: Estructura creada, falta implementación

### Equipos Inactivos  - **Pendiente**: Models, APIs, tests

1. **Activar Grupo A** (Auth crítico)

   - Nicolas Irribarra + Lucas Guerrero + Axel Villa#### 🔴 Grupo A - Auth/Seguridad (15% completo)

   - **Deliverable**: Login JWT básico- **Lead**: Nicolas Irribarra

- **Estado**: Solo estructura, sin desarrollo

2. **Activar Grupo H** (Preinscripciones crítico)  - **Crítico**: Login JWT, roles, permisos

   - Miguel Castillo + Juan Olivares + Leonardo Lagos- **Asignados**: Lucas Guerrero, Axel Villa

   - **Deliverable**: Wizard paso 1

#### 🔴 Grupo H - Preinscripciones/Archivos (10% completo)

3. **Definir Grupo Z** (Perfiles)- **Lead**: Miguel Castillo  

   - Asignar lead + 2 desarrolladores- **Estado**: Estructura parcial

   - **Deliverable**: Modelo User básico- **Crítico**: Wizard preinscripción, upload archivos

- **Asignados**: Juan Olivares, Leonardo Lagos

### Bloqueos Técnicos

- **Dependencias**: Auth (Grupo A) requerido para otros módulos#### 🔴 Grupo Z - Perfiles (0% completo)

- **Infraestructura**: OK (Grupo C completado)- **Lead**: Marisol Sepúlveda

- **Conocimiento**: Falta onboarding técnico equipos- **Estado**: Sin inicializar

- **Crítico**: Todo el módulo por crear

---- **Asignados**: Lucas Bustos, Rodrigo Jara, Josue Villalobos



## 📊 MÉTRICAS SPRINT---



### Commits (Últimos 7 días)## 📋 TAREAS CRÍTICAS PENDIENTES

- **Total**: 15 commits

- **Ricardo Sanhueza**: 12 commits (80%)### Hoy (11 Oct) - URGENTE

- **nilsonGuerraInacap**: 3 commits (20%)- [ ] **Contactar leads equipos inactivos**

- **Otros**: 0 commits  - Nicolas Irribarra (Grupo A)

  - Miguel Castillo (Grupo H) 

### Epics Progress  - Marisol Sepúlveda (Grupo Z)

- **SGICS-E-AUTH**: 15% (Crítico - 5 días restantes)  - [ ] **Crear ramas de trabajo** - `.\scripts\create_branches_from_csv.ps1`

- **SGICS-E-PREINS**: 10% (Crítico - 8 días restantes)- [ ] **Proteger rama main** - Solo Ricardo puede pushear directo

- **SGICS-E-PAY**: 25% (En riesgo - 2 días restantes)- [ ] **Confirmar participación** - Deadline 12 Oct EOD

- **SGICS-E-DEVOPS**: 60% (En track)

- **SGICS-E-FILES**: 10% (En riesgo)### Esta Semana (12-13 Oct)

- [ ] **Redistribución si no responden** equipos

---- [ ] **Sprint Planning definitivo** - 13 Oct

- [ ] **Setup workflow branches** por equipo

## 🎯 OBJETIVOS SEMANA (Oct 12-18)- [ ] **Daily standups** - L/M/V obligatorios



### Must Have---

1. **Auth básico** (Login JWT) - Grupo A

2. **Preinsc paso 1** (Select curso + RUT) - Grupo H  ## 🎯 OBJETIVOS SPRINT 2 (Reducido por Riesgo)

3. **Pagos API** (POST /payments) - Grupo B

### MVP Mínimo Viable

### Should Have  1. **Login básico** (Grupo A/B)

4. **Tests coverage** 50%+ - Todos los grupos2. **Preinscripción wizard** paso 1 (Grupo H/C)  

5. **Deploy staging** automático - Grupo C3. **Dashboard básico** con datos mock (Grupo C)

4. **CI/CD funcionando** (Grupo C - ✅ listo)

### Nice to Have

6. **Dashboard básico** - Asignar equipo### Si equipos se activan

7. **Files upload** - Grupo H1. **Pagos API** básica (Grupo B)

2. **Upload archivos** (Grupo H)

---3. **Perfiles usuarios** (Grupo Z)



## 🆘 ESCALACIONES---



### Inmediata (Hoy)## 📊 MÉTRICAS DE PROGRESO

- **Contactar leads inactivos** vía Slack/email

- **Reunión emergencia** con Nicolas Irribarra (Auth)| Épica | Responsable | Progreso | Riesgo | Acción |

- **Reasignar Grupo Z** si no hay respuesta|-------|-------------|----------|---------|---------|

| SCRUM-7 (Auth) | Grupo A | 15% | 🔴 Alto | Contactar team |

### Esta Semana| SCRUM-16 (Preinsc) | Grupo H | 10% | 🔴 Alto | Contactar team |

- **Daily standups** obligatorios 9am| SCRUM-18 (Pagos) | Grupo B | 25% | 🟡 Medio | Mantener ritmo |

- **Code review** mínimo 1 persona por PR| SCRUM-22 (Tests) | Grupo B/C | 30% | 🟡 Medio | Priorizar backend |

- **Demo parcial** viernes para stakeholders| SCRUM-24 (DevOps) | Grupo C | 60% | 🟢 Bajo | Completar health |

| SCRUM-30 (Dashboard) | Grupo C | 20% | 🟡 Medio | Iniciar componentes |

### Contingencia| SCRUM-35 (Archivos) | Grupo H | 5% | 🔴 Alto | Contactar team |

- **Reducir scope**: Solo Auth + Preinscripciones si no hay más participación

- **Extensión sprint**: +1 semana si 50% equipos activos para Oct 15---

- **Cancelar épicas**: Files y Dashboard si <3 equipos activos

## 🚀 PLAN DE CONTINGENCIA

---

### Escenario A: Equipos responden (Optimista)

## 📞 CONTACTS- Mantener asignaciones actuales

- Reforzar con pair programming

- **SM**: Ricardo Sanhueza - `@rsanhueza` Slack  - Daily standups estrictos

- **PO**: [Pendiente asignación]

- **DevOps**: Giovanni Porfirio - Grupo C### Escenario B: Algunos equipos no responden (Probable)

- **QA Lead**: Nicolas Gonzalez - Grupo B- **Grupo C** toma profiles (Grupo Z)

- **Grupo B** toma authentication (Grupo A)  

---- **Grupo H** solo preinscripciones (no archivos)

- Diferir archivos upload a Sprint 3

**⚠️ ACTUALIZACIÓN DIARIA OBLIGATORIA - Próxima: 2025-10-12 9:00am**
### Escenario C: Solo 2-3 equipos activos (Pesimista)
- **MVP ultra-reducido**: Login + Preinscripción básica
- **Grupo C**: Infraestructura + Login + Dashboard
- **Grupo B**: Preinscripciones + Pagos básico
- **Frontend**: Solo componentes críticos

---

## 📞 CONTACTOS Y ACCIONES

### Contactar HOY (WhatsApp/Email/Discord)
1. **Nicolas Irribarra** - Confirmar disponibilidad Grupo A
2. **Miguel Castillo** - Estado Grupo H, timeline
3. **Marisol Sepúlveda** - Activación Grupo Z
4. **Giovanni Porfirio** - Coordinar Grupo C expansion
5. **Nicolas Gonzalez** - Mantener momentum Grupo B

### Mensaje template
```
Hola [Nombre], soy Ricardo (Scrum Master SGICS).

Sprint 2 inicia 13-Oct. Tu equipo tiene tareas críticas asignadas:
- [Listar épicas específicas]

Necesito confirmación URGENTE:
1. ¿Estás disponible para el sprint?
2. ¿Tu equipo puede cumplir las fechas?
3. ¿Necesitas apoyo/recursos adicionales?

Deadline respuesta: 12-Oct EOD
Si no respondes, redistribuiré tareas.

Gracias,
Ricardo
```

---

## 📝 PRÓXIMA ACTUALIZACIÓN
**Fecha**: 2025-10-12 18:00  
**Evento**: Post-contacto equipos  
**Decisión**: Redistribución final o confirmación equipos

---

## 🔗 ENLACES RÁPIDOS
- **Backlog**: `docs/sprint/sprint2-backlog.md`
- **Git Guide**: `docs/workflow/git-workflow.md`  
- **PR Checklist**: `docs/workflow/pr-checklist.md`
- **CSV Tareas**: `sgcis_2025-10-11_03.06pm.csv`
- **Script Branches**: `scripts/create_branches_from_csv.ps1`

---
*Documento vivo - actualizar diariamente durante Sprint 2*