# Populate Data Script

Este script (`populate_full_data.py`) pobla la base de datos con datos de prueba completos para el sistema GIC.

## Datos que Crea

El script crea los siguientes datos de prueba:

### Usuarios (8 usuarios)
- **Coordinadores**: maria.gonzalez
- **Dirigentes**: carlos.munoz, patricia.rodriguez
- **Participantes**: juan.soto, ana.lopez, diego.castro, valentina.hernandez, felipe.silva

**Contraseña para todos**: `scout123`

### Personas (8 personas)
Vinculadas a los usuarios creados, con datos completos de:
- Información personal (RUT, nombres, apellidos, email)
- Dirección y teléfono
- Fecha de nacimiento
- Estado civil y comuna

### Cursos (4 cursos)
- CFB-2024-001: Curso de Formación Básica - Marzo 2024
- CFI-2024-002: Curso de Formación Intermedia - Abril 2024
- TAL-2024-003: Taller de Técnicas de Campamento
- TAL-2024-004: Taller de Primeros Auxilios Avanzados

Cada curso incluye:
- Secciones con capacidad de participantes
- Fechas de inicio y término
- Cuotas con y sin almuerzo
- Ubicación y coordinador

### Inscripciones
Los participantes están inscritos en los primeros 2 cursos con estados correspondientes.

### Proveedores (4 proveedores)
- Centro de Convenciones Scouts Chile S.A.
- Catering y Alimentación Scout Ltda.
- Librería y Materiales Didácticos Scouts
- Transporte y Logística Scouts S.A.

## Cómo Ejecutar el Script

### Opción 1: Con Docker (Recomendado)

```bash
# Desde la raíz del proyecto
docker-compose exec backend python scripts/populate_full_data.py
```

### Opción 2: Con Python Local

```bash
# Navegar al directorio backend
cd backend

# Activar el entorno virtual (si usas uno)
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate  # Windows

# Ejecutar el script
python scripts/populate_full_data.py
```

### Opción 3: Con Django Management Command

```bash
cd backend
python manage.py shell < scripts/populate_full_data.py
```

## Verificación de Datos

Después de ejecutar el script, puedes verificar los datos en:

1. **Panel de Administración Django**: http://localhost:8000/admin/
2. **Dashboard Frontend**: http://localhost:3000/coordinador/panel/ejecutivo
3. **API REST**: http://localhost:8000/api/docs/

## Endpoints de Dashboard

Los siguientes endpoints muestran datos reales de la base de datos:

- `/api/usuarios/dashboard/stats/` - Estadísticas generales
- `/api/usuarios/dashboard/executive-stats/` - Estadísticas ejecutivas con tendencias
- `/api/usuarios/dashboard/recent-courses/` - Cursos recientes
- `/api/usuarios/dashboard/recent-activity/` - Actividad reciente
- `/api/usuarios/dashboard/payment-stats/` - Estadísticas de pagos

## Resetear los Datos

Si necesitas resetear y volver a poblar los datos:

```bash
# Con Docker
docker-compose exec backend python manage.py flush --no-input
docker-compose exec backend python scripts/populate_full_data.py

# Sin Docker
python manage.py flush --no-input
python scripts/populate_full_data.py
```

## Notas Importantes

- El script usa `get_or_create()` para evitar duplicados
- Si ejecutas el script múltiples veces, no creará datos duplicados
- Todos los usuarios tienen la contraseña `scout123`
- Los datos son solo para pruebas y desarrollo

## Troubleshooting

### Error: "No module named 'django'"
Asegúrate de que Django esté instalado:
```bash
pip install -r requirements.txt
```

### Error: "Could not connect to database"
Verifica que MySQL esté corriendo:
```bash
docker-compose up -d mysql
```

### Error: "Table doesn't exist"
Ejecuta las migraciones primero:
```bash
python manage.py migrate
```
