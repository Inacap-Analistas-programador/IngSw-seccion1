# PROMPTS PARA MOCKUPS - SISTEMA SGICS

**Proyecto:** Sistema de Gestión Integral para Cursos Scouts (SGICS)  
**Objetivo:** Generar mockups profesionales con Sora/ChatGPT  
**Fecha:** Octubre 2025  
**Metodología:** Design System basado en Material Design + Branding Scouts

---

## 🎨 **GUÍA DE BRANDING SCOUTS PARA TODOS LOS MOCKUPS**

**Colores Primarios:**
- **Azul Scout:** #003366 (Navegación, headers, botones primarios)
- **Amarillo Scout:** #FFD700 (Acentos, badges, notificaciones)
- **Verde Scout:** #228B22 (Estados exitosos, confirmaciones)
- **Rojo Alerta:** #DC3545 (Errores, alertas críticas)
- **Gris Neutro:** #F8F9FA (Fondos, cards, secciones)

**Tipografía:**
- **Títulos:** Inter Bold, tamaños 24px-32px
- **Subtítulos:** Inter Medium, tamaños 18px-20px  
- **Cuerpo:** Inter Regular, tamaños 14px-16px
- **Pequeño:** Inter Regular, 12px-14px

**Iconografía:** Feather Icons o Heroicons (outline style)

---

## 📊 **PROMPT 1: DASHBOARD EJECUTIVO**

```
Diseña un mockup profesional para el Dashboard Ejecutivo del Sistema de Gestión Integral para Cursos Scouts (SGICS). 

CONTEXTO: Sistema web para coordinadores scouts que gestiona inscripciones, pagos y reportes de cursos formativos en tiempo real.

USUARIO: Coordinadores regionales y directivos scouts que necesitan métricas consolidadas.

LAYOUT PRINCIPAL:
- Header fijo con logo Scouts, nombre "SGICS Dashboard", avatar usuario, notificaciones (campana) y logout
- Sidebar izquierdo con navegación: Dashboard, Cursos, Preinscripciones, Pagos, Archivos, Notificaciones, Reportes
- Área principal con grid responsive de cards de métricas

COMPONENTES CLAVE:
1. **Fila 1 - KPIs Principales (4 cards horizontales):**
   - "Cursos Activos" (número grande + icono calendario)
   - "Participantes Inscritos" (número + icono usuarios)
   - "Recaudación Total" (monto en CLP + icono dinero)
   - "Pagos Pendientes" (número + porcentaje + icono alerta)

2. **Fila 2 - Gráficos (2 cards grandes):**
   - Card izquierdo: Gráfico de barras "Inscripciones por Mes" (últimos 6 meses)
   - Card derecho: Gráfico circular "Distribución por Rama" (Manada, Tropa, Comunidad, Rover)

3. **Fila 3 - Tablas de Datos (2 cards):**
   - Card izquierdo: "Próximos Cursos" (tabla con: Nombre, Fecha, Cupos, Estado)
   - Card derecho: "Pagos Recientes" (tabla con: Participante, Curso, Monto, Estado)

4. **Semáforo de Estado por Curso:**
   - Verde: Al día (pagos confirmados, cupos OK)
   - Amarillo: Atención (pagos pendientes, pocos cupos)
   - Rojo: Crítico (problemas graves, documentación faltante)

DISEÑO:
- Estilo: Moderno, clean, profesional tipo admin dashboard
- Colores: Azul Scout (#003366) para header/sidebar, cards blancas con sombras sutiles
- Espaciado: Generous padding, 24px grid gap
- Responsive: Desktop first, adaptable a tablet
- Accesibilidad: Alto contraste, iconos descriptivos, labels claros

DETALLES ESPECÍFICOS:
- Avatar usuario en esquina superior derecha con dropdown menu
- Breadcrumb bajo el header: "Dashboard > Resumen Ejecutivo"
- Footer discreto con "© 2025 Scouts de Chile - Región Bio-Bio"
- Loading skeletons para cards que cargan datos async
- Tooltips en gráficos para mostrar valores exactos
```

---

## 🔐 **PROMPT 2: PANTALLA DE LOGIN**

