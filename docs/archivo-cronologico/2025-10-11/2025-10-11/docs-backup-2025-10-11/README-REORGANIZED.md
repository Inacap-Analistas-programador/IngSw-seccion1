# Documentación SGICS - Reorganizada 2025-10-11

## Estructura Actual vs Propuesta

### DOCUMENTOS ACTIVOS (Mantener en `docs/`)
Estos documentos son esenciales para el Sprint 2 actual:

#### Flujo de Trabajo y Desarrollo
- `git-workflow.md` - Guía Git actualizada ✅ (creada hoy)
- `branching-pr-guide.md` - Convenciones de branches ✅ 
- `pr-checklist.md` - Checklist para PRs ✅
- `patterns-conventions.md` - Patrones Singleton/Factory ✅

#### Requerimientos y Sprint Actual  
- `REQUERIMIENTOS_ACTUALIZADOS.md` - RF/RNF vigentes ✅
- `sprint2-backlog.md` - Backlog Sprint 2 ✅
- `ANALISIS_PROGRESO_EQUIPOS_SPRINT2.md` - Estado equipos ✅

#### Herramientas y CI/CD
- `TESTING_CI_COMMANDS.md` - Comandos testing ✅
- `jira/pipeline-ci-cd-git-actions.md` - Pipeline CI/CD ✅

### DOCUMENTOS LEGACY (Mover a `docs/legacy/`)
Documentos históricos importantes pero no activos:

#### Análisis Inicial (Julio-Agosto 2025)
- `ANALISIS_TOMA_REQUERIMIENTOS_SGICS.md` → `legacy/2025-07/`
- `INFORME_COMPLETO_SGICS_INACAP.md` → `legacy/2025-08/`
- `INFORME_OFICIAL_SGICS.md` → `legacy/2025-08/`

#### Planificación Previa (Septiembre 2025)
- `CARTA_GANTT_SGICS_COMPLETA.md` → `legacy/2025-09/`
- `ASIGNACION_EQUIPOS_SPRINT2.md` → `legacy/2025-09/`
- `ASIGNACION_GRUPOS_MODULOS_SGICS.md` → `legacy/2025-09/`
- `ASIGNACION_MODULOS_DIAGRAMAS_EQUIPOS.md` → `legacy/2025-09/`

#### Documentación Técnica Previa (Octubre 2025)
- `DIAGRAMAS_UML_ACTUALIZADOS.md` → `legacy/2025-10-01/`
- `complexity-estimates.md` → `legacy/2025-10-01/`
- `epics-stories-roadmap.md` → `legacy/2025-10-01/`

### DOCUMENTOS A CONSOLIDAR/ELIMINAR
Duplicados o no necesarios:

#### Para Consolidación
- `sprint-schedule.md` + `sprint-schedule-and-git-guide.md` → Consolidar en `sprint2-backlog.md`
- `jira-import-readme.md` + `jira-import-sprint2.csv` → Mover a `tools/jira/`

#### Para Eliminación/Archivo
- `PROMPT_DEFINITIVO.md` → `legacy/prompts/`
- `PROMPTS_MOCKUPS_FRONTEND_SGICS.md` → `legacy/prompts/`
- `ACTA_DE_DEFINICION_DEL_DOCUMENTO.md` → `legacy/actas/`
- `GUIA_INFORMATIVA_PROYECTO_SGICS.md` → `legacy/guias/`
- `GUIA_RAPIDA.md` → `legacy/guias/`

### NUEVA ESTRUCTURA PROPUESTA

```
docs/
├── README.md (este archivo)
├── CURRENT_SPRINT.md (nuevo - estado actual Sprint 2)
├── 
├── workflow/
│   ├── git-workflow.md
│   ├── branching-pr-guide.md
│   ├── pr-checklist.md
│   └── patterns-conventions.md
├── 
├── requirements/
│   ├── REQUERIMIENTOS_ACTUALIZADOS.md
│   └── RASTREABILIDAD_RF_QA_DEV.md
├── 
├── sprint/
│   ├── sprint2-backlog.md
│   ├── ANALISIS_PROGRESO_EQUIPOS_SPRINT2.md
│   └── TESTING_CI_COMMANDS.md
├── 
├── tools/
│   ├── jira/
│   │   ├── pipeline-ci-cd-git-actions.md
│   │   ├── jira-import-readme.md
│   │   └── jira-import-sprint2.csv
│   └── scripts/ (enlace a ../scripts/)
├── 
├── assets/ (mantener)
├── epics/ (mantener - documentos actuales)
├── schema/ (mantener)
├── 
├── legacy/
│   ├── 2025-07/ (análisis inicial)
│   ├── 2025-08/ (informes)
│   ├── 2025-09/ (planificación)
│   ├── 2025-10-01/ (documentación técnica previa)
│   ├── prompts/
│   ├── actas/
│   ├── guias/
│   └── archive/ (todo lo demás)
└── 
└── archivos-por-fecha/ (mantener - archivo cronológico)
```

## Acciones Ejecutadas Hoy (2025-10-11)

### Creados ✅
- `git-workflow.md` - Guía completa Git/PowerShell
- `.github/CODEOWNERS` - Control revisiones PRs  
- `scripts/create_branches_from_csv.ps1` - Automatización ramas
- `archivos-por-fecha/2025-10-11/` - Estructura archivo

### Por Hacer 🔄
1. **Reorganizar archivos por relevancia** (en progreso)
2. **Crear `CURRENT_SPRINT.md`** con estado actual
3. **Mover legacy por fechas** según contenido
4. **Consolidar documentos duplicados**
5. **Actualizar enlaces cruzados**

## Próximos Pasos Sprint 2

### Inmediatos (Hoy)
1. Ejecutar script crear ramas: `.\scripts\create_branches_from_csv.ps1`
2. Configurar protección rama `main` en GitHub
3. Activar equipos inactivos (Grupos A, H, Z)

### Esta Semana
1. Implementar workflow branches por equipo
2. Configurar CI/CD pipeline actualizado  
3. Establecer Daily Standups obligatorios

### Sprint 2 (13-24 Oct)
1. Completar épicas críticas: Auth, Preinscripciones, Dashboard
2. Tests automatizados funcionando
3. Demo funcional al cierre

## Documentos Críticos para Consulta Diaria

1. **`REQUERIMIENTOS_ACTUALIZADOS.md`** - RF/RNF vigentes
2. **`sprint2-backlog.md`** - Tareas y estimaciones  
3. **`ANALISIS_PROGRESO_EQUIPOS_SPRINT2.md`** - Estado equipos
4. **`git-workflow.md`** - Comandos Git diarios
5. **`pr-checklist.md`** - Antes de cada PR

---
*Documento creado: 2025-10-11*  
*Próxima revisión: 2025-10-18 (mitad Sprint 2)*