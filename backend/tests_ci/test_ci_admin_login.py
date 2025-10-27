import pytest
from django.contrib.auth import get_user_model
from django.test import Client


@pytest.mark.django_db
def test_create_ci_admin_and_login():
    User = get_user_model()
    username = "ci_test_admin"
    password = "testpass123"
    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email="ci@example.com", password=password)

    client = Client()
    assert client.login(username=username, password=password) is True
