# Epic: Pagos (SGICS-E-PAY)

**Vencimiento**: 2025-10-13 | **Estado**: En Progreso | **Puntos**: 8

## Objetivo  
Endpoints REST para crear/consultar pagos + asociación automática a preinscripciones

## Alcance
### ✅ Debe tener:
- `POST/GET /api/payments/` (CRUD pagos)
- Asociación automática a preinscripciones
- Lógica autoconfirmación por configuración curso
- Validaciones comprobante + referencias únicas
- Tests unitarios + integración

### ⚠️ Fuera del alcance:
- UI gestión pagos
- Gateways externos  
- Reembolsos/anulaciones
- Reportes financieros

**Prioridad**: Alta | **Riesgo**: Medio

## Historias
| Key | Título | Assignee | Puntos | Estado |
|---|---|---:|---:|---:|
| SGICS-501 | API pagos + asociación preinscripciones | Grupo B | 5 | To Do |
| SGICS-502 | Lógica autoconfirmación + validaciones | Grupo B | 3 | To Do |

## SGICS-501 — API Pagos
- `POST /api/payments/` → crear con comprobante + referencia
- `GET /api/payments/?group=` → filtrar por grupo territorial
- Asociación automática: match RUT/nombre con preinscripciones
- Validaciones: referencia única, monto > 0

## SGICS-502 — Autoconfirmación
- Lógica basada en configuración curso (auto vs manual)
- Estado `pending` → `confirmed` cuando aplique
- Logs auditoría para conciliaciones

## Cronograma
- **Oct 10**: Backend API + asociación
- **Oct 12**: Lógica autoconfirmación + tests
- **Oct 13**: Epic completo

## Dependencias
- Modelo `Preinscription`, Configuraciones `Course`

## Riesgos
- **Duplicados**: Validación referencia única + logs
- **Match erróneo**: Algoritmo match RUT/nombre robusto

## DoD
✅ Endpoints + tests (pytest) + docs  
✅ Asociación automática funcional  
✅ Autoconfirmación + auditoría  

## Testing
```bash
pytest tests/payments/
```