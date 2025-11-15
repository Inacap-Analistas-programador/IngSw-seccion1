/* eslint-disable no-undef */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import httpClient from '../services/httpClient';
import authService from '../services/authService';

// Mock authService
vi.mock('../services/authService', () => ({
  default: {
    getAccessToken: vi.fn(),
    logout: vi.fn(),
  },
}));

// Mock fetch
global.fetch = vi.fn();

describe('httpClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getHeaders', () => {
    it('should include Content-Type header', () => {
      authService.getAccessToken.mockReturnValue(null);
      const headers = httpClient.getHeaders();
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('should include Authorization header when token exists', () => {
      authService.getAccessToken.mockReturnValue('test-token');
      const headers = httpClient.getHeaders();
      expect(headers['Authorization']).toBe('Bearer test-token');
    });

    it('should not include Authorization header when no token', () => {
      authService.getAccessToken.mockReturnValue(null);
      const headers = httpClient.getHeaders();
      expect(headers['Authorization']).toBeUndefined();
    });

    it('should merge additional headers', () => {
      authService.getAccessToken.mockReturnValue(null);
      const headers = httpClient.getHeaders({ 'Custom-Header': 'value' });
      expect(headers['Custom-Header']).toBe('value');
    });

    it('should include CSRF token when available', () => {
      authService.getAccessToken.mockReturnValue(null);
      httpClient.csrfToken = 'csrf-token';
      const headers = httpClient.getHeaders();
      expect(headers['X-CSRF-Token']).toBe('csrf-token');
    });
  });

  describe('GET requests', () => {
    it('should make GET request successfully', async () => {
      const mockData = { data: 'test' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await httpClient.get('/api/test');
      
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test'),
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
        })
      );
    });

    it('should handle GET request errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not found' }),
      });

      await expect(httpClient.get('/api/test')).rejects.toThrow('Not found');
    });

    it('should include auth token in GET request', async () => {
      authService.getAccessToken.mockReturnValue('auth-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await httpClient.get('/api/test');
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer auth-token',
          }),
        })
      );
    });
  });

  describe('POST requests', () => {
    it('should make POST request successfully', async () => {
      const mockData = { success: true };
      const postData = { name: 'test' };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await httpClient.post('/api/test', postData);
      
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData),
          credentials: 'include',
        })
      );
    });

    it('should handle POST request errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Bad request' }),
      });

      await expect(httpClient.post('/api/test', {})).rejects.toThrow('Bad request');
    });
  });

  describe('PUT requests', () => {
    it('should make PUT request successfully', async () => {
      const mockData = { updated: true };
      const putData = { name: 'updated' };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await httpClient.put('/api/test/1', putData);
      
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(putData),
        })
      );
    });
  });

  describe('PATCH requests', () => {
    it('should make PATCH request successfully', async () => {
      const mockData = { patched: true };
      const patchData = { field: 'value' };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await httpClient.patch('/api/test/1', patchData);
      
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test/1'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(patchData),
        })
      );
    });
  });

  describe('DELETE requests', () => {
    it('should make DELETE request successfully', async () => {
      const mockData = { deleted: true };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await httpClient.delete('/api/test/1');
      
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('error handling', () => {
    it('should logout on 401 error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      });

      await expect(httpClient.get('/api/test')).rejects.toThrow('Sesión expirada');
      expect(authService.logout).toHaveBeenCalledWith('TOKEN_EXPIRED');
    });

    it('should handle 403 CSRF error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ message: 'Forbidden' }),
      });

      await expect(httpClient.get('/api/test')).rejects.toThrow('Error de validación');
    });

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(httpClient.get('/api/test')).rejects.toThrow('Network error');
    });

    it('should handle JSON parse errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(httpClient.get('/api/test')).rejects.toThrow();
    });
  });

  describe('uploadFile', () => {
    it('should upload file successfully', async () => {
      const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      const mockResponse = { uploaded: true };
      
      authService.getAccessToken.mockReturnValue('auth-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await httpClient.uploadFile('/api/upload', mockFile);
      
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/upload'),
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        })
      );
    });

    it('should include additional data in file upload', async () => {
      const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      const additionalData = { category: 'documents' };
      
      authService.getAccessToken.mockReturnValue('auth-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await httpClient.uploadFile('/api/upload', mockFile, additionalData);
      
      expect(global.fetch).toHaveBeenCalled();
      const callArgs = global.fetch.mock.calls[0][1];
      expect(callArgs.body).toBeInstanceOf(FormData);
    });

    it('should include auth headers in file upload', async () => {
      const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      
      authService.getAccessToken.mockReturnValue('test-token');
      httpClient.csrfToken = 'csrf-token';
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await httpClient.uploadFile('/api/upload', mockFile);
      
      const callArgs = global.fetch.mock.calls[0][1];
      expect(callArgs.headers['Authorization']).toBe('Bearer test-token');
      expect(callArgs.headers['X-CSRF-Token']).toBe('csrf-token');
    });
  });
});
