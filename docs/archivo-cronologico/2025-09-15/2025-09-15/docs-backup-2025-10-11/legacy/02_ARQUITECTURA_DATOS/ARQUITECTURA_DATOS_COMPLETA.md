# Arquitectura de Datos Completa - Sistema Scout

## 🏗️ Visión General de la Arquitectura

### Arquitectura de 4 Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                     │
│  Frontend Web + Mobile + APIs REST                         │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE APLICACIÓN                       │
│  Django Apps + Business Logic + Validation                 │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                            │
│  PostgreSQL + Redis + File Storage                         │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE INFRAESTRUCTURA                  │
│  Docker + CI/CD + Monitoring + Backup                      │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Modelo de Datos Detallado

### 1. Entidades Core del Sistema

#### 1.1 Gestión de Usuarios

```sql
-- Tabla principal de usuarios
CREATE TABLE app_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    is_superuser BOOLEAN DEFAULT FALSE,
    date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles del sistema
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '{}',
    is_system_role BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asignación de roles a usuarios
CREATE TABLE user_role (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES app_user(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES role(id) ON DELETE CASCADE,
    assigned_by INTEGER REFERENCES app_user(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, role_id)
);

-- Permisos específicos
CREATE TABLE permission (
    id SERIAL PRIMARY KEY,
    codename VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100),
    description TEXT
);
```

#### 1.2 Gestión de Cursos

```sql
-- Cursos principales
CREATE TABLE curso (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo_curso VARCHAR(50) NOT NULL, -- medio, basico, avanzado
    zona VARCHAR(100) NOT NULL,
    lugar VARCHAR(200),
    direccion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    fecha_inscripcion_inicio DATE,
    fecha_inscripcion_fin DATE,
    capacidad_total INTEGER NOT NULL,
    capacidad_reservada INTEGER DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'planificado',
    configuracion JSONB DEFAULT '{}',
    costo_base DECIMAL(10,2) DEFAULT 0,
    notas TEXT,
    created_by INTEGER REFERENCES app_user(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_fechas CHECK (fecha_fin >= fecha_inicio),
    CONSTRAINT check_capacidad CHECK (capacidad_total > 0)
);

-- Configuración de cupos por rama/rol
CREATE TABLE cupo_configuracion (
    id SERIAL PRIMARY KEY,
    curso_id INTEGER REFERENCES curso(id) ON DELETE CASCADE,
    rol VARCHAR(50) NOT NULL,
    rama VARCHAR(50) NOT NULL,
    cupo_total INTEGER NOT NULL,
    cupo_usado INTEGER DEFAULT 0,
    cupo_reservado INTEGER DEFAULT 0,
    precio DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(curso_id, rol, rama),
    CONSTRAINT check_cupo_positivo CHECK (cupo_total > 0)
);

-- Materiales del curso
CREATE TABLE material (
    id SERIAL PRIMARY KEY,
    curso_id INTEGER REFERENCES curso(id) ON DELETE CASCADE,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    cantidad_necesaria INTEGER NOT NULL,
    cantidad_stock INTEGER DEFAULT 0,
    unidad VARCHAR(20) DEFAULT 'unidad',
    proveedor VARCHAR(200),
    costo_estimado DECIMAL(10,2),
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha_requerida DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Presupuesto del curso
CREATE TABLE presupuesto_linea (
    id SERIAL PRIMARY KEY,
    curso_id INTEGER REFERENCES curso(id) ON DELETE CASCADE,
    codigo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    categoria VARCHAR(100),
    monto_presupuestado DECIMAL(10,2) NOT NULL,
    monto_ejecutado DECIMAL(10,2) DEFAULT 0,
    monto_comprometido DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(curso_id, codigo)
);
```

#### 1.3 Gestión de Personas

