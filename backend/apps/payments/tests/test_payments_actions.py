from datetime import date

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from apps.courses.models import Course
from apps.preinscriptions.models import Preinscripcion
from apps.payments.models import PagoPersona


User = get_user_model()


class PaymentsActionsAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='tester', password='x')
        self.other = User.objects.create_user(username='other', password='x')
        self.client.force_authenticate(self.user)
        self.course = Course.objects.create(
            title='Curso Prueba',
            description='Desc',
            code='C-001',
            max_participants=10,
            price=1000,
            start_date=date(2025, 1, 5),
            end_date=date(2025, 1, 6),
            created_by=self.user,
        )
        self.pre_aprobada = Preinscripcion.objects.create(
            user=self.user, course=self.course, estado=Preinscripcion.APROBADA, grupo='Grupo Uno'
        )
        # Use a second course to avoid unique_together(user, course) constraint
        self.course2 = Course.objects.create(
            title='Curso Secundario',
            description='Desc 2',
            code='C-002',
            max_participants=10,
            price=800,
            start_date=date(2025, 2, 5),
            end_date=date(2025, 2, 6),
            created_by=self.user,
        )
        self.pre_borrador = Preinscripcion.objects.create(
            user=self.user, course=self.course2, estado=Preinscripcion.BORRADOR, grupo='Grupo Uno'
        )
        # Create a PagoPersona according to the canonical model (Camilo)
        self.pago = PagoPersona.objects.create(
            PER_ID=self.pre_aprobada.user.id,
            CUR_ID=self.course.id,
            USU_ID=self.user,
            PAP_VALOR=500,
        )
        # Another user's payment
        other_pre = Preinscripcion.objects.create(
            user=self.other, course=self.course, estado=Preinscripcion.APROBADA, grupo='Grupo Dos'
        )
        PagoPersona.objects.create(PER_ID=other_pre.user.id, CUR_ID=self.course.id, USU_ID=self.other, PAP_VALOR=300)

    def test_mis_pagos_returns_only_current_user(self):
        url = reverse('payments:pago-persona-mis-pagos')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Only one payment for self.user
        self.assertEqual(len(resp.data), 1)
        self.assertEqual(resp.data[0]['PER_ID'], self.pre_aprobada.user.id)

    # Note: cambiar_estado and 'estado' field belong to legacy Pago model and were
    # removed in the canonical PagoPersona model. Those tests are omitted here.

    # Note: Cuota model and crear-cuotas endpoint removed in canonical payments model.

    def test_create_payment_requires_approved_preinscripcion(self):
        url = reverse('payments:pago-persona-list')
        # Attempt with BORRADOR -> should be 400 by serializer validate
        bad_resp = self.client.post(
            url,
            data={
                'PER_ID': self.pre_borrador.user.id,
                'CUR_ID': self.course2.id,
                'PAP_VALOR': 100,
                'PAP_OBSERVACION': '',
            },
            format='json',
        )
        self.assertEqual(bad_resp.status_code, status.HTTP_400_BAD_REQUEST)

        # With approved preinscripcion -> 201
        ok_resp = self.client.post(
            url,
            data={
                'PER_ID': self.pre_aprobada.user.id,
                'CUR_ID': self.course.id,
                'PAP_VALOR': 100,
                'PAP_OBSERVACION': 'ok',
            },
            format='json',
        )
        self.assertEqual(ok_resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ok_resp.data['PER_ID'], self.pre_aprobada.user.id)
