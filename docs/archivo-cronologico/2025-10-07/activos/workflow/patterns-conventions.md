# Patterns & Conventions — SGICS

Objetivo: pequeño manual para el uso de patrones solicitados (Singleton, Factory Method) y convenciones de código.

## Convenciones generales
- Frontend: usar camelCase en nombres de componentes, stores y utilidades JS/TS.
  - Component file: `CourseCard.vue` (PascalCase para componentes), store: `useAuthStore.ts` (camelCase for file name ok), functions: `fetchCourses()`.
- Backend (Python): usar snake_case para variables y functions; PascalCase para clases.
- Nombres de commits: `SGICS-<key>: brief description`.

## Singleton (ejemplo backend)
Archivo sugerido: `codigo/backend/utils/singleton.py`

Uso: para managers que deben tener una sola instancia en todo el proceso (ej: metricPublisher, externalAdapter).

Ejemplo en Python (breve):

```python
class SingletonMeta(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class MetricsPublisher(metaclass=SingletonMeta):
    def __init__(self, dsn):
        self.dsn = dsn
    def publish(self, metric):
        pass
```

## Factory Method (ejemplo backend)
Archivo sugerido: `codigo/backend/utils/factory.py`

Uso: crear adaptadores entre legacy endpoints y nuevo adaptador SQL.

Ejemplo (esquema):

```python
class BaseAdapter:
    def fetchPayments(self, **filters):
        raise NotImplementedError

class LegacyAdapter(BaseAdapter):
    def fetchPayments(self, **filters):
        # llama a /api/legacy/payments
        pass

class SqlAdapter(BaseAdapter):
    def fetchPayments(self, **filters):
        # consulta SQL directa
        pass

class AdapterFactory:
    @staticmethod
    def get_adapter(source: str) -> BaseAdapter:
        if source == 'legacy':
            return LegacyAdapter()
        return SqlAdapter()
```

## Frontend patterns (TS)
- Factory for API clients: `src/utils/apiFactory.ts` → crea cliente legacy/new.
- Singleton for auth store: Pinia store that persiste token y expone métodos `login`, `logout`, `refreshToken`.

## Testing conventions
- Backend: pytest + pytest-django. Tests en `codigo/backend/tests/` y `apps/*/tests.py`.
- Frontend: Vitest + Testing Library for Vue. Tests en `codigo/frontend/tests/`.
- CI debe ejecutar linters (ruff/flake8 en Python; eslint/Prettier para frontend).

## Naming conventions
- camelCase para JS export names, snake_case para Python.
- DB models: singular PascalCase (Course, Person, Preinscription).

## Ejemplos rápidos de uso
- Crear adapter: `adapter = AdapterFactory.get_adapter('legacy')`
- Obtener metrics publisher: `publisher = MetricsPublisher(settings.METRICS_DSN)`

---

Si quieres, creo los archivos de ejemplo `singleton.py` y `factory.py` en `codigo/backend/utils/` y `src/utils/apiFactory.ts` en frontend.