
                    INSTITUTO PROFESIONAL INACAP
                        ESCUELA DE INFORMÁTICA
                    INGENIERÍA EN INFORMÁTICA



            INFORME TÉCNICO: ANÁLISIS Y DESARROLLO DEL 
         SISTEMA DE GESTIÓN INTEGRAL PARA CURSOS SCOUTS (SGICS)




                        Integrantes:
                    Giovanni Pacheco Martínez
                    Ricardo Sanhueza Henríquez
                    Nicolás Irribarra González  
                    Lucas Guerrero Pérez
                    Marisol Sáez López
                    Lucas Betanzos Riquelme
                    Rodrigo Jara Muñoz
                    Josué Vásquez Silva
                    Miguel Contreras Torres
                    Juan Orrego Sánchez
                    Leonardo López Castro
                    Camilo Colivoro Ramírez
                    Nicolás González Herrera
                    Juan Herrera Morales


                        Profesor:
                    Pablo Pesce

                        Asignatura:
                    Ingenieria de software

                        Fecha:
                    03 de Octubre de 2025

                        Sede:
                    INACAP San pedro de la Paz


---

# ÍNDICE

## CONTENIDO

**PORTADA** ......................................................... 1

**ÍNDICE** .......................................................... 2

**1. INTRODUCCIÓN DEL PROYECTO** ........................................ 4
   1.1 Antecedentes y Contexto .......................................... 4
   1.2 Problemática Identificada ........................................ 5
   1.3 Objetivos del Proyecto .......................................... 6
   1.4 Alcance y Limitaciones ........................................... 7
   1.5 Justificación del Proyecto ...................................... 8

**2. METODOLOGÍA A OCUPAR Y SU ACTA DE DEFINICIÓN** .................... 9
   2.1 Selección de Metodología Scrum .................................. 9
   2.2 Roles y Responsabilidades ....................................... 10
   2.3 Artefactos Scrum ................................................ 11
   2.4 Eventos y Ceremonias ............................................ 12
   2.5 Acta de Definición de la Metodología ........................... 13

**3. DESARROLLO** ...................................................... 14

**3.1 TOMA DE REQUERIMIENTOS** .......................................... 14
   3.1.1 Metodología de Recopilación ................................... 14
   3.1.2 Stakeholders Identificados .................................... 15
   3.1.3 Técnicas Utilizadas ........................................... 16
   3.1.4 Contexto Organizacional ....................................... 17

**3.2 ANÁLISIS DE LA TOMA DE REQUERIMIENTOS** .......................... 18
   3.2.1 Clasificación por Prioridad ................................... 18
   3.2.2 Análisis de Impacto y Viabilidad ............................. 19
   3.2.3 Matriz de Trazabilidad ........................................ 20
   3.2.4 Análisis de Riesgos ........................................... 21

**3.3 REQUISITOS FUNCIONALES Y NO FUNCIONALES** ........................ 22
   3.3.1 Requerimientos Funcionales (RF) ............................... 22
   3.3.2 Requerimientos No Funcionales (RNF) ........................... 28
   3.3.3 Restricciones del Sistema ..................................... 30
   3.3.4 Supuestos del Proyecto ........................................ 31

**3.4 CARTA GANTT DEL PROYECTO** ........................................ 32
   3.4.1 Cronograma General ............................................ 32
   3.4.2 Cronograma por Módulos ........................................ 33
   3.4.3 Hitos y Entregables ........................................... 38
   3.4.4 Dependencias Críticas ......................................... 39

**3.5 DIAGRAMAS DE ACTIVIDADES** ........................................ 40
   3.5.1 Diagrama General del Sistema .................................. 40
   3.5.2 Proceso de Preinscripción ..................................... 41
   3.5.3 Proceso de Validación Territorial ............................. 42
   3.5.4 Proceso de Gestión de Pagos ................................... 43
   3.5.5 Proceso de Acreditación ....................................... 44

**3.6 DIAGRAMA DE CLASES** .............................................. 45
   3.6.1 Arquitectura General del Sistema .............................. 45
   3.6.2 Módulo de Usuarios y Autenticación ............................ 46
   3.6.3 Módulo de Cursos .............................................. 47
   3.6.4 Módulo de Preinscripciones .................................... 48
   3.6.5 Módulo de Pagos ............................................... 49
   3.6.6 Módulo de Archivos ............................................ 50
   3.6.7 Módulo de Notificaciones ...................................... 51

**3.7 DIAGRAMAS DE SECUENCIA** .......................................... 52
   3.7.1 Secuencia de Autenticación .................................... 52
   3.7.2 Secuencia de Preinscripción ................................... 53
   3.7.3 Secuencia de Procesamiento de Pagos ........................... 54
   3.7.4 Secuencia de Validación Territorial ........................... 55
   3.7.5 Secuencia de Generación de Reportes ........................... 56
   3.7.6 Secuencia de Notificaciones ................................... 57

**3.8 MOCKUPS DEL DISEÑO** .............................................. 58
   3.8.1 Wireframes de Baja Fidelidad .................................. 58
   3.8.2 Prototipos de Alta Fidelidad .................................. 59
   3.8.3 Diseño Responsive ............................................. 62
   3.8.4 Guía de Estilos y Componentes ................................. 63

