# Análisis de Esquema: SQL vs Django Models

## Resumen Ejecutivo

Este documento compara el esquema de base de datos definido en `crebas_minuscula.sql` con los modelos Django implementados en el backend.

**Estado:** ✅ **COMPLETO** - Todos los modelos del SQL están implementados en Django

---

## Tablas del SQL Schema (43 tablas)

### ✅ Implementadas en Django

Todas las 43 tablas del schema SQL están correctamente implementadas en los modelos Django:

#### App: `maestros` (11 modelos)
- ✅ `alimentacion` → Alimentacion
- ✅ `aplicacion` → Aplicacion
- ✅ `cargo` → Cargo
- ✅ `concepto_contable` → ConceptoContable
- ✅ `estado_civil` → EstadoCivil
- ✅ `nivel` → Nivel
- ✅ `perfil` → Perfil
- ✅ `rama` → Rama
- ✅ `rol` → Rol
- ✅ `tipo_archivo` → TipoArchivo
- ✅ `tipo_curso` → TipoCurso

#### App: `geografia` (6 modelos)
- ✅ `region` → Region
- ✅ `provincia` → Provincia
- ✅ `comuna` → Comuna
- ✅ `zona` → Zona
- ✅ `distrito` → Distrito
- ✅ `grupo` → Grupo

#### App: `usuarios` (2 modelos)
- ✅ `usuario` → Usuario
- ✅ `perfil_aplicacion` → PerfilAplicacion

#### App: `personas` (8 modelos)
- ✅ `persona` → Persona
- ✅ `persona_curso` → PersonaCurso
- ✅ `persona_estado_curso` → PersonaEstadoCurso
- ✅ `persona_formador` → PersonaFormador
- ✅ `persona_grupo` → PersonaGrupo
- ✅ `persona_individual` → PersonaIndividual
- ✅ `persona_nivel` → PersonaNivel
- ✅ `persona_vehiculo` → PersonaVehiculo

#### App: `cursos` (7 modelos)
- ✅ `curso` → Curso
- ✅ `curso_seccion` → CursoSeccion
- ✅ `curso_fecha` → CursoFecha
- ✅ `curso_cuota` → CursoCuota
- ✅ `curso_alimentacion` → CursoAlimentacion
- ✅ `curso_coordinador` → CursoCoordinador
- ✅ `curso_formador` → CursoFormador

#### App: `archivos` (3 modelos)
- ✅ `archivo` → Archivo
- ✅ `archivo_curso` → ArchivoCurso
- ✅ `archivo_persona` → ArchivoPersona

#### App: `pagos` (5 modelos)
- ✅ `pago_persona` → PagoPersona
- ✅ `comprobante_pago` → ComprobantePago
- ✅ `pago_comprobante` → PagoComprobante
- ✅ `pago_cambio_persona` → PagoCambioPersona
- ✅ `prepago` → Prepago

#### App: `proveedores` (1 modelo)
- ✅ `proveedor` → Proveedor

---

## Modelos Adicionales en Django (no en SQL original)

### App: `preinscripcion` (4 modelos nuevos)
Estos modelos fueron agregados para extender la funcionalidad del sistema:

- ✨ `preinscripcion` → Preinscripcion
- ✨ `preinscripcion_estado_log` → PreinscripcionEstadoLog
- ✨ `cupo_configuracion` → CupoConfiguracion
- ✨ `preinscripcion_documento` → Documento

**Propósito:** Sistema de preinscripción con gestión de estados, control de cupos y documentación.

---

## Configuración de Apps Django

### INSTALLED_APPS (en orden de dependencias)
```python
INSTALLED_APPS = [
    # Django core apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    
    # Third-party apps
    "rest_framework",
    "corsheaders",
    
    # Project apps (en orden de dependencias)
    "usuarios",          # Base: Usuario, Perfil
    "maestros",          # Tablas maestras (no dependen de otras)
    "geografia",         # Región, Provincia, Comuna, Zona, Distrito, Grupo
    "personas",          # Depende de: usuarios, maestros, geografia
    "cursos",            # Depende de: usuarios, maestros, geografia, personas
    "archivos",          # Depende de: usuarios, cursos, personas, maestros
    "pagos",             # Depende de: usuarios, cursos, personas, maestros
    "proveedores",       # Independiente
    "preinscripcion",    # Depende de: personas, cursos, usuarios, maestros, geografia
]
```

---

## Estado de Migraciones

Todas las apps tienen migraciones creadas y aplicadas:

```
✅ usuarios       - 1 migration  (applied)
✅ maestros       - 1 migration  (applied)
✅ geografia      - 1 migration  (applied)
✅ personas       - 1 migration  (applied)
✅ cursos         - 2 migrations (applied)
✅ archivos       - 3 migrations (applied)
✅ pagos          - 2 migrations (applied)
✅ proveedores    - 1 migration  (applied)
✅ preinscripcion - 1 migration  (applied)
```

---

## Correspondencia de Campos Clave

### Tipos de Datos: SQL → Django

