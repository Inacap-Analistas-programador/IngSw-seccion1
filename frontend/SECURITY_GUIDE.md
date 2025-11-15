# Guía Rápida de Seguridad para Desarrolladores

Esta guía proporciona ejemplos prácticos de cómo usar las nuevas características de seguridad implementadas en el frontend de GIC.

---

## 🔐 Autenticación

### Login de Usuario

```jsx
import authService from '@/services/authService';

// En tu componente de login
const handleLogin = async (email, password) => {
  try {
    const user = await authService.login(email, password);
    console.log('Usuario autenticado:', user);
    navigate('/dashboard');
  } catch (error) {
    console.error('Error de login:', error.message);
    // Mostrar error al usuario
  }
};
```

### Verificar Autenticación

```jsx
import authService from '@/services/authService';

// Verificar si el usuario está autenticado
if (authService.isAuthenticated()) {
  console.log('Usuario autenticado');
}

// Obtener datos del usuario actual
const user = authService.getCurrentUser();
console.log('Usuario:', user.name, user.email, user.rol);

// Obtener token para API calls
const token = authService.getAccessToken();
```

### Logout

```jsx
import authService from '@/services/authService';

const handleLogout = () => {
  authService.logout('USER_ACTION');
  navigate('/login');
};
```

---

## 🛡️ Protección de Rutas

### Ruta Protegida Simple

```jsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Ruta con Control de Rol

```jsx
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="coordinador">
      <AdminPanel />
    </ProtectedRoute>
  } 
/>
```

---

## 🧹 Sanitización de Inputs

### Sanitizar Texto General

```jsx
import { sanitizeText } from '@/utils/inputSanitizer';

const handleInput = (e) => {
  const sanitized = sanitizeText(e.target.value);
  setFormData({ ...formData, description: sanitized });
};
```

### Validar Email

```jsx
import { sanitizeEmail } from '@/utils/inputSanitizer';

const handleEmailInput = (e) => {
  try {
    const sanitized = sanitizeEmail(e.target.value);
    setEmail(sanitized);
    setError('');
  } catch (error) {
    setError(error.message);
  }
};
```

### Validar RUT

```jsx
import { sanitizeRUT } from '@/utils/inputSanitizer';

const handleRutInput = (e) => {
  try {
    const sanitized = sanitizeRUT(e.target.value);
    setRut(sanitized);
  } catch (error) {
    console.error('RUT inválido:', error.message);
  }
};
```

### Sanitizar Formulario Completo

```jsx
import { sanitizeFormData } from '@/utils/inputSanitizer';

const schema = {
  fullName: { type: 'name', required: true },
  email: { type: 'email', required: true },
  phone: { type: 'phone', required: true },
  rut: { type: 'rut', required: true },
  address: { type: 'address', required: false },
  birthDate: { type: 'date', required: true },
  description: { type: 'text', required: false },
};

const handleSubmit = (e) => {
  e.preventDefault();
  
  try {
    const sanitized = sanitizeFormData(formData, schema);
    console.log('Datos sanitizados:', sanitized);
    // Enviar al backend
  } catch (error) {
    console.error('Error de validación:', error.message);
  }
};
```

### Validar Contraseña

```jsx
import { validatePassword } from '@/utils/inputSanitizer';

const handlePasswordChange = (e) => {
  const password = e.target.value;
  const validation = validatePassword(password);
  
  if (validation.valid) {
    console.log('Contraseña válida');
  } else {
    console.log('Errores:', validation.errors);
    // Mostrar errores al usuario
  }
};
```

---

## 🌐 Llamadas HTTP Seguras

### GET Request

```jsx
import httpClient from '@/services/httpClient';