**4. PROPUESTA** ....................................................... 64
   4.1 Arquitectura Tecnológica Propuesta ............................. 64
   4.2 Plan de Implementación .......................................... 66
   4.3 Estrategia de Testing y Calidad ................................. 68
   4.4 Plan de Despliegue y Mantenimiento ............................. 69
   4.5 Análisis Costo-Beneficio ....................................... 70
   4.6 Recomendaciones y Consideraciones Futuras ....................... 71

**CONCLUSIONES** ...................................................... 72

**BIBLIOGRAFÍA** ...................................................... 73

**ANEXOS** ............................................................ 74
   Anexo A: Diagramas UML Completos .................................... 74
   Anexo B: Especificaciones Técnicas Detalladas ...................... 75
   Anexo C: Documentación de APIs ...................................... 76
   Anexo D: Plan de Testing Detallado .................................. 77

---

# 1. INTRODUCCIÓN DEL PROYECTO

## 1.1 Antecedentes y Contexto

El Sistema de Gestión Integral para Cursos Scouts (SGICS) surge como una necesidad imperativa para modernizar y digitalizar los procesos de gestión de inscripciones, cursos y actividades formativas dentro de la organización Scouts de Chile, específicamente en la Región del Bío-Bío.

La Asociación de Guías y Scouts de Chile es una organización educativa que desarrolla actividades de formación y capacitación para jóvenes y adultos voluntarios. Actualmente, la región del Bío-Bío maneja aproximadamente 2,500 scouts activos distribuidos en 45 grupos locales, organizados territorialmente en distritos y zonas.

**Contexto Organizacional Actual:**

La estructura territorial de Scouts Chile - Región Bío-Bío se organiza de la siguiente manera:

- **Nivel Regional:** Coordinación general de la región
- **Nivel Zonal:** Agrupación de varios distritos (3 zonas principales)
- **Nivel Distrital:** Conjunto de grupos scouts (8 distritos)
- **Nivel Grupal:** Unidad básica organizacional (45 grupos activos)

**Tipos de Cursos Gestionados:**

El sistema debe manejar diferentes tipos de actividades formativas:

1. **Cursos de Formación:** Capacitación para dirigentes nuevos
2. **Cursos de Perfeccionamiento:** Actualización para dirigentes experimentados
3. **Cursos Especializados:** Formación técnica específica (primeros auxilios, aire libre, etc.)
4. **Eventos Masivos:** Encuentros regionales y nacionales
5. **Actividades Zonales:** Eventos de coordinación territorial

**Proceso Formativo Scout:**

Cada participante debe completar un proceso formativo que incluye:
- Inscripción previa con documentación específica
- Validación territorial (grupo → distrito → zona → región)
- Confirmación de pago y cupo
- Participación en actividades presenciales
- Evaluación y certificación
- Emisión de credenciales y certificados

## 1.2 Problemática Identificada

Después de un análisis exhaustivo de los procesos actuales mediante entrevistas con 12 stakeholders clave, observación directa de workflows y revisión de documentación existente, se han identificado los siguientes problemas críticos:

**1. Gestión Manual y Fragmentada (Criticidad: Alta)**

El 85% de los procesos se realizan de forma manual utilizando:
- Planillas Excel independientes por curso
- Documentos Word con formularios estáticos
- Comunicación vía WhatsApp y correo electrónico
- Archivos físicos y digitales dispersos en múltiples ubicaciones

*Impacto medido:*
- Tiempo promedio de procesamiento por inscripción: 45 minutos
- Errores de transcripción: 15% de las inscripciones requieren corrección
- Pérdida de documentos: 12% mensual de formularios extraviados

**2. Falta de Trazabilidad (Criticidad: Alta)**

La ausencia de un sistema centralizado genera:
- Imposibilidad de conocer el estado real de inscripciones
- Duplicación de esfuerzos entre niveles territoriales
- Falta de visibilidad para coordinadores regionales
- Dificultad para generar reportes consolidados

*Evidencia cuantitativa:*
- 23% de inscripciones duplicadas por falta de comunicación
- 67% de consultas de estado requieren contacto telefónico
- Tiempo promedio para generar reporte regional: 8 días

**3. Problemas de Validación Territorial (Criticidad: Alta)**

El proceso de validación multinivel presenta:
- Cuellos de botella en validadores de distrito
- Falta de criterios homogéneos de validación
- Demoras por ausencia temporal de validadores
- Inconsistencias en documentación requerida

*Métricas de impacto:*
- Tiempo promedio de validación grupal: 3 días
- Tiempo promedio de validación distrital: 7 días
- Tiempo promedio de validación zonal: 5 días
- 18% de inscripciones requieren re-validación por errores

**4. Control Financiero Deficiente (Criticidad: Media)**

La gestión de pagos presenta problemas de:
- Falta de trazabilidad de transacciones
- Demoras en confirmación de cupos por pagos
- Dificultad para generar reportes financieros
- Procesos manuales de reconciliación bancaria

*Indicadores actuales:*
- Tiempo promedio de confirmación de pago: 72 horas
- Errores de conciliación: 8% de los pagos
- Pagos no identificados: 5% mensual
- Tiempo de generación de reporte financiero: 5 días

**5. Comunicación Ineficiente (Criticidad: Media)**

Los canales de comunicación actuales generan:
- Información dispersa en múltiples plataformas
- Falta de notificaciones automáticas de cambios de estado
- Sobrecarga de coordinadores con consultas repetitivas
- Inconsistencia en información comunicada

*Mediciones realizadas:*
- 156 consultas promedio semanales por WhatsApp
- 89 correos promedio diarios de coordinación
- 34% de información desactualizada en comunicaciones
- Tiempo de respuesta promedio: 4.2 horas

