import React from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

const Step3Health = ({ formData, updateFormData }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#001558] mb-2">Salud y Alimentación</h2>
        <p className="text-gray-600">
          Información importante sobre tu salud y necesidades alimentarias.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="alimentacion">Tipo de Dieta *</Label>
          <select
            id="alimentacion"
            value={formData.alimentacion}
            onChange={(e) => handleChange('alimentacion', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Seleccionar tipo de dieta</option>
            <option value="sin-restricciones">Sin restricciones</option>
            <option value="vegetariana">Vegetariana</option>
            <option value="vegana">Vegana</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="alergias">Alergias</Label>
          <Input
            id="alergias"
            value={formData.alergias}
            onChange={(e) => handleChange('alergias', e.target.value)}
            placeholder="Alergias alimentarias o a medicamentos"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="diseases">Enfermedades o Condiciones Médicas</Label>
          <textarea
            id="enfermedades"
            value={formData.enfermedades}
            onChange={(e) => handleChange('enfermedades', e.target.value)}
            placeholder="Condiciones médicas relevantes (ej. diabetes, asma)"
            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            rows={4}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="limitations">Limitaciones Físicas</Label>
          <textarea
            id="limitaciones"
            value={formData.limitaciones}
            onChange={(e) => handleChange('limitaciones', e.target.value)}
            placeholder="Limitaciones físicas o restricciones (ej. movilidad reducida)"
            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nombreEmergencia">Contacto de Emergencia *</Label>
          <Input
            id="nombreEmergencia"
            value={formData.nombreEmergencia}
            onChange={(e) => handleChange('nombreEmergencia', e.target.value)}
            placeholder="Nombre completo del contacto"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefonoEmergencia">Teléfono de Emergencia *</Label>
          <Input
            id="telefonoEmergencia"
            value={formData.telefonoEmergencia}
            onChange={(e) => handleChange('telefonoEmergencia', e.target.value)}
            placeholder="+56 9 1234 5678"
          />
        </div>
      </div>
    </div>
  );
};

export default Step3Health;
