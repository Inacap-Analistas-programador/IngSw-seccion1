# API CRUD Preinscripciones

## Introducción
Este documento describe la API para gestionar los datos de preinscripciones, incluyendo las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) y el registro de auditoría.

## Endpoints

### 1. Crear Preinscripción
- **Método:** POST
- **Endpoint:** `/api/preinscripciones`
- **Descripción:** Crea una nueva preinscripción.
- **Cuerpo de la solicitud:**
  ```json
  {
    "nombre": "string",
    "apellido": "string",
    "email": "string",
    "telefono": "string",
    "curso": "string",
    "fecha_nacimiento": "date"
  }
  ```
- **Respuesta:**
  - **Código 201:** Preinscripción creada exitosamente.
  - **Código 400:** Datos inválidos.

### 2. Leer Preinscripción
- **Método:** GET
- **Endpoint:** `/api/preinscripciones/{id}`
- **Descripción:** Obtiene los detalles de una preinscripción específica.
- **Respuesta:**
  - **Código 200:** Detalles de la preinscripción.
  - **Código 404:** Preinscripción no encontrada.

### 3. Actualizar Preinscripción
- **Método:** PUT
- **Endpoint:** `/api/preinscripciones/{id}`
- **Descripción:** Actualiza los datos de una preinscripción existente.
- **Cuerpo de la solicitud:**
  ```json
  {
    "nombre": "string",
    "apellido": "string",
    "email": "string",
    "telefono": "string",
    "curso": "string",
    "fecha_nacimiento": "date"
  }
  ```
- **Respuesta:**
  - **Código 200:** Preinscripción actualizada exitosamente.
  - **Código 400:** Datos inválidos.
  - **Código 404:** Preinscripción no encontrada.

### 4. Eliminar Preinscripción
- **Método:** DELETE
- **Endpoint:** `/api/preinscripciones/{id}`
- **Descripción:** Elimina una preinscripción existente.
- **Respuesta:**
  - **Código 204:** Preinscripción eliminada exitosamente.
  - **Código 404:** Preinscripción no encontrada.

## Auditoría
Cada operación CRUD debe registrar una entrada en el log de auditoría (`audit_logs`) con la siguiente información:
- ID de la preinscripción
- Tipo de operación (Crear, Leer, Actualizar, Eliminar)
- Timestamp
- Usuario que realizó la operación

## Consideraciones de Seguridad
- Se debe implementar autenticación y autorización para acceder a los endpoints de la API.
- Validar todos los datos de entrada para prevenir inyecciones y otros ataques.

## Conclusión
Esta API proporciona las funcionalidades necesarias para gestionar las preinscripciones de manera eficiente y segura, asegurando que todas las operaciones sean registradas para auditoría y cumplimiento.