# ANÁLISIS COMPLETO DE REQUERIMIENTOS - SGICS
## Sistema de Gestión Integral para Cursos Scouts

**Proyecto:** Sistema de Gestión Integral para Cursos Scouts (SGICS)  
**Cliente:** Scouts de Chile - Región del Bio Bio  
**Metodología:** Scrum - 6 Sprints de 2 semanas  
**Período:** 29 Septiembre 2025 - 20 Diciembre 2025 (12 semanas)  
**Equipo:** 14 desarrolladores distribuidos en 6 módulos especializados  
**Scrum Master:** Ricardo Sanhueza  

---

## 1. TOMA DE REQUERIMIENTOS

### 1.1 Metodología de Recopilación

**Técnicas Utilizadas:**
- **Entrevistas Estructuradas** con stakeholders clave (12 sesiones)
- **Talleres Colaborativos** con usuarios finales (4 talleres)
- **Análisis de Documentación** existente y procesos actuales
- **Observación Directa** de flujos de trabajo actuales
- **Benchmarking** con sistemas similares en organizaciones scouts

**Stakeholders Identificados:**
- **Directores de Grupo:** Toma de decisiones estratégicas
- **Dirigentes/Capacitadores:** Gestión de cursos y participantes
- **Secretarios Administrativos:** Procesamiento de documentos
- **Tesoreros:** Gestión financiera y confirmación de pagos
- **Participantes/Scouts:** Usuarios finales del sistema
- **Administradores TI:** Mantenimiento y soporte técnico

### 1.2 Contexto Organizacional

**Problemática Actual:**
- **Gestión Manual:** 85% de los procesos se realizan en papel
- **Duplicación de Datos:** Información repetida en múltiples planillas Excel
- **Pérdida de Documentos:** 15% de formularios extraviados mensualmente
- **Demoras en Acreditación:** Promedio de 45 días para certificación
- **Control Financiero Deficiente:** Falta de trazabilidad en pagos
- **Comunicación Fragmentada:** Sin sistema centralizado de notificaciones

**Objetivos Estratégicos:**
- **Digitalización Completa:** Migrar 100% de procesos a plataforma web
- **Reducción de Tiempos:** Acreditación en máximo 15 días
- **Trazabilidad Total:** Control completo de estados y transacciones
- **Mejora de Experiencia:** Interfaz intuitiva para todos los usuarios
- **Cumplimiento Normativo:** Adherencia a estándares scouts nacionales

---

## 2. ANÁLISIS DE LA TOMA DE REQUERIMIENTOS

### 2.1 Clasificación de Requerimientos por Prioridad

**ALTA PRIORIDAD (Must Have):**
- Sistema de autenticación y autorización por roles
- Gestión completa del flujo de inscripción a cursos
- Procesamiento y confirmación de pagos
- Generación automática de certificados
- Dashboard administrativo con métricas clave

**MEDIA PRIORIDAD (Should Have):**
- Sistema de notificaciones automáticas
- Reportes financieros detallados
- Importación masiva de participantes
- Integración con sistemas de pago externos
- Auditoría y logs de seguridad

**BAJA PRIORIDAD (Could Have):**
- Chat en tiempo real entre participantes
- Sistema de evaluaciones en línea
- Integración con redes sociales
- Sistema de gamificación con badges
- Módulo de reportes avanzados con BI

### 2.2 Análisis de Impacto y Viabilidad

**Matriz de Impacto vs. Complejidad:**

| Requerimiento | Impacto | Complejidad | Prioridad | Sprint |
|---------------|---------|-------------|-----------|---------|
| Autenticación RBAC | Alto | Media | Must | 1 |
| Flujo Inscripción | Alto | Alta | Must | 2-3 |
| Procesamiento Pagos | Alto | Media | Must | 3-4 |
| Dashboard Admin | Alto | Baja | Must | 1-2 |
| Notificaciones | Medio | Baja | Should | 4 |
| Reportes Financieros | Medio | Media | Should | 5 |
| Auditoría Seguridad | Alto | Media | Must | 2-5 |

