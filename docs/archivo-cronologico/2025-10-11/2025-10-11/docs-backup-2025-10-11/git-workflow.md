## Flujo de trabajo Git recomendado para el sprint

Objetivo corto:
- Cada desarrollador debe trabajar en su propia rama nombrada por la clave SCRUM (ej. `SCRUM-12-feature`) creada desde `main`.
- Forzar PRs (pull requests) con rebase y revisiones, registrar progreso en PR/JIRA.

Contrato mínimo
- Input: rama `main` actualizada en el remoto `origin` y el CSV `sgcis_2025-10-11_03.06pm.csv` con claves.
- Output: ramas remotas `SCRUM-XXX` creadas, PRs abiertos por cada trabajo y commits asociados.
- Error modes: fallos de push por credenciales; ramas existentes; protección de rama en remote.

Comandos iniciales (PowerShell)

1) Configurar git local (cada dev, una sola vez):

```powershell
# configurar identidad
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@example.com"

# usar rebase por defecto en pull
git config --global pull.rebase true
git config --global rebase.autoStash true

# credencial helper recomendada en Windows
git config --global credential.helper manager-core
```

2) Clonar el repo (si no lo tienes)

```powershell
git clone https://github.com/<OWNER>/<REPO>.git
cd <REPO>
git checkout main
git pull origin main
```

3) Convención de nombres de ramas
- ramas cortas: `SCRUM-12` o `scrum-12-descrip-corta`.
- ejemplo: `SCRUM-12-implement-login-jwt`

4) Crear una rama a partir de main (PowerShell)

```powershell
git checkout main
git pull origin main
git checkout -b SCRUM-12-descripcion-corta
# trabajar, añadir commits
git add .
git commit -m "SCRUM-12: Implementar login JWT - inicio"
git push -u origin HEAD
```

5) Abrir PR (rebase merge)
- En la UI de GitHub selecciona la rama y crea PR hacia `main`.
- Pide que se use la opción "Rebase and merge" (o que la repo permita sólo rebase merges).
- Si usas GitHub CLI:

```powershell
gh pr create --base main --head SCRUM-12-descripcion-corta --title "SCRUM-12: Implementar login JWT" --body "Descripción y checklist"
```

6) Buenas prácticas diarias
- Rebase desde main antes de push final: `git fetch origin; git rebase origin/main`.
- Si el rebase genera conflictos: resolver, `git add`, `git rebase --continue`.
- Mantener los commits pequeños y atómicos, con mensajes que referencien la clave SCRUM.
- Abrir PR temprano (WIP) y actualizar su descripción con avances y subtareas.

7) Actualizar progreso y evidencias
- Asociar commits/PRs con JIRA (usar el identificador SGICS-xxx en mensaje si aplica).
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
