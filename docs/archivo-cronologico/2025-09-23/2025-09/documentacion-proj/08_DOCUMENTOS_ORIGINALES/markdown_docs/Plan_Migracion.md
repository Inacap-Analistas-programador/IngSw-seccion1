# Plan de Migración

## Objetivo
El objetivo de este plan de migración es detallar el proceso de migración de datos desde el sistema actual hacia el nuevo sistema, asegurando que todos los datos relevantes sean transferidos de manera segura y eficiente.

## Inventario de Datos a Migrar
A continuación se presenta un inventario de las hojas y columnas que serán migradas desde el archivo `Curso Medio 2025_06.xlsm`:

- **Hoja: Usuarios**
  - Columnas: ID, Nombre, Apellido, Email, Teléfono

- **Hoja: Preinscripciones**
  - Columnas: ID, Usuario_ID, Fecha_Preinscripcion, Estado

- **Hoja: Pagos**
  - Columnas: ID, Preinscripcion_ID, Monto, Fecha_Pago, Estado

- **Hoja: Archivos**
  - Columnas: ID, Usuario_ID, Tipo_Archivo, Fecha_Subida

## Mapeo de Columnas a Campos de Base de Datos
El siguiente mapeo describe cómo las columnas del archivo de origen se relacionan con los campos en la base de datos:

| Hoja          | Columna (Origen) | Campo (Destino)       |
|---------------|------------------|-----------------------|
| Usuarios      | ID               | users.id              |
| Usuarios      | Nombre           | users.nombre          |
| Usuarios      | Apellido         | users.apellido        |
| Usuarios      | Email            | users.email           |
| Usuarios      | Teléfono         | users.telefono        |
| Preinscripciones | ID            | preinscripciones.id    |
| Preinscripciones | Usuario_ID    | preinscripciones.usuario_id |
| Preinscripciones | Fecha_Preinscripcion | preinscripciones.fecha |
| Preinscripciones | Estado       | preinscripciones.estado |
| Pagos         | ID               | pagos.id              |
| Pagos         | Preinscripcion_ID | pagos.preinscripcion_id |
| Pagos         | Monto            | pagos.monto           |
| Pagos         | Fecha_Pago       | pagos.fecha           |
| Pagos         | Estado           | pagos.estado          |
| Archivos      | ID               | archivos.id           |
| Archivos      | Usuario_ID       | archivos.usuario_id    |
| Archivos      | Tipo_Archivo     | archivos.tipo         |
| Archivos      | Fecha_Subida     | archivos.fecha_subida |

## Plan de Migración
1. **Preparación de Datos**
   - Revisar y limpiar los datos en el archivo `Curso Medio 2025_06.xlsm` para asegurar que no haya inconsistencias.

2. **Desarrollo del Script de Migración**
   - Crear un script ETL (Extract, Transform, Load) que realice las siguientes tareas:
     - Extraer datos del archivo Excel.
     - Transformar los datos según el mapeo definido.
     - Cargar los datos en la base de datos destino.

3. **Pruebas de Migración**
   - Realizar pruebas de migración en un entorno de staging para verificar que los datos se transfieren correctamente.
   - Validar que no se pierda información y que las relaciones entre tablas se mantengan.

4. **Ejecución de la Migración**
   - Ejecutar el script de migración en el entorno de producción durante una ventana de mantenimiento acordada.

5. **Verificación Post-Migración**
   - Realizar una verificación exhaustiva de los datos migrados para asegurar que todo se haya transferido correctamente.
   - Documentar cualquier discrepancia y tomar las acciones necesarias para resolverlas.

## Backup
Antes de realizar la migración, se debe asegurar que se cuenta con un backup completo de la base de datos actual y del archivo de origen para prevenir cualquier pérdida de datos.