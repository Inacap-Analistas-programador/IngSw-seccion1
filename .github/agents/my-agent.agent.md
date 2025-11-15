
**SGICS** es una plataforma de nivel empresarial para la Asociación de Guías y Scouts de Chile, diseñada para modernizar y centralizar la gestión de cursos, inscripciones, participantes, pagos y comunicaciones.

---

##  1. Arquitectura Tecnológica

**Stack Frontend (Activo):**
- **Framework:** React 19 + Vite (ESM, HMR en puerto 3000)
- **Estilos:** TailwindCSS 4 con un tema corporativo Scout personalizado.
- **Enrutamiento:** React Router v7 para una Single-Page Application (SPA) fluida.
- **Animaciones:** Framer Motion para transiciones y efectos visuales.
- **Comunicaciones API:** Axios.
- **Iconografía:** Font Awesome 6 - react.

**Stack Backend :**
- **Framework:** Django 5 + Django Rest Framework (DRF) con autenticación JWT.
- **Base de Datos:** MySQL (producción).
- **Testing:** PyTest.
- **API:** Endpoints RESTful bajo el prefijo `/api/` con CORS habilitado.

---


---

##  2. Comandos y Configuraciones

### **PowerShell (Entorno de Desarrollo en Windows):**
```powershell
# --- Instalación y Ejecución ---
# Navega a la carpeta del frontend
cd IngSw-seccion1/frontend

# Instala las dependencias del proyecto
npm install

# Inicia el servidor de desarrollo en http://localhost:3000
npm run dev

# --- Calidad de Código ---
# Ejecuta el linter para encontrar errores de estilo
npm run lint

# Ejecuta las pruebas unitarias
npm run test

# Genera un reporte de cobertura de pruebas
npm run coverage

# --- Build de Producción ---
# Compila y optimiza la aplicación para producción
npm run build

# Previsualiza el build de producción localmente
npm run preview
```

### **Variables de Entorno (`.env`):**
```env
# URL base del backend Django
VITE_API_BASE_URL=http://localhost:8000/api

# Clave de API para Google Maps
VITE_GOOGLE_MAPS_API_KEY=TU_CLAVE_DE_API

# Clave de API para SendGrid
VITE_SENDGRID_API_KEY=TU_CLAVE_DE_API

# Identificador del tema visual (opcional)
VITE_SCOUT_THEME=corporativo
```

---

##  3. Documentación Técnica de Referencia

### **Breakpoints para Diseño Responsivo:**
```javascript
// Puntos de quiebre definidos en la configuración de Tailwind
const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px'
};
```

---

##  4. Estándares de Calidad

- **Rendimiento:** First Contentful Paint < 1.5s, tamaño del bundle < 250KB (gzipped).
- **Seguridad:** tokens jwt rotativos, protección XSS/CSRF, rate limiting en la API.
- **Accesibilidad:** Cumplimiento de WCAG 2.1 AA, navegación por teclado, compatibilidad con lectores de pantalla.

---
