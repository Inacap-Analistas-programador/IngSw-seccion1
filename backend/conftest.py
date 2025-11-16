"""
Configuración global de pytest y fixtures compartidos
"""
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from django.test import override_settings

User = get_user_model()


@pytest.fixture
def api_client():
    """Cliente API para tests"""
    return APIClient()


@pytest.fixture
def authenticated_client(api_client, test_user):
    """Cliente API autenticado con un usuario de prueba"""
    api_client.force_authenticate(user=test_user)
    return api_client


@pytest.fixture
def test_user(db):
    """Usuario de prueba para tests"""
    User = get_user_model()
    user = User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123',
        usu_nombre='Test',
        usu_apellido_paterno='User',
        usu_apellido_materno='Test'
    )
    return user


@pytest.fixture
def admin_user(db):
    """Usuario administrador para tests"""
    User = get_user_model()
    user = User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='adminpass123',
        usu_nombre='Admin',
        usu_apellido_paterno='User',
        usu_apellido_materno='Test'
    )
    return user


@pytest.fixture(autouse=True)
def enable_db_access_for_all_tests(db):
    """Habilita acceso a BD para todos los tests automáticamente"""
    pass


@pytest.fixture
def test_settings():
    """Settings de prueba con configuración segura"""
    with override_settings(
        DEBUG=False,
        SECRET_KEY='test-secret-key-for-testing-only-not-for-production',
        PASSWORD_HASHERS=['django.contrib.auth.hashers.MD5PasswordHasher'],
    ):
        yield
