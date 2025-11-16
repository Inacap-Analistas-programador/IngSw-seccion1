#!/bin/bash
# Backup Script for GIC
# Usage: ./scripts/backup.sh

set -e

BACKUP_DIR="${BACKUP_DIR:-/backups/GIC}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
DATE=$(date +%Y%m%d_%H%M%S)

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  GIC Backup Script${NC}"
echo -e "${GREEN}========================================${NC}"

# Crear directorio de backup
mkdir -p $BACKUP_DIR

# Backup de base de datos
echo -e "${YELLOW}Creating database backup...${NC}"
docker exec GIC_mysql mysqldump \
  --single-transaction \
  --routines \
  --triggers \
  --databases $MYSQL_DATABASE \
  -u root -p$MYSQL_ROOT_PASSWORD > "$BACKUP_DIR/GIC_db_$DATE.sql" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database backup created: GIC_db_$DATE.sql${NC}"
    
    # Comprimir backup de base de datos
    echo -e "${YELLOW}Compressing database backup...${NC}"
    gzip "$BACKUP_DIR/GIC_db_$DATE.sql"
    echo -e "${GREEN}✓ Compressed to: GIC_db_$DATE.sql.gz${NC}"
else
    echo "Error: Failed to create database backup"
    exit 1
fi

# Backup de archivos de media (si existen)
if docker volume inspect GIC_media_volume >/dev/null 2>&1; then
    echo -e "${YELLOW}Creating media files backup...${NC}"
    docker run --rm \
      -v GIC_media_volume:/data \
      -v $BACKUP_DIR:/backup \
      alpine tar czf /backup/GIC_media_$DATE.tar.gz -C /data .
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Media backup created: GIC_media_$DATE.tar.gz${NC}"
    fi
fi

# Limpiar backups antiguos
echo -e "${YELLOW}Cleaning old backups (older than $RETENTION_DAYS days)...${NC}"
find $BACKUP_DIR -name "GIC_*" -mtime +$RETENTION_DAYS -delete
echo -e "${GREEN}✓ Old backups cleaned${NC}"

# Mostrar resumen
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Backup Summary:${NC}"
echo -e "${GREEN}========================================${NC}"
echo "Backup directory: $BACKUP_DIR"
echo "Date: $DATE"
ls -lh $BACKUP_DIR/GIC_*$DATE* 2>/dev/null || echo "No backups created"
echo -e "${GREEN}========================================${NC}"
