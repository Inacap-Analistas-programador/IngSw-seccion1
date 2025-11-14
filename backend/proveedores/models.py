from django.db import models

# Tabla: proveedor
class Proveedor(models.Model):
    # prv_id: Identificador único del proveedor (clave primaria)
    prv_id = models.AutoField(primary_key=True)
    # prv_descripcion: Nombre o razón social del proveedor
    prv_descripcion = models.CharField(max_length=100)
    # prv_celular1: Primer número de celular de contacto
    prv_celular1 = models.CharField(max_length=15)
    # prv_celular2: Segundo número de celular de contacto (opcional)
    prv_celular2 = models.CharField(max_length=15, null=True, blank=True)
    # prv_direccion: Dirección física del proveedor
    prv_direccion = models.CharField(max_length=100)
    # prv_observacion: Observaciones generales sobre el proveedor
    prv_observacion = models.TextField(null=True, blank=True)
    # prv_vigente: Indica si el proveedor está activo (True) o inactivo (False)
    prv_vigente = models.BooleanField()

    class Meta:
        db_table = 'proveedor'
        verbose_name = 'Proveedor'
        verbose_name_plural = 'Proveedores'

    def __str__(self):
        return self.prv_descripcion
