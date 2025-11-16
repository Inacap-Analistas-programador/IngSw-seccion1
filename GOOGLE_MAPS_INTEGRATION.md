# 🗺️ Integración de Google Maps - GIC Sistema Scout

## Descripción

El sistema GIC incluye integración con Google Maps API a través del paquete `react-google-places-autocomplete` para selección de ubicaciones y direcciones.

## Características

- ✅ Búsqueda de direcciones con autocompletado
- ✅ Restricción a Chile
- ✅ Idioma español
- ✅ Extracción de información estructurada (dirección, comuna, región)
- ✅ Componente reutilizable
- ✅ Hook para procesamiento de datos

---

## Configuración

### 1. Obtener API Key

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita "Places API" y "Maps JavaScript API"
4. Ve a "Credenciales" y crea una API Key
5. Restringe la API Key (opcional pero recomendado):
   - **Restricciones de aplicación**: HTTP referrers
   - **Restricciones de API**: Places API, Maps JavaScript API

### 2. Configurar Variable de Entorno

Edita el archivo `frontend/.env`:

```bash
# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=AIzaSyD...your_key_here
```

O en producción (`.env.production`):

```bash
VITE_GOOGLE_MAPS_API_KEY=AIzaSyD...your_production_key_here
```

⚠️ **Importante**: Nunca commitees tu API key en git. El archivo `.env` está en `.gitignore`.

---

## Uso del Componente

### Importación

```javascript
import LocationSelector from '@/components/LocationSelector';
```

### Ejemplo Básico

```javascript
import { useState } from 'react';
import LocationSelector, { useLocationInfo } from '@/components/LocationSelector';

function MiFormulario() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const locationInfo = useLocationInfo(selectedPlace);

  return (
    <div>
      <label>Dirección del Evento</label>
      <LocationSelector
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onSelect={setSelectedPlace}
        placeholder="Buscar dirección..."
      />
      
      {locationInfo && (
        <div>
          <p>Dirección: {locationInfo.address}</p>
          <p>Comuna: {locationInfo.comuna}</p>
          <p>Región: {locationInfo.region}</p>
        </div>
      )}
    </div>
  );
}
```

### Ejemplo con Formulario

```javascript
import { useState } from 'react';
import LocationSelector, { useLocationInfo } from '@/components/LocationSelector';

function CursoForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    fecha: '',
    lugar: null
  });

  const locationInfo = useLocationInfo(formData.lugar);

  const handleLocationSelect = (place) => {
    setFormData(prev => ({
      ...prev,
      lugar: place
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Enviar al backend
    const dataToSend = {
      nombre: formData.nombre,
      fecha: formData.fecha,
      direccion: locationInfo?.fullAddress,
      comuna: locationInfo?.comuna,
      region: locationInfo?.region,
    };
    
    console.log('Enviando:', dataToSend);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.nombre}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          nombre: e.target.value
        }))}
        placeholder="Nombre del curso"
      />
      
      <LocationSelector
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onSelect={handleLocationSelect}
        placeholder="¿Dónde se realizará?"
      />
      
      <button type="submit">Crear Curso</button>
    </form>
  );
}
```

### Ejemplo con Valor Inicial

```javascript
import LocationSelector from '@/components/LocationSelector';

function EditarProveedor({ proveedor }) {
  const [direccion, setDireccion] = useState(
    proveedor.direccion_google_place || null
  );

  return (
    <LocationSelector
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      initialValue={direccion}
      onSelect={setDireccion}
      placeholder="Dirección del proveedor"
    />
  );
}
```

---

## Props del Componente

### LocationSelector

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `apiKey` | string | ✅ | Google Maps API Key |
| `onSelect` | function | ❌ | Callback cuando se selecciona una ubicación |
| `placeholder` | string | ❌ | Texto placeholder (default: "Buscar dirección...") |
| `initialValue` | object | ❌ | Valor inicial del componente |

---

## Hook useLocationInfo

Extrae información estructurada de un objeto de Google Places.

### Parámetros

- `place`: Objeto place retornado por Google Places Autocomplete

### Retorno

```javascript
{
  fullAddress: string,  // Dirección completa
  address: string,      // Calle y número
  comuna: string,       // Comuna
  region: string,       // Región
  placeId: string,      // ID único de Google Places
}
```

### Ejemplo

```javascript
const location = useLocationInfo(selectedPlace);

// Resultado ejemplo:
{
  fullAddress: "Av. Providencia 1234, Providencia, Región Metropolitana, Chile",
  address: "Av. Providencia 1234",
  comuna: "Providencia",
  region: "Región Metropolitana",
  placeId: "ChIJ123abc"
}
```

---

## Integración con Backend

### Guardar Ubicación en Base de Datos

```javascript
// Frontend - Preparar datos
const saveLocation = async (selectedPlace) => {
  const locationInfo = useLocationInfo(selectedPlace);
  
  const data = {
    nombre: "Curso de Formación",
    direccion: locationInfo.fullAddress,
    comuna: locationInfo.comuna,
    region: locationInfo.region,
    google_place_id: locationInfo.placeId,
    // Puedes guardar el objeto completo como JSON
    google_place_data: JSON.stringify(selectedPlace)
  };
  
  await axios.post('/api/cursos/', data);
};
```

