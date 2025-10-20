"""Empty migration placeholder to satisfy dependencies

This project had a missing 0004 migration; tests/migrations reference 0005 which
depends on 0004. Provide a no-op migration that depends on 0002_initial so the
migration graph is consistent during test database creation.
"""
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("payments", "0002_initial"),
    ]

    operations = [
        # Intentionally empty
    ]
