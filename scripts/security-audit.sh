#!/bin/bash
# Security Audit Script for GIC Production Deployment
# Usage: ./scripts/security-audit.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS_COUNT=0
WARN_COUNT=0
FAIL_COUNT=0

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  GIC Security Audit${NC}"
echo -e "${BLUE}  $(date)${NC}"
echo -e "${BLUE}========================================${NC}"

check_pass() {
    echo -e "${GREEN}✓ PASS:${NC} $1"
    ((PASS_COUNT++))
}

check_warn() {
    echo -e "${YELLOW}⚠ WARN:${NC} $1"
    ((WARN_COUNT++))
}

check_fail() {
    echo -e "${RED}✗ FAIL:${NC} $1"
    ((FAIL_COUNT++))
}

echo -e "\n${BLUE}=== Environment Variables ===${NC}"

# Check .env file exists
if [ -f .env ]; then
    check_pass ".env file exists"
    
    # Check SECRET_KEY
    if grep -q "SECRET_KEY=.*change.*production" .env 2>/dev/null || grep -q "SECRET_KEY=django-insecure" .env 2>/dev/null; then
        check_fail "SECRET_KEY appears to be default or insecure"
    else
        check_pass "SECRET_KEY appears to be customized"
    fi
    
    # Check DEBUG
    if grep -q "DEBUG=False" .env 2>/dev/null; then
        check_pass "DEBUG is set to False"
    else
        check_fail "DEBUG is not set to False"
    fi
    
    # Check passwords
    if grep -q "PASSWORD=.*secure.*here" .env 2>/dev/null || grep -q "PASSWORD=password" .env 2>/dev/null; then
        check_fail "Default passwords detected in .env"
    else
        check_pass "Passwords appear to be customized"
    fi
else
    check_fail ".env file not found"
fi

echo -e "\n${BLUE}=== SSL/TLS Configuration ===${NC}"

# Check if SSL is configured
if grep -q "SECURE_SSL_REDIRECT=True" .env 2>/dev/null; then
    check_pass "SSL redirect is enabled"
else
    check_warn "SSL redirect is not enabled"
fi

if grep -q "SESSION_COOKIE_SECURE=True" .env 2>/dev/null; then
    check_pass "Secure session cookies enabled"
else
    check_warn "Secure session cookies not enabled"
fi

echo -e "\n${BLUE}=== Docker Security ===${NC}"

# Check if containers are running as non-root
if docker ps --format '{{.Names}}' | grep -q GIC_backend; then
    BACKEND_USER=$(docker exec GIC_backend whoami 2>/dev/null || echo "root")
    if [ "$BACKEND_USER" != "root" ]; then
        check_pass "Backend container running as non-root user ($BACKEND_USER)"
    else
        check_warn "Backend container running as root"
    fi
else
    check_warn "Backend container not running"
fi

if docker ps --format '{{.Names}}' | grep -q GIC_frontend; then
    FRONTEND_USER=$(docker exec GIC_frontend whoami 2>/dev/null || echo "root")
    if [ "$FRONTEND_USER" != "root" ]; then
        check_pass "Frontend container running as non-root user ($FRONTEND_USER)"
    else
        check_warn "Frontend container running as root"
    fi
else
    check_warn "Frontend container not running"
fi

echo -e "\n${BLUE}=== Network Security ===${NC}"

# Check firewall status
if command -v ufw &> /dev/null; then
    if sudo ufw status | grep -q "Status: active"; then
        check_pass "UFW firewall is active"
    else
        check_warn "UFW firewall is not active"
    fi
else
    check_warn "UFW not installed"
fi

# Check for open ports
echo "Checking for exposed ports..."
if command -v netstat &> /dev/null; then
    OPEN_PORTS=$(netstat -tlnp 2>/dev/null | grep LISTEN | wc -l)
    echo "Found $OPEN_PORTS listening ports"
    
    # Check if MySQL is exposed publicly
    if netstat -tlnp 2>/dev/null | grep LISTEN | grep -q ":3306.*0.0.0.0"; then
        check_fail "MySQL port 3306 is exposed to 0.0.0.0 (publicly accessible)"
    else
        check_pass "MySQL port is not publicly exposed"
    fi
    
    # Check if Redis is exposed publicly
    if netstat -tlnp 2>/dev/null | grep LISTEN | grep -q ":6379.*0.0.0.0"; then
        check_fail "Redis port 6379 is exposed to 0.0.0.0 (publicly accessible)"
    else
        check_pass "Redis port is not publicly exposed"
    fi
fi

