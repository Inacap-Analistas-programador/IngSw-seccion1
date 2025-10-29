# modelogestion

API simple para gestión de archivos.

Endpoints principales

- POST /api/files/upload/ — Subir archivo (multipart/form-data)
  - Campos: `file` (obligatorio), `filename` (opcional), `related_to` (opcional)
  - Retorna: objeto File creado (JSON)

- GET /api/files/ — Listar archivos (requires authentication)

- GET /api/files/{id}/download/ — Descargar archivo como attachment

Ejemplo de subida con curl:

```bash
curl -u USER:PASSWORD -X POST "http://localhost:8000/api/files/upload/" \
  -F "file=@/path/to/file.pdf" \
  -F "related_to=invoice-123"
```

Ejemplo de listado:

```bash
curl -u USER:PASSWORD "http://localhost:8000/api/files/"
```

Notas
- El proyecto viene con almacenamiento local en `/media/` por defecto. Para usar S3 configura las variables de entorno `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_STORAGE_BUCKET_NAME`.
