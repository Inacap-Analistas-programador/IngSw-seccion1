# 🔧 Configuración Git Local - Equipo SGICS

## 📋 Configuración Inicial Obligatoria

Cada desarrollador debe ejecutar estos comandos **UNA SOLA VEZ** al clonar el repositorio:

### 1. Configurar Identidad

```powershell
# Configurar nombre y email (reemplaza con tus datos)
git config user.name "Tu Nombre Completo"
git config user.email "tu.email@inacapmail.cl"

# Verificar configuración
git config --list --local
```

### 2. Configurar Rebase por Defecto

```powershell
# Usar rebase en lugar de merge para git pull
git config pull.rebase true

# Configurar rebase automático en nuevas ramas
git config branch.autoSetupRebase always
```

### 3. Configurar Editor (Opcional)

```powershell
# Para VS Code (recomendado)
git config core.editor "code --wait"

# Para Notepad++ (alternativa)
git config core.editor "notepad++.exe -multiInst -notabbar -nosession -noPlugin"
```

## 🚀 Configuración Avanzada (Opcional)

### Aliases Útiles

```powershell
# Shortcuts para comandos frecuentes
git config alias.st "status"
git config alias.co "checkout" 
git config alias.br "branch"
git config alias.ci "commit"
git config alias.unstage "reset HEAD --"

# Log bonito
git config alias.lg "log --oneline --decorate --graph --all"

# Ver diferencias staged
git config alias.staged "diff --staged"
```

### Configurar Merge Tool (VS Code)

```powershell
git config merge.tool vscode
git config mergetool.vscode.cmd "code --wait \$MERGED"
git config diff.tool vscode
git config difftool.vscode.cmd "code --wait --diff \$LOCAL \$REMOTE"
```

## 🔐 Configuración de Seguridad

### Configurar GPG (Para commits firmados)

```powershell
# Listar claves GPG disponibles
gpg --list-secret-keys --keyid-format=long

# Configurar clave GPG (reemplaza con tu key ID)
git config user.signingkey TU_GPG_KEY_ID
git config commit.gpgsign true
```

### Configurar Credenciales

```powershell
# Para Windows - usar credential manager
git config credential.helper manager-core

# Verificar configuración de credenciales
git config --list | grep credential
```

## 📱 Hooks de Git (Opcional pero Recomendado)

### Pre-commit Hook (Validación antes de commit)

Crear archivo `.git/hooks/pre-commit`:

```bash
#!/bin/sh
# Pre-commit hook para validar código

echo "🔍 Ejecutando validaciones pre-commit..."

# Verificar que no hay archivos grandes
git diff --cached --name-only | while read file; do
    if [ -f "$file" ]; then
        size=$(wc -c < "$file")
        if [ $size -gt 5242880 ]; then  # 5MB
            echo "❌ Error: $file es demasiado grande (${size} bytes)"
            exit 1
        fi
    fi
done

# Verificar formato de mensaje de commit (opcional)
echo "✅ Validaciones pre-commit completadas"
```

### Hacer ejecutable el hook

```powershell
# En PowerShell (Windows)
git update-index --chmod=+x .git/hooks/pre-commit
```

## 🌿 Configuración de Ramas

### Configurar seguimiento automático

```powershell
# Auto-setup tracking para nuevas ramas
git config branch.autoSetupMerge always
git config branch.autoSetupRebase always

# Configurar push simple (solo rama actual)
git config push.default simple
```

## ✅ Verificación Final

Ejecuta este comando para verificar toda la configuración:

```powershell
# Ver toda la configuración local
git config --local --list

# Verificar conexión con repositorio remoto
git remote -v
git fetch --dry-run

# Probar configuración con un commit de prueba
git checkout -b test-config
echo "# Test" > test.md
git add test.md
git commit -m "test: verificar configuración git"
git push -u origin test-config
git checkout main
git branch -d test-config
git push origin --delete test-config
```

## 🆘 Solución de Problemas Comunes

### Error de autenticación

```powershell
# Limpiar credenciales guardadas
git config --unset credential.helper
git config credential.helper manager-core

# Re-autenticarse
git fetch
```

### Error de line endings (Windows)

```powershell
# Configurar line endings automáticos
git config core.autocrlf true
git config core.safecrlf warn
```

### Error de permisos

```powershell
# Ignorar cambios de permisos en archivos
git config core.filemode false
```

## 📞 Contacto y Ayuda

- **Líder técnico**: [Nombre del líder]
- **Documentación**: `docs/git-workflow.md`
- **Issues**: GitHub Issues del repositorio
- **Slack**: Canal #desarrollo-sgics

---

> 💡 **Tip**: Después de configurar todo, haz un commit de prueba para verificar que todo funciona correctamente.

> ⚠️ **Importante**: Nunca hagas `git push --force` en la rama `main`. Usa siempre Pull Requests.