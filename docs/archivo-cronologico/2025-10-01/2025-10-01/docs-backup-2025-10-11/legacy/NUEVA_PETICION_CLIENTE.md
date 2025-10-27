# 📋 NUEVA PETICIÓN DEL CLIENTE - SGICS

**Fecha:** 2025-10-01  
**Proyecto:** Sistema de Gestión de Inscripciones para Cursos de Scouts (SGICS)  
**Versión:** 2.0

---

## 🎯 RESUMEN EJECUTIVO

El cliente ha solicitado una serie de mejoras y nuevas funcionalidades para el sistema SGICS. El objetivo principal es simplificar la navegación, mejorar la gestión de cursos y participantes, e implementar nuevos módulos para comunicaciones, acreditación y gestión de archivos.

---

## 🚫 1. ELIMINACIONES

### 1.1 Página Inicial
- **Acción:** Eliminar completamente la página de inicio (landing page)
- **Razón:** El sistema debe ir directo al dashboard tras el login
- **Impacto:** Simplifica la navegación y mejora la experiencia del usuario

### 1.2 Página de Registro
- **Acción:** Eliminar el registro público de usuarios
- **Razón:** Los usuarios serán creados únicamente por administradores
- **Impacto:** Mayor control sobre accesos al sistema

---

## 📊 2. DASHBOARD MEJORADO

### 2.1 Lista de Cursos Vigentes
**Requisito:** Mostrar TODOS los cursos vigentes con información detallada

**Datos a mostrar por cada curso:**

1. **Información Básica:**
   - Nombre del curso
   - Fechas de inicio y fin
   - Rama (si aplica)

2. **Participantes:**
   - Cantidad total de participantes inscritos
   - Cantidad de cupos disponibles
   - Porcentaje de ocupación

3. **Estado de Pagos:**
   - Participantes al día con pagos (número y %)
   - Participantes con pagos pendientes (número y %)
   - Monto total recaudado vs esperado

4. **Semáforo del Curso (Indicador Visual):**
   
   🟢 **VERDE** - Todo está bien:
   - Equipo completo (formadores + coordinadores asignados)
   - Todos los participantes al día con pagos
   - Documentación completa
   
   🟡 **AMARILLO** - Atención requerida:
   - Equipo parcialmente formado O
   - Algunos participantes con pagos atrasados (< 20%)
   
   🔴 **ROJO** - Problemas críticos:
   - Falta equipo (formadores o coordinadores) O
   - Muchos participantes con pagos atrasados (≥ 20%) O
   - Documentación incompleta

5. **Equipo del Curso:**
   - Lista de formadores asignados (nombres)
   - Lista de coordinadores asignados (nombres)
   - Indicador visual si falta algún rol

---

## 📚 3. MÓDULO DE CURSOS (MEJORAS)

### 3.1 Soporte para Cursos con Ramas
**Definición:** Algunos cursos tienen subdivisiones (ramas) para diferentes grupos etarios o especialidades.

**Implementación:**
- Campo adicional en el modelo Course: `rama` (CharField, opcional)
- Opciones: "Manada", "Tropa", "Comunidad", "Rover", "General"
- Filtros en la vista de cursos por rama
- Agrupación visual en el dashboard

### 3.2 Calendario de Fechas Importantes
**Objetivo:** Visualizar fechas clave de cada curso

**Fechas a incluir:**
- Inicio de inscripciones
- Cierre de inscripciones
- Fecha de inicio del curso
- Fecha de fin del curso
- Fechas de evaluaciones/certificaciones
- Fechas de pago (vencimientos)

**Vista:** Calendario interactivo (puede usar una librería como FullCalendar o similar)

### 3.3 Columna de Acciones Ampliada
**Acciones disponibles:**
- ✏️ **Modificar datos:** Editar información del curso
- 🔄 **Cambiar estado:** DRAFT → ACTIVE → COMPLETED → ARCHIVED
- ✅ **Estado de vigencia:** Marcar como vigente/no vigente
- 👥 **Gestionar equipo:** Asignar/remover formadores y coordinadores
- 📄 **Ver detalles:** Modal con información completa

