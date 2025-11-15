/* eslint-disable no-undef */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import authService from '../services/authService';

// Mock global objects
const mockSessionStorage = {
  data: {},
  getItem: vi.fn((key) => mockSessionStorage.data[key] || null),
  setItem: vi.fn((key, value) => {
    mockSessionStorage.data[key] = value;
  }),
  removeItem: vi.fn((key) => {
    delete mockSessionStorage.data[key];
  }),
  clear: vi.fn(() => {
    mockSessionStorage.data = {};
  }),
};

global.sessionStorage = mockSessionStorage;
global.atob = (str) => Buffer.from(str, 'base64').toString('binary');
global.btoa = (str) => Buffer.from(str, 'binary').toString('base64');

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionStorage.data = {};
  });

  describe('parseJWT', () => {
    it('should parse valid JWT token', () => {
      const payload = { user_id: 1, email: 'test@test.com' };
      const token = authService.generateMockToken(payload);
      const parsed = authService.parseJWT(token);
      
      expect(parsed.user_id).toBe(1);
      expect(parsed.email).toBe('test@test.com');
    });

    it('should throw error for invalid token format', () => {
      expect(() => authService.parseJWT('invalid.token')).toThrow('Invalid token format');
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token exists', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return true when valid token exists', () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const token = authService.generateMockToken({
        user_id: 1,
        exp: futureTime,
      });
      mockSessionStorage.data['gic_auth_token'] = token;

      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false when token is expired', () => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600;
      const token = authService.generateMockToken({
        user_id: 1,
        exp: pastTime,
      });
      mockSessionStorage.data['gic_auth_token'] = token;

      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('login', () => {
    it('should store tokens on successful login', async () => {
      const result = await authService.login('coordinador@scout.cl', 'Scout2024!');

      expect(result).toBeDefined();
      expect(result.email).toBe('coordinador@scout.cl');
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'gic_auth_token',
        expect.any(String)
      );
    }, 10000);

    it('should throw error for invalid email format', async () => {
      await expect(authService.login('invalid-email', 'password123')).rejects.toThrow(
        'Formato de email inválido'
      );
    });

    it('should throw error for short password', async () => {
      await expect(authService.login('test@test.com', 'short')).rejects.toThrow(
        'La contraseña debe tener al menos 8 caracteres'
      );
    });

    it('should increment login attempts on failure', async () => {
      const email = 'wrong@test.com';
      try {
        await authService.login(email, 'wrongpassword123');
      } catch (error) {
        // Expected to fail
      }

      const attempts = authService.getLoginAttempts(email);
      expect(attempts).toBeGreaterThan(0);
    }, 10000);

    it('should clear login attempts on success', async () => {
      const email = 'coordinador@scout.cl';
      // First, create some failed attempts
      mockSessionStorage.data[`login_attempts_${email}`] = '2';

      await authService.login(email, 'Scout2024!');

      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(
        `login_attempts_${email}`
      );
    }, 10000);

    it('should lockout after max login attempts', async () => {
      const email = 'test@test.com';
      mockSessionStorage.data[`login_attempts_${email}`] = '5';

      try {
        await authService.login(email, 'wrongpassword123');
      } catch (error) {
        expect(error.message).toContain('bloqueada');
      }
    }, 10000);
  });

  describe('logout', () => {
    it('should clear tokens on logout', () => {
      mockSessionStorage.data['gic_auth_token'] = 'token';
      mockSessionStorage.data['gic_refresh_token'] = 'refresh';
      mockSessionStorage.data['gic_user_data'] = '{"id":1}';

      authService.logout();

      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('gic_auth_token');
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('gic_refresh_token');
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('gic_user_data');
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user data exists', () => {
      expect(authService.getCurrentUser()).toBeNull();
    });

    it('should return parsed user data', () => {
      const userData = { id: 1, email: 'test@test.com' };
      mockSessionStorage.data['gic_user_data'] = JSON.stringify(userData);

      const user = authService.getCurrentUser();
      expect(user).toEqual(userData);
    });

    it('should return null for invalid JSON', () => {
      mockSessionStorage.data['gic_user_data'] = 'invalid json';
      expect(authService.getCurrentUser()).toBeNull();
    });
  });

  describe('getAccessToken', () => {
    it('should return null when no token exists', () => {
      expect(authService.getAccessToken()).toBeNull();
    });

    it('should return token when it exists', () => {
      mockSessionStorage.data['gic_auth_token'] = 'test-token';
      expect(authService.getAccessToken()).toBe('test-token');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(authService.isValidEmail('test@test.com')).toBe(true);
    });

    it('should invalidate incorrect email', () => {
      expect(authService.isValidEmail('invalid-email')).toBe(false);
      expect(authService.isValidEmail('test@')).toBe(false);
      expect(authService.isValidEmail('@test.com')).toBe(false);
    });
  });

  describe('login attempts management', () => {
    const email = 'test@test.com';

    it('should get login attempts', () => {
      mockSessionStorage.data[`login_attempts_${email}`] = '3';
      expect(authService.getLoginAttempts(email)).toBe(3);
    });

    it('should return 0 for no attempts', () => {
      expect(authService.getLoginAttempts(email)).toBe(0);
    });

    it('should increment login attempts', () => {
      authService.incrementLoginAttempts(email);
      expect(authService.getLoginAttempts(email)).toBe(1);
      
      authService.incrementLoginAttempts(email);
      expect(authService.getLoginAttempts(email)).toBe(2);
    });

    it('should clear login attempts', () => {
      mockSessionStorage.data[`login_attempts_${email}`] = '3';
      authService.clearLoginAttempts(email);
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(`login_attempts_${email}`);
    });
  });

  describe('audit logging', () => {
    it('should log audit events', () => {
      authService.auditLog('TEST_ACTION', { test: 'data' });
      
      const logs = authService.getAuditLogs();
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[logs.length - 1].action).toBe('TEST_ACTION');
    });

    it('should limit audit logs to 50 entries', () => {
      // Add 60 logs
      for (let i = 0; i < 60; i++) {
        authService.auditLog(`ACTION_${i}`, {});
      }

      const logs = authService.getAuditLogs();
      expect(logs.length).toBeLessThanOrEqual(50);
    });
  });
});
