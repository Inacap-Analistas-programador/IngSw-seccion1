# Configuración de Base de Datos - GIC Backend

## Resumen de Cambios

Se han alineado los modelos de Django con el esquema definitivo `crebas_minuscula.sql` ubicado en la raíz del repositorio.

### Cambios Realizados

1. **Modelo Usuario (`usuarios/models.py`)**
   - ✅ `usu_email`: Cambiado de `null=True, blank=True` a **NOT NULL** (requerido)
   - ✅ `usu_password`: Cambiado de `max_length=128` a `max_length=50` (según SQL)

2. **Modelo PersonaVehiculo (`personas/models.py`)**
   - ✅ `pec_id`: Cambiado de `null=True, blank=True` a **NOT NULL** (requerido)

3. **Base de Datos**
   - ✅ Se regeneraron todas las migraciones para reflejar el esquema correcto
   - ✅ Se configuró soporte para MySQL en producción

## Configuración de Base de Datos

### Desarrollo Local (SQLite)

Por defecto, el sistema usa SQLite para desarrollo:

```bash
python manage.py runserver
```

### Producción (MySQL)

Para usar MySQL en producción, configura las siguientes variables de entorno:

```bash
export DB_ENGINE=mysql
export DB_NAME=gic_db
export DB_USER=tu_usuario
export DB_PASSWORD=tu_contraseña
export DB_HOST=localhost
export DB_PORT=3306
```

O crea un archivo `.env` en el directorio `backend/`:

```env
DB_ENGINE=mysql
DB_NAME=gic_db
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=3306
```

### Importar el Schema SQL a MySQL

1. **Crear la base de datos:**
   ```bash
   mysql -u root -p
   CREATE DATABASE gic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   exit
   ```

2. **Importar el schema:**
   ```bash
   mysql -u root -p gic_db < ../crebas_minuscula.sql
   ```

3. **Configurar Django para usar MySQL:**
   ```bash
   export DB_ENGINE=mysql
   export DB_NAME=gic_db
   export DB_USER=root
   export DB_PASSWORD=tu_contraseña
   ```

4. **Verificar la conexión:**
   ```bash
   python manage.py check
   ```

5. **NO ejecutar migraciones si ya importaste el SQL:**
   ```bash
   # Si usas el SQL directamente, marca las migraciones como aplicadas:
   python manage.py migrate --fake
   ```

## Verificación del Schema

Para verificar que los modelos Django coinciden con el SQL:

```bash
# Verificar que no hay problemas
python manage.py check

# Ver las migraciones
python manage.py showmigrations

# Generar SQL de las migraciones (para comparar)
python manage.py sqlmigrate usuarios 0001
```

## Campos Importantes

### Usuario (usuario)
- `usu_id`: numeric(10) NOT NULL - Primary Key
- `pel_id`: numeric(10) NOT NULL - Foreign Key a perfil
- `usu_username`: varchar(100) NOT NULL - Username único
- `usu_password`: varchar(50) NOT NULL - Contraseña (debe hashearse)
- `usu_email`: varchar(100) NOT NULL - **Email requerido**
- `usu_ruta_foto`: varchar(255) NOT NULL - Ruta de foto
- `usu_vigente`: bit NOT NULL - Usuario activo

### Persona Vehículo (persona_vehiculo)
- `pev_id`: numeric(10) NOT NULL - Primary Key
- `pec_id`: numeric(10) NOT NULL - **Foreign Key requerida** a persona_curso
- `pev_marca`: varchar(50) NOT NULL - Marca del vehículo
- `pev_modelo`: varchar(50) NOT NULL - Modelo del vehículo
- `pev_patente`: varchar(10) NOT NULL - Patente del vehículo

## Notas Importantes

1. **Schema Definitivo**: El archivo `crebas_minuscula.sql` es el schema definitivo y autoritativo.
2. **Migraciones**: Las migraciones de Django están alineadas con el schema SQL.
3. **Compatibilidad**: Los modelos son compatibles tanto con SQLite (desarrollo) como MySQL (producción).
4. **Tipos de Datos**: Django convierte automáticamente los tipos de datos según el backend de base de datos usado.

## Dependencias Requeridas

Para usar MySQL con Django:

```bash
pip install mysqlclient
# O alternativamente:
pip install pymysql
```

Si usas `pymysql`, agrega esto en `scout_project/__init__.py`:

```python
import pymysql
pymysql.install_as_MySQLdb()
```

## Troubleshooting

### Error: "Can't connect to MySQL server"
- Verifica que MySQL esté corriendo
- Verifica las credenciales de conexión
- Verifica que el puerto 3306 esté abierto

### Error: "mysqlclient not installed"
```bash
pip install mysqlclient
```

### Error: "Table doesn't exist"
Si usaste el SQL directamente:
```bash
python manage.py migrate --fake
```

Si quieres usar las migraciones de Django:
```bash
python manage.py migrate
```

## Contacto

Para más información sobre la estructura de la base de datos, consulta:
- `../crebas_minuscula.sql` - Schema SQL definitivo
- `../modelo_de_datos.md` - Documentación del modelo de datos
- `SCHEMA_ANALYSIS.md` - Análisis del schema
