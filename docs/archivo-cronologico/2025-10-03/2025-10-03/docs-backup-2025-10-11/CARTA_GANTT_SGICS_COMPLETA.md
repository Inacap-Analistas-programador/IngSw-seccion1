# CARTA GANTT - PROYECTO SGICS

**Proyecto:** Sistema de Gestión Integral para Cursos Scouts (SGICS)  
**Duración:** 12 semanas (6 sprints de 2 semanas)  
**Fecha Inicio:** 29 Septiembre 2025  
**Fecha Fin:** 20 Diciembre 2025  
**Equipo:** 14 desarrolladores en 6 módulos especializados

---

## 📅 **CRONOGRAMA GENERAL DEL PROYECTO**

```mermaid
gantt
    title SGICS - Cronograma General (12 semanas)
    dateFormat  YYYY-MM-DD
    axisFormat %d-%m

    section SPRINT 1 - FUNDACIONES
    Setup Infraestructura        :s1-infra, 2025-09-29, 14d
    Autenticación Base           :s1-auth, 2025-09-29, 14d
    Setup Frontend               :s1-front, 2025-09-29, 14d
    Configuración BD             :s1-db, 2025-09-29, 14d

    section SPRINT 2 - DESARROLLO CORE
    Módulo Archivos              :s2-arch, 2025-10-13, 14d
    Módulo Cursos                :s2-cursos, 2025-10-13, 14d
    Módulo Preinscripciones      :s2-preinsc, 2025-10-13, 14d
    Módulo Pagos                 :s2-pagos, 2025-10-13, 14d
    Módulo Notificaciones        :s2-notif, 2025-10-13, 14d

    section SPRINT 3 - INTEGRACIÓN
    APIs y Servicios             :s3-api, 2025-10-27, 14d
    Base de Datos                :s3-db, 2025-10-27, 14d
    Flujos de Negocio            :s3-business, 2025-10-27, 14d
    Testing Integración          :s3-test, 2025-10-27, 14d

    section SPRINT 4 - FUNCIONALIDADES
    Dashboard Ejecutivo          :s4-dash, 2025-11-10, 14d
    Reportes y Analytics         :s4-reports, 2025-11-10, 14d
    Validaciones Territoriales   :s4-valid, 2025-11-10, 14d
    Notificaciones Automáticas   :s4-auto, 2025-11-10, 14d

    section SPRINT 5 - REFINAMIENTO
    UI/UX Optimization           :s5-ui, 2025-11-24, 14d
    Performance Tuning           :s5-perf, 2025-11-24, 14d
    Testing End-to-End           :s5-e2e, 2025-11-24, 14d
    Security Hardening           :s5-sec, 2025-11-24, 14d

    section SPRINT 6 - DESPLIEGUE
    Deploy Producción            :s6-deploy, 2025-12-08, 12d
    Training Usuarios            :s6-training, 2025-12-08, 12d
    Documentación Final          :s6-docs, 2025-12-08, 12d
    Go-Live                      :milestone, 2025-12-20, 0d
```

---

## 🏗️ **CRONOGRAMA DETALLADO POR MÓDULOS**

### **MÓDULO 1: ARCHIVOS (Giovanni Pacheco - Ricardo Sanhueza)**

```mermaid
gantt
    title Módulo Archivos - 12 semanas
    dateFormat  YYYY-MM-DD
    axisFormat %d-%m

    section Sprint 1
    Docker + MinIO Setup         :arch1-1, 2025-09-29, 7d
    Base Models + Migrations     :arch1-2, 2025-10-06, 7d
    
    section Sprint 2  
    Upload/Download APIs         :arch2-1, 2025-10-13, 7d
    Antivirus Integration        :arch2-2, 2025-10-20, 7d
    
    section Sprint 3
    File Versioning              :arch3-1, 2025-10-27, 7d
    Security + Permissions       :arch3-2, 2025-11-03, 7d
    
    section Sprint 4
    CDN + Performance           :arch4-1, 2025-11-10, 7d
    Backup Automation           :arch4-2, 2025-11-17, 7d
    
    section Sprint 5
    Testing + Optimization      :arch5-1, 2025-11-24, 7d
    Documentation               :arch5-2, 2025-12-01, 7d
    
    section Sprint 6
    Production Deployment       :arch6-1, 2025-12-08, 6d
    Monitoring Setup            :arch6-2, 2025-12-14, 6d
```

### **MÓDULO 2: CURSOS (Nicolás Irribarra - Lucas Guerrero)**

