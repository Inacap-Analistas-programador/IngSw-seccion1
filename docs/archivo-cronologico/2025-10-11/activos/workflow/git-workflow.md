# Git Workflow Sprint 2# Git Workflow Sprint 2



## 🎯 Objetivo## 🎯 Objetivo

Ramas `SCRUM-XXX` desde `main` → PRs con rebase → merge a `main`Ramas `SCRUM-XXX` desde `main` → PRs con rebase → merge a `main`



> **Configuración inicial**: Ver `configuracion-git-local.md` (setup UNA VEZ)> **Configuración inicial**: Ver `configuracion-git-local.md` (setup UNA VEZ)



## 📝 Comandos Diarios## 📝 Comandos Diarios



### 1. Nueva rama desde main2) Clonar el repo (si no lo tienes)

```powershell

git checkout main; git pull origin main```powershell

git checkout -b SCRUM-12-descripciongit clone https://github.com/<OWNER>/<REPO>.git

```cd <REPO>

git checkout main

### 2. Commits frecuentes  git pull origin main

```powershell```

git add .; git commit -m "SCRUM-12: [descripcion]"

git push origin HEAD3) Convención de nombres de ramas

```- ramas cortas: `SCRUM-12` o `scrum-12-descrip-corta`.

- ejemplo: `SCRUM-12-implement-login-jwt`

### 3. Pull Request

- **GitHub**: Rama `SCRUM-12` → `main`4) Crear una rama a partir de main (PowerShell)

- **Título**: `[SCRUM-12] Descripción`

- **Reviewer**: Automático via CODEOWNERS```powershell

git checkout main

### 4. Merge con rebasegit pull origin main

```powershellgit checkout -b SCRUM-12-descripcion-corta

# Actualizar antes de merge# trabajar, añadir commits

git checkout SCRUM-12git add .

git rebase maingit commit -m "SCRUM-12: Implementar login JWT - inicio"

git push --force-with-lease origin SCRUM-12git push -u origin HEAD

``````



## ⚠️ Reglas5) Abrir PR (rebase merge)

- ❌ **NO** push directo a `main`- En la UI de GitHub selecciona la rama y crea PR hacia `main`.

- ✅ **SÍ** usar `SCRUM-XXX` como prefijo de rama- Pide que se use la opción "Rebase and merge" (o que la repo permita sólo rebase merges).

- ✅ **SÍ** rebase antes de merge- Si usas GitHub CLI:

- 📝 Ver `pr-checklist.md` antes de cada PR

```powershell

## 🔧 Setupgh pr create --base main --head SCRUM-12-descripcion-corta --title "SCRUM-12: Implementar login JWT" --body "Descripción y checklist"

- **Primera vez**: `configuracion-git-local.md````

- **Branch protection**: `proteccion-github-main.md`

6) Buenas prácticas diarias

## 🆘 Problemas Comunes- Rebase desde main antes de push final: `git fetch origin; git rebase origin/main`.

- **Push denegado**: Verificar permisos o branch protection- Si el rebase genera conflictos: resolver, `git add`, `git rebase --continue`.

- **Conflict en rebase**: `git rebase --abort` y pedir ayuda- Mantener los commits pequeños y atómicos, con mensajes que referencien la clave SCRUM.

- **Rama existe**: Usar sufijo `-v2`, `-fix`, etc.- Abrir PR temprano (WIP) y actualizar su descripción con avances y subtareas.



---7) Actualizar progreso y evidencias

*Basado en: `sgcis_2025-10-11_03.06pm.csv`*- Asociar commits/PRs con JIRA (usar el identificador SGICS-xxx en mensaje si aplica).
- En el PR, añadir lista de subtareas y marcar progresos.

8) Cómo revisar y aceptar PRs (para revisores)
- Asegúrate de que la rama se rebase contra `origin/main` y que pasa checks.
- Recomendado: usar la opción de GitHub "Require linear history" y deshabilitar "merge commits" para forzar rebase.

9) Si quieres automatizar la creación de ramas desde el CSV
- He incluido un script PowerShell en `scripts/create_branches_from_csv.ps1` que lee el CSV y crea/empuja ramas `SCRUM-XX`.

Problemas comunes y soluciones rápidas
- Push denegado: verifica token/SSH y permisos, o que la rama `main` está protegida.
- Ramas con nombres no válidos: limpiar espacios y caracteres especiales.

Contacto y propietario de workflow
- Reemplaza `@REPLACE_WITH_YOUR_GITHUB_USERNAME` en `.github/CODEOWNERS` para que las PRs pidan tu revisión automáticamente.

---
Archivo CSV usado: `sgcis_2025-10-11_03.06pm.csv` (en el root del proyecto).
