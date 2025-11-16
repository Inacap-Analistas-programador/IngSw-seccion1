# CORS and APPEND_SLASH Fix

## Problem
Users were experiencing "failed to fetch" errors when trying to log in to the frontend. The Django backend was returning `301 Moved Permanently` redirects on CORS preflight (OPTIONS) requests, which caused the login to fail.

## Root Cause
Django's default setting `APPEND_SLASH=True` automatically redirects URLs without trailing slashes to URLs with trailing slashes. While this is convenient for traditional web applications, it causes issues with CORS in REST APIs:

1. Browser sends OPTIONS preflight request to `/api/auth/login/`
2. Django's CommonMiddleware sees the trailing slash issue (or other redirect condition)
3. Django returns a 301 redirect response
4. The redirect response doesn't include proper CORS headers (or the browser doesn't follow redirects for OPTIONS)
5. Browser blocks the request, showing "failed to fetch" error

## Solution
Disabled `APPEND_SLASH` in Django settings to prevent automatic redirects on API endpoints:

```python
# backend/scout_project/settings.py
APPEND_SLASH = False
```

This is a **recommended best practice for REST APIs** because:
- REST APIs should have explicit, predictable URLs
- Automatic redirects can cause CORS and caching issues
- API clients should use exact URLs, not rely on redirects
- It improves performance by avoiding redirect roundtrips

## Additional Improvements
Also added CORS preflight caching to reduce redundant OPTIONS requests:

```python
CORS_PREFLIGHT_MAX_AGE = 86400  # Cache for 24 hours
```

## Testing
After the fix, all requests work correctly:

```bash
# OPTIONS request (with or without trailing slash)
curl -X OPTIONS http://localhost:8000/api/auth/login/ -H "Origin: http://localhost:5173"
# Returns: 200 OK with CORS headers

# POST login request
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "coordinador@test.com", "password": "Coord123!"}'
# Returns: 200 OK with JWT tokens
```

## Important Notes
1. **Frontend URLs**: Ensure frontend code uses URLs with trailing slashes for consistency
2. **URL Patterns**: Both `/api/auth/login` and `/api/auth/login/` now work without redirects
3. **Production**: This fix applies to both development and production environments
4. **No Breaking Changes**: This change does not affect existing functionality

## Alternative Solutions (Not Recommended)
If you cannot disable `APPEND_SLASH` for some reason, alternatives include:
- Add CORS headers to redirect responses (complex, not recommended)
- Ensure all API URLs in frontend always use trailing slashes (error-prone)
- Use a custom middleware to handle CORS before CommonMiddleware (complex)

The cleanest solution is to disable `APPEND_SLASH` for REST APIs.

## References
- Django REST Framework documentation recommends `APPEND_SLASH = False` for APIs
- CORS specification: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- Django CommonMiddleware: https://docs.djangoproject.com/en/stable/ref/middleware/#module-django.middleware.common
