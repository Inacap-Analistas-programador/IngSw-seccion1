"""Merge migration to resolve conflicting leaf nodes in payments migrations.

This migration is a no-op merge created to make Django's migration graph linear
for test runs. It depends on the identified conflicting leaf migrations and
contains no operations. Review and adjust if you plan to apply destructive
migrations (like 9999_remove_legacy_pago) in a real environment.
"""
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("payments", "0003_pago_comprobante"),
        ("payments", "0006_alter_comprobantepago_options_and_more"),
        ("payments", "0007_pago"),
    ]

    operations = []
