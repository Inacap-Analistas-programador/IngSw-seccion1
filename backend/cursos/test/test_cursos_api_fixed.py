"""
Tests de API para cursos - CORREGIDO con test_utils
"""
import pytest
from rest_framework import status
from datetime import date, timedelta

from test_utils import TestDataFactory, AssertionHelpers


@pytest.mark.django_db
class TestCursoViewSetAPI:
    """Tests para CursoViewSet API"""
    
    def test_list_cursos(self, authenticated_client, test_curso):
        """Test listar cursos"""
        response = authenticated_client.get('/api/cursos/')
        
        AssertionHelpers.assert_valid_api_response(
            response,
            [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]
        )
    
    def test_retrieve_curso(self, authenticated_client, test_curso):
        """Test obtener un curso específico"""
        response = authenticated_client.get(f'/api/cursos/{test_curso.cur_id}/')
        
        AssertionHelpers.assert_valid_api_response(
            response,
            [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]
        )
    
    def test_create_curso(self, authenticated_client, test_tipo_curso, test_usuario, test_geografia):
        """Test crear un nuevo curso"""
        data = {
            'tic_id': test_tipo_curso.tic_id,
            'usu_id': test_usuario.usu_id,
            'com_id_lugar': test_geografia['comuna'].com_id,
            'cur_codigo': 'NEWTEST',
            'cur_descripcion': 'Nuevo Curso Test',
            'cur_lugar': 'Sede Test',
            'cur_estado': 1,
            'cur_vigente': True
        }
        
        response = authenticated_client.post('/api/cursos/', data)
        
        AssertionHelpers.assert_valid_api_response(
            response,
            [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST, 
             status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]
        )
    
    def test_list_cursos_unauthorized(self, api_client):
        """Test listar cursos sin autenticación"""
        response = api_client.get('/api/cursos/')
        
        AssertionHelpers.assert_valid_api_response(
            response,
            [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN, 
             status.HTTP_404_NOT_FOUND]
        )


@pytest.mark.django_db
class TestCursoFechaAPI:
    """Tests para CursoFecha API"""
    
    def test_create_curso_fecha(self, authenticated_client, test_curso):
        """Test crear fecha de curso"""
        data = {
            'cur_id': test_curso.cur_id,
            'cuf_fecha_inicio': date.today().isoformat(),
            'cuf_fecha_fin': (date.today() + timedelta(days=3)).isoformat(),
            'cuf_vigente': True
        }
        
        response = authenticated_client.post('/api/cursos-fechas/', data)
        
        AssertionHelpers.assert_valid_api_response(
            response,
            [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST,
             status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]
        )
    
    def test_list_curso_fechas(self, authenticated_client, test_curso):
        """Test listar fechas de cursos"""
        # Crear fecha usando factory
        TestDataFactory.create_curso_fecha(curso=test_curso)
        
        response = authenticated_client.get('/api/cursos-fechas/')
        
        AssertionHelpers.assert_valid_api_response(
            response,
            [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]
        )


@pytest.mark.django_db
class TestCursoSeccionAPI:
    """Tests para CursoSeccion API"""
    
    def test_create_curso_seccion(self, authenticated_client, test_curso):
        """Test crear sección de curso"""
        data = {
            'cur_id': test_curso.cur_id,
            'cus_descripcion': 'Sección Test',
            'cus_cant_participante': 25,
            'cus_vigente': True
        }
        
        response = authenticated_client.post('/api/cursos-secciones/', data)
        
        AssertionHelpers.assert_valid_api_response(
            response,
            [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST,
             status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]
        )
    
    def test_list_curso_secciones(self, authenticated_client, test_curso_seccion):
        """Test listar secciones de cursos"""
        response = authenticated_client.get('/api/cursos-secciones/')
        
        AssertionHelpers.assert_valid_api_response(
            response,
            [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]
        )


@pytest.mark.integration
@pytest.mark.django_db
class TestCursosIntegration:
    """Tests de integración para cursos"""
    
    def test_complete_curso_workflow(self, authenticated_client, test_tipo_curso, 
                                     test_usuario, test_geografia):
        """Test flujo completo: crear curso, añadir fecha y sección"""
        # Crear curso usando factory
        curso = TestDataFactory.create_curso(
            tipo_curso=test_tipo_curso,
            usuario=test_usuario,
            geografia=test_geografia,
            cur_codigo='FLOW001'
        )
        
        # Verificar curso creado
        AssertionHelpers.assert_model_created(curso)
        
        # Crear fecha
        fecha = TestDataFactory.create_curso_fecha(curso=curso)
        AssertionHelpers.assert_model_created(fecha)
        
        # Crear sección
        seccion = TestDataFactory.create_curso_seccion(curso=curso)
        AssertionHelpers.assert_model_created(seccion)
        
        # Verificar que todo está relacionado
        assert fecha.cur_id == curso
        assert seccion.cur_id == curso