```
Diseña un mockup profesional para la pantalla de Login del Sistema SGICS (Sistema de Gestión Integral para Cursos Scouts).

CONTEXTO: Página de autenticación segura con JWT para acceso al sistema de gestión scouts.

USUARIO: Coordinadores, formadores, validadores y participantes scouts que necesitan acceder al sistema.

LAYOUT:
- Pantalla completa dividida en 2 secciones (desktop) o single column (móvil)
- Sección izquierda (60%): Formulario de login centrado
- Sección derecha (40%): Imagen/ilustración scouts + branding

COMPONENTES DEL FORMULARIO:
1. **Header del Form:**
   - Logo Scouts oficial (escudo) centrado
   - Título "SGICS - Sistema Scout" (Inter Bold 28px)
   - Subtítulo "Ingresa a tu cuenta" (Inter Regular 16px, color gris)

2. **Campos del Formulario:**
   - Email/Usuario: Input con icono @ y placeholder "Ingresa tu email"
   - Contraseña: Input tipo password con icono candado y toggle mostrar/ocultar
   - Checkbox "Recordarme" con label clickeable
   - Link "¿Olvidaste tu contraseña?" (color azul scout, hover underline)

3. **Botones de Acción:**
   - Botón primario "Iniciar Sesión" (azul scout #003366, full width, 48px height)
   - Loading spinner cuando está procesando
   - Estados: normal, hover, loading, disabled

4. **Footer del Form:**
   - Texto "¿No tienes cuenta? Contacta a tu coordinador"
   - Versión del sistema "v2.0.1" en texto pequeño

SECCIÓN DERECHA (Desktop):
- Fondo azul scout con gradiente sutil
- Ilustración vectorial de scouts haciendo actividades
- Texto overlay: "Gestiona tus cursos scout de manera digital y eficiente"
- Logo "Scouts de Chile - Región Bio-Bio" en parte inferior

VALIDACIONES VISUALES:
- Campos requeridos con borde rojo si están vacíos
- Mensajes de error bajo cada campo (color rojo, 14px)
- Mensaje de error general para credenciales inválidas
- Mensaje de éxito para login correcto (verde scout)

DISEÑO:
- Estilo: Moderno, clean, confiable
- Colores: Fondo blanco, azul scout para elementos primarios
- Tipografía: Inter font family
- Responsive: Stack vertical en móvil, form width máximo 400px
- Accesibilidad: Labels asociados, tab navigation, ARIA attributes

DETALLES ESPECÍFICOS:
- Animación sutil de focus en inputs (border color transition)
- Box shadow suave en el container del formulario
- Favicon de scouts en browser tab
- Preloader con logo scout si la app está cargando
```

---

## 🎓 **PROMPT 3: GESTIÓN DE CURSOS**

```
Diseña un mockup profesional para la pantalla de Gestión de Cursos del sistema SGICS.

CONTEXTO: Interfaz administrativa donde coordinadores scouts pueden crear, editar y gestionar cursos formativos con control completo de estados y participantes.

USUARIO: Coordinadores de cursos y formadores con permisos de gestión académica.

LAYOUT PRINCIPAL:
- Header con breadcrumb: "Dashboard > Cursos > Gestión"
- Barra de herramientas con filtros y acciones principales
- Tabla principal de cursos con paginación
- Panel lateral para acciones rápidas (opcional)

BARRA DE HERRAMIENTAS:
1. **Lado Izquierdo:**
   - Botón primario "+ Nuevo Curso" (azul scout, icono plus)
   - Dropdown "Filtrar por Estado" (Todos, Activos, Finalizados, Cancelados)
   - Dropdown "Filtrar por Rama" (Todas, Manada, Tropa, Comunidad, Rover)

2. **Lado Derecho:**
   - Buscador con placeholder "Buscar curso..." (icono lupa)
   - Botón "Exportar" (icono download)
   - Toggle view "Lista/Cards" (icono grid/list)

TABLA DE CURSOS:
**Columnas:**
1. **Curso** (nombre + código, link clickeable)
2. **Rama** (badge colorizado por tipo)
3. **Fechas** (inicio - fin, formato DD/MM/YYYY)
4. **Participantes** (inscritos/cupos con barra de progreso)
5. **Estado Financiero** (recaudado/esperado con porcentaje)
6. **Semáforo** (indicador visual verde/amarillo/rojo)
7. **Acciones** (dropdown con opciones)

SEMÁFORO DE ESTADO:
- 🟢 **Verde:** Todo OK (pagos al día, documentación completa, cupos adecuados)
- 🟡 **Amarillo:** Atención (algunos pagos pendientes, pocos cupos disponibles)
- 🔴 **Rojo:** Crítico (muchos pagos atrasados, documentación faltante, sobrecupo)

ACCIONES POR FILA:
- Dropdown menu con opciones:
  - ✏️ "Editar Curso"
  - 👥 "Ver Participantes" 
  - 💰 "Gestionar Pagos"
  - 📊 "Ver Reportes"
  - 📄 "Duplicar Curso"
  - ⚠️ "Cambiar Estado"

MODAL DE CREACIÓN/EDICIÓN:
- Formulario en modal overlay con tabs:
  - Tab 1: "Información Básica" (nombre, descripción, rama, lugar)
  - Tab 2: "Fechas y Cupos" (fecha inicio/fin, cupos por rol)
  - Tab 3: "Equipo" (asignación de formadores y coordinadores)
  - Tab 4: "Configuración" (precios, requisitos, documentos)

ESTADOS VISUALES:
- **Activo:** Badge verde, fila con fondo normal
- **Finalizado:** Badge gris, fila con opacity reducida
- **Cancelado:** Badge rojo, fila con fondo rosa muy claro
- **Borrador:** Badge amarillo, fila con borde punteado

DISEÑO:
- Estilo: Data table profesional tipo admin
- Colores: Azul scout para elementos primarios, badges contextuales
- Espaciado: Table padding generoso, clear visual hierarchy
- Responsive: Tabla horizontal scroll en móvil, cards stack en viewport pequeño
- Accesibilidad: Sortable headers, keyboard navigation, screen reader support

DETALLES ESPECÍFICOS:
- Hover effects en filas de tabla (background gris claro)
- Loading skeleton para tabla cuando carga datos
- Empty state illustration si no hay cursos
- Paginación con "Mostrando 1-10 de 45 cursos"
- Tooltips en semáforo explicando el estado exacto
```

