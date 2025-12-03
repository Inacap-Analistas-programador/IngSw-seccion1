import React from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

const Step4AdditionalData = ({ formData, updateFormData }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehiculo">¿Tienes Vehículo?</Label>
          <select
            id="vehiculo"
            value={formData.vehiculo}
            onChange={(e) => handleChange('vehiculo', e.target.value)}
            className="flex h-9 w-full rounded-lg border border-gray-300 bg-white text-black px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none placeholder:text-gray-400"
          >
            <option value="">Seleccionar</option>
            <option value="si" className="bg-slate-800">Sí</option>
            <option value="no" className="bg-slate-800">No</option>
          </select>
        </div>

        {formData.vehiculo === 'si' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="vehiculoMarca">Marca del Vehículo</Label>
              <Input
                id="vehiculoMarca"
                value={formData.vehiculoMarca}
                onChange={(e) => handleChange('vehiculoMarca', e.target.value)}
                placeholder="Toyota, Chevrolet, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehiculoModelo">Modelo del Vehículo</Label>
              <Input
                id="vehiculoModelo"
                value={formData.vehiculoModelo}
                onChange={(e) => handleChange('vehiculoModelo', e.target.value)}
                placeholder="Corolla, Spark, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehiculoPatente">Patente del Vehículo</Label>
              <Input
                id="vehiculoPatente"
                value={formData.vehiculoPatente}
                onChange={(e) => handleChange('vehiculoPatente', e.target.value)}
                placeholder="AB-CD-12"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="religion">Religión</Label>
          <Input
            id="religion"
            value={formData.religion}
            onChange={(e) => handleChange('religion', e.target.value)}
            placeholder="Tu religión (opcional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="trabajaConNNAJ">¿Trabajas con Jóvenes? *</Label>
          <select
            id="trabajaConNNAJ"
            value={formData.trabajaConNNAJ}
            onChange={(e) => handleChange('trabajaConNNAJ', e.target.value)}
            className="flex h-9 w-full rounded-lg border border-gray-300 bg-white text-black px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none placeholder:text-gray-400"
          >
            <option value="">Seleccionar</option>
            <option value="si" className="bg-slate-800">Sí</option>
            <option value="no" className="bg-slate-800">No</option>
          </select>
        </div>

        {formData.trabajaConNNAJ === 'si' && (
          <div className="space-y-2">
            <Label htmlFor="tiempoTrabajoNNAJ">Tiempo trabajo con NNAJ</Label>
            <Input
              id="tiempoTrabajoNNAJ"
              value={formData.tiempoTrabajoNNAJ}
              onChange={(e) => handleChange('tiempoTrabajoNNAJ', e.target.value)}
              placeholder="ej. 5 años"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="trabajaConAdultos">¿Trabajas con Adultos? *</Label>
          <select
            id="trabajaConAdultos"
            value={formData.trabajaConAdultos}
            onChange={(e) => handleChange('trabajaConAdultos', e.target.value)}
            className="flex h-9 w-full rounded-lg border border-gray-300 bg-white text-black px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none placeholder:text-gray-400"
          >
            <option value="">Seleccionar</option>
            <option value="si" className="bg-slate-800">Sí</option>
            <option value="no" className="bg-slate-800">No</option>
          </select>
        </div>

        {formData.trabajaConAdultos === 'si' && (
          <div className="space-y-2">
            <Label htmlFor="tiempoTrabajoAdultos">Tiempo trabajo con Adultos</Label>
            <Input
              id="tiempoTrabajoAdultos"
              value={formData.tiempoTrabajoAdultos}
              onChange={(e) => handleChange('tiempoTrabajoAdultos', e.target.value)}
              placeholder="ej. 3 años"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="esBeneficiario">¿Fuiste Beneficiario? *</Label>
          <select
            id="esBeneficiario"
            value={formData.esBeneficiario}
            onChange={(e) => handleChange('esBeneficiario', e.target.value)}
            className="flex h-9 w-full rounded-lg border border-gray-300 bg-white text-black px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none placeholder:text-gray-400"
          >
            <option value="">Seleccionar</option>
            <option value="si" className="bg-slate-800">Sí</option>
            <option value="no" className="bg-slate-800">No</option>
          </select>
        </div>

        {formData.esBeneficiario === 'si' && (
          <div className="space-y-2">
            <Label htmlFor="tiempoBeneficiario">Tiempo como Beneficiario</Label>
            <Input
              id="tiempoBeneficiario"
              value={formData.tiempoBeneficiario}
              onChange={(e) => handleChange('tiempoBeneficiario', e.target.value)}
              placeholder="ej. 10 años"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="apodo">Apodo Scout</Label>
          <Input
            id="apodo"
            value={formData.apodo}
            onChange={(e) => handleChange('apodo', e.target.value)}
            placeholder="Tu nombre Scout"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="needsAccommodation">¿Necesitas Alojamiento?</Label>
          <select
            id="needsAccommodation"
            value={formData.needsAccommodation}
            onChange={(e) => handleChange('needsAccommodation', e.target.value)}
            className="flex h-9 w-full rounded-lg border border-gray-300 bg-white text-black px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none placeholder:text-gray-400"
          >
            <option value="">Seleccionar</option>
            <option value="si" className="bg-slate-800">Sí</option>
            <option value="no" className="bg-slate-800">No</option>
          </select>
        </div>

        {formData.needsAccommodation === 'si' && (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="detalleAlojamiento">Detalles de Alojamiento</Label>
            <textarea
              id="detalleAlojamiento"
              value={formData.detalleAlojamiento}
              onChange={(e) => handleChange('detalleAlojamiento', e.target.value)}
              placeholder="Indica si necesitas algo específico o tienes alguna restricción."
              className="flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white text-black px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none"
              rows={3}
            />
          </div>
        )}

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="expectativasCurso">Observación del curso (qué esperas del curso)</Label>
          <textarea
            id="expectativasCurso"
            value={formData.expectativasCurso}
            onChange={(e) => handleChange('expectativasCurso', e.target.value)}
            placeholder="Describe tus expectativas sobre el curso"
            className="flex min-h-[120px] w-full rounded-lg border border-gray-300 bg-white text-black px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none"
            rows={4}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="observaciones">Observaciones Adicionales</Label>
          <textarea
            id="observaciones"
            value={formData.observaciones}
            onChange={(e) => handleChange('observaciones', e.target.value)}
            placeholder="Información adicional relevante"
            className="flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white text-black px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default Step4AdditionalData;
