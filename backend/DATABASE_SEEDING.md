# Database Seeding Guide

This guide explains how to populate the GIC database with realistic seed data for development and testing.

## Quick Start

To populate the database with seed data, run:

```bash
cd backend
python manage.py seed_database
```

## What Gets Seeded

The `seed_database` command populates all core tables with realistic data:

### Master Data (Maestros)
- **Aplicaciones**: System applications (GIC System, Web Portal, Mobile App)
- **Perfiles**: User profiles (Admin, Coordinator, Leader, Trainer, Participant)
- **Estados Civiles**: Marital statuses (Single, Married, Divorced, etc.)
- **Cargos**: Positions (Group Leader, Zonal Coordinator, etc.)
- **Niveles**: Levels (Basic, Intermediate, Advanced, Trainer)
- **Ramas**: Scout branches (Manada, Unidad, Comunidad, Rover)
- **Roles**: Roles in courses (Participant, Trainer, Coordinator, Observer)
- **Tipos de Archivo**: File types (Certificate, Payment Receipt, Profile Photo, etc.)
- **Tipos de Curso**: Course types (Basic Training, Leadership Course, etc.)
- **Alimentaciones**: Meal preferences (With Lunch, Without Lunch, Vegetarian, etc.)
- **Conceptos Contables**: Accounting concepts (Registration, Monthly Fee, etc.)

### Geography (Geografía)
- **Regiones**: All 15 Chilean regions
- **Provincias**: Sample provinces (focused on Metropolitan Region)
- **Comunas**: Sample comunas from Santiago province
- **Zonas**: Scout zones (North, Center, South, East)
- **Distritos**: Scout districts
- **Grupos**: Scout groups

### Users and People
- **Usuarios**: 3 test users with different profiles:
  - `admin` / `Admin123!` (Administrator)
  - `coordinador` / `Coord123!` (Coordinator)
  - `dirigente` / `Dirig123!` (Leader)
- **Personas**: 3 sample people with complete profiles
- **PersonaGrupo**: Associations between people and scout groups

### Courses (Cursos)
- **Cursos**: 2 sample courses:
  - FB-2024-01: Formación Básica Scout 2024
  - LID-2024-01: Curso de Liderazgo 2024
- **CursoSeccion**: Course sections
- **CursoFecha**: Course dates (scheduled 30 days in the future)
- **CursoCuota**: Course fees (with and without lunch)

### Pre-registrations (Preinscripciones)
- **Preinscripciones**: 6 sample pre-registrations with different states:
  - enviado (sent)
  - en_revision_grupo (under group review)
  - validado (validated)

## Command Options

### Clear Existing Data

To clear all existing data before seeding:

```bash
python manage.py seed_database --clear
```

⚠️ **Warning**: This will delete all data in the database! Use only in development.

## Data Structure

All seeded data is realistic and follows the actual database schema:

- **RUT numbers**: Valid Chilean RUT format
- **Email addresses**: Use @scouts.cl domain
- **Phone numbers**: Chilean format (+569xxxxxxxx)
- **Dates**: Timezone-aware datetime objects
- **Relationships**: Proper foreign key relationships
- **Validation**: All data passes Django model validation

## Usage in Development

### Initial Setup

```bash
# 1. Run migrations
python manage.py migrate

# 2. Seed the database
python manage.py seed_database

# 3. Verify the data
python manage.py shell
>>> from preinscripcion.models import Preinscripcion
>>> Preinscripcion.objects.count()
6
```

### Reset Database

To start fresh:

```bash
# 1. Delete the database
rm db.sqlite3

# 2. Run migrations
python manage.py migrate

# 3. Seed with data
python manage.py seed_database
```

### Re-seed Without Deleting

The command is idempotent - running it multiple times won't create duplicates:

```bash
# Safe to run multiple times
python manage.py seed_database
```

## Test Users

After seeding, you can log in with these test accounts:

| Username | Password | Role |
|----------|----------|------|
| admin | Admin123! | Administrator |
| coordinador | Coord123! | Coordinator |
| dirigente | Dirig123! | Leader |

## Integration with Tests

The seed command is separate from test fixtures. Tests use their own test database that is automatically created and destroyed.

To run tests:

```bash
python manage.py test
```

## Extending the Seed Command

To add more seed data, edit:
```
backend/maestros/management/commands/seed_database.py
```

Add new methods following the pattern:

```python
def seed_your_model(self):
    data = [...]
    for item in data:
        YourModel.objects.get_or_create(...)
    self.stdout.write('✓ Your model seeded')
```

Then call it in the `handle` method in the appropriate order.

## Troubleshooting

### Unique Constraint Errors

If you get unique constraint errors, run with `--clear`:
```bash
python manage.py seed_database --clear
```

### Foreign Key Errors

Make sure you're seeding in the correct order. Dependencies must be seeded first.

### Timezone Warnings

All dates use `timezone.make_aware()` or `timezone.now()` to be timezone-aware.

## Production Use

⚠️ **Never run seed_database in production!**

This command is for development and testing only. For production data:
1. Use proper data migration scripts
2. Import from CSV/Excel files
3. Use Django admin interface
4. Use the actual application to create data

## See Also

- [Django Management Commands](https://docs.djangoproject.com/en/5.2/howto/custom-management-commands/)
- [Model Documentation](../modelo_de_datos.md)
- [Database Setup](./DATABASE_CONFIG.md)