## 1.3 Objetivos del Proyecto

### 1.3.1 Objetivo General

Desarrollar e implementar un sistema web integral que digitalice y automatice los procesos de gestión de inscripciones, validación territorial, control de pagos y acreditación de cursos scouts, reduciendo tiempos operativos en un 70% y mejorando la trazabilidad al 100% de los procesos.

### 1.3.2 Objetivos Específicos

**OE1: Digitalización de Procesos de Inscripción**
- Crear un formulario web responsivo para preinscripciones
- Implementar wizard multi-paso con auto-guardado
- Integrar validación automática de RUT y datos personales
- Establecer carga automática de documentos con validación de formato
- **Meta cuantificable:** Reducir tiempo de inscripción de 45 a 10 minutos

**OE2: Automatización de Validación Territorial**
- Desarrollar flujo de validación multinivel (Grupo → Distrito → Zona → Región)
- Implementar notificaciones automáticas de cambio de estado
- Crear dashboard para validadores con cola de trabajo priorizada
- Establecer criterios de validación configurables por tipo de curso
- **Meta cuantificable:** Reducir tiempo total de validación de 15 a 5 días

**OE3: Optimización de Control Financiero**
- Implementar registro de pagos individual y masivo
- Crear reconciliación automática con extractos bancarios
- Desarrollar confirmación automática de cupos por pago
- Generar reportes financieros en tiempo real
- **Meta cuantificable:** Reducir tiempo de confirmación de pago de 72 a 2 horas

**OE4: Mejora de Comunicación y Trazabilidad**
- Desarrollar centro de notificaciones multicanal (email, SMS, in-app)
- Crear dashboard ejecutivo con métricas en tiempo real
- Implementar sistema de auditoría completo
- Establecer comunicación automatizada con participantes
- **Meta cuantificable:** Reducir consultas manuales en 80%

**OE5: Generación Automática de Acreditación**
- Crear sistema de códigos QR únicos por participante
- Implementar validación presencial con lectura QR
- Desarrollar certificados digitales con firma electrónica
- Establecer trazabilidad completa de asistencia y certificación
- **Meta cuantificable:** Reducir tiempo de acreditación de 15 a 2 días

### 1.3.3 Indicadores de Éxito

**Indicadores de Eficiencia:**
- Tiempo promedio de inscripción: ≤ 10 minutos (actual: 45 min)
- Tiempo total de validación: ≤ 5 días (actual: 15 días)
- Tiempo de confirmación de pago: ≤ 2 horas (actual: 72 horas)
- Tiempo de generación de reportes: ≤ 5 minutos (actual: 8 días)

**Indicadores de Calidad:**
- Tasa de errores en inscripciones: ≤ 2% (actual: 15%)
- Tasa de documentos perdidos: 0% (actual: 12%)
- Precisión de datos financieros: ≥ 99% (actual: 92%)
- Satisfacción de usuarios: ≥ 4.5/5.0

**Indicadores de Adopción:**
- Porcentaje de inscripciones digitales: ≥ 95%
- Uso del sistema por validadores: 100%
- Adopción por coordinadores regionales: 100%
- Reducción de consultas telefónicas: ≥ 80%

## 1.4 Alcance y Limitaciones

### 1.4.1 Alcance del Sistema

**Módulos Incluidos:**

1. **Gestión de Usuarios y Autenticación**
   - Sistema de login con JWT
   - Roles jerárquicos (6 niveles: Superadmin → Participante)
   - Gestión de perfiles y preferencias
   - Control de acceso basado en roles (RBAC)

2. **Gestión de Cursos**
   - CRUD completo de cursos con validaciones de negocio
   - Configuración de cupos por rama scout
   - Asignación de formadores y coordinadores
   - Control de estados (Draft → Active → Completed → Archived)
   - Calendario de fechas importantes

3. **Sistema de Preinscripciones**
   - Wizard multi-paso con 7 estados definidos
   - Validación territorial automatizada
   - Carga de documentos con antivirus
   - Auto-save y recuperación de sesión
   - Notificaciones automáticas de cambio de estado

4. **Gestión Financiera**
   - Registro individual y masivo de pagos
   - Importación desde Excel/CSV con validaciones
   - Reconciliación automática bancaria
   - Confirmación automática de cupos
   - Dashboard financiero con KPIs

5. **Sistema de Archivos**
   - Almacenamiento seguro con encriptación
   - Control de versiones
   - Integración con antivirus
   - Gestión de permisos por documento
   - Backup automático

6. **Centro de Notificaciones**
   - Notificaciones in-app en tiempo real
   - Envío de correos masivos con templates
   - Integración SMS para notificaciones críticas
   - Dashboard de métricas de comunicación
   - Configuración de preferencias por usuario

**Funcionalidades Transversales:**

- Sistema de auditoría completo con logs detallados
- Reportes ejecutivos configurables
- API REST completa para integraciones futuras
- Responsive design para móviles y tablets
- Sistema de backup y recuperación automático
- Monitoreo y alertas de performance
- Documentación técnica y de usuario completa

### 1.4.2 Limitaciones del Proyecto

**Limitaciones Técnicas:**

1. **Base de Datos Legacy**
   - El sistema debe mantener compatibilidad con SQL Server 2019
   - Algunos datos históricos pueden requerir migración manual
   - Limitaciones de rendimiento por estructura heredada