---

## 📝 **PROMPT 4: WIZARD DE PREINSCRIPCIÓN**

```
Diseña un mockup profesional para el Wizard de Preinscripción multi-paso del sistema SGICS.

CONTEXTO: Formulario progresivo donde participantes scouts se inscriben a cursos, con validación automática y guardado de progreso.

USUARIO: Participantes scouts (jóvenes y adultos) que se inscriben a cursos formativos desde cualquier dispositivo.

LAYOUT DEL WIZARD:
- Progress bar horizontal en top mostrando pasos completados
- Área principal del formulario con un paso visible
- Navegación inferior con botones Anterior/Siguiente
- Sidebar opcional con resumen de datos ingresados (desktop)

PROGRESS BAR:
- 5 pasos claramente marcados con números y títulos:
  1. "Seleccionar Curso" 
  2. "Datos Personales"
  3. "Información Scout"
  4. "Documentos"
  5. "Confirmación"
- Pasos completados: círculo verde con checkmark
- Paso actual: círculo azul scout con número
- Pasos pendientes: círculo gris con número

PASO 1 - SELECCIONAR CURSO:
- Card selector de curso con imagen, nombre, fechas
- Filtros: por rama, por zona, por fechas
- Información clave: cupos disponibles, precio, requisitos
- Badge de "Cupos Limitados" si quedan pocos
- Descripción expandible del curso

PASO 2 - DATOS PERSONALES:
- **Campos en layout de 2 columnas:**
  - RUT (con validación automática)
  - Nombre completo
  - Fecha de nacimiento (datepicker)
  - Género (radio buttons)
  - Email (con confirmación)
  - Teléfono móvil
  - Dirección completa
  - Comuna/ciudad

PASO 3 - INFORMACIÓN SCOUT:
- **Estructura Organizacional:**
  - Zona (dropdown)
  - Distrito (dropdown que se llena según zona)
  - Grupo (dropdown que se llena según distrito)
  - Rama actual (Manada/Tropa/Comunidad/Rover)
  - Cargo actual (si aplica)
- **Información Adicional:**
  - Años de experiencia scout
  - Cursos previos realizados (multiselect)
  - Certificaciones vigentes

PASO 4 - DOCUMENTOS:
- **Upload de Archivos Requeridos:**
  - Ficha médica (PDF, obligatorio)
  - Autorización parental (si es menor de edad)
  - Certificado scout vigente
  - Foto carnet (JPG/PNG)
- **Componente de Upload:**
  - Drag & drop area por cada documento
  - Progress bar durante upload
  - Preview de archivos subidos
  - Validación de formato y tamaño
  - Estado: pendiente/subido/error

PASO 5 - CONFIRMACIÓN:
- **Resumen Completo:**
  - Datos del curso seleccionado
  - Información personal ingresada
  - Documentos adjuntos (con links para revisar)
  - Monto total a pagar
  - Términos y condiciones (checkbox obligatorio)
- **Call to Action:**
  - Botón "Confirmar Preinscripción" destacado
  - Texto explicativo del siguiente paso (validación territorial)

NAVEGACIÓN:
- **Botones Inferiores:**
  - "Anterior" (outline, lado izquierdo)
  - "Guardar Borrador" (ghost button, centro)
  - "Siguiente" (primary, lado derecho)
  - "Finalizar" solo en último paso

SIDEBAR DE RESUMEN (Desktop):
- Card sticky con:
  - Imagen del curso
  - Nombre y fechas
  - Precio total
  - Progress del wizard
  - Datos ya completados
  - Tiempo estimado restante

VALIDACIONES:
- Validación en tiempo real por campo
- Mensajes de error contextuales
- Bloqueo de "Siguiente" si hay errores
- Indicadores visuales (checkmarks verdes, X rojas)
- Auto-guardado cada 30 segundos

DISEÑO:
- Estilo: Moderno, friendly, accesible
- Colores: Azul scout para elementos de progreso, verde para confirmaciones
- Espaciado: Forms con mucho white space, clear visual hierarchy
- Responsive: Single column en móvil, sidebar desaparece
- Accesibilidad: Labels claros, error announcements, keyboard navigation

DETALLES ESPECÍFICOS:
- Animaciones suaves entre pasos (slide transition)
- Loading states durante validaciones async
- Toast notifications para auto-guardado exitoso
- Exit intent modal si trata de salir sin guardar
- Estimación de tiempo: "Tiempo estimado: 8 minutos"
```

