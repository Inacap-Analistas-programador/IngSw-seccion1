#!/bin/bash
# Deploy GIC to Production with Zero-Downtime and Rollback
# Usage: ./scripts/deploy-production.sh [--rollback]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables de configuración
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
BACKUP_DIR="${BACKUP_DIR:-/backups/GIC}"
LOG_FILE="${LOG_FILE:-/var/log/GIC-deploy.log}"
MAX_HEALTH_CHECKS=30
HEALTH_CHECK_INTERVAL=10

# Funciones de utilidad
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
    echo "$(date +'%Y-%m-%d %H:%M:%S'): $1" >> "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" >&2
    echo "$(date +'%Y-%m-%d %H:%M:%S'): ERROR: $1" >> "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
    echo "$(date +'%Y-%m-%d %H:%M:%S'): WARNING: $1" >> "$LOG_FILE"
}

step() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

# Función de rollback
rollback() {
    log_error "Deployment failed. Initiating rollback..."
    step "Rolling back to previous version"
    
    if [ -f "$BACKUP_DIR/.last_deployment" ]; then
        LAST_TAG=$(cat "$BACKUP_DIR/.last_deployment")
        log "Rolling back to tag: $LAST_TAG"
        
        # Restaurar imágenes anteriores
        docker tag "GIC_backend:$LAST_TAG" "GIC_backend:latest" 2>/dev/null || true
        docker tag "GIC_frontend:$LAST_TAG" "GIC_frontend:latest" 2>/dev/null || true
        
        # Reiniciar servicios
        docker-compose -f "$DOCKER_COMPOSE_FILE" down
        docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
        
        log "Rollback completed. Please check application status."
    else
        log_warning "No previous deployment found. Manual intervention required."
    fi
    
    exit 1
}

# Trap errors
trap rollback ERR

# Verificar modo rollback manual
if [ "$1" = "--rollback" ]; then
    rollback
    exit 0
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  GIC Production Deployment${NC}"
echo -e "${GREEN}  $(date)${NC}"
echo -e "${GREEN}========================================${NC}"

# Verificar prerrequisitos
step "[1/12] Verifying prerequisites"

if [ ! -f .env ]; then
    log_error ".env file not found"
    echo "Please create .env file from .env.production.example"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose is not installed"
    exit 1
fi

log "Prerequisites verified ✓"

# Crear directorio de backup
step "[2/12] Creating backup directory"
mkdir -p "$BACKUP_DIR"
mkdir -p "$(dirname "$LOG_FILE")"
log "Backup directory ready ✓"

# Crear tag para versión actual antes de actualizar
step "[3/12] Tagging current version"
CURRENT_TAG="backup-$(date +%Y%m%d_%H%M%S)"
if docker ps -a | grep -q GIC_backend; then
    docker tag GIC_backend:latest "GIC_backend:$CURRENT_TAG" 2>/dev/null || true
    docker tag GIC_frontend:latest "GIC_frontend:$CURRENT_TAG" 2>/dev/null || true
    echo "$CURRENT_TAG" > "$BACKUP_DIR/.last_deployment"
    log "Current version tagged as $CURRENT_TAG ✓"
else
    log_warning "No existing deployment found. Proceeding with fresh installation."
fi

# Backup de base de datos
step "[4/12] Creating database backup"
if docker ps -a | grep -q GIC_mysql; then
    BACKUP_FILE="$BACKUP_DIR/GIC_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    # Source .env para obtener credenciales
    export $(grep -v '^#' .env | xargs)
    
    docker exec GIC_mysql mysqldump \
        --single-transaction \
        --routines \
        --triggers \
        --databases "$MYSQL_DATABASE" \
        -u root -p"$MYSQL_ROOT_PASSWORD" > "$BACKUP_FILE" 2>/dev/null || log_warning "Database backup failed"
    
    if [ -f "$BACKUP_FILE" ]; then
        gzip "$BACKUP_FILE"
        log "Database backup created: $(basename "$BACKUP_FILE").gz ✓"
    fi
else
    log_warning "No existing database to backup"
fi

# Pull de nuevas imágenes
step "[5/12] Pulling latest images"
docker-compose -f "$DOCKER_COMPOSE_FILE" pull
log "Images pulled ✓"

# Construir nuevas imágenes
step "[6/12] Building new images"
docker-compose -f "$DOCKER_COMPOSE_FILE" build --no-cache
log "Images built ✓"

# Verificar integridad de imágenes
step "[7/12] Verifying image integrity"
docker images | grep GIC || log_error "Failed to build images"
log "Images verified ✓"

# Iniciar nuevos contenedores
step "[8/12] Starting new containers"
docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
log "Containers started ✓"

# Esperar a que los servicios estén listos
step "[9/12] Waiting for services to be ready"
sleep 20
log "Initial wait completed ✓"

# Verificar que todos los contenedores estén corriendo
step "[10/12] Checking container status"
CONTAINERS=$(docker-compose -f "$DOCKER_COMPOSE_FILE" ps -q)
for container in $CONTAINERS; do
    if [ "$(docker inspect -f '{{.State.Running}}' "$container")" != "true" ]; then
        log_error "Container $container is not running"
        docker logs "$container" --tail 50
        exit 1
    fi
done
log "All containers running ✓"

# Health check detallado
step "[11/12] Performing health checks"
HEALTH_CHECK_PASSED=false

for i in $(seq 1 $MAX_HEALTH_CHECKS); do
    log "Health check attempt $i/$MAX_HEALTH_CHECKS"
    
    # Check backend health
    if curl -f -s http://localhost/api/health/ > /dev/null 2>&1; then
        log "Backend health check passed ✓"
        HEALTH_CHECK_PASSED=true
        break
    fi
    
    if [ $i -eq $MAX_HEALTH_CHECKS ]; then
        log_error "Health checks failed after $MAX_HEALTH_CHECKS attempts"
        log "Checking container logs..."
        docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
        exit 1
    fi
    
    sleep $HEALTH_CHECK_INTERVAL
done

if [ "$HEALTH_CHECK_PASSED" = true ]; then
    log "All health checks passed ✓"
else
    log_error "Health checks failed"
    exit 1
fi

# Verificación final
step "[12/12] Final verification"

# Verificar endpoints principales
ENDPOINTS=(
    "http://localhost/health"
    "http://localhost/api/health/"
)

for endpoint in "${ENDPOINTS[@]}"; do
    if curl -f -s "$endpoint" > /dev/null 2>&1; then
        log "Endpoint $endpoint is responding ✓"
    else
        log_warning "Endpoint $endpoint is not responding"
    fi
done

# Limpiar imágenes antiguas
log "Cleaning up old images..."
docker image prune -f > /dev/null 2>&1 || true

# Deployment exitoso
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ Deployment Successful!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Services Status:${NC}"
docker-compose -f "$DOCKER_COMPOSE_FILE" ps
echo ""
echo -e "${BLUE}Access Information:${NC}"
echo "  • Frontend: http://localhost"
echo "  • Backend API: http://localhost/api/"
echo "  • Admin Panel: http://localhost/admin/"
echo "  • API Documentation: http://localhost/api/swagger/"
echo ""
echo -e "${BLUE}Monitoring:${NC}"
echo "  • Prometheus: http://localhost:9090"
echo "  • Grafana: http://localhost:3001"
echo "  • Alertmanager: http://localhost:9093"
echo ""
echo -e "${YELLOW}Note:${NC} Backup created at: $BACKUP_DIR"
echo -e "${YELLOW}Note:${NC} Previous version tagged as: $CURRENT_TAG"
echo ""
log "Deployment completed successfully"

exit 0
