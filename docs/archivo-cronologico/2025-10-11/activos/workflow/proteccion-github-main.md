# 🛡️ Protección de Rama Main - GitHub

## 📋 Configuración de Branch Protection Rules

### 🎯 Objetivo

Proteger la rama `main` para asegurar:
- ✅ Todos los cambios pasan por Pull Request
- ✅ Revisión obligatoria de al menos 1 desarrollador
- ✅ CI/CD pasa exitosamente antes de merge
- ✅ No se permiten pushes directos a `main`

## 🔧 Configuración mediante GitHub CLI

### 1. Instalar GitHub CLI (si no está instalado)

```powershell
# Instalar via Chocolatey
choco install gh

# O descargar desde: https://cli.github.com/
```

### 2. Autenticar con GitHub

```powershell
# Autenticarse
gh auth login

# Verificar autenticación
gh auth status
```

### 3. Configurar Branch Protection

```powershell
# Navegar al directorio del proyecto
cd "c:\Users\Ricardo\project"

# Configurar protección de rama main
gh api repos/Inacap-Analistas-programador/IngSw-seccion1/branches/main/protection `
  --method PUT `
  --field required_status_checks='{"strict":true,"contexts":["ci"]}' `
  --field enforce_admins=true `
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' `
  --field restrictions=null
```

### 4. Comando Detallado de Protección

```powershell
# Configuración completa con todas las protecciones
gh api repos/Inacap-Analistas-programador/IngSw-seccion1/branches/main/protection `
  --method PUT `
  --field required_status_checks='{"strict":true,"contexts":["ci","tests","build"]}' `
  --field enforce_admins=true `
  --field required_pull_request_reviews='{
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "dismissal_restrictions": {
      "users": [],
      "teams": []
    }
  }' `
  --field allow_force_pushes=false `
  --field allow_deletions=false `
  --field restrictions=null
```

## 🖥️ Configuración mediante GitHub Web UI

### Paso 1: Navegar a Configuración

1. Ve a: `https://github.com/Inacap-Analistas-programador/IngSw-seccion1`
2. Click en **Settings** (⚙️)
3. En el menú lateral: **Branches**

### Paso 2: Crear Branch Protection Rule

1. Click **Add rule**
2. **Branch name pattern**: `main`

### Paso 3: Configurar Protecciones

#### ✅ Require a pull request before merging
- ☑️ **Require approvals**: `1`
- ☑️ **Dismiss stale pull request approvals when new commits are pushed**
- ☑️ **Require review from code owners**

#### ✅ Require status checks to pass before merging
- ☑️ **Require branches to be up to date before merging**
- Agregar contexts: `ci`, `tests`, `build` (según tu CI/CD)

#### ✅ Require conversation resolution before merging
- ☑️ Activar para forzar resolver comentarios

#### ✅ Require signed commits (Opcional)
- ☑️ Solo si el equipo usa GPG

#### ✅ Require linear history
- ☑️ Forzar rebasing, no merge commits

#### ✅ Include administrators
- ☑️ Las reglas aplican también a administradores

#### ❌ Allow force pushes
- ❌ **DESACTIVADO** - Nunca permitir force push

#### ❌ Allow deletions  
- ❌ **DESACTIVADO** - No permitir borrar la rama

### Paso 4: Guardar

Click **Create** para aplicar las reglas.

## 🚨 Configuraciones Adicionales de Seguridad

### 1. Configurar CODEOWNERS (Ya creado)

El archivo `.github/CODEOWNERS` ya está configurado para requerir revisiones específicas.

### 2. Configurar Required Checks

```powershell
# Verificar workflows de GitHub Actions
gh workflow list

# Ver estado de checks requeridos
gh api repos/Inacap-Analistas-programador/IngSw-seccion1/branches/main/protection
```

### 3. Configurar Auto-merge

```powershell
# Habilitar auto-merge en el repositorio
gh api repos/Inacap-Analistas-programador/IngSw-seccion1 `
  --method PATCH `
  --field allow_auto_merge=true
```

## 📝 Configuración de Issues y PR Templates

### Issue Template

Crear `.github/ISSUE_TEMPLATE/feature.md`:

```markdown
---
name: Feature Request
about: Solicitud de nueva funcionalidad
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## 📋 Descripción
Descripción clara de la funcionalidad solicitada.

## 🎯 Criterios de Aceptación
- [ ] Criterio 1
- [ ] Criterio 2

## 📎 Recursos Adicionales
- Mockups
- Referencias
```

### PR Template

Crear `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## 📋 Descripción
Descripción clara de los cambios realizados.

## 🔗 Issue Relacionado
Closes #

## 🧪 Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Actualización de documentación

## ✅ Checklist
- [ ] Mi código sigue las convenciones del proyecto
- [ ] He realizado un self-review de mi código
- [ ] He agregado tests que prueban mis cambios
- [ ] Los tests nuevos y existentes pasan localmente
- [ ] He actualizado la documentación según corresponda

## 📸 Screenshots (si aplica)
```

## 🔍 Verificación de Configuración

### 1. Verificar Branch Protection

```powershell
# Ver configuración actual
gh api repos/Inacap-Analistas-programador/IngSw-seccion1/branches/main/protection

# Verificar que no se puede push directo
git push origin main
# Debería fallar con: "Branch protection rule violations"
```

### 2. Test de Workflow

```powershell
# Crear PR de prueba
git checkout -b test-protection
echo "# Test protection" > test-protection.md
git add test-protection.md
git commit -m "test: verificar protección de main"
git push -u origin test-protection

# Crear PR via CLI
gh pr create --title "Test: Verificar protección" --body "PR de prueba para verificar branch protection"

# Ver PR creado
gh pr list
```

## 📊 Monitoreo y Métricas

### Comandos de Monitoreo

```powershell
# Ver PRs pendientes
gh pr list --state open

# Ver branch protection status
gh api repos/Inacap-Analistas-programador/IngSw-seccion1/branches/main

# Ver último commit en main
git log --oneline -n 5 origin/main
```

## 🆘 Troubleshooting

### Error: "Required status check not found"

```powershell
# Verificar workflows activos
gh workflow list

# Ejecutar workflow manualmente
gh workflow run ci.yml
```

### Error: "Branch protection rule not applied"

1. Verificar permisos de administrador
2. Verificar que el nombre de rama sea exacto: `main`
3. Esperar 5-10 minutos para que se aplique

### Bypass temporal de protección (SOLO EMERGENCIAS)

```powershell
# SOLO para administradores en emergencias
gh api repos/Inacap-Analistas-programador/IngSw-seccion1/branches/main/protection `
  --method PUT `
  --field enforce_admins=false
  
# Hacer cambio de emergencia
git push origin main

# RESTAURAR protección inmediatamente
gh api repos/Inacap-Analistas-programador/IngSw-seccion1/branches/main/protection `
  --method PUT `
  --field enforce_admins=true
```

## 📞 Contactos

- **Administrador del repo**: [Nombre]
- **Líder DevOps**: [Nombre]
- **Documentación**: `docs/git-workflow.md`

---

> ⚠️ **IMPORTANTE**: Una vez configurada la protección, **NUNCA** hagas push directo a `main`. Siempre usa Pull Requests.

> 💡 **Tip**: Si necesitas hacer cambios urgentes, crea una rama, haz el PR y solicita revisión expedita en Slack.