```mermaid
gantt
    title Módulo Cursos - 12 semanas
    dateFormat  YYYY-MM-DD
    axisFormat %d-%m

    section Sprint 1
    RBAC + Permissions          :curso1-1, 2025-09-29, 7d
    Course Models + API         :curso1-2, 2025-10-06, 7d
    
    section Sprint 2
    CRUD Completo + Validation  :curso2-1, 2025-10-13, 7d
    Estado Workflow             :curso2-2, 2025-10-20, 7d
    
    section Sprint 3
    Cupos + Lista Espera        :curso3-1, 2025-10-27, 7d
    Asignación Formadores       :curso3-2, 2025-11-03, 7d
    
    section Sprint 4
    Calendario + Fechas         :curso4-1, 2025-11-10, 7d
    Reportes Curso              :curso4-2, 2025-11-17, 7d
    
    section Sprint 5
    Security Audit              :curso5-1, 2025-11-24, 7d
    Performance Testing         :curso5-2, 2025-12-01, 7d
    
    section Sprint 6
    Deploy + Documentation      :curso6-1, 2025-12-08, 12d
```

### **MÓDULO 3: NOTIFICACIONES (Marisol Sáez - Lucas Betanzos - Rodrigo Jara - Josué Vásquez)**

```mermaid
gantt
    title Módulo Notificaciones - 12 semanas  
    dateFormat  YYYY-MM-DD
    axisFormat %d-%m

    section Sprint 1
    Message Queue Setup         :notif1-1, 2025-09-29, 7d
    Email Templates             :notif1-2, 2025-10-06, 7d
    
    section Sprint 2
    In-App Notifications        :notif2-1, 2025-10-13, 7d
    SMS Integration             :notif2-2, 2025-10-20, 7d
    
    section Sprint 3
    Bulk Email System           :notif3-1, 2025-10-27, 7d
    User Preferences            :notif3-2, 2025-11-03, 7d
    
    section Sprint 4
    Push Notifications          :notif4-1, 2025-11-10, 7d
    Analytics Dashboard         :notif4-2, 2025-11-17, 7d
    
    section Sprint 5
    UI/UX Refinement            :notif5-1, 2025-11-24, 7d
    Performance + Testing       :notif5-2, 2025-12-01, 7d
    
    section Sprint 6
    Production Deploy           :notif6-1, 2025-12-08, 12d
```

### **MÓDULO 4: PREINSCRIPCIONES (Miguel Contreras - Juan Orrego - Leonardo López)**

```mermaid
gantt
    title Módulo Preinscripciones - 12 semanas
    dateFormat  YYYY-MM-DD
    axisFormat %d-%m

    section Sprint 1
    State Machine Design        :preinsc1-1, 2025-09-29, 7d
    Base Models + DB            :preinsc1-2, 2025-10-06, 7d
    
    section Sprint 2
    Wizard Multi-Step           :preinsc2-1, 2025-10-13, 7d
    Validation Rules            :preinsc2-2, 2025-10-20, 7d
    
    section Sprint 3
    Validación Territorial      :preinsc3-1, 2025-10-27, 7d
    Payment Integration         :preinsc3-2, 2025-11-03, 7d
    
    section Sprint 4
    Auto-Save + Recovery        :preinsc4-1, 2025-11-10, 7d
    Status Notifications        :preinsc4-2, 2025-11-17, 7d
    
    section Sprint 5
    Testing + QA                :preinsc5-1, 2025-11-24, 7d
    UI Polish                   :preinsc5-2, 2025-12-01, 7d
    
    section Sprint 6
    Production Launch           :preinsc6-1, 2025-12-08, 12d
```

### **MÓDULO 5: PAGOS (Camilo Colivoro)**

```mermaid
gantt
    title Módulo Pagos - 12 semanas
    dateFormat  YYYY-MM-DD
    axisFormat %d-%m

    section Sprint 1
    Payment Models + DB         :pago1-1, 2025-09-29, 14d
    
    section Sprint 2
    Individual Payments         :pago2-1, 2025-10-13, 7d
    Excel Import System         :pago2-2, 2025-10-20, 7d
    
    section Sprint 3
    Reconciliation Logic        :pago3-1, 2025-10-27, 14d
    
    section Sprint 4
    Financial Dashboard         :pago4-1, 2025-11-10, 7d
    Reports + KPIs              :pago4-2, 2025-11-17, 7d
    
    section Sprint 5
    Testing + Validation        :pago5-1, 2025-11-24, 14d
    
    section Sprint 6
    Deploy + Training           :pago6-1, 2025-12-08, 12d
```

### **MÓDULO 6: DASHBOARD (Nicolás González - Juan Herrera)**

