
import os
import django
import getpass

# Configura Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scout_project.settings')
django.setup()

from usuarios.models import Usuario
from maestros.models import Perfil

def create_admin_user():
    """
    Crea un usuario administrador con el perfil 'Administrador'.

    Este script puede ser ejecutado de dos maneras:
    1. Definiendo las variables de entorno ADMIN_USERNAME, ADMIN_EMAIL, y ADMIN_PASSWORD.
       Ejemplo:
       ADMIN_USERNAME=admin ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=securepassword python create_superuser.py
    2. Ejecutándolo interactivamente, en cuyo caso se le solicitarán los datos.
       Ejemplo:
       python create_superuser.py
    """
    # Obtener o crear el perfil de Administrador
    try:
        admin_perfil, created = Perfil.objects.get_or_create(
            pel_descripcion='Administrador',
            defaults={'pel_vigente': True}
        )
        if created:
            print(f"Perfil 'Administrador' creado con éxito.")
    except Exception as e:
        print(f"Error al obtener o crear el perfil 'Administrador': {e}")
        return

    # Obtener credenciales del entorno
    username = os.environ.get('ADMIN_USERNAME')
    email = os.environ.get('ADMIN_EMAIL')
    password = os.environ.get('ADMIN_PASSWORD')

    # Si las variables de entorno no están, solicitarlas
    if not all([username, email, password]):
        print("Variables de entorno no encontradas. Solicitando datos interactivamente.")
        try:
            username = input("Ingrese nombre de usuario para el administrador: ")
            email = input("Ingrese email para el administrador: ")
            password = getpass.getpass("Ingrese password para el administrador: ")
        except (EOFError, KeyboardInterrupt):
            print("\nOperación cancelada por el usuario.")
            return

    # Validar que los campos no estén vacíos
    if not all([username, email, password]):
        print("Error: Todos los campos (username, email, password) son requeridos.")
        return

    # Verificar si el usuario ya existe
    if Usuario.objects.filter(usu_username=username).exists():
        print(f"El usuario '{username}' ya existe.")
        return
    
    if Usuario.objects.filter(usu_email=email).exists():
        print(f"El email '{email}' ya está en uso.")
        return

    # Crear el nuevo usuario administrador
    try:
        user = Usuario(
            usu_username=username,
            usu_email=email,
            pel_id=admin_perfil,
            usu_vigente=True
        )
        user.set_password(password)
        user.save()
        print(f"Usuario administrador '{username}' creado con éxito.")
        print("Ahora puede iniciar sesión con estas credenciales.")
    except Exception as e:
        print(f"Error al crear el usuario administrador: {e}")

if __name__ == '__main__':
    create_admin_user()
