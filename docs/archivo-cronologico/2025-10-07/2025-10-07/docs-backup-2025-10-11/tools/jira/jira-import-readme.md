# Jira import — Sprint 2

Este documento explica cómo importar `jira-import-sprint2.csv` a Jira y los campos usados.

1) Abrir Jira → Settings → System → External System Import → CSV
2) Subir `jira-import-sprint2.csv` (descargar del repo o copiar/pegar)
3) Mapear columnas del CSV a campos de Jira:
   - Summary -> Summary
   - Issue Type -> Issue Type (Epic, Story)
   - Description -> Description
   - Epic Link -> Para las Stories, mapear al Epic creado en import o enlazar luego.
   - Priority -> Priority
   - Labels -> Labels
   - Assignee -> Assignee (asegúrate que el usuario exista)
   - Reporter -> Reporter
   - Story Points -> Story Points
   - Components -> Components

Notas y recomendaciones:
- Antes de import, crear en Jira los Epics con los mismos títulos exactamente (por ejemplo: "Epic: Autenticación y Control de Roles") para que el campo "Epic Link" pueda resolverse automáticamente; alternativamente, puedes mapear epics después.
- Si tu Jira usa story point field con otro nombre, mapear correctamente.
- Asegúrate que los usuarios (Assignee) existan en Jira. Si no existen, deja el campo vacío y reasigna luego.
- Revisa la columna Labels para filtrar por `sprint2`, `backend`, `frontend`.

Asignaciones sugeridas por defecto (puedes editar en CSV):
- Grupo A: Nicolas Irribarra, Lucas Guerrero, Axel Villa
- Grupo B: Nicolas Gonzalez, Juan Herrera, Camilo Colivoro
- Grupo C: Giovanni Pacheco, Ricardo Sanhueza, Ricardo Henriquez
- Grupo H: Miguel Contreras, Juan Orrego, Leonardo Lopez
- Ingeniería: Marisol Saez, Lucas Betanzos, Rodrigo Jara, Josue Vasquez

---

Si quieres que también cree las issues directamente vía la API de Jira (necesitaría tu base URL y token con permisos), puedo hacerlo.