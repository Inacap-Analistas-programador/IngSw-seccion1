#!/usr/bin/env python
"""Script para crear un usuario administrador inicial"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scouts_platform.settings.development')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = 'admin'
email = 'admin@sgics.local'
password = 'admin123'  # Cambiar después del primer login

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f'✓ Superusuario creado exitosamente')
    print(f'  Usuario: {username}')
    print(f'  Contraseña: {password}')
    print(f'  Email: {email}')
else:
    print(f'✗ El usuario "{username}" ya existe')
