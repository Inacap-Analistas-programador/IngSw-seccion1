#!/bin/bash
# Start GIC with Full Monitoring Stack
# Usage: ./scripts/start-with-monitoring.sh

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Starting GIC with Monitoring${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Warning: .env file not found${NC}"
    echo "Creating .env from .env.production.example..."
    cp .env.production.example .env
    echo "Please edit .env with your production values before proceeding."
    exit 1
fi

# Start main application
echo -e "\n${BLUE}[1/3] Starting main application...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo -e "${BLUE}[2/3] Waiting for services to be ready...${NC}"
sleep 20

# Check if services are healthy
echo "Checking service health..."
for i in {1..10}; do
    if curl -f -s http://localhost/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Application is healthy${NC}"
        break
    fi
    if [ $i -eq 10 ]; then
        echo -e "${YELLOW}Warning: Application health check timeout${NC}"
    fi
    sleep 5
done

# Start monitoring stack
echo -e "\n${BLUE}[3/3] Starting monitoring stack...${NC}"
cd monitoring
docker-compose -f docker-compose.monitoring.yml up -d
cd ..

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ All Services Started${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Application URLs:${NC}"
echo "  • Frontend: http://localhost"
echo "  • Backend API: http://localhost/api/"
echo "  • Admin Panel: http://localhost/admin/"
echo "  • API Docs: http://localhost/api/swagger/"
echo ""
echo -e "${BLUE}Monitoring URLs:${NC}"
echo "  • Prometheus: http://localhost:9090"
echo "  • Grafana: http://localhost:3001 (admin/admin)"
echo "  • Alertmanager: http://localhost:9093"
echo "  • Node Exporter: http://localhost:9100/metrics"
echo ""
echo -e "${BLUE}Services Status:${NC}"
docker-compose -f docker-compose.prod.yml ps
echo ""
docker-compose -f monitoring/docker-compose.monitoring.yml ps
echo ""
echo -e "${YELLOW}Tip:${NC} Use './scripts/stop-all.sh' to stop all services"
echo -e "${YELLOW}Tip:${NC} Check logs with 'docker-compose -f docker-compose.prod.yml logs -f'"
