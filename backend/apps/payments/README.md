# Módulo de Gestión de Pagos (`payments`)

Este módulo es el núcleo para la gestión financiera de la plataforma SGICS. Proporciona la estructura de datos, la lógica de negocio y los endpoints de API necesarios para registrar transacciones, emitir comprobantes, gestionar saldos a favor y auditar todas las operaciones monetarias.

## Arquitectura y Modelos de Datos

La arquitectura del módulo está diseñada para ser robusta, auditable y escalable. A continuación se presenta el diagrama de entidad-relación (ERD) que visualiza la estructura de la base de datos.

### Diagrama de Entidad-Relación (ERD)

Este diagrama muestra los modelos de datos del módulo y cómo se interconectan. Las relaciones (uno a muchos, muchos a muchos) son clave para entender el flujo de la información financiera. El archivo del diagrama se encuentra en la carpeta `diagrams-payments/` de este módulo.

### Modelos Principales

-   **`PagoPersona`**: Es el modelo central. Registra cada transacción monetaria individual (ingreso o egreso) asociada a una persona (`PER_ID`) y un curso (`CUR_ID`).

-   **`ComprobantePago`**: Representa un documento formal (recibo o factura) que agrupa uno o más pagos. Tiene un número único (`CPA_NUMERO`) y un valor total (`CPA_VALOR`) que se calcula a partir de los pagos asociados.

-   **`ConceptoContable`**: Es un catálogo para clasificar las transacciones (ej. 'Inscripción', 'Cuota de Campamento', 'Donación'). Permite una reportería financiera más clara y organizada.

-   **`Prepago`**: Modela los saldos a favor que una persona puede tener en un curso. Se genera cuando un pago excede el monto adeudado y puede ser utilizado en el futuro.

-   **`PagoComprobante`**: Tabla intermedia que establece la relación muchos a muchos entre `PagoPersona` y `ComprobantePago`. Es la que permite que un comprobante agrupe varios pagos.

-   **`PagoCambioPersona`**: Un modelo clave para la auditoría. Registra el historial si un pago es transferido de una persona a otra, manteniendo la trazabilidad de los fondos.

---

## Flujos de Negocio

### Flujo de Creación de un Comprobante

El siguiente diagrama de flujo ilustra el proceso para crear un `ComprobantePago`. Este es uno de los flujos de negocio más importantes del módulo. El archivo del diagrama se encuentra en la carpeta `diagrams-payments/`.

**Descripción del Flujo:**

1.  **Selección de Pagos**: Un usuario con rol de Tesorero selecciona uno o más pagos (`PagoPersona`) desde la interfaz de usuario que aún no han sido asignados a un comprobante.
2.  **Envío a la API**: La interfaz envía una petición `POST` al endpoint `/api/payments/comprobantes-pago/` con los IDs de los pagos seleccionados (`pagos_ids`).
3.  **Validación y Transacción**:
    -   El `ComprobantePagoSerializer` recibe los datos.
    -   Valida que la lista de `pagos_ids` no esté vacía y que todos los IDs sean válidos y únicos.
    -   Inicia una transacción atómica en la base de datos para garantizar la integridad. Si algo falla, todos los cambios se revierten.
4.  **Cálculo y Creación**:
    -   El serializer calcula el valor total (`CPA_VALOR`) sumando los montos de todos los pagos seleccionados.
    -   Crea la nueva instancia de `ComprobantePago` con el valor total y los datos proporcionados (concepto, número, etc.).
5.  **Asociación de Pagos**: Se crean los registros correspondientes en la tabla intermedia `PagoComprobante` para vincular cada pago con el nuevo comprobante.
6.  **Respuesta Exitosa**: La API devuelve una respuesta `201 Created` con los datos del comprobante recién creado.

---

## API Endpoints

El módulo expone una API RESTful completa para interactuar con los modelos. Todos los endpoints están bajo el prefijo `/api/payments/`.

| Recurso                | URL                               | Operaciones Soportadas (CRUD) |
| ---------------------- | --------------------------------- | ----------------------------- |
| Pagos de Personas      | `/pagos-persona/`                 | `GET`, `POST`, `PUT`, `DELETE`  |
| Comprobantes de Pago   | `/comprobantes-pago/`             | `GET`, `POST`, `PUT`, `DELETE`  |
| Prepagos (Saldos)      | `/prepagos/`                      | `GET`, `POST`, `PUT`, `DELETE`  |
| Conceptos Contables    | `/conceptos-contables/`           | `GET`, `POST`, `PUT`, `DELETE`  |
| Historial de Cambios   | `/pagos-cambio-persona/`          | `GET`, `POST`, `PUT`, `DELETE`  |
| Relación Pago-Comprob. | `/pagos-comprobante/`             | `GET`, `POST`, `PUT`, `DELETE`  |

### Seguridad y Permisos

El acceso a estos endpoints está protegido por el permiso `IsTreasurerOrAdminOrReadOnly`:

