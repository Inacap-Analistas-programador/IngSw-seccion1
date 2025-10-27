"""Squashed initial migration for payments.

This migration consolidates the historical payments migrations into a single
initial state that matches the current models in code. It replaces the older
migrations listed in `replaces` so Django treats this as the canonical root
for new projects. Apply with care and test on a copy of the database before
deploying to production.
"""
from django.db import migrations, models


class Migration(migrations.Migration):
    replaces = [
        ("payments", "0001_initial"),
        ("payments", "0002_initial"),
        ("payments", "0003_pago_comprobante"),
        ("payments", "0004_alter_cuota_unique_together_remove_cuota_pago_and_more"),
        ("payments", "0005_conceptocontable_comprobantepago_pagopersona_and_more"),
        ("payments", "0006_alter_comprobantepago_options_and_more"),
        ("payments", "0006_alter_cuota_unique_together_remove_cuota_pago_and_more"),
        ("payments", "0007_pago"),
        ("payments", "0008_merge_conflicts"),
        ("payments", "9999_remove_legacy_pago"),
        ("payments", "10000_alter_pago_options_remove_pago_comprobante_and_more"),
    ]

    initial = True

    dependencies = [
        ("authentication", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="PagoPersona",
            fields=[
                ("PAP_ID", models.AutoField(primary_key=True, serialize=False)),
                ("PER_ID", models.IntegerField()),
                ("CUR_ID", models.IntegerField()),
                (
                    "USU_ID",
                    models.ForeignKey(
                        on_delete=models.PROTECT,
                        related_name="pagos_realizados",
                        to="authentication.user",
                    ),
                ),
                (
                    "PAP_FECHA_HORA",
                    models.DateTimeField(auto_now_add=False),
                ),
                ("PAP_TIPO", models.IntegerField(default=1)),
                ("PAP_VALOR", models.DecimalField(max_digits=10, decimal_places=2)),
                ("PAP_OBSERVACION", models.CharField(max_length=255, null=True, blank=True)),
            ],
            options={
                "verbose_name": "Pago de Persona",
                "verbose_name_plural": "Pagos de Personas",
                "db_table": "PAGO_PERSONA",
                "ordering": ["-PAP_FECHA_HORA"],
            },
        ),
        migrations.CreateModel(
            name="PagoCambioPersona",
            fields=[
                ("PCP_ID", models.AutoField(primary_key=True, serialize=False)),
                ("PER_ID", models.IntegerField()),
                (
                    "PAP_ID",
                    models.ForeignKey(
                        on_delete=models.PROTECT,
                        related_name="cambios_pago",
                        to="payments.pagopersona",
                    ),
                ),
                (
                    "USU_ID",
                    models.ForeignKey(
                        on_delete=models.PROTECT,
                        related_name="cambios_pago_realizados",
                        to="authentication.user",
                    ),
                ),
                ("PCP_FECHA_HORA", models.DateTimeField(auto_now_add=False)),
            ],
            options={
                "verbose_name": "Historial de Cambio de Pago",
                "verbose_name_plural": "Historiales de Cambios de Pago",
                "db_table": "PAGO_CAMBIO_PERSONA",
                "ordering": ["-PCP_FECHA_HORA"],
            },
        ),
        migrations.CreateModel(
            name="Prepago",
            fields=[
                ("PPA_ID", models.AutoField(primary_key=True, serialize=False)),
                ("PER_ID", models.IntegerField()),
                ("CUR_ID", models.IntegerField()),
                (
                    "PAP_ID",
                    models.ForeignKey(
                        on_delete=models.SET_NULL,
                        related_name="prepago_asociado",
                        null=True,
                        blank=True,
                        to="payments.pagopersona",
                    ),
                ),
                ("PPA_VALOR", models.DecimalField(max_digits=10, decimal_places=2)),
                ("PPA_OBSERVACION", models.TextField(null=True, blank=True)),
                ("PPA_VIGENTE", models.BooleanField(default=True)),
            ],
            options={
                "verbose_name": "Prepago (Saldo a Favor)",
                "verbose_name_plural": "Prepagos (Saldos a Favor)",
                "db_table": "PREPAGO",
                "ordering": ["-PPA_ID"],
            },
        ),
        migrations.CreateModel(
            name="ConceptoContable",
            fields=[
                ("COC_ID", models.AutoField(primary_key=True, serialize=False)),
                ("COC_DESCRIPCION", models.CharField(max_length=100, unique=True)),
                ("COC_VIGENTE", models.BooleanField(default=True)),
            ],
            options={
                "verbose_name": "Concepto Contable",
                "verbose_name_plural": "Conceptos Contables",
                "db_table": "CONCEPTO_CONTABLE",
                "ordering": ["COC_DESCRIPCION"],
            },
        ),
        migrations.CreateModel(
            name="ComprobantePago",
            fields=[
                ("CPA_ID", models.AutoField(primary_key=True, serialize=False)),
                (
                    "USU_ID",
                    models.ForeignKey(
                        on_delete=models.PROTECT,
                        related_name="comprobantes_creados",
                        to="authentication.user",
                    ),
                ),
                ("PEC_ID", models.IntegerField()),
                (
                    "COC_ID",
                    models.ForeignKey(
                        on_delete=models.PROTECT,
                        related_name="comprobantes_concepto",
                        to="payments.conceptocontable",
                    ),
                ),
                ("CPA_FECHA_HORA", models.DateTimeField(auto_now_add=False)),
                ("CPA_FECHA", models.DateField()),
                ("CPA_NUMERO", models.IntegerField(unique=True)),
                ("CPA_VALOR", models.DecimalField(max_digits=12, decimal_places=2)),
            ],
            options={
                "verbose_name": "Comprobante de Pago",
                "verbose_name_plural": "Comprobantes de Pagos",
                "db_table": "COMPROBANTE_PAGO",
                "ordering": ["-CPA_FECHA", "-CPA_NUMERO"],
            },
        ),
        migrations.CreateModel(
            name="PagoComprobante",
            fields=[
                ("PCO_ID", models.AutoField(primary_key=True, serialize=False)),
                (
                    "PAP_ID",
                    models.ForeignKey(
                        on_delete=models.CASCADE,
                        related_name="pagos_comprobante",
                        to="payments.pagopersona",
                    ),
                ),
                (
                    "CPA_ID",
                    models.ForeignKey(
                        on_delete=models.CASCADE,
                        related_name="comprobantes_pago",
                        to="payments.comprobantepago",
                    ),
                ),
            ],
            options={
                "verbose_name": "Relación Pago-Comprobante",
                "verbose_name_plural": "Relaciones Pago-Comprobante",
                "db_table": "PAGO_COMPROBANTE",
                "unique_together": {("PAP_ID", "CPA_ID")},
            },
        ),
    ]
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    """Squashed migration for payments app.

    Replaces the previous fragmented migration history so the migration
    graph can be applied cleanly in a new environment.
    """

    replaces = [
        ("payments", "0001_initial"),
        ("payments", "0002_initial"),
        ("payments", "0003_pago_comprobante"),
        ("payments", "0004_alter_cuota_unique_together_remove_cuota_pago_and_more"),
        ("payments", "0005_conceptocontable_comprobantepago_pagopersona_and_more"),
        ("payments", "0006_alter_comprobantepago_options_and_more"),
        ("payments", "0006_alter_cuota_unique_together_remove_cuota_pago_and_more"),
        ("payments", "0007_pago"),
        ("payments", "0008_merge_conflicts"),
        ("payments", "9999_remove_legacy_pago"),
        ("payments", "10000_alter_pago_options_remove_pago_comprobante_and_more"),
    ]

    initial = True
    dependencies = []

    operations = [
        migrations.CreateModel(
            name="PagoPersona",
            fields=[
                ("PAP_ID", models.AutoField(primary_key=True, serialize=False)),
                ("PER_ID", models.IntegerField()),
                ("CUR_ID", models.IntegerField()),
                ("USU_ID", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="pagos_realizados", to="authentication.user")),
                ("PAP_FECHA_HORA", models.DateTimeField()),
                ("PAP_TIPO", models.IntegerField()),
                ("PAP_VALOR", models.DecimalField(decimal_places=2, max_digits=10)),
                ("PAP_OBSERVACION", models.CharField(max_length=255, null=True, blank=True)),
            ],
            options={
                "verbose_name": "Pago de Persona",
                "verbose_name_plural": "Pagos de Personas",
                "db_table": "PAGO_PERSONA",
                "ordering": ["-PAP_FECHA_HORA"],
            },
        ),
        migrations.CreateModel(
            name="PagoCambioPersona",
            fields=[
                ("PCP_ID", models.AutoField(primary_key=True, serialize=False)),
                ("PER_ID", models.IntegerField()),
                ("PAP_ID", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="cambios_pago", to="payments.pagopersona")),
                ("USU_ID", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="cambios_pago_realizados", to="authentication.user")),
                ("PCP_FECHA_HORA", models.DateTimeField()),
            ],
            options={
                "verbose_name": "Historial de Cambio de Pago",
                "verbose_name_plural": "Historiales de Cambios de Pago",
                "db_table": "PAGO_CAMBIO_PERSONA",
                "ordering": ["-PCP_FECHA_HORA"],
            },
        ),
        migrations.CreateModel(
            name="Prepago",
            fields=[
                ("PPA_ID", models.AutoField(primary_key=True, serialize=False)),
                ("PER_ID", models.IntegerField()),
                ("CUR_ID", models.IntegerField()),
                ("PAP_ID", models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, null=True, blank=True, related_name="prepago_asociado", to="payments.pagopersona")),
                ("PPA_VALOR", models.DecimalField(decimal_places=2, max_digits=10)),
                ("PPA_OBSERVACION", models.TextField(null=True, blank=True)),
                ("PPA_VIGENTE", models.BooleanField(default=True)),
            ],
            options={
                "verbose_name": "Prepago (Saldo a Favor)",
                "verbose_name_plural": "Prepagos (Saldos a Favor)",
                "db_table": "PREPAGO",
                "ordering": ["-PPA_ID"],
            },
        ),
        migrations.CreateModel(
            name="ConceptoContable",
            fields=[
                ("COC_ID", models.AutoField(primary_key=True, serialize=False)),
                ("COC_DESCRIPCION", models.CharField(max_length=100, unique=True)),
                ("COC_VIGENTE", models.BooleanField(default=True)),
            ],
            options={
                "verbose_name": "Concepto Contable",
                "verbose_name_plural": "Conceptos Contables",
                "db_table": "CONCEPTO_CONTABLE",
                "ordering": ["COC_DESCRIPCION"],
            },
        ),
        migrations.CreateModel(
            name="ComprobantePago",
            fields=[
                ("CPA_ID", models.AutoField(primary_key=True, serialize=False)),
                ("USU_ID", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="comprobantes_creados", to="authentication.user")),
                ("PEC_ID", models.IntegerField()),
                ("COC_ID", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="comprobantes_concepto", to="payments.conceptocontable")),
                ("CPA_FECHA_HORA", models.DateTimeField()),
                ("CPA_FECHA", models.DateField()),
                ("CPA_NUMERO", models.IntegerField(unique=True)),
                ("CPA_VALOR", models.DecimalField(decimal_places=2, max_digits=12)),
            ],
            options={
                "verbose_name": "Comprobante de Pago",
                "verbose_name_plural": "Comprobantes de Pagos",
                "db_table": "COMPROBANTE_PAGO",
                "ordering": ["-CPA_FECHA", "-CPA_NUMERO"],
            },
        ),
        migrations.CreateModel(
            name="PagoComprobante",
            fields=[
                ("PCO_ID", models.AutoField(primary_key=True, serialize=False)),
                ("PAP_ID", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="pagos_comprobante", to="payments.pagopersona")),
                ("CPA_ID", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="comprobantes_pago", to="payments.comprobantepago")),
            ],
            options={
                "verbose_name": "Relación Pago-Comprobante",
                "verbose_name_plural": "Relaciones Pago-Comprobante",
                "db_table": "PAGO_COMPROBANTE",
                "unique_together": {("PAP_ID", "CPA_ID")},
            },
        ),
    ]
