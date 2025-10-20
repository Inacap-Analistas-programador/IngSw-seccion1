"""Migration stub: remove legacy Pago model/table.

IMPORTANT: Review this migration before applying. Running migrations that drop
tables will remove data in your database. Make a DB backup before applying.
"""
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        # Adjust the dependency to the latest existing migration in this app.
        ('payments', '0007_pago'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Pago',
        ),
    ]
