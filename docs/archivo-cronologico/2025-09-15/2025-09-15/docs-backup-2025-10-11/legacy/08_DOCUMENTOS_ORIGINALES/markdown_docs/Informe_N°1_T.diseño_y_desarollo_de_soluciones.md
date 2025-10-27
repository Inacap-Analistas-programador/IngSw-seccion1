# Introducción

El presente informe corresponde a la primera evaluación de la asignatura y tiene como finalidad analizar y documentar el proceso actual de gestión de cursos y voluntariado en la Zona Bío-Bío de la Asociación de Guías y Scouts de Chile. A partir de la información recopilada en la guía de trabajo, se describen las etapas que conforman el ciclo de un curso desde su planificación inicial hasta la entrega de informes finales, identificando a los actores involucrados, los flujos de información y las herramientas utilizadas.

Este trabajo busca establecer un diagnóstico claro de la situación vigente, evidenciando las limitaciones y desafíos que presenta el sistema actual, caracterizado por una alta carga manual, dispersión de datos y ausencia de validaciones automáticas. Sobre esta base, se presentan los requisitos funcionales y técnicos que orientarán el diseño de un nuevo sistema de gestión, con el objetivo de optimizar la administración de inscripciones, pagos, acreditaciones y reportes, garantizando mayor eficiencia, trazabilidad y seguridad de la información.

# Toma de Requerimientos

Contexto y Problemas Destacados:

El proyecto busca desarrollar un sistema de gestión de cursos y voluntariado para la zona Bío-Bío de la Asociación de Guías y Scouts de Chile. Actualmente, los procesos se realizan de forma manual con formularios de Google y hojas de cálculo Excel, lo que genera una alta carga manual, problemas de validación, información duplicada, acceso limitado y preocupaciones de confidencialidad.

El objetivo principal es automatizar y centralizar la gestión de inscripciones, pagos, acreditaciones, información de participantes, formadores, presupuestos y reportes, para mejorar la eficiencia y la seguridad de los datos

Requisitos Funcionales:

Gestión de Preinscripciones: Permitir preinscripciones con validaciones de campos (ej. formato RUT, selección de comuna) y manejo de campos condicionales.

Gestión de Participantes: Calcular automáticamente la edad, gestionar cupos (ej. 144 disponibles para 204 preinscritos), y manejar estados de los participantes (ej. vigente, en espera, sobre cupo). También debe permitir cambios de rama y asignación manual si es necesario.

Gestión de Pagos: Manejar pagos y generar comprobantes de forma automática. El administrador de administración será responsable de ingresar y verificar los pagos.

Acreditación: Incluir un módulo de acreditación con códigos QR para registrar la asistencia el día del curso.

Informes y Reportes: Generar reportes y dashboards dinámicos para visualizar información como participantes por rama, comuna, distrito, recaudación, alimentación, alojamiento, pagos, etc. También se desea guardar los informes finales de los directores de rama.

Comunicación Automatizada: Enviar correos electrónicos de forma automática, por ejemplo, para solicitar el pago de cuotas.

Gestión de Menú: Administrar y registrar el menú del curso.

Mantenedores: Permitir la gestión de roles, usuarios, zonas, distritos, ramas y cargos para estandarizar la información

Requisitos No Funcionales:

Multiplataforma: Debe ser accesible desde PC, celular y Tablet.

Seguridad y Confidencialidad: Garantizar la seguridad y estricta confidencialidad de datos sensibles como RUTs, números de contacto, direcciones, fichas médicas y otra información personal de los participantes. Se espera que el sistema tenga gestión de roles y permisos con auditoría de cambios significativos.

Flexibilidad: Adaptarse a posibles cambios organizativos de la Asociación de Guías y Scouts.

Integración: Aunque el objetivo es reemplazar el proceso manual, se menciona una posible integración con herramientas existentes como Excel, Forms o Sheets.

Estandarización: Facilitar la transición de procesos para nuevos coordinadores zonales de voluntariado.

Almacenamiento en la Nube (Cloud): El diseño de la solución debe considerar el almacenamiento de datos en plataformas cloud.

Arquitectura y Estándares: Debe aplicar patrones de arquitectura (ej. MVC) y estándares de programación segura.

# Historias de Usuario

# Tabla de priorización

# Definición de Sprints

Primer Sprint (2 semanas):

Objetivo: Implementar el flujo mínimo de inscripción y validación para participantes, incluyendo roles y pagos.

Historias incluidas:

HU01: Formulario de inscripción con validaciones.

