import os
import django
import getpass

# Configura Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scout_project.settings')
django.setup()

from usuarios.models import Usuario

def change_user_password():
    """
    Cambia la contraseña de un usuario existente.
    """
    identifier = input("Ingrese el nombre de usuario o email del usuario: ")
    
    try:
        if '@' in identifier:
            user = Usuario.objects.get(usu_email=identifier)
        else:
            user = Usuario.objects.get(usu_username=identifier)
    except Usuario.DoesNotExist:
        print(f"No se encontró un usuario con el identificador '{identifier}'.")
        return

    print(f"Cambiando contraseña para el usuario: {user.usu_username}")

    while True:
        new_password = getpass.getpass("Ingrese la nueva contraseña (mínimo 8 caracteres): ")
        if len(new_password) < 8:
            print("Error: La contraseña debe tener al menos 8 caracteres.")
            continue

        confirm_password = getpass.getpass("Confirme la nueva contraseña: ")
        if new_password != confirm_password:
            print("Error: Las contraseñas no coinciden. Inténtelo de nuevo.")
            continue
        
        break

    try:
        user.set_password(new_password)
        user.save()
        print(f"La contraseña para el usuario '{user.usu_username}' ha sido cambiada con éxito.")
    except Exception as e:
        print(f"Error al cambiar la contraseña: {e}")

if __name__ == '__main__':
    change_user_password()
