# Epic: Tests y QA (SGICS-E-QA)

**Vencimiento**: 2025-10-25 | **Estado**: To Do | **Puntos**: 6

## Objetivo
Cobertura tests 80%+ → calidad código + CI/CD confiable

## Alcance
### ✅ Debe tener:
- Tests unitarios backend (pytest) 80% cobertura
- Tests componentes frontend (Vitest) críticos  
- Tests integración APIs principales
- CI/CD pipeline con gates calidad

### ⚠️ Fuera del alcance:
- Tests E2E complejos
- Performance testing
- Security penetration testing

**Prioridad**: Alta | **Riesgo**: Bajo

## Historias
| Key | Título | Assignee | Puntos | Estado |
|---|---|---:|---:|---:|
| SGICS-701 | Tests unitarios backend completos | Todos los equipos | 3 | To Do |
| SGICS-702 | Tests frontend + CI/CD gates | DevOps | 3 | To Do |

## SGICS-701 — Tests Backend
- Cobertura 80%+ en módulos críticos: auth, preinscriptions, payments
- Mock servicios externos + fixtures datos test
- Tests performance básicos (response time <200ms)
- Coverage report HTML + badges

## SGICS-702 — Frontend + CI/CD
- Tests Vitest para componentes críticos: login, wizard, dashboard
- GitHub Actions: lint → test → build → deploy
- Quality gates: coverage mínima, lint sin errores
- Rollback automático si tests fallan

## DoD
✅ Coverage 80%+ backend + frontend crítico  
✅ CI/CD pipeline completo  
✅ Quality gates funcionando  

## Testing
```bash
# Backend coverage
pytest --cov=. --cov-report=html

# Frontend  
npm run test:coverage
```