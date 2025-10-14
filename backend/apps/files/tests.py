"""
Tests para el módulo de archivos (subida básica)
"""

import io
import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import FileUpload

@pytest.mark.django_db
class TestFileUploadAPI:
    def setup_method(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username="testuser", password="testpass"
        )
        self.client.force_authenticate(user=self.user)

    def test_basic_file_upload(self):
        url = reverse("fileupload-list")
        file_content = b"contenido de prueba"
        file = io.BytesIO(file_content)
        file.name = "test.txt"
        response = self.client.post(url, {
            "name": "Archivo de prueba",
            "description": "Test básico de subida",
            "file": file,
            "tipo": "DOCUMENTO",
            "is_public": True
        }, format="multipart")
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Archivo de prueba"
        assert FileUpload.objects.filter(name="Archivo de prueba").exists()

    def test_upload_too_large(self):
        url = reverse("fileupload-list")
        file_content = b"x" * (10 * 1024 * 1024 + 1)  # 10MB + 1 byte
        file = io.BytesIO(file_content)
        file.name = "bigfile.txt"
        response = self.client.post(url, {
            "name": "Archivo grande",
            "description": "Test tamaño",
            "file": file,
            "tipo": "DOCUMENTO",
            "is_public": True
        }, format="multipart")
        assert response.status_code == 400
        assert "demasiado grande" in response.json()["file"][0]
