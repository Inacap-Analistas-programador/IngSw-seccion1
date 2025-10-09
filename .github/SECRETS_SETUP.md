# 🔐 Configuración de Secrets para GitHub Actions

## 📋 Resumen

Para que el pipeline de CI/CD funcione correctamente, debes configurar los siguientes secrets en el repositorio de GitHub. **NUNCA pongas credenciales reales en el código.**

## 🔧 Cómo configurar secrets en GitHub

1. Ve a tu repositorio en GitHub: `https://github.com/Inacap-Analistas-programador/IngSw-seccion1`
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, haz clic en **Secrets and variables** > **Actions**
4. Haz clic en **New repository secret**
5. Agrega cada secret de la lista siguiente

## 🔑 Secrets Requeridos

### 🏗️ Para Análisis de Código (SonarQube)

| Nombre | Descripción | Valor de Ejemplo |
|--------|-------------|------------------|
| `SONAR_TOKEN` | Token de SonarQube/SonarCloud | `sqp_1a2b3c4d5e6f7g8h9i0j` |

**Cómo obtener SONAR_TOKEN:**
1. Ve a [SonarCloud](https://sonarcloud.io) o tu SonarQube server
2. Create a new project para `IngSw-seccion1`
3. Ve a **My Account** > **Security** > **Generate Tokens**
4. Genera un token y cópialo

### 🚀 Para Deployment (Hosting)

| Nombre | Descripción | Valor de Ejemplo |
|--------|-------------|------------------|
| `HOSTING_USER` | Usuario del panel de hosting | `tu_usuario_hosting` |
| `HOSTING_PASSWORD` | Contraseña del panel de hosting | `tu_password_hosting_seguro` |
| `FTP_HOST` | Host FTP del servidor | `tu-dominio.com` |
| `FTP_USER` | Usuario FTP | `tu_usuario_ftp` |
| `FTP_PASSWORD` | Contraseña FTP | `tu_password_ftp_seguro` |

⚠️ **IMPORTANTE:** Las credenciales reales se proporcionan por separado y NUNCA se documentan públicamente.

### 🔐 Para Django en Producción

| Nombre | Descripción | Valor de Ejemplo |
|--------|-------------|------------------|
| `DJANGO_SECRET_KEY` | Clave secreta de Django | `django-insecure-...` |
| `DATABASE_URL` | URL de base de datos producción | `mysql://user:pass@host:3306/db` |

## 🔍 Verificar Configuración

Después de configurar los secrets, puedes verificar que estén correctos:

### 1. Verificar en el repositorio
- Los secrets aparecerán listados en **Settings** > **Secrets and variables** > **Actions**
- Solo verás los nombres, no los valores (por seguridad)

### 2. Verificar en el workflow
- Haz un push a `main` o abre un Pull Request
- Ve a **Actions** tab en GitHub
- Revisa que el workflow se ejecute sin errores de "secret not found"

## ⚠️ Mejores Prácticas de Seguridad

### ✅ HACER:
- Usar secrets diferentes para desarrollo, staging y producción
- Rotar (cambiar) las contraseñas regularmente
- Usar tokens de acceso en lugar de contraseñas cuando sea posible
- Limitar permisos de usuarios FTP solo a directorios necesarios

### ❌ NO HACER:
- Nunca poner credenciales en el código fuente
- No compartir secrets por email o chat
- No usar las mismas contraseñas para múltiples servicios
- No hacer commits con credenciales "temporales"

## 🆘 Troubleshooting

### Error: "Secret SONAR_TOKEN is not set"
- Verifica que hayas creado el secret con el nombre exacto `SONAR_TOKEN`
- Verifica que tengas permisos de administrador en el repo

### Error: "FTP connection failed"
- Verifica las credenciales FTP
- Verifica que el host permita conexiones desde GitHub Actions (whitelist IP)

### Error: "Database connection failed"
- Verifica la URL de la base de datos
- Asegúrate que la base de datos esté corriendo y accesible

## 📞 Contacto para Dudas

Si tienes problemas configurando los secrets:

1. **Para SonarQube:** Contacta al equipo de QA
2. **Para Hosting:** Contacta al administrador de sistemas
3. **Para Django:** Contacta al equipo de backend

## 🔄 Actualización de este Documento

Este documento se debe actualizar cada vez que:
- Se agreguen nuevos secrets
- Cambien las credenciales del hosting
- Se modifique el pipeline de CI/CD

**Última actualización:** 9 octubre 2025