# Database Population Guide

This document explains how to populate the GIC database with sample data.

## Quick Start

To populate the database with sample data, run:

```bash
cd backend
python manage.py populate_database
```

## What Gets Populated

The `populate_database` management command creates comprehensive sample data for all main tables:

### Master Data (Maestros)
- **Estados Civiles**: 5 records (Soltero/a, Casado/a, Divorciado/a, Viudo/a, Conviviente)
- **Cargos**: 10 records (Dirigente Scout, Coordinadores, Jefes, Formadores, etc.)
- **Niveles**: 4 records (Básico, Intermedio, Avanzado, Especializado)
- **Ramas**: 4 records (Manada, Unidad Scout, Comunidad Caminantes, Comunidad Rover)
- **Roles**: 5 records (Participante, Formador, Coordinador, Director, Staff)
- **Tipos de Archivo**: 6 records (Certificado, Documento, Foto, etc.)
- **Tipos de Curso**: 5 records (Formación Inicial, Intermedia, Avanzada, etc.)
- **Alimentaciones**: 5 records (Con/Sin Almuerzo, Vegetariana, Vegana, Celíaco)
- **Conceptos Contables**: 6 records (Inscripción, Material, Alimentación, etc.)
- **Aplicaciones**: 3 records (GIC modules)
- **Perfiles**: 4 records (Administrador, Coordinador, Dirigente, Usuario)

### Geographic Data (Geografia)
- **Regiones**: 5 Chilean regions (Arica, Tarapacá, Metropolitana, Valparaíso, Biobío)
- **Provincias**: 13 provinces within the regions
- **Comunas**: 79 communes across the provinces

### Organizational Structure
- **Zonas**: 4 scout zones (Norte, Centro, Valparaíso, Sur)
- **Distritos**: 5 districts across zones
- **Grupos**: 13 scout groups distributed in districts

### Providers (Proveedores)
- **Proveedores**: 3 sample providers (Food, Materials, Accommodation)

### People (Personas)
- **Personas**: 15 sample people with complete profiles
  - Full names (Chilean names)
  - RUT numbers
  - Email addresses (@scouts.cl domain)
  - Birth dates
  - Contact information
  - Emergency contacts
- **Persona-Grupo**: People assigned to scout groups
- **Persona-Nivel**: People with assigned levels

### Courses (Cursos)
- **Cursos**: 5 sample courses
  - FI-2024-01: Formación Inicial 2024-1
  - FI-2024-02: Formación Inicial 2024-2
  - FM-2024-01: Formación Intermedia 2024-1
  - FA-2024-01: Formación Avanzada 2024-1
  - ESP-2024-01: Especialización en Liderazgo
- **Curso Secciones**: Course sections with participant limits
- **Curso Fechas**: Course dates (start/end times)
- **Inscripciones**: 50 enrollments (people enrolled in courses)
- **Estados de Inscripción**: Enrollment states for each person

### Payments (Pagos)
- **Pagos**: 20 payment records
  - Payment amounts between $50,000 and $120,000 CLP
  - Payment dates
  - Payment types (Income/Expense)
- **Comprobantes**: 20 payment receipts
  - Receipt numbers
  - Receipt dates
  - Linked to accounting concepts
- **Pago-Comprobante**: Links between payments and receipts

## Running Multiple Times

The command uses `get_or_create()` for most records, so running it multiple times is safe:
- Existing records won't be duplicated
- Only new records will be created
- Some tables may have additional records on subsequent runs

## Cleaning the Database

If you want to start fresh, you can:

1. Delete the database file:
```bash
rm backend/db.sqlite3
```

2. Run migrations:
```bash
cd backend
python manage.py migrate
```

3. Populate again:
```bash
python manage.py populate_database
```

## Statistics

After running the command, you'll see a summary like:

```
=== Database Population Statistics ===
  Estados Civiles: 5
  Cargos: 10
  Niveles: 4
  Ramas: 4
  Roles: 5
  Tipos de Archivo: 6
  Tipos de Curso: 5
  Alimentaciones: 5
  Conceptos Contables: 6
  Regiones: 5
  Provincias: 13
  Comunas: 79
  Zonas: 4
  Distritos: 5
  Grupos: 13
  Proveedores: 3
  Personas: 15
  Cursos: 5
  Inscripciones: 50
  Pagos: 20
  Comprobantes: 20
```

## Notes

- All data is sample/dummy data for development purposes
- Email addresses use the @scouts.cl domain
- RUT numbers are randomly generated
- Dates are relative to the current date
- Amounts are in Chilean Pesos (CLP)

## Troubleshooting

If you encounter errors:

1. Make sure migrations are up to date:
```bash
python manage.py migrate
```

2. Check that all apps are properly installed in settings.py

3. Verify that foreign key relationships are correctly set up

4. Check Django logs for specific error messages