---

## 💰 **PROMPT 5: GESTIÓN DE PAGOS**

```
Diseña un mockup profesional para la pantalla de Gestión de Pagos del sistema SGICS.

CONTEXTO: Interface administrativa para procesar pagos individuales y masivos, con reconciliación bancaria y reportes financieros en tiempo real.

USUARIO: Equipo de finanzas y tesoreros scouts que gestionan transacciones y confirmaciones de pago.

LAYOUT PRINCIPAL:
- Header con breadcrumb: "Dashboard > Pagos > Gestión"
- Tabs de navegación: "Pagos Individuales" | "Carga Masiva" | "Reconciliación" | "Reportes"
- Área de contenido que cambia según tab activo
- Panel de estadísticas financieras siempre visible

PANEL DE KPIs FINANCIEROS (Top):
- 4 cards horizontales con métricas:
  1. "Total Recaudado" (monto CLP + porcentaje vs. meta)
  2. "Pagos Pendientes" (cantidad + monto total)
  3. "Pagos Hoy" (cantidad procesada + monto)
  4. "Comisiones" (total pagado en fees + porcentaje)

TAB 1 - PAGOS INDIVIDUALES:
**Barra de Filtros:**
- Filtro por estado: "Todos", "Confirmados", "Pendientes", "Rechazados"
- Filtro por curso (multiselect dropdown)
- Filtro por fechas (date range picker)
- Buscador por nombre/RUT del participante

**Tabla de Pagos:**
Columnas:
- **Participante** (nombre + RUT)
- **Curso** (nombre con link)
- **Monto** (valor CLP)
- **Método** (badge: Transferencia/Efectivo/Tarjeta)
- **Estado** (badge colorizado)
- **Fecha Pago** (DD/MM/YYYY HH:MM)
- **Comprobante** (link para ver/descargar)
- **Acciones** (confirmar/rechazar/ver detalle)

**Estados de Pago:**
- 🟢 Confirmado (verde)
- 🟡 Pendiente Validación (amarillo)
- 🔴 Rechazado (rojo)
- ⚫ Anulado (gris)

TAB 2 - CARGA MASIVA:
**Área de Upload:**
- Drag & drop zone para archivo Excel
- Template download: "Descargar plantilla Excel"
- Preview de datos antes de procesar
- Validation report con errores/advertencias

**Proceso de Validación:**
- Progress bar del procesamiento
- Lista de errores encontrados con líneas específicas
- Opción de "Procesar Solo Válidos" o "Cancelar Todo"
- Summary: X registros válidos, Y con errores

**Resultados Post-Proceso:**
- Cards con resultados:
  - "Procesados Exitosamente" (verde)
  - "Con Errores" (rojo) 
  - "Requieren Validación Manual" (amarillo)
- Tabla con detalles de cada transacción procesada

TAB 3 - RECONCILIACIÓN BANCARIA:
**Upload de Estado de Cuenta:**
- Selector de banco (Banco Estado, Santander, BCI, etc.)
- Upload de archivo CSV/Excel del banco
- Configuración de columnas (fecha, monto, referencia)

**Proceso de Matching:**
- Tabla de coincidencias automáticas (verde)
- Tabla de diferencias/no encontrados (requieren revisión manual)
- Panel de matching manual: arrastrar transacciones para emparejar
- Botones: "Auto-match", "Confirmar Todo", "Revisar Diferencias"

**Resumen de Reconciliación:**
- Total conciliado vs. pendiente
- Diferencias encontradas con detalle
- Botón "Generar Reporte de Reconciliación"

TAB 4 - REPORTES FINANCIEROS:
**Filtros de Reporte:**
- Rango de fechas (presets: Hoy, Esta semana, Este mes, Último trimestre)
- Por curso específico o todos
- Por método de pago
- Por estado de transacción

**Visualizaciones:**
- Gráfico de barras: "Ingresos por Día" (últimos 30 días)
- Gráfico circular: "Distribución por Método de Pago"
- Tabla pivot: "Resumen por Curso" (participantes, recaudado, pendiente)

**Acciones de Export:**
- Botones: "Exportar Excel", "Exportar PDF", "Programar Envío"
- Preview del reporte antes de exportar

ACCIONES RÁPIDAS (Sidebar):
- "Confirmar Pago Manual" (modal con form)
- "Registrar Pago Efectivo" (modal)
- "Anular Transacción" (con justificación)
- "Enviar Recordatorio" (email automático)

DISEÑO:
- Estilo: Dashboard financiero profesional
- Colores: Verde para montos positivos, rojo para negativos, azul scout para elementos de UI
- Números: Formato chileno (CLP $1.234.567)
- Tables: Sorteable headers, row hover, loading states
- Responsive: Horizontal scroll en tablas, cards stack en móvil

DETALLES ESPECÍFICOS:
- Real-time updates cuando se procesan pagos
- Notificaciones toast para acciones exitosas/fallidas
- Confirmación modal para acciones críticas (anular, rechazar)
- Loading spinners durante procesos async
- Empty states con ilustraciones cuando no hay datos
- Tooltips explicativos en campos complejos
```