-   **Usuarios Autenticados (cualquier rol)**: Pueden realizar operaciones de solo lectura (`GET`, `HEAD`, `OPTIONS`). Esto les permite consultar pagos, comprobantes, etc.
-   **Usuarios con rol `TESORERO` o Administradores (`is_staff`)**: Tienen permisos completos de escritura (`POST`, `PUT`, `PATCH`, `DELETE`). Solo ellos pueden crear, modificar o eliminar registros financieros.

### Filtros de API

Para facilitar la búsqueda de datos, se han implementado filtros personalizados:

#### `PagoPersonaFilter`

Permite filtrar pagos en el endpoint `/api/payments/pagos-persona/` por:

-   `fecha_inicio`: Pagos registrados desde una fecha específica (`YYYY-MM-DD`).
-   `fecha_fin`: Pagos registrados hasta una fecha específica (`YYYY-MM-DD`).
-   `PER_ID`: ID de la persona.
-   `CUR_ID`: ID del curso.
-   `PAP_TIPO`: Tipo de pago (1 para Ingreso, 2 para Egreso).

**Ejemplo de uso:**
`GET /api/payments/pagos-persona/?fecha_inicio=2024-10-01&fecha_fin=2024-10-31&PAP_TIPO=1`

#### `ComprobantePagoFilter`

Permite filtrar comprobantes en el endpoint `/api/payments/comprobantes-pago/` por:

-   `PEC_ID`: ID de la Persona-Curso.
-   `COC_ID`: ID del Concepto Contable.
-   `CPA_NUMERO`: Número exacto del comprobante.

---

## Cómo Utilizar el Módulo (Ejemplos de API)

Aquí se muestran ejemplos de las operaciones más comunes a través de la API.

1.  **Registrar un Pago**: Realizar una petición `POST` a `/api/payments/pagos-persona/` con los datos del pago. Requiere rol de `TESORERO`.

    ```json
    ```json
    {
      "PER_ID": 1,
      "CUR_ID": 1,
      "PAP_TIPO": 1,
      "PAP_VALOR": 50000.00,
      "PAP_OBSERVACION": "Abono cuota de inscripción"
    }
    ```

2.  **Crear un Comprobante**: Realizar una petición `POST` a `/api/payments/comprobantes-pago/` con los IDs de los pagos a incluir. El sistema calculará automáticamente el valor total. Requiere rol de `TESORERO`.

    ```json
    ```json
    {
      "PEC_ID": 1,
      "COC_ID": 1,
      "CPA_NUMERO": 1001,
      "pagos_ids": [101, 102]
    }
    ```

3.  **Consultar Pagos con Filtros**: Realizar una petición `GET` al endpoint de pagos, utilizando los parámetros de filtro disponibles.

    **Ejemplo**: Obtener todos los pagos de tipo "Ingreso" para la persona con `PER_ID=15`.
    `GET /api/payments/pagos-persona/?PER_ID=15&PAP_TIPO=1`

4.  **Transferir un Pago (Auditoría)**: Si un pago se asignó por error, se puede crear un registro de auditoría para documentar su transferencia a otra persona. Requiere rol de `TESORERO`.

    `POST /api/payments/pagos-cambio-persona/`
    ```json
    {
      "PAP_ID": 101,
      "PER_ID": 5
    }
    ```
    *Nota: Esta acción solo crea un registro en `PagoCambioPersona` para auditoría. No modifica el `PagoPersona` original.*

5.  **Consultar Saldos a Favor (Prepagos)**: Para ver los saldos a favor de una persona en un curso.

    **Ejemplo**: Obtener los prepagos vigentes de la persona `PER_ID=30`.
    `GET /api/payments/prepagos/?PER_ID=30&PPA_VIGENTE=true`

6.  **Actualizar un Pago**: Para corregir un error en un pago ya registrado, se puede usar una petición `PATCH`. Requiere rol de `TESORERO`.

    **Ejemplo**: Corregir el valor de un pago.
    `PATCH /api/payments/pagos-persona/101/`
    ```json
    {
      "PAP_VALOR": 55000.00,
      "PAP_OBSERVACION": "Corrección de valor. Abono cuota de inscripción."
    }
    ```

7.  **Utilizar un Saldo a Favor (Prepago)**: Cuando un saldo a favor se utiliza para cubrir otro costo, se debe marcar como no vigente. Requiere rol de `TESORERO`.

    **Ejemplo**: Marcar el prepago con `PPA_ID=5` como utilizado.
    `PATCH /api/payments/prepagos/5/`
    ```json
    {
      "PPA_VIGENTE": false,
      "PPA_OBSERVACION": "Saldo utilizado para cubrir cuota de campamento."
    }
    ```

8.  **Consultar los Pagos de un Comprobante**: Para obtener todos los pagos individuales que componen un comprobante específico.

    **Ejemplo**: Listar todos los pagos asociados al comprobante `CPA_ID=25`.
    `GET /api/payments/pagos-comprobante/?CPA_ID=25`