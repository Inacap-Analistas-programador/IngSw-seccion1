# Plan de Aseguramiento de Calidad (QA) - Módulo de Pagos

Este documento detalla la estrategia de pruebas exhaustivas para el Módulo de Pagos del sistema GIC. El objetivo es garantizar no solo la funcionalidad básica, sino también la robustez, seguridad y experiencia de usuario (UX) en escenarios complejos.

## 1. Matriz de Pruebas Funcionales (Casos de Uso Críticos)

### 1.1 Gestión de Pagos (CRUD)
| ID | Caso de Prueba | Pasos | Resultado Esperado | Prioridad |
|----|----------------|-------|--------------------|-----------|
| **GP-01** | Registro de Ingreso Simple | 1. Abrir modal "Nuevo Pago".<br>2. Seleccionar Alumno.<br>3. Ingresar Monto positivo.<br>4. Guardar. | El pago aparece en la tabla con estado "Pagado". El saldo del alumno se actualiza. | Alta |
| **GP-02** | Validación de Montos Negativos | 1. Intentar registrar pago con monto -5000.<br>2. Intentar con monto 0. | El sistema bloquea el botón "Guardar" o muestra error de validación en rojo. | Alta |
| **GP-03** | Anulación de Pago | 1. Seleccionar un pago existente.<br>2. Clic en "Anular".<br>3. Confirmar acción. | El estado cambia a "Anulado". No se elimina físicamente (Soft Delete). | Media |
| **GP-04** | Edición Restringida | 1. Intentar editar un pago de hace 3 meses. | El sistema debe advertir o requerir permisos especiales (si aplica). | Baja |

### 1.2 Pagos Masivos y Grupales
| ID | Caso de Prueba | Pasos | Resultado Esperado | Prioridad |
|----|----------------|-------|--------------------|-----------|
| **PM-01** | Pago Curso Completo | 1. Seleccionar Curso "Alta Montaña".<br>2. Seleccionar "Todos los alumnos".<br>3. Ingresar monto cuota ($50.000).<br>4. Procesar. | Se generan N registros de pago individuales. El sistema no se congela. | Alta |
| **PM-02** | Pago Multi-Beneficiario | 1. Un apoderado paga por 3 alumnos distintos.<br>2. Asignar montos diferentes a cada uno. | Se registra 1 pagador y 3 pagos asociados a los alumnos respectivos. | Alta |
| **PM-03** | Interrupción de Red | 1. Iniciar pago masivo.<br>2. Desconectar internet durante el proceso. | El sistema muestra error de conexión. No se generan registros duplicados ni parciales (Atomicidad). | Crítica |

### 1.3 Proveedores y Egresos
| ID | Caso de Prueba | Pasos | Resultado Esperado | Prioridad |
|----|----------------|-------|--------------------|-----------|
| **PR-01** | Registro de Proveedor | 1. Crear proveedor con RUT inválido. | Validación de formato de RUT impide el guardado. | Media |
| **PR-02** | Pago a Proveedor | 1. Registrar egreso asociado a un proveedor.<br>2. Adjuntar factura (PDF). | El egreso se descuenta del balance global. El PDF es accesible. | Alta |

## 2. Pruebas de Interfaz y Experiencia de Usuario (UI/UX)

*   **Responsividad:**
    *   [ ] Verificar tabla de pagos en vista móvil (iPhone SE / Pixel 5). ¿Se rompe el layout?
    *   [ ] Verificar modales en pantallas pequeñas. ¿El botón "Guardar" es visible sin scroll?
*   **Feedback Visual:**
    *   [ ] **Loading States:** Al filtrar pagos, ¿aparece un spinner o skeleton loader?
    *   [ ] **Empty States:** Si no hay pagos en una fecha, ¿dice "No se encontraron registros" o muestra una tabla vacía fea?
    *   [ ] **Toasts:** ¿Los mensajes de éxito son verdes y los de error rojos? ¿Duran el tiempo suficiente para leerse?

## 3. Pruebas de Seguridad y Borde (Edge Cases)

*   **Inyección SQL / XSS:**
    *   [ ] Intentar ingresar `<script>alert('hack')</script>` en el campo "Observación". El sistema debe sanitizar la entrada.
*   **Concurrencia:**
    *   [ ] Dos usuarios intentan anular el mismo pago al mismo tiempo. El sistema debe manejar el bloqueo o error de versión.
*   **Límites de Datos:**
    *   [ ] Intentar subir un comprobante de 50MB. El sistema debe rechazarlo (Límite recomendado: 5MB).
    *   [ ] Registrar un pago con monto `999.999.999.999`. Verificar desbordamiento de UI o BD.

## 4. Pruebas de Rendimiento (Performance)

*   **Carga de Datos:**
    *   [ ] Tiempo de carga del Dashboard con 10.000 pagos históricos. (Meta: < 2 segundos).
    *   [ ] Exportación a Excel de 5.000 registros. (Meta: < 5 segundos).

## 5. Automatización (Beyond Expectations)

Para superar las expectativas, se recomienda ejecutar el script de prueba de carga automatizado ubicado en `backend/pagos/tests/test_performance.py`.

### Ejecución de Pruebas Automatizadas
```bash
cd backend
python manage.py test pagos.tests.test_performance
```

---
*Este documento es parte de la entrega final del proyecto de Ingeniería de Software.*
