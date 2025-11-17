# Scripts de Base de Datos - GIC

Este directorio contiene el script de inicialización de la base de datos para el sistema GIC.

## seed_database.py

**Script único y consolidado** para poblar la base de datos con todos los datos de prueba necesarios.

### ¿Qué hace?

Este script crea datos completos en el siguiente orden:

1. **Geografía**: Regiones, provincias y comunas de Chile
2. **Zonas Scouts**: Zonas, distritos y grupos scouts
3. **Maestros**: Tablas maestras (estado civil, cargos, niveles, ramas, roles, tipos de archivo, tipos de curso, alimentación, conceptos contables, perfiles)
4. **Usuarios**: Usuarios con diferentes roles (admin, coordinador, dirigente, instructores, participantes)
5. **Personas**: Datos personales vinculados a usuarios
6. **Proveedores**: Proveedores de servicios
7. **Cursos**: Cursos completos con secciones
8. **Inscripciones**: Inscripciones de participantes en cursos
9. **Pagos**: Registros de pagos con detalles

### Uso

#### Opción 1: Ejecución directa
```bash
cd backend
python scripts/seed_database.py
```

#### Opción 2: Desde Django shell
```bash
cd backend
python manage.py shell < scripts/seed_database.py
```

### Usuarios creados

El script crea los siguientes usuarios de prueba:

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | admin123 | Administrador |
| coordinador | coord123 | Coordinador de cursos |
| dirigente | dirigente123 | Dirigente |
| instructor1 | instructor123 | Instructor |
| instructor2 | instructor123 | Instructor |
| instructor3 | instructor123 | Instructor |
| participante1 | participante123 | Participante |
| participante2 | participante123 | Participante |
| participante3 | participante123 | Participante |
| participante4 | participante123 | Participante |
| participante5 | participante123 | Participante |

### Notas importantes

- ⚠️ **Solo para desarrollo**: Este script está diseñado para entornos de desarrollo/pruebas
- 🔄 **Idempotente**: Puede ejecutarse múltiples veces sin duplicar datos (usa `get_or_create`)
- 🗄️ **Base de datos limpia**: Se recomienda ejecutar en una base de datos recién migrada
- 📊 **Datos completos**: Crea un conjunto realista de datos para pruebas integrales

### Solución de problemas

#### Error: "No such table"
```bash
# Ejecutar migraciones primero
python manage.py migrate
```

#### Error: "NOT NULL constraint failed"
Este error ha sido resuelto. El script ahora:
- Crea todas las tablas maestras antes de crear entidades que las referencian
- Obtiene objetos requeridos (como `EstadoCivil` y `Comuna`) solo después de crearlos
- Mantiene el orden correcto de dependencias

#### Limpiar la base de datos
```bash
# SQLite (desarrollo)
rm db.sqlite3
python manage.py migrate
python scripts/seed_database.py

# MySQL (producción - cuidado!)
python manage.py flush
python scripts/seed_database.py
```

## Historial de cambios

### v2.0 (Actual)
- ✅ Script único consolidado
- ✅ Corregido error de dependencias (NOT NULL constraint)
- ✅ Documentación completa
- ✅ Orden correcto de creación de datos
- ❌ Eliminados scripts redundantes:
  - `populate_full_data.py` (incompleto, con errores)
  - `seed_database.py` (versión antigua, funcionalidad básica)
  - `seed_comprehensive.py` (renombrado a `seed_database.py`)

### v1.0 (Anterior)
- Múltiples scripts con funcionalidad duplicada
- Problemas de dependencias entre scripts
- Documentación dispersa