```sql
-- Personas (participantes, formadores, etc.)
CREATE TABLE persona (
    id SERIAL PRIMARY KEY,
    rut VARCHAR(12) UNIQUE NOT NULL,
    dv CHAR(1) NOT NULL,
    nombre_completo VARCHAR(200) NOT NULL,
    primer_nombre VARCHAR(100),
    segundo_nombre VARCHAR(100),
    apellido_paterno VARCHAR(100),
    apellido_materno VARCHAR(100),
    fecha_nacimiento DATE NOT NULL,
    sexo VARCHAR(10) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(254),
    direccion TEXT,
    comuna VARCHAR(100),
    region VARCHAR(100),
    codigo_postal VARCHAR(10),
    zona VARCHAR(100),
    distrito VARCHAR(100),
    grupo VARCHAR(100),
    rol_persona VARCHAR(50),
    rama VARCHAR(50),
    alimentacion_tipo VARCHAR(50) DEFAULT 'normal',
    alergias TEXT,
    limitacion_fisica TEXT,
    contacto_emergencia_nombre VARCHAR(200),
    contacto_emergencia_telefono VARCHAR(20),
    contacto_emergencia_relacion VARCHAR(50),
    observaciones TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_edad_minima CHECK (fecha_nacimiento <= CURRENT_DATE - INTERVAL '5 years')
);

-- Vehículos de participantes
CREATE TABLE vehiculo (
    id SERIAL PRIMARY KEY,
    persona_id INTEGER REFERENCES persona(id) ON DELETE CASCADE,
    patente VARCHAR(10) NOT NULL,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    anio INTEGER,
    color VARCHAR(30),
    capacidad_pasajeros INTEGER,
    tipo_vehiculo VARCHAR(50), -- auto, camioneta, bus, etc.
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documentos de personas
CREATE TABLE persona_documento (
    id SERIAL PRIMARY KEY,
    persona_id INTEGER REFERENCES persona(id) ON DELETE CASCADE,
    inscripcion_id INTEGER REFERENCES inscripcion(id) ON DELETE CASCADE,
    tipo_documento VARCHAR(50) NOT NULL,
    numero VARCHAR(100),
    archivo_path VARCHAR(500) NOT NULL,
    archivo_nombre VARCHAR(255),
    archivo_tipo VARCHAR(100),
    archivo_tamaño INTEGER,
    hash_archivo VARCHAR(64),
    estado_validacion VARCHAR(20) DEFAULT 'pendiente',
    validado_por INTEGER REFERENCES app_user(id),
    validado_fecha TIMESTAMP,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.4 Gestión de Inscripciones

```sql
-- Inscripciones principales
CREATE TABLE inscripcion (
    id SERIAL PRIMARY KEY,
    codigo_inscripcion VARCHAR(50) UNIQUE NOT NULL,
    persona_id INTEGER REFERENCES persona(id) ON DELETE CASCADE,
    curso_id INTEGER REFERENCES curso(id) ON DELETE CASCADE,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'borrador',
    rama VARCHAR(50),
    grupo_asignado VARCHAR(100),
    cuota_asignada VARCHAR(50),
    habilitado_por INTEGER REFERENCES app_user(id),
    habilitado_fecha TIMESTAMP,
    confirmado_por_pago_id INTEGER,
    en_lista_espera BOOLEAN DEFAULT FALSE,
    posicion_lista_espera INTEGER,
    fecha_lista_espera TIMESTAMP,
    observaciones TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(persona_id, curso_id)
);

-- Estados de inscripción
CREATE TABLE estado_inscripcion (
    codigo VARCHAR(20) PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    es_final BOOLEAN DEFAULT FALSE,
    orden INTEGER,
    color VARCHAR(7), -- Color para UI
    icono VARCHAR(50) -- Icono para UI
);