### Modelo Backend (Ejemplo)

```python
# models.py
class Curso(models.Model):
    nombre = models.CharField(max_length=200)
    direccion = models.CharField(max_length=500)
    comuna = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    google_place_id = models.CharField(max_length=200, blank=True)
    google_place_data = models.JSONField(blank=True, null=True)
```

---

## Casos de Uso

### 1. Formulario de Preinscripción
Permitir al usuario seleccionar su dirección de residencia.

### 2. Creación de Cursos
Seleccionar la ubicación donde se realizará el curso.

### 3. Registro de Proveedores
Ingresar la dirección del proveedor para cálculos de distancia.

### 4. Eventos Scout
Marcar el punto de encuentro para actividades.

---

## Personalización

### Estilos Custom

```javascript
<LocationSelector
  apiKey={apiKey}
  onSelect={handleSelect}
  customStyles={{
    control: (provided) => ({
      ...provided,
      backgroundColor: '#f3f4f6',
      borderRadius: '0.5rem',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  }}
/>
```

### Filtros Avanzados

```javascript
// Modificar en src/components/LocationSelector.jsx
autocompletionRequest: {
  componentRestrictions: {
    country: ['cl'],  // Solo Chile
  },
  types: ['address'],  // Solo direcciones
  // types: ['establishment'],  // Solo negocios
  // types: ['(cities)'],  // Solo ciudades
}
```

---

## Testing

### Tests Incluidos

- ✅ Renderizado sin API key (muestra advertencia)
- ✅ Renderizado con API key
- ✅ Hook `useLocationInfo` extrae datos correctamente
- ✅ Manejo de datos faltantes

### Ejecutar Tests

```bash
cd frontend
npm test LocationSelector
```

### Mock para Tests

```javascript
// En tus tests
vi.mock('react-google-places-autocomplete', () => ({
  default: vi.fn(() => <div>Mocked Google Places</div>)
}));
```

---

## Troubleshooting

### ❌ Error: "API Key no configurada"

**Causa**: Variable de entorno no configurada.

**Solución**:
1. Verifica que `VITE_GOOGLE_MAPS_API_KEY` esté en `.env`
2. Reinicia el servidor de desarrollo (`npm run dev`)

### ❌ Error: "This API project is not authorized to use this API"

**Causa**: La API no está habilitada en tu proyecto de Google Cloud.

**Solución**:
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Habilita "Places API" y "Maps JavaScript API"

### ❌ Error: "REQUEST_DENIED"

**Causa**: Restricciones de API key.

**Solución**:
1. Verifica las restricciones de tu API key
2. Asegúrate de que tu dominio esté autorizado
3. En desarrollo, considera no usar restricciones

### ⚠️ Componente no muestra resultados

**Causa**: Posibles problemas de red o configuración.

**Solución**:
1. Abre DevTools y revisa la consola
2. Verifica que la API key sea válida
3. Revisa que tengas créditos en Google Cloud

---

## Costos

Google Maps Platform tiene **\$200 USD de crédito mensual gratis**.

### Pricing (aproximado)
- **Autocomplete (per session)**: \$0.017 por sesión
- Con \$200 gratis = ~11,700 sesiones/mes

Para la mayoría de aplicaciones pequeñas/medianas, el tier gratuito es suficiente.

### Monitoreo de Uso
- Ve a [Google Cloud Console](https://console.cloud.google.com)
- Navega a "APIs y Servicios" > "Panel de control"
- Revisa el uso de "Places API"

---

## Alternativas Sin API Key

Si no quieres usar Google Maps API Key:

### 1. Usar Select Manual
```javascript
<select onChange={handleComunaChange}>
  <option value="santiago">Santiago</option>
  <option value="providencia">Providencia</option>
  {/* ... */}
</select>
```

### 2. Usar API de Geografia del Backend
```javascript
const comunas = await axios.get('/api/geografia/comunas/');
// Mostrar en un select
```

### 3. Input de Texto Simple
```javascript
<input
  type="text"
  placeholder="Ingresa tu dirección"
  onChange={(e) => setDireccion(e.target.value)}
/>
```

---

## Recursos

- [React Google Places Autocomplete](https://github.com/hibiken/react-places-autocomplete)
- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Google Cloud Console](https://console.cloud.google.com)
- [Google Maps Platform Pricing](https://mapsplatform.google.com/pricing/)

---

## Resumen

✅ **Instalado**: Paquete `react-google-places-autocomplete` ya incluido  
✅ **Componente**: `LocationSelector.jsx` creado  
✅ **Hook**: `useLocationInfo` para extraer datos  
✅ **Tests**: Tests básicos incluidos  
✅ **Documentación**: Esta guía completa  

🔧 **Pendiente**: Configurar `VITE_GOOGLE_MAPS_API_KEY` en `.env`  
🎯 **Uso**: Importar y usar en formularios según necesidad