2. **Integraciones Externas**
   - No incluye integración con sistemas de pago online (Webpay, etc.)
   - SMS limitado a proveedor nacional específico
   - No incluye integración con redes sociales

3. **Funcionalidades Excluidas**
   - Sistema de evaluaciones online complejas
   - Chat en tiempo real entre participantes
   - Sistema de gamificación o badges
   - Integración con sistemas de video conferencia
   - App móvil nativa (solo web responsiva)

**Limitaciones de Alcance:**

1. **Geográficas**
   - Implementación inicial solo para Región del Bío-Bío
   - No incluye otras regiones de Scouts Chile
   - Validación territorial específica para estructura regional

2. **Organizacionales**
   - No modifica procesos de capacitación presencial
   - No reemplaza roles de formadores y coordinadores
   - No incluye gestión de recursos materiales (equipos, instalaciones)

3. **Temporales**
   - Proyecto limitado a 12 semanas de desarrollo
   - No incluye migración automática de datos históricos
   - Capacitación de usuarios limitada a 2 semanas

### 1.4.3 Supuestos del Proyecto

**Supuestos Organizacionales:**
- Disponibilidad de stakeholders para validaciones semanales
- Compromiso de adopción por parte de coordinadores regionales
- Mantenimiento de estructura territorial actual durante el proyecto
- Acceso a servidores y infraestructura corporativa

**Supuestos Técnicos:**
- Conectividad estable a internet en todas las ubicaciones
- Disponibilidad de servidor SQL Server 2019 con acceso remoto
- Capacidad de procesamiento adecuada para 500 usuarios concurrentes
- Disponibilidad de cuentas de correo corporativo para notificaciones

**Supuestos de Usuarios:**
- Nivel básico de alfabetización digital en usuarios finales
- Disponibilidad para capacitación de 8 horas por rol
- Acceso a dispositivos con navegadores modernos
- Compromiso con migración desde procesos manuales

## 1.5 Justificación del Proyecto

### 1.5.1 Justificación Técnica

**Modernización Tecnológica Necesaria:**

La infraestructura actual de gestión manual presenta obsolescencia técnica que impacta directamente la eficiencia operacional. La implementación de SGICS utilizando tecnologías modernas (Django 5.0, Vue 3, SQL Server 2019) garantiza:

- **Escalabilidad:** Capacidad de crecimiento sin degradación de performance
- **Mantenibilidad:** Código estructurado con patrones de diseño probados
- **Seguridad:** Implementación de mejores prácticas (OWASP Top 10)
- **Integración:** APIs REST que permiten futuras expansiones
- **Observabilidad:** Monitoring y logging para detección proactiva de problemas

### 1.5.2 Justificación Económica

**Análisis Costo-Beneficio Cuantificado:**

**Costos del Proyecto:**
- Desarrollo (14 desarrolladores x 12 semanas): $168,000 USD
- Infraestructura y licencias: $12,000 USD anuales
- Capacitación y adopción: $8,000 USD
- **Total inversión inicial:** $188,000 USD

**Beneficios Económicos Anuales:**
- Reducción de horas administrativas: $45,000 USD/año
- Eliminación de errores operacionales: $18,000 USD/año
- Optimización de recursos de coordinación: $22,000 USD/año
- Reducción de costos de comunicación: $8,000 USD/año
- **Total beneficios anuales:** $93,000 USD

**Retorno de Inversión (ROI):**
- Payback period: 2.02 años
- ROI a 3 años: 148%
- VPN (3 años, 10% descuento): $141,500 USD

### 1.5.3 Justificación Operacional

**Mejora de Procesos Organizacionales:**

1. **Eliminación de Cuellos de Botella**
   - Paralelización de validaciones territoriales
   - Automatización de tareas repetitivas
   - Reducción de dependencias en personas específicas

2. **Mejora en Calidad de Datos**
   - Validaciones automáticas en tiempo real
   - Eliminación de transcripción manual
   - Consistencia en formato y estructura de información

3. **Optimización de Recursos Humanos**
   - Liberación de tiempo administrativo para actividades formativas
   - Reducción de consultas repetitivas a coordinadores
   - Mejora en satisfacción laboral por eliminación de tareas tediosas

4. **Fortalecimiento de Control de Gestión**
   - Métricas en tiempo real para toma de decisiones
   - Trazabilidad completa para auditorías
   - Identificación proactiva de problemas operacionales

### 1.5.4 Justificación Estratégica

**Alineación con Objetivos Organizacionales:**

1. **Modernización Institutional**
   - Proyección de imagen moderna y eficiente
   - Adopción de mejores prácticas de gestión
   - Preparación para crecimiento organizacional futuro

2. **Mejora en Experiencia del Usuario**
   - Proceso de inscripción intuitivo y rápido
   - Comunicación oportuna y personalizada
   - Acceso 24/7 a información relevante
   - Reducción significativa de fricciones administrativas

3. **Escalabilidad Organizacional**
   - Capacidad de gestionar crecimiento sin aumento proporcional de recursos
   - Replicabilidad del modelo a otras regiones
   - Base sólida para futuras innovaciones tecnológicas

4. **Cumplimiento y Governanza**
   - Trazabilidad completa para auditorías externas
   - Cumplimiento con normativas de protección de datos
   - Mejora en transparencia de procesos organizacionales

---

# 2. METODOLOGÍA A OCUPAR Y SU ACTA DE DEFINICIÓN

## 2.1 Selección de Metodología Scrum

### 2.1.1 Justificación de la Metodología Seleccionada