| SQL              | Django                    | Uso                          |
|------------------|---------------------------|------------------------------|
| `numeric(10)`    | `AutoField`               | Primary keys (IDs)           |
| `numeric(21,6)`  | `DecimalField(21,6)`      | Montos monetarios            |
| `varchar(n)`     | `CharField(max_length=n)` | Textos cortos                |
| `text`           | `TextField()`             | Textos largos                |
| `datetime`       | `DateTimeField()`         | Fechas y horas               |
| `date`           | `DateField()`             | Fechas                       |
| `int`            | `IntegerField()`          | Números enteros              |
| `bit`            | `BooleanField()`          | Valores booleanos (True/False)|

### Nomenclatura de Campos

Todos los modelos Django mantienen los nombres de columna del SQL usando `db_column`:
```python
per_id = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='per_id')
```

---

## Relaciones y Restricciones

### Foreign Keys
Todas las relaciones foráneas del SQL están implementadas con:
- `on_delete=models.CASCADE` (comportamiento predeterminado)
- `on_delete=models.SET_NULL` (cuando es apropiado, con `null=True`)
- `db_column` especificado para mantener nombres SQL originales

### Unique Constraints
Se utilizan `unique_together` en Meta class para replicar restricciones compuestas del SQL:
```python
class Meta:
    unique_together = (('per_id', 'cus_id'),)
```

---

## Validaciones de Integridad

### Campos NOT NULL
- Campos requeridos en SQL → sin `null=True, blank=True` en Django
- Campos opcionales en SQL → con `null=True, blank=True` en Django

### Valores por Defecto
Se mantienen valores auto-generados:
- Primary Keys: `AutoField` (auto-incremento)
- Timestamps: `auto_now_add=True` o `auto_now=True`
- Booleanos: `default=False` donde corresponde

---

## Recomendaciones para el Frontend

### Endpoints API Disponibles (a implementar)

Basado en la estructura de modelos, se recomienda implementar los siguientes endpoints REST:

#### Autenticación
- `POST /api/auth/login/`
- `POST /api/auth/logout/`
- `POST /api/auth/refresh/`

#### Usuarios
- `GET/POST /api/usuarios/`
- `GET/PUT/PATCH/DELETE /api/usuarios/{id}/`

#### Personas
- `GET/POST /api/personas/`
- `GET/PUT/PATCH/DELETE /api/personas/{id}/`
- `GET /api/personas/{id}/cursos/` - Cursos de una persona
- `GET /api/personas/{id}/grupos/` - Grupos de una persona

#### Cursos
- `GET/POST /api/cursos/`
- `GET/PUT/PATCH/DELETE /api/cursos/{id}/`
- `GET /api/cursos/{id}/secciones/` - Secciones del curso
- `GET /api/cursos/{id}/fechas/` - Fechas del curso
- `GET /api/cursos/{id}/participantes/` - Personas inscritas
- `GET /api/cursos/{id}/cuotas/` - Cuotas del curso

#### Preinscripciones
- `GET/POST /api/preinscripciones/`
- `GET/PUT/PATCH/DELETE /api/preinscripciones/{id}/`
- `POST /api/preinscripciones/{id}/validar/`
- `POST /api/preinscripciones/{id}/rechazar/`
- `GET /api/preinscripciones/{id}/logs/` - Historial de estados

#### Pagos
- `GET/POST /api/pagos/`
- `GET/PUT/PATCH/DELETE /api/pagos/{id}/`
- `GET /api/pagos/persona/{persona_id}/`
- `GET /api/pagos/curso/{curso_id}/`

#### Maestros (catálogos)
- `GET /api/maestros/alimentacion/`
- `GET /api/maestros/cargos/`
- `GET /api/maestros/niveles/`
- `GET /api/maestros/ramas/`
- `GET /api/maestros/roles/`
- `GET /api/maestros/tipos-curso/`

#### Geografía
- `GET /api/geografia/regiones/`
- `GET /api/geografia/provincias/`
- `GET /api/geografia/comunas/`
- `GET /api/geografia/zonas/`
- `GET /api/geografia/distritos/`
- `GET /api/geografia/grupos/`

---

## Conclusiones

✅ **Completitud**: Todos los modelos del SQL están implementados
✅ **Integridad**: Relaciones y restricciones están correctamente definidas
✅ **Consistencia**: Nomenclatura y tipos de datos son coherentes
✅ **Extensibilidad**: Sistema de preinscripción agregado sin afectar modelos base
✅ **Migraciones**: Todas las apps tienen migraciones creadas y aplicadas

**El backend está completo y listo para implementar vistas y serializers para el frontend.**

---

## Próximos Pasos Recomendados

1. **Implementar Serializers DRF** para cada modelo
2. **Crear ViewSets** con permisos apropiados según roles
3. **Configurar URLs** de API para todos los endpoints
4. **Implementar autenticación JWT** con tokens rotativos
5. **Agregar validaciones de negocio** en serializers
6. **Crear tests unitarios** para modelos y APIs
7. **Documentar API** con Swagger/OpenAPI

---

*Generado: 2025-11-15*
*Versión Django: 5.2.7*
*Base de datos: SQLite (desarrollo) / MySQL (producción)*
