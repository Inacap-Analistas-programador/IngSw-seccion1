import { describe, it, expect } from 'vitest';
import {
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
} from '../utils/inputSanitizer';

describe('inputSanitizer', () => {
  describe('sanitizeText', () => {
    it('removes script/html tags and dangerous protocols', () => {
      const input = ' <script>alert(1)</script><b>hola</b> javascript:run() ';
      expect(sanitizeText(input)).toBe('hola run()');
    });

    it('escapes special characters', () => {
      const input = '& " \' /';
      expect(sanitizeText(input)).toBe('&amp; &quot; &#x27; &#x2F;');
    });

    it('returns empty string for non-string values', () => {
      expect(sanitizeText(null)).toBe('');
      expect(sanitizeText(undefined)).toBe('');
      expect(sanitizeText(123)).toBe('');
    });
  });

  describe('sanitizeEmail', () => {
    it('normalizes and validates a valid email', () => {
      expect(sanitizeEmail(' TEST@Example.COM ')).toBe('test@example.com');
    });

    it('throws for invalid email format', () => {
      expect(() => sanitizeEmail('invalid-email')).toThrow('Formato de email inválido');
    });
  });

  describe('sanitizeRUT', () => {
    it('removes separators and uppercases verifier', () => {
      expect(sanitizeRUT('12.345.678-k')).toBe('12345678K');
    });

    it('throws for invalid length', () => {
      expect(() => sanitizeRUT('123')).toThrow('Formato de RUT inválido');
    });
  });

  describe('sanitizePhone', () => {
    it('keeps allowed characters and validates digit count', () => {
      expect(sanitizePhone('+56 (9) 1234-5678')).toBe('+56 (9) 1234-5678');
    });

    it('throws for too short phone numbers', () => {
      expect(() => sanitizePhone('123')).toThrow('Formato de teléfono inválido');
    });
  });

  describe('sanitizeName', () => {
    it('removes invalid chars and normalizes spaces', () => {
      expect(sanitizeName('  J@an   Pérez!!  ')).toBe('Jan Pérez');
    });

    it('throws for short names', () => {
      expect(() => sanitizeName('A')).toThrow('al menos 2 caracteres');
    });
  });

  describe('sanitizeAddress', () => {
    it('removes unsupported characters', () => {
      expect(sanitizeAddress('Av. Libertador #123 @@@')).toBe('Av. Libertador #123');
    });

    it('throws for too long addresses', () => {
      const longAddress = `A${'b'.repeat(210)}`;
      expect(() => sanitizeAddress(longAddress)).toThrow('demasiado larga');
    });
  });

  describe('sanitizeDate and validateDateRange', () => {
    it('accepts valid dates and range', () => {
      expect(sanitizeDate('2025-01-15')).toBe('2025-01-15');
      expect(validateDateRange('2025-01-15', new Date('2025-01-01'), new Date('2025-12-31'))).toBe(true);
    });

    it('throws for invalid date format', () => {
      expect(() => sanitizeDate('15/01/2025')).toThrow('Formato de fecha inválido');
    });

    it('throws for out-of-range dates', () => {
      expect(() => validateDateRange('2024-12-31', new Date('2025-01-01'))).toThrow('anterior al mínimo');
      expect(() => validateDateRange('2026-01-01', undefined, new Date('2025-12-31'))).toThrow(
        'posterior al máximo'
      );
    });
  });

  describe('sanitizeFormData', () => {
    it('sanitizes known schema fields and ignores unknown fields', () => {
      const schema = {
        email: { type: 'email', required: true },
        name: { type: 'name', required: true },
        comments: { type: 'text' },
      };

      const result = sanitizeFormData(
        {
          email: ' USER@MAIL.COM ',
          name: '  J@uan  ',
          comments: '<b>Hola</b>',
          ignored: 'should-not-exist',
        },
        schema
      );

      expect(result).toEqual({
        email: 'user@mail.com',
        name: 'Juan',
        comments: 'Hola',
      });
      expect(result.ignored).toBeUndefined();
    });

    it('throws for missing required fields and wraps field errors', () => {
      const requiredSchema = { email: { type: 'email', required: true } };
      expect(() => sanitizeFormData({ email: '   ' }, requiredSchema)).toThrow('El campo email es requerido');

      const phoneSchema = { phone: { type: 'phone' } };
      expect(() => sanitizeFormData({ phone: '12' }, phoneSchema)).toThrow('Error en phone: Formato de teléfono inválido');
    });
  });

  describe('containsXSS', () => {
    it('detects xss patterns and handles non-string values', () => {
      expect(containsXSS('<script>alert(1)</script>')).toBe(true);
      expect(containsXSS('texto normal')).toBe(false);
      expect(containsXSS(null)).toBe(false);
    });

    it('remains deterministic across repeated calls with same payload', () => {
      const payload = '<script>alert(1)</script>';
      expect(containsXSS(payload)).toBe(true);
      expect(containsXSS(payload)).toBe(true);
    });
  });

  describe('validatePassword', () => {
    it('validates a strong password', () => {
      expect(validatePassword('StrongP@ss1')).toEqual({ valid: true, errors: [] });
    });

    it('returns multiple errors for weak passwords', () => {
      const result = validatePassword('weak');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('validateMinorAge', () => {
    it('classifies minor and adult ages correctly', () => {
      const today = new Date();
      const tenYearsAgo = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());

      const minor = validateMinorAge(tenYearsAgo.toISOString().slice(0, 10));
      const adult = validateMinorAge(twentyYearsAgo.toISOString().slice(0, 10));

      expect(minor.isMinor).toBe(true);
      expect(adult.isMinor).toBe(false);
      expect(minor.age).toBeGreaterThanOrEqual(9);
      expect(adult.age).toBeGreaterThanOrEqual(19);
    });
  });
});
