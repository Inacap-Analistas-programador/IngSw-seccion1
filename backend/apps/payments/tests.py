from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model

from apps.preinscriptions.models import Preinscripcion
from apps.courses.models import Course
from .models import Payment
from .serializers import PaymentSerializer

User = get_user_model()

class PaymentTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password123')
        self.admin_user = User.objects.create_superuser(username='adminuser', email='admin@example.com', password='adminpassword')
        self.course = Course.objects.create(
            title="Test Course",
            description="A course for testing",
            start_date="2025-01-01",
            end_date="2025-01-31",
            price=100.00,
            max_participants=10
        )
        self.preinscription_approved = Preinscripcion.objects.create(
            user=self.user,
            course=self.course,
            estado=Preinscripcion.APROBADA
        )
        self.another_user = User.objects.create_user(username='anotheruser', email='another@example.com', password='password123')
        self.preinscription_pending = Preinscripcion.objects.create(
            user=self.another_user,
            course=self.course,
            estado=Preinscripcion.ENVIADA
        )
        self.payment_data = {
            'preinscription': self.preinscription_approved.id,
            'amount': '50.00',
            'method': 'Credit Card',
            'reference': 'REF123',
            'status': 'completed'
        }
        self.payment = Payment.objects.create(
            preinscription=self.preinscription_approved,
            amount='100.00',
            method='Bank Transfer',
            reference='BANKREF456',
            status='pending'
        )

    # Test Model
    def test_create_payment(self):
        payment = Payment.objects.create(
            preinscription=self.preinscription_approved,
            amount='75.00',
            method='PayPal',
            reference='PAYPAL789',
            status='pending'
        )
        self.assertEqual(float(payment.amount), 75.00)
        self.assertEqual(payment.status, 'pending')
        self.assertEqual(payment.preinscription, self.preinscription_approved)

    def test_payment_str(self):
        expected_str = f"Payment for Preinscription {self.preinscription_approved.id} - 100.00 - pending"
        self.assertEqual(str(self.payment), expected_str)

    # Test Serializer
    def test_payment_serializer_valid_data(self):
        serializer = PaymentSerializer(data=self.payment_data)
        self.assertTrue(serializer.is_valid())
        payment = serializer.save()
        self.assertEqual(payment.amount, 50.00)
        self.assertEqual(payment.method, 'Credit Card')

    def test_payment_serializer_invalid_amount(self):
        invalid_data = self.payment_data.copy()
        invalid_data['amount'] = '0.00'
        serializer = PaymentSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('amount', serializer.errors)
        self.assertEqual(str(serializer.errors['amount'][0]), 'El monto debe ser mayor a 0.')

    def test_payment_serializer_preinscription_not_approved(self):
        invalid_data = self.payment_data.copy()
        invalid_data['preinscription'] = self.preinscription_pending.id
        serializer = PaymentSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('preinscription', serializer.errors)
        self.assertEqual(str(serializer.errors['preinscription'][0]), 'La preinscripción debe estar aprobada para recibir pagos.')

    # Test API Endpoints
    def test_list_payments_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('payments:payment-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1) # Only payments related to the user's preinscriptions

    def test_list_payments_unauthenticated(self):
        response = self.client.get(reverse('payments:payment-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_payment_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('payments:payment-detail', kwargs={'pk': self.payment.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['amount']), float(self.payment.amount))

    def test_retrieve_payment_unauthenticated(self):
        response = self.client.get(reverse('payments:payment-detail', kwargs={'pk': self.payment.id}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_payment_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(reverse('payments:payment-list'), self.payment_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Payment.objects.count(), 2) # Initial payment + new one

    def test_create_payment_unauthenticated(self):
        response = self.client.post(reverse('payments:payment-list'), self.payment_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_payment_authenticated(self):
        self.client.force_authenticate(user=self.user)
        updated_data = self.payment_data.copy()
        updated_data['amount'] = '150.00'
        response = self.client.put(reverse('payments:payment-detail', kwargs={'pk': self.payment.id}), updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.payment.refresh_from_db()
        self.assertEqual(float(self.payment.amount), 150.00)

    def test_update_payment_unauthenticated(self):
        updated_data = self.payment_data.copy()
        updated_data['amount'] = '150.00'
        response = self.client.put(reverse('payments:payment-detail', kwargs={'pk': self.payment.id}), updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_payment_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(reverse('payments:payment-detail', kwargs={'pk': self.payment.id}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Payment.objects.count(), 0)

    def test_delete_payment_unauthenticated(self):
        response = self.client.delete(reverse('payments:payment-detail', kwargs={'pk': self.payment.id}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
