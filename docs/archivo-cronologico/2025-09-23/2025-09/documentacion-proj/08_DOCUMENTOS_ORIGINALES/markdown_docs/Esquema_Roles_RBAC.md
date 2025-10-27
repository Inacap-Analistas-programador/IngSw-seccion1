# Esquema de Roles y Control de Acceso (RBAC)

## Introducción
Este documento describe el esquema de control de acceso basado en roles (RBAC) que se implementará en el sistema. El objetivo es definir claramente los roles de usuario y sus permisos asociados para garantizar la seguridad y la correcta gestión de las funcionalidades del sistema.

## Roles de Usuario

### 1. Administrador
- **Descripción**: Usuario con acceso completo al sistema. Puede gestionar usuarios, roles y configuraciones del sistema.
- **Permisos**:
  - Crear, editar y eliminar usuarios.
  - Asignar roles a los usuarios.
  - Acceder a todas las funcionalidades del sistema.

### 2. Coordinador
- **Descripción**: Usuario encargado de supervisar las inscripciones y gestionar los procesos relacionados.
- **Permisos**:
  - Ver y gestionar inscripciones.
  - Aprobar o rechazar solicitudes de preinscripción.
  - Acceder a reportes de actividad.

### 3. Validador de Grupo/Distrito
- **Descripción**: Usuario responsable de validar las inscripciones dentro de su grupo o distrito.
- **Permisos**:
  - Revisar y aprobar inscripciones.
  - Proporcionar comentarios sobre las solicitudes.
  - Acceder a información de los participantes.

### 4. Finanzas
- **Descripción**: Usuario encargado de gestionar los pagos y la contabilidad del sistema.
- **Permisos**:
  - Registrar pagos individuales.
  - Generar reportes financieros.
  - Acceder a la información de pagos pendientes y confirmados.

### 5. Participante
- **Descripción**: Usuario que se inscribe en el sistema para participar en los cursos o actividades.
- **Permisos**:
  - Crear y editar su propia preinscripción.
  - Subir documentos requeridos.
  - Consultar el estado de su inscripción.

## Implementación del RBAC
La implementación del esquema RBAC se llevará a cabo mediante un middleware que verificará los permisos de los usuarios en cada solicitud. Se utilizarán tokens JWT para autenticar a los usuarios y gestionar sus sesiones.

## Conclusión
El esquema de roles y control de acceso es fundamental para la seguridad del sistema y la correcta gestión de las funcionalidades. Se revisará y actualizará periódicamente para adaptarse a las necesidades del proyecto y garantizar un acceso adecuado a los usuarios.