---

## 📁 **PROMPT 6: GESTIÓN DE ARCHIVOS**

```
Diseña un mockup profesional para la pantalla de Gestión de Archivos del sistema SGICS.

CONTEXTO: Sistema de gestión documental con versionado, antivirus, encriptación y control de acceso para documentos scouts (fichas médicas, certificados, etc.).

USUARIO: Coordinadores, formadores y participantes que necesitan subir, visualizar y gestionar documentos oficiales scouts.

LAYOUT PRINCIPAL:
- Header con breadcrumb: "Dashboard > Archivos > Mi Biblioteca"
- Toolbar con filtros y acciones de archivo
- Vista principal: Grid de archivos o lista detallada (toggle)
- Panel lateral con información del archivo seleccionado

TOOLBAR SUPERIOR:
**Lado Izquierdo:**
- Botón "+ Subir Archivo" (azul scout, icono upload)
- Botón "Nueva Carpeta" (outline, icono folder-plus)
- Dropdown "Filtrar por Tipo" (Todos, PDF, Imágenes, Word, Excel)
- Dropdown "Filtrar por Estado" (Todos, Aprobados, Pendientes, Rechazados)

**Lado Derecho:**
- Buscador con placeholder "Buscar archivos..." (icono search)
- Toggle "Vista: Grid/Lista" (iconos grid/list)
- Botón "Ordenar por" (nombre, fecha, tamaño, tipo)

NAVEGACIÓN DE CARPETAS:
- Breadcrumb clickeable: "Inicio > Cursos 2025 > Formación Básica"
- Carpetas especiales:
  - 📁 "Mis Documentos"
  - 📁 "Documentos Compartidos"  
  - 📁 "Fichas Médicas"
  - 📁 "Certificados"
  - 📁 "Formularios"

VISTA GRID DE ARCHIVOS:
**Card por Archivo:**
- Thumbnail del archivo (preview para imágenes/PDFs, icono para otros)
- Nombre del archivo (truncado con tooltip)
- Tipo y tamaño (PDF • 2.4 MB)
- Estado con badge (Aprobado/Pendiente/Rechazado/Procesando)
- Fecha de subida (DD/MM/YYYY)
- Avatar del usuario que subió
- Menu contextual (3 dots) con acciones

**Estados Visuales:**
- 🟢 Aprobado: Border verde, checkmark
- 🟡 Pendiente Revisión: Border amarillo, icono clock
- 🔴 Rechazado: Border rojo, icono X
- ⚪ Procesando: Border gris, spinner
- 🛡️ Antivirus: Icono shield durante escaneo

VISTA LISTA DE ARCHIVOS:
**Tabla Detallada:**
Columnas:
- **Archivo** (thumbnail + nombre)
- **Tipo** (badge con extensión)
- **Tamaño** (formato humanizado)
- **Propietario** (avatar + nombre)
- **Fecha Modificación**
- **Estado** (badge colorizado)
- **Descargas** (contador)
- **Acciones** (dropdown menu)

PANEL LATERAL DE DETALLES:
**Información del Archivo:**
- Preview grande del documento
- Nombre completo editable
- Descripción/notas
- Tags/categorías (chips editables)
- Metadata: tamaño, formato, resolución
- Historia de versiones (si aplica)
- Permisos de acceso (lista de usuarios/roles)

**Acciones Disponibles:**
- "Descargar" (icono download)
- "Compartir" (icono share, genera link)
- "Editar Permisos" (icono lock)
- "Nueva Versión" (icono upload)
- "Mover a Carpeta" (icono folder-move)
- "Eliminar" (icono trash, confirmación)

UPLOAD DE ARCHIVOS:
**Drag & Drop Zone:**
- Área grande con borde punteado
- Texto: "Arrastra archivos aquí o haz clic para seleccionar"
- Formatos aceptados: PDF, DOC, XLS, JPG, PNG (máx. 10MB)
- Progress bar durante upload
- Validation de formato y tamaño

**Queue de Upload:**
- Lista de archivos en proceso de subida
- Progress individual por archivo
- Estado: Subiendo/Procesando/Escaneando/Completado/Error
- Opción de cancelar uploads individuales

CONTROL DE VERSIONES:
**Modal de Versiones:**
- Lista cronológica de versiones del archivo
- Cada versión muestra: número, fecha, usuario, cambios
- Opciones: Ver, Descargar, Restaurar, Comparar
- Diff viewer para documentos de texto

PERMISOS Y COMPARTICIÓN:
**Modal de Permisos:**
- Lista de usuarios con acceso actual
- Niveles: Solo lectura, Lectura/descarga, Edición completa
- Agregar usuario por email o rol scout
- Link público con expiración configurable
- Log de accesos (quién y cuándo)

DISEÑO:
- Estilo: Modern file explorer similar a Google Drive/Dropbox
- Colores: Azul scout para elementos primarios, grises para estructura
- Grid: Cards responsivas, 4-6 por fila en desktop, 2 en tablet, 1 en móvil
- Loading: Skeleton loading para thumbnails y metadata
- Accesibilidad: Keyboard navigation, screen reader support

DETALLES ESPECÍFICOS:
- Thumbnails con lazy loading para performance
- Empty state illustration cuando carpeta está vacía
- Toast notifications para upload exitoso/fallido
- Modal de confirmación para eliminaciones
- Bulk actions: seleccionar múltiples archivos para acciones masivas
- Real-time sync cuando otros usuarios hacen cambios
```

