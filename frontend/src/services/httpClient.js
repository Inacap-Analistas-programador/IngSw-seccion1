// Cliente HTTP seguro con protección CSRF y manejo de JWT
// Implementa interceptores de seguridad para todas las llamadas API

import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Cliente HTTP seguro
 */
class SecureHttpClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.csrfToken = null;
    this.initCSRFProtection();
  }

  /**
   * Inicializa protección CSRF obteniendo el token del servidor
   */
  async initCSRFProtection() {
    try {
      // Obtener token CSRF del backend
      // const response = await fetch(`${this.baseURL}/api/csrf-token`, {
      //   credentials: 'include',
      // });
      // const data = await response.json();
      // this.csrfToken = data.csrfToken;

      // Por ahora, generar token temporal (reemplazar con backend real)
      this.csrfToken = this.generateCSRFToken();
    } catch (error) {
      console.error('Error initializing CSRF protection:', error);
    }
  }

  /**
   * Genera un token CSRF temporal (para desarrollo)
   */
  generateCSRFToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Obtiene headers comunes para todas las requests
   */
  getHeaders(additionalHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...additionalHeaders,
    };

    // Agregar token JWT si existe
    const token = authService.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Agregar token CSRF para requests modificadoras
    if (this.csrfToken) {
      headers['X-CSRF-Token'] = this.csrfToken;
    }

    return headers;
  }

  /**
   * Maneja errores de la API
   */
  async handleResponse(response) {
    if (!response.ok) {
      // Si el token expiró, hacer logout
      if (response.status === 401) {
        authService.logout('TOKEN_EXPIRED');
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }

      // Si hay error de CSRF, reintentar
      if (response.status === 403) {
        await this.initCSRFProtection();
        throw new Error('Error de validación. Por favor, intenta nuevamente.');
      }

      const error = await response.json().catch(() => ({
        message: 'Error en la solicitud',
      }));

      throw new Error(error.message || `Error ${response.status}`);
    }

    return response.json();
  }

  /**
   * Realiza una petición GET
   */
  async get(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(options.headers),
        credentials: 'include',
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  }

  /**
   * Realiza una petición POST
   */
  async post(endpoint, data, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(options.headers),
        body: JSON.stringify(data),
        credentials: 'include',
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  }

  /**
   * Realiza una petición PUT
   */
  async put(endpoint, data, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(options.headers),
        body: JSON.stringify(data),
        credentials: 'include',
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  }

  /**
   * Realiza una petición PATCH
   */
  async patch(endpoint, data, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(options.headers),
        body: JSON.stringify(data),
        credentials: 'include',
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('PATCH request failed:', error);
      throw error;
    }
  }

  /**
   * Realiza una petición DELETE
   */
  async delete(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(options.headers),
        credentials: 'include',
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  }

  /**
   * Sube archivos de forma segura
   */
  async uploadFile(endpoint, file, additionalData = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Agregar datos adicionales
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const headers = {};
      const token = authService.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      if (this.csrfToken) {
        headers['X-CSRF-Token'] = this.csrfToken;
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: formData,
        credentials: 'include',
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }
}

// Instancia única del cliente HTTP
const httpClient = new SecureHttpClient();

export default httpClient;
