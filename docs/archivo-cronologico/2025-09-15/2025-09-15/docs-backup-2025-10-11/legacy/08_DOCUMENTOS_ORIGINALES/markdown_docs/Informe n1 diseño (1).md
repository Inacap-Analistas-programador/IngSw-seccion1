# Documento De Requerimientos de Software

# DRS BoyScouts

NOMBRE: Juan Herrera Martinez, José Colivoro Uribe, Nicolas gonzalez

CARRERA: Analista Programador

ASIGNATURA: Ingeniería En Software

PROFESOR: Nilson Arturo Guerra Cabeza

FECHA: 01//09//2025

# Introducción

El presente informe tiene como propósito documentar de manera estructurada y detallada el desarrollo del Sistema de Gestión Integral para Cursos Scouts (SGICS), una plataforma web diseñada para modernizar y digitalizar los procesos asociados a la organización de cursos y eventos scouts. El sistema surge como respuesta a la necesidad de reemplazar los procedimientos manuales actualmente basados en planillas de cálculo y documentos de texto, que dificultan la trazabilidad, generan duplicación de datos y limitan la capacidad de análisis en tiempo real.

La primera implementación se enfocará en el Curso Medio 2025 de la Zona Biobío, funcionando como caso piloto para validar la solución tecnológica. El sistema permitirá realizar la preinscripción en línea de participantes, formadores y voluntarios, gestionar información crítica (salud, contacto de emergencia, logística, pagos, cupos), y centralizar en una base de datos toda la información que hoy se encuentra fragmentada en múltiples archivos Excel y Word.

Este documento expone los requerimientos funcionales y no funcionales que guiarán el desarrollo del sistema, así como el alcance del proyecto, los objetivos planteados y los lineamientos técnicos que orientarán su construcción. De esta manera, se busca establecer una base sólida para asegurar que la solución cumpla con las necesidades organizativas, garantice la seguridad de los datos personales, y facilite la labor de los equipos responsables de la validación, la gestión administrativa y la logística de los eventos scouts.

# Alcance del Proyecto

El Sistema de Gestión Integral para Cursos Scouts (SGICS / BoyScout) tendrá como propósito centralizar y digitalizar todos los procesos vinculados a la gestión de cursos y actividades formativas de la organización scout. El sistema reemplazará las herramientas actuales basadas en planillas Excel con macros y documentos Word, migrando la información existente a una base de datos relacional que será la fuente oficial de registros.

## Funcionalidades dentro del alcance

El sistema cubrirá los siguientes procesos:

Preinscripción y Registro:
Captura de datos completos de participantes, formadores, voluntarios y equipos de apoyo mediante un formulario web. Validación automática de RUN/RUT, teléfonos, correos y carga de fichas médicas obligatorias.

Gestión de Usuarios y Roles:
Control de accesos y permisos diferenciados según rol (participante, formador, validador de grupo, validador de distrito, organizador, equipo de salud, administrador).

Flujo de Validación:
Estados definidos para cada preinscripción: Borrador → Enviado → En Revisión (Grupo/Distrito) → Validado → Cupo Asignado.

Gestión Financiera:
Registro y seguimiento de cuotas, pagos, comprobantes de ingreso y egreso, rendiciones, pasajes para formadores y reportes de morosidad.

Logística y Operación:
Gestión de materiales, insumos, menús, requerimientos especiales (alimentación, alergias, movilidad reducida) y asignación de alojamiento.

Acreditación y Credenciales:
Generación de credenciales digitales e imprimibles con información del participante, incluyendo apodo, rol y estado de inscripción.

Reportes y Dashboards:
Estadísticas y visualizaciones por zona, distrito, grupo, rama, rol y estado de inscripción. Reportes logísticos (alimentación, salud, vehículos) y financieros (ingresos vs. egresos). Exportación a Excel, CSV y PDF.

Migración de Datos Históricos:
Incorporación de la información existente en los diferentes archivos Excel y Word en la base de datos del sistema, asegurando consistencia, trazabilidad y respaldo.

## Funcionalidades fuera del alcance

El sistema no contemplará en esta primera versión:

Integración automática con pasarelas de pago en línea (transferencias o tarjetas). Los pagos se registrarán manualmente.

Procesamiento avanzado de datos mediante algoritmos de predicción o inteligencia artificial.

Integraciones con hardware externo (lectores QR o RFID para acreditación presencial).

Gestión de eventos no relacionados con el movimiento scout o actividades ajenas a la organización.

# Análisis del Problema y Objetivos del Sistema

## Descripción del Problema Actual

Actualmente, los procesos de gestión de cursos scouts —como el Curso Medio Zona Biobío 2025— se llevan a cabo utilizando una combinación de planillas Excel con macros (XLSM) y documentos Word (DOCX). Esta forma de trabajo presenta diversas limitaciones:

Duplicidad e inconsistencia de datos: Los registros de participantes, pagos y logística se encuentran repartidos en múltiples hojas, lo que genera discrepancias y errores de actualización.

