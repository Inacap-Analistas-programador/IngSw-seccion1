#!/bin/bash
#
# Script de inicialización de base de datos GIC
# Crea las tablas, aplica migraciones y seed inicial de datos
#

set -e  # Salir si hay error

echo "=================================================="
echo "🏕️  GIC - Inicialización de Base de Datos"
echo "=================================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Directorio del script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/backend"

echo "📁 Directorio del proyecto: $PROJECT_ROOT"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Error: No se encuentra el directorio backend${NC}"
    exit 1
fi

cd "$BACKEND_DIR"

# Verificar que Python está instalado
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Error: Python 3 no está instalado${NC}"
    exit 1
fi

echo -e "${YELLOW}🔍 Verificando dependencias...${NC}"
if ! python3 -c "import django" 2>/dev/null; then
    echo -e "${RED}❌ Error: Django no está instalado${NC}"
    echo "   Ejecuta: pip install -r requirements.txt"
    exit 1
fi
echo -e "${GREEN}✓ Dependencias OK${NC}"
echo ""

# 1. Limpiar migraciones antiguas (opcional)
echo -e "${YELLOW}🧹 Limpiando base de datos SQLite...${NC}"
if [ -f "db.sqlite3" ]; then
    rm db.sqlite3
    echo -e "${GREEN}✓ Base de datos antigua eliminada${NC}"
else
    echo "  ℹ️  No hay base de datos previa"
fi
echo ""

# 2. Crear migraciones
echo -e "${YELLOW}📝 Creando migraciones...${NC}"
python3 manage.py makemigrations
echo -e "${GREEN}✓ Migraciones creadas${NC}"
echo ""

# 3. Aplicar migraciones
echo -e "${YELLOW}🔨 Aplicando migraciones a la base de datos...${NC}"
python3 manage.py migrate
echo -e "${GREEN}✓ Migraciones aplicadas${NC}"
echo ""

# 4. Seed de datos iniciales
echo -e "${YELLOW}🌱 Cargando datos iniciales...${NC}"
python3 scripts/seed_database.py
echo -e "${GREEN}✓ Datos iniciales cargados${NC}"
echo ""

# 5. Crear superusuario (opcional, ya está en seed)
echo -e "${YELLOW}👤 Superusuario creado en seed: admin / admin123${NC}"
echo ""

# 6. Verificar instalación
echo -e "${YELLOW}🔍 Verificando instalación...${NC}"
python3 manage.py check --deploy 2>&1 | grep -E "(WARNINGS|ERRORS|System check)" || true
echo -e "${GREEN}✓ Verificación completada${NC}"
echo ""

echo "=================================================="
echo -e "${GREEN}✅ Inicialización completada exitosamente!${NC}"
echo "=================================================="
echo ""
echo "📝 Credenciales de acceso:"
echo "   Admin:       admin / admin123"
echo "   Dirigente:   dirigente / dirigente123"
echo "   Coordinador: coordinador / coord123"
echo ""
echo "🚀 Para iniciar el servidor ejecuta:"
echo "   cd backend && python3 manage.py runserver"
echo ""