const fetchData = async () => {
  try {
    const data = await httpClient.get('/api/usuarios');
    console.log('Datos:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### POST Request

```jsx
import httpClient from '@/services/httpClient';

const createUser = async (userData) => {
  try {
    const response = await httpClient.post('/api/usuarios', userData);
    console.log('Usuario creado:', response);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### PUT Request

```jsx
const updateUser = async (userId, userData) => {
  try {
    const response = await httpClient.put(`/api/usuarios/${userId}`, userData);
    console.log('Usuario actualizado:', response);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### DELETE Request

```jsx
const deleteUser = async (userId) => {
  try {
    await httpClient.delete(`/api/usuarios/${userId}`);
    console.log('Usuario eliminado');
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### Upload de Archivos

```jsx
import httpClient from '@/services/httpClient';

const uploadFile = async (file) => {
  try {
    const response = await httpClient.uploadFile(
      '/api/upload', 
      file,
      { userId: 123, type: 'medical' }
    );
    console.log('Archivo subido:', response);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

---

## 📋 Ejemplos de Componentes Seguros

### Formulario de Login Seguro

```jsx
import { useState } from 'react';
import authService from '@/services/authService';
import { sanitizeEmail } from '@/utils/inputSanitizer';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sanitizar email
      const sanitizedEmail = sanitizeEmail(email);
      
      // Login
      await authService.login(sanitizedEmail, password);
      
      // Redirigir
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        disabled={loading}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
};
```

### Formulario de Registro con Validación

```jsx
import { useState } from 'react';
import { sanitizeName, sanitizeEmail, sanitizeRUT, validateMinorAge } from '@/utils/inputSanitizer';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    rut: '',
    birthDate: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    let sanitized;
    
    try {
      switch (field) {
        case 'fullName':
          sanitized = sanitizeName(value);
          break;
        case 'email':
          sanitized = sanitizeEmail(value);
          break;
        case 'rut':
          sanitized = sanitizeRUT(value);
          break;
        default:
          sanitized = value;
      }
      
      setFormData({ ...formData, [field]: sanitized });
      setErrors({ ...errors, [field]: null });
    } catch (error) {
      setErrors({ ...errors, [field]: error.message });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar si es menor de edad
    const { isMinor } = validateMinorAge(formData.birthDate);
    
    if (isMinor) {
      alert('Se requiere consentimiento parental para menores de 18 años');
      return;
    }
    
    // Enviar datos
    console.log('Datos válidos:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.fullName}
        onChange={(e) => handleChange('fullName', e.target.value)}
        placeholder="Nombre completo"
      />
      {errors.fullName && <span className="error">{errors.fullName}</span>}
      
      <input
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Email"
      />
      {errors.email && <span className="error">{errors.email}</span>}
      
      <input
        type="text"
        value={formData.rut}
        onChange={(e) => handleChange('rut', e.target.value)}
        placeholder="RUT"
      />
      {errors.rut && <span className="error">{errors.rut}</span>}
      
      <input
        type="date"
        value={formData.birthDate}
        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
      />
      
      <button type="submit">Registrar</button>
    </form>
  );
};
```

---

## ⚠️ Mejores Prácticas

### ✅ DO (Hacer)

```jsx
// ✅ Usar sessionStorage para datos sensibles
sessionStorage.setItem('token', token);

// ✅ Sanitizar todas las entradas del usuario
const sanitized = sanitizeText(userInput);

// ✅ Validar en el cliente Y en el servidor
const isValid = validateEmail(email);

// ✅ Usar HTTPS en producción
const API_URL = import.meta.env.MODE === 'production' 
  ? 'https://api.gic.scouts.cl' 
  : 'http://localhost:8000';

// ✅ Manejar errores sin exponer detalles internos
catch (error) {
  console.error('Error interno:', error);
  setError('Ocurrió un error. Por favor, intenta nuevamente.');
}

// ✅ Limpiar datos al cerrar sesión
authService.logout();
```

### ❌ DON'T (No Hacer)

```jsx
// ❌ NO usar localStorage para tokens
localStorage.setItem('token', token); // INSEGURO

// ❌ NO confiar en datos del usuario sin validar
setName(userInput); // Puede contener scripts maliciosos

// ❌ NO hardcodear credenciales
const password = 'miPassword123'; // NUNCA HACER ESTO

// ❌ NO exponer errores detallados al usuario
catch (error) {
  alert(error.stack); // Expone información sensible
}

// ❌ NO almacenar contraseñas en el cliente
localStorage.setItem('password', password); // NUNCA

// ❌ NO deshabilitar validación para "facilitar desarrollo"
// if (isDevelopment) return true; // Mala práctica
```

---

## 🔍 Debugging de Seguridad

### Ver Logs de Auditoría

```jsx
import authService from '@/services/authService';

// Ver logs de auditoría en la consola
const logs = authService.getAuditLogs();
console.table(logs);
```

### Verificar Token

```jsx
import authService from '@/services/authService';

const token = authService.getAccessToken();
if (token) {
  const payload = authService.parseJWT(token);
  console.log('Token payload:', payload);
  console.log('Expira en:', new Date(payload.exp * 1000));
}
```

---

## 📞 Soporte

Para preguntas sobre seguridad:
- Revisar `SECURITY.md` para documentación completa
- Contactar al equipo de seguridad: security@scouts.cl
- Reportar vulnerabilidades de forma responsable

---

**Última actualización**: 2024-11-15
