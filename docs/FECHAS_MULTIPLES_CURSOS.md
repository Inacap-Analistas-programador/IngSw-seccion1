# Fechas Múltiples para Cursos

## Resumen de Cambios

Esta implementación permite que los cursos tengan múltiples fechas, utilizando el modelo `CursoFecha` existente en la base de datos.

## Cambios en Backend

### Serializador (`backend/cursos/serializers.py`)

El `CursoSerializer` ahora incluye un campo anidado `fechas` que representa las fechas múltiples del curso:

```python
class CursoSerializer(serializers.ModelSerializer):
    fechas = CursoFechaSerializer(many=True, required=False, source='cursofecha_set')
```

#### Funcionalidad de Creación
Al crear un curso, se pueden incluir múltiples fechas en el payload:

```json
{
  "cur_codigo": "FORM001",
  "cur_descripcion": "Curso de Formación",
  "fechas": [
    {
      "cuf_fecha_inicio": "2024-02-01T09:00:00",
      "cuf_fecha_termino": "2024-02-05T18:00:00",
      "cuf_tipo": 1
    },
    {
      "cuf_fecha_inicio": "2024-02-10T09:00:00",
      "cuf_fecha_termino": "2024-02-15T18:00:00",
      "cuf_tipo": 2
    }
  ]
}
```

#### Funcionalidad de Actualización
Al actualizar un curso, las fechas anteriores se eliminan y se reemplazan con las nuevas.

### Tests (`backend/cursos/test/test_cursos_serializer.py`)

Se agregaron 5 tests para validar:
- Campos del serializador `CursoFechaSerializer`
- Campo `fechas` en `CursoSerializer`
- Comportamiento anidado del campo `fechas`
- Creación de cursos con fechas múltiples
- Actualización de cursos con fechas múltiples

## Cambios en Frontend

### Dashboard de Coordinador (`frontend/src/components/dashboard/Cursos.jsx`)

#### Funciones para Manejar Fechas
- `handleAddFecha()` - Agregar una nueva fecha
- `handleRemoveFecha(index)` - Eliminar una fecha por índice
- `handleFechaChange(index, field, value)` - Modificar una fecha específica

#### UI para Gestión de Fechas

**Formulario de Creación/Edición:**
- Botón "+ Agregar Fecha" para añadir nuevas fechas
- Cada fecha tiene:
  - Fecha Inicio (datetime-local)
  - Fecha Término (datetime-local)
  - Tipo (Presencial/Online/Híbrido)
- Botón "Eliminar" para cada fecha

**Vista de Tabla:**
- Muestra todas las fechas del curso en formato compacto
- Fallback a `fechaHora` si no hay fechas múltiples

**Modal de Visualización:**
- Sección dedicada "Fechas del Curso"
- Muestra cada fecha con formato amigable

### Vista Pública (`frontend/src/pages/CursosPublicPage.jsx`)

Se agregó visualización de fechas en las tarjetas de cursos con iconos de calendario y formato legible.

## Tipos de Fecha

El campo `cuf_tipo` puede tener los siguientes valores:
- `1`: Presencial
- `2`: Online
- `3`: Híbrido

## Compatibilidad Hacia Atrás

El sistema mantiene compatibilidad con cursos que no tienen fechas múltiples:
- Si `fechas` está vacío o no existe, el sistema usa `fechaHora`
- No se requiere migración de datos existentes
- Los cursos antiguos siguen funcionando normalmente

## Flujo de Uso

### Crear un Curso con Fechas Múltiples

1. Usuario accede al dashboard de coordinador
2. Hace clic en "Nuevo Curso"
3. Completa información básica del curso
4. Hace clic en "+ Agregar Fecha" para cada período
5. Configura fecha inicio, término y tipo para cada período
6. Guarda el curso

### Ver Fechas de un Curso

**Dashboard:**
- La tabla muestra todas las fechas en formato compacto
- El modal de detalles muestra cada fecha en una tarjeta separada

**Vista Pública:**
- Las tarjetas de cursos muestran todas las fechas con iconos

## Pruebas

### Backend
```bash
cd backend
python -m pytest cursos/test/test_cursos_serializer.py -v
```

### Frontend
```bash
cd frontend
npm run build
npm run lint
```

## Notas de Implementación

1. **Campos del Serializer**: Se usa `source='cursofecha_set'` para mapear correctamente con la relación inversa de Django
2. **Eliminación en Cascade**: Al actualizar fechas, se eliminan todas las anteriores y se crean las nuevas
3. **UX**: El sistema muestra un mensaje cuando no hay fechas adicionales
