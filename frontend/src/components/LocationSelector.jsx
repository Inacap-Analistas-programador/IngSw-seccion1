import { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

/**
 * Componente de selección de ubicación con Google Places Autocomplete
 * 
 * @param {Object} props
 * @param {Function} props.onSelect - Callback cuando se selecciona una ubicación
 * @param {string} props.placeholder - Placeholder del input
 * @param {Object} props.initialValue - Valor inicial
 * @param {string} props.apiKey - Google Maps API Key (requerido)
 * 
 * @example
 * <LocationSelector
 *   apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
 *   onSelect={(place) => console.log(place)}
 *   placeholder="Buscar dirección..."
 * />
 */
export function LocationSelector({ 
  onSelect, 
  placeholder = 'Buscar dirección...', 
  initialValue = null,
  apiKey 
}) {
  const [value, setValue] = useState(initialValue);

  const handleSelect = (place) => {
    setValue(place);
    if (onSelect) {
      onSelect(place);
    }
  };

  if (!apiKey) {
    return (
      <div className="border-2 border-yellow-400 bg-yellow-50 p-4 rounded">
        <p className="text-yellow-800 text-sm">
          ⚠️ Google Maps API Key no configurada. 
          Configura <code>VITE_GOOGLE_MAPS_API_KEY</code> en tu archivo .env
        </p>
      </div>
    );
  }

  return (
    <div className="location-selector">
      <GooglePlacesAutocomplete
        apiKey={apiKey}
        selectProps={{
          value,
          onChange: handleSelect,
          placeholder,
          styles: {
            control: (provided) => ({
              ...provided,
              minHeight: '40px',
              borderRadius: '0.375rem',
              borderColor: '#e5e7eb',
              '&:hover': {
                borderColor: '#d1d5db',
              },
            }),
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
            }),
          },
          // Configuración para Chile
          apiOptions: {
            language: 'es',
            region: 'cl',
          },
          autocompletionRequest: {
            componentRestrictions: {
              country: ['cl'],
            },
          },
        }}
      />
    </div>
  );
}

/**
 * Hook para extraer información de una ubicación de Google Places
 * 
 * @param {Object} place - Objeto place de Google Places
 * @returns {Object} Información estructurada de la ubicación
 * 
 * @example
 * const location = useLocationInfo(selectedPlace);
 * console.log(location.address); // "Av. Providencia 1234, Providencia"
 * console.log(location.comuna);  // "Providencia"
 * console.log(location.region);  // "Región Metropolitana"
 */
export function useLocationInfo(place) {
  if (!place) return null;

  const addressComponents = place.value?.terms || [];
  
  return {
    fullAddress: place.label,
    address: addressComponents[0]?.value || '',
    comuna: addressComponents[1]?.value || '',
    region: addressComponents[addressComponents.length - 1]?.value || '',
    placeId: place.value?.place_id || '',
  };
}

export default LocationSelector;
