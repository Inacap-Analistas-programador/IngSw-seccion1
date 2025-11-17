"""
Configuración global de pytest y fixtures compartidos
Usa test_utils para evitar duplicación
"""
import pytest
from rest_framework.test import APIClient
from django.test import override_settings

from test_utils import TestDataFactory


@pytest.fixture
def api_client():
    """Cliente API para tests"""
    return APIClient()


@pytest.fixture
def test_perfil(db):
    """Perfil de prueba para tests"""
    return TestDataFactory.create_perfil()


@pytest.fixture
def test_usuario(db, test_perfil):
    """Usuario custom de prueba para tests"""
    return TestDataFactory.create_usuario(perfil=test_perfil)


@pytest.fixture
def test_user(db):
    """Django User para autenticación de tests"""
    return TestDataFactory.create_django_user()


@pytest.fixture
def authenticated_client(api_client, test_user):
    """Cliente API autenticado con un usuario de prueba"""
    api_client.force_authenticate(user=test_user)
    return api_client


@pytest.fixture
def admin_user(db):
    """Usuario administrador para tests"""
    from django.contrib.auth.models import User
    return User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='adminpass123'
    )


@pytest.fixture
def test_geografia(db):
    """Fixture para crear geografía básica (región, provincia, comuna)"""
    return TestDataFactory.create_geografia()


@pytest.fixture
def test_estado_civil(db):
    """Fixture para crear estado civil"""
    return TestDataFactory.create_estado_civil()


@pytest.fixture
def test_persona(db, test_usuario, test_geografia, test_estado_civil):
    """Fixture para crear persona completa"""
    return TestDataFactory.create_persona(
        usuario=test_usuario,
        geografia=test_geografia,
        estado_civil=test_estado_civil
    )


@pytest.fixture
def test_tipo_curso(db):
    """Fixture para crear tipo de curso"""
    return TestDataFactory.create_tipo_curso()


@pytest.fixture
def test_curso(db, test_tipo_curso, test_usuario, test_geografia):
    """Fixture para crear curso completo"""
    return TestDataFactory.create_curso(
        tipo_curso=test_tipo_curso,
        usuario=test_usuario,
        geografia=test_geografia
    )


@pytest.fixture
def test_curso_seccion(db, test_curso):
    """Fixture para crear sección de curso"""
    return TestDataFactory.create_curso_seccion(curso=test_curso)


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
