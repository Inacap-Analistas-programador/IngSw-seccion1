#!/bin/bash
# Deploy GIC to Production
# Usage: ./scripts/deploy-production.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables de configuración
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
BACKUP_DIR="/backups/GIC"
LOG_FILE="/var/log/GIC-deploy.log"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  GIC Production Deployment${NC}"
echo -e "${GREEN}========================================${NC}"

# Verificar que existe el archivo .env
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create .env file from .env.production.example"
    exit 1
fi

# Log de inicio
echo "$(date): Iniciando deployment de GIC" >> $LOG_FILE

# 1. Crear directorio de backup si no existe
echo -e "${YELLOW}[1/8] Creating backup directory...${NC}"
mkdir -p $BACKUP_DIR

# 2. Backup de base de datos (si existe contenedor)
if docker ps -a | grep -q GIC_mysql; then
    echo -e "${YELLOW}[2/8] Creating database backup...${NC}"
    docker exec GIC_mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE > "$BACKUP_DIR/GIC_backup_$(date +%Y%m%d_%H%M%S).sql" 2>/dev/null || echo "No existing database to backup"
else
    echo -e "${YELLOW}[2/8] Skipping backup (no existing database)${NC}"
fi

# 3. Pull de nuevas imágenes
echo -e "${YELLOW}[3/8] Pulling latest images...${NC}"
docker-compose -f $DOCKER_COMPOSE_FILE pull

# 4. Construir imágenes
echo -e "${YELLOW}[4/8] Building images...${NC}"
docker-compose -f $DOCKER_COMPOSE_FILE build

# 5. Detener contenedores antiguos
echo -e "${YELLOW}[5/8] Stopping old containers...${NC}"
docker-compose -f $DOCKER_COMPOSE_FILE down

# 6. Iniciar nuevos contenedores
echo -e "${YELLOW}[6/8] Starting new containers...${NC}"
docker-compose -f $DOCKER_COMPOSE_FILE up -d

# 7. Esperar a que los servicios estén listos
echo -e "${YELLOW}[7/8] Waiting for services to be ready...${NC}"
sleep 10

# 8. Verificar health check
echo -e "${YELLOW}[8/8] Verifying deployment...${NC}"
for i in {1..30}; do
    if curl -f http://localhost/health >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Deployment successful!${NC}"
        echo "$(date): Deployment completado exitosamente" >> $LOG_FILE
        
        echo -e "\n${GREEN}Services are running:${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE ps
        
        echo -e "\n${GREEN}Access your application at:${NC}"
        echo "  Frontend: http://localhost"
        echo "  Backend API: http://localhost/api/"
        echo "  Admin: http://localhost/admin/"
        
        exit 0
    fi
    echo "Waiting for application to respond... ($i/30)"
    sleep 10
done

echo -e "${RED}Error: Application did not respond after deployment${NC}"
echo "$(date): Error en deployment" >> $LOG_FILE

echo -e "\n${YELLOW}Checking logs:${NC}"
docker-compose -f $DOCKER_COMPOSE_FILE logs --tail=50

exit 1
