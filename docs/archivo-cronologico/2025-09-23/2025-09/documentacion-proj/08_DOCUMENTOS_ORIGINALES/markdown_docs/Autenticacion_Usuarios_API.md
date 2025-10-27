# Autenticación de Usuarios API

## Introducción
Este documento describe los endpoints de la API para la autenticación de usuarios, incluyendo el registro, inicio de sesión y gestión de cuentas.

## Endpoints

### 1. Registro de Usuario
- **Método:** POST
- **URL:** `/api/auth/register`
- **Descripción:** Permite a un nuevo usuario registrarse en el sistema.
- **Cuerpo de la Solicitud:**
  ```json
  {
    "nombre": "string",
    "email": "string",
    "contraseña": "string"
  }
  ```
- **Respuesta Exitosa:**
  - **Código:** 201 Created
  - **Cuerpo:**
  ```json
  {
    "mensaje": "Usuario registrado exitosamente."
  }
  ```

### 2. Inicio de Sesión
- **Método:** POST
- **URL:** `/api/auth/login`
- **Descripción:** Permite a un usuario existente iniciar sesión.
- **Cuerpo de la Solicitud:**
  ```json
  {
    "email": "string",
    "contraseña": "string"
  }
  ```
- **Respuesta Exitosa:**
  - **Código:** 200 OK
  - **Cuerpo:**
  ```json
  {
    "token": "string",
    "mensaje": "Inicio de sesión exitoso."
  }
  ```

### 3. Recuperación de Contraseña
- **Método:** POST
- **URL:** `/api/auth/forgot-password`
- **Descripción:** Envía un correo electrónico para recuperar la contraseña.
- **Cuerpo de la Solicitud:**
  ```json
  {
    "email": "string"
  }
  ```
- **Respuesta Exitosa:**
  - **Código:** 200 OK
  - **Cuerpo:**
  ```json
  {
    "mensaje": "Instrucciones para recuperar la contraseña enviadas al correo."
  }
  ```

### 4. Verificación de Token
- **Método:** GET
- **URL:** `/api/auth/verify-token`
- **Descripción:** Verifica la validez del token JWT.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Respuesta Exitosa:**
  - **Código:** 200 OK
  - **Cuerpo:**
  ```json
  {
    "mensaje": "Token válido."
  }
  ```

## Consideraciones de Seguridad
- Todos los endpoints deben ser accesibles a través de HTTPS.
- Se debe implementar un mecanismo de bloqueo de cuenta tras múltiples intentos fallidos de inicio de sesión.
- Los tokens JWT deben tener una expiración adecuada y ser firmados para evitar su manipulación.

## Conclusión
Este documento proporciona una guía clara sobre cómo interactuar con la API de autenticación de usuarios, asegurando que se sigan las mejores prácticas de seguridad y usabilidad.