### 3.4 Asignación Rápida de Responsables
**Durante la creación del curso:**
- Autocompletar con búsqueda de usuarios con rol "Formador" o "Coordinador"
- Selección múltiple (multiselect)
- Opción para crear nuevo responsable en el momento

---

## 📧 4. NUEVO MÓDULO: CORREOS MASIVOS

### 4.1 Funcionalidad Principal
Enviar correos electrónicos masivos a participantes de cursos específicos.

### 4.2 Características

#### 4.2.1 Selector de Curso
- **Input:** Select box con lista de cursos
- **Comportamiento:** Al seleccionar un curso, se cargan automáticamente todos los participantes inscritos

#### 4.2.2 Lista de Participantes
- Tabla con:
  - Nombre completo
  - Email
  - Checkbox para selección individual
  - Checkbox general para "Seleccionar todos"

#### 4.2.3 Exportación de Correos
- **Formato:** Archivo `.txt`
- **Contenido:** Lista de emails separados por comas o líneas
- **Botón:** "Exportar emails a TXT"

#### 4.2.4 Checklist de Envío
- **Objetivo:** Marcar qué correos ya fueron enviados (control manual)
- **Implementación:**
  - Campo en el modelo: `email_sent` (BooleanField)
  - Columna adicional: "Correo enviado" (✅/❌)
  - Botón: "Marcar como enviado" (cambia el estado)
  - Filtro: Mostrar "Pendientes de envío" / "Todos"

#### 4.2.5 Interfaz de Envío
- Editor de texto enriquecido para el mensaje
- Campo de asunto
- Vista previa del correo
- Opción para usar plantillas predefinidas

---

## 📝 5. PREINSCRIPCIÓN (MEJORAS)

### 5.1 Mostrar Curso al Inicio
**Cambio:** El curso debe ser visible desde el inicio del formulario, no al final.

**Implementación:**
- Mover el campo "Curso" al principio del formulario
- Hacer el campo obligatorio desde el inicio
- Mostrar información resumida del curso seleccionado (fechas, precio, cupos)

### 5.2 Búsqueda Automática por RUT
**Funcionalidad:** Autocompletar datos si el RUT ya existe en la base de datos.

**Flujo:**
1. Usuario ingresa RUT
2. Al terminar de escribir (evento `blur` o `change`), se hace una consulta al backend
3. Si el RUT existe:
   - ✅ Se autorellenan todos los campos (nombre, apellidos, email, teléfono, dirección, etc.)
   - 🔔 Mensaje: "Datos encontrados y cargados automáticamente"
4. Si el RUT no existe:
   - ℹ️ Mensaje: "RUT no encontrado. Complete los datos manualmente"

**Endpoint del backend:**
```python
# GET /api/users/search-by-rut/?rut=12345678-9
```

---

## 💰 6. PAGOS (MEJORAS)

### 6.1 Búsqueda por Grupo
**Requisito:** Al registrar un pago, poder buscar por grupo para ver todos los participantes.

**Implementación:**
- Campo de búsqueda: "Buscar por grupo" (input text)
- Resultados: Tabla con participantes del grupo
- Columnas:
  - Nombre
  - RUT
  - Curso inscrito
  - Estado de pago (Al día / Pendiente)
  - Monto adeudado
  - Acciones (Registrar pago)

### 6.2 CRUD Completo de Pagos
**Operaciones:**
- ✅ **Crear:** Registrar nuevo pago
- 📄 **Ver:** Detalles del pago (recibo)
- ✏️ **Editar:** Modificar monto, fecha, método de pago
- 🗑️ **Eliminar:** Anular pago (con confirmación)

**Campos del modelo de Pago:**
- Preinscripción relacionada
- Monto
- Fecha de pago
- Método de pago (Efectivo, Transferencia, Tarjeta, etc.)
- Comprobante (archivo adjunto)
- Notas/observaciones

---

## 🔔 7. NOTIFICACIONES (NUEVO SISTEMA)

### 7.1 Tipos de Notificaciones