Para el desarrollo del Sistema SGICS se ha seleccionado la metodología **Scrum** como framework ágil de gestión de proyectos, basándose en las siguientes justificaciones técnicas y organizacionales:

**Razones Técnicas:**

1. **Complejidad del Proyecto:** SGICS presenta alta complejidad técnica con 6 módulos interdependientes, requiriendo iteraciones cortas para validación continua y ajustes tempranos.

2. **Requisitos Evolutivos:** Los requerimientos del sistema pueden evolucionar durante el desarrollo basándose en feedback de usuarios y stakeholders scouts, característica que Scrum maneja eficientemente.

3. **Integración Continua:** La naturaleza modular del sistema requiere integración frecuente entre componentes, facilitada por los sprints de 2 semanas que permiten validación constante.

4. **Equipo Distribuido:** Con 14 desarrolladores organizados en 6 módulos especializados, Scrum proporciona estructura necesaria para coordinación sin micromanagement.

**Razones Organizacionales:**

1. **Stakeholder Engagement:** La organización scout requiere visibilidad constante del progreso y capacidad de influir en el desarrollo, característica central de Scrum.

2. **Entrega de Valor Temprana:** Cada sprint entrega funcionalidad demostrable, permitiendo validación incremental con usuarios reales.

3. **Gestión de Riesgos:** Los sprints cortos permiten identificación y mitigación temprana de riesgos técnicos y de negocio.

4. **Transparencia:** La organización scout valora la transparencia en procesos, alineándose perfectamente con los principios de Scrum.

### 2.1.2 Adaptaciones Específicas para SGICS

**Estructura de Sprints Adaptada:**

- **Duración:** 2 semanas (10 días hábiles)
- **Total de Sprints:** 6 sprints
- **Capacidad del Equipo:** 185 story points por sprint (promedio)
- **Ceremonias:** Adaptadas para equipo distribuido con herramientas digitales

**Definición de Ready (DoR) Específica para SGICS:**

1. **User Story completa** con criterios de aceptación SMART
2. **Estimación consensuada** por el equipo técnico del módulo correspondiente  
3. **Dependencias identificadas** y coordinadas con otros módulos
4. **Diseño UI/UX aprobado** cuando corresponda
5. **Criterios de testing definidos** incluyendo casos edge
6. **Validación de stakeholder scout** para historias de negocio

**Definición de Done (DoD) Específica para SGICS:**

1. **Código desarrollado y revisado** por al menos un peer del equipo
2. **Tests unitarios implementados** con cobertura mínima 70%
3. **Tests de integración passed** para APIs y flujos críticos
4. **Documentación técnica actualizada** en formato Markdown
5. **Validación en ambiente staging** con datos de prueba scouts
6. **Aprobación de Product Owner** basada en demostración funcional
7. **Code quality gate passed** en SonarQube (0 vulnerabilidades críticas)
8. **Performance requirements met** (p95 < 2 segundos para endpoints críticos)

## 2.2 Roles y Responsabilidades

### 2.2.1 Roles Scrum Principales

**Product Owner (PO):**
- **Responsable:** Coordinador Regional Scouts Bío-Bío
- **Responsabilidades Específicas:**
  - Definir y priorizar Product Backlog basado en necesidades organizacionales scouts
  - Validar user stories y criterios de aceptación con perspectiva de usuario final
  - Aprobar incrementos de producto al final de cada sprint
  - Tomar decisiones sobre alcance y trade-offs durante el desarrollo
  - Comunicar visión del producto y objetivos de negocio al equipo técnico
  - Coordinar con stakeholders scouts para gathering de requirements continuos

**Scrum Master:**
- **Responsable:** Ricardo Sanhueza (Technical Lead & DevOps)
- **Responsabilidades Específicas:**
  - Facilitar ceremonias Scrum y resolver impedimentos técnicos y organizacionales
  - Asegurar adherencia a metodología y mejora continua del proceso
  - Coordinar entre los 6 equipos modulares y gestionar dependencias inter-módulos
  - Mantener métricas de equipo (velocity, burndown, cycle time) y reportar progreso
  - Coaching del equipo en prácticas ágiles y resolución de conflictos
  - Interface con stakeholders externos y gestión de comunicación del proyecto

**Development Team - Estructura Modular:**

El equipo de desarrollo se organiza en 6 sub-equipos especializados por módulo, manteniendo principios de cross-functionality dentro de cada grupo:

### 2.2.2 Estructura Detallada por Módulos

**Módulo 1: Infraestructura y Archivos**
- **Technical Lead:** Giovanni Pacheco (DevOps Specialist)
- **Developer:** Ricardo Sanhueza (Full-Stack + Security)
- **Responsabilidades:**
  - Arquitectura de sistema y CI/CD pipeline
  - Gestión de archivos, storage y backup
  - Monitoring, observability y performance optimization
  - Security implementation y compliance

**Módulo 2: Autenticación y Cursos**  
- **Technical Lead:** Nicolás Irribarra (Security Specialist)
- **Developer:** Lucas Guerrero (Backend Developer)
- **Responsabilidades:**
  - Sistema de autenticación JWT y RBAC
  - CRUD de cursos con validaciones de negocio
  - Control de acceso y auditoria de seguridad
  - Gestión de permisos jerárquicos scouts

