# Eliminación de Datos Mock y Conexión con Base de Datos

## Resumen de Cambios

Este documento describe los cambios realizados para eliminar datos mock del dashboard y conectar todo con la base de datos real.

## Cambios Realizados

### 1. Backend - Nuevos Endpoints de API

**Archivo**: `/backend/usuarios/dashboard_views.py` (NUEVO)

Se crearon 5 endpoints de API para proporcionar datos reales del dashboard:

#### `dashboard_stats` - GET `/api/usuarios/dashboard/stats/`
Estadísticas generales del sistema:
- Total de personas activas
- Cursos activos (estado = 1)
- Pagos pendientes (estado = 1)
- Total de inscripciones

#### `dashboard_payment_stats` - GET `/api/usuarios/dashboard/payment-stats/`
Estadísticas de pagos:
- Ingresos totales del mes actual
- Cantidad de pagos pendientes
- Cantidad de cursos con pagos confirmados

#### `dashboard_recent_courses` - GET `/api/usuarios/dashboard/recent-courses/`
Lista de cursos recientes con:
- Nombre y código del curso
- Fecha de inicio
- Cantidad de inscritos vs capacidad
- Ubicación
- Estado

#### `dashboard_recent_activity` - GET `/api/usuarios/dashboard/recent-activity/`
Actividad reciente del sistema:
- Inscripciones recientes
- Pagos confirmados recientes
- Cursos creados recientemente

#### `dashboard_executive_stats` - GET `/api/usuarios/dashboard/executive-stats/`
Estadísticas ejecutivas con tendencias:
- Total participantes (con % de cambio mes a mes)
- Cursos activos (con tendencia)
- Pagos pendientes
- Ingresos del mes (con % de crecimiento)

**Archivo**: `/backend/usuarios/urls.py` (MODIFICADO)

Se agregaron las rutas para los 5 nuevos endpoints.

### 2. Frontend - Componentes Actualizados

#### DashboardEjecutivo.jsx - REESCRITO COMPLETAMENTE

**Antes**:
- Datos hardcodeados en arrays locales
- 4 stats con valores fijos (156 participantes, 8 cursos, etc.)
- 3 cursos recientes con datos mock
- 3 actividades recientes con datos mock
- **Sección "Cursos Más Populares" con 4 cursos y porcentajes** ❌

**Después**:
- Datos cargados desde API en `useEffect`
- Stats dinámicos desde `/api/usuarios/dashboard/executive-stats/`
- Cursos recientes desde `/api/usuarios/dashboard/recent-courses/`
- Actividad reciente desde `/api/usuarios/dashboard/recent-activity/`
- **Sección "Cursos Más Populares" ELIMINADA** ✅
- Estados de carga (loading skeletons)
- Manejo de errores

**Cambios específicos**:
```jsx
// ANTES
const stats = [
  { icon: FaUsers, label: 'Total Participantes', value: '156', ... },
  // ... más datos mock
];

// DESPUÉS
const [stats, setStats] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadDashboardData();
}, [selectedPeriod]);

const loadDashboardData = async () => {
  const [statsData, coursesData, activityData] = await Promise.all([
    api.get('/usuarios/dashboard/executive-stats/'),
    api.get('/usuarios/dashboard/recent-courses/'),
    api.get('/usuarios/dashboard/recent-activity/')
  ]);
  // ... procesar y actualizar estado
};
```

#### DashboardPagos.jsx - ACTUALIZADO

**Antes**:
- Valores hardcodeados en 0
- Sin conexión con API

**Después**:
- Carga datos desde `/api/usuarios/dashboard/payment-stats/`
- Muestra valores reales de la base de datos
- Formato de moneda chilena para ingresos
- Estados de carga

#### api.js - MODIFICADO

Se agregó `export default api;` al final del archivo para permitir importaciones más limpias:

```jsx
// Ahora se puede usar:
import api from '@/lib/api';
```

### 3. Documentación

**Archivo**: `/backend/scripts/README_POPULATE.md` (NUEVO)

Documentación completa sobre:
- Cómo ejecutar el script populate_full_data.py
- Qué datos crea el script
- Diferentes métodos de ejecución (Docker, Python local, Django shell)
- Verificación de datos
- Troubleshooting

## Datos Mock Eliminados

### DashboardEjecutivo

