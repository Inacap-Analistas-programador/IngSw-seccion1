# ERD Modelo de Datos

## Entidades

### Users
- **user_id**: INT, PK
- **username**: VARCHAR(50), UNIQUE
- **password_hash**: VARCHAR(255)
- **email**: VARCHAR(100), UNIQUE
- **created_at**: DATETIME
- **updated_at**: DATETIME

### Personas
- **persona_id**: INT, PK
- **nombre**: VARCHAR(100)
- **apellido**: VARCHAR(100)
- **fecha_nacimiento**: DATE
- **user_id**: INT, FK (Users)

### Preinscripciones
- **preinscripcion_id**: INT, PK
- **persona_id**: INT, FK (Personas)
- **curso_id**: INT, FK (Cursos)
- **estado**: ENUM('Pendiente', 'Confirmado', 'Rechazado')
- **fecha_creacion**: DATETIME
- **fecha_actualizacion**: DATETIME

### Pagos
- **pago_id**: INT, PK
- **preinscripcion_id**: INT, FK (Preinscripciones)
- **monto**: DECIMAL(10, 2)
- **fecha_pago**: DATETIME
- **metodo_pago**: ENUM('Tarjeta', 'Transferencia', 'Efectivo')

### Group_Payment_Batches
- **batch_id**: INT, PK
- **fecha_creacion**: DATETIME
- **estado**: ENUM('Pendiente', 'Procesado')

### Archivos
- **archivo_id**: INT, PK
- **preinscripcion_id**: INT, FK (Preinscripciones)
- **nombre_archivo**: VARCHAR(255)
- **tipo_archivo**: VARCHAR(50)
- **fecha_subida**: DATETIME

### Audit_Logs
- **log_id**: INT, PK
- **accion**: VARCHAR(255)
- **usuario_id**: INT, FK (Users)
- **fecha**: DATETIME

### Communication_Logs
- **comunicacion_id**: INT, PK
- **tipo**: ENUM('Email', 'SMS')
- **contenido**: TEXT
- **fecha_envio**: DATETIME

## Relaciones
- Un **User** puede tener múltiples **Personas**.
- Una **Persona** puede tener múltiples **Preinscripciones**.
- Una **Preinscripcion** puede tener múltiples **Pagos**.
- Un **Batch de Pagos** puede incluir múltiples **Pagos**.
- Una **Preinscripcion** puede tener múltiples **Archivos**.
- Un **User** puede generar múltiples **Audit Logs**.
- Las **Comunicaciones** pueden ser enviadas a múltiples **Users**.

## Notas
- Asegurarse de que las relaciones de clave foránea estén correctamente implementadas en la base de datos.
- Considerar la normalización de datos para evitar redundancias.