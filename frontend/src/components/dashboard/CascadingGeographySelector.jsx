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
    onComunaSelect,
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

    const selectClassName = "flex h-10 w-full rounded-md border border-white/10 !bg-slate-800 px-3 py-2 text-sm !text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
                <Label htmlFor="region" className="text-white/80">Región *</Label>
                <select
                    id="region"
                    className={selectClassName}
                    value={selectedRegion || ''}
                    onChange={(e) => {
                        onRegionChange(e.target.value);
                        onProvinciaChange('');
                        onComunaChange('');
                    }}
                    disabled={loading}
                >
                    <option value="" className="bg-slate-800 text-white">Seleccionar región</option>
                    {regiones.map((region) => (
                        <option key={region.reg_id} value={region.reg_id} className="bg-slate-800 text-white">
                            {region.reg_descripcion}
                        </option>
                    ))}
                </select>
                {errors.region && <p className="text-xs text-red-400">{errors.region}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="provincia" className="text-white/80">Provincia *</Label>
                <select
                    id="provincia"
                    className={selectClassName}
                    value={selectedProvincia || ''}
                    onChange={(e) => {
                        onProvinciaChange(e.target.value);
                        onComunaChange('');
                    }}
                    disabled={!selectedRegion || loading}
                >
                    <option value="" className="bg-slate-800 text-white">Seleccionar provincia</option>
                    {provincias.map((provincia) => (
                        <option key={provincia.pro_id} value={provincia.pro_id} className="bg-slate-800 text-white">
                            {provincia.pro_descripcion}
                        </option>
                    ))}
                </select>
                {errors.provincia && <p className="text-xs text-red-400">{errors.provincia}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="comuna" className="text-white/80">Comuna *</Label>
                <select
                    id="comuna"
                    className={selectClassName}
                    value={selectedComuna || ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        onComunaChange(val);
                        if (val && onComunaSelect) {
                            const selected = comunas.find(c => c.com_id === parseInt(val));
                            if (selected) onComunaSelect(selected);
                        }
                    }}
                    disabled={!selectedProvincia || loading}
                >
                    <option value="" className="bg-slate-800 text-white">Seleccionar comuna</option>
                    {comunas.map((comuna) => (
                        <option key={comuna.com_id} value={comuna.com_id} className="bg-slate-800 text-white">
                            {comuna.com_descripcion}
                        </option>
                    ))}
                </select>
                {errors.comuna && <p className="text-xs text-red-400">{errors.comuna}</p>}
            </div>
        </div>
    );
};

export default CascadingGeographySelector;
