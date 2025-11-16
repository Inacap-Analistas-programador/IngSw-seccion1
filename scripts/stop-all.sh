#!/bin/bash
# Stop all GIC services including monitoring
# Usage: ./scripts/stop-all.sh [--clean]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

CLEAN_MODE=false
if [ "$1" = "--clean" ]; then
    CLEAN_MODE=true
fi

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  Stopping GIC Services${NC}"
echo -e "${YELLOW}========================================${NC}"

# Stop main application
echo -e "\n${YELLOW}[1/3] Stopping main application...${NC}"
docker-compose -f docker-compose.prod.yml down

# Stop monitoring stack
echo -e "${YELLOW}[2/3] Stopping monitoring stack...${NC}"
cd monitoring
docker-compose -f docker-compose.monitoring.yml down
cd ..

if [ "$CLEAN_MODE" = true ]; then
    echo -e "\n${RED}[3/3] Cleaning up (removing volumes and images)...${NC}"
    echo -e "${RED}Warning: This will delete all data!${NC}"
    read -p "Are you sure? (yes/no): " confirm
    
    if [ "$confirm" = "yes" ]; then
        docker-compose -f docker-compose.prod.yml down -v
        docker-compose -f monitoring/docker-compose.monitoring.yml down -v
        
        # Remove GIC images
        docker images | grep GIC | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true
        
        echo -e "${GREEN}✓ Cleanup completed${NC}"
    else
        echo -e "${YELLOW}Cleanup cancelled${NC}"
    fi
else
    echo -e "${YELLOW}[3/3] Preserving volumes (use --clean to remove)${NC}"
fi

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ All Services Stopped${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Note:${NC} Volumes and data are preserved"
echo -e "${YELLOW}Note:${NC} Use './scripts/stop-all.sh --clean' to remove all data"
