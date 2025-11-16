# 🚀 Quick Database Setup Guide

This is a quick reference guide for setting up and populating the GIC database.

## Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Step 2: Apply Migrations

```bash
python manage.py migrate
```

Expected output:
```
Operations to perform:
  Apply all migrations: admin, archivos, auth, contenttypes, cursos, geografia, maestros, pagos, personas, preinscripcion, proveedores, sessions, usuarios
Running migrations:
  [X] All migrations applied successfully
```

## Step 3: Populate Database

```bash
python manage.py populate_database
```

Expected output:
```
Starting database population...
Populating master tables...
Populating geographic data...
Populating organizational structure...
Populating providers...
Populating people...
Populating courses...
Populating payments...
Database populated successfully!

=== Database Population Statistics ===
  Estados Civiles: 5
  Cargos: 10
  Niveles: 4
  Ramas: 4
  Roles: 5
  ...
  Personas: 15
  Cursos: 5
  Inscripciones: 50
  Pagos: 20
  Comprobantes: 20

Database ready for use!
```

## Step 4: Verify Population (Optional)

```bash
python verify_database.py
```

Expected output:
```
============================================================
DATABASE POPULATION VERIFICATION
============================================================
✓ Estados Civiles: 5 (expected >= 5)
✓ Cargos: 10 (expected >= 10)
...
✓ Pagos: 20 (expected >= 20)
✓ Comprobantes: 20 (expected >= 20)

✓ ALL VERIFICATIONS PASSED

The database is properly populated and ready to use!
```

## Step 5: Start the Server

```bash
python manage.py runserver
```

## Step 6: Access the Application

### API Documentation (Swagger)
Open browser: http://localhost:8000/api/docs/

### Django Admin Panel
1. Open browser: http://localhost:8000/admin/
2. Login with:
   - Username: `admin@test.com`
   - Password: `admin123`

### API Endpoints

All endpoints require authentication. Example endpoints:

- `GET /api/cursos/` - List all courses
- `GET /api/personas/` - List all people
- `GET /api/geografia/regiones/` - List regions
- `GET /api/pagos/` - List payments

## Troubleshooting

### Error: "No module named 'django'"
```bash
pip install -r requirements.txt
```

### Error: "Table doesn't exist"
```bash
python manage.py migrate
```

### Database is empty
```bash
python manage.py populate_database
```

### Need to reset database
```bash
rm db.sqlite3
python manage.py migrate
python manage.py populate_database
```

## What You Get

After following these steps, you'll have:

✅ A fully populated database with 782+ records  
✅ 15 sample people with complete profiles  
✅ 5 courses with enrollments  
✅ 79 Chilean communes across 5 regions  
✅ 13 scout groups across 4 zones  
✅ 20 payment records with receipts  
✅ All master/catalog data populated  

## Next Steps

1. **Explore the API**: http://localhost:8000/api/docs/
2. **Test endpoints**: Use the Swagger UI to test API calls
3. **Start frontend**: `cd ../frontend && npm run dev`
4. **Develop features**: The database is ready for development!

## Quick Commands Reference

| Command | Description |
|---------|-------------|
| `python manage.py migrate` | Apply database migrations |
| `python manage.py populate_database` | Populate with sample data |
| `python verify_database.py` | Verify data integrity |
| `python manage.py runserver` | Start development server |
| `python manage.py createsuperuser` | Create admin user |
| `python manage.py shell` | Open Django shell |

---

💡 **Pro Tip**: Keep a terminal open with the server running and use another terminal for management commands.

🔗 **Documentation**: See [DATABASE_POPULATION.md](DATABASE_POPULATION.md) for detailed information.
