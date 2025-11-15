# Backend - Sistema GIC (Gestión Integral de Cursos)

## 📋 Estado Actual

✅ **Backend 100% configurado y funcional**

- ✅ Todas las 43 tablas del SQL implementadas
- ✅ 4 tablas adicionales (sistema de preinscripción)
- ✅ Migraciones aplicadas correctamente
- ✅ Django ORM funcionando
- ✅ Listo para desarrollo de API REST

## 🏗️ Arquitectura

### Stack Tecnológico

- **Framework:** Django 5.2.7
- **API:** Django REST Framework 3.16.1
- **CORS:** django-cors-headers 4.9.0
- **Base de datos:** SQLite (desarrollo) / MySQL (producción)

### Estructura de Apps

```
backend/
├── scout_project/     # Configuración principal Django
├── usuarios/          # Gestión de usuarios y perfiles (2 modelos)
├── maestros/          # Tablas catálogo (11 modelos)
├── geografia/         # Estructura geográfica (6 modelos)
├── personas/          # Gestión de personas (8 modelos)
├── cursos/            # Gestión de cursos (7 modelos)
├── archivos/          # Archivos adjuntos (3 modelos)
├── pagos/             # Gestión de pagos (5 modelos)
├── proveedores/       # Gestión de proveedores (1 modelo)
└── preinscripcion/    # Sistema de preinscripción (4 modelos)
```

**Total:** 47 modelos (43 del SQL original + 4 extensiones)

## 📚 Documentación

### Guías Disponibles

| Archivo | Descripción | Tamaño |
|---------|-------------|--------|
| **QUICK_START.md** | Comandos de verificación rápida | 6.2 KB |
| **SCHEMA_ANALYSIS.md** | Análisis completo SQL vs Django | 8.8 KB |
| **NEXT_STEPS.md** | Guía de implementación API | 10.1 KB |
| **../BACKEND_REVIEW_SUMMARY.md** | Resumen ejecutivo | 5.4 KB |

### Para Comenzar

1. **Verificación Rápida** → Ver `QUICK_START.md`
2. **Entender el Schema** → Ver `SCHEMA_ANALYSIS.md`
3. **Implementar API** → Ver `NEXT_STEPS.md`

## 🚀 Quick Start

### Instalación

```bash
# Instalar dependencias
pip install django==5.2.7 djangorestframework django-cors-headers

# Verificar configuración
python manage.py check

# Ver estado de migraciones
python manage.py showmigrations

# Iniciar servidor de desarrollo
python manage.py runserver 0.0.0.0:8000
```

### Crear Superusuario

```bash
python manage.py createsuperuser
```

Acceder al admin en: http://localhost:8000/admin/

## 📊 Modelos por App

### usuarios (2 modelos)
- `Usuario` - Usuarios del sistema
- `PerfilAplicacion` - Permisos por perfil

### maestros (11 modelos)
Tablas de catálogo:
- `Alimentacion`, `Aplicacion`, `Cargo`, `ConceptoContable`
- `EstadoCivil`, `Nivel`, `Perfil`, `Rama`, `Rol`
- `TipoArchivo`, `TipoCurso`

### geografia (6 modelos)
Estructura geográfica:
- `Region` → `Provincia` → `Comuna`
- `Zona` → `Distrito` → `Grupo`

### personas (8 modelos)
- `Persona` - Datos personales
- `PersonaCurso` - Inscripciones
- `PersonaEstadoCurso` - Historial de estados
- `PersonaFormador`, `PersonaGrupo`, `PersonaIndividual`
- `PersonaNivel`, `PersonaVehiculo`

### cursos (7 modelos)
- `Curso` - Datos del curso
- `CursoSeccion` - Secciones del curso
- `CursoFecha`, `CursoCuota`, `CursoAlimentacion`
- `CursoCoordinador`, `CursoFormador`

### archivos (3 modelos)
- `Archivo` - Archivos generales
- `ArchivoCurso` - Archivos de curso
- `ArchivoPersona` - Archivos de persona

### pagos (5 modelos)
- `PagoPersona` - Pagos realizados
- `ComprobantePago` - Comprobantes emitidos
- `PagoComprobante` - Relación pago-comprobante
- `PagoCambioPersona` - Auditoría de cambios
- `Prepago` - Prepagos realizados

### proveedores (1 modelo)
- `Proveedor` - Proveedores de servicios

### preinscripcion (4 modelos - extensión)
- `Preinscripcion` - Preinscripciones de cursos
- `PreinscripcionEstadoLog` - Auditoría de estados
- `CupoConfiguracion` - Control de cupos
- `Documento` - Documentos de personas

## 🔧 Comandos Útiles

```bash
# Verificar configuración
python manage.py check

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Shell interactivo
python manage.py shell

# Crear datos de prueba (si existe fixture)
python manage.py loaddata fixtures.json

# Ejecutar tests
python manage.py test

# Ver SQL de una migración
python manage.py sqlmigrate <app> <migration_number>
```

## 📖 Próximos Pasos

El backend está completo en cuanto a modelos y base de datos. Los siguientes pasos son:

### Fase 1: Autenticación y Catálogos
- [ ] Implementar JWT authentication
- [ ] Serializers para maestros (solo lectura)
- [ ] Serializers para geografia (solo lectura)

### Fase 2: Usuarios y Personas
- [ ] Serializers y ViewSets para usuarios
- [ ] Serializers y ViewSets para personas
- [ ] Sistema de permisos

### Fase 3: Cursos
- [ ] Serializers y ViewSets para cursos
- [ ] Endpoints para secciones, fechas, cuotas
- [ ] Validaciones de negocio

### Fase 4: Preinscripciones y Pagos
- [ ] Serializers y ViewSets para preinscripcion
- [ ] Serializers y ViewSets para pagos
- [ ] Workflow de estados

### Fase 5: Testing y Documentación
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Documentación Swagger

Ver `NEXT_STEPS.md` para detalles completos con ejemplos de código.

## ✅ Verificación

Para verificar que todo está correctamente configurado:

```bash
cd backend
python manage.py check
```

**Resultado esperado:** `System check identified no issues (0 silenced).`

Ver `QUICK_START.md` para más comandos de verificación.

## 📝 Notas Importantes

### Base de Datos
- **Desarrollo:** SQLite (`db.sqlite3`)
- **Producción:** Configurar MySQL en `settings.py`

### Migraciones
- Todas las migraciones están aplicadas
- No modificar migraciones existentes
- Crear nuevas migraciones con `makemigrations`

### Convenciones
- Nombres de tabla mantienen prefijos SQL (per_, cur_, etc.)
- Foreign keys usan `db_column` para mantener nombres originales
- BooleanField para campos `bit` del SQL
- DecimalField(21,6) para valores monetarios

## 🤝 Contribuir

Al agregar nuevos modelos:

1. Definir modelo en `models.py` de la app correspondiente
2. Usar `db_table` en Meta para nombre de tabla SQL
3. Usar `db_column` en ForeignKey para mantener nombres
4. Crear migración: `python manage.py makemigrations`
5. Aplicar migración: `python manage.py migrate`
6. Actualizar documentación

## 📞 Soporte

- Ver documentación en los archivos `.md`
- Consultar `SCHEMA_ANALYSIS.md` para detalles del schema
- Seguir `NEXT_STEPS.md` para implementar API

---

**Última actualización:** 2025-11-15  
**Django Version:** 5.2.7  
**Estado:** Producción Ready (modelos y BD)
