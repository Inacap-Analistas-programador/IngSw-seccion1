import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/Button';
import { X, Check } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

const MapPickerModal = ({ isOpen, onClose, onConfirm, initialLat, initialLng }) => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (initialLat && initialLng) {
      setPosition({ lat: parseFloat(initialLat), lng: parseFloat(initialLng) });
    } else {
        // Default to Santiago, Chile if no position
        setPosition({ lat: -33.4489, lng: -70.6693 });
    }
  }, [initialLat, initialLng, isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (position) {
      onConfirm(position);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/10 shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Seleccionar Ubicación</h3>
          <Button onClick={onClose} variant="ghost" className="p-2 text-white/60 hover:text-white">
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="flex-1 relative">
            {/* We need to ensure the map container has a height */}
            <MapContainer 
                center={position || [-33.4489, -70.6693]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
            
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 text-black px-4 py-2 rounded-full shadow-lg z-[1000] text-sm font-medium">
                Haz click en el mapa para marcar la ubicación
            </div>
        </div>

        <div className="p-4 border-t border-white/10 flex justify-between items-center bg-slate-900 rounded-b-2xl">
            <div className="text-white/70 text-sm">
                {position ? `Lat: ${position.lat.toFixed(6)}, Lng: ${position.lng.toFixed(6)}` : 'Ninguna ubicación seleccionada'}
            </div>
            <div className="flex space-x-3">
                <Button onClick={onClose} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                    Cancelar
                </Button>
                <Button 
                    onClick={handleConfirm} 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center"
                    disabled={!position}
                >
                    <Check className="h-4 w-4 mr-2" />
                    Confirmar Ubicación
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MapPickerModal;
