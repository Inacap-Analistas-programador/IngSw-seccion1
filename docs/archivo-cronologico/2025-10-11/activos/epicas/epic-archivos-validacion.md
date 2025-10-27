# Epic: Archivos y Validación (SGICS-E-FILES)

**Vencimiento**: 2025-10-18 | **Estado**: To Do | **Puntos**: 5

## Objetivo
Subida segura archivos + validación automática documentos (fichas médicas, autorizaciones)

## Alcance
### ✅ Debe tener:
- `POST /api/files/upload/` (validación tipo/tamaño)
- Asociación archivos → preinscripciones
- Validación automática formatos permitidos
- Storage seguro + control acceso

### ⚠️ Fuera del alcance:  
- OCR/procesamiento contenido
- Firma digital
- Versionado archivos

**Prioridad**: Media | **Riesgo**: Alto (seguridad)

## Historias
| Key | Título | Assignee | Puntos | Estado |
|---|---|---:|---:|---:|
| SGICS-301 | API subida archivos segura | Grupo C | 3 | To Do |
| SGICS-302 | Validación automática formatos | Grupo C | 2 | To Do |

## SGICS-301 — Subida Segura
- `POST /api/files/upload/` → validar extensión/tamaño
- Storage aislado + URLs firmadas
- Asociación `file_id` → `preinscription_id`
- Antivirus básico opcional

## SGICS-302 — Validación Formatos  
- Whitelist: PDF, JPG, PNG (fichas médicas)
- Límite tamaño: 5MB por archivo
- Metadatos: nombre original, timestamp, usuario

## DoD
✅ Upload endpoint + validaciones  
✅ Storage seguro + tests  
✅ Asociación preinscripciones  

## Testing
```bash
pytest tests/files/
```