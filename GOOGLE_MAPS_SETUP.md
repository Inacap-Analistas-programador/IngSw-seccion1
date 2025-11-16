# 🗺️ Guía de Configuración de Google Maps

Esta guía te ayudará a configurar Google Maps API en la plataforma GIC.

## 📋 Requisitos Previos

- Cuenta de Google Cloud Platform
- Tarjeta de crédito (requerida por Google, pero incluye $200 USD gratis mensuales)
- Acceso al código fuente del proyecto

## 🚀 Pasos de Configuración

### 1. Crear Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Haz clic en "Crear Proyecto" en el menú superior
3. Ingresa un nombre para tu proyecto (ej: "GIC-Platform")
4. Haz clic en "Crear"

### 2. Habilitar APIs Necesarias

1. En el menú lateral, ve a **APIs y Servicios** → **Biblioteca**
2. Busca y habilita las siguientes APIs:
   - **Places API** (requerida)
   - **Maps JavaScript API** (requerida)
   - **Geocoding API** (opcional, para funciones avanzadas)

Para cada API:
- Haz clic en el nombre de la API
- Haz clic en el botón "Habilitar"
- Espera a que se active (puede tomar unos segundos)

### 3. Crear API Key

1. Ve a **APIs y Servicios** → **Credenciales**
2. Haz clic en **+ Crear Credenciales** → **Clave de API**
3. Se generará tu API Key automáticamente
4. **IMPORTANTE**: Copia y guarda la API Key en un lugar seguro

### 4. Restringir API Key (Recomendado para Producción)

#### Para Desarrollo Local:
- No aplicar restricciones (para facilitar el desarrollo)

#### Para Producción:
1. Haz clic en tu API Key para editarla
2. En **Restricciones de aplicación**, selecciona **Referentes HTTP**
3. Agrega tus dominios permitidos:
   ```
   https://tu-dominio.cl/*
   https://www.tu-dominio.cl/*
   http://localhost:3000/*  (solo si necesitas desarrollo local)
   ```
4. En **Restricciones de API**, selecciona **Restringir clave**
5. Marca:
   - Places API
   - Maps JavaScript API
   - Geocoding API (si la habilitaste)
6. Haz clic en **Guardar**

### 5. Configurar Variable de Entorno

#### Frontend (Vite)

1. Abre el archivo `frontend/.env`:
   ```bash
   cd frontend
   nano .env
   ```

2. Agrega tu API Key:
   ```env
   # Google Maps API Key
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyD...tu_api_key_aqui
   ```

3. Guarda el archivo (Ctrl+O, Enter, Ctrl+X en nano)

4. **IMPORTANTE**: Verifica que `.env` está en `.gitignore`:
   ```bash
   cat .gitignore | grep .env
   ```
   Debe aparecer `.env` en la lista.

#### Backend (Django)

1. Abre el archivo `backend/.env`:
   ```bash
   cd backend
   nano .env
   ```

2. Agrega tu API Key:
   ```env
   # Google Maps API Key
   GOOGLE_MAPS_API_KEY=AIzaSyD...tu_api_key_aqui
   ```

3. Guarda el archivo

### 6. Reiniciar Servidores

```bash
# En una terminal - Backend
cd backend
python manage.py runserver

# En otra terminal - Frontend
cd frontend
npm run dev
```

### 7. Verificar Instalación

1. Abre tu navegador en `http://localhost:3000/demo/google-maps`
2. Deberías ver:
   - ✅ "Google Maps API Key configurada correctamente"
   - Un campo de búsqueda funcional para direcciones

3. Prueba escribir una dirección chilena (ej: "Av. Providencia 1234, Santiago")
4. Deberías ver sugerencias de autocompletado

## 📊 Monitoreo de Uso y Costos

### Verificar Uso de API

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Navega a **APIs y Servicios** → **Panel de control**
3. Selecciona "Places API" para ver estadísticas
4. Revisa:
   - Solicitudes por día
   - Errores
   - Latencia

### Costos Estimados

Google Maps incluye **$200 USD de crédito gratuito mensual**.

#### Pricing de Places API (Autocomplete):
- **Por sesión**: $0.017 USD
- Con $200 gratis = ~11,700 sesiones/mes GRATIS
- Una sesión = desde que el usuario empieza a escribir hasta que selecciona una dirección

#### Ejemplo de uso:
- 100 usuarios/día seleccionando direcciones = 3,000 sesiones/mes
- Costo: 3,000 × $0.017 = $51 USD/mes
- **Cubierto completamente por el crédito gratuito**

### Configurar Alertas de Presupuesto

1. Ve a **Facturación** → **Presupuestos y alertas**
2. Haz clic en **Crear presupuesto**
3. Configura:
   - Nombre: "Alerta Maps API"
   - Monto: $50 USD/mes
   - Umbrales: 50%, 90%, 100%
4. Agrega tu email para recibir alertas

## 🔧 Solución de Problemas

### ❌ Error: "API Key no configurada"

