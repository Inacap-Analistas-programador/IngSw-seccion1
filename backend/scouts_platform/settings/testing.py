from .base import *

# Settings for running tests locally.
# Use in-memory or SQLite database, disable password validators if needed, and speed up hashing.

DEBUG = False

# SQLite database for tests (file-based to allow migrations without special setup)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "test_db.sqlite3",
    }
}

# Faster password hashing for tests
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]

# Email backend that collects emails in memory during tests
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"

# Reduce logging noise during tests
LOGGING["handlers"]["console"]["level"] = "WARNING"
LOGGING["handlers"]["file"]["level"] = "WARNING"
