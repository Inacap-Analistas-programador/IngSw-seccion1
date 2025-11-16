
import os
import django
from django.contrib.auth import get_user_model
import getpass

# Configura Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scout_project.settings')
django.setup()

User = get_user_model()

username = os.environ.get('ADMIN_USERNAME', 'admin')
email = os.environ.get('ADMIN_EMAIL', 'admin@example.com')
password = os.environ.get('ADMIN_PASSWORD')

if not password:
    print("ADVERTENCIA: No se encontró ADMIN_PASSWORD en variables de entorno.")
    print("Para uso seguro en producción, configure: export ADMIN_PASSWORD='su_password_seguro'")
    password = getpass.getpass("Ingrese password para superusuario (development only): ") or 'change_me_in_production'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f"Superusuario '{username}' creado con éxito.")
    print("IMPORTANTE: Cambie el password inmediatamente si está en producción.")
else:
    print(f"El superusuario '{username}' ya existe.")
