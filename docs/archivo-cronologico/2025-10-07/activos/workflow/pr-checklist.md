# Checklist de Pull Request - SGICS

## Antes de Crear el PR

### Verificación Local
- [ ] Código compila sin errores
- [ ] Todos los tests pasan localmente
- [ ] Linting sin errores (ESLint)
- [ ] No hay archivos temporales o debug code
- [ ] Variables de entorno actualizadas si es necesario

### Testing
- [ ] Tests unitarios escritos para nueva funcionalidad
- [ ] Tests existentes actualizados si es necesario
- [ ] Coverage mínimo mantenido (Backend >80%, Frontend >70%)
- [ ] Tests de integración si aplica

### Comandos Pre-PR
```bash
# Backend
cd backend
pytest --cov=. --cov-report=term-missing

# Frontend
cd frontend
npm run test:coverage
npm run lint
npm run build
```

## Información del PR

### Título
Formato: `[SGICS-XXX] Descripción clara y concisa`

Ejemplos:
- `[SGICS-201] Implementar autenticación JWT`
- `[SGICS-401] Agregar wizard de preinscripción paso 1`
- `[SGICS-901] Configurar pipeline CI/CD`

### Descripción Requerida
```markdown
## Resumen
Breve descripción de los cambios implementados.

## Tipo de Cambio
- [ ] Bug fix (cambio que arregla un issue)
- [ ] Nueva funcionalidad (cambio que agrega funcionalidad)
- [ ] Breaking change (cambio que puede romper funcionalidad existente)
- [ ] Documentación
- [ ] Refactoring
- [ ] Performance
- [ ] Tests

## Funcionalidades Implementadas
- Funcionalidad 1
- Funcionalidad 2
- etc.

## Testing Realizado
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Tests manuales
- [ ] Tests de performance (si aplica)

## Screenshots/GIFs (si aplica frontend)
[Agregar capturas de pantalla]

## Checklist Final
- [ ] Mi código sigue las convenciones del proyecto
- [ ] He realizado self-review del código
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevos warnings
- [ ] He agregado tests que prueban mi fix/feature
- [ ] Tests nuevos y existentes pasan localmente
```

## Revisión de Código

### Para el Autor
- [ ] Self-review completo realizado
- [ ] Commits atómicos y bien descritos
- [ ] Branch actualizado con main/develop
- [ ] Conflictos resueltos
- [ ] CI/CD pipeline verde

### Para el Reviewer
- [ ] Código fácil de leer y entender
- [ ] Lógica de negocio correcta
- [ ] Manejo de errores adecuado
- [ ] Performance considerada
- [ ] Seguridad evaluada
- [ ] Tests cubren casos principales
- [ ] Documentación suficiente

## Criterios de Aprobación

### Obligatorios
- [ ] Al menos 1 aprobación requerida
- [ ] CI/CD pipeline verde
- [ ] Conflictos resueltos
- [ ] Tests pasan
- [ ] Coverage mantenido

### Por Tipo de Cambio

#### Funcionalidad Nueva
- [ ] User story completa
- [ ] Acceptance criteria cumplidos
- [ ] Demo funcional
- [ ] Documentación actualizada

#### Bug Fix
- [ ] Issue original reproducido
- [ ] Fix verificado
- [ ] Tests de regresión agregados
- [ ] Root cause documentado

#### Refactoring
- [ ] Funcionalidad preservada
- [ ] Performance no degradada
- [ ] Tests existentes pasan
- [ ] Beneficios documentados

## Merge Strategy

### Squash and Merge (Recomendado)
- Para features completas
- Mantiene historia limpia
- Un commit por PR en main

### Rebase and Merge
- Para hotfixes críticos
- Preserva commits individuales
- Solo con aprobación Tech Lead

## Post-Merge

### Verificación
- [ ] Deploy automático exitoso (si aplica)
- [ ] Smoke tests en staging pasan
- [ ] Funcionalidad verificada en ambiente
- [ ] Documentación actualizada

### Limpieza
- [ ] Branch feature eliminado
- [ ] Issue/ticket actualizado
- [ ] Release notes actualizadas (si aplica)

## Convenciones de Branch

### Naming
- `feature/SGICS-XXX-short-description`
- `hotfix/SGICS-XXX-short-description`
- `bugfix/SGICS-XXX-short-description`
- `docs/SGICS-XXX-short-description`

### Ejemplos
- `feature/SGICS-201-jwt-authentication`
- `feature/SGICS-401-preinscription-wizard`
- `hotfix/SGICS-205-login-redirect-bug`

## Templates por Grupo

### Grupo A (Autenticación)
```markdown
## Funcionalidades de Autenticación
- [ ] JWT token generation/validation
- [ ] Role-based access control
- [ ] Session management
- [ ] Security middleware

## Testing de Seguridad
- [ ] Authentication flows tested
- [ ] Authorization scenarios covered
- [ ] Security vulnerabilities checked
```

### Grupo B (Pagos/QA)
```markdown
## Funcionalidades de Pagos/QA
- [ ] Payment processing logic
- [ ] Statistics calculations
- [ ] Quality checks implemented
- [ ] Reports generation

## Testing Financiero
- [ ] Payment flows tested
- [ ] Edge cases covered
- [ ] Data accuracy verified
```

### Grupo C (Personas/DevOps)
```markdown
## Funcionalidades Personas/DevOps
- [ ] Person management CRUD
- [ ] Scout/Leader workflows
- [ ] CI/CD pipeline updates
- [ ] Infrastructure changes

## Testing Infraestructura
- [ ] Deployment tested
- [ ] Performance verified
- [ ] Monitoring configured
```

### Grupo H (Preinscripciones/Archivos)
```markdown
## Funcionalidades Preinscripciones/Archivos
- [ ] Wizard steps implemented
- [ ] File upload/download
- [ ] Validation logic
- [ ] RUT verification

## Testing de Archivos
- [ ] File types validated
- [ ] Size limits enforced
- [ ] Security scanned
```

### Grupo Z (Perfiles)
```markdown
## Funcionalidades de Perfiles
- [ ] Profile CRUD operations
- [ ] Personal data management
- [ ] Settings/preferences
- [ ] Data privacy compliance

## Testing de Perfiles
- [ ] Data validation tested
- [ ] Privacy controls verified
- [ ] User experience validated
```

---
**Recordatorio**: Nunca hacer merge sin pasar esta checklist completa.