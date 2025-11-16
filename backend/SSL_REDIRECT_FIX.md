# SSL Redirect Configuration Fix

## Problem

When trying to access the API at `http://localhost:8000/api/auth/login/`, users encountered a **HTTP 301 Moved Permanently** redirect to `https://localhost:8000/api/auth/login/`, which caused SSL errors because:

1. The development server doesn't have SSL certificates configured
2. Django's `SECURE_SSL_REDIRECT` setting was enabled by default in production mode
3. Users couldn't connect to the API during local development

## Solution

Made `SECURE_SSL_REDIRECT` configurable via environment variable with smart defaults:

### Changes Made

**1. settings.py**
```python
# Before
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    # ... other security settings

# After
SECURE_SSL_REDIRECT = config('SECURE_SSL_REDIRECT', default=not DEBUG, cast=bool)

if not DEBUG:
    SESSION_COOKIE_SECURE = True
    # ... other security settings (without SECURE_SSL_REDIRECT)
```

**2. .env.development**
Added explicit configuration:
```bash
SECURE_SSL_REDIRECT=False
```

**3. .env.example**
Added documentation:
```bash
# SSL/HTTPS Settings
# Set to False for local development without SSL certificates
# Set to True for production with proper SSL certificates
SECURE_SSL_REDIRECT=True
```

## Configuration Behavior

| Scenario | DEBUG | SECURE_SSL_REDIRECT (env) | Result | Use Case |
|----------|-------|---------------------------|--------|----------|
| Development (default) | True | Not set | False | Local development |
| Development (explicit) | True | False | False | Local development |
| Production (default) | False | Not set | True | Production with SSL |
| Production (override) | False | False | False | Load balancer handles SSL |
| Production (explicit) | False | True | True | Production with SSL |

## Testing

### Verify the fix is working:

```bash
# Start the development server
cd backend
cp .env.development .env
python manage.py runserver

# In another terminal, test the endpoint
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}' \
  -v
```

Expected result:
- ✅ HTTP 200 or 400 response (depending on credentials)
- ✅ No 301 redirect
- ✅ No Location header pointing to HTTPS

### Common Issues

**Issue**: Still getting 301 redirects
**Solution**: 
1. Make sure `.env` file exists with `SECURE_SSL_REDIRECT=False`
2. Restart the Django development server
3. Clear browser cache if testing in browser

**Issue**: Production site not redirecting to HTTPS
**Solution**:
1. Set `SECURE_SSL_REDIRECT=True` in production `.env`
2. Or ensure `DEBUG=False` without SECURE_SSL_REDIRECT set (defaults to True)

## Security Notes

- ✅ Production security is maintained (defaults to True when DEBUG=False)
- ✅ Can be explicitly overridden for special cases (e.g., SSL termination at load balancer)
- ✅ Development is simplified (no SSL certificate required locally)
- ✅ Documented in `.env.example` for clarity

## Setup for New Developers

```bash
# Clone the repository
git clone <repo-url>
cd backend

# Create .env file from development template
cp .env.development .env

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver

# Test the API (should work without SSL errors)
curl http://localhost:8000/api/auth/login/
```

## Related Files

- `backend/scout_project/settings.py` - Main configuration
- `backend/.env.development` - Development environment template
- `backend/.env.example` - Production environment template
- `backend/QUICK_START.md` - Quick start guide with .env setup