### 2.3 Análisis de Riesgos de Requerimientos

**Riesgos Identificados:**
- **Cambios de Alcance:** Posibles modificaciones en reglamentos scouts
- **Complejidad Técnica:** Integración con múltiples sistemas de pago
- **Adopción Usuario:** Resistencia al cambio de procesos manuales
- **Rendimiento:** Carga simultánea durante períodos de inscripción
- **Seguridad:** Manejo de datos personales y transacciones financieras

**Estrategias de Mitigación:**
- Desarrollo iterativo con validación continua
- Pruebas de carga desde Sprint 3
- Capacitación intensiva a usuarios clave
- Implementación gradual por módulos
- Auditorías de seguridad en cada Sprint

---

## 3. REQUISITOS FUNCIONALES

### 3.1 Módulo de Autenticación y Autorización

**RF-001: Sistema de Login**
- **Descripción:** Permitir acceso seguro con email/contraseña
- **Actor:** Todos los usuarios
- **Precondiciones:** Usuario registrado en el sistema
- **Flujo Principal:**
  1. Usuario ingresa credenciales
  2. Sistema valida contra base de datos
  3. Genera token JWT con roles específicos
  4. Redirige a dashboard según perfil
- **Criterios de Aceptación:**
  - Login exitoso en menos de 3 segundos
  - Bloqueo automático tras 5 intentos fallidos
  - Token expira en 24 horas

**RF-002: Control de Acceso por Roles (RBAC)**
- **Descripción:** Gestionar permisos según jerarquía scouts
- **Roles Definidos:**
  - **Super Admin:** Acceso total al sistema
  - **Director de Grupo:** Gestión completa de su grupo
  - **Dirigente:** Administración de cursos asignados
  - **Secretario:** Gestión administrativa y documentos
  - **Tesorero:** Control financiero y confirmación pagos
  - **Participante:** Acceso a inscripciones y certificados
- **Criterios de Aceptación:**
  - Cada rol accede solo a funciones autorizadas
  - Herencia de permisos jerárquica
  - Logs de todas las acciones por rol

### 3.2 Módulo de Gestión de Cursos

**RF-003: Creación y Configuración de Cursos**
- **Descripción:** Permitir crear cursos con todos los parámetros
- **Actor:** Director de Grupo, Dirigente
- **Parámetros Configurables:**
  - Información básica (nombre, descripción, objetivos)
  - Fechas límite (inscripción, realización, certificación)
  - Capacidad máxima de participantes
  - Costo y modalidades de pago
  - Requisitos y documentos necesarios
  - Evaluaciones y criterios de aprobación
- **Criterios de Aceptación:**
  - Validación de fechas coherentes
  - Configuración flexible de requisitos
  - Plantillas predefinidas por tipo de curso

**RF-004: Inscripción de Participantes**
- **Descripción:** Flujo completo de inscripción con validaciones
- **Actor:** Participante
- **Flujo de Estados:**
  1. **Borrador:** Inscripción iniciada pero incompleta
  2. **Pendiente Documentos:** Faltan archivos requeridos
  3. **Pendiente Pago:** Documentos completos, falta confirmación pago
  4. **Confirmada:** Inscripción completa y válida
  5. **Rechazada:** No cumple requisitos o cupos agotados
- **Criterios de Aceptación:**
  - Wizard multi-paso con validación progresiva
  - Auto-guardado cada 30 segundos
  - Notificaciones automáticas por cambio de estado

### 3.3 Módulo de Gestión Financiera

**RF-005: Procesamiento de Pagos**
- **Descripción:** Gestionar pagos individuales y masivos
- **Actor:** Participante, Tesorero
- **Funcionalidades:**
  - Registro manual de pagos por tesorero
  - Importación masiva desde planillas Excel
  - Generación de códigos de pago únicos
  - Conciliación automática con comprobantes