#### 7.1.1 Modificaciones en el Sistema
**Cuándo se notifica:**
- Cambio de estado de un curso
- Edición de datos de un participante
- Asignación de nuevos responsables
- Cambios en fechas importantes

**Destinatarios:**
- Administradores
- Coordinadores del curso afectado

#### 7.1.2 Pagos Pendientes
**Cuándo se notifica:**
- Cuando un pago está próximo a vencer (3 días antes)
- Cuando un pago está vencido

**Destinatarios:**
- El participante con pago pendiente (email)
- Coordinadores del curso

### 7.2 Implementación Técnica
- **Backend:** Usar Django Signals para detectar cambios
- **Notificaciones en tiempo real:** WebSockets (opcional) o polling
- **Panel de notificaciones:** Bell icon con contador
- **Historial:** Lista de notificaciones con filtros

---

## 📁 8. GESTOR DE ARCHIVOS (NUEVO)

### 8.1 Objetivo
Subir, organizar y gestionar archivos relacionados con personas y cursos.

### 8.2 Tipos de Archivos
1. **Comprobantes de Pago:**
   - Asociados a un pago específico
   - Formatos: PDF, JPG, PNG
   
2. **Fichas Médicas:**
   - Asociadas a un participante
   - Formato: PDF
   
3. **Documentos de Identidad:**
   - Cédula de identidad, certificado de nacimiento
   
4. **Certificados:**
   - Certificados de cursos anteriores
   
5. **Otros:**
   - Autorizaciones, declaraciones juradas, etc.

### 8.3 Funcionalidades
- **Subida:** Drag & drop o botón tradicional
- **Organización:** Por categoría (tipo de documento)
- **Visualización:** Previsualización de PDFs e imágenes
- **Descarga:** Individual o masiva
- **Búsqueda:** Por nombre de archivo, tipo, fecha de subida
- **Seguridad:** Solo usuarios autorizados pueden ver/descargar

### 8.4 Modelo de Datos
```python
class DocumentoAdjunto(models.Model):
    persona = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documentos')
    curso = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True)
    tipo = models.CharField(max_length=50, choices=TIPO_DOCUMENTO_CHOICES)
    archivo = models.FileField(upload_to='documentos/%Y/%m/')
    nombre_original = models.CharField(max_length=255)
    fecha_subida = models.DateTimeField(auto_now_add=True)
    subido_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='documentos_subidos')
```

---

## 👥 9. PERSONAS (MEJORAS)

### 9.1 Búsquedas Avanzadas
**Filtros disponibles:**
- Por grupo/patrulla
- Por zona geográfica
- Por rango de edad
- Por estado de membresía (activo/inactivo)
- Por curso inscrito
- Por estado de documentación (completa/incompleta)

### 9.2 CRUD Completo
**Operaciones:**
- ✅ **Crear:** Nuevo participante
- 📄 **Ver:** Perfil completo
- ✏️ **Editar:** Modificar datos personales, contacto, etc.
- 🗑️ **Eliminar:** Soft delete (marcar como inactivo)

### 9.3 Indicador de Registro Vigente
**Campo:** `registro_vigente` (BooleanField)

**Lógica:**
- ✅ **Vigente:** Participante activo, con documentación al día
- ❌ **No vigente:** Participante inactivo o con documentación vencida

**Visualización:**
- Badge verde/rojo en la lista
- Filtro para mostrar solo vigentes

---

## 🎫 10. ACREDITACIÓN (NUEVO MÓDULO)

### 10.1 Objetivo
Generar códigos QR individuales para cada participante que permitan verificar rápidamente su estado de acreditación.

### 10.2 Contenido del QR
El QR debe codificar una URL que apunte a un endpoint del sistema:
```
https://sgics.com/acreditacion/verificar/{token_unico}
```

### 10.3 Vista de Verificación

#### 10.3.1 Estado: ACREDITADO (Verde 🟢)
**Condiciones:**
- ✅ Todos los pagos al día
- ✅ Documentación completa y vigente
- ✅ Ficha médica vigente (< 1 año)
- ✅ Inscrito en curso vigente

