import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import LocationSelector, { useLocationInfo } from '@/components/LocationSelector';
import { Button } from '@/components/ui/Button';
import { FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

/**
 * Página de demostración de integración con Google Maps
 * Muestra ejemplos de uso del componente LocationSelector
 */
const GoogleMapsDemo = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
  });

  const locationInfo = useLocationInfo(selectedPlace);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleSaveLocation = () => {
    if (locationInfo && formData.eventName) {
      const newLocation = {
        id: Date.now(),
        name: formData.eventName,
        date: formData.eventDate,
        ...locationInfo,
      };
      setSavedLocations([...savedLocations, newLocation]);
      setFormData({ eventName: '', eventDate: '' });
      setSelectedPlace(null);
    }
  };

  const handleRemoveLocation = (id) => {
    setSavedLocations(savedLocations.filter((loc) => loc.id !== id));
  };

  return (
    <>
      <Helmet>
        <title>Demo Google Maps - GIC</title>
        <meta name="description" content="Demostración de integración con Google Maps" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4 shadow-lg">
              <FaMapMarkerAlt className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Integración Google Maps
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Demostración del componente LocationSelector para seleccionar ubicaciones
              con autocompletado de Google Places API
            </p>
          </motion.div>

          {/* API Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`mb-8 p-4 rounded-lg border-2 ${
              apiKey
                ? 'bg-green-50 border-green-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}
          >
            <div className="flex items-center justify-center">
              {apiKey ? (
                <>
                  <FaCheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">
                    Google Maps API Key configurada correctamente
                  </span>
                </>
              ) : (
                <>
                  <FaTimesCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-yellow-800 font-medium">
                    Google Maps API Key no configurada. Configura VITE_GOOGLE_MAPS_API_KEY
                    en tu archivo .env
                  </span>
                </>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Crear Evento con Ubicación
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Evento
                  </label>
                  <input
                    type="text"
                    value={formData.eventName}
                    onChange={(e) =>
                      setFormData({ ...formData, eventName: e.target.value })
                    }
                    placeholder="Ej: Campamento de Verano 2024"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha del Evento
                  </label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) =>
                      setFormData({ ...formData, eventDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación del Evento
                  </label>
                  <LocationSelector
                    apiKey={apiKey}
                    onSelect={setSelectedPlace}
                    placeholder="Buscar dirección en Chile..."
                  />
                </div>

                {locationInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                  >
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Información Extraída:
                    </h3>
                    <div className="space-y-1 text-sm text-blue-800">
                      <p>
                        <strong>Dirección Completa:</strong> {locationInfo.fullAddress}
                      </p>
                      <p>
                        <strong>Dirección:</strong> {locationInfo.address}
                      </p>
                      <p>
                        <strong>Comuna:</strong> {locationInfo.comuna}
                      </p>
                      <p>
                        <strong>Región:</strong> {locationInfo.region}
                      </p>
                      <p>
                        <strong>Place ID:</strong>{' '}
                        <code className="bg-blue-100 px-1 rounded">
                          {locationInfo.placeId}
                        </code>
                      </p>
                    </div>
                  </motion.div>
                )}

                <Button
                  onClick={handleSaveLocation}
                  disabled={!formData.eventName || !locationInfo}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Guardar Ubicación
                </Button>
              </div>
            </motion.div>

            {/* Saved Locations Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Ubicaciones Guardadas ({savedLocations.length})
              </h2>

              {savedLocations.length === 0 ? (
                <div className="text-center py-12">
                  <FaMapMarkerAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No hay ubicaciones guardadas todavía
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Completa el formulario y guarda tu primera ubicación
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {savedLocations.map((location, index) => (
                    <motion.div
                      key={location.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 flex-1">
                          {location.name}
                        </h3>
                        <button
                          onClick={() => handleRemoveLocation(location.id)}
                          className="text-red-500 hover:text-red-700 transition-colors ml-2"
                        >
                          <FaTimesCircle className="w-5 h-5" />
                        </button>
                      </div>

                      {location.date && (
                        <p className="text-sm text-gray-600 mb-2">
                          📅 {new Date(location.date).toLocaleDateString('es-CL')}
                        </p>
                      )}

                      <div className="space-y-1 text-sm text-gray-700">
                        <p className="flex items-start">
                          <FaMapMarkerAlt className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="break-words">{location.fullAddress}</span>
                        </p>
                        <p className="pl-6 text-gray-500">
                          {location.comuna} • {location.region}
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            location.fullAddress
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          Ver en Google Maps →
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Usage Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Cómo usar este componente en tu código
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  1. Importar el componente
                </h3>
                <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>
                    {`import LocationSelector, { useLocationInfo } from '@/components/LocationSelector';`}
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  2. Usar en tu componente
                </h3>
                <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>
                    {`const [selectedPlace, setSelectedPlace] = useState(null);
const locationInfo = useLocationInfo(selectedPlace);

<LocationSelector
  apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
  onSelect={setSelectedPlace}
  placeholder="Buscar dirección..."
/>

// Acceder a la información
console.log(locationInfo.fullAddress);
console.log(locationInfo.comuna);
console.log(locationInfo.region);`}
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  3. Configurar API Key
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-2">
                    Agrega tu Google Maps API Key en el archivo{' '}
                    <code className="bg-yellow-100 px-1 rounded">.env</code>:
                  </p>
                  <pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto text-sm">
                    <code>VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui</code>
                  </pre>
                  <p className="text-sm text-gray-600 mt-2">
                    📚 Obtén tu API Key en:{' '}
                    <a
                      href="https://console.cloud.google.com/google/maps-apis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Google Cloud Console
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default GoogleMapsDemo;
