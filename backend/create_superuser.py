
import os
import django
from django.contrib.auth import get_user_model

# Configura Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scout_project.settings')
django.setup()

User = get_user_model()

username = 'admin'
email = 'admin@example.com'
password = 'password123'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f"Superusuario '{username}' creado con éxito.")
else:
    print(f"El superusuario '{username}' ya existe.")