-- Log de cambios de estado
CREATE TABLE inscripcion_estado_log (
    id SERIAL PRIMARY KEY,
    inscripcion_id INTEGER REFERENCES inscripcion(id) ON DELETE CASCADE,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cambiado_por INTEGER REFERENCES app_user(id),
    comentarios TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Cuotas de pago
CREATE TABLE cuota (
    id SERIAL PRIMARY KEY,
    inscripcion_id INTEGER REFERENCES inscripcion(id) ON DELETE CASCADE,
    numero VARCHAR(10) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_vencimiento DATE,
    estado VARCHAR(20) DEFAULT 'pendiente',
    pago_id INTEGER REFERENCES pago(id),
    fecha_pago TIMESTAMP,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(inscripcion_id, numero)
);
```

#### 1.5 Gestión de Pagos

```sql
-- Lotes de pagos (importaciones)
CREATE TABLE pago_batch (
    id SERIAL PRIMARY KEY,
    referencia VARCHAR(100) UNIQUE NOT NULL,
    archivo_origen VARCHAR(255),
    total_filas INTEGER,
    filas_procesadas INTEGER DEFAULT 0,
    filas_con_error INTEGER DEFAULT 0,
    filas_omitidas INTEGER DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'procesando',
    errores JSONB DEFAULT '[]',
    warnings JSONB DEFAULT '[]',
    creado_por INTEGER REFERENCES app_user(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_procesamiento TIMESTAMP,
    fecha_finalizacion TIMESTAMP
);

-- Pagos individuales
CREATE TABLE pago (
    id SERIAL PRIMARY KEY,
    codigo_pago VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    subtipo VARCHAR(50),
    fecha DATE NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'pendiente',
    persona_id INTEGER REFERENCES persona(id),
    curso_id INTEGER REFERENCES curso(id),
    inscripcion_id INTEGER REFERENCES inscripcion(id),
    presupuesto_linea_id INTEGER REFERENCES presupuesto_linea(id),
    pago_batch_id INTEGER REFERENCES pago_batch(id),
    referencia_bancaria VARCHAR(100),
    observaciones TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comprobantes de pago
CREATE TABLE comprobante (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    fecha_emision DATE NOT NULL,
    emisor VARCHAR(200) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    estado_validacion VARCHAR(20) DEFAULT 'pendiente',
    archivo_path VARCHAR(500),
    pago_id INTEGER REFERENCES pago(id) ON DELETE CASCADE,
    validado_por INTEGER REFERENCES app_user(id),
    validado_fecha TIMESTAMP,
    observaciones TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.6 Sistema de Acreditación

```sql
-- Acreditaciones
CREATE TABLE acreditacion (
    id SERIAL PRIMARY KEY,
    inscripcion_id INTEGER REFERENCES inscripcion(id) ON DELETE CASCADE,
    codigo_qr VARCHAR(255) UNIQUE NOT NULL,
    codigo_barras VARCHAR(100),
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_acreditacion TIMESTAMP,
    acreditado_por INTEGER REFERENCES app_user(id),
    estado VARCHAR(20) DEFAULT 'generado',
    observaciones TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Log de acreditaciones
CREATE TABLE acreditacion_log (
    id SERIAL PRIMARY KEY,
    acreditacion_id INTEGER REFERENCES acreditacion(id) ON DELETE CASCADE,
    accion VARCHAR(50) NOT NULL, -- generado, escaneado, usado, etc.
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INTEGER REFERENCES app_user(id),
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'
);
```

#### 1.7 Sistema de Comunicación

```sql
-- Log de comunicaciones
CREATE TABLE comunicacion_log (
    id SERIAL PRIMARY KEY,
    persona_id INTEGER REFERENCES persona(id),
    inscripcion_id INTEGER REFERENCES inscripcion(id),
    tipo VARCHAR(50) NOT NULL,
    asunto VARCHAR(200),
    contenido TEXT,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_programada TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'pendiente',
    enviado_por INTEGER REFERENCES app_user(id),
    destinatarios JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    respuesta TEXT,
    intentos INTEGER DEFAULT 0,
    max_intentos INTEGER DEFAULT 3
);

-- Templates de comunicación
CREATE TABLE comunicacion_template (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    asunto VARCHAR(200),
    contenido TEXT NOT NULL,
    variables JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.8 Sistema de Auditoría

```sql
-- Log de auditoría
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES app_user(id),
    entidad VARCHAR(100) NOT NULL,
    entidad_id INTEGER,
    accion VARCHAR(50) NOT NULL,
    detalle JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exportaciones
CREATE TABLE export_log (
    id SERIAL PRIMARY KEY,
    tipo_export VARCHAR(50) NOT NULL,
    filtros_json JSONB DEFAULT '{}',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creado_por INTEGER REFERENCES app_user(id),
    archivo_path VARCHAR(500),
    estado VARCHAR(20) DEFAULT 'procesando',
    total_registros INTEGER,
    registros_exportados INTEGER,
    errores JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}'
);
```

### 2. Índices de Optimización

```sql
-- Índices para consultas frecuentes
CREATE INDEX idx_persona_rut ON persona(rut);
CREATE INDEX idx_persona_email ON persona(email);
CREATE INDEX idx_persona_zona_distrito ON persona(zona, distrito);
CREATE INDEX idx_inscripcion_persona_curso ON inscripcion(persona_id, curso_id);
CREATE INDEX idx_inscripcion_estado ON inscripcion(estado);
CREATE INDEX idx_inscripcion_curso ON inscripcion(curso_id);
CREATE INDEX idx_inscripcion_fecha ON inscripcion(fecha_inscripcion);
CREATE INDEX idx_pago_persona ON pago(persona_id);
CREATE INDEX idx_pago_inscripcion ON pago(inscripcion_id);
CREATE INDEX idx_pago_estado ON pago(estado);
CREATE INDEX idx_pago_fecha ON pago(fecha);
CREATE INDEX idx_audit_log_entidad ON audit_log(entidad, entidad_id);
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_comunicacion_log_fecha ON comunicacion_log(fecha_envio);
CREATE INDEX idx_comunicacion_log_estado ON comunicacion_log(estado);
CREATE INDEX idx_acreditacion_codigo_qr ON acreditacion(codigo_qr);
CREATE INDEX idx_acreditacion_estado ON acreditacion(estado);

-- Índices compuestos para consultas complejas
CREATE INDEX idx_inscripcion_curso_estado ON inscripcion(curso_id, estado);
CREATE INDEX idx_pago_curso_estado ON pago(curso_id, estado);
CREATE INDEX idx_persona_zona_grupo ON persona(zona, distrito, grupo);
CREATE INDEX idx_audit_log_user_timestamp ON audit_log(user_id, timestamp);
```

### 3. Triggers y Funciones

```sql
-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para generar códigos únicos
CREATE OR REPLACE FUNCTION generate_unique_code(prefix TEXT, table_name TEXT, column_name TEXT)
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    counter INTEGER := 1;
BEGIN
    LOOP
        new_code := prefix || '-' || LPAD(counter::TEXT, 6, '0');
        EXECUTE format('SELECT 1 FROM %I WHERE %I = %L', table_name, column_name, new_code);
        IF NOT FOUND THEN
            RETURN new_code;
        END IF;
        counter := counter + 1;
    END LOOP;
END;
$$ language 'plpgsql';

-- Función para log de cambios de estado
CREATE OR REPLACE FUNCTION log_inscripcion_state_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.estado != NEW.estado THEN
        INSERT INTO inscripcion_estado_log (inscripcion_id, estado_anterior, estado_nuevo, cambiado_por, comentarios)
        VALUES (NEW.id, OLD.estado, NEW.estado, NEW.habilitado_por, 'Cambio automático de estado');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para actualizar cupos
CREATE OR REPLACE FUNCTION update_cupo_usado()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.estado = 'cupo_asignado' THEN
        UPDATE cupo_configuracion
        SET cupo_usado = cupo_usado + 1
        WHERE curso_id = NEW.curso_id AND rama = NEW.rama;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.estado != 'cupo_asignado' AND NEW.estado = 'cupo_asignado' THEN
            UPDATE cupo_configuracion
            SET cupo_usado = cupo_usado + 1
            WHERE curso_id = NEW.curso_id AND rama = NEW.rama;
        ELSIF OLD.estado = 'cupo_asignado' AND NEW.estado != 'cupo_asignado' THEN
            UPDATE cupo_configuracion
            SET cupo_usado = cupo_usado - 1
            WHERE curso_id = NEW.curso_id AND rama = NEW.rama;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.estado = 'cupo_asignado' THEN
        UPDATE cupo_configuracion
        SET cupo_usado = cupo_usado - 1
        WHERE curso_id = OLD.curso_id AND rama = OLD.rama;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_persona_updated_at BEFORE UPDATE ON persona
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inscripcion_updated_at BEFORE UPDATE ON inscripcion
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pago_updated_at BEFORE UPDATE ON pago
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER log_inscripcion_state_change_trigger
    AFTER UPDATE ON inscripcion
    FOR EACH ROW EXECUTE FUNCTION log_inscripcion_state_change();

CREATE TRIGGER update_cupo_usado_trigger
    AFTER INSERT OR UPDATE OR DELETE ON inscripcion
    FOR EACH ROW EXECUTE FUNCTION update_cupo_usado();
```

### 4. Vistas para Reportes

```sql
-- Vista de inscripciones con información completa
CREATE VIEW vista_inscripciones_completas AS
SELECT
    i.id,
    i.codigo_inscripcion,
    p.rut,
    p.nombre_completo,
    p.email,
    p.telefono,
    p.zona,
    p.distrito,
    p.grupo,
    p.rama,
    c.nombre as curso_nombre,
    c.fecha_inicio,
    c.fecha_fin,
    i.estado,
    i.fecha_inscripcion,
    i.en_lista_espera,
    i.posicion_lista_espera
FROM inscripcion i
JOIN persona p ON i.persona_id = p.id
JOIN curso c ON i.curso_id = c.id;

-- Vista de pagos con información completa
CREATE VIEW vista_pagos_completos AS
SELECT
    p.id,
    p.codigo_pago,
    p.fecha,
    p.monto,
    p.estado,
    per.nombre_completo,
    per.rut,
    c.nombre as curso_nombre,
    i.codigo_inscripcion
FROM pago p
JOIN persona per ON p.persona_id = per.id
JOIN curso c ON p.curso_id = c.id
LEFT JOIN inscripcion i ON p.inscripcion_id = i.id;

-- Vista de estadísticas por curso
CREATE VIEW vista_estadisticas_curso AS
SELECT
    c.id,
    c.nombre,
    c.fecha_inicio,
    c.fecha_fin,
    c.capacidad_total,
    COUNT(i.id) as total_inscripciones,
    COUNT(CASE WHEN i.estado = 'cupo_asignado' THEN 1 END) as inscripciones_confirmadas,
    COUNT(CASE WHEN i.en_lista_espera = true THEN 1 END) as en_lista_espera,
    SUM(CASE WHEN p.estado = 'confirmado' THEN p.monto ELSE 0 END) as total_recaudado
FROM curso c
LEFT JOIN inscripcion i ON c.id = i.curso_id
LEFT JOIN pago p ON i.id = p.inscripcion_id
GROUP BY c.id, c.nombre, c.fecha_inicio, c.fecha_fin, c.capacidad_total;
```

### 5. Configuración de Base de Datos

#### 5.1 Configuración PostgreSQL

```sql
-- Configuraciones de rendimiento
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;

-- Configuraciones de logging
ALTER SYSTEM SET log_statement = 'mod';
ALTER SYSTEM SET log_min_duration_statement = 1000;
ALTER SYSTEM SET log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h ';

-- Configuraciones de seguridad
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET password_encryption = scram-sha-256;
```

#### 5.2 Configuración Redis

```yaml
# redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### 6. Estrategia de Backup

```bash
#!/bin/bash
# backup_database.sh

# Configuración
DB_NAME="scout_system"
DB_USER="scout_user"
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup completo
pg_dump -h localhost -U $DB_USER -d $DB_NAME \
    --format=custom \
    --compress=9 \
    --file="$BACKUP_DIR/scout_system_$DATE.backup"

# Backup solo datos
pg_dump -h localhost -U $DB_USER -d $DB_NAME \
    --data-only \
    --format=custom \
    --compress=9 \
    --file="$BACKUP_DIR/scout_system_data_$DATE.backup"

# Limpiar backups antiguos (más de 30 días)
find $BACKUP_DIR -name "*.backup" -mtime +30 -delete
```

### 7. Monitoreo y Métricas

```sql
-- Consultas para monitoreo
-- Tamaño de tablas
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Consultas lentas
SELECT
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Índices no utilizados
SELECT
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_tup_read = 0;
```

## 🚀 Plan de Implementación

### Fase 1: Estructura Base (Sprint 1-2)

1. Crear esquema de base de datos
2. Implementar tablas core
3. Configurar índices básicos
4. Implementar triggers esenciales

### Fase 2: Funcionalidades Core (Sprint 3-4)

1. Implementar gestión de usuarios
2. Sistema de inscripciones
3. Gestión de pagos
4. Sistema de validaciones

### Fase 3: Funcionalidades Avanzadas (Sprint 5-6)

1. Sistema de acreditación
2. Reportes y dashboards
3. Comunicación automática
4. Optimizaciones de rendimiento

### Fase 4: Producción (Sprint 6+)

1. Configuración de producción
2. Backup y recuperación
3. Monitoreo y alertas
4. Optimizaciones finales

---

**Documento preparado por:** AI Assistant  
**Fecha:** $(date)  
**Versión:** 1.0  
**Estado:** ✅ ARQUITECTURA COMPLETA

