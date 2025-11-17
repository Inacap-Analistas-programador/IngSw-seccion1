# Backend Setup Guide - Quick Start

This guide will help you get the backend running with authentication working correctly.

## Prerequisites

- Python 3.12 or higher
- pip (Python package manager)

## Setup Steps

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Run Database Migrations

```bash
python manage.py migrate
```

This will create the SQLite database and all necessary tables.

### 3. Create Test Users

```bash
python manage.py create_test_users
```

This creates three test users:
- **admin@test.com** / Admin123! (Administrador)
- **coordinador@test.com** / Coord123! (Coordinador)
- **dirigente@test.com** / Dirig123! (Dirigente)

See `TEST_USERS.md` for more details.

### 4. Start the Development Server

```bash
python manage.py runserver 0.0.0.0:8000
```

The API will be available at http://localhost:8000

## API Endpoints

### Authentication

- **POST** `/api/auth/login/` - User login
- **POST** `/api/auth/logout/` - User logout  
- **GET** `/api/auth/me/` - Get current user info
- **GET** `/api/auth/csrf-token/` - Get CSRF token

### Other Endpoints

- **GET** `/api/personas/` - Personas management
- **GET** `/api/cursos/` - Cursos management
- **GET** `/api/maestros/` - Maestros data
- **GET** `/api/docs/` - Swagger API documentation

## Testing Authentication

### Using curl:

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "Admin123!"}'

# Get user info (replace TOKEN with the accessToken from login response)
curl -X GET http://localhost:8000/api/auth/me/ \
  -H "Authorization: Bearer TOKEN"
```

### Using the frontend:

The frontend can connect from:
- http://localhost:3000
- http://localhost:5173

CORS is already configured for these origins.

## Common Issues

### Issue: "No module named 'django'"
**Solution:** Run `pip install -r requirements.txt`

### Issue: "no such table: usuario"
**Solution:** Run `python manage.py migrate`

### Issue: Login returns 401 Unauthorized
**Solution:** Make sure you've created test users with `python manage.py create_test_users`

### Issue: "That port is already in use"
**Solution:** Stop the existing server with `Ctrl+C` or kill the process:
```bash
pkill -f "manage.py runserver"
```

## Environment Variables

The backend uses `.env` file for configuration. The development settings are already configured in `backend/.env`.

Key settings:
- `DJANGO_DEBUG=True` - Enable debug mode
- `CORS_ALLOW_ALL=True` - Allow all origins in development
- `DATABASE_URL=sqlite:///db.sqlite3` - Use SQLite for development

## Next Steps

1. Start the backend server
2. Start the frontend application
3. Navigate to the frontend URL
4. Login with one of the test user credentials
5. Start developing!

For more information, see the main README.md file.
