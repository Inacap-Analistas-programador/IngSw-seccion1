# 🔗 Integración Frontend-Backend

## Endpoints Disponibles para el Frontend

### Base URL
```
http://localhost:8000/api/
```

### Producción
```
https://tudominio.com/api/
```

---

## 🔐 Autenticación

### 1. Login
```javascript
POST /api/auth/login/
Content-Type: application/json

// Request Body
{
  "email": "usuario@example.com",
  "password": "password123"
}

// Response (200 OK)
{
  "success": true,
  "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "rol": "dirigente",
    "foto": "/media/fotos/usuario1.jpg"
  }
}
```

### 2. Obtener Usuario Actual
```javascript
GET /api/auth/me/
Authorization: Bearer <accessToken>

// Response (200 OK)
{
  "id": 1,
  "username": "jperez",
  "email": "usuario@example.com",
  "perfil": "dirigente",
  "foto": "/media/fotos/usuario1.jpg"
}
```

### 3. Refresh Token
```javascript
POST /api/auth/token/refresh/
Content-Type: application/json

// Request Body
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

// Response (200 OK)
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."  // Nuevo refresh token
}
```

### 4. Logout
```javascript
POST /api/auth/logout/
Authorization: Bearer <accessToken>
Content-Type: application/json

// Request Body
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

// Response (200 OK)
{
  "success": true,
  "message": "Logout exitoso"
}
```

### 5. Obtener CSRF Token
```javascript
GET /api/auth/csrf-token/

// Response (200 OK)
{
  "csrfToken": "VvqVN1lwRYRMt7Ngj7e6cv6nvCdrFpSIPANZxy4gKQqQ..."
}
```

---

## 📚 Ejemplos de Código Frontend

### React/Next.js con Axios

```javascript
// api.js - Configuración del cliente Axios
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Para cookies CSRF
});

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access, refresh } = response.data;
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

```javascript
// auth.js - Servicios de autenticación
import apiClient from './api';

export const authService = {
  async login(email, password) {
    const response = await apiClient.post('/auth/login/', {
      email,
      password,
    });
    
    const { accessToken, refreshToken, user } = response.data;
    
    // Guardar tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  async logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    
    try {
      await apiClient.post('/auth/logout/', {
        refresh_token: refreshToken,
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Limpiar storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me/');
    return response.data;
  },

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
```

### React Hook Personalizado

```javascript
// useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay usuario en localStorage
    const storedUser = authService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al iniciar sesión' 
      };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Componente de Login

```javascript
// LoginForm.jsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password">Contraseña:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}
```

### Componente Protegido

```javascript
// ProtectedRoute.jsx
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
```

---

## 🔄 Manejo de Errores

### Códigos de Estado HTTP

- **200**: Éxito
- **201**: Creado exitosamente
- **400**: Error en la solicitud (datos inválidos)
- **401**: No autenticado (token inválido o expirado)
- **403**: No autorizado (sin permisos)
- **404**: Recurso no encontrado
- **429**: Demasiadas solicitudes (rate limit excedido)
- **500**: Error interno del servidor

### Ejemplo de Manejo de Errores

```javascript
try {
  const response = await apiClient.get('/cursos/');
  console.log(response.data);
} catch (error) {
  if (error.response) {
    // El servidor respondió con un código de error
    switch (error.response.status) {
      case 401:
        // Redirigir a login
        router.push('/login');
        break;
      case 403:
        // Mostrar mensaje de sin permisos
        alert('No tienes permisos para acceder a este recurso');
        break;
      case 429:
        // Rate limit excedido
        alert('Demasiadas solicitudes. Por favor, espera un momento.');
        break;
      default:
        // Error genérico
        console.error('Error:', error.response.data);
    }
  } else if (error.request) {
    // La solicitud se hizo pero no hubo respuesta
    console.error('Error de red:', error.request);
  } else {
    // Algo pasó al configurar la solicitud
    console.error('Error:', error.message);
  }
}
```

---

## 🌐 Variables de Entorno Frontend

Crea un archivo `.env.local` en tu proyecto frontend:

```bash
# Desarrollo
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_API_TIMEOUT=10000

# Producción
# NEXT_PUBLIC_API_URL=https://api.tudominio.com/api
```

---

## 📋 Configuración CORS

El backend ya está configurado para aceptar solicitudes desde:

- `http://localhost:3000`
- `http://localhost:5173`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

Si necesitas añadir más orígenes, contacta al equipo backend para actualizar `CORS_ALLOWED_ORIGINS` en `settings.py`.

---

## 🔐 Seguridad Frontend

### Buenas Prácticas

1. **Nunca expongas tokens en el código**
   - Usa localStorage o httpOnly cookies
   - No los incluyas en URLs

2. **Implementa timeout de sesión**
   - Cierra sesión automáticamente después de inactividad
   - Limpia tokens al cerrar sesión

3. **Valida datos del usuario**
   - Valida emails antes de enviar
   - Verifica longitud de contraseñas

4. **Maneja errores adecuadamente**
   - No muestres mensajes de error técnicos al usuario
   - Log errores para debugging

5. **Usa HTTPS en producción**
   - Nunca envíes tokens sobre HTTP
   - Configura tu frontend para usar HTTPS

---

## 📞 Soporte

Si tienes problemas con la integración:

1. Verifica que el backend esté corriendo en `http://localhost:8000`
2. Revisa la consola del navegador para errores CORS
3. Verifica que los tokens se estén guardando correctamente
4. Consulta la documentación de Swagger en `http://localhost:8000/api/docs/`

---

## 📚 Recursos Adicionales

- [Documentación Django REST Framework](https://www.django-rest-framework.org/)
- [JWT.io - Debugger de tokens JWT](https://jwt.io/)
- [Documentación Axios](https://axios-http.com/docs/intro)
- [React Context API](https://react.dev/reference/react/useContext)