HU02: Gestión automática de cupos.

HU03: Registro y verificación de pagos.

HU08: Gestión de roles y permisos.

Actividades estimadas:

Segundo Sprint (2 semanas):

Objetivo: Acreditación, reportes y mantenedores básicos.

Historias incluidas:

HU04: Generación y lectura de QR

HU05: Reportes por rama

HU07: Mantenedores de zonas, distritos, ramas, etc

HU13: Activar/desactivar formulario público

Actividades estimadas:

# Diagramas UML

Diagrama de secuencia:

El siguiente diagrama de secuencia representa el flujo completo de inscripción y pago de un participante en un evento o servicio, destacando la interacción entre distintos sistemas: interfaz web, API backend, base de datos, pasarela de pago, servicio de correo y módulo de generación de códigos QR. Este esquema permite visualizar de manera ordenada cómo se gestionan los datos del usuario, se procesa el pago, se valida la transacción y se genera la acreditación correspondiente, asegurando una experiencia automatizada y eficiente para el participante.

Diagrama de componentes:

El presente diagrama de componentes del sistema describe la estructura general y las interacciones entre los distintos componentes de una aplicación web. Está organizado en tres capas principales: Cliente, Servidor e Infraestructura. A través de esta representación, se puede comprender cómo la interfaz web se comunica con una API REST que gestiona servicios clave como autenticación, preinscripción, pagos, generación de códigos QR, reportes y notificaciones. Además, se detallan los recursos de infraestructura que soportan el sistema, incluyendo base de datos, almacenamiento de archivos, pasarela de pago externa y servicios de mensajería. Esta arquitectura permite una visión clara y modular del funcionamiento interno de la plataforma.

Diagrama de despliegue:

Este diagrama de despliegue presenta la estructura funcional de una aplicación web, organizada en capas que reflejan la interacción entre el usuario, los servicios del sistema y los componentes de infraestructura. Desde el navegador web en dispositivos PC o móviles, el usuario accede a una aplicación desarrollada en React, que se comunica con una API REST en el backend. Esta API gestiona servicios esenciales como autenticación, preinscripción, pagos, generación de códigos QR, reportes y notificaciones. A nivel de infraestructura, se integran recursos como base de datos SQL, almacenamiento de archivos, pasarela de pago, servicios de correo electrónico y mensajería SMS. El diagrama proporciona una visión integral del flujo de datos y la conectividad entre módulos, facilitando el entendimiento del sistema como un todo.

Diagrama de clases:

El Diagrama de Clases es una pieza central en el diseño de la solución del sistema de gestión de cursos y voluntariado. Este diagrama representa la "vista lógica" del software, detallando las entidades clave del sistema, sus atributos y las relaciones que existen entre ellas. Basado en los requerimientos y las historias de usuario, su objetivo principal es servir como fundamento para la implementación de la base de datos en la nube (cloud), estructurando cómo se organizará la información para el desarrollo de la aplicación.

Los diagramas presentados forman parte de la documentación técnica y de procesos de un sistema orientado a la gestión de cursos y participantes, integrando tanto el flujo operativo como la arquitectura tecnológica que lo soporta.

Por un lado, el diagrama de actividades describe de forma secuencial y visual el recorrido que sigue un usuario desde su inscripción inicial hasta la finalización del curso, incluyendo puntos de decisión clave como la validación de requisitos, la disponibilidad de cupos, el registro de pagos y la emisión de credenciales. Este enfoque permite comprender de manera clara las interacciones, dependencias y posibles rutas que puede tomar el proceso.

Por otro lado, el diagrama de despliegue muestra la estructura técnica que hace posible dicho flujo, detallando la interacción entre el cliente (navegador web), el servidor de aplicaciones y sus módulos especializados —validación de formularios, gestión de participantes, pagos y acreditaciones—, así como la conexión con bases de datos locales y en la nube para el almacenamiento seguro de información médica, administrativa y documental.

Diagrama de Actividades:

Diagrama de despliegue (otra versión):

# Casos de uso:

Caso de uso: Inscribirse en un Curso:

Caso de uso: Gestionar Cupos del Curso.

Caso de uso: Registrar y Verificar Pago:

Caso de uso: Gestionar Roles y Permisos de Usuarios.

Caso de uso: Acreditar participante con QR.

Caso de uso: Visualizar reportes de participantes.

Caso de uso: Administrar mantenedores de datos.

Caso de uso: Controlar visibilidad del formulario.

# Interfaz de usuario:

Wireframes:
