# SGICS - Estructura del Proyecto y Tareas Pendientes

## 📋 Resumen del Proyecto
Sistema de Gestión Integral de Cursos Scout - Aplicación web para gestionar cursos, preinscripciones, pagos y archivos de la organización Scout.

## 🏗️ Arquitectura
- **Backend**: Django 5.0 + Django REST Framework + JWT
- **Frontend**: Vue 3 + TypeScript + Pinia + Tailwind CSS
- **Base de Datos**: MySQL 8.0 (desarrollo) / PostgreSQL (producción)
- **Contenedores**: Docker + Docker Compose

## 📁 Estructura de Carpetas

```
IngSw-seccion1/
├── backend/                    # Django API
│   ├── apps/                  # Aplicaciones del proyecto
│   │   ├── authentication/   # ✅ Usuarios, roles, JWT
│   │   ├── courses/          # ✅ Cursos y categorías
│   │   ├── preinscriptions/  # ✅ Preinscripciones
│   │   ├── payments/         # ⚠️ Pagos (básico implementado)
│   │   └── files/            # ⚠️ Archivos (básico implementado)
│   ├── scouts_platform/      # Configuración Django
│   ├── utils/                # Utilidades compartidas
│   └── tests/                # Tests del backend
├── frontend/                  # Vue.js App
│   ├── src/
│   │   ├── components/       # ❌ Componentes Vue (pendiente)
│   │   ├── views/            # ❌ Páginas principales (pendiente)
│   │   ├── stores/           # ❌ Pinia stores (pendiente)
│   │   └── utils/            # ❌ Utilidades frontend (pendiente)
├── docs/                     # Documentación del proyecto
└── infrastructure/           # Docker y deployment
```

## 🚀 Estado Actual de Implementación

### ✅ Completado (Base Inicial)
- [x] Modelos básicos de todas las apps
- [x] Serializers básicos con TODOs
- [x] ViewSets básicos con estructura REST
- [x] URLs configuradas
- [x] Settings de Django configurados
- [x] Configuración de autenticación JWT
- [x] Estructura de carpetas del frontend

### ⚠️ Parcialmente Implementado
- [ ] Validaciones de negocio (50% - muchos TODOs)
- [ ] Sistema de permisos RBAC (30% - estructura básica)
- [ ] Frontend Vue (10% - solo estructura)
- [ ] Tests unitarios (0% - archivos vacíos)

### ❌ Pendiente por Implementar
- [ ] Frontend completo (componentes, vistas, stores)
- [ ] Validaciones de RUT chileno
- [ ] Sistema de pagos con WebPay
- [ ] Upload/download de archivos
- [ ] Dashboard con KPIs
- [ ] Tests de integración
- [ ] Documentación de APIs

## 👥 Asignación por Equipos

### 🔐 Grupo A - Autenticación y Control de Roles
**Archivos asignados:**
- `backend/apps/authentication/` (completar TODOs)
- Implementar validación de RUT chileno
- Sistema JWT completo (login, refresh, logout)
- RBAC con permisos granulares

**TODOs principales:**
```python
# authentication/models.py
- Completar validador de RUT
- Agregar campos Scout específicos
- Implementar métodos user_has_role() y get_user_roles()

# authentication/serializers.py  
- Validaciones de contraseña y confirmación
- Serializers de perfil completo
- Validación de credenciales JWT

# authentication/views.py
- Permisos por ViewSet
- Acciones personalizadas (cambio de contraseña, etc.)
```

### 📚 Grupo B - Pagos, QA y Documentación
**Archivos asignados:**
- `backend/apps/payments/` (completar TODOs)
- Implementar tests unitarios
- Documentación de APIs

**TODOs principales:**
```python
# payments/models.py
- Integración con WebPay
- Validaciones de montos y fechas
- Sistema de cuotas completo

# Crear tests/
- test_authentication.py
- test_courses.py  
- test_payments.py
- test_preinscriptions.py

# Documentación
- README detallado de APIs
- Postman collection
- Diagramas de flujo
```

### 👥 Grupo C - Gestión de Personas y DevOps
**Archivos asignados:**
- `backend/apps/courses/` (completar TODOs)
- Docker y deployment
- Scripts de inicialización

**TODOs principales:**
```python
# courses/models.py
- Validadores de fechas y precios
- Propiedades calculadas (available_slots, etc.)
- Lógica de inscripciones

# Docker
- Mejorar docker-compose.yml
- Scripts de deployment
- Variables de entorno por ambiente
```

### 📝 Grupo H - Preinscripciones y Archivos  
**Archivos asignados:**
- `backend/apps/preinscriptions/` (completar TODOs)
- `backend/apps/files/` (completar TODOs)

**TODOs principales:**
```python
# preinscriptions/models.py
- Flujo completo de estados
- Métodos de transición
- Validaciones de negocio

# files/models.py
- Sistema de permisos de archivos
- Validación de tipos de archivo
- Integración con antivirus
```

### 🎨 Grupo Z - Frontend y Perfiles de Usuario
**Archivos asignados:**
- `frontend/src/` (implementación completa)
- Componentes Vue
- Vistas y navegación

**TODOs principales:**
```typescript
// Instalar dependencias
npm install vue@next vue-router@4 pinia tailwindcss

// Crear componentes
- LoginForm.vue
- Dashboard.vue  
- CourseList.vue
- UserProfile.vue

// Configurar stores
- authStore.ts
- coursesStore.ts
- paymentsStore.ts
```

## 🛠️ Comandos para Empezar

### Backend (todos los grupos)
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python setup_initial.py
python manage.py runserver
```

### Frontend (Grupo Z)
```bash
cd frontend
npm install
npm run dev
```

## 📞 Coordinación entre Equipos

1. **Daily Standups**: Reportar avance de TODOs completados
2. **APIs Contract**: Grupo A define contratos para otros grupos
3. **Testing**: Grupo B valida implementaciones de otros grupos
4. **Integration**: Grupo C coordina integración entre módulos
5. **UX/UI**: Grupo Z define interfaces para backend

## 🎯 Objetivos del Sprint

1. **Semana 1**: Completar todos los TODOs del backend
2. **Semana 2**: Frontend funcional + Tests básicos
3. **Semana 3**: Integración completa + Deploy

¡El proyecto está listo para que cada equipo complete su parte! 🚀