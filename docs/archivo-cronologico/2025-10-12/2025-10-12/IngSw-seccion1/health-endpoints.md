## Health Endpoints Documentation

This document describes the health check endpoints available in the SGICS backend.

### Overview

The SGICS system provides two health check endpoints that follow Kubernetes best practices:

- `/healthz` - Basic health check
- `/readyz` - Readiness check

### Endpoints

#### GET /healthz

**Purpose**: Returns the basic health status of the application.

**Description**: This endpoint indicates whether the application is running and can receive requests. It performs basic checks to ensure the application is operational.

**Response**:
- **Status Code**: 200 OK (when healthy)
- **Content-Type**: application/json

**Example Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-12T18:30:00Z"
}
```

**Usage**: Use this endpoint for basic health monitoring and load balancer health checks.

#### GET /readyz

**Purpose**: Returns the readiness status of the application.

**Description**: This endpoint indicates whether the application is ready to serve traffic. It may perform additional checks compared to `/healthz`, such as database connectivity, external service availability, etc.

**Response**:
- **Status Code**: 200 OK (when ready)
- **Content-Type**: application/json

**Example Response**:
```json
{
  "status": "ready",
  "timestamp": "2025-10-12T18:30:00Z",
  "checks": {
    "database": "connected",
    "cache": "available"
  }
}
```

**Usage**: Use this endpoint for deployment readiness checks and to determine when the application is fully ready to handle requests.

### Implementation Details

- Both endpoints are implemented in the Django backend
- They follow standard HTTP status codes (200 for healthy/ready)
- Responses include timestamps for monitoring purposes
- The endpoints are lightweight and designed for frequent polling

### Deployment Integration

These endpoints can be integrated with:

- **Kubernetes**: Use `/healthz` for liveness probes and `/readyz` for readiness probes
- **Load Balancers**: Configure health checks against `/healthz`
- **Monitoring Systems**: Set up periodic checks against both endpoints
- **CI/CD Pipelines**: Verify application readiness during deployments

### Example Kubernetes Configuration

```yaml
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
      - name: sgics-backend
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /readyz
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Monitoring and Alerting

- Monitor both endpoints for availability (should return 200)
- Set up alerts if endpoints return non-200 status codes
- Track response times for performance monitoring
- Consider setting up synthetic monitoring to test from external locations

---

**Status**: ✅ Implemented and tested
**Last Updated**: October 12, 2025
**Related Tasks**: SCRUM-112, SCRUM-111, SCRUM-113, SCRUM-110