echo -e "\n${BLUE}=== Security Headers ===${NC}"

# Check security headers if nginx is running
if command -v curl &> /dev/null; then
    if curl -s -I http://localhost 2>/dev/null | grep -q "X-Frame-Options"; then
        check_pass "X-Frame-Options header is set"
    else
        check_warn "X-Frame-Options header is missing"
    fi
    
    if curl -s -I http://localhost 2>/dev/null | grep -q "X-Content-Type-Options"; then
        check_pass "X-Content-Type-Options header is set"
    else
        check_warn "X-Content-Type-Options header is missing"
    fi
    
    if curl -s -I http://localhost 2>/dev/null | grep -q "X-XSS-Protection"; then
        check_pass "X-XSS-Protection header is set"
    else
        check_warn "X-XSS-Protection header is missing"
    fi
    
    if curl -s -I http://localhost 2>/dev/null | grep -q "Content-Security-Policy"; then
        check_pass "Content-Security-Policy header is set"
    else
        check_warn "Content-Security-Policy header is missing"
    fi
fi

echo -e "\n${BLUE}=== Database Security ===${NC}"

if docker ps --format '{{.Names}}' | grep -q GIC_mysql; then
    # Check for test database
    TEST_DB=$(docker exec GIC_mysql mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SHOW DATABASES LIKE 'test';" 2>/dev/null | grep -c "test" || echo "0")
    if [ "$TEST_DB" -eq 0 ]; then
        check_pass "Test database does not exist"
    else
        check_warn "Test database exists (should be removed)"
    fi
else
    check_warn "MySQL container not running"
fi

echo -e "\n${BLUE}=== File Permissions ===${NC}"

# Check .env permissions
if [ -f .env ]; then
    ENV_PERMS=$(stat -c "%a" .env)
    if [ "$ENV_PERMS" = "600" ] || [ "$ENV_PERMS" = "400" ]; then
        check_pass ".env file has restrictive permissions ($ENV_PERMS)"
    else
        check_warn ".env file permissions are too open ($ENV_PERMS), should be 600 or 400"
    fi
fi

echo -e "\n${BLUE}=== Backup Configuration ===${NC}"

# Check if backup directory exists
if [ -d "/backups/GIC" ] || [ -d "$BACKUP_DIR" ]; then
    check_pass "Backup directory exists"
    
    # Check for recent backups
    BACKUP_DIR="${BACKUP_DIR:-/backups/GIC}"
    if [ -d "$BACKUP_DIR" ]; then
        RECENT_BACKUPS=$(find "$BACKUP_DIR" -name "GIC_backup_*.sql.gz" -mtime -7 2>/dev/null | wc -l)
        if [ "$RECENT_BACKUPS" -gt 0 ]; then
            check_pass "Recent backups found ($RECENT_BACKUPS in last 7 days)"
        else
            check_warn "No recent backups found (last 7 days)"
        fi
    fi
else
    check_warn "Backup directory not found"
fi

# Check for cron backup job
if crontab -l 2>/dev/null | grep -q "backup.sh"; then
    check_pass "Backup cron job is configured"
else
    check_warn "No backup cron job found"
fi

echo -e "\n${BLUE}=== Resource Limits ===${NC}"

# Check if resource limits are set
if docker inspect GIC_backend 2>/dev/null | grep -q "Memory"; then
    check_pass "Resource limits configured for backend"
else
    check_warn "No resource limits for backend container"
fi

echo -e "\n${BLUE}=== Health Checks ===${NC}"

# Check if health checks are passing
if curl -f -s http://localhost/health > /dev/null 2>&1; then
    check_pass "Main health check is passing"
else
    check_fail "Main health check is failing"
fi

if curl -f -s http://localhost/api/health/ > /dev/null 2>&1; then
    check_pass "API health check is passing"
else
    check_fail "API health check is failing"
fi

echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}  Security Audit Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Passed:${NC} $PASS_COUNT"
echo -e "${YELLOW}Warnings:${NC} $WARN_COUNT"
echo -e "${RED}Failed:${NC} $FAIL_COUNT"
echo ""

if [ "$FAIL_COUNT" -gt 0 ]; then
    echo -e "${RED}⚠ CRITICAL: Address all failed checks before production deployment${NC}"
    exit 1
elif [ "$WARN_COUNT" -gt 5 ]; then
    echo -e "${YELLOW}⚠ WARNING: Consider addressing warnings for better security${NC}"
    exit 0
else
    echo -e "${GREEN}✓ Security audit passed with acceptable warnings${NC}"
    exit 0
fi
