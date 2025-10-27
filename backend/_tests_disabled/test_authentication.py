"""
Tests para la aplicación de autenticación de SGICS
Sistema de Gestión Integral de Cursos Scout

Cubre el modelo de Usuario, serializers, views y autenticación JWT.
"""

import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


@pytest.mark.django_db
class TestUserModel:
    """Tests para el modelo User personalizado."""

    def test_create_user_success(self, user_data):
        """Test: Crear usuario con datos válidos."""
        user = User.objects.create_user(**user_data)
        
        assert user.email == user_data['email']
        assert user.first_name == user_data['first_name']
        assert user.last_name == user_data['last_name']
        assert user.rut == user_data['rut']
        assert user.telefono == user_data['telefono']
        assert user.check_password(user_data['password'])
        assert not user.is_staff
        assert not user.is_superuser
        assert user.is_active

    def test_create_superuser_success(self):
        """Test: Crear superusuario con datos válidos."""
        user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User',
            rut='98.765.432-1'
        )
        
        assert user.is_staff
        assert user.is_superuser
        assert user.is_active

    def test_user_email_unique(self, user_data):
        """Test: Email debe ser único."""
        User.objects.create_user(**user_data)
        
        with pytest.raises(Exception):  # IntegrityError esperado
            User.objects.create_user(**user_data)

    def test_user_str_representation(self, user):
        """Test: Representación string del usuario."""
        expected = f"{user.first_name} {user.last_name}"  # Based on get_full_name() method
        assert str(user) == expected


@pytest.mark.django_db
class TestAuthenticationAPI:
    """Tests para los endpoints de autenticación."""

    def test_jwt_login_success(self, api_client, user):
        """Test: Login JWT con credenciales correctas."""
        url = reverse('token_obtain_pair')
        data = {
            'username': user.username,
            'password': 'testpass123'  # Password del fixture user
        }
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data

    def test_jwt_login_invalid_credentials(self, api_client, user):
        """Test: Login JWT con credenciales incorrectas debe fallar."""
        url = reverse('token_obtain_pair')
        data = {
            'username': user.username,
            'password': 'wrongpassword'
        }
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_jwt_refresh_token(self, api_client, user):
        """Test: Refresh token functionality."""
        # Get initial tokens
        login_url = reverse('token_obtain_pair')
        login_data = {
            'username': user.username,
            'password': 'testpass123'
        }
        login_response = api_client.post(login_url, login_data, format='json')
        refresh_token = login_response.data['refresh']
        
        # Use refresh token to get new access token
        refresh_url = reverse('token_refresh')
        refresh_data = {'refresh': refresh_token}
        refresh_response = api_client.post(refresh_url, refresh_data, format='json')
        
        assert refresh_response.status_code == status.HTTP_200_OK
        assert 'access' in refresh_response.data

    def test_person_search_requires_rut_param(self, authenticated_client):
        """Test: Person search endpoint requires 'rut' parameter."""
        url = reverse('persons-search')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_person_search_with_valid_rut(self, authenticated_client):
        """Test: Person search works with valid RUT parameter."""
        url = reverse('persons-search')
        response = authenticated_client.get(url, {'rut': '12345678-9'})
        
        assert response.status_code == status.HTTP_200_OK
        assert 'results' in response.data


@pytest.mark.integration
@pytest.mark.django_db
class TestUserWorkflow:
    """Tests de integración para flujo completo de usuario."""

    def test_complete_user_creation_and_jwt_login_flow(self, api_client):
        """Test: Flujo completo de creación de usuario y login JWT."""
        # 1. Crear usuario programáticamente
        user_data = {
            'username': 'workflow_user',
            'email': 'workflow@example.com',
            'password': 'workflowpass123',
            'first_name': 'Workflow',
            'last_name': 'Test',
            'rut': '11.111.111-1',
            'telefono': '+56911111111'
        }
        
        user = User.objects.create_user(**user_data)
        assert user.first_name == user_data['first_name']
        
        # 2. Login JWT con las credenciales
        login_url = reverse('token_obtain_pair')
        login_data = {
            'username': user_data['username'],
            'password': user_data['password']
        }
        
        login_response = api_client.post(login_url, login_data, format='json')
        assert login_response.status_code == status.HTTP_200_OK
        assert 'access' in login_response.data
        
        # 3. Usar el token para acceder a endpoint protegido
        token = login_response.data['access']
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # Test person search as protected endpoint
        search_url = reverse('persons-search')
        search_response = api_client.get(search_url, {'rut': '12345678-9'})
        assert search_response.status_code == status.HTTP_200_OK
        assert 'results' in search_response.data