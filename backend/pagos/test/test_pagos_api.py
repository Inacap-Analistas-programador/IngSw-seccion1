import pytest
from rest_framework.test import APIClient
from rest_framework import status
from datetime import datetime
from decimal import Decimal

from test_utils import TestDataFactory, AssertionHelpers
from pagos.models import PagoPersona, PagoCambioPersona


@pytest.mark.django_db
class TestPagoPersonaAPI:
    def setup_method(self):
        self.client = APIClient()
        self.django_user = TestDataFactory.create_django_user('apiuser', 'apiuser@example.com', 'pass123')
        self.client.force_authenticate(user=self.django_user)
        self.usuario = TestDataFactory.create_usuario(username='apiuser', email='apiuser@example.com')

        self.perfil = TestDataFactory.create_perfil()
        self.geografia = TestDataFactory.create_geografia()
        self.zdg = TestDataFactory.create_zona_distrito_grupo(self.geografia)

        # create personas and inscriptions
        self.personas = [
            TestDataFactory.create_persona(usuario=self.usuario, per_nombres=f'N{i}', per_apelpat=f'A{i}') for i in range(3)
        ]
        self.curso = TestDataFactory.create_curso(usuario=self.usuario, geografia=self.geografia)
        self.seccion = TestDataFactory.create_curso_seccion(curso=self.curso)
        for p in self.personas:
            TestDataFactory.create_persona_curso(persona=p, seccion=self.seccion)

    def test_search_by_rut_or_name(self):
        sample = self.personas[0]
        # by name
        response = self.client.get(f'/api/pagos/?search={sample.per_nombres}')
        assert response.status_code == status.HTTP_200_OK

    def test_registro_masivo_crea_pagos_y_calcula_valor_por_persona(self):
        payload = {
            'valor_total': '90000',
            'cur_id': self.curso.cur_id,
            'pap_tipo': PagoPersona.PAP_TIPO_INGRESO
        }
        response = self.client.post('/api/pagos/masivo/', payload, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        json_data = response.json()
        assert 'valor_por_persona' in json_data
        assert json_data['created_count'] == 3
        assert len(json_data['pagos']) == 3
        assert Decimal(json_data['valor_por_persona']) == Decimal('30000')

    def test_cambio_persona_creates_PagoCambioPersona_and_updates_pago(self):
        # Create an initial payment
        p = TestDataFactory.create_pago_persona(persona=self.personas[0], curso=self.curso, usuario=self.usuario)
        new_person = self.personas[1]
        response = self.client.post(f'/api/pagos/{p.pap_id}/cambio-persona/', {'new_per_id': new_person.per_id}, format='json')
        assert response.status_code == status.HTTP_200_OK
        # Verify PagoCambioPersona record created
        cambio = PagoCambioPersona.objects.filter(pap_id=p).first()
        assert cambio is not None
        # Verify payment updated
        p.refresh_from_db()
        assert p.per_id == new_person

    def test_export_csv(self):
        # create a payment to export
        p = TestDataFactory.create_pago_persona(persona=self.personas[0], curso=self.curso, usuario=self.usuario)
        response = self.client.get('/api/pagos/export')
        assert response.status_code == status.HTTP_200_OK
        assert response['Content-Type'] == 'text/csv'
        assert 'Rut' in response.content.decode('utf-8')
