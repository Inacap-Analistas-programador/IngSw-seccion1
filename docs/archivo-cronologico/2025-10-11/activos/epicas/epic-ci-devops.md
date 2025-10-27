# Epic: CI/CD y DevOps (SGICS-E-DEVOPS)

**Vencimiento**: 2025-10-15 | **Estado**: To Do | **Puntos**: 5  

## Objetivo
Pipeline CI/CD automatizado: GitHub → Docker → Deploy staging/prod

## Alcance
### ✅ Debe tener:
- GitHub Actions: test → build → deploy
- Docker containers backend + frontend
- Deploy automático staging en PR merge
- Rollback manual prod

### ⚠️ Fuera del alcance:
- Kubernetes orquestación
- Monitoreo avanzado (Grafana)
- Blue-green deployment

**Prioridad**: Alta | **Riesgo**: Medio

## Historias  
| Key | Título | Assignee | Puntos | Estado |
|---|---|---:|---:|---:|
| SGICS-801 | Docker setup + GitHub Actions | DevOps | 3 | To Do |
| SGICS-802 | Deploy staging + rollback prod | DevOps | 2 | To Do |

## SGICS-801 — Docker + CI
- `Dockerfile` backend (Django) + frontend (Nginx + Vue build)
- `docker-compose.yml` para desarrollo local
- GitHub Actions workflow: lint → test → build images
- Registry: GitHub Container Registry

## SGICS-802 — Deploy Pipeline
- Staging: auto-deploy en merge a `main`
- Prod: manual trigger con approval
- Rollback: script manual previous image tag
- Health checks básicos post-deploy

## DoD
✅ Docker images funcionando  
✅ CI/CD pipeline completo  
✅ Deploy staging automático  

## Testing
```bash
# Local docker
docker-compose up --build

# CI pipeline
git push origin main  # → trigger pipeline
```