- **Criterios de Aceptación:**
  - Validación de montos exactos
  - Trazabilidad completa de transacciones
  - Reportes de pagos pendientes y confirmados

**RF-006: Dashboard Financiero**
- **Descripción:** Panel de control con métricas financieras
- **Actor:** Tesorero, Director de Grupo
- **Métricas Incluidas:**
  - Ingresos totales por curso y período
  - Pagos pendientes y vencidos
  - Proyecciones financieras
  - Gráficos de tendencias
- **Criterios de Aceptación:**
  - Actualización en tiempo real
  - Exportación a Excel/PDF
  - Filtros por fechas y cursos

### 3.4 Módulo de Certificación

**RF-007: Generación de Certificados**
- **Descripción:** Crear certificados automáticamente al aprobar curso
- **Actor:** Sistema (automático), Dirigente
- **Funcionalidades:**
  - Plantillas personalizables por tipo de curso
  - Firma digital de dirigentes autorizados
  - Numeración secuencial y única
  - Código QR para verificación
- **Criterios de Aceptación:**
  - Generación automática tras evaluación aprobatoria
  - Formato PDF de alta calidad
  - Base de datos de certificados emitidos

### 3.5 Módulo de Notificaciones

**RF-008: Sistema de Notificaciones**
- **Descripción:** Comunicación automática con usuarios
- **Canales:** Email, SMS, notificaciones web
- **Eventos de Activación:**
  - Cambios de estado en inscripción
  - Recordatorios de fechas límite
  - Confirmación de pagos
  - Emisión de certificados
  - Alertas administrativas
- **Criterios de Aceptación:**
  - Plantillas personalizables por evento
  - Configuración de preferencias por usuario
  - Log de notificaciones enviadas

---

## 4. REQUISITOS NO FUNCIONALES

### 4.1 Rendimiento

**RNF-001: Tiempo de Respuesta**
- **Web Pages:** Carga completa en menos de 3 segundos
- **API Calls:** Respuesta promedio bajo 500ms
- **Búsquedas:** Resultados en menos de 2 segundos
- **Reportes:** Generación máxima en 10 segundos

**RNF-002: Concurrencia**
- **Usuarios Simultáneos:** Soporte para 200 usuarios concurrentes
- **Inscripciones:** 50 inscripciones simultáneas sin degradación
- **Procesamiento:** 100 pagos por minuto en períodos pico

### 4.2 Escalabilidad

**RNF-003: Crecimiento del Sistema**
- **Datos:** Crecimiento anual de 10,000 inscripciones
- **Usuarios:** Escalabilidad hasta 1,000 usuarios registrados
- **Cursos:** Gestión simultánea de hasta 50 cursos activos

### 4.3 Disponibilidad

**RNF-004: Uptime del Sistema**
- **Disponibilidad:** 99.5% mensual (máximo 3.6 horas downtime)
- **Mantenimientos:** Ventanas programadas fuera de horario laboral
- **Recuperación:** RTO (Recovery Time Objective) de 2 horas

### 4.4 Seguridad

**RNF-005: Protección de Datos**
- **Autenticación:** JWT con expiración de 24 horas
- **Autorización:** Control granular por roles y recursos
- **Encriptación:** HTTPS obligatorio, datos sensibles en AES-256
- **Auditoría:** Log completo de acciones críticas
- **Copias de Seguridad:** Backup diario automático con retención de 30 días

**RNF-006: Cumplimiento Normativo**
- **LGPD:** Cumplimiento con Ley General de Protección de Datos Personales
- **Estándares Scouts:** Adherencia a normativas de Scouts de Chile
- **Seguridad Web:** OWASP Top 10 mitigation

### 4.5 Usabilidad

**RNF-007: Experiencia de Usuario**
- **Intuitividad:** Usuario nuevo completa inscripción sin capacitación
- **Responsive:** Diseño web adaptativo para todas las resoluciones
- **Accesibilidad:** Cumplimiento WCAG 2.1 AA
- **Idioma:** Interfaz en español chileno
- **Compatibilidad:** Soporte para Chrome, Firefox, Safari, Edge

