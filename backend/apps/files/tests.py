import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status

from apps.authentication.models import User
from apps.courses.models import Course
from apps.preinscriptions.models import Preinscription

from .models import FileDownload, FileUpload


@pytest.fixture
def create_course(db):
    return Course.objects.create(title="Curso de Prueba", code="CP-01")


@pytest.fixture
def create_preinscription(admin_user, create_course):
    return Preinscription.objects.create(user=admin_user, course=create_course)


@pytest.fixture
def create_file_upload(admin_user, create_preinscription):
    """Crea un archivo de prueba subido por un usuario."""
    test_file = SimpleUploadedFile("test.pdf", b"file content")
    return FileUpload.objects.create(
        name="Archivo de Prueba",
        file=test_file,
        preinscripcion=create_preinscription,
        uploaded_by=admin_user,
        original_name="test.pdf",
        file_size=1234,
    )


@pytest.mark.django_db
class TestArchivoAPI:
    def test_list_archivos_permission_denied(self, authenticated_client):
        """Los usuarios regulares no deberían poder listar todos los archivos."""
        client, _ = authenticated_client
        url = reverse("files:fileupload-list")
        response = client.get(url)
        # Asumiendo que solo admins/staff pueden listar todo.
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_list_archivos_by_admin(self, admin_client):
        """Los administradores sí pueden listar todos los archivos."""
        client, _ = admin_client
        url = reverse("files:fileupload-list")
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_upload_file_by_owner(self, authenticated_client, create_preinscription):
        """Un usuario debe poder subir un archivo a su propia preinscripción."""
        client, user = authenticated_client
        # Asegurarse que la preinscripción pertenece al usuario autenticado
        preinscription = create_preinscription
        preinscription.user = user
        preinscription.save()

        url = reverse("files:fileupload-list")
        # Crear un archivo falso en memoria para la prueba
        test_file = SimpleUploadedFile(
            "test_file.pdf", b"file_content", content_type="application/pdf"
        )
        data = {
            "preinscripcion": preinscription.pk,
            "tipo": "CERTIFICADO",
            "archivo": test_file,
        }
        response = client.post(url, data, format="multipart")

        assert response.status_code == status.HTTP_201_CREATED
        assert FileUpload.objects.count() == 1
        assert FileUpload.objects.first().uploaded_by == user

    def test_upload_file_by_non_owner(
        self, authenticated_client, create_preinscription
    ):
        """Un usuario no debería poder subir un archivo a la preinscripción de otro."""
        client, _ = authenticated_client
        preinscription = create_preinscription  # Pertenece al admin_user

        url = reverse("files:fileupload-list")
        test_file = SimpleUploadedFile(
            "test_file.pdf", b"file_content", content_type="application/pdf"
        )
        data = {
            "preinscripcion": preinscription.pk,
            "tipo": "CERTIFICADO",
            "archivo": test_file,
        }
        response = client.post(url, data, format="multipart")

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert FileUpload.objects.count() == 0

    def test_download_file_by_owner(self, authenticated_client, create_file_upload):
        """El propietario del archivo debe poder descargarlo."""
        client, user = authenticated_client
        file_upload = create_file_upload
        file_upload.uploaded_by = user
        file_upload.save()

        url = reverse("files:fileupload-download", kwargs={"pk": file_upload.pk})
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert (
            response.get("Content-Disposition")
            == f'attachment; filename="{file_upload.original_name}"'
        )

    def test_download_file_permission_denied(
        self, authenticated_client, create_file_upload
    ):
        """Un usuario no debe poder descargar un archivo que no le pertenece."""
        client, _ = authenticated_client
        file_upload = create_file_upload  # Creado por admin_user

        url = reverse("files:fileupload-download", kwargs={"pk": file_upload.pk})
        response = client.get(url)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_verify_file_by_admin(self, admin_client, create_file_upload):
        """Un administrador debe poder verificar (aprobar/rechazar) un archivo."""
        client, _ = admin_client
        file_upload = create_file_upload
        assert file_upload.estado == "SUBIDO"

        url = reverse("files:fileupload-verificar", kwargs={"pk": file_upload.pk})
        data = {"estado": "APROBADO", "verification_notes": "Documento correcto."}
        response = client.patch(url, data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["estado"] == "APROBADO"
        file_upload.refresh_from_db()
        assert file_upload.estado == "APROBADO"
        assert file_upload.verification_notes == "Documento correcto."

    def test_list_my_files(self, authenticated_client, create_file_upload):
        """La acción 'mis_archivos' debe devolver solo los archivos del usuario autenticado."""
        client, user = authenticated_client

        # Archivo del usuario autenticado
        my_file = create_file_upload
        my_file.uploaded_by = user
        my_file.save()

        # Archivo de otro usuario (creado por el admin por defecto en la fixture)
        other_file = FileUpload.objects.create(
            name="Otro Archivo",
            file=SimpleUploadedFile("other.txt", b""),
            uploaded_by=User.objects.get(username="adminuser"),
            original_name="other.txt",
            file_size=1,
        )

        url = reverse("files:fileupload-mis-archivos")
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]["id"] == my_file.id

    def test_update_file_by_owner(self, authenticated_client, create_file_upload):
        """El propietario del archivo debe poder actualizar su nombre y descripción."""
        client, user = authenticated_client
        file_upload = create_file_upload
        file_upload.uploaded_by = user
        file_upload.save()

        url = reverse("files:fileupload-detail", kwargs={"pk": file_upload.pk})
        data = {
            "name": "Nuevo Nombre del Archivo",
            "description": "Descripción actualizada.",
        }
        response = client.patch(url, data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == "Nuevo Nombre del Archivo"
        file_upload.refresh_from_db()
        assert file_upload.description == "Descripción actualizada."

    def test_delete_file_by_admin(self, admin_client, create_file_upload):
        """Un administrador debe poder eliminar un archivo."""
        client, _ = admin_client
        file_upload = create_file_upload

        url = reverse("files:fileupload-detail", kwargs={"pk": file_upload.pk})
        response = client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert FileUpload.objects.count() == 0

    def test_upload_file_too_large(self, authenticated_client, create_preinscription):
        """Verifica que la API rechace un archivo que excede el tamaño máximo permitido."""
        client, user = authenticated_client
        preinscription = create_preinscription
        preinscription.user = user
        preinscription.save()

        url = reverse("files:fileupload-list")
        # Crear un archivo falso de 11MB (el límite es 10MB)
        large_content = b"a" * (11 * 1024 * 1024)
        large_file = SimpleUploadedFile("large_file.pdf", large_content)
        data = {"preinscripcion": preinscription.pk, "archivo": large_file}
        response = client.post(url, data, format="multipart")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "El archivo es demasiado grande" in str(response.data)