Dependencia de macros y archivos locales: La operatividad está ligada a macros en Excel que requieren un alto grado de cuidado y generan fallas frecuentes al manipular grandes volúmenes de información.

Errores humanos y falta de control: La digitación manual de datos aumenta el riesgo de errores en RUN, pagos o asignación de cupos.

Carencia de trazabilidad: No existe un mecanismo unificado que permita rastrear el estado de una preinscripción, ni un historial de validaciones y modificaciones.

Limitada colaboración en tiempo real: Los archivos deben descargarse, modificarse y reenviarse, lo que dificulta la coordinación entre organizadores, validadores de grupo/distrito y participantes.

Restricciones en la generación de reportes: El análisis de datos (por distrito, rama, estado de pagos o logística) es manual y consume tiempo adicional.

Problemas en seguridad de la información: Datos sensibles como RUN, alergias o contactos de emergencia están expuestos en planillas sin medidas adecuadas de protección.

Estas limitaciones generan atrasos en la planificación, acreditación y control financiero de los cursos, impactando negativamente en la experiencia de los participantes y en la eficiencia del equipo organizador.

## Objetivos del Nuevo Sistema

El nuevo Sistema de Gestión Integral para Cursos Scouts (SGICS) busca resolver los problemas anteriores mediante un entorno web centralizado, accesible y seguro. Los objetivos principales son:

Digitalizar y centralizar procesos: Unificar en una sola plataforma las funciones de preinscripción, validación, pagos, logística y reportes.

Reducir errores en el ingreso de datos: Implementar validaciones automáticas de RUN, teléfonos, correos y campos críticos.

Optimizar tiempos de gestión: Disminuir en al menos un 80% el tiempo requerido para validar y aprobar inscripciones, en comparación con el proceso manual.

Garantizar trazabilidad y control: Incluir un flujo de estados para cada ficha (Enviado, En revisión, Validado, Cupo Asignado) y una bitácora de auditoría con registro de acciones.

Facilitar la colaboración multiusuario: Permitir el acceso en línea a participantes, validadores, formadores y organizadores, con roles y permisos diferenciados.

Generar reportes en tiempo real: Dashboards dinámicos con métricas de inscripciones, pagos, logística y distribución por distrito/rama.

Mejorar la seguridad y privacidad de los datos: Incorporar cifrado, control de acceso y cumplimiento de la Ley 19.628 sobre protección de datos personales en Chile.

Soportar la escalabilidad: Diseñar la base de datos y la arquitectura para permitir el crecimiento hacia múltiples cursos y zonas.

Migrar información existente: Integrar y convertir los datos históricos almacenados en Excel y Word a la nueva base de datos del sistema, evitando la dependencia de archivos locales.

Con este enfoque, el SGICS permitirá a la organización scout contar con una herramienta moderna, confiable y adaptada a las necesidades actuales y futuras de los cursos de formación.

# Requerimientos Funcionales (RF)

# Requerimientos No Funcionales (RNF)

# Arquitectura o Modelado del Sistema

Aquí es donde entra el modelo 4+1 (Vista Lógica, Vista de Procesos, Vista de Desarrollo, Vista Física y Casos de Uso), sin embargo en el momento de la creación de este documento no se tenía clara la información que  define las bases de las vistas faltantes  se tiene que tener en cuenta que  se usó administrador y organizador para  poder ordenar   las funciones, sin embargo para  fines prácticos, son lo mismo.

## Diagramas de caso de uso

Preinscripción

Explicación:  este caso de uso explica el proceso de preinscripcion del participante, el cual tiene dos accesos, realizarla y consultar estado, obligatoriamente debe añadir por requerimiento su ficha medica

Validaciones (Grupo y Distrito)

Explicación: hay dos validaciones obligatorias que se relacionan, Grupo y Distrito, ademas de que el participante puede observar la ficha de inscripción ya finalizado este proceso.

Finanzas

Explicación: el Organizador es el responsable de conciliar pagos y gestionar presupuestos, estas 2 opciones incluyen registrar pago / cuota, y registrar egreso, puede ingresar directamente a registrar egreso sin pasar por gestionar presupuesto, pero si registrar pago depende del proceso primario de c

Operación (Inventario, Menús, Pasajes)

Explicación: Voluntario y equipo de salud, formador, organizador, cada uno puede ingresar a su respectivo modulo para observar, no tienen permisos hasta que el organizador en algun particular quiera hacerlo.

Plataforma y Administración

Explicación: el Organizador puede otorgarse dos funciones que contiene auditoria y bitacora el cual observa el gestor de usuarios para administar, y ademas puede generar credenciales PDF, ver dashboards y kpis, los cuales se exportan en formato xlsm.

## Diagramas de secuencias

Preinscripción

Validaciones

Finanzas

Operaciones

Administración

## Diagramas de Actividades

## Preinscripción

Validaciones

Finanzas

Operaciones

Administración

# Estrategia de Migración de Datos

Este apartado es crítico: explicita paso a paso cómo migrar todo el contenido del Curso Medio 2025_06.xlsm a la BD, cuidando integridad y permitiendo rollback.

