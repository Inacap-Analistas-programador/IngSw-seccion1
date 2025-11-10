# Registro de Pasos Backend Personas

## Paso 1 - Revisión del modelo `Persona`
- Se revisó el archivo `backend/personas/models.py` para registrar las clases existentes.
- Clases encontradas: `Persona`, `PersonaIndividual`, `PersonaNivel`, `PersonaFormador`.
- Se listarán los campos actuales de cada clase para validar si falta información.
- Estructuras faltantes del esquema entregado: `PersonaGrupo(peg_id, gru_id, per_id, peg_vigente)` y `PersonaCurso(pec_id, per_id, cus_id, rol_id, ali_id, niv_id, pec_observacion, pec_registro, pec_acredito)` pendientes de definir.

## Paso 2 - Completar modelos faltantes
- Se agregaron a `backend/personas/models.py` las clases `PersonaGrupo` y `PersonaCurso` con sus campos y relaciones según el esquema.
- `PersonaGrupo` referencia a `Grupo` y `Persona`, y `PersonaCurso` enlaza con `CursoSeccion`, `Rol`, `Alimentacion`, `Nivel` y `Persona`.

## Paso 3 - Implementar endpoints CRUD
- Se actualizaron `backend/personas/serializers.py`, `backend/personas/views.py` y `backend/personas/urls.py` para incluir serializadores, viewsets y rutas para `PersonaGrupo` y `PersonaCurso`.
- Los nuevos endpoints reutilizan los `ModelViewSet` de DRF para exponer operaciones CRUD completas.

## Paso 4 - Dependencias API
- Se configuró el entorno virtual e instalamos `djangorestframework` y `django-filter` para habilitar los endpoints y filtros en tiempo de ejecución.
- Se verificó que las importaciones de DRF quedaran disponibles sin anotaciones `type: ignore`.


## Paso 5 - Filtros avanzados
- Se extendió `backend/personas/filters.py` incorporando filtros por `grupo`, `zona`, `distrito`, `cargo`, `nivel`, `rama`, `vigente` y `registro_vigente`.
- Todos los filtros usan métodos dedicados con `distinct()` para evitar duplicados cuando una persona posee múltiples relaciones.

## Paso 6 - Ajuste configuración development
- Se actualizó `backend/scouts_platform/settings/development.py` para que, si faltan variables `DB_*`, se mantenga la base SQLite definida en `base.py` en lugar de lanzar excepción.

## Paso 7 - Campo registro_vigente
- Se añadió `registro_vigente` como `BooleanField` en `backend/personas/models.py` (columna `per_registro_vigente`) para marcar registros activos/inactivos.

## Paso 8 - Validación general
- Se ejecutó `manage.py check` con éxito tras incluir el campo nuevo y el fallback de base de datos, confirmando que no hay errores de configuración.
