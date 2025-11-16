# Script de inicio rápido para desarrollo - Plataforma GIC (Windows PowerShell)
# Este script inicia el backend Django y el frontend React

Write-Host "🚀 Iniciando Plataforma GIC..." -ForegroundColor Cyan
Write-Host ""

# Directorio raíz del proyecto
$PROJECT_ROOT = $PSScriptRoot

# Verificar Python
Write-Host "Verificando Python..." -ForegroundColor Blue
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "⚠ Python 3 no está instalado. Por favor, instálalo primero." -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Python encontrado" -ForegroundColor Green

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Blue
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "⚠ Node.js no está instalado. Por favor, instálalo primero." -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Node.js encontrado" -ForegroundColor Green
Write-Host ""

# ==================== BACKEND ====================
Write-Host "📦 Configurando Backend Django..." -ForegroundColor Blue

Set-Location "$PROJECT_ROOT\backend"

# Configurar archivo .env para desarrollo
if (!(Test-Path ".env")) {
    if (Test-Path ".env.development") {
        Write-Host "Copiando configuración de desarrollo..."
        Copy-Item .env.development .env
        Write-Host "✓ Archivo .env configurado para desarrollo" -ForegroundColor Green
    } else {
        Write-Host "⚠ Advertencia: .env.development no encontrado" -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ Archivo .env existente" -ForegroundColor Green
}

# Verificar si existe requirements.txt
if (Test-Path "requirements.txt") {
    Write-Host "Instalando dependencias de Python..."
    python -m pip install -q -r requirements.txt
    Write-Host "✓ Dependencias de Python instaladas" -ForegroundColor Green
} else {
    Write-Host "⚠ requirements.txt no encontrado" -ForegroundColor Yellow
}

# Verificar base de datos
if (!(Test-Path "db.sqlite3")) {
    Write-Host "Aplicando migraciones..."
    python manage.py migrate
    Write-Host "✓ Base de datos creada" -ForegroundColor Green
    
    Write-Host "Creando usuarios de prueba..."
    python manage.py create_test_users
    Write-Host "✓ Usuarios de prueba creados" -ForegroundColor Green
} else {
    Write-Host "✓ Base de datos existente" -ForegroundColor Green
    
    # Verificar si existen usuarios de prueba
    $userCount = python manage.py shell -c "from usuarios.models import Usuario; print(Usuario.objects.filter(usu_email__in=['admin@test.com', 'coordinador@test.com', 'dirigente@test.com']).count())" 2>$null | Select-Object -Last 1
    
    if ([int]$userCount -lt 3) {
        Write-Host "Creando usuarios de prueba faltantes..."
        python manage.py create_test_users
        Write-Host "✓ Usuarios de prueba verificados" -ForegroundColor Green
    } else {
        Write-Host "✓ Usuarios de prueba existentes" -ForegroundColor Green
    }
}

# Iniciar backend en background
Write-Host "Iniciando servidor Django en puerto 8000..."
$djangoJob = Start-Job -ScriptBlock { 
    param($path)
    Set-Location $path
    python manage.py runserver 0.0.0.0:8000 
} -ArgumentList (Get-Location).Path
Write-Host "✓ Backend Django iniciado (Job ID: $($djangoJob.Id))" -ForegroundColor Green
Write-Host ""

# ==================== FRONTEND ====================
Write-Host "📦 Configurando Frontend React..." -ForegroundColor Blue

Set-Location "$PROJECT_ROOT\frontend"

# Verificar .env
if (!(Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Write-Host "Creando archivo .env..."
        Copy-Item .env.example .env
        Write-Host "✓ Archivo .env creado" -ForegroundColor Green
    }
} else {
    Write-Host "✓ Archivo .env existente" -ForegroundColor Green
}

# Verificar node_modules
if (!(Test-Path "node_modules")) {
    Write-Host "Instalando dependencias de Node.js (esto puede tardar unos minutos)..."
    npm install
    Write-Host "✓ Dependencias de Node.js instaladas" -ForegroundColor Green
} else {
    Write-Host "✓ Dependencias de Node.js ya instaladas" -ForegroundColor Green
}

# Iniciar frontend en background
Write-Host "Iniciando servidor Vite en puerto 3000..."
$viteJob = Start-Job -ScriptBlock { 
    param($path)
    Set-Location $path
    npm run dev 
} -ArgumentList (Get-Location).Path
Write-Host "✓ Frontend React iniciado (Job ID: $($viteJob.Id))" -ForegroundColor Green
Write-Host ""

# ==================== INFORMACIÓN ====================
Write-Host "===========================================" -ForegroundColor Green
Write-Host "    ✅ Plataforma GIC Iniciada" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend Django:" -ForegroundColor Blue
Write-Host "  URL: http://localhost:8000"
Write-Host "  Admin: http://localhost:8000/admin/"
Write-Host "  API Docs: http://localhost:8000/api/docs/"
Write-Host ""
Write-Host "Frontend React:" -ForegroundColor Blue
Write-Host "  URL: http://localhost:3000"
Write-Host ""
Write-Host "Credenciales de prueba:" -ForegroundColor Blue
Write-Host "  admin@test.com / Admin123!"
Write-Host "  coordinador@test.com / Coord123!"
Write-Host "  dirigente@test.com / Dirig123!"
Write-Host ""
Write-Host "Para detener los servidores:" -ForegroundColor Blue
Write-Host "  Stop-Job $($djangoJob.Id)  # Backend"
Write-Host "  Stop-Job $($viteJob.Id)    # Frontend"
Write-Host "  Remove-Job $($djangoJob.Id), $($viteJob.Id)"
Write-Host ""
Write-Host "Para ver logs:" -ForegroundColor Blue
Write-Host "  Receive-Job $($djangoJob.Id)  # Backend"
Write-Host "  Receive-Job $($viteJob.Id)    # Frontend"
Write-Host ""
Write-Host "Presiona Ctrl+C para salir (los servidores seguirán corriendo)" -ForegroundColor Yellow
Write-Host ""

# Esperar a que los servidores estén listos
Write-Host "Esperando a que los servidores estén listos..."
Start-Sleep -Seconds 5

# Verificar que los servidores estén corriendo
if ($djangoJob.State -eq "Running") {
    Write-Host "✓ Backend corriendo correctamente" -ForegroundColor Green
} else {
    Write-Host "⚠ Backend no está corriendo." -ForegroundColor Yellow
    Receive-Job $djangoJob
}

if ($viteJob.State -eq "Running") {
    Write-Host "✓ Frontend corriendo correctamente" -ForegroundColor Green
} else {
    Write-Host "⚠ Frontend no está corriendo." -ForegroundColor Yellow
    Receive-Job $viteJob
}

Write-Host ""
Write-Host "🎉 ¡Listo! Abre http://localhost:3000 en tu navegador" -ForegroundColor Green
Write-Host ""
Write-Host "Presiona Enter para mantener los servidores corriendo o Ctrl+C para salir..."
$null = Read-Host
