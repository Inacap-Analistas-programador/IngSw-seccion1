# Prototipo de Wizard de Preinscripción

## Descripción General
Este documento presenta los mockups del wizard de preinscripción, que guiará a los usuarios a través de los pasos necesarios para completar su registro. El objetivo es proporcionar una experiencia de usuario fluida y clara.

## Pasos del Wizard

### 1. Datos Personales
- **Campos requeridos**: Nombre, Apellido, RUT, Fecha de Nacimiento, Correo Electrónico, Teléfono.
- **Validaciones**: 
  - RUT debe ser válido.
  - Correo electrónico debe tener formato correcto.
  - Teléfono debe ser numérico y de longitud adecuada.

### 2. Salud
- **Preguntas**: 
  - ¿Tiene alguna condición médica relevante? (Sí/No)
  - Si la respuesta es "Sí", se debe mostrar un campo adicional para detallar la condición.
- **Validaciones**: 
  - Campo de condición médica debe ser opcional si la respuesta es "No".

### 3. Adjuntar Ficha
- **Instrucciones**: 
  - El usuario debe subir un archivo (ficha médica).
  - **Tipos de archivo permitidos**: PDF, JPG, PNG.
  - **Tamaño máximo**: 5MB.
- **Validaciones**: 
  - Verificar tipo y tamaño del archivo antes de permitir la carga.

### 4. Revisión
- **Resumen**: Mostrar un resumen de los datos ingresados para que el usuario los revise.
- **Acciones**: 
  - Botón "Editar" para volver a los pasos anteriores.
  - Botón "Confirmar" para finalizar la preinscripción.

## Flujos de Navegación
- El usuario debe poder navegar entre los pasos del wizard sin perder la información ingresada.
- Al confirmar, se debe mostrar un mensaje de éxito y redirigir al usuario a la página de inicio o a una página de agradecimiento.

## Mensajes de Error
- Mensajes claros y específicos deben mostrarse en caso de que se produzcan errores en la validación de los datos.

## Prototipo Visual
- Se adjuntará un enlace al prototipo visual en alta fidelidad, que incluirá todos los elementos de diseño y la disposición de los componentes.

## Aprobación
Este prototipo debe ser revisado y aprobado por el equipo de diseño y los coordinadores del proyecto antes de proceder con el desarrollo.