# Epic: Dashboard Cursos (SGICS-E-DASH)

**Vencimiento**: 2025-10-22 | **Estado**: To Do | **Puntos**: 8

## Objetivo
Panel control cursos: estadísticas, preinscripciones, pagos → decisiones operativas

## Alcance
### ✅ Debe tener:
- `/api/dashboard/courses/` (métricas por curso)
- Widgets: inscritos, pagos confirmados, pendientes
- Filtros: fecha, grupo territorial, estado
- Export básico CSV

### ⚠️ Fuera del alcance:
- Dashboard tiempo real
- Gráficos avanzados  
- Alertas automáticas

**Prioridad**: Media | **Riesgo**: Bajo

## Historias
| Key | Título | Assignee | Puntos | Estado |
|---|---|---:|---:|---:|
| SGICS-601 | API métricas cursos | Grupo D | 4 | To Do |
| SGICS-602 | Frontend dashboard + widgets | Grupo D | 4 | To Do |

## SGICS-601 — API Métricas
- `GET /api/dashboard/courses/` → estadísticas agregadas
- Métricas: total_preinscriptions, confirmed_payments, pending_validations
- Filtros query params: date_range, territorial_group, status
- Performance: usar cache Redis 15min

## SGICS-602 — Frontend Dashboard
- Componente `CourseDashboard.vue` + widgets reutilizables
- Charts.js para gráficos básicos
- Export CSV vía browser download
- Responsive design mobile-first

## DoD
✅ API métricas + cache  
✅ Frontend dashboard responsive  
✅ Export CSV funcional  

## Testing
```bash
pytest tests/dashboard/
npm run test:dashboard
```