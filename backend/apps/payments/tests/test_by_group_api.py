from datetime import date

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from apps.courses.models import Course
from apps.preinscriptions.models import Preinscripcion
from apps.payments.models import Pago


User = get_user_model()


class PaymentsByGroupAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='tester', password='x')
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
        self.other_course = Course.objects.create(
            title='Otro Curso',
            description='Desc 2',
            code='C-002',
            max_participants=10,
            price=1000,
            start_date=date(2025, 2, 1),
            end_date=date(2025, 2, 2),
            created_by=self.user,
        )

    def test_requires_group_param(self):
        url = reverse('payments:payments-by-group')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_empty_when_no_payments(self):
        url = reverse('payments:payments-by-group') + '?group=Grupo Alfa'
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['count'], 0)
        self.assertEqual(resp.data['items'], [])

    def test_returns_group_filtered_payments(self):
        pre1 = Preinscripcion.objects.create(user=self.user, course=self.course, estado=Preinscripcion.APROBADA, grupo='Grupo Alfa')
        pre2 = Preinscripcion.objects.create(user=self.user, course=self.other_course, estado=Preinscripcion.APROBADA, grupo='Grupo Beta')

        Pago.objects.create(preinscripcion=pre1, monto=500, medio='TRANSFERENCIA', estado='PAGADO')
        Pago.objects.create(preinscripcion=pre2, monto=300, medio='TRANSFERENCIA', estado='PENDIENTE')
        url = reverse('payments:payments-by-group') + '?group=Grupo Alfa'
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['group'], 'Grupo Alfa')
        self.assertEqual(resp.data['count'], 1)
        self.assertEqual(len(resp.data['items']), 1)

        # filter also by course id
        url2 = reverse('payments:payments-by-group') + f'?group=Grupo Alfa&course={self.course.id}'
        resp2 = self.client.get(url2)
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        self.assertEqual(resp2.data['count'], 1)
