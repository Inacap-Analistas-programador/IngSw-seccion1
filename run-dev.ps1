# SGICS - Script de Desarrollo
# Ejecuta Frontend (Vue.js) + Backend (Django) simultáneamente

param(
    [switch]$NoPause = $false
)

Write-Host "Iniciando SGICS - Sistema de Gestión Integral de Cursos Scout" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Blue

# Resolver rutas relativas al archivo del script
$ScriptRoot = $PSScriptRoot
if (-not $ScriptRoot) { $ScriptRoot = (Split-Path -Parent $MyInvocation.MyCommand.Path) }
if (-not $ScriptRoot) { $ScriptRoot = (Get-Location).Path }

$backendDir = Join-Path $ScriptRoot 'backend'
$frontendDir = Join-Path $ScriptRoot 'frontend'
$venvDir    = Join-Path $backendDir '.venv'
$venvPy     = Join-Path $venvDir 'Scripts/python.exe'

# Verificar estructura del proyecto
if (-not (Test-Path (Join-Path $backendDir 'manage.py'))) {
    Write-Host "Error: No se encuentra manage.py en $backendDir" -ForegroundColor Red
    Write-Host "   Asegúrate de ejecutar el script desde la raíz del repo (carpeta IngSw-seccion1)" -ForegroundColor Yellow
    if (-not $NoPause) { pause }
    exit 1
}
if (-not (Test-Path (Join-Path $frontendDir 'package.json'))) {
    Write-Host "Error: No se encuentra frontend en $frontendDir" -ForegroundColor Red
    if (-not $NoPause) { pause }
    exit 1
}

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Host "Node.js detectado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js no está instalado" -ForegroundColor Red
    Write-Host "Descarga e instala Node.js desde https://nodejs.org/" -ForegroundColor Yellow
    if (-not $NoPause) { pause }
    exit 1
}

# Verificar Python (intentar 'python' y luego 'py -3')
$pythonOk = $false
try {
    $pythonCmd = (Get-Command python -ErrorAction SilentlyContinue)
    if ($pythonCmd) {
        $pythonVersion = & $pythonCmd.Path --version
        $pythonOk = $true
        Write-Host "Python detectado: $pythonVersion" -ForegroundColor Green
    }
} catch {}
if (-not $pythonOk) {
    try {
        $pyCmd = (Get-Command py -ErrorAction SilentlyContinue)
        if ($pyCmd) {
            $pythonVersion = & $pyCmd.Path -3 --version
            $pythonOk = $true
            Write-Host "Python (py -3) detectado: $pythonVersion" -ForegroundColor Green
        }
    } catch {}
}
if (-not $pythonOk) {
    Write-Host "Error: Python no está disponible en PATH (ni 'python' ni 'py')." -ForegroundColor Red
    Write-Host "   Instala Python 3.12+ desde https://python.org/ o habilita 'py'." -ForegroundColor Yellow
    if (-not $NoPause) { pause }
    exit 1
}

Write-Host ""
Write-Host "Preparando servicios..." -ForegroundColor Yellow

## Instalar dependencias si es necesario
Write-Host "Verificando dependencias del frontend..." -ForegroundColor Cyan
if (-not (Test-Path (Join-Path $frontendDir 'node_modules'))) {
    Write-Host "   Instalando dependencias de npm..." -ForegroundColor Yellow
    Push-Location $frontendDir
    npm install
    Pop-Location
}

Write-Host "Verificando dependencias del backend..." -ForegroundColor Cyan
if (-not (Test-Path $venvDir)) {
    Write-Host "   Creando entorno virtual de Python..." -ForegroundColor Yellow
    Push-Location $backendDir
    if ($pythonCmd) {
        & $pythonCmd.Path -m venv .venv
    } elseif ($pyCmd) {
        & $pyCmd.Path -3 -m venv .venv
    }
    Pop-Location
}
if (-not (Test-Path $venvPy)) {
    Write-Host "Error: No se pudo crear el entorno virtual en $venvDir" -ForegroundColor Red
    if (-not $NoPause) { pause }
    exit 1
}

# Instalar requirements dentro del venv si falta django
try {
    $djangoCheck = & $venvPy -c "import django, sys; print(django.get_version())" 2>$null
} catch { $djangoCheck = $null }
if (-not $djangoCheck) {
    Write-Host "   Instalando dependencias del backend (requirements.txt)..." -ForegroundColor Yellow
    Push-Location $backendDir
    & $venvPy -m pip install --upgrade pip
    & $venvPy -m pip install -r requirements.txt
    Pop-Location
}

Write-Host "Iniciando Backend Django..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$backendDir'; `n" +
    "& '$venvPy' manage.py runserver 127.0.0.1:8000"
)

# Esperar un momento para que el backend inicie
Start-Sleep -Seconds 3

# Iniciar Frontend Vue.js
Write-Host "Iniciando Frontend Vue.js..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$frontendDir'; `n" +
    "npm run dev"
)

Write-Host ""
Write-Host "Servicios iniciados correctamente!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Blue
Write-Host ""
Write-Host "URLs de la aplicación:" -ForegroundColor White
Write-Host "   Frontend:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "   Backend:   http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "   Admin:     http://127.0.0.1:8000/admin/" -ForegroundColor Cyan
Write-Host "   Health:    http://127.0.0.1:8000/healthz/" -ForegroundColor Cyan
Write-Host ""
Write-Host "La aplicación SGICS está ejecutándose!" -ForegroundColor Green
Write-Host ""
Write-Host "Para detener los servicios:" -ForegroundColor Yellow
Write-Host "   • Presiona Ctrl+C en ambas ventanas de PowerShell" -ForegroundColor White
Write-Host "   • O cierra las ventanas directamente" -ForegroundColor White
Write-Host ""
Write-Host "¡Disfruta desarrollando SGICS!" -ForegroundColor Magenta
Write-Host "================================================================" -ForegroundColor Blue

# Mantener la ventana abierta
if (-not $NoPause) {
    Write-Host "Presiona cualquier tecla para cerrar esta ventana..." -ForegroundColor DarkGray
    pause
}