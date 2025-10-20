from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Region",
            fields=[
                ("codigo", models.CharField(max_length=4, primary_key=True, serialize=False)),
                ("nombre", models.CharField(max_length=80, unique=True)),
                ("nombre_corto", models.CharField(max_length=20, blank=True)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "db_table": "catalog_region",
                "ordering": ["codigo"],
            },
        ),
        migrations.CreateModel(
            name="Provincia",
            fields=[
                ("codigo", models.CharField(max_length=4, primary_key=True, serialize=False)),
                ("nombre", models.CharField(max_length=80)),
                (
                    "region",
                    models.ForeignKey(on_delete=models.deletion.CASCADE, to="catalog.Region"),
                ),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "db_table": "catalog_provincia",
                "ordering": ["region__codigo", "nombre"],
            },
        ),
        migrations.CreateModel(
            name="Comuna",
            fields=[
                ("codigo", models.CharField(max_length=5, primary_key=True, serialize=False)),
                ("nombre", models.CharField(max_length=80)),
                (
                    "provincia",
                    models.ForeignKey(on_delete=models.deletion.CASCADE, to="catalog.Provincia"),
                ),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "db_table": "catalog_comuna",
                "ordering": ["provincia__region__codigo", "provincia__nombre", "nombre"],
            },
        ),
        migrations.CreateModel(
            name="Zona",
            fields=[
                ("codigo", models.CharField(max_length=10, primary_key=True, serialize=False)),
                ("nombre", models.CharField(max_length=100)),
                ("descripcion", models.TextField(blank=True)),
                (
                    "region_principal",
                    models.ForeignKey(on_delete=models.deletion.SET_NULL, null=True, blank=True, to="catalog.Region"),
                ),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"db_table": "catalog_zona", "ordering": ["nombre"]},
        ),
        migrations.CreateModel(
            name="Distrito",
            fields=[
                ("codigo", models.CharField(max_length=10, primary_key=True, serialize=False)),
                ("nombre", models.CharField(max_length=100)),
                ("zona", models.ForeignKey(on_delete=models.deletion.CASCADE, to="catalog.Zona", related_name="distritos")),
                ("descripcion", models.TextField(blank=True)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"db_table": "catalog_distrito", "ordering": ["zona__nombre", "nombre"]},
        ),
        migrations.CreateModel(
            name="GrupoScout",
            fields=[
                ("codigo", models.CharField(max_length=20, primary_key=True, serialize=False)),
                ("nombre", models.CharField(max_length=150)),
                ("distrito", models.ForeignKey(on_delete=models.deletion.CASCADE, to="catalog.Distrito", related_name="grupos")),
                ("comuna", models.ForeignKey(on_delete=models.deletion.SET_NULL, null=True, blank=True, to="catalog.Comuna")),
                ("direccion", models.TextField(blank=True)),
                ("telefono", models.CharField(max_length=20, blank=True)),
                ("email", models.EmailField(max_length=254, blank=True)),
                ("fecha_fundacion", models.DateField(null=True, blank=True)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"db_table": "catalog_grupo_scout", "ordering": ["distrito__zona__nombre", "nombre"]},
        ),
        migrations.CreateModel(
            name="Rama",
            fields=[
                ("codigo", models.CharField(max_length=20, primary_key=True, serialize=False)),
                ("nombre", models.CharField(max_length=50)),
                ("descripcion", models.TextField(blank=True)),
                ("edad_minima", models.PositiveIntegerField(null=True, blank=True)),
                ("edad_maxima", models.PositiveIntegerField(null=True, blank=True)),
                ("color_hex", models.CharField(max_length=7, blank=True)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"db_table": "catalog_rama", "ordering": ["edad_minima"]},
        ),
        migrations.CreateModel(
            name="TipoCurso",
            fields=[
                ("codigo", models.CharField(max_length=20, primary_key=True, serialize=False)),
                ("nombre", models.CharField(max_length=100)),
                ("descripcion", models.TextField(blank=True)),
                ("duracion_default_horas", models.PositiveIntegerField(null=True, blank=True)),
                ("precio_sugerido", models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"db_table": "catalog_tipo_curso", "ordering": ["nombre"]},
        ),
        migrations.CreateModel(
            name="Nivel",
            fields=[
                ("codigo", models.CharField(max_length=20, primary_key=True, serialize=False)),
                ("nombre", models.CharField(max_length=80)),
                ("descripcion", models.TextField(blank=True)),
                ("orden", models.PositiveIntegerField(default=0)),
                ("rama", models.ForeignKey(on_delete=models.deletion.SET_NULL, null=True, blank=True, to="catalog.Rama", related_name="niveles")),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"db_table": "catalog_nivel", "ordering": ["rama__codigo", "orden"]},
        ),
        migrations.CreateModel(
            name="EstadoCivil",
            fields=[
                ("codigo", models.CharField(max_length=10, primary_key=True, serialize=False)),
                ("nombre", models.CharField(max_length=30)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"db_table": "catalog_estado_civil", "ordering": ["nombre"]},
        ),
        migrations.CreateModel(
            name="TipoAlimentacion",
            fields=[
                ("codigo", models.CharField(max_length=20, primary_key=True, serialize=False)),
                ("nombre", models.CharField(max_length=60)),
                ("descripcion", models.TextField(blank=True)),
                ("es_restriccion", models.BooleanField(default=False)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"db_table": "catalog_tipo_alimentacion", "ordering": ["nombre"]},
        ),
    ]
