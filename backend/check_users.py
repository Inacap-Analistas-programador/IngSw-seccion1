import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scouts_platform.settings.development')
django.setup()

from django.db import models
from authentication.models import Usuario

print("Usuarios en la base de datos:")
usuarios = Usuario.objects.all()
if usuarios.exists():
    for user in usuarios:
        print(f"  - ID: {user.id}, Username: {user.username}, Staff: {user.is_staff}, Superuser: {user.is_superuser}")
else:
    print("  No hay usuarios.")
    print("\nCreando superusuario...")
    # El ID debe ser manual porque es DecimalField
    max_id = Usuario.objects.aggregate(max_id=models.Max('id'))['max_id'] or 0
    Usuario.objects.create(
        id=int(max_id) + 1,
        username='admin',
        password='pbkdf2_sha256$600000$salt$hash',  # Será reemplazado
        ruta_foto='',
        vigente=True,
        is_active=True,
        is_staff=True,
        is_superuser=True
    )
    admin = Usuario.objects.get(username='admin')
    admin.set_password('admin123')
    admin.save()
    print("✓ Superusuario creado: admin / admin123")
