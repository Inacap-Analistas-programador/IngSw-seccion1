/**
 * RUT validation utilities for Chilean RUT (Rol Único Tributario)
 * Version Frontend - Implementacion TypeScript para SGICS
 */

/**
 * Clean RUT string by removing dots, hyphens and converting to uppercase
 */
export function cleanRut(rut: string): string {
  if (!rut) return "";

  // Remove dots, hyphens, and spaces, convert to uppercase
  return rut.replace(/[.\-\s]/g, "").toUpperCase();
}

/**
 * Validate Chilean RUT using the verification digit algorithm
 */
export function validateRut(rut: string): boolean {
  try {
    const cleanedRut = cleanRut(rut);

    // RUT must have at least 2 characters (number + verification digit)
    if (cleanedRut.length < 2) return false;

    // Extract number and verification digit
    const rutNumber = cleanedRut.slice(0, -1);
    const verificationDigit = cleanedRut.slice(-1);

    // RUT number must be numeric
    if (!/^\d+$/.test(rutNumber)) return false;

    // Calculate verification digit
    const calculatedDigit = calculateVerificationDigit(parseInt(rutNumber));

    return verificationDigit === calculatedDigit;
  } catch {
    return false;
  }
}

/**
 * Calculate the verification digit for a given RUT number
 */
export function calculateVerificationDigit(rutNumber: number): string {
  const factors = [2, 3, 4, 5, 6, 7];
  let sumValue = 0;

  // Convert to string to process digit by digit from right to left
  const rutStr = rutNumber.toString();

  for (let i = 0; i < rutStr.length; i++) {
    const digit = parseInt(rutStr[rutStr.length - 1 - i]);
    const factor = factors[i % factors.length];
    sumValue += digit * factor;
  }

  const remainder = sumValue % 11;
  const verification = 11 - remainder;

  if (verification === 11) return "0";
  if (verification === 10) return "K";
  return verification.toString();
}

/**
 * Format RUT string with standard Chilean format (12.345.678-9)
 */
export function formatRut(rut: string): string | null {
  if (!validateRut(rut)) return null;

  const cleaned = cleanRut(rut);
  const rutNumber = cleaned.slice(0, -1);
  const verificationDigit = cleaned.slice(-1);

  // Add dots every 3 digits from right to left
  let formattedNumber = "";
  for (let i = 0; i < rutNumber.length; i++) {
    if (i > 0 && i % 3 === 0) {
      formattedNumber = "." + formattedNumber;
    }
    formattedNumber = rutNumber[rutNumber.length - 1 - i] + formattedNumber;
  }

  return `${formattedNumber}-${verificationDigit}`;
}

/**
 * RUT input formatter for real-time formatting
 */
export function formatRutInput(value: string): string {
  const cleaned = cleanRut(value);
  if (cleaned.length === 0) return "";

  // Don't format if it's invalid or incomplete
  if (cleaned.length === 1) return cleaned;

  const rutPart = cleaned.slice(0, -1);
  const dvPart = cleaned.slice(-1);

  // Format the number part with dots
  let formatted = "";
  for (let i = rutPart.length - 1; i >= 0; i--) {
    const position = rutPart.length - 1 - i;
    if (position > 0 && position % 3 === 0) {
      formatted = "." + formatted;
    }
    formatted = rutPart[i] + formatted;
  }

  return formatted + (dvPart ? `-${dvPart}` : "");
}
