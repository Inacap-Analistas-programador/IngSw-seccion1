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
          <Label htmlFor="firstName">Nombre *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="Juan"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName1">Primer Apellido *</Label>
          <Input
            id="lastName1"
            value={formData.lastName1}
            onChange={(e) => handleChange('lastName1', e.target.value)}
            placeholder="Pérez"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName2">Segundo Apellido *</Label>
          <Input
            id="lastName2"
            value={formData.lastName2}
            onChange={(e) => handleChange('lastName2', e.target.value)}
            placeholder="González"
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
          <Label htmlFor="birthDate">Fecha de Nacimiento *</Label>
          <Input
            id="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleChange('birthDate', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="correo@ejemplo.cl"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Dirección *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Calle Principal 123"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="commune">Comuna *</Label>
          <Input
            id="commune"
            value={formData.commune}
            onChange={(e) => handleChange('commune', e.target.value)}
            placeholder="Santiago"
          />
        </div>

        <div className="space-y-2">
          <div></div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneType">Tipo de Teléfono *</Label>
          <select
            id="phoneType"
            value={formData.phoneType}
            onChange={(e) => handleChange('phoneType', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Seleccionar tipo</option>
            <option value="movil">Móvil</option>
            <option value="fijo">Fijo</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+56 9 1234 5678"
          />
        </div>
      </div>

      {/* Foto de perfil */}
      <div className="space-y-2">
        <Label htmlFor="profilePhoto">Foto de Perfil</Label>
          <Input
          id="profilePhoto"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              handleChange('profilePhoto', file);
            }
          }}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/5 file:text-[#001558] hover:file:bg-primary/10"
        />
        {formData.profilePhoto && (
          <p className="text-sm text-gray-600">Archivo seleccionado: {formData.profilePhoto.name}</p>
        )}
      </div>
    </div>
  );
};

export default Step1PersonalData;