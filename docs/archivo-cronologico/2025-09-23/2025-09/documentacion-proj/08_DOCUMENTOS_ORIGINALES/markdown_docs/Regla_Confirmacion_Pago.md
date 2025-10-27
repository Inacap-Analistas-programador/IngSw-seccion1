# Regla de Confirmación por Pago

## Descripción
Este documento detalla la regla configurable para la confirmación de pagos en el sistema de preinscripciones. La regla permite que el estado de una preinscripción se actualice a "Confirmado" cuando se registra un pago que cumple con ciertos criterios.

## Parámetro de Configuración
- **confirmar_con_primer_pago**: Este parámetro, que debe ser configurado por un administrador, determina si la confirmación del estado de la preinscripción se realiza al registrar el primer pago.

## Flujo de Trabajo
1. **Registro de Pago**: Cuando se registra un pago, el sistema verifica si el parámetro `confirmar_con_primer_pago` está habilitado.
2. **Actualización de Estado**: 
   - Si el parámetro está habilitado y el pago registrado es el primero para esa preinscripción, el estado de la preinscripción se actualiza a "Confirmado".
   - Se envía un correo electrónico de notificación al participante informando sobre la confirmación de su preinscripción.
3. **Registro en Logs**: Todas las acciones de confirmación se registran en el sistema de auditoría para futuras referencias.

## Criterios de Aceptación
- La regla debe ser configurable desde el panel de administración.
- Al registrar un pago que cumple con la regla, la preinscripción debe cambiar su estado a "Confirmado".
- Se debe enviar un correo de notificación al participante.
- Los cambios de estado y las notificaciones deben quedar registrados en los logs de auditoría.