**Módulo 3: UI/UX y Notificaciones**
- **Technical Lead:** Lucas Betanzos (Frontend Specialist)
- **UI/UX Designer:** Rodrigo Jara  
- **Backend Developer:** Marisol Sáez
- **Security Developer:** Josué Vásquez
- **Responsabilidades:**
  - Interfaz de usuario responsive y accesible
  - Sistema de notificaciones multicanal
  - Experiencia de usuario y design system
  - Componentes reutilizables y testing frontend

**Módulo 4: Preinscripciones y Formularios**
- **Technical Lead:** Miguel Contreras (Full-Stack)
- **Backend Developer:** Juan Orrego
- **Frontend Developer:** Leonardo López  
- **Responsabilidades:**
  - Wizard de preinscripción multi-paso
  - Máquina de estados y validación territorial
  - Integración con sistema de archivos
  - Auto-save y recuperación de sesión

**Módulo 5: Pagos y Finanzas**
- **Solo Developer:** Camilo Colivoro (Financial Systems Specialist)
- **Responsabilidades:**
  - Sistema de pagos individual y masivo
  - Reconciliación bancaria y reportes financieros
  - Integración con APIs de pago
  - Dashboard de KPIs financieros

**Módulo 6: QA y Dashboard**
- **QA Lead:** Nicolás González
- **Documentation Specialist:** Juan Herrera
- **Responsabilidades:**
  - Testing de integración end-to-end
  - Dashboard ejecutivo y reportes
  - Documentación técnica y de usuario
  - Quality assurance cross-módulos

### 2.2.3 Matriz de Responsabilidades RACI

| Actividad / Rol | PO | SM | Tech Leads | Developers | QA Team |
|-----------------|----|----|------------|------------|---------|
| Definir User Stories | A | C | C | I | I |
| Estimar Stories | C | R | A | A | C |
| Sprint Planning | A | R | A | A | C |
| Daily Standups | I | R | A | A | A |
| Development | C | I | A | R | C |
| Code Review | I | C | R | A | I |
| Testing | C | C | A | A | R |
| Sprint Review | A | R | A | A | A |
| Retrospective | C | R | A | A | A |
| Release Decision | A | C | C | I | C |

**Leyenda:** R=Responsible, A=Accountable, C=Consulted, I=Informed

## 2.3 Artefactos Scrum

### 2.3.1 Product Backlog

**Herramientas de Gestión:**
- **Plataforma Principal:** Jira Software Cloud
- **Integración:** GitHub Issues para tracking técnico
- **Documentación:** Confluence para especificaciones detalladas

**Estructura del Product Backlog:**

```
Epic → Feature → User Story → Task → Sub-task
```

**Ejemplo de Jerarquía para SGICS:**

```
Epic: Gestión de Preinscripciones
├── Feature: Wizard Multi-paso  
│   ├── US: Como participante, quiero completar mi preinscripción en pasos guiados
│   │   ├── Task: Implementar Step 1 - Selección de curso
│   │   ├── Task: Implementar Step 2 - Datos personales
│   │   └── Task: Implementar Step 3 - Carga de documentos
│   └── US: Como participante, quiero recuperar mi preinscripción incompleta
└── Feature: Validación Territorial
    ├── US: Como validador grupal, quiero revisar preinscripciones de mi grupo
    └── US: Como validador distrital, quiero aprobar preinscripciones validadas
```

**Priorización del Product Backlog:**

Utiliza el framework **MoSCoW adaptado para contexto scouts:**

1. **Must Have (Crítico para MVP):**
   - Autenticación y gestión de usuarios
   - Wizard de preinscripción básico
   - Validación territorial simple
   - Gestión básica de cursos
   - Dashboard con métricas esenciales

2. **Should Have (Importante para Release 1):**
   - Notificaciones automáticas
   - Reportes financieros
   - Sistema de archivos avanzado
   - Integración de pagos

3. **Could Have (Deseable para futuras versiones):**
   - Chat integrado
   - Gamificación y badges
   - Integración con redes sociales
   - App móvil nativa

4. **Won't Have (Fuera de alcance actual):**
   - Sistema de video conferencias
   - E-learning platform completa
   - Integración con sistemas externos scouts

### 2.3.2 Sprint Backlog

**Gestión del Sprint Backlog:**

Cada módulo mantiene su Sprint Backlog en Jira con las siguientes características:

**Campos Obligatorios por User Story:**
- **Story Points:** Estimación en escala Fibonacci (1, 2, 3, 5, 8, 13)
- **Módulo Owner:** Equipo responsable del desarrollo
- **Priority:** Critical, High, Medium, Low
- **Component:** Módulo específico del sistema
- **Sprint:** Sprint asignado
- **Status:** Todo, In Progress, In Review, Testing, Done

**Board Configuration:**
```
TODO → IN PROGRESS → CODE REVIEW → TESTING → DONE
   ↓        ↓           ↓           ↓        ↓
 Ready    Doing    Reviewing    Validating  ✓
```

**Estimation Poker:**
- **Herramienta:** Planning Poker online (PlanITPoker.com)
- **Baseline Stories:** Se establecen 5 user stories de referencia para calibración
- **Re-estimation:** Permitida hasta 24 horas antes del sprint start
- **Capacity Planning:** 80% de capacidad teórica por desarrollador

### 2.3.3 Incremento de Producto

**Definición del Incremento para SGICS:**

Cada sprint produce un **incremento potencialmente entregable** que incluye:

1. **Software Funcionando:**
   - Features implementadas y testeadas
   - Deployadas en ambiente staging
   - Validadas por Product Owner

2. **Documentación Actualizada:**
   - API documentation (Swagger/OpenAPI)
   - User documentation (Markdown)
   - Technical specifications updates
   - Release notes

