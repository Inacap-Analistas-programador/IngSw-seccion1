"""Deferred destructive migration placeholder.

This file used to drop the legacy `Pago` model/table. During development and
CI we keep destructive changes out of the automatic migration chain to avoid
accidentally removing data. Convert this to an explicit non-destructive no-op
so test runs and CI do not remove the `payments` table.

To apply the deletion in a controlled way, create a reviewed migration that
depends on a specific release tag and run it manually with a DB backup.
"""
from django.db import migrations


class Migration(migrations.Migration):
    # keep the linear dependency so makemigrations --merge is not triggered
    dependencies = [
        ('payments', '0008_merge_conflicts'),
    ]

    # no operations: deletion deferred until explicitly approved
    operations = []
