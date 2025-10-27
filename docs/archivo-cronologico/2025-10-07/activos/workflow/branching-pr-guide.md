# Branching & PR Guide — SGICS

Objetivo: Establecer una convención simple para que los 6 equipos trabajen simultáneamente sin bloquearse.

## Branches
- main: rama de producción estable.
- develop: integración de sprint (staging). Todos los merges que pasan QA llegan aquí.
- team/<grupo>-sprint2: rama de integración por equipo (ej: `team/grupoA-sprint2`).
- feature/SGICS-<key>-<shortCamelCase>: ramas de trabajo para cada historia. Ej: `feature/SGICS-401-preinscriptionWizard`.
- hotfix/<short>: correcciones puntuales a `main`.

## Convenciones
- Usa camelCase para nombres de carpetas y archivos de frontend (componentes), stores y funciones JS.
- En Python sigue snake_case para funciones y variables.

## Flujo recomendado
1. Crear branch `feature/SGICS-xxx-...` a partir de `develop`.
2. Push a remote y abrir PR targeting `team/<grupo>-sprint2`.
3. Revisión peer; CI debe pasar. Merge a `team/<grupo>-sprint2` cuando green.
4. Cada 2-3 días el team abre PR `team/<grupo>-sprint2 -> develop` para integración.
5. QA prueba en entorno `develop`; arreglos en hotfix o nuevas features.
6. Cuando sprint listo, merge `develop` -> `main` con tag `vX.Y.Z`.

## Pull Request Template
- Usar `.github/PULL_REQUEST_TEMPLATE.md` y remplazar el header con el ticket Jira.
- Checklist mínima (ver template): tests, Jira, migrations, docs.

## Revisión y aprobaciones
- Mínimo 1 revisor externo al equipo para asegurar calidad cruzada.
- CI: tests + lint + coverage required. Si un PR baja la cobertura en >2% se requiere justificación.

## Ejemplo rápido
- `git checkout -b feature/SGICS-401-preinscriptionWizard develop`
- `git push -u origin feature/SGICS-401-preinscriptionWizard`
- Abrir PR -> `team/grupoH-sprint2`

## Integración con Jira
- Nombres de branches deben contener la key Jira para trazabilidad.
- PR titles must include the same key.

## Hooks y reglas opcionales (setup en repo)
- Branch protection rules: require PR, require status checks (CI), require 1 approval.
- Auto-merge disabled; team lead merges release PRs.

---
Preguntas frecuentes:
- "¿Puedo hacer PR directo a develop?" — Sólo si cambio menor y aprobado por team lead.
- "¿Quién resuelve conflictos?" — El autor del PR debe resolver conflictos y volver a ejecutar CI.