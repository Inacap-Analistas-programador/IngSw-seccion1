#!/bin/bash

# Script de inicio rápido para desarrollo - Plataforma GIC
# Este script inicia el backend Django y el frontend React

set -e  # Salir si hay errores

echo "🚀 Iniciando Plataforma GIC..."
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorio raíz del proyecto
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Verificar Python
echo -e "${BLUE}Verificando Python...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}Python 3 no está instalado. Por favor, instálalo primero.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python encontrado${NC}"

# Verificar Node.js
echo -e "${BLUE}Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js no está instalado. Por favor, instálalo primero.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js encontrado${NC}"
echo ""

# ==================== BACKEND ====================
echo -e "${BLUE}📦 Configurando Backend Django...${NC}"

cd "$PROJECT_ROOT/backend"

# Configurar archivo .env para desarrollo
if [ ! -f ".env" ]; then
    if [ -f ".env.development" ]; then
        echo "Copiando configuración de desarrollo..."
        cp .env.development .env
        echo -e "${GREEN}✓ Archivo .env configurado para desarrollo${NC}"
    else
        echo -e "${YELLOW}⚠ Advertencia: .env.development no encontrado${NC}"
    fi
else
    echo -e "${GREEN}✓ Archivo .env existente${NC}"
fi

# Verificar si existe requirements.txt
if [ ! -f "requirements.txt" ]; then
    echo -e "${YELLOW}⚠ requirements.txt no encontrado${NC}"
else
    echo "Instalando dependencias de Python..."
    pip install -q -r requirements.txt || true
    echo -e "${GREEN}✓ Dependencias de Python instaladas${NC}"
fi

# Verificar base de datos
if [ ! -f "db.sqlite3" ]; then
    echo "Aplicando migraciones..."
    python manage.py migrate
    echo -e "${GREEN}✓ Base de datos creada${NC}"
    
    echo "Creando usuarios de prueba..."
    python manage.py create_test_users
    echo -e "${GREEN}✓ Usuarios de prueba creados${NC}"
else
    echo -e "${GREEN}✓ Base de datos existente${NC}"
    
    # Verificar si existen usuarios de prueba
    USER_COUNT=$(python manage.py shell -c "from usuarios.models import Usuario; print(Usuario.objects.filter(usu_email__in=['admin@test.com', 'coordinador@test.com', 'dirigente@test.com']).count())" 2>/dev/null | tail -1)
    
    if [ "$USER_COUNT" -lt "3" ]; then
        echo "Creando usuarios de prueba faltantes..."
        python manage.py create_test_users
        echo -e "${GREEN}✓ Usuarios de prueba verificados${NC}"
    else
        echo -e "${GREEN}✓ Usuarios de prueba existentes${NC}"
    fi
fi

# Iniciar backend en background
echo "Iniciando servidor Django en puerto 8000..."
python manage.py runserver 0.0.0.0:8000 > /tmp/django.log 2>&1 &
DJANGO_PID=$!
echo -e "${GREEN}✓ Backend Django iniciado (PID: $DJANGO_PID)${NC}"
echo ""

# ==================== FRONTEND ====================
echo -e "${BLUE}📦 Configurando Frontend React...${NC}"

cd "$PROJECT_ROOT/frontend"

# Verificar .env.local
if [ ! -f ".env.local" ]; then
    echo "Creando archivo .env.local..."
    cp .env.example .env.local
    echo -e "${GREEN}✓ Archivo .env.local creado${NC}"
else
    echo -e "${GREEN}✓ Archivo .env.local existente${NC}"
fi

# Verificar node_modules
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias de Node.js (esto puede tardar unos minutos)..."
    npm install
    echo -e "${GREEN}✓ Dependencias de Node.js instaladas${NC}"
else
    echo -e "${GREEN}✓ Dependencias de Node.js ya instaladas${NC}"
fi

# Iniciar frontend en background
echo "Iniciando servidor Vite en puerto 3000..."
npm run dev > /tmp/vite.log 2>&1 &
VITE_PID=$!
echo -e "${GREEN}✓ Frontend React iniciado (PID: $VITE_PID)${NC}"
echo ""

# ==================== INFORMACIÓN ====================
echo -e "${GREEN}===========================================${NC}"
echo -e "${GREEN}    ✅ Plataforma GIC Iniciada${NC}"
echo -e "${GREEN}===========================================${NC}"
echo ""
echo -e "${BLUE}Backend Django:${NC}"
echo "  URL: http://localhost:8000"
echo "  Admin: http://localhost:8000/admin/"
echo "  API Docs: http://localhost:8000/api/docs/"
echo "  Log: tail -f /tmp/django.log"
echo ""
echo -e "${BLUE}Frontend React:${NC}"
echo "  URL: http://localhost:3000"
echo "  Log: tail -f /tmp/vite.log"
echo ""
echo -e "${BLUE}Credenciales de prueba:${NC}"
echo "  admin@test.com / Admin123!"
echo "  coordinador@test.com / Coord123!"
echo "  dirigente@test.com / Dirig123!"
echo ""
echo -e "${BLUE}Para detener los servidores:${NC}"
echo "  kill $DJANGO_PID  # Backend"
echo "  kill $VITE_PID    # Frontend"
echo ""
echo -e "${YELLOW}Presiona Ctrl+C para detener ambos servidores${NC}"
echo ""

# Esperar a que los servidores estén listos
echo "Esperando a que los servidores estén listos..."
sleep 5

# Verificar que los servidores estén corriendo
if ps -p $DJANGO_PID > /dev/null; then
    echo -e "${GREEN}✓ Backend corriendo correctamente${NC}"
else
    echo -e "${YELLOW}⚠ Backend no está corriendo. Ver log: /tmp/django.log${NC}"
fi

if ps -p $VITE_PID > /dev/null; then
    echo -e "${GREEN}✓ Frontend corriendo correctamente${NC}"
else
    echo -e "${YELLOW}⚠ Frontend no está corriendo. Ver log: /tmp/vite.log${NC}"
fi

echo ""
echo -e "${GREEN}🎉 ¡Listo! Abre http://localhost:3000 en tu navegador${NC}"
echo ""

# Mantener el script corriendo y capturar Ctrl+C
trap "echo ''; echo 'Deteniendo servidores...'; kill $DJANGO_PID $VITE_PID 2>/dev/null; echo 'Servidores detenidos.'; exit 0" INT

# Esperar indefinidamente
wait