**Visualización:**
- Fondo verde
- Icono de check ✅
- Mensaje: "ACREDITADO"
- Foto del participante
- Nombre completo
- Curso inscrito

#### 10.3.2 Estado: PENDIENTE (Rojo 🔴)
**Condiciones:**
- ❌ Pagos atrasados O
- ❌ Documentación incompleta O
- ❌ Ficha médica vencida

**Visualización:**
- Fondo rojo
- Icono de alerta ⚠️
- Mensaje: "PENDIENTE"
- Lista de requisitos faltantes

### 10.4 Generación del QR
**Implementación:**
- Librería Python: `qrcode` o `segno`
- Librería JS (frontend): `qrcode.js` o `vue-qrcode`

**Flujo:**
1. Usuario solicita generar QR (botón en perfil)
2. Backend genera token único y lo asocia al participante
3. Backend crea URL de verificación
4. Backend genera imagen QR
5. Frontend muestra QR para imprimir o descargar

### 10.5 Impresión Masiva
- Opción para generar QRs de todos los participantes de un curso
- Formato de impresión optimizado (credenciales)
- Exportación a PDF con layout de credenciales

---

## 🗂️ ORGANIZACIÓN DEL CÓDIGO

### Frontend
```
src/
├── features/
│   ├── audit/              # Módulo de auditoría (separado)
│   ├── validation/         # Módulo de validación
│   ├── emails/             # NUEVO: Módulo de correos masivos
│   ├── accreditation/      # NUEVO: Módulo de acreditación
│   └── files/              # NUEVO: Gestor de archivos
├── views/
│   ├── Dashboard.vue       # MEJORADO
│   ├── Courses.vue         # MEJORADO
│   ├── Preinscriptions.vue # MEJORADO
│   ├── Payments.vue        # MEJORADO
│   ├── People.vue          # MEJORADO
│   └── Notifications.vue   # NUEVO
└── components/
    ├── CourseCalendar.vue  # NUEVO
    ├── QRGenerator.vue     # NUEVO
    └── FileUploader.vue    # NUEVO
```

