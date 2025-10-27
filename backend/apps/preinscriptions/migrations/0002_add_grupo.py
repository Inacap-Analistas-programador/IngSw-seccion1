from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("preinscriptions", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="preinscripcion",
            name="grupo",
            field=models.CharField(max_length=100, blank=True, default=""),
        ),
    ]
