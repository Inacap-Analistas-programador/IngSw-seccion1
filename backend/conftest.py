"""
Configuración global de pytest y fixtures compartidos
"""
import pytest
from rest_framework.test import APIClient
from django.test import override_settings
from django.contrib.auth.models import User
from usuarios.models import Usuario
from maestros.models import Perfil


@pytest.fixture
def api_client():
    """Cliente API para tests"""
    return APIClient()


@pytest.fixture
def test_perfil(db):
    """Perfil de prueba para tests"""
    perfil, created = Perfil.objects.get_or_create(
        pel_descripcion='Test Profile',
        defaults={'pel_vigente': True}
    )
    return perfil


@pytest.fixture
def test_usuario(db, test_perfil):
    """Usuario custom de prueba para tests"""
    usuario = Usuario.objects.create(
        pel_id=test_perfil,
        usu_username='testuser',
        usu_email='test@example.com',
        usu_vigente=True
    )
    usuario.set_password('testpass123')
    usuario.save()
    return usuario


@pytest.fixture
def test_user(db):
    """Django User para autenticación de tests"""
    user = User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )
    return user


@pytest.fixture
def authenticated_client(api_client, test_user):
    """Cliente API autenticado con un usuario de prueba"""
    api_client.force_authenticate(user=test_user)
    return api_client


@pytest.fixture
def admin_user(db):
    """Usuario administrador para tests"""
    user = User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='adminpass123'
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
