#!/bin/bash
# Performance Check Script for GIC
# Usage: ./scripts/performance-check.sh

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  GIC Performance Check${NC}"
echo -e "${GREEN}========================================${NC}"
echo "Timestamp: $(date)"
echo ""

# CPU y Memoria de contenedores
echo -e "${BLUE}=== Docker Container Stats ===${NC}"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | head -10

echo ""

# Conexiones de base de datos
echo -e "${BLUE}=== MySQL Connections ===${NC}"
CONNECTION_COUNT=$(docker exec GIC_mysql mysql -u root -p$MYSQL_ROOT_PASSWORD -e "SHOW PROCESSLIST;" 2>/dev/null | wc -l)
echo "Active connections: $CONNECTION_COUNT"

echo ""

# Espacio en disco
echo -e "${BLUE}=== Disk Usage ===${NC}"
df -h | grep -E '(Filesystem|/dev/)'

echo ""

# Tamaño de volúmenes Docker
echo -e "${BLUE}=== Docker Volumes ===${NC}"
docker system df -v | grep -A 20 "Local Volumes"

echo ""

# Estado de servicios
echo -e "${BLUE}=== Service Status ===${NC}"
docker-compose ps

echo ""

# Logs recientes de errores
echo -e "${BLUE}=== Recent Errors (last 10) ===${NC}"
docker-compose logs --tail=100 | grep -i error | tail -10 || echo "No recent errors"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Performance Check Completed${NC}"
echo -e "${GREEN}========================================${NC}"
