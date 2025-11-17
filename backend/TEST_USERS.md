# Test Users for Development

This file contains the credentials for test users created in the development database.

## Test User Credentials

| Username | Email | Password | Rol |
|----------|-------|----------|-----|
| admin_test | admin@test.com | Admin123! | Administrador |
| coordinador_test | coordinador@test.com | Coord123! | Coordinador |
| dirigente_test | dirigente@test.com | Dirig123! | Dirigente |

## How to Create Test Users

If you need to recreate the test users, run:

```bash
cd backend
python manage.py create_test_users
```

## Testing Authentication

### Login Example

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "Admin123!"}'
```

Response:
```json
{
  "success": true,
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "id": 1,
    "email": "admin@test.com",
    "name": "admin_test",
    "rol": "Administrador",
    "foto": null
  }
}
```

### Access Protected Endpoint

```bash
curl -X GET http://localhost:8000/api/auth/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Important Notes

⚠️ **These credentials are for development only!** Never use these in production.

- Passwords are properly hashed using Django's PBKDF2 password hasher
- JWT tokens expire after 15 minutes for security
- Rate limiting is enabled: maximum 5 login attempts per minute
- CORS is configured for localhost:3000 and localhost:5173
