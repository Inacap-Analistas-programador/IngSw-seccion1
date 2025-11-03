# Django 5.2.7 + Debug Toolbar + optimizaciones de consultas

## Resumen
- Validación/actualización a Django 5.2.7 (última estable a 2025-11-03).
- Nuevo settings de testing (`scouts_platform/settings/testing.py`) con SQLite, hashing rápido y logging reducido.
- Modo desarrollo más robusto:
  - Fallback a SQLite si faltan variables `DB_*` (evita errores de `decouple`).
  - Integración de `django-debug-toolbar` y logging SQL (consultas/tiempos) para auditoría.
- Optimización de consultas en `payments` y `personas` con `select_related` para evitar N+1.
- Calidad de código: manejo de excepciones más preciso y sin `except` vacíos.
- README actualizado con informe de actualización y guía de auditoría de consultas.

## Detalle de cambios
- backend/scouts_platform/settings/testing.py
  - Nuevo archivo para pruebas (SQLite, `MD5PasswordHasher`, email en memoria, menos ruido de logs).
- backend/scouts_platform/settings/development.py
  - Fallback a SQLite si no hay `DB_NAME`.
  - `INSTALLED_APPS += ['debug_toolbar']`, `DebugToolbarMiddleware`, `INTERNAL_IPS`.
  - Logger `django.db.backends` a `DEBUG` para ver consultas y tiempos.
- backend/scouts_platform/urls.py
  - Rutas condicionales para `__debug__/` cuando `DEBUG=True`.
  - `except ImportError` en lugar de `except Exception`.
- backend/payments/views.py y backend/personas/views.py
  - `select_related()` en FKs para reducir N+1.
- backend/conftest.py
  - Reemplazo de `except` vacíos por advertencias específicas.
- backend/pytest.ini
  - Cobertura ajustada a paquetes reales y exclusión de `_tests_disabled/`.
- README.md
  - Informe de actualización y guía de Debug Toolbar y auditoría de consultas.

## Motivación
- Mejorar tiempos de respuesta y observabilidad en desarrollo.
- Reducir N+1 al serializar relaciones frecuentes.
- Evitar bloqueos por configuración DB ausente en entornos locales.
- Cumplir con reglas de calidad (SonarQube) respecto a manejo de excepciones.

## Notas
- La suite de tests funcionales existente está en `_tests_disabled/`. Se recomienda reactivarla gradualmente.
- Si se usa MySQL en desarrollo, definir `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` en `backend/.env`.

## Checklist
- [x] `python manage.py check` sin errores.
- [x] `manage.py migrate` OK en SQLite.
- [x] Debug Toolbar visible en `__debug__/` con `DEBUG=True`.
- [x] Sonar: sin `except` vacíos y sin `except` demasiado amplios.

## Screenshots / Evidencia (opcional)
- N/A