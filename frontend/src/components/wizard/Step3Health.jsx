import React from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

const Step3Health = ({ formData, updateFormData }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-0.5">
          <Label htmlFor="alimentacion" className="text-[10px] text-gray-400 uppercase tracking-wider">Tipo de Alimentación *</Label>
          <select
            id="alimentacion"
            value={formData.alimentacion}
            onChange={(e) => handleChange('alimentacion', e.target.value)}
            className="flex h-8 w-full rounded-lg border border-gray-300 bg-white text-black px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none placeholder:text-gray-400"
          >
            <option value="">Seleccionar tipo de dieta</option>
            <option value="sin-restricciones" className="bg-slate-800">Sin restricciones</option>
            <option value="vegetariana" className="bg-slate-800">Vegetariana</option>
            <option value="vegana" className="bg-slate-800">Vegana</option>
            <option value="celiaco" className="bg-slate-800">Celíaco</option>
          </select>
        </div>

        <div className="space-y-0.5">
          <Label htmlFor="prevision" className="text-[10px] text-gray-400 uppercase tracking-wider">Previsión de Salud</Label>
          <select
            id="prevision"
            value={formData.prevision}
            onChange={(e) => handleChange('prevision', e.target.value)}
            className="flex h-8 w-full rounded-lg border border-gray-300 bg-white text-black px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none placeholder:text-gray-400"
          >
            <option value="">Seleccionar previsión</option>
            <option value="fonasa" className="bg-slate-800">Fonasa</option>
            <option value="isapre" className="bg-slate-800">Isapre</option>
            <option value="otra" className="bg-slate-800">Otra</option>
          </select>
        </div>

        <div className="space-y-0.5 md:col-span-2">
          <Label htmlFor="enfermedades" className="text-[10px] text-gray-400 uppercase tracking-wider">Enfermedades / Alergias</Label>
          <textarea
            id="enfermedades"
            value={formData.enfermedades}
            onChange={(e) => handleChange('enfermedades', e.target.value)}
            placeholder="Alergias alimentarias o a medicamentos"
            className="flex min-h-[60px] w-full rounded-lg border border-gray-300 bg-white text-black px-3 py-2 text-xs placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none"
            rows={2}
          />
        </div>

        <div className="space-y-0.5 md:col-span-2">
          <Label htmlFor="medicamentos" className="text-[10px] text-gray-400 uppercase tracking-wider">Medicamentos</Label>
          <textarea
            id="medicamentos"
            value={formData.medicamentos}
            onChange={(e) => handleChange('medicamentos', e.target.value)}
            placeholder="Indica si tomas algún medicamento regularmente"
            className="flex min-h-[60px] w-full rounded-lg border border-gray-300 bg-white text-black px-3 py-2 text-xs placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none"
            rows={2}
          />
        </div>

        <div className="space-y-0.5 md:col-span-2">
          <Label htmlFor="limitaciones" className="text-[10px] text-gray-400 uppercase tracking-wider">Limitaciones Físicas</Label>
          <textarea
            id="limitaciones"
            value={formData.limitaciones}
            onChange={(e) => handleChange('limitaciones', e.target.value)}
            placeholder="Limitaciones físicas o restricciones (ej. movilidad reducida)"
            className="flex min-h-[60px] w-full rounded-lg border border-gray-300 bg-white text-black px-3 py-2 text-xs placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none"
            rows={2}
          />
        </div>

        <div className="space-y-0.5">
          <Label htmlFor="nombreEmergencia" className="text-[10px] text-gray-400 uppercase tracking-wider">Contacto de Emergencia *</Label>
          <Input
            id="nombreEmergencia"
            value={formData.nombreEmergencia}
            onChange={(e) => handleChange('nombreEmergencia', e.target.value)}
            placeholder="Nombre completo"
            className="h-8 bg-white text-black border-gray-300 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-0.5">
          <Label htmlFor="telefonoEmergencia" className="text-[10px] text-gray-400 uppercase tracking-wider">Teléfono de Emergencia *</Label>
          <Input
            id="telefonoEmergencia"
            value={formData.telefonoEmergencia}
            onChange={(e) => handleChange('telefonoEmergencia', e.target.value)}
            placeholder="+56 9 1234 5678"
            className="h-8 bg-white text-black border-gray-300 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Step3Health;
