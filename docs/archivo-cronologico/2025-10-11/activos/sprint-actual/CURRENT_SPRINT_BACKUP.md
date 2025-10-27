# Estado Actual Sprint 2 - SGICS
**Fecha actualización**: 2025-10-11  
**Sprint**: N2 (13-24 octubre 2025)  
**Scrum Master**: Ricardo Sanhueza

---

## 🚨 ESTADO CRÍTICO - ACCIÓN REQUERIDA

### Participación Equipos
- **Activos**: 2/15 integrantes (13%) 
- **Contributors**: Ricardo Sanhueza, nilsonGuerraInacap
- **Equipos sin actividad**: Grupos A, H, Z (75% del equipo)

### Progreso por Módulo

#### ✅ Grupo C - DevOps/Personas (60% completo)
- **Lead**: Giovanni Porfirio
- **Activo**: Ricardo Sanhueza  
- **Estado**: CI/CD configurado, Docker listo
- **Pendiente**: Apps courses, health endpoints

#### 🟡 Grupo B - Pagos/QA (25% completo)
- **Lead**: Nicolas Gonzalez
- **Activo**: nilsonGuerraInacap (3 commits)
- **Estado**: Estructura creada, falta implementación
- **Pendiente**: Models, APIs, tests

#### 🔴 Grupo A - Auth/Seguridad (15% completo)
- **Lead**: Nicolas Irribarra
- **Estado**: Solo estructura, sin desarrollo
- **Crítico**: Login JWT, roles, permisos
- **Asignados**: Lucas Guerrero, Axel Villa

#### 🔴 Grupo H - Preinscripciones/Archivos (10% completo)
- **Lead**: Miguel Castillo  
- **Estado**: Estructura parcial
- **Crítico**: Wizard preinscripción, upload archivos
- **Asignados**: Juan Olivares, Leonardo Lagos

#### 🔴 Grupo Z - Perfiles (0% completo)
- **Lead**: Marisol Sepúlveda
- **Estado**: Sin inicializar
- **Crítico**: Todo el módulo por crear
- **Asignados**: Lucas Bustos, Rodrigo Jara, Josue Villalobos

---

## 📋 TAREAS CRÍTICAS PENDIENTES

### Hoy (11 Oct) - URGENTE
- [ ] **Contactar leads equipos inactivos**
  - Nicolas Irribarra (Grupo A)
  - Miguel Castillo (Grupo H) 
  - Marisol Sepúlveda (Grupo Z)
- [ ] **Crear ramas de trabajo** - `.\scripts\create_branches_from_csv.ps1`
- [ ] **Proteger rama main** - Solo Ricardo puede pushear directo
- [ ] **Confirmar participación** - Deadline 12 Oct EOD

### Esta Semana (12-13 Oct)
- [ ] **Redistribución si no responden** equipos
- [ ] **Sprint Planning definitivo** - 13 Oct
- [ ] **Setup workflow branches** por equipo
- [ ] **Daily standups** - L/M/V obligatorios

---

## 🎯 OBJETIVOS SPRINT 2 (Reducido por Riesgo)

### MVP Mínimo Viable
1. **Login básico** (Grupo A/B)
2. **Preinscripción wizard** paso 1 (Grupo H/C)  
3. **Dashboard básico** con datos mock (Grupo C)
4. **CI/CD funcionando** (Grupo C - ✅ listo)

### Si equipos se activan
1. **Pagos API** básica (Grupo B)
2. **Upload archivos** (Grupo H)
3. **Perfiles usuarios** (Grupo Z)

---

## 📊 MÉTRICAS DE PROGRESO

| Épica | Responsable | Progreso | Riesgo | Acción |
|-------|-------------|----------|---------|---------|
| SCRUM-7 (Auth) | Grupo A | 15% | 🔴 Alto | Contactar team |
| SCRUM-16 (Preinsc) | Grupo H | 10% | 🔴 Alto | Contactar team |
| SCRUM-18 (Pagos) | Grupo B | 25% | 🟡 Medio | Mantener ritmo |
| SCRUM-22 (Tests) | Grupo B/C | 30% | 🟡 Medio | Priorizar backend |
| SCRUM-24 (DevOps) | Grupo C | 60% | 🟢 Bajo | Completar health |
| SCRUM-30 (Dashboard) | Grupo C | 20% | 🟡 Medio | Iniciar componentes |
| SCRUM-35 (Archivos) | Grupo H | 5% | 🔴 Alto | Contactar team |

---

## 🚀 PLAN DE CONTINGENCIA

### Escenario A: Equipos responden (Optimista)
- Mantener asignaciones actuales
- Reforzar con pair programming
- Daily standups estrictos

### Escenario B: Algunos equipos no responden (Probable)
- **Grupo C** toma profiles (Grupo Z)
- **Grupo B** toma authentication (Grupo A)  
- **Grupo H** solo preinscripciones (no archivos)
- Diferir archivos upload a Sprint 3

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