3. **Testing Evidence:**
   - Unit test coverage report (mínimo 70%)
   - Integration test results
   - Performance test results (cuando aplique)
   - Security scan results (SonarQube)

**Estrategia de Release:**

- **Continuous Integration:** Cada commit triggerea build automático
- **Staging Deployment:** Cada merge a develop deploye a staging automáticamente  
- **Production Release:** Manual trigger al final de cada sprint (opcional)
- **Rollback Strategy:** Blue-Green deployment con capacidad de rollback en <5 minutos

## 2.4 Eventos y Ceremonias

### 2.4.1 Sprint Planning

**Duración:** 4 horas para sprint de 2 semanas
**Participantes:** Todo el Scrum Team (PO, SM, Development Teams)
**Modalidad:** Híbrida (presencial + virtual)

**Agenda Detallada:**

**Parte 1 - Sprint Goal & Scope (2 horas)**
```
09:00-09:15 → Revisión de métricas del sprint anterior
09:15-09:30 → Presentación del Sprint Goal por PO
09:30-10:15 → Selección de User Stories del Product Backlog
10:15-10:30 → Break
10:30-11:00 → Refinamiento y clarificación de historias seleccionadas
```

**Parte 2 - Task Breakdown & Commitment (2 horas)**  
```
11:00-11:30 → Breakdown de User Stories en tareas técnicas
11:30-12:00 → Estimación de tareas y identificación de dependencias
12:00-12:30 → Commitment del equipo y validación de capacidad
12:30-13:00 → Definition of Done review y cierre
```

**Deliverables del Sprint Planning:**
- Sprint Goal claramente definido y comunicado
- Sprint Backlog completo con tasks estimadas
- Dependencias identificadas y plan de mitigación
- Capacity commitment por equipo/módulo
- Risk assessment y contingency plans

### 2.4.2 Daily Stand-up

**Duración:** 15 minutos máximo
**Horario:** 09:00 AM (Chile Continental)
**Modalidad:** Virtual (Google Meet) + Async updates

**Estructura Optimizada para Equipos Distribuidos:**

**Sync Daily (Lunes, Miércoles, Viernes):**
Cada desarrollador responde:
1. **Qué hice ayer** que contribuye al Sprint Goal
2. **Qué haré hoy** para avanzar hacia el Sprint Goal  
3. **Qué impedimentos tengo** que requieren ayuda del equipo

**Async Daily (Martes, Jueves):**
Update por Slack con template estructurado:
```
🎯 Sprint Goal Progress: [% completion]
✅ Yesterday: [accomplishments]  
🔄 Today: [planned work]
🚫 Blockers: [impediments + help needed]
🔗 Dependencies: [waiting for / providing to others]
```

**Escalation Protocol:**
- **Impediment crítico:** Immediate Slack mention @scrum-master
- **Cross-team dependency:** Tag relevant team lead
- **Technical blocker:** Schedule focused session within 4 hours

### 2.4.3 Sprint Review

**Duración:** 2 horas para sprint de 2 semanas
**Participantes:** Scrum Team + Stakeholders Scouts + End Users
**Modalidad:** Presencial (cuando posible) + streaming para stakeholders remotos

**Agenda Estructurada:**

**Demo Session (90 minutos)**
```
14:00-14:10 → Sprint Goal recap y context setting
14:10-14:30 → Módulo 1 & 2 demo (Infraestructura + Autenticación + Cursos)
14:30-14:50 → Módulo 3 & 4 demo (UI/UX + Preinscripciones)  
14:50-15:10 → Módulo 5 & 6 demo (Pagos + Dashboard + QA)
15:10-15:25 → Break
15:25-15:30 → Integration demo (end-to-end flow)
```

**Feedback & Planning Session (30 minutos)**
```
15:30-15:45 → Stakeholder feedback collection
15:45-16:00 → Product Backlog adjustments discussion
```

**Feedback Collection Methods:**
- **Live polling:** Mentimeter para feedback cuantitativo
- **Structured interviews:** 5-7 preguntas específicas por módulo
- **User testing:** Sesiones grabadas con scout real users
- **Retrospective input:** Items para próxima retrospectiva

### 2.4.4 Sprint Retrospective

**Duración:** 1.5 horas
**Participantes:** Solo Development Team + Scrum Master
**Modalidad:** Virtual con herramientas colaborativas

**Formato: Start-Stop-Continue Adaptado**

**Preparación (15 minutos):**
- Review de métricas: velocity, burndown, cycle time, quality metrics
- Individual reflection usando Miro/Figma board

**Retrospectiva Structured (60 minutos):**

**Round 1 - Data Gathering (20 min)**
```
🟢 START: ¿Qué deberíamos empezar a hacer?
🔴 STOP: ¿Qué deberíamos dejar de hacer?  
🟡 CONTINUE: ¿Qué está funcionando bien?
🔵 IMPROVE: ¿Qué podemos optimizar?
```

**Round 2 - Insights Generation (20 min)**
- Clustering de feedback similar
- Root cause analysis para problemas identificados
- Voting en las 3 áreas más críticas

**Round 3 - Action Planning (20 min)**  
- Definir acciones específicas y medibles
- Asignar responsables y timelines
- Establecer success criteria

**Follow-up & Commitment (15 minutos):**
- Documentation en Confluence
- Calendar appointments para action items
- Success metrics definition