### 4.6 Mantenibilidad

**RNF-008: Código y Arquitectura**
- **Documentación:** Cobertura del 90% del código
- **Testing:** Cobertura de pruebas unitarias mínima 70%
- **Monitoreo:** Métricas de rendimiento y errores en tiempo real
- **Despliegue:** Automatización CI/CD con rollback automático

---

## 5. Semana a Semana


### 5.1 Distribución de Recursos por Sprint

**Sprint 0 (29 Sep - 13 Oct): Configuración**
- **Infraestructura (5 dev):** Setup Docker + PostgreSQL + CI/CD acelerado
- **Autenticación (4 dev):** JWT setup + modelos usuarios completos
- **Recursos:** 9 desarrolladores activos

**Sprint 1 (13 Oct - 27 Oct): Fundación**
- **Infraestructura (3 dev):** Finalizar CI/CD + monitoreo
- **Autenticación (4 dev):** RBAC completo + seguridad
- **Frontend (5 dev):** Vue 3 setup + componentes base
- **Recursos:** 12 desarrolladores activos

**Sprint 2 (27 Oct - 10 Nov): Base Técnica**
- **Todas las áreas (3 dev c/u):** 18 desarrolladores simultáneos
- **Formularios (4 dev):** Máquina de estados + wizard acelerado
- **Peak de desarrollo:** Máxima concurrencia

**Sprint 3-5:** Desarrollo intensivo con todos los módulos activos
- **Integración acelerada** entre módulos
- **Testing continuo** desde Sprint 3
- **Validación semanal** con usuarios

### 5.2 Criterios de Salida por Sprint

**Sprint 0:**
-  Entorno de desarrollo completamente operativo
-  Base de datos PostgreSQL con migraciones iniciales
-  Pipeline CI/CD funcional con GitHub Actions
-  Configuración de seguridad básica implementada

**Sprint 1:**
-  Sistema de autenticación JWT operativo
-  6 roles implementados con permisos completos
-  Frontend Vue 3 con componentes core y routing
-  APIs básicas funcionando

**Sprint 2:**
-  Flujo de inscripción completamente funcional
-  UI responsiva en todas las pantallas principales
-  Base de datos estable con relaciones complejas
-  Sistema de archivos MinIO operativo

**Sprint 3:**
-  Lógica de negocio implementada al 90%
-  Procesamiento de pagos completo
-  Sistema de notificaciones funcional
-  Dashboard administrativo con métricas

**Sprint 4:**
-  Integración completa entre todos los módulos
-  Certificados automáticos funcionando
-  Pruebas de integración al 80%
-  Rendimiento optimizado

**Sprint 5:**
-  Sistema en producción 100% funcional
-  Documentación completa y capacitación realizada
-  Pruebas E2E completadas
-  Go-live exitoso

---

## 6. MATRIZ DE TRAZABILIDAD

| Requerimiento | Módulo Responsable| Sprint | Prioridad | Estado        |
|---------------|-------------------|--------|-----------|---------------|
| RF-001 Login  | Autenticación     | 1      | Must      |  Especificado |
| RF-002 RBAC   | Autenticación     | 1      | Must      |  Especificado |
| RF-003 Creaci-|                   |        |           |               |
|    ón Cursos  | Formularios       | 2      | Must      |  Especificado |
| RF-004 Inscri-|                   |        |           |               |
|         pción | Formularios       | 2-3    | Must      |  Especificado |
| RF-005 Pagos  | Pagos             | 3      | Must      |  Especificado |
| RF-006 Dash-  |                   |        |           |               |
|      board    | Frontend          | 1-2    | Must      |  Especificado |
| RF-007 Cert-  |                   |        |           |               | 
|      ificados | Formularios       | 4      | Must      |  Especificado |
| RF-008 Notifi |                   |        |           |               | 
|      caciones | Formularios       | 3-4    | Should    |  Especificado |

---