---

## 🔔 **PROMPT 7: CENTRO DE NOTIFICACIONES**

```
Diseña un mockup profesional para el Centro de Notificaciones del sistema SGICS.

CONTEXTO: Hub centralizado donde usuarios reciben notificaciones automáticas del sistema, configuran preferencias de comunicación y gestionan mensajes importantes.

USUARIO: Todos los usuarios scouts que necesitan estar informados sobre estados de inscripción, pagos, cursos y comunicaciones oficiales.

LAYOUT PRINCIPAL:
- Header con breadcrumb: "Dashboard > Notificaciones > Centro de Mensajes"
- Panel izquierdo con categorías y filtros
- Área principal con lista de notificaciones
- Panel derecho con detalles de notificación seleccionada

PANEL IZQUIERDO - CATEGORÍAS:
**Secciones:**
- 📨 "Todas" (contador total de no leídas)
- 📋 "Preinscripciones" (estados, validaciones)
- 💰 "Pagos" (confirmaciones, recordatorios)
- 🎓 "Cursos" (asignaciones, cambios, recordatorios)
- 📁 "Documentos" (aprobaciones, rechazos)
- ⚠️ "Alertas Sistema" (mantenimiento, errores)
- ✉️ "Mensajes Directos" (comunicación personal)

**Filtros:**
- Toggle "Solo No Leídas"
- Filtro por fecha (Hoy, Esta semana, Este mes)
- Filtro por prioridad (Alta, Media, Baja)
- Filtro por tipo (Email, SMS, In-app, Push)

LISTA DE NOTIFICACIONES (Centro):
**Card por Notificación:**
- Avatar/icono del remitente o tipo de notificación
- Indicador de no leída (punto azul)
- Título del mensaje (bold si no leída)
- Snippet del contenido (2 líneas máx)
- Timestamp relativo (hace 2 horas, ayer, 3 días)
- Badges de prioridad/categoría
- Menu contextual (marcar leída, archivar, eliminar)

**Tipos de Notificación con Iconos:**
- 📝 Preinscripción Aprobada (icono checkmark verde)
- ⏰ Recordatorio de Pago (icono dinero amarillo)
- 🎯 Curso Asignado (icono graduación azul)
- ❌ Documento Rechazado (icono X rojo)
- 📢 Anuncio General (icono megáfono)
- 🔔 Recordatorio de Fecha (icono calendario)

**Estados Visuales:**
- No leída: Background blanco, título bold
- Leída: Background gris muy claro, texto normal
- Importante: Border izquierdo rojo/amarillo
- Archivada: Opacity reducida

PANEL DERECHO - DETALLES:
**Vista de Notificación Individual:**
- Header con remitente y timestamp completo
- Título completo del mensaje
- Contenido HTML completo con formato
- Botones de acción específicos por tipo:
  - "Ver Preinscripción" → link directo
  - "Pagar Ahora" → link a pagos
  - "Descargar Documento" → download
  - "Responder" → composer de mensaje

**Metadatos:**
- Canales de envío (Email ✓, SMS ✓, Push ✓)
- Estado de lectura en otros dispositivos
- Acciones relacionadas disponibles

COMPOSER DE MENSAJES:
**Modal/Panel para Envío:**
- Selector de destinatario (autocompletado)
- Campo de asunto
- Editor rich text para el mensaje
- Selector de canales (Email, SMS, In-app)
- Programación de envío (inmediato/programado)
- Templates predefinidos (dropdown)

**Templates Comunes:**
- "Recordatorio de Pago"
- "Confirmación de Inscripción"
- "Cambio de Fechas de Curso"
- "Solicitud de Documentos"
- "Mensaje General"

CONFIGURACIÓN DE PREFERENCIAS:
**Modal de Configuración:**
- **Por Categoría:** Toggle para cada tipo de notificación
- **Por Canal:** Email/SMS/Push por tipo de mensaje
- **Horarios:** No molestar entre X e Y horas
- **Frecuencia:** Inmediato, Diario, Semanal
- **Dispositivos:** Configuración por dispositivo/browser

**Sección de Opt-outs:**
- Desuscripción de comunicaciones marketing
- Solo notificaciones críticas
- Pausa temporal (vacaciones)

BARRA DE ACCIONES SUPERIORES:
- "Marcar Todas como Leídas"
- "Archivar Seleccionadas"
- "Configurar Notificaciones" (icono settings)
- "Nueva Notificación" (solo para coordinadores)

ACCIONES MASIVAS:
- Checkbox para seleccionar múltiples notificaciones
- Barra de acciones aparece cuando hay selección:
  - "Marcar como Leídas/No Leídas"
  - "Archivar"
  - "Eliminar"
  - "Mover a Categoría"

DISEÑO:
- Estilo: Inbox moderno similar a Gmail/Outlook
- Colores: Azul scout para elementos primarios, badges contextuales
- Typography: Clear hierarchy, readable sizes
- Real-time: Updates automáticos cuando llegan nuevas notificaciones
- Responsive: Panel lateral colapsa en móvil, navigation tabs

DETALLES ESPECÍFICOS:
- Counter badges actualizados en tiempo real
- Sound notification opcional para mensajes importantes
- Push notifications cuando app está en background
- Rich notifications con actions (Aprobar/Rechazar desde notification)
- Keyboard shortcuts (j/k para navegar, enter para abrir)
- Search functionality para buscar en historial de notificaciones
- Empty state illustration cuando no hay notificaciones
```

