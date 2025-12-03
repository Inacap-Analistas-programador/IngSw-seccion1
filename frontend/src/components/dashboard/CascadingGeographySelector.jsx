import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Calendar } from 'lucide-react';
import geografiaService from '@/services/geografiaService';

const CascadingGeographySelector = ({
    selectedRegion,
    selectedProvincia,
    selectedComuna,
    onRegionChange,
    onProvinciaChange,
    onComunaChange,
    errors = {}
}) => {
    const [regiones, setRegiones] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [comunas, setComunas] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadRegiones();
    }, []);

    useEffect(() => {
        if (selectedRegion) {
            loadProvincias(selectedRegion);
        } else {
            setProvincias([]);
            setComunas([]);
        }
    }, [selectedRegion]);

    useEffect(() => {
        if (selectedProvincia) {
            loadComunas(selectedProvincia);
        } else {
            setComunas([]);
        }
    }, [selectedProvincia]);

    const loadRegiones = async () => {
        try {
            setLoading(true);
            const data = await geografiaService.getList('regiones');
            // Handle both direct array and paginated response
            const regionesArray = Array.isArray(data) ? data : (data.results || []);
            setRegiones(regionesArray);
        } catch (error) {
            console.error('Error loading regiones:', error);
            setRegiones([]); // Fallback to empty array on error
        } finally {
            setLoading(false);
        }
    };

    const loadProvincias = async (regionId) => {
        try {
            setLoading(true);
            const data = await geografiaService.getList('provincias');
            const provinciasArray = Array.isArray(data) ? data : (data.results || []);
            // Filter by region
            const filtered = provinciasArray.filter(p => p.reg_id === parseInt(regionId));
            setProvincias(filtered);
        } catch (error) {
            console.error('Error loading provincias:', error);
            setProvincias([]);
        } finally {
            setLoading(false);
        }
    };

    const loadComunas = async (provinciaId) => {
        try {
            setLoading(true);
            const data = await geografiaService.getList('comunas');
            const comunasArray = Array.isArray(data) ? data : (data.results || []);
            // Filter by provincia
            const filtered = comunasArray.filter(c => c.pro_id === parseInt(provinciaId));
            setComunas(filtered);
        } catch (error) {
            console.error('Error loading comunas:', error);
            setComunas([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
                <Label htmlFor="region">Región *</Label>
                <select
                    id="region"
                    value={selectedRegion || ''}
                    onChange={(e) => {
                        onRegionChange(e.target.value);
                        onProvinciaChange('');
                        onComunaChange('');
                    }}
                    className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ${errors.region ? 'border-red-500' : 'border-input'}`}
                    disabled={loading}
                >
                    <option value="">Seleccionar región</option>
                    {regiones.map((region) => (
                        <option key={region.reg_id} value={region.reg_id}>
                            {region.reg_descripcion}
                        </option>
                    ))}
                </select>
                {errors.region && <p className="text-xs text-red-600">{errors.region}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="provincia">Provincia *</Label>
                <select
                    id="provincia"
                    value={selectedProvincia || ''}
                    onChange={(e) => {
                        onProvinciaChange(e.target.value);
                        onComunaChange('');
                    }}
                    className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ${errors.provincia ? 'border-red-500' : 'border-input'}`}
                    disabled={!selectedRegion || loading}
                >
                    <option value="">Seleccionar provincia</option>
                    {provincias.map((provincia) => (
                        <option key={provincia.pro_id} value={provincia.pro_id}>
                            {provincia.pro_descripcion}
                        </option>
                    ))}
                </select>
                {errors.provincia && <p className="text-xs text-red-600">{errors.provincia}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="comuna">Comuna *</Label>
                <select
                    id="comuna"
                    value={selectedComuna || ''}
                    onChange={(e) => onComunaChange(e.target.value)}
                    className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ${errors.comuna ? 'border-red-500' : 'border-input'}`}
                    disabled={!selectedProvincia || loading}
                >
                    <option value="">Seleccionar comuna</option>
                    {comunas.map((comuna) => (
                        <option key={comuna.com_id} value={comuna.com_id}>
                            {comuna.com_descripcion}
                        </option>
                    ))}
                </select>
                {errors.comuna && <p className="text-xs text-red-600">{errors.comuna}</p>}
            </div>
        </div>
    );
};

export default CascadingGeographySelector;
