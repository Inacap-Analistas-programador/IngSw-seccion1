# Guía de Despliegue Frontend - Scout Formación

## 📋 Pre-requisitos

- Node.js 18+ instalado
- npm o yarn
- Backend API ejecutándose (opcional para desarrollo)

## 🚀 Instalación Local

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd IngSw-seccion1/frontend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Editar `.env` y configurar:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 4. Ejecutar en modo desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Build para Producción

### 1. Generar build optimizado
```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`

### 2. Preview del build
```bash
npm run preview
```

## 🐳 Despliegue con Docker

### Dockerfile ya incluido

```bash
# Build de la imagen
docker build -t scout-frontend .

# Ejecutar contenedor
docker run -p 3000:80 scout-frontend
```

## ☁️ Despliegue en Plataformas Cloud

### Vercel (Recomendado)

1. Conectar repositorio en Vercel
2. Configurar variables de entorno:
   - `VITE_API_BASE_URL`: URL de tu backend
3. Deploy automático en cada push

### Netlify

1. Conectar repositorio
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Configurar variables de entorno

### AWS S3 + CloudFront

1. Build local: `npm run build`
2. Subir `dist/` a S3 bucket
3. Configurar CloudFront distribution
4. Habilitar HTTPS

## 🔧 Configuración de Nginx (VPS/Servidor)

```nginx
server {
    listen 80;
    server_name scout-formacion.example.com;
    
    root /var/www/scout-frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache estático
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

## 🔐 SSL/HTTPS

### Con Certbot (Let's Encrypt)
```bash
sudo certbot --nginx -d scout-formacion.example.com
```

## 📊 Variables de Entorno por Ambiente

### Desarrollo
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Staging
```env
VITE_API_BASE_URL=https://api-staging.scout-formacion.cl
```

### Producción
```env
VITE_API_BASE_URL=https://api.scout-formacion.cl
```

## 🧪 Testing Pre-Deploy

```bash
# Verificar build
npm run build

# Verificar linting
npm run lint

# Verificar contraste
npm run lint:contrast

# Preview local
npm run preview
```

## 📈 Monitoreo

### Métricas importantes:
- Tiempo de carga inicial
- Bundle size
- Core Web Vitals
- Errores JavaScript

### Herramientas recomendadas:
- Google Analytics
- Sentry (errores)
- Lighthouse CI

## 🔄 CI/CD con GitHub Actions

Ejemplo de workflow:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
          
      - name: Build
        run: |
          cd frontend
          npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_URL }}
          
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 🐛 Troubleshooting

### Error: Cannot connect to API
- Verificar que `VITE_API_BASE_URL` esté correctamente configurado
- Verificar que el backend esté ejecutándose
- Revisar CORS en el backend

### Build falla
- Limpiar cache: `rm -rf node_modules package-lock.json && npm install`
- Verificar versión de Node: `node --version`

### Página en blanco después del deploy
- Verificar que la ruta base esté correcta
- Revisar la consola del navegador para errores
- Verificar que index.html se esté sirviendo correctamente

## 📞 Soporte

Para problemas de despliegue, contactar al equipo DevOps.

---

Última actualización: Noviembre 2024
