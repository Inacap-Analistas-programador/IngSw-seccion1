"""
Configuración base para tests de SGICS
Sistema de Gestión Integral de Cursos Scout

Este módulo contiene fixtures y configuraciones comunes para todos los tests.
"""

import pytest
from django.test import Client
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


@pytest.fixture
def client():
    """Cliente HTTP básico de Django para tests."""
    return Client()


@pytest.fixture
def api_client():
    """Cliente API de Django REST Framework para tests."""
    return APIClient()


@pytest.fixture
def user_data():
    """Datos de usuario base para tests."""
    return {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'testpass123',
        'first_name': 'Test',
        'last_name': 'User',
        'rut': '12.345.678-9',
        'telefono': '+56912345678'
    }


@pytest.fixture
def user(user_data):
    """Usuario de test básico."""
    return User.objects.create_user(**user_data)


@pytest.fixture
def admin_user():
    """Usuario administrador para tests."""
    return User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='adminpass123',
        first_name='Admin',
        last_name='User',
        rut='98.765.432-1',
        telefono='+56987654321'
    )


@pytest.fixture
def authenticated_client(api_client, user):
    """Cliente API autenticado con JWT."""
    refresh = RefreshToken.for_user(user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client


@pytest.fixture
def admin_client(api_client, admin_user):
    """Cliente API autenticado como administrador."""
    refresh = RefreshToken.for_user(admin_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client


@pytest.fixture
def course_data():
    """Datos de curso base para tests."""
    return {
        'name': 'Curso de Primeros Auxilios',
        'description': 'Curso básico de primeros auxilios para scouts',
        'max_participants': 30,
        'min_age': 16,
        'max_age': 65,
        'price': 25000,
        'duration_hours': 8,
        'is_active': True
    }


@pytest.fixture
def preinscription_data():
    """Datos de preinscripción base para tests."""
    return {
        'participant_name': 'Juan Pérez',
        'participant_email': 'juan@example.com',
        'participant_phone': '+56912345678',
        'participant_rut': '12.345.678-9',
        'participant_age': 25,
        'emergency_contact': 'María Pérez',
        'emergency_phone': '+56987654321'
    }