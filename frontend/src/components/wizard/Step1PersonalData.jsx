import React from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

const Step1PersonalData = ({ formData, updateFormData }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#001558] mb-2">Datos Personales</h2>
        <p className="text-gray-600">Por favor completa tu información personal básica.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombreCompleto">Nombre Completo *</Label>
          <Input
            id="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={(e) => handleChange('nombreCompleto', e.target.value)}
            placeholder="Juan Pérez González"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rut">RUT *</Label>
          <Input
            id="rut"
            value={formData.rut}
            onChange={(e) => handleChange('rut', e.target.value)}
            placeholder="12.345.678-9"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
          <Input
            id="fechaNacimiento"
            type="date"
            value={formData.fechaNacimiento}
            onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="correo">Correo Electrónico *</Label>
          <Input
            id="correo"
            type="email"
            value={formData.correo}
            onChange={(e) => handleChange('correo', e.target.value)}
            placeholder="correo@ejemplo.cl"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="direccion">Dirección *</Label>
          <Input
            id="direccion"
            value={formData.direccion}
            onChange={(e) => handleChange('direccion', e.target.value)}
            placeholder="Calle Principal 123"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="comuna">Comuna *</Label>
          <Input
            id="comuna"
            value={formData.comuna}
            onChange={(e) => handleChange('comuna', e.target.value)}
            placeholder="Santiago"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipoTelefono">Tipo de Teléfono *</Label>
          <select
            id="tipoTelefono"
            value={formData.tipoTelefono}
            onChange={(e) => handleChange('tipoTelefono', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Seleccionar tipo</option>
            <option value="movil">Móvil</option>
            <option value="fijo">Fijo</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono *</Label>
          <Input
            id="telefono"
            value={formData.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            placeholder="+56 9 1234 5678"
          />
        </div>
      </div>

      {/* Foto de perfil */}
      <div className="space-y-2">
        <Label htmlFor="fotoPerfil">Foto de Perfil</Label>
        <Input
          id="fotoPerfil"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              handleChange('fotoPerfil', file);
            }
          }}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/5 file:text-[#001558] hover:file:bg-primary/10"
        />
        {formData.fotoPerfil && (
          <p className="text-sm text-gray-600">Archivo seleccionado: {formData.fotoPerfil.name}</p>
        )}
      </div>
    </div>
  );
};

export default Step1PersonalData;
