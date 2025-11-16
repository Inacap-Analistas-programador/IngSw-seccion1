#!/bin/bash
# Health check script for backend
# This script is called by Docker's HEALTHCHECK

set -e

# Check if server is responding
if curl -f -s http://localhost:8000/api/health/ > /dev/null 2>&1; then
    exit 0
else
    exit 1
fi