## Resumen del objetivo

Migrar todas las hojas relevantes del Curso Medio 2025_06.xlsm (26 hojas) a tablas en la base de datos del nuevo sistema, manteniendo integridad y registros históricos, eliminando la dependencia de archivos Excel para datos operativos.

## Inventario inicial

Hojas a migrar: Datos, BBDD_Formadores, BBDD, Tabla_Pagos, Revision_RUT, ACREDITACION, Dashboard1, Dashboard2, Voluntarios, Cuotas, Pasajes_Formador, Comp. INGRESO, Comp. EGRESO, Presupuesto, Menú, Inf_Cuotas, Inf_NOPagados, Inf_Formadores, Inf_Credenciales, Inf_Voluntarios, Inf_Vol_OtrasZonas, Inf_VoluntariosDistrito, Inf_PorDistrito_Grupo, Inf_PorRama, Materiales e Insumos, Alimentos para Comprar.

## Fases de migración (sprint-friendly)

Fase 0 — Preparación

Copia de seguridad completa del XLSM (y de otros archivos DOCX).

Inventario de columnas por hoja (generar CSV con nombre_hoja, columna, tipo esperado).

Definición del esquema objetivo (tablas + tipos).

Definición de reglas de mapeo (columna Excel → campo BD), con tratamiento de datos (limpieza: RUT sin puntos, fechas, prefijo +56 a teléfonos).

Crear scripts/fuentes ETL (preferible Python: pandas + SQLAlchemy o una herramienta ETL).

Fase 1 — Migración no destructiva (entorno staging)

Ejecutar ETL hacia BD de staging.

Registro de errores y métricas (filas importadas, filas con problemas, duplicados).

Validación por el equipo organizador: comparar conteos y muestras (por ejemplo COUNT(BBDD) vs filas en Excel).

Ajustar reglas y repetir hasta zero-errors en muestra.

Fase 2 — Validación de reglas y cálculos

Verificar cálculos críticos (presupuesto, sumas, dashboards): replicar fórmulas del XLSM o validar con muestras.

Confirmar mappings de tablas financieras (Tabla_Pagos, Comp. INGRESO, Comp. EGRESO, Presupuesto).

Fase 3 — Migración final (producción)

Backup final de XLSM.

Ejecutar ETL hacia BD de producción en ventana programada.

Activar exports/imports en la plataforma y desactivar procesos manuales que escribían en el XLSM (control de versión y procedimiento).

Verificación post-migración: pruebas de integridad y reconciliación de totales (ingresos/egresos/participantes).

Fase 4 — Monitoreo y rollback

Durante X días (ej. 7 días) monitorizar integridad.

Si problemas críticos aparecen, ejecutar rollback (reimportación desde backup o restauración BD).

Mantener el XLSM como «read-only» y archivo histórico por al menos 6 meses.

## Reglas y transformaciones típicas (ejemplos)

RUT: eliminar puntos, normalizar a XXXXXXXX-X. Calcular DV si falta.

Teléfonos: mantener prefijo +56 y 9 dígitos móviles. Normalizar espacios/guiones.

Fechas: convertir a YYYY-MM-DD y timezone America/Santiago.

Archivos: mover adjuntos a storage (S3 o almacenamiento gestionado) y guardar path en tabla archivos.

Duplicados: identificar por RUT; si existe, determinar política: actualizar campos vacíos o crear registro nuevo y marcar conflicto para revisión manual.

Campos multiselección (ramos): normalizar separadores y mapear a tabla N:M.

## Validaciones post-migración

Conteos por tabla coinciden con número de filas importadas.

Sumas de montos (ingresos/egresos/presupuesto) comparan contra totales en Excel (δ aceptable: 0).

Lista de errores (filas no importadas) ≤ 0 con corrección manual.

Test de exportación: exportar a XLSX con plantillas y comparar con formato requerido.

## Backups y rollback

Mantener snapshot de BD pre-migración.

Guardar copia del XLSM original.

Plan de rollback documentado: restaurar snapshot y notificar stakeholders.

# Pruebas y criterios de aceptación (QA)

## Pruebas funcionales

RF-01: crear preinscripción completa, adjuntar ficha → estado Enviado.

RF-02: validar RUT incorrecto → rechazar.

RF-07: registrar pago y generar Inf_NOPagados.

RF-13: importar hojas XLSM → comparar totales.

## Pruebas no funcionales

Carga: 500 usuarios concurrentes (prueba JMeter/Locust).

Seguridad: revisión de endpoints y prueba de inyección SQL/CSRF/XSS.

Backup/restore: restauración en entorno staging.

## Criterios de aceptación generales

100% de campos del Google Form representados en la plataforma.

Importación round-trip del XLSM verificada con ejemplos.

Dashboard con KPIs clave funcionando y exportable.

Seguridad: HTTPS + datos sensibles cifrados.

Ley 19.628: consentimiento y mecanismo de rectificación implementados.

# Anexos

Prototipos De interfaces

Inicio

Prototipo de Preinscripcion

Perfil

Prototipo de  Dashboard
