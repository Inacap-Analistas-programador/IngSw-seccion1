FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar código fuente
COPY . .

# Build de producción optimizado
ENV NODE_ENV=production
RUN npm run build

# Servidor de producción
FROM nginx:alpine

# Instalar curl para health checks
RUN apk add --no-cache curl

# Crear usuario no-root para nginx
RUN addgroup -g 101 -S nginx && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx || true

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos build
COPY --from=builder /app/dist /usr/share/nginx/html

# Establecer permisos correctos
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Crear directorios necesarios con permisos
RUN mkdir -p /var/log/nginx && \
    chown -R nginx:nginx /var/log/nginx

# Cambiar a usuario no-root
USER nginx

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
