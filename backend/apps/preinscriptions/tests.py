import pytest
from django.urls import reverse
from rest_framework.routers import DefaultRouter
from rest_framework import status
from apps.authentication.models import User
from apps.courses.models import Course
from .models import Preinscription


@pytest.fixture
def create_course(db):
    # Crear el curso como ACTIVO para permitir preinscripciones en pruebas
    return Course.objects.create(title="Curso de Liderazgo", code="CL-01", status=Course.ACTIVE)


@pytest.mark.django_db
class TestPreinscriptionAPI:
    def test_create_preinscription(self, authenticated_client, create_course):
        """
        Prueba que un usuario autenticado pueda crear una preinscripción para sí mismo.
        """
        client, user = authenticated_client
        course = create_course
        
        url = reverse("preinscriptions:preinscripcion-list")
        data = {
            "user": user.id,
            "course": course.id,
            "observaciones": "Test",
        }
        response = client.post(url, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert Preinscription.objects.count() == 1
        assert Preinscription.objects.first().user == user

    def test_list_my_preinscriptions(self, authenticated_client, create_course):
        """
        Prueba que un usuario pueda listar sus propias preinscripciones.
        """
        client, user = authenticated_client
        course = create_course
        Preinscription.objects.create(user=user, course=course)

        # Crear una preinscripción de otro usuario para asegurar el filtro
        other_user = User.objects.create_user(username="otheruser")
        Preinscription.objects.create(user=other_user, course=course)
        
        url = reverse("preinscriptions:mis_preinscripciones-list")
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['user'] == user.id

    def test_admin_can_change_preinscription_status(self, admin_client, authenticated_client, create_course):
        """
        Prueba que un administrador pueda cambiar el estado de una preinscripción.
        """
        _, user = authenticated_client
        preinscription = Preinscription.objects.create(user=user, course=create_course)

        client, _ = admin_client
        url = reverse("preinscriptions:preinscripcion-cambiar-estado", kwargs={'pk': preinscription.pk})
        data = {"estado": "APROBADA"}
        response = client.patch(url, data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data['estado'] == "APROBADA"
        preinscription.refresh_from_db()
        assert preinscription.estado == "APROBADA"