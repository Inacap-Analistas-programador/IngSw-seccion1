<!-- Pull Request template for SGICS -->

## Resumen breve

Describa en 1-2 líneas el objetivo del PR.

## Issue relacionado

Vincular el issue/ticket: e.g. `Closes #123` o `Related to #123`.

## Cambios realizados

- feat: breve descripción
- fix: breve descripción (si aplica)

## Cómo probar (pasos locales)

1. Actualizar rama: `git fetch origin && git rebase origin/main`
2. Migrar: `python manage.py migrate`
3. Ejecutar pruebas relevantes: `pytest tests/path`
4. (Opcional) Correr servidor: `python manage.py runserver`

## Checklist

- [ ] Código formateado (black/isort)
- [ ] Tests añadidos o actualizados
- [ ] Linter pasado (flake8)
- [ ] 1+ reviewer asignado
- [ ] CI pasa en GitHub Actions