1. **Array `stats`**: 4 objetos con valores hardcodeados
   - Total Participantes: 156
   - Cursos Activos: 8
   - Pagos Pendientes: 23
   - Ingresos del Mes: $4,560,000

2. **Array `recentCourses`**: 3 objetos con cursos falsos
   - Formación Básica
   - Curso de Liderazgo
   - Especialidades Técnicas

3. **Array `recentActivity`**: 3 objetos con actividades falsas
   - Inscripción de Juan Pérez
   - Pago de María Silva
   - Curso de Campamento de Verano

4. **Array `topCourses`** (SECCIÓN ELIMINADA): 4 objetos con cursos populares
   - Formación Básica: 145 participantes (92%)
   - Curso de Liderazgo: 98 participantes (78%)
   - Especialidades Técnicas: 87 participantes (69%)
   - Técnicas de Gestión: 65 participantes (52%)

### DashboardPagos

1. **Total Ingresos**: $0 hardcodeado
2. **Pagos Pendientes**: 0 hardcodeado
3. **Cursos Pagados**: 0 hardcodeado

## Verificación de Funcionamiento

### 1. Ejecutar el Script de Población

```bash
# Con Docker
docker-compose exec backend python scripts/populate_full_data.py

# Sin Docker
cd backend
python scripts/populate_full_data.py
```

### 2. Verificar en el Dashboard

1. Acceder a: http://localhost:3000/coordinador/panel/ejecutivo
2. Verificar que los stats muestren números reales (8 usuarios, 4 cursos, etc.)
3. Verificar que los cursos recientes aparezcan
4. Verificar que la actividad reciente se muestre

### 3. Verificar los Endpoints

```bash
# Stats generales
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/usuarios/dashboard/stats/

# Stats ejecutivas
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/usuarios/dashboard/executive-stats/

# Stats de pagos
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/usuarios/dashboard/payment-stats/
```

## Estructura de Datos

### Tablas de Base de Datos Utilizadas

1. **Persona**: Información de participantes y personal
2. **Curso**: Información de cursos
3. **CursoSeccion**: Secciones de cursos con capacidad
4. **CursoFecha**: Fechas de inicio/término de cursos
5. **PersonaCurso**: Inscripciones de personas a cursos
6. **PersonaEstadoCurso**: Estados de inscripciones
7. **Pago**: Información de pagos
8. **Proveedor**: Información de proveedores

### Flujo de Datos

```
Base de Datos (MySQL)
    ↓
Django Models (ORM)
    ↓
Django REST Framework ViewSets/API Views
    ↓
JSON Response
    ↓
Axios (Frontend API Client)
    ↓
React State (useState)
    ↓
Componentes React (UI)
```

## Testing

Para probar que todo funciona correctamente:

1. **Backend**: Ejecutar el script de población
2. **Frontend**: Abrir el dashboard y verificar que muestre datos reales
3. **API**: Usar Swagger UI en http://localhost:8000/api/docs/ para probar endpoints

## Beneficios de los Cambios

1. ✅ **Datos Reales**: Todo el dashboard muestra datos reales de la base de datos
2. ✅ **Sin Mock Data**: Eliminados todos los arrays hardcodeados
3. ✅ **Sección Eliminada**: "Cursos Más Populares" removida como se solicitó
4. ✅ **Sincronización**: Frontend y backend sincronizados
5. ✅ **Escalabilidad**: Fácil agregar más endpoints y estadísticas
6. ✅ **Mantenibilidad**: Código más limpio y mantenible
7. ✅ **UX Mejorada**: Estados de carga y manejo de errores

## Archivos Modificados

```
backend/
  usuarios/
    ├── dashboard_views.py (NUEVO)
    └── urls.py (MODIFICADO)
  scripts/
    └── README_POPULATE.md (NUEVO)

frontend/
  src/
    components/
      dashboard/
        ├── DashboardEjecutivo.jsx (REESCRITO)
        └── DashboardPagos.jsx (ACTUALIZADO)
    lib/
      └── api.js (MODIFICADO)
```

## Próximos Pasos Sugeridos

1. Agregar más estadísticas según necesidades del negocio
2. Implementar filtros por período (semana/mes/año) en los endpoints
3. Agregar gráficos visuales con Chart.js o Recharts
4. Crear tests unitarios para los endpoints
5. Agregar paginación para actividad reciente
6. Implementar WebSockets para actualizaciones en tiempo real
