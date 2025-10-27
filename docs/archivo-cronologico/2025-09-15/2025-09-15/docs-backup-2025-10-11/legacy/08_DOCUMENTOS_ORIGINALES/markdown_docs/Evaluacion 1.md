Evaluación Sumativa 1
Unidad 1: Levantamiento de Requerimientos y Diseño de Interfaces

Proyecto: Sistema de Gestión Scout – Región del Bío Bío
Área académica: Informática y Telecomunicaciones

Nombres: Ricardo Sanhueza Giovani Pacheco

Fecha: 01 – 09 -  2025
Carrera: Analista Programador

# 1. Definición del Proyecto y Levantamiento de Requerimientos

El proyecto a desarrollar es un Sistema de Gestión Scout para la Octava Región. Este sistema busca solucionar los siguientes problemas:

Gestión ineficiente de inscripciones: El proceso actual es manual, lo que provoca lentitud, errores humanos y una falta de centralización de la información.

Falta de control de cupos: La gestión de cupos máximos y listas de espera es un proceso manual y propenso a errores.

Problemas en la validación de pagos: La verificación de los comprobantes de pago se realiza de forma manual, lo que retrasa la confirmación de las inscripciones.

Dificultad en la generación de reportes: La creación de informes de inscritos, pagos y asistencia es laboriosa y no está centralizada.

El objetivo principal es automatizar los procesos de inscripción, validar datos, generar reportes y facilitar la acreditación de los participantes, lo que permitirá un ahorro de tiempo significativo y una mayor eficiencia en la gestión regional.

# 2. Levantamiento de Requerimientos y Historias de Usuario

A partir de la especificación de requerimientos proporcionada, se han definido las siguientes historias de usuario, las cuales capturan las funcionalidades clave del sistema.

RECOPILACIÓN DE HISTORIAS DE USUARIO

# 3. Priorización y Planificación de Sprints

Se propone un tiempo de sprint de 2 semanas. Las primeras historias de usuario se han priorizado según su valor de negocio, buscando entregar una funcionalidad mínima y significativa al usuario lo antes posible.

Sprint 1 (Semanas 1-2)

Duración: 2 semanas.

Historias de Usuario:

HU03: Formulario de inscripción para el participante.

HU04: Carga de comprobante de pago.

Objetivo del Sprint: Permitir que los participantes se preinscriban y suban su comprobante de pago.

Entregable al usuario: Una página web funcional con el formulario de inscripción y la opción de subir el comprobante de pago.

Sprint 2 (Semanas 3-4)

Duración: 2 semanas.

Historias de Usuario:

HU01: Carga de curso y habilitación de preinscripción.

HU05: Validación manual de pagos por el administrador.

Objetivo del Sprint: Permitir al administrador habilitar cursos y validar manualmente las inscripciones de los participantes.

Entregable al usuario: Una página web funcional que permite al administrador gestionar las inscripciones y un correo de confirmación para el participante.

# 4. Diseño de la Solución (Etapa 2)

4.1. Patrones de Arquitectura y Almacenamiento en la Nube

Para este proyecto, se propone una arquitectura de software basada en el patrón Arquitectura de Microservicios. Este patrón permitirá que cada funcionalidad (como la gestión de usuarios, inscripciones o reportes) sea un servicio independiente, facilitando su desarrollo, mantenimiento y escalabilidad.

El almacenamiento en la nube se gestionará de la siguiente manera:

Base de Datos: Se utilizará una base de datos NoSQL, como Firestore, para almacenar la información de los usuarios, cursos, inscripciones y pagos. Esto es ideal para los datos semi-estructurados y la flexibilidad que se requiere.

Almacenamiento de Archivos: Para los comprobantes de pago y otros documentos adjuntos (como la ficha médica), se utilizará un servicio de almacenamiento de objetos, como Firebase Storage.

4.2. Plan de Pruebas

Se elaborará un plan de pruebas para garantizar la calidad y el correcto funcionamiento del sistema. Las pruebas se realizarán a nivel de sprint, siguiendo un enfoque ágil.

Pruebas Unitarias: Se ejecutarán pruebas unitarias para cada componente o función de los microservicios, asegurando que cada parte del código funcione correctamente de manera aislada.

Pruebas de Integración: Una vez que los componentes estén listos, se probará la integración entre ellos para verificar que se comunican de manera adecuada.

Pruebas de Aceptación del Usuario (UAT): Al final de cada sprint, el equipo de desarrollo, junto con el "Product Owner", realizará pruebas para validar que las funcionalidades entregadas cumplen con los criterios de aceptación de las historias de usuario.

Pruebas de Carga: Aunque no son una prioridad inicial, se pueden considerar pruebas de carga para verificar el rendimiento del sistema bajo una alta demanda, en caso de que se espere un gran número de inscripciones simultáneas.

# 5. Construcción de la Solución (Etapa 3)

5.1. Desarrollo de la Aplicación

El desarrollo se realizará de forma incremental, siguiendo la planificación por sprints. Cada sprint se centrará en la construcción de las funcionalidades definidas en las historias de usuario priorizadas.

