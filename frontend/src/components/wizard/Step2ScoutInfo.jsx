import React from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

const Step2ScoutInfo = ({ formData, updateFormData }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#001558] mb-2">Información Scout</h2>
        <p className="text-gray-600">Completa tu información relacionada con el movimiento Scout.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Rol *</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            placeholder="Dirigente / Colaborador"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="isIndividual">¿Eres persona individual? *</Label>
          <select
            id="isIndividual"
            value={formData.isIndividual}
            onChange={(e) => handleChange('isIndividual', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Seleccionar</option>
            <option value="no">No</option>
            <option value="si">Sí</option>
          </select>
        </div>

        {formData.isIndividual !== 'si' && (
          <div className="space-y-2">
            <Label htmlFor="group">Grupo Scout *</Label>
            <Input
              id="group"
              value={formData.group}
              onChange={(e) => handleChange('group', e.target.value)}
              placeholder="Nombre del grupo"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="position">Cargo *</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => handleChange('position', e.target.value)}
            placeholder="Jefe de Tropa, Dirigente"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">Distrito *</Label>
          <Input
            id="district"
            value={formData.district}
            onChange={(e) => handleChange('district', e.target.value)}
            placeholder="Distrito"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zone">Zona *</Label>
          <Input
            id="zone"
            value={formData.zone}
            onChange={(e) => handleChange('zone', e.target.value)}
            placeholder="Zona"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Nivel *</Label>
          <select
            id="level"
            value={formData.level}
            onChange={(e) => handleChange('level', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Seleccionar nivel</option>
            <option value="inicial">Inicial</option>
            <option value="medio">Medio</option>
            <option value="avanzado">Avanzado</option>
          </select>
        </div>

        {formData.level === 'avanzado' && (
          <div className="space-y-2">
            <Label htmlFor="formationBranch">Rama de Formación *</Label>
            <select
              id="formationBranch"
              value={formData.formationBranch}
              onChange={(e) => handleChange('formationBranch', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Seleccionar rama</option>
              <option value="castores">Castores</option>
              <option value="lobatos">Lobatos</option>
              <option value="scouts">Scouts</option>
              <option value="pioneros">Pioneros</option>
              <option value="rovers">Rovers</option>
            </select>
          </div>
        )}

        {formData.level === 'medio' && (
          <div className="space-y-2">
            <Label htmlFor="mmaaNumber">Número MMAA</Label>
            <Input
              id="mmaaNumber"
              value={formData.mmaaNumber}
              onChange={(e) => handleChange('mmaaNumber', e.target.value)}
              placeholder="Número MMAA"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="isTrainer">¿Eres formador? *</Label>
          <select
            id="isTrainer"
            value={formData.isTrainer}
            onChange={(e) => handleChange('isTrainer', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Seleccionar</option>
            <option value="no">No</option>
            <option value="si">Sí</option>
          </select>
        </div>
      </div>

      {formData.isTrainer === 'si' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#001558]">Información de Formador</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="habilitacion1">Habilitación 1</Label>
              <Input
                id="habilitacion1"
                value={formData.habilitacion1}
                onChange={(e) => handleChange('habilitacion1', e.target.value)}
                placeholder="Habilitación 1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="habilitacion2">Habilitación 2</Label>
              <Input
                id="habilitacion2"
                value={formData.habilitacion2}
                onChange={(e) => handleChange('habilitacion2', e.target.value)}
                placeholder="Habilitación 2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="verificador">Verificador</Label>
              <Input
                id="verificador"
                value={formData.verificador}
                onChange={(e) => handleChange('verificador', e.target.value)}
                placeholder="Verificador"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="historialFormador">Historial de Formador</Label>
              <Input
                id="historialFormador"
                value={formData.historialFormador}
                onChange={(e) => handleChange('historialFormador', e.target.value)}
                placeholder="Historial de formador"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2ScoutInfo;