"""
Management command to create test users for GIC platform
Usage: python manage.py create_test_users
"""

from django.core.management.base import BaseCommand
from usuarios.models import Usuario
from maestros.models import Perfil


class Command(BaseCommand):
    help = 'Create test users for GIC platform with secure hashed passwords'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Creating test users...'))

        # Define test users
        test_users = [
            {
                'username': 'admin_test',
                'email': 'admin@test.com',
                'password': 'Admin123!',
                'perfil_name': 'Administrador',
                'description': 'Test administrator user'
            },
            {
                'username': 'coordinador_test',
                'email': 'coordinador@test.com',
                'password': 'Coord123!',
                'perfil_name': 'Coordinador',
                'description': 'Test coordinator user'
            },
            {
                'username': 'dirigente_test',
                'email': 'dirigente@test.com',
                'password': 'Dirig123!',
                'perfil_name': 'Dirigente',
                'description': 'Test leader user'
            },
        ]

        created_count = 0
        skipped_count = 0

        for user_data in test_users:
            # Check if user already exists
            if Usuario.objects.filter(usu_username=user_data['username']).exists():
                self.stdout.write(
                    self.style.WARNING(
                        f'User "{user_data["username"]}" already exists. Skipping...'
                    )
                )
                skipped_count += 1
                continue

            # Get or create perfil
            perfil, _ = Perfil.objects.get_or_create(
                pel_descripcion=user_data['perfil_name'],
                defaults={
                    'pel_descripcion': user_data['perfil_name'],
                    'pel_vigente': True
                }
            )

            # Create user with hashed password
            usuario = Usuario(
                usu_username=user_data['username'],
                usu_email=user_data['email'],
                pel_id=perfil,
                usu_vigente=True
            )
            usuario.set_password(user_data['password'])  # Hash the password
            usuario.save()

            created_count += 1
            self.stdout.write(
                self.style.SUCCESS(
                    f'✓ Created {user_data["description"]}: '
                    f'{user_data["username"]} / {user_data["password"]}'
                )
            )

        # Print summary
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write(self.style.SUCCESS('Test Users Creation Summary'))
        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write(f'Created: {created_count}')
        self.stdout.write(f'Skipped: {skipped_count}')
        self.stdout.write('')
        
        if created_count > 0:
            self.stdout.write(self.style.SUCCESS('Test users credentials:'))
            for user_data in test_users:
                if not Usuario.objects.filter(usu_username=user_data['username']).exists():
                    continue
                self.stdout.write(
                    f'  - {user_data["username"]} / {user_data["password"]}'
                )
        
        self.stdout.write(self.style.SUCCESS('=' * 60))