### Backend
```
backend/
├── courses/
│   ├── models.py           # Añadir campo 'rama'
│   └── views.py            # Dashboard con semáforo
├── preinscriptions/
│   └── views.py            # Búsqueda por RUT
├── payments/
│   └── views.py            # Búsqueda por grupo, CRUD
├── emails/                 # NUEVO: App para correos
├── accreditation/          # NUEVO: App para acreditación
├── files/                  # NUEVO: App para archivos
└── notifications/          # NUEVO: App para notificaciones
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Limpieza y Refactorización
- [ ] Eliminar página de inicio (Home.vue)
- [ ] Eliminar página de registro (Register.vue)
- [ ] Actualizar router para redirigir directo al dashboard
- [ ] Separar módulo de auditoría en `features/audit/`
- [ ] Limpiar código de datos mock

### Fase 2: Dashboard Mejorado
- [ ] Implementar lista de cursos vigentes
- [ ] Añadir contador de participantes por curso
- [ ] Implementar semáforo (lógica backend + visualización frontend)
- [ ] Mostrar estado de pagos por curso
- [ ] Mostrar equipo del curso (formadores + coordinadores)

### Fase 3: Cursos con Ramas y Calendario
- [ ] Añadir campo `rama` al modelo Course
- [ ] Implementar filtro por rama en frontend
- [ ] Integrar librería de calendario
- [ ] Cargar fechas importantes en el calendario
- [ ] Añadir columna de acciones expandida
- [ ] Implementar asignación rápida de responsables

### Fase 4: Módulo de Correos Masivos
- [ ] Crear app Django `emails`
- [ ] Crear modelos y endpoints
- [ ] Crear vista Vue para envío de correos
- [ ] Implementar selector de curso
- [ ] Implementar exportación a .txt
- [ ] Implementar checklist de correos enviados

### Fase 5: Preinscripción Mejorada
- [ ] Reorganizar formulario (curso al inicio)
- [ ] Crear endpoint `/api/users/search-by-rut/`
- [ ] Implementar autocompletado en frontend
- [ ] Mostrar mensaje de "datos encontrados" o "no encontrado"

### Fase 6: Pagos con Búsqueda por Grupo
- [ ] Implementar endpoint de búsqueda por grupo
- [ ] Crear vista de resultados de búsqueda
- [ ] Implementar CRUD completo de pagos (edit, delete)

### Fase 7: Sistema de Notificaciones
- [ ] Crear app Django `notifications`
- [ ] Configurar Django Signals para cambios
- [ ] Implementar notificaciones de pagos pendientes
- [ ] Crear componente de campana de notificaciones
- [ ] Implementar panel de historial

### Fase 8: Gestor de Archivos
- [ ] Crear app Django `files`
- [ ] Crear modelo `DocumentoAdjunto`
- [ ] Implementar endpoints de subida/descarga
- [ ] Crear componente `FileUploader.vue`
- [ ] Implementar visualización de archivos
- [ ] Implementar búsqueda y filtros

### Fase 9: Módulo de Personas Mejorado
- [ ] Implementar filtros avanzados (grupo, zona, edad, etc.)
- [ ] Completar CRUD (añadir edit y soft delete)
- [ ] Añadir campo `registro_vigente`
- [ ] Implementar badge de estado en lista

### Fase 10: Acreditación con QR
- [ ] Crear app Django `accreditation`
- [ ] Instalar librería `qrcode`
- [ ] Crear endpoint de generación de token
- [ ] Crear endpoint de verificación de QR
- [ ] Crear componente `QRGenerator.vue`
- [ ] Crear vista de verificación (verde/rojo)
- [ ] Implementar impresión masiva de credenciales

---

## 🎨 CONSIDERACIONES DE UX/UI

1. **Semáforo de Cursos:**
   - Usar colores claros y accesibles
   - Añadir tooltips explicando el significado de cada color
   - Hacer clickeable para ver detalles

2. **Calendario:**
   - Vista mensual por defecto
   - Opción para cambiar a vista semanal/diaria
   - Colores distintivos por tipo de evento

3. **Correos Masivos:**
   - Confirmación antes de enviar
   - Barra de progreso durante el envío
   - Resumen de envíos exitosos/fallidos

4. **Acreditación:**
   - QR grande y fácil de escanear
   - Opción de imprimir directo desde el navegador
   - Vista responsive para verificación móvil

---

## 🔐 CONSIDERACIONES DE SEGURIDAD

1. **Archivos:**
   - Validar tipo y tamaño de archivo
   - Escaneo antivirus (opcional)
   - Almacenamiento seguro (permisos)

2. **QR de Acreditación:**
   - Tokens de un solo uso o con expiración
   - Validación de firma digital
   - Log de accesos

3. **Notificaciones:**
   - No exponer información sensible en emails
   - Permitir opt-out de notificaciones

---

## 📅 CRONOGRAMA ESTIMADO

| Fase | Duración Estimada | Prioridad |
|------|-------------------|-----------|
| Fase 1: Limpieza | 2-3 días | Alta |
| Fase 2: Dashboard | 3-4 días | Alta |
| Fase 3: Cursos + Calendario | 4-5 días | Alta |
| Fase 4: Correos Masivos | 3-4 días | Media |
| Fase 5: Preinscripción | 2-3 días | Alta |
| Fase 6: Pagos | 2-3 días | Alta |
| Fase 7: Notificaciones | 4-5 días | Media |
| Fase 8: Gestor Archivos | 3-4 días | Media |
| Fase 9: Personas | 2-3 días | Media |
| Fase 10: Acreditación | 4-5 días | Media |

**Total estimado:** 6-8 semanas

---

## ✅ CRITERIOS DE ACEPTACIÓN

Para cada módulo, se debe cumplir:

1. ✅ Funcionalidad completa según especificaciones
2. ✅ Código limpio y documentado
3. ✅ Tests unitarios y de integración
4. ✅ Responsive design (mobile-friendly)
5. ✅ Manejo de errores y casos edge
6. ✅ Feedback visual al usuario (loading, success, error)
7. ✅ Documentación actualizada (README, diagramas UML)

---

**Documento revisado y aprobado para implementación.**
