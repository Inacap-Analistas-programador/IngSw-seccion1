import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scouts_platform.settings.development')
django.setup()

from authentication.models import Usuario

# Crear usuario admin si no existe
if not Usuario.objects.filter(username='admin').exists():
    print("Creando usuario 'admin'...")
    Usuario.objects.create_superuser(
        username='admin',
        email='admin@sgics.local',
        password='admin123'
    )
    print("✓ Usuario 'admin' creado con contraseña 'admin123'")
else:
    print("El usuario 'admin' ya existe")

# Actualizar contraseña de admin123 a admin123
admin123 = Usuario.objects.get(username='admin123')
admin123.set_password('admin123')
admin123.save()
print("✓ Contraseña de 'admin123' actualizada a 'admin123'")

print("\n=== USUARIOS DISPONIBLES ===")
for user in Usuario.objects.filter(is_staff=True):
    print(f"  - Username: {user.username}")
    print(f"    Email: {user.email}")
    print(f"    Staff: {user.is_staff}, Superuser: {user.is_superuser}")
    print(f"    Contraseña: admin123")
    print()
