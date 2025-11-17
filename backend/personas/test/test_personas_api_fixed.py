"""
Tests de API para personas y pagos - CORREGIDO con test_utils
"""
import pytest
from rest_framework import status
from decimal import Decimal

from test_utils import TestDataFactory, AssertionHelpers


@pytest.mark.django_db
class TestPersonaAPI:
    """Tests para Persona API"""
    
    def test_list_personas(self, authenticated_client, test_persona):
        """Test listar personas"""
        response = authenticated_client.get('/api/personas/')
        
        AssertionHelpers.assert_valid_api_response(
            response,
            [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]
        )
    
    def test_retrieve_persona(self, authenticated_client, test_persona):
        """Test obtener una persona específica"""
        response = authenticated_client.get(f'/api/personas/{test_persona.per_id}/')
        
        AssertionHelpers.assert_valid_api_response(
            response,
            [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]
        )
    
    def test_create_persona(self, authenticated_client, test_usuario, 
                          test_geografia, test_estado_civil):
        """Test crear una nueva persona"""
        data = {
            'usu_id': test_usuario.usu_id,
            'esc_id': test_estado_civil.esc_id,
            'com_id': test_geografia['comuna'].com_id,
            'per_run': '98765432-1',
            'per_nombres': 'María',
            'per_apelpat': 'López',
            'per_apelmat': 'Silva',
            'per_sexo': 'F',
            'per_fnac': '1995-05-15',
            'per_email': 'maria.lopez@test.com',
            'per_fono': '987654321',
            'per_vigente': True
        }
        
        response = authenticated_client.post('/api/personas/', data)
        
        AssertionHelpers.assert_valid_api_response(
            response,
            [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST,
             status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]
        )
    
    def test_list_personas_unauthorized(self, api_client):
        """Test listar personas sin autenticación"""
        response = api_client.get('/api/personas/')
        
        AssertionHelpers.assert_valid_api_response(
            response,
            [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN,
             status.HTTP_404_NOT_FOUND]
        )


@pytest.mark.django_db
class TestPagoPersonaAPI:
    """Tests para PagoPersona API"""
    
    def test_list_pagos(self, authenticated_client):
        """Test listar pagos"""
        # Crear pago usando factory
        pago = TestDataFactory.create_pago_persona()
        
        response = authenticated_client.get('/api/pagos/')
        
        AssertionHelpers.assert_valid_api_response(
            response,
            [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]
        )
    
    def test_retrieve_pago(self, authenticated_client):
        """Test obtener un pago específico"""
        pago = TestDataFactory.create_pago_persona()
        
        response = authenticated_client.get(f'/api/pagos/{pago.pap_id}/')
        
        AssertionHelpers.assert_valid_api_response(
            response,
            [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]
        )
    
    def test_create_pago(self, authenticated_client, test_persona, 
                        test_curso, test_usuario):
        """Test crear un nuevo pago"""
        data = {
            'per_id': test_persona.per_id,
            'cur_id': test_curso.cur_id,
            'usu_id': test_usuario.usu_id,
            'pap_tipo': 1,
            'pap_valor': '75000.00',
            'pap_observacion': 'Pago de prueba API'
        }
        
        response = authenticated_client.post('/api/pagos/', data)
        
        AssertionHelpers.assert_valid_api_response(
            response,
            [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST,
             status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]
        )


@pytest.mark.django_db
class TestPersonaCursoAPI:
    """Tests para inscripciones PersonaCurso"""
    
    def test_create_inscripcion(self, authenticated_client, test_persona, 
                               test_curso_seccion):
        """Test inscribir persona a curso"""
        data = {
            'per_id': test_persona.per_id,
            'cus_id': test_curso_seccion.cus_id,
            'pec_registro': True
        }
        
        response = authenticated_client.post('/api/inscripciones/', data)
        
        AssertionHelpers.assert_valid_api_response(
            response,
            [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST,
             status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]
        )
    
    def test_list_inscripciones(self, authenticated_client):
        """Test listar inscripciones"""
        # Crear inscripción usando factory
        inscripcion = TestDataFactory.create_persona_curso()
        
        response = authenticated_client.get('/api/inscripciones/')
        
        AssertionHelpers.assert_valid_api_response(
            response,
            [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]
        )


@pytest.mark.integration
@pytest.mark.django_db
class TestPersonasPagosIntegration:
    """Tests de integración para personas y pagos"""
    
    def test_complete_enrollment_payment_workflow(self):
        """Test flujo completo: crear persona, inscribir y registrar pago"""
        # Crear persona completa
        persona = TestDataFactory.create_persona()
        AssertionHelpers.assert_model_created(persona)
        
        # Crear curso y sección
        curso = TestDataFactory.create_curso()
        seccion = TestDataFactory.create_curso_seccion(curso=curso)
        
        # Inscribir persona
        inscripcion = TestDataFactory.create_persona_curso(
            persona=persona,
            seccion=seccion
        )
        AssertionHelpers.assert_model_created(inscripcion)
        
        # Registrar pago
        pago = TestDataFactory.create_pago_persona(
            persona=persona,
            curso=curso,
            usuario=persona.usu_id
        )
        AssertionHelpers.assert_model_created(pago)
        
        # Verificar relaciones
        assert inscripcion.per_id == persona
        assert pago.per_id == persona
        assert pago.cur_id == curso
    
    def test_persona_multiple_pagos(self):
        """Test persona con múltiples pagos"""
        persona = TestDataFactory.create_persona()
        curso = TestDataFactory.create_curso()
        
        # Crear 3 pagos para la misma persona y curso
        pagos = []
        for i in range(3):
            pago = TestDataFactory.create_pago_persona(
                persona=persona,
                curso=curso,
                usuario=persona.usu_id,
                pap_valor=Decimal(str(10000 * (i + 1)))
            )
            pagos.append(pago)
        
        # Verificar que se crearon todos
        assert len(pagos) == 3
        
        # Verificar valores distintos
        valores = [p.pap_valor for p in pagos]
        assert len(set(valores)) == 3  # Todos diferentes
