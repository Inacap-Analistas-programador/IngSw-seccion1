from datetime import date

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from apps.courses.models import Course
from apps.preinscriptions.models import Preinscripcion
from apps.payments.models import Pago, Cuota


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
        self.pago = Pago.objects.create(
            preinscripcion=self.pre_aprobada, monto=500, medio='TRANSFERENCIA', estado='PENDIENTE'
        )
        # Another user's payment
        other_pre = Preinscripcion.objects.create(
            user=self.other, course=self.course, estado=Preinscripcion.APROBADA, grupo='Grupo Dos'
        )
        Pago.objects.create(preinscripcion=other_pre, monto=300, medio='TRANSFERENCIA', estado='PENDIENTE')

    def test_mis_pagos_returns_only_current_user(self):
        url = reverse('payments:payments-mis-pagos')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Only one payment for self.user
        self.assertEqual(len(resp.data), 1)
        self.assertEqual(resp.data[0]['preinscripcion'], self.pre_aprobada.id)

    def test_cambiar_estado_invalid_rejected(self):
        url = reverse('payments:payments-cambiar-estado', args=[self.pago.id])
        resp = self.client.patch(url, data={'estado': 'NO_EXISTE'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cambiar_estado_valid(self):
        url = reverse('payments:payments-cambiar-estado', args=[self.pago.id])
        resp = self.client.patch(url, data={'estado': 'PAGADO'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['estado'], 'PAGADO')

    def test_crear_cuotas_success_and_duplicate_rejected(self):
        url = reverse('payments:payments-crear-cuotas', args=[self.pago.id])
        cuotas = [
            {'numero': 1, 'monto': 250, 'vencimiento': '2025-02-01'},
            {'numero': 2, 'monto': 250, 'vencimiento': '2025-03-01'},
        ]
        resp = self.client.post(url, data={'cuotas': cuotas}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(resp.data), 2)
        self.assertEqual(Cuota.objects.filter(pago=self.pago).count(), 2)

        # Duplicate creation should fail with 400
        resp2 = self.client.post(url, data={'cuotas': cuotas}, format='json')
        self.assertEqual(resp2.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_payment_requires_approved_preinscripcion(self):
        url = reverse('payments:payments-list')
        # Attempt with BORRADOR -> should be 400 by serializer validate
        bad_resp = self.client.post(
            url,
            data={
                'preinscripcion': self.pre_borrador.id,
                'monto': 100,
                'medio': 'TRANSFERENCIA',
                'referencia': '',
                'notas': '',
                'fecha_pago': '2025-01-10',
            },
            format='json',
        )
        self.assertEqual(bad_resp.status_code, status.HTTP_400_BAD_REQUEST)

        # With approved preinscripcion -> 201
        ok_resp = self.client.post(
            url,
            data={
                'preinscripcion': self.pre_aprobada.id,
                'monto': 100,
                'medio': 'TRANSFERENCIA',
                'referencia': 'ABC',
                'notas': 'ok',
                'fecha_pago': '2025-01-10',
            },
            format='json',
        )
        self.assertEqual(ok_resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ok_resp.data['preinscripcion'], self.pre_aprobada.id)