**Retrospective Outcome Examples:**
- **Process improvement:** Nuevo Definition of Done item
- **Technical debt:** Dedicated time allocation para refactoring  
- **Team dynamics:** Pair programming schedule
- **Tools upgrade:** Migration a nueva herramienta
- **Knowledge sharing:** Tech talk interno schedule

## 2.5 Acta de Definición de la Metodología

### 2.5.1 Documento Formal de Adopción

**ACTA DE DEFINICIÓN METODOLÓGICA**
**Proyecto:** Sistema de Gestión Integral para Cursos Scouts (SGICS)
**Fecha:** 03 de Octubre de 2025
**Versión:** 1.0

### 2.5.2 Compromisos del Equipo

**POR MEDIO DE LA PRESENTE**, el equipo de desarrollo del proyecto SGICS se compromete formalmente a:

**1. Adopción de Framework Scrum**
- Implementar Scrum como metodología oficial de gestión del proyecto
- Respetar roles, ceremonias y artefactos definidos en este documento
- Mantener disciplina en timeboxes y commitment establecidos
- Priorizar comunicación y colaboración por encima de procesos rígidos

**2. Definiciones Operacionales**
- **Sprint Length:** 2 semanas exactas (10 días hábiles)
- **Team Velocity:** Target de 185 story points por sprint para todo el equipo
- **Quality Standards:** Mínimo 70% code coverage y 0 vulnerabilidades críticas
- **Communication Protocol:** Daily sync/async según calendario establecido

**3. Roles y Responsabilidades Acordadas**
- **Product Owner:** Coordinador Regional con dedicación mínima 20% proyecto
- **Scrum Master:** Ricardo Sanhueza con disponibilidad full-time
- **Development Teams:** 14 desarrolladores organizados en 6 módulos especializados
- **Stakeholders:** Participación en Sprint Reviews y validación de incrementos

**4. Herramientas y Prácticas**
- **Project Management:** Jira Software como single source of truth
- **Code Repository:** GitHub con branch strategy GitFlow
- **CI/CD:** GitHub Actions con quality gates obligatorios
- **Communication:** Slack para async + Google Meet para ceremonias

### 2.5.3 Métricas y Indicadores de Éxito Metodológico

**Métricas de Proceso:**
- **Sprint Goal Achievement:** Target >90% sprints meeting objetivo
- **Velocity Consistency:** Variación <15% entre sprints consecutivos  
- **Ceremony Attendance:** >95% participación en eventos críticos
- **Retrospective Actions:** >80% action items completados en siguiente sprint

**Métricas de Calidad:**
- **Definition of Done Compliance:** 100% de stories cumpliendo DoD
- **Technical Debt:** Trend decreciente medido por SonarQube
- **Bug Escape Rate:** <5% bugs encontrados en producción vs testing
- **Customer Satisfaction:** >4.5/5.0 en Sprint Reviews

**Métricas de Team Performance:**
- **Cycle Time:** Target <5 días promedio por story
- **Code Review Time:** <24 horas promedio para approval
- **Build Success Rate:** >95% de builds pasando sin intervención manual
- **Knowledge Sharing:** Mínimo 1 tech talk interno por sprint

### 2.5.4 Governance y Escalation

**Proceso de Cambios a la Metodología:**
1. **Propuesta:** Cualquier team member puede proponer ajustes metodológicos
2. **Discusión:** Análisis en retrospective o sesión dedicada
3. **Consenso:** Acuerdo de mínimo 80% del equipo de desarrollo
4. **Piloto:** Implementación experimental por 1 sprint
5. **Adopción:** Formalización si métricas mejoran o se mantienen

**Escalation Path para Conflictos:**
```
Level 1: Scrum Master (resolución dentro del equipo)
    ↓
Level 2: Technical Lead Council (decisión técnica)  
    ↓
Level 3: Product Owner + Sponsor (decisión de negocio)
    ↓
Level 4: Steering Committee (decisión estratégica)
```

**Revisión y Actualización del Acta:**
- **Frecuencia:** Revisión obligatoria cada 3 sprints (6 semanas)
- **Trigger Events:** Cambios significativos en equipo o alcance
- **Approval Process:** Consenso de Scrum Team + validación de PO
- **Documentation:** Versioning en Confluence con changelog detallado

### 2.5.5 Firmas y Compromisos

**COMPROMETEMOS NUESTRO MEJOR ESFUERZO** para el éxito del proyecto SGICS mediante la implementación disciplinada de esta metodología:

**Product Owner:** _________________________ Fecha: _________
Coordinador Regional Scouts Bío-Bío

**Scrum Master:** _________________________ Fecha: _________
Ricardo Sanhueza Henríquez

**Technical Leads:**
_________________________ Fecha: _________
Giovanni Pacheco Martínez (Módulo Infraestructura)

_________________________ Fecha: _________  
Nicolás Irribarra González (Módulo Autenticación)

_________________________ Fecha: _________
Lucas Betanzos Riquelme (Módulo UI/UX)

_________________________ Fecha: _________
Miguel Contreras Torres (Módulo Preinscripciones)

_________________________ Fecha: _________
Camilo Colivoro Ramírez (Módulo Pagos)

_________________________ Fecha: _________
Nicolás González Herrera (Módulo QA)

**Testigo Institucional:** _________________________ Fecha: _________
Representante INACAP - Escuela de Informática

---

**Esta acta constituye el compromiso formal del equipo con la excelencia metodológica y la entrega exitosa del Sistema SGICS para la comunidad scout de la Región del Bío-Bío.**
