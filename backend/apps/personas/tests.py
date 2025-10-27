from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from apps.personas.models import Persona

class PersonaAPITests(APITestCase):
    def setUp(self):
        self.persona = Persona.objects.create(
            nombres="Test User",
            email="test@example.com",
            fecha_nacimiento="1990-01-01",
            direccion="Test Address",
            telefono="123456789",
            vigente=True,
        )

    def test_list_personas(self):
        url = reverse('persona-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)

    def test_create_persona(self):
        url = reverse('persona-list')
        data = {
            "nombres": "Nuevo Usuario",
            "email": "nuevo@example.com",
            "fecha_nacimiento": "1995-05-05",
            "direccion": "Nueva Direccion",
            "telefono": "987654321",
            "vigente": True,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["nombres"], "Nuevo Usuario")

    def test_retrieve_persona(self):
        url = reverse('persona-detail', args=[self.persona.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "test@example.com")

    def test_update_persona(self):
        url = reverse('persona-detail', args=[self.persona.id])
        data = {"nombres": "Usuario Actualizado"}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["nombres"], "Usuario Actualizado")

    def test_delete_persona(self):
        url = reverse('persona-detail', args=[self.persona.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Persona.objects.filter(id=self.persona.id).exists())
