# Quick Start Guide - Backend Verification

Este archivo contiene comandos para verificar rápidamente que el backend está correctamente configurado.

## Pre-requisitos

```bash
# Instalar dependencias (si no están instaladas)
pip install django==5.2.7 djangorestframework django-cors-headers
```

## Verificación Rápida (5 minutos)

### 1. Verificar Configuración Django

```bash
cd backend
python3 manage.py check
```

**Resultado esperado:** `System check identified no issues (0 silenced).`

### 2. Verificar Estado de Migraciones

```bash
python3 manage.py showmigrations
```

**Resultado esperado:** Todas las apps deben mostrar `[X]` en sus migraciones:
- usuarios [X] 0001_initial
- maestros [X] 0001_initial
- geografia [X] 0001_initial
- personas [X] 0001_initial
- cursos [X] 0001_initial (y 0002)
- archivos [X] 0001_initial (y 0002, 0003)
- pagos [X] 0001_initial (y 0002)
- proveedores [X] 0001_initial
- preinscripcion [X] 0001_initial

### 3. Verificar Tablas en Base de Datos

```bash
python3 -c "
import os, sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scout_project.settings')
import django
django.setup()

from django.db import connection
cursor = connection.cursor()

# SQL tables from schema
sql_tables = ['alimentacion', 'aplicacion', 'archivo', 'archivo_curso', 'archivo_persona',
    'cargo', 'comprobante_pago', 'comuna', 'concepto_contable', 'curso',
    'curso_alimentacion', 'curso_coordinador', 'curso_cuota', 'curso_fecha',
    'curso_formador', 'curso_seccion', 'distrito', 'estado_civil', 'grupo',
    'nivel', 'pago_cambio_persona', 'pago_comprobante', 'pago_persona',
    'perfil', 'perfil_aplicacion', 'persona', 'persona_curso',
    'persona_estado_curso', 'persona_formador', 'persona_grupo',
    'persona_individual', 'persona_nivel', 'persona_vehiculo', 'prepago',
    'proveedor', 'provincia', 'rama', 'region', 'rol', 'tipo_archivo',
    'tipo_curso', 'usuario', 'zona']

missing = []
for table in sql_tables:
    cursor.execute(f\"SELECT name FROM sqlite_master WHERE type='table' AND name='{table}'\")
    if not cursor.fetchone():
        missing.append(table)

if missing:
    print(f'❌ Missing tables: {missing}')
else:
    print(f'✅ All {len(sql_tables)} SQL schema tables exist in database')
"
```

**Resultado esperado:** `✅ All 43 SQL schema tables exist in database`

### 4. Test Django ORM

```bash
python3 -c "
import os, sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scout_project.settings')
import django
django.setup()

from geografia.models import Region

# Test CRUD
region = Region.objects.create(reg_descripcion='Test', reg_vigente=True)
print(f'✅ Created: {region.reg_descripcion}')

region.reg_descripcion = 'Updated Test'
region.save()
print(f'✅ Updated: {region.reg_descripcion}')

region.delete()
print(f'✅ Deleted successfully')

print('✅ Django ORM is working correctly')
"
```

**Resultado esperado:**
```
✅ Created: Test
✅ Updated: Updated Test
✅ Deleted successfully
✅ Django ORM is working correctly
```

### 5. Iniciar Servidor de Desarrollo (Opcional)

```bash
python3 manage.py runserver 0.0.0.0:8000
```

**Acceder a:**
- Admin panel: http://localhost:8000/admin/ (necesita crear superusuario primero)
- API root: http://localhost:8000/api/ (una vez implementados los endpoints)

## Crear Superusuario (Opcional)

```bash
python3 manage.py createsuperuser
```

Seguir las instrucciones para crear un usuario administrador.

## Verificación Completa (Script Automatizado)

```bash
python3 -c "
import os, sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scout_project.settings')
import django
django.setup()

from django.db import connection
from django.apps import apps

print('=' * 60)
print('BACKEND VERIFICATION REPORT')
print('=' * 60)
print()

# Check 1: Apps Configuration
print('1. INSTALLED_APPS:')
target_apps = ['usuarios', 'maestros', 'geografia', 'personas', 'cursos', 
               'archivos', 'pagos', 'proveedores', 'preinscripcion']
for app in target_apps:
    try:
        apps.get_app_config(app)
        print(f'   ✅ {app}')
    except:
        print(f'   ❌ {app}')
print()

# Check 2: Models Count
print('2. Django Models:')
total_models = 0
for app in target_apps:
    try:
        app_config = apps.get_app_config(app)
        models = len(app_config.get_models())
        total_models += models
        print(f'   {app}: {models} models')
    except:
        pass
print(f'   Total: {total_models} models')
print()

# Check 3: Database Tables
print('3. Database Tables:')
cursor = connection.cursor()
cursor.execute(\"SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name NOT LIKE 'django_%' AND name NOT LIKE 'auth_%' AND name NOT LIKE 'sqlite_%'\")
count = cursor.fetchone()[0]
print(f'   Application tables: {count}')
print()

# Check 4: Migrations
print('4. Migration Status:')
from django.db.migrations.executor import MigrationExecutor
executor = MigrationExecutor(connection)
plan = executor.migration_plan(executor.loader.graph.leaf_nodes())
if plan:
    print(f'   ❌ Pending migrations: {len(plan)}')
else:
    print('   ✅ All migrations applied')
print()

print('=' * 60)
print('SUMMARY')
print('=' * 60)
if total_models >= 47 and count >= 47 and not plan:
    print('✅ Backend is fully configured and ready!')
else:
    print('⚠️  Some issues detected - check details above')
print('=' * 60)
"
```

## Troubleshooting

### Error: "No module named 'django'"
```bash
pip install django==5.2.7 djangorestframework django-cors-headers
```

### Error: "InconsistentMigrationHistory"
Las migraciones ya están resueltas. Si aparece este error:
```bash
# Ver BACKEND_REVIEW_SUMMARY.md para detalles de cómo se resolvió
```

### Error: "table does not exist"
```bash
# Re-aplicar migraciones
python3 manage.py migrate --run-syncdb
```

## Referencias

- **SCHEMA_ANALYSIS.md** - Análisis completo del schema
- **NEXT_STEPS.md** - Guía para implementar la API
- **BACKEND_REVIEW_SUMMARY.md** - Resumen ejecutivo del trabajo

## Estado Actual

✅ Backend 100% configurado  
✅ 43 tablas SQL implementadas  
✅ 4 tablas adicionales (preinscripcion)  
✅ Todas las migraciones aplicadas  
✅ Django ORM funcional  

**Próximo paso:** Implementar serializers y ViewSets (ver NEXT_STEPS.md)