---

## 📊 **PROMPT 8: REPORTES EJECUTIVOS**

```
Diseña un mockup profesional para la pantalla de Reportes Ejecutivos del sistema SGICS.

CONTEXTO: Dashboard avanzado con reportes interactivos, gráficos dinámicos y análisis de datos para toma de decisiones estratégicas de directivos scouts.

USUARIO: Directores regionales, coordinadores senior y equipo administrativo que requieren insights detallados sobre performance de cursos, finanzas y participación.

LAYOUT PRINCIPAL:
- Header con breadcrumb: "Dashboard > Reportes > Análisis Ejecutivo"
- Toolbar con filtros globales y controles de export
- Grid responsive de widgets de reportes
- Cada widget expandible a vista detallada

TOOLBAR DE FILTROS GLOBALES:
**Filtros Principales:**
- Date Range Picker: "Últimos 6 meses" (preset: Hoy, Semana, Mes, Trimestre, Año, Personalizado)
- Multi-select "Zonas": Todas seleccionadas por defecto
- Multi-select "Tipos de Curso": (Formación Básica, Especialización, Dirigentes, etc.)
- Toggle "Solo Cursos Activos" vs. "Incluir Finalizados"

**Controles de Export:**
- "Exportar Dashboard" → PDF con todos los widgets
- "Programar Reporte" → Modal para envío automático por email
- "Compartir Vista" → Generate shareable link

WIDGETS DE REPORTES:

**1. WIDGET: KPIs PRINCIPALES (Grande, top)**
- 4 métricas principales en cards horizontales:
  - "Total Participantes" (número + % cambio vs. período anterior)
  - "Ingresos Totales" (CLP + % vs. meta anual)
  - "Cursos Completados" (número + % éxito)
  - "NPS Promedio" (score + trend indicator)
- Cada KPI con mini sparkline mostrando trend
- Color coding: verde para positivo, rojo para negativo

**2. WIDGET: PARTICIPACIÓN POR RAMA (Mediano)**
- Gráfico de barras apiladas por mes
- Cada barra dividida por: Manada, Tropa, Comunidad, Rover
- Legend interactiva (click para mostrar/ocultar rama)
- Hover tooltips con números exactos
- Opción de cambiar vista: barras/líneas/área

**3. WIDGET: PERFORMANCE FINANCIERO (Mediano)**
- Gráfico dual: barras (ingresos) + línea (gastos)
- Eje Y izquierdo: montos CLP
- Eje Y derecho: porcentaje de margen
- Zona sombreada mostrando target de rentabilidad
- Drill-down por click a detalle mensual

**4. WIDGET: TOP CURSOS (Lista)**
- Ranking de cursos por participación/ingresos/satisfacción
- Cada item muestra:
  - Posición (#1, #2, etc.)
  - Nombre del curso
  - Métricas clave (participantes, ingresos, NPS)
  - Trend vs. período anterior (↑↓)
- Toggle para cambiar criterio de ranking

**5. WIDGET: MAPA DE CALOR TERRITORIAL (Mediano)**
- Mapa de la región Bío-Bío
- Zonas coloreadas por intensidad de participación
- Hover muestra detalles de cada zona
- Legend con escala de colores
- Click para drill-down a detalle de zona

**6. WIDGET: ANÁLISIS DE ABANDONO (Mediano)**
- Funnel chart mostrando:
  - Preinscripciones iniciadas
  - Preinscripciones completadas  
  - Pagos confirmados
  - Participación efectiva
  - Certificación exitosa
- Porcentajes de conversión entre etapas
- Identificación de principales puntos de fuga

**7. WIDGET: PROYECCIONES (Grande, bottom)**
- Gráfico de líneas con proyección futura
- Data histórica (línea sólida) + proyección (línea punteada)
- Bandas de confianza sombreadas
- Métricas proyectadas: participantes, ingresos, cursos
- Escenarios: optimista, realista, pesimista

MODAL DE WIDGET EXPANDIDO:
**Vista Detallada:**
- Widget en tamaño completo con más granularidad
- Filtros específicos del reporte
- Tabla de datos subyacente (toggle)
- Opciones de export específicas (Excel, CSV, PNG)
- Configuración de alertas (threshold notifications)

CONFIGURACIÓN DE DASHBOARD:
**Modal de Personalización:**
- Drag & drop para reordenar widgets
- Toggle para mostrar/ocultar widgets
- Configuración de refresh automático (off, 5min, 15min, 30min)
- Guardar layouts personalizados por usuario
- Reset a configuración por defecto

ALERTAS INTELIGENTES:
**Panel de Alertas (Sidebar):**
- Notificaciones automáticas cuando métricas cruzan thresholds
- Ejemplos:
  - "Participación bajo 80% de meta mensual"
  - "Ingresos superaron proyección en 15%"  
  - "NPS bajó por debajo de 7.0"
- Configuración de umbrales por métrica

SHARING Y COLABORACIÓN:
**Funcionalidades Sociales:**
- Comentarios en widgets (pin annotations)
- Compartir insights específicos
- Subscripción de stakeholders a reportes
- Historial de cambios en configuración

DISEÑO:
- Estilo: Executive dashboard professional (inspirado en Tableau/Power BI)
- Colores: Azul scout como primario, paleta colorblind-friendly para gráficos
- Layout: CSS Grid responsive, widgets reordenables
- Charts: Librería moderna (D3.js/Chart.js) con interactividad
- Performance: Lazy loading de widgets, data virtualization

RESPONSIVE DESIGN:
- Desktop: 3-4 columnas de widgets
- Tablet: 2 columnas, widgets adaptan tamaño
- Mobile: 1 columna, navegación por tabs entre categorías

DETALLES ESPECÍFICOS:
- Loading skeletons mientras cargan datos
- Empty states con ilustraciones cuando no hay data
- Error states con retry options
- Real-time indicators cuando data se actualiza
- Keyboard shortcuts para power users (r=refresh, f=fullscreen, etc.)
- Tooltips contextuales explicando métricas complejas
- Export watermark con logo scouts y fecha/hora
```

---

## 🎯 **GUÍA DE USO DE LOS PROMPTS**

### **Instrucciones para usar con Sora/ChatGPT:**

1. **Copia exactamente** cada prompt completo
2. **Agrega al inicio:** "Genera un mockup/wireframe profesional basado en esta descripción:"
3. **Especifica el formato:** "Como imagen de alta calidad, estilo UI/UX profesional"
4. **Menciona herramientas:** "Estilo similar a Figma/Sketch designs"

### **Variaciones sugeridas:**
- **Para wireframes:** Agrega "en escala de grises, sin colores, enfoque en estructura"
- **Para prototipos:** Agrega "con colores reales, imágenes placeholder realistas"
- **Para mobile:** Agrega "optimizado para smartphone, viewport 375px"

### **Elementos comunes a personalizar:**
- **Logo:** Reemplaza con el logo oficial de Scouts de Chile
- **Colores:** Ajusta según brand guidelines scouts oficiales
- **Contenido:** Usa nombres de cursos reales de la región Bío-Bío
- **Imágenes:** Incluye fotos de actividades scouts auténticas

**Estos prompts están optimizados para generar mockups profesionales que cumplan con los requerimientos funcionales del sistema SGICS y proporcionen una base sólida para el desarrollo del frontend.**