**Causa**: Variable de entorno no definida o mal escrita.

**Solución**:
1. Verifica que el archivo `.env` existe en `frontend/`
2. Verifica que la línea es exactamente:
   ```
   VITE_GOOGLE_MAPS_API_KEY=tu_api_key
   ```
   (Sin espacios antes o después del `=`)
3. Reinicia el servidor: `npm run dev`

### ❌ Error: "This API project is not authorized to use this API"

**Causa**: Places API no está habilitada.

**Solución**:
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Habilita "Places API" y "Maps JavaScript API"
3. Espera 1-2 minutos para que se propague
4. Recarga la página

### ❌ Error: "REQUEST_DENIED"

**Causa**: Restricciones de API Key demasiado estrictas.

**Solución**:
1. Ve a **APIs y Servicios** → **Credenciales**
2. Edita tu API Key
3. En desarrollo, elimina todas las restricciones temporalmente
4. En producción, verifica que tu dominio esté en la lista de referentes permitidos

### ❌ No aparecen sugerencias al escribir

**Causa**: Puede ser problema de red o configuración.

**Solución**:
1. Abre las DevTools del navegador (F12)
2. Ve a la pestaña "Console"
3. Busca errores en rojo
4. Verifica que tu API Key esté activa en Google Cloud
5. Verifica que tengas crédito disponible en Google Cloud

### ❌ Error: "RefererNotAllowedMapError"

**Causa**: Tu dominio no está autorizado en las restricciones de la API Key.

**Solución**:
1. Edita la API Key en Google Cloud Console
2. Agrega tu dominio a la lista de referentes HTTP permitidos
3. Guarda los cambios
4. Espera 1-2 minutos y recarga la página

## 📱 Uso en Producción

### Variables de Entorno en Servidor

Cuando despliegues en producción (ej: Vercel, Netlify, cPanel):

1. **Vercel**:
   - Ve a tu proyecto → Settings → Environment Variables
   - Agrega: `VITE_GOOGLE_MAPS_API_KEY` = tu_api_key

2. **Netlify**:
   - Ve a Site settings → Build & deploy → Environment
   - Agrega: `VITE_GOOGLE_MAPS_API_KEY` = tu_api_key

3. **cPanel/VPS**:
   - Crea archivo `.env.production` en el servidor
   - Agrega la variable
   - Asegúrate de que el archivo NO sea accesible vía web

### Restricciones de Seguridad

```plaintext
Referentes HTTP permitidos:
https://gic.scouts.cl/*
https://www.gic.scouts.cl/*
```

```plaintext
APIs restringidas:
☑ Places API
☑ Maps JavaScript API
☑ Geocoding API
```

## 🎯 Ejemplos de Uso

### Ejemplo Básico en Código

```jsx
import LocationSelector, { useLocationInfo } from '@/components/LocationSelector';

function MiFormulario() {
  const [lugar, setLugar] = useState(null);
  const info = useLocationInfo(lugar);
  
  return (
    <div>
      <LocationSelector
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onSelect={setLugar}
        placeholder="Buscar dirección..."
      />
      
      {info && (
        <div>
          <p>Comuna: {info.comuna}</p>
          <p>Región: {info.region}</p>
        </div>
      )}
    </div>
  );
}
```

### Guardar en Base de Datos

```javascript
// En tu servicio o componente
const guardarEvento = async (formData, lugar) => {
  const info = useLocationInfo(lugar);
  
  const evento = {
    nombre: formData.nombre,
    direccion: info.fullAddress,
    comuna: info.comuna,
    region: info.region,
    google_place_id: info.placeId,
  };
  
  await axios.post('/api/eventos/', evento);
};
```

## 📚 Recursos Adicionales

- [Documentación Places API](https://developers.google.com/maps/documentation/places/web-service)
- [Pricing de Google Maps](https://mapsplatform.google.com/pricing/)
- [Google Cloud Console](https://console.cloud.google.com)
- [Demo en vivo](http://localhost:3000/demo/google-maps)

## ✅ Checklist de Verificación

Antes de considerar la configuración completa, verifica:

- [ ] Proyecto creado en Google Cloud
- [ ] Places API habilitada
- [ ] Maps JavaScript API habilitada
- [ ] API Key creada y copiada
- [ ] Variable `VITE_GOOGLE_MAPS_API_KEY` configurada en `.env`
- [ ] Servidores reiniciados
- [ ] Demo page muestra "API Key configurada"
- [ ] Autocompletado funciona al escribir direcciones
- [ ] Información se extrae correctamente (comuna, región)
- [ ] Restricciones de API Key configuradas (para producción)
- [ ] Alertas de presupuesto configuradas

## 🆘 Soporte

Si tienes problemas:
1. Revisa esta guía paso a paso
2. Verifica los logs en consola del navegador (F12)
3. Revisa los logs del backend
4. Consulta la documentación oficial de Google Maps
5. Contacta al equipo de desarrollo

---

**Última actualización**: 2024-11-16
**Versión**: 1.0.0
