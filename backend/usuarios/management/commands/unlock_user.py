"""
Management command to unlock user accounts blocked by failed login attempts
Usage: python manage.py unlock_user <email>
"""

from django.core.management.base import BaseCommand
from django.core.cache import cache
import sys


class Command(BaseCommand):
    help = 'Unlock user account blocked by failed login attempts'

    def add_arguments(self, parser):
        parser.add_argument(
            'email',
            type=str,
            nargs='?',
            help='Email address of the user to unlock'
        )
        parser.add_argument(
            '--all',
            action='store_true',
            help='Clear all login attempt blocks'
        )

    def handle(self, *args, **options):
        email = options.get('email')
        clear_all = options.get('all')

        if clear_all:
            # Clear all login attempt blocks
            self.stdout.write(self.style.WARNING('Clearing all login attempt blocks...'))
            cache.clear()
            self.stdout.write(self.style.SUCCESS('✓ All login blocks cleared'))
            return

        if not email:
            self.stdout.write(
                self.style.ERROR('Error: Please provide an email address or use --all flag')
            )
            self.stdout.write('Usage: python manage.py unlock_user <email>')
            self.stdout.write('       python manage.py unlock_user --all')
            sys.exit(1)

        # Clear specific user's login attempts
        email_key = f"login_attempts_email_{email}"
        
        # Check if user is blocked
        attempts = cache.get(email_key, 0)
        
        if attempts == 0:
            self.stdout.write(
                self.style.WARNING(f'User {email} is not blocked (0 failed attempts)')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'User {email} has {attempts} failed login attempts')
            )
            cache.delete(email_key)
            self.stdout.write(
                self.style.SUCCESS(f'✓ User {email} has been unlocked')
            )
