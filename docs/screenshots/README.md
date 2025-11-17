# Screenshots - GIC Platform with Real Data

These screenshots demonstrate the GIC platform displaying real data from the backend database, with no mock data visible.

## Screenshots

### 01-home.png
Home page of the GIC platform showing the landing page.

### 02-login.png  
Login page where users authenticate with JWT tokens.
- Test credentials: maria.gonzalez@scouts.cl / scout123

### 03-dashboard.png
Main dashboard after login showing real-time statistics from the database.

### 04-personas.png
Personas management page displaying actual database records:
- 8 personas with complete information
- Real names, RUT numbers, addresses, and contact details
- All data fetched from `/api/personas/personas/`

### 05-proveedores.png
Proveedores (service providers) management page showing:
- Centro de Convenciones Scouts Chile S.A.
- Catering y Alimentación Scout Ltda.
- Librería y Materiales Didácticos Scouts
- Transporte y Logística Scouts S.A.
- All data fetched from `/api/proveedores/`

### 06-dashboard-home.png
Dashboard home with real-time statistics:
- Total Personas: 8
- Cursos Activos: 4
- Pagos Pendientes: (actual count from database)
- Inscripciones: 10

All counts are fetched live from the backend API via the `getDashboardStats()` function.

## Key Features Demonstrated

1. ✅ **No Mock Data**: All information comes from the database
2. ✅ **Real-time Updates**: Data fetched on component mount
3. ✅ **Loading States**: Skeleton UI while fetching data
4. ✅ **Authentication**: JWT tokens working correctly
5. ✅ **Well-formatted Data**: Proper Chilean conventions (names, addresses, RUT)
6. ✅ **Complete CRUD**: Create, Read, Update, Delete operations functional

## Date Captured
November 17, 2025

## System Status
- Backend: Django 5.2.7 + DRF running on port 8000
- Frontend: React 18 + Vite running on port 3000
- Database: SQLite with comprehensive seed data
- Authentication: JWT with session management