```mermaid
gantt
    title Módulo Dashboard - 12 semanas
    dateFormat  YYYY-MM-DD
    axisFormat %d-%m

    section Sprint 1
    Base Dashboard Setup        :dash1-1, 2025-09-29, 14d
    
    section Sprint 2
    Integration Planning        :dash2-1, 2025-10-13, 14d
    
    section Sprint 3
    API Aggregation             :dash3-1, 2025-10-27, 14d
    
    section Sprint 4
    Executive KPIs              :dash4-1, 2025-11-10, 7d
    Real-time Metrics           :dash4-2, 2025-11-17, 7d
    
    section Sprint 5
    Reports Generation          :dash5-1, 2025-11-24, 7d
    E2E Testing                 :dash5-2, 2025-12-01, 7d
    
    section Sprint 6
    Final Integration           :dash6-1, 2025-12-08, 12d
```

---

## 🎯 **HITOS PRINCIPALES**

```mermaid
timeline
    title Hitos Críticos del Proyecto SGICS
    
    Sprint 1 : Infraestructura Completa
             : Autenticación Funcional
             : Ambientes Configurados
    
    Sprint 2 : Módulos Core Desarrollados
             : APIs Básicas Funcionando
             : Testing Inicial
    
    Sprint 3 : Integración Completada
             : Base de Datos Estable
             : Flujos de Negocio
    
    Sprint 4 : Features Completas
             : Dashboard Operativo
             : Validaciones Funcionando
    
    Sprint 5 : Sistema Pulido
             : Performance Optimizada
             : Testing E2E Completo
    
    Sprint 6 : Go-Live
             : Producción Estable
             : Usuarios Entrenados
```

---

## 📊 **DISTRIBUCIÓN DE ESFUERZO POR SPRINT**

| Sprint | Semanas | Archivos | Cursos | Notificaciones | Preinscripciones | Pagos | Dashboard | Total Points |
|--------|---------|----------|---------|---------------|------------------|-------|-----------|--------------|
| Sprint 1 | 1-2 | 40 | 35 | 25 | 30 | 20 | 25 | 175 |
| Sprint 2 | 3-4 | 45 | 40 | 35 | 40 | 25 | 20 | 205 |
| Sprint 3 | 5-6 | 35 | 35 | 30 | 35 | 30 | 35 | 200 |
| Sprint 4 | 7-8 | 25 | 30 | 40 | 30 | 35 | 45 | 205 |
| Sprint 5 | 9-10 | 30 | 25 | 30 | 25 | 25 | 30 | 165 |
| Sprint 6 | 11-12 | 25 | 20 | 20 | 20 | 15 | 25 | 125 |

**Total Proyecto:** 1,075 story points en 12 semanas

---

## ⚠️ **RIESGOS Y DEPENDENCIAS**

### **Riesgos Críticos:**
1. **Dependencia SQL Server Legacy** - Mitigación: Fallbacks DRF locales
2. **Integración Compleja** - Mitigación: APIs bien definidas desde Sprint 1
3. **Performance BD** - Mitigación: Índices y optimización en Sprint 3
4. **Testing E2E** - Mitigación: Testing continuo desde Sprint 2

### **Dependencias Críticas:**
```
CURSOS → PREINSCRIPCIONES → PAGOS → DASHBOARD
    ↓         ↓              ↓
NOTIFICACIONES (eventos de cambio de estado)
    ↓
ARCHIVOS (documentos por curso)
```

---

## 🚀 **CRITERIOS DE ÉXITO POR SPRINT**

### **Sprint 1 - Fundaciones (Semanas 1-2):**
- [ ] Docker compose funcional al 100%
- [ ] Autenticación JWT operativa
- [ ] CI/CD pipeline ejecutándose
- [ ] Ambientes dev/staging configurados

### **Sprint 2 - Core Development (Semanas 3-4):**
- [ ] Todos los módulos con CRUD básico
- [ ] APIs documentadas y funcionando
- [ ] Testing unitario >70% coverage
- [ ] Integración base entre módulos

### **Sprint 3 - Integración (Semanas 5-6):**
- [ ] Flujos end-to-end funcionando
- [ ] Base de datos optimizada
- [ ] Performance tests passed
- [ ] Security audit inicial

### **Sprint 4 - Funcionalidades (Semanas 7-8):**
- [ ] Dashboard con métricas reales
- [ ] Notificaciones automáticas
- [ ] Reportes generándose
- [ ] Validaciones territoriales completas

### **Sprint 5 - Refinamiento (Semanas 9-10):**
- [ ] UI/UX pulida y responsive
- [ ] Performance optimizada
- [ ] Testing E2E completo
- [ ] Security hardening

### **Sprint 6 - Go Live (Semanas 11-12):**
- [ ] Deploy producción exitoso
- [ ] Usuarios entrenados
- [ ] Documentación completa
- [ ] Sistema monitoreado

---

**✅ Esta Carta Gantt asegura entregas incrementales cada 2 semanas con valor de negocio demostrable y riesgo controlado.**