Interfaz de Usuario (Front-end): Se construirá la interfaz utilizando un framework o librería moderna (como React, Angular o Vue.js) para asegurar un diseño responsivo y una experiencia de usuario fluida. Se implementarán las interfaces de usuario (formularios, dashboards, etc.) diseñadas en la Etapa 1.

Codificación (Back-end y Lógica de Negocio): Se desarrollará la lógica de negocio en la capa de microservicios, utilizando un lenguaje de programación adecuado (como Python, Node.js, Java o C#). Se implementarán las validaciones de datos, la lógica de aprobación de inscripciones y la generación de reportes.

Implementación de la Base de Datos: Se configurará la base de datos Firestore para almacenar la información de los usuarios, cursos y participantes. Se diseñarán las colecciones y documentos de acuerdo con los requerimientos.

Almacenamiento de Archivos: Se configurará Firebase Storage para la carga y gestión de los comprobantes de pago, así como otros documentos relevantes.

5.2. Configuración del Entorno de Producción

Se preparará el entorno para desplegar la aplicación y hacerla accesible a los usuarios.

Hosting en la Nube: Se utilizará un servicio de hosting en la nube (como Google Cloud Platform, AWS o Azure) para alojar el sistema.

Configuración del Entorno: Se configurarán las variables de entorno, las credenciales de acceso a la base de datos y al almacenamiento de archivos, y cualquier otra configuración necesaria para que la aplicación funcione en el entorno de producción.

Pruebas de Despliegue: Se realizarán pruebas para asegurar que el despliegue de la aplicación se realiza de manera correcta y que todos los servicios se comunican entre sí sin problemas.

# 6. Defensa de la Solución (Etapa 4)

La defensa de la solución es la última fase del proyecto. Su propósito es demostrar el progreso logrado y la funcionalidad de la aplicación a través de una exposición de los resultados. Esta etapa también implica la entrega de todos los artefactos del proyecto.

Trabajo práctico: Se presentará la aplicación funcional desarrollada durante las etapas de construcción, mostrando la navegación y las funcionalidades completadas en los sprints.

Código fuente de la aplicación: Se entregará el código fuente completo del proyecto, preferentemente en un repositorio de control de versiones (como Git), con la estructura de directorios organizada y comentarios claros.

Ejecutable de la aplicación: Se proporcionará una versión ejecutable o desplegable de la aplicación para que pueda ser probada y validada en un entorno de producción. Esto puede ser un enlace a un sitio web en vivo o los archivos necesarios para el despliegue.

Documentación de la aplicación: Se presentará la documentación completa, que debe incluir un resumen de todas las etapas, desde el levantamiento de requerimientos hasta el plan de pruebas. La documentación debe ser clara, concisa y fácil de entender.

# 7. Diseño de diagramas UML según las distintas vistas de acuerdo con el paradigma 4 + 1.

## 1. Vista Lógica - Diagrama de Clases UML

## 2. Vista de Procesos - Diagrama de Secuencia UML

## 3. Vista de Desarrollo - Diagrama de Componentes UML

## 4. Vista Física - Diagrama de Despliegue UML

## 5. Vista de Escenarios - Diagrama de Casos de Uso UML

Este apartado se dedica a describir los casos de uso más relevantes del Sistema de Gestión Scout, ya que su diseño se acomoda al perfil del tipo de operativa de administración, inscripción y control que requiere el organismo. Cada caso de uso se ha agrupado en módulos funcionales para facilitar su comprensión y posterior desarrollo.

Los casos de uso pueden verse como la explicación de cómo los actores del sistema (administrador y participantes) interactúan con la plataforma, qué pasos pueden seguir y qué resultados obtienen. Con esta distribución se pretende dar respuesta a los procesos internos, centralizar los datos y tener una buena experiencia de la usuaria y usuario.

A continuación se resumen en la siguiente tabla los módulos de las funcionalidades principales que se han identificado.

IV. Interfaces de Usuario

Pantalla de Inicio / Login Campos: correo/usuario y contraseña

Botones: Iniciar sesión, Recuperar contraseña

Propósito: Acceso seguro al sistema para participantes y administradores

Dashboard Principal (Administrador)

Secciones: Resumen de cursos activos Inscripciones recientes Notificaciones pendientes Accesos rápidos a reportes y configuración

Propósito: Visión general del sistema y acceso rápido a funciones críticas

Gestión de Cursos Tabla de cursos con columnas: Nombre, Fecha, Cupos, Estado

Botones: Crear, Modificar, Cancelar, Duplicar

Propósito: Administrar los cursos ofrecidos de forma sencilla solos estos tres

# 8. Conclusiones

En síntesis, el desarrollo de este trabajo ha permitido profundizar en los aspectos fundamentales del tema, destacando la importancia de los sprint, maquetear bien el sistema. Se evidenció que se puede desarollar bien una idea, lo que confirma la relevancia de abordar este tema desde una perspectiva tecnica en el desarollo de software.
