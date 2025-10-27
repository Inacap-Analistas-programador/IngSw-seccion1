# Git workflow quickstart

Este documento resume las reglas recomendadas de Git para el equipo SGICS: branch naming, commits, PRs, rebase/merge y checklist de PR.

## Branch naming

- `main` — rama protegida, siempre en estado desplegable.
- `develop` — rama de integración (opcional si el equipo la usa).
- `feature/<grupo>-<short-description>` — para nuevas features, ej: `feature/I-user-roles`.
- `fix/<issue-id>-<short>` — corrección de bugs.
- `hotfix/<short>` — arreglos urgentes en `main`.

## Commits

- Mensajes en inglés o español (consistencia) con formato:

  `type(scope): short summary` (max 72 chars)

  Ejemplos:

  - `feat(auth): add role assignment model`
  - `fix(payments): handle webhook retry`

- Tipos recomendados: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`.

## Flujo de trabajo (recommended)

1. Crea una rama desde `main`:

```bash
git checkout main
git pull origin main
git checkout -b feature/I-user-roles
```

2. Trabaja con commits pequeños y descriptivos.
3. Rebase interactivo antes de abrir PR (mantener historia limpia):

```bash
git fetch origin
git rebase origin/main
# resolver conflictos si los hay
```

4. Push y abrir PR:

```bash
git push -u origin feature/I-user-roles
```

En GitHub crea PR apuntando a `main` con descripción, lista de cambios y pasos para probar.

## Pull Request checklist (mínimo)

- Título y descripción claros.
- Asocia el issue/ticket correspondiente.
- Incluye pasos para probar localmente.
- Tests nuevos o actualizados.
- Linter/format paso (black/isort/flake8 para Python).
- 1+ reviewer aprobado.
- CI pasa en GitHub Actions.

## Merge

- Preferir `Squash and merge` para mantener `main` limpia de commits WIP, o `Rebase and merge` si se quiere mantener commits atómicos.
- No mergear sin aprobación.

## Recomendaciones operativas

- Pull frecuentemente de `main` para reducir conflictos.
- Mantener PRs pequeños (ideal < 500 LOC).
- Documentar cambios breaking en el cuerpo del PR.

## Comandos útiles

```bash
# Actualizar main local
git checkout main
git pull origin main

# Rebase tu rama sobre main
git checkout feature/my-branch
git fetch origin
git rebase origin/main

# Forzar push tras rebase (usar con cuidado)
git push --force-with-lease
```

## Plantilla rápida de PR

- Resumen breve (1-2 lineas)
- Issue relacionado: #123
- Cambios realizados:
  - feat: modelo X
  - fix: validación Y
- Cómo probar:
  1. Migrar: `python manage.py migrate`
  2. Correr tests: `pytest tests/path`

---