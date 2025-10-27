"""
Tests for GET /api/persons/search/?rut=...
"""

import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
def test_person_search_valid_found(api_client):
    # Create a user with a valid RUT
    user = User.objects.create_user(
        username="rutsearch",
        email="rutsearch@example.com",
        password="testpass123",
        first_name="Rut",
        last_name="Search",
        rut="11.111.111-1",
    )

    resp = api_client.get("/api/persons/search/", {"rut": "11111111-1"})
    assert resp.status_code == 200
    data = resp.json()
    assert "results" in data
    assert any(item["email"] == user.email for item in data["results"])


@pytest.mark.django_db
def test_person_search_invalid_rut(api_client):
    resp = api_client.get("/api/persons/search/", {"rut": "invalid"})
    assert resp.status_code == 400
    data = resp.json()
    assert "RUT inválido" in data.get("detail", "")


@pytest.mark.django_db
def test_person_search_not_found(api_client):
    resp = api_client.get("/api/persons/search/", {"rut": "22.222.222-2"})
    assert resp.status_code == 200
    data = resp.json()
    assert data.get("results") == []
