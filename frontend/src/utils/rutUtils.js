/**
 * Utilidades para manejo de RUT chileno
 */

/**
 * Formatea un RUT agregando puntos y guión
 * @param {string} rut - RUT sin formato
 * @returns {string} - RUT formateado (ej: 12.345.678-9)
 */
export function formatRut(rut) {
  if (!rut) return '';
  
  // Eliminar todo lo que no sea número o K
  const clean = rut.toString().replace(/[^0-9kK]/g, '').toUpperCase();
  
  if (clean.length < 2) return clean;
  
  // Separar dígito verificador
  const dv = clean.slice(-1);
  const numbers = clean.slice(0, -1);
  
  // Formatear con puntos
  const formatted = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formatted}-${dv}`;
}

/**
 * Limpia un RUT dejando solo números y K
 * @param {string} rut - RUT con o sin formato
 * @returns {string} - RUT limpio
 */
export function cleanRut(rut) {
  if (!rut) return '';
  return rut.toString().replace(/[^0-9kK]/g, '').toUpperCase();
}

/**
 * Valida un RUT chileno
 * @param {string} rut - RUT a validar
 * @returns {boolean} - true si es válido
 */
export function validateRut(rut) {
  if (!rut) return false;
  
  const clean = cleanRut(rut);
  if (clean.length < 8 || clean.length > 9) return false;
  
  const dv = clean.slice(-1);
  const numbers = clean.slice(0, -1);
  
  // Calcular dígito verificador
  let suma = 0;
  let multiplo = 2;
  
  for (let i = numbers.length - 1; i >= 0; i--) {
    suma += parseInt(numbers[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  
  const dvCalculado = 11 - (suma % 11);
  let dvEsperado;
  
  if (dvCalculado === 11) {
    dvEsperado = '0';
  } else if (dvCalculado === 10) {
    dvEsperado = 'K';
  } else {
    dvEsperado = dvCalculado.toString();
  }
  
  return dv === dvEsperado;
}

/**
 * Maneja el input de RUT en tiempo real
 * @param {string} value - Valor del input
 * @returns {string} - Valor formateado
 */
export function handleRutInput(value) {
  const clean = cleanRut(value);
  return formatRut(clean);
}

export default {
  formatRut,
  cleanRut,
  validateRut,
  handleRutInput,
};
