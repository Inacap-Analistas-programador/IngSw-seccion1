import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Settings, Map as MapIcon, User, DollarSign, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import CascadingGeographySelector from './CascadingGeographySelector';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const CourseCreateModal = ({
  isOpen,
  onClose,
  courseData,
  masterData = { ramas: [], niveles: [], cargos: [], tiposCurso: [], personas: [] },
  handleInputChange,
  handleCreateCourse
}) => {
  const [mapPosition, setMapPosition] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (courseData.coordLatitud && courseData.coordLongitud) {
      setMapPosition({
        lat: parseFloat(courseData.coordLatitud),
        lng: parseFloat(courseData.coordLongitud)
      });
    } else {
        // Default to Santiago if no coords
        setMapPosition({ lat: -33.4489, lng: -70.6693 });
    }
  }, [courseData.coordLatitud, courseData.coordLongitud]);

  const handleMapClick = async (latlng) => {
    setMapPosition(latlng);
    handleInputChange('coordLatitud', latlng.lat);
    handleInputChange('coordLongitud', latlng.lng);

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
      const data = await response.json();
      if (data) {
        const placeName = data.name || 
                          (data.address && (data.address.leisure || data.address.building || data.address.park || data.address.road)) || 
                          data.display_name.split(',')[0];
        if (placeName) {
            handleInputChange('lugar', placeName);
        }
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleComunaSelect = async (comuna) => {
      if (!comuna) return;
      try {
          const query = `${comuna.com_descripcion}, Chile`;
          const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
          const data = await response.json();
          if (data && data.length > 0) {
              const { lat, lon } = data[0];
              const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
              setMapPosition(newPos);
              handleInputChange('coordLatitud', newPos.lat);
              handleInputChange('coordLongitud', newPos.lng);
          }
      } catch (error) {
          console.error("Error fetching comuna location:", error);
      }
  };

  if (!isOpen) return null;

  const selectClassName = "flex h-10 w-full rounded-md border border-white/10 !bg-slate-800 px-3 py-2 text-sm !text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const inputClassName = "!bg-slate-800 border-white/10 !text-white placeholder:text-white/40";

  const tabs = [
    { id: 'general', label: 'General', icon: FileText },
    { id: 'ubicacion', label: 'Ubicación', icon: MapPin },
    { id: 'clasificacion', label: 'Clasificación', icon: Settings },
    { id: 'responsables', label: 'Responsables', icon: User },
    { id: 'finanzas', label: 'Finanzas', icon: DollarSign },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className={`bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl flex overflow-hidden transition-all duration-500 ease-in-out ${activeTab === 'ubicacion' ? 'max-w-5xl' : 'max-w-md'}`}>
        
        {/* Left Panel: Form Content */}
        <div className="flex-1 flex flex-col min-w-[450px] h-[600px] max-h-[85vh]">
            {/* Header */}
            <div className="flex justify-between items-center py-2 px-4 border-b border-gray-700 bg-gray-900 z-10">
            <div>
                <h2 className="text-lg font-bold text-white">Crear Nuevo Curso</h2>
            </div>
            <Button onClick={onClose} variant="ghost" className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-full">
                <X className="h-5 w-5" />
            </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700 overflow-x-auto bg-gray-950 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                        ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                        : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                </button>
                );
            })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 bg-gray-900 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-600">
            
            {/* Tab: General */}
            {activeTab === 'general' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                    <Label htmlFor="codigo" className="text-white/80">Código del Curso *</Label>
                    <Input
                        id="codigo"
                        value={courseData.codigo}
                        onChange={(e) => handleInputChange('codigo', e.target.value)}
                        className={inputClassName}
                        placeholder="Ej: CUR-2024-001"
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="lugar" className="text-white/80">Nombre del Lugar</Label>
                    <Input
                        id="lugar"
                        value={courseData.lugar || ''}
                        onChange={(e) => handleInputChange('lugar', e.target.value)}
                        className={inputClassName}
                        placeholder="Ej: Parque O'Higgins"
                    />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="descripcion" className="text-white/80">Descripción Corta</Label>
                    <Input
                    id="descripcion"
                    value={courseData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    className={inputClassName}
                    placeholder="Breve descripción del curso"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="observacion" className="text-white/80">Observaciones Detalladas</Label>
                    <Textarea
                    id="observacion"
                    value={courseData.observacion || ''}
                    onChange={(e) => handleInputChange('observacion', e.target.value)}
                    className={`${inputClassName} min-h-[100px]`}
                    placeholder="Información adicional, requisitos, etc."
                    />
                </div>
                </div>
            )}

            {/* Tab: Ubicación (Selectors Only) */}
            {activeTab === 'ubicacion' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="p-4 bg-gray-950 rounded-lg border border-gray-700">
                        <h3 className="text-sm font-medium text-white mb-4 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-emerald-400" />
                        Selección de Zona
                        </h3>
                        <CascadingGeographySelector
                        selectedRegion={courseData.regionId}
                        selectedProvincia={courseData.provinciaId}
                        selectedComuna={courseData.comunaId}
                        onRegionChange={(val) => handleInputChange('regionId', val)}
                        onProvinciaChange={(val) => handleInputChange('provinciaId', val)}
                        onComunaChange={(val) => handleInputChange('comunaId', val)}
                        onComunaSelect={handleComunaSelect}
                        />
                    </div>
                </div>
            )}

            {/* Tab: Clasificación */}
            {activeTab === 'clasificacion' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label className="text-white/80">Rama</Label>
                    <select
                        className={selectClassName}
                        value={courseData.ramaId || ''}
                        onChange={(e) => handleInputChange('ramaId', e.target.value)}
                    >
                        <option value="" className="bg-slate-900">Seleccionar Rama...</option>
                        {masterData.ramas.map(rama => (
                        <option key={rama.id} value={rama.id} className="bg-slate-900">{rama.nombre}</option>
                        ))}
                    </select>
                    </div>
                    <div className="space-y-2">
                    <Label className="text-white/80">Nivel</Label>
                    <select
                        className={selectClassName}
                        value={courseData.nivelId || ''}
                        onChange={(e) => handleInputChange('nivelId', e.target.value)}
                    >
                        <option value="" className="bg-slate-900">Seleccionar Nivel...</option>
                        {masterData.niveles.map(nivel => (
                        <option key={nivel.id} value={nivel.id} className="bg-slate-900">{nivel.nombre}</option>
                        ))}
                    </select>
                    </div>
                    <div className="space-y-2">
                    <Label className="text-white/80">Tipo de Curso</Label>
                    <select
                        className={selectClassName}
                        value={courseData.tipoCurso || ''}
                        onChange={(e) => handleInputChange('tipoCurso', e.target.value)}
                    >
                        <option value="" className="bg-slate-900">Seleccionar Tipo...</option>
                        {masterData.tiposCurso.map(tipo => (
                        <option key={tipo.id} value={tipo.id} className="bg-slate-900">{tipo.nombre}</option>
                        ))}
                    </select>
                    </div>
                    <div className="space-y-2">
                    <Label className="text-white/80">Modalidad</Label>
                    <select
                        className={selectClassName}
                        value={courseData.modalidad || ''}
                        onChange={(e) => handleInputChange('modalidad', e.target.value)}
                    >
                        <option value="" className="bg-slate-900">Seleccionar Modalidad...</option>
                        <option value="1" className="bg-slate-900">Presencial</option>
                        <option value="2" className="bg-slate-900">Online</option>
                        <option value="3" className="bg-slate-900">Híbrido</option>
                    </select>
                    </div>
                </div>
                </div>
            )}

            {/* Tab: Responsables */}
            {activeTab === 'responsables' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-4">
                    <p className="text-sm text-blue-200">
                    Seleccione la persona responsable del curso y su cargo. Esta persona será el contacto principal.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                    <Label className="text-white/80">Persona Responsable</Label>
                    <select
                        className={selectClassName}
                        value={courseData.responsableId || ''}
                        onChange={(e) => handleInputChange('responsableId', e.target.value)}
                    >
                        <option value="" className="bg-slate-900">Buscar Persona...</option>
                        {masterData.personas.map(persona => (
                        <option key={persona.per_id} value={persona.per_id} className="bg-slate-900">
                            {persona.per_nombres} {persona.per_apelpat} {persona.per_apelmat}
                        </option>
                        ))}
                    </select>
                    </div>
                    
                    <div className="space-y-2">
                    <Label className="text-white/80">Cargo del Responsable</Label>
                    <select
                        className={selectClassName}
                        value={courseData.cargoResponsableId || ''}
                        onChange={(e) => handleInputChange('cargoResponsableId', e.target.value)}
                    >
                        <option value="" className="bg-slate-900">Seleccionar Cargo...</option>
                        {masterData.cargos.map(cargo => (
                        <option key={cargo.id} value={cargo.id} className="bg-slate-900">{cargo.nombre}</option>
                        ))}
                    </select>
                    </div>
                </div>
                </div>
            )}

            {/* Tab: Finanzas */}
            {activeTab === 'finanzas' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="cuotaConAlmuerzo" className="text-white/80">Valor Cuota (Con Almuerzo)</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-white/40">$</span>
                        <Input
                        id="cuotaConAlmuerzo"
                        type="number"
                        value={courseData.cuotaConAlmuerzo || ''}
                        onChange={(e) => handleInputChange('cuotaConAlmuerzo', e.target.value)}
                        className={`${inputClassName} pl-8`}
                        placeholder="0"
                        />
                    </div>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="cuotaSinAlmuerzo" className="text-white/80">Valor Cuota (Sin Almuerzo)</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-white/40">$</span>
                        <Input
                        id="cuotaSinAlmuerzo"
                        type="number"
                        value={courseData.cuotaSinAlmuerzo || ''}
                        onChange={(e) => handleInputChange('cuotaSinAlmuerzo', e.target.value)}
                        className={`${inputClassName} pl-8`}
                        placeholder="0"
                        />
                    </div>
                    </div>
                </div>
                
                <div className="space-y-2 pt-2">
                    <Label className="text-white/80">Administración</Label>
                    <select
                    className={selectClassName}
                    value={courseData.administra || '1'}
                    onChange={(e) => handleInputChange('administra', e.target.value)}
                    >
                    <option value="1" className="bg-slate-900">Nacional</option>
                    <option value="2" className="bg-slate-900">Regional</option>
                    <option value="3" className="bg-slate-900">Distrital</option>
                    <option value="4" className="bg-slate-900">Grupo</option>
                    </select>
                </div>
                </div>
            )}

            </div>

            {/* Footer Actions */}
            <div className="py-2 px-4 border-t border-gray-700 bg-gray-900 flex justify-between items-center">
            <div className="text-xs text-gray-400">
                * Campos obligatorios
            </div>
            <div className="flex space-x-3">
                <Button onClick={onClose} variant="outline" className="h-8 bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                Cancelar
                </Button>
                <Button onClick={handleCreateCourse} className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white px-6">
                Crear Curso
                </Button>
            </div>
            </div>
        </div>

        {/* Right Panel: Map (Only visible when activeTab === 'ubicacion') */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden bg-gray-950 ${activeTab === 'ubicacion' ? 'w-[500px] border-l border-gray-700' : 'w-0 border-none'}`}>
            <div className="h-full w-[500px] relative">
                <MapContainer 
                    center={[-33.4489, -70.6693]} 
                    zoom={10} 
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                >
                    <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker position={mapPosition} setPosition={handleMapClick} />
                </MapContainer>
                
                {/* Coordinates Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur border border-white/10 p-3 rounded-lg z-[400] flex justify-between items-center">
                    <div>
                    <Label className="text-xs text-white/60 uppercase tracking-wider mb-1 block">Coordenadas</Label>
                    <div className="flex items-center space-x-4 text-emerald-400 font-mono text-sm">
                        <span>Lat: {mapPosition?.lat.toFixed(6)}</span>
                        <span>Lng: {mapPosition?.lng.toFixed(6)}</span>
                    </div>
                    </div>
                    <div className="text-xs text-white/40 text-right">
                    Haga clic en el mapa<br/>para actualizar
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCreateModal;
