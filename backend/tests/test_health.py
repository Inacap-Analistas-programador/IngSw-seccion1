"""
Tests for SGICS health check endpoints.

Covers:
- /healthz/healthz (basic health)
- /healthz/readyz (readiness: DB + cache)
- /healthz/livez (liveness)
- /healthz/ (alias to basic health)
"""

import pytest


@pytest.mark.django_db
def test_healthz_basic_ok(client):
    resp = client.get("/healthz/healthz")
    assert resp.status_code == 200
    data = resp.json()
    assert data.get("status") == "healthy"
    assert data.get("service") == "sgics-backend"
    assert isinstance(data.get("timestamp"), int)


@pytest.mark.django_db
def test_healthz_alias_root_ok(client):
    # Alias route should return same as healthz
    resp = client.get("/healthz/")
    assert resp.status_code == 200
    data = resp.json()
    assert data.get("status") == "healthy"
    assert data.get("service") == "sgics-backend"


@pytest.mark.django_db
def test_readyz_ok(client):
    resp = client.get("/healthz/readyz")
    assert resp.status_code == 200
    data = resp.json()
    assert data.get("status") == "ready"
    checks = data.get("checks") or {}
    # Database must be healthy
    assert checks.get("database", {}).get("status") == "healthy"
    # Cache should be healthy in testing; tolerate warning if backend unavailable
    assert checks.get("cache", {}).get("status") in {"healthy", "warning"}


@pytest.mark.django_db
def test_livez_ok(client):
    resp = client.get("/healthz/livez")
    assert resp.status_code == 200
    data = resp.json()
    assert data.get("status") == "alive"
    assert data.get("service") == "sgics-backend"
    # response_time_ms should be present and an int
    assert isinstance(data.get("response_time_ms"), int)
