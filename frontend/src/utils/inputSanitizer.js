// Utilidad de sanitización de entradas para protección XSS
// Implementa validación y limpieza de datos según estándares GIC

/**
 * Patrones peligrosos que deben ser bloqueados
 */
const XSS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe[^>]*>.*?<\/iframe>/gi,
  /document\.cookie/gi,
  /eval\s*\(/gi,
  /<embed[^>]*>/gi,
  /<object[^>]*>/gi,
  /vbscript:/gi,
  /data:text\/html/gi,
];

/**
 * Sanitiza una cadena de texto eliminando caracteres peligrosos
 * @param {string} input - Texto a sanitizar
 * @returns {string} - Texto sanitizado
 */
export function sanitizeText(input) {
  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = input;

  // Eliminar patrones XSS peligrosos
  XSS_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '');
  });

  // Eliminar etiquetas HTML
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  // Escapar caracteres especiales
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return sanitized.trim();
}

/**
 * Valida y sanitiza un email
 * @param {string} email
 * @returns {string}
 */
export function sanitizeEmail(email) {
  if (typeof email !== 'string') {
    return '';
  }

  const sanitized = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(sanitized)) {
    throw new Error('Formato de email inválido');
  }

  return sanitized;
}

/**
 * Valida y sanitiza un RUT chileno
 * @param {string} rut
 * @returns {string}
 */
export function sanitizeRUT(rut) {
  if (typeof rut !== 'string') {
    return '';
  }

  // Eliminar puntos y guiones
  let sanitized = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();

  // Solo números y K
  sanitized = sanitized.replace(/[^0-9K]/g, '');

  // Validar formato básico
  if (sanitized.length < 8 || sanitized.length > 9) {
    throw new Error('Formato de RUT inválido');
  }

  return sanitized;
}

/**
 * Valida y sanitiza un número de teléfono
 * @param {string} phone
 * @returns {string}
 */
export function sanitizePhone(phone) {
  if (typeof phone !== 'string') {
    return '';
  }

  // Solo números, espacios, guiones, paréntesis y +
  const sanitized = phone.replace(/[^\d\s\-+()]/g, '').trim();

  // Validar que tenga al menos 8 dígitos
  const digitsOnly = sanitized.replace(/\D/g, '');
  if (digitsOnly.length < 8 || digitsOnly.length > 15) {
    throw new Error('Formato de teléfono inválido');
  }

  return sanitized;
}

/**
 * Valida y sanitiza un nombre
 * @param {string} name
 * @returns {string}
 */
export function sanitizeName(name) {
  if (typeof name !== 'string') {
    return '';
  }

  // Solo letras, espacios, guiones y apóstrofes
  const sanitized = name
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']/g, '')
    .trim()
    .replace(/\s+/g, ' '); // Normalizar espacios múltiples

  if (sanitized.length < 2) {
    throw new Error('El nombre debe tener al menos 2 caracteres');
  }

  if (sanitized.length > 100) {
    throw new Error('El nombre es demasiado largo');
  }

  return sanitized;
}

/**
 * Valida y sanitiza una dirección
 * @param {string} address
 * @returns {string}
 */
export function sanitizeAddress(address) {
  if (typeof address !== 'string') {
    return '';
  }

  // Permitir letras, números, espacios y caracteres comunes en direcciones
  const sanitized = address
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-.,#°]/g, '')
    .trim()
    .replace(/\s+/g, ' ');

  if (sanitized.length > 200) {
    throw new Error('La dirección es demasiado larga');
  }

  return sanitized;
}

/**
 * Valida y sanitiza una fecha
 * @param {string} date - Fecha en formato YYYY-MM-DD
 * @returns {string}
 */
export function sanitizeDate(date) {
  if (typeof date !== 'string') {
    return '';
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(date)) {
    throw new Error('Formato de fecha inválido. Use YYYY-MM-DD');
  }

  // Validar que sea una fecha real
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    throw new Error('Fecha inválida');
  }

  return date;
}

/**
 * Valida que una fecha esté en un rango válido
 * @param {string} date - Fecha en formato YYYY-MM-DD
 * @param {Date} minDate - Fecha mínima permitida
 * @param {Date} maxDate - Fecha máxima permitida
 * @returns {boolean}
 */
export function validateDateRange(date, minDate, maxDate) {
  const dateObj = new Date(date);

  if (minDate && dateObj < minDate) {
    throw new Error('La fecha es anterior al mínimo permitido');
  }

  if (maxDate && dateObj > maxDate) {
    throw new Error('La fecha es posterior al máximo permitido');
  }

  return true;
}

/**
 * Sanitiza datos de un formulario completo
 * @param {object} formData
 * @param {object} schema - Esquema de validación
 * @returns {object}
 */
export function sanitizeFormData(formData, schema) {
  const sanitized = {};

  for (const [key, value] of Object.entries(formData)) {
    if (!schema[key]) {
      continue; // Ignorar campos no definidos en el esquema
    }

    const fieldType = schema[key].type;
    const required = schema[key].required || false;

    // Verificar campos requeridos
    if (required && (!value || value.toString().trim() === '')) {
      throw new Error(`El campo ${key} es requerido`);
    }

    // Aplicar sanitización según el tipo
    try {
      switch (fieldType) {
        case 'email':
          sanitized[key] = value ? sanitizeEmail(value) : '';
          break;
        case 'rut':
          sanitized[key] = value ? sanitizeRUT(value) : '';
          break;
        case 'phone':
          sanitized[key] = value ? sanitizePhone(value) : '';
          break;
        case 'name':
          sanitized[key] = value ? sanitizeName(value) : '';
          break;
        case 'address':
          sanitized[key] = value ? sanitizeAddress(value) : '';
          break;
        case 'date':
          sanitized[key] = value ? sanitizeDate(value) : '';
          break;
        case 'text':
        default:
          sanitized[key] = value ? sanitizeText(value) : '';
          break;
      }
    } catch (error) {
      throw new Error(`Error en ${key}: ${error.message}`);
    }
  }

  return sanitized;
}

/**
 * Verifica si una cadena contiene patrones XSS
 * @param {string} input
 * @returns {boolean}
 */
export function containsXSS(input) {
  if (typeof input !== 'string') {
    return false;
  }

  return XSS_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Valida contraseña segura
 * @param {string} password
 * @returns {object} - {valid: boolean, errors: string[]}
 */
export function validatePassword(password) {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }

  if (password && password.length > 128) {
    errors.push('La contraseña es demasiado larga');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una letra mayúscula');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una letra minúscula');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Debe contener al menos un número');
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Debe contener al menos un carácter especial');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Valida edad de menor (protección especial)
 * @param {string} birthDate - Fecha de nacimiento YYYY-MM-DD
 * @returns {object} - {isMinor: boolean, age: number}
 */
export function validateMinorAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return {
    isMinor: age < 18,
    age,
  };
}

export default {
  sanitizeText,
  sanitizeEmail,
  sanitizeRUT,
  sanitizePhone,
  sanitizeName,
  sanitizeAddress,
  sanitizeDate,
  validateDateRange,
  sanitizeFormData,
  containsXSS,
  validatePassword,
  validateMinorAge,
};
