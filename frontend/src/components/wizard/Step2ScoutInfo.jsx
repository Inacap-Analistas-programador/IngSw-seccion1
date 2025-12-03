import React from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

const Step2ScoutInfo = ({ formData, updateFormData }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const ramas = ['Castores', 'Lobatos', 'Scouts', 'Pioneros', 'Rovers'];

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        {/* Association top row: Zona, Distrito, Grupo (compact) */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="space-y-0.5">
              <Label htmlFor="zona" className="text-[10px] text-gray-400 uppercase tracking-wider">Zona</Label>
              <select
                id="zona"
                value={formData.zona}
                onChange={(e) => handleChange('zona', e.target.value)}
                className="flex h-8 w-full rounded-lg border border-gray-300 bg-white text-black px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none"
              >
                <option value="">Seleccionar</option>
                <option value="zona1" className="bg-slate-800">Zona Centro</option>
                <option value="zona2" className="bg-slate-800">Zona Norte</option>
                <option value="zona3" className="bg-slate-800">Zona Sur</option>
              </select>
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="distrito" className="text-[10px] text-gray-400 uppercase tracking-wider">Distrito</Label>
              <select
                id="distrito"
                value={formData.distrito}
                onChange={(e) => handleChange('distrito', e.target.value)}
                className="flex h-8 w-full rounded-lg border border-gray-300 bg-white text-black px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none"
              >
                <option value="">Seleccionar</option>
                <option value="distrito1" className="bg-slate-800">Distrito A</option>
                <option value="distrito2" className="bg-slate-800">Distrito B</option>
              </select>
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="grupo" className="text-[10px] text-gray-400 uppercase tracking-wider">Grupo</Label>
              <select
                id="grupo"
                value={formData.grupo}
                onChange={(e) => handleChange('grupo', e.target.value)}
                className="flex h-8 w-full rounded-lg border border-gray-300 bg-white text-black px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none"
              >
                <option value="">Seleccionar</option>
                <option value="grupo1" className="bg-slate-800">Grupo 1</option>
                <option value="grupo2" className="bg-slate-800">Grupo 2</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-0.5">
          <Label htmlFor="rama" className="text-[10px] text-gray-400 uppercase tracking-wider">Rama *</Label>
          <select
            id="rama"
            value={formData.rama}
            onChange={(e) => handleChange('rama', e.target.value)}
            className="flex h-8 w-full rounded-lg border border-gray-300 bg-white text-black px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none"
          >
            <option value="">Seleccionar rama</option>
            {ramas.map((r) => (
              <option key={r} value={r} className="bg-slate-800">{r}</option>
            ))}
          </select>
        </div>

        <div className="space-y-0.5">
          <Label htmlFor="registroSocial" className="text-[10px] text-gray-400 uppercase tracking-wider">RSH (%)</Label>
          <Input
            id="registroSocial"
            type="number"
            value={formData.registroSocial}
            onChange={(e) => handleChange('registroSocial', e.target.value)}
            placeholder="Ej: 40"
            className="h-8 bg-white text-black border-gray-300 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-0.5">
          <Label htmlFor="nivel" className="text-[10px] text-gray-400 uppercase tracking-wider">Nivel de Formación</Label>
          <select
            id="nivel"
            value={formData.nivel}
            onChange={(e) => handleChange('nivel', e.target.value)}
            className="flex h-8 w-full rounded-lg border border-gray-300 bg-white text-black px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none placeholder:text-gray-400"
          >
            <option value="">Seleccionar nivel</option>
            <option value="inicial" className="bg-slate-800">Inicial</option>
            <option value="medio" className="bg-slate-800">Medio</option>
            <option value="avanzado" className="bg-slate-800">Avanzado</option>
          </select>
        </div>

        <div className="space-y-0.5">
          <Label htmlFor="credencial" className="text-[10px] text-gray-400 uppercase tracking-wider">N° Credencial</Label>
          <Input
            id="credencial"
            value={formData.credencial}
            onChange={(e) => handleChange('credencial', e.target.value)}
            placeholder="123456"
            className="h-8 bg-white text-black border-gray-300 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-0.5">
          <Label htmlFor="cargo" className="text-[10px] text-gray-400 uppercase tracking-wider">Cargo</Label>
          <Input
            id="cargo"
            value={formData.cargo}
            onChange={(e) => handleChange('cargo', e.target.value)}
            placeholder="Ej: Responsable de Unidad"
            className="h-8 bg-white text-black border-gray-300 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-0.5">
          <Label htmlFor="tallaPolera" className="text-[10px] text-gray-400 uppercase tracking-wider">Talla de Polera</Label>
          <select
            id="tallaPolera"
            value={formData.tallaPolera}
            onChange={(e) => handleChange('tallaPolera', e.target.value)}
            className="flex h-8 w-full rounded-lg border border-gray-300 bg-white text-black px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none"
          >
            <option value="">Seleccionar talla</option>
            <option value="S" className="bg-slate-800">S</option>
            <option value="M" className="bg-slate-800">M</option>
            <option value="L" className="bg-slate-800">L</option>
            <option value="XL" className="bg-slate-800">XL</option>
            <option value="XXL" className="bg-slate-800">XXL</option>
          </select>
        </div>

        <div className="space-y-0.5">
          <Label htmlFor="esFormador" className="text-[10px] text-gray-400 uppercase tracking-wider">¿Es formador? *</Label>
          <select
            id="esFormador"
            value={formData.esFormador}
            onChange={(e) => handleChange('esFormador', e.target.value)}
            className="flex h-8 w-full rounded-lg border border-gray-300 bg-white text-black px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none"
          >
            <option value="">Seleccionar</option>
            <option value="no" className="bg-slate-800">No</option>
            <option value="si" className="bg-slate-800">Sí</option>
          </select>
        </div>
      </div>

      {formData.esFormador === 'si' && (
        <div className="space-y-3 pt-3 border-t border-white/10">
          <h3 className="text-sm font-semibold text-white">Información de Formador</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <Label htmlFor="habilitacion1" className="text-[10px] text-gray-400 uppercase tracking-wider">Habilitación 1</Label>
              <Input
                id="habilitacion1"
                value={formData.habilitacion1}
                onChange={(e) => handleChange('habilitacion1', e.target.value)}
                placeholder="Habilitación 1"
                className="h-8 bg-white text-black border-gray-300 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="habilitacion2" className="text-[10px] text-gray-400 uppercase tracking-wider">Habilitación 2</Label>
              <Input
                id="habilitacion2"
                value={formData.habilitacion2}
                onChange={(e) => handleChange('habilitacion2', e.target.value)}
                placeholder="Habilitación 2"
                className="h-8 bg-white text-black border-gray-300 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="verificador" className="text-[10px] text-gray-400 uppercase tracking-wider">Verificador</Label>
              <Input
                id="verificador"
                value={formData.verificador}
                onChange={(e) => handleChange('verificador', e.target.value)}
                onBlur={(e) => {
                  const val = (e.target.value || '').toUpperCase();
                  if (val && !val.endsWith('R')) {
                    handleChange('verificador', `${val}R`);
                  }
                }}
                placeholder="Verificador (se añadirá 'R' si falta)"
                className="h-8 bg-white text-black border-gray-300 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2ScoutInfo;
