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
        <p className="text-gray-600">
          Completa tu información relacionada con el movimiento Scout.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rol">Rol *</Label>
          <Input
            id="rol"
            value={formData.rol}
            onChange={(e) => handleChange('rol', e.target.value)}
            placeholder="Dirigente / Colaborador"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="esIndividual">¿Es persona individual? *</Label>
          <select
            id="esIndividual"
            value={formData.esIndividual}
            onChange={(e) => handleChange('esIndividual', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Seleccionar</option>
            <option value="no">No</option>
            <option value="si">Sí</option>
          </select>
        </div>

        {formData.esIndividual !== 'si' && (
          <div className="space-y-2">
            <Label htmlFor="grupo">Grupo Scout *</Label>
            <Input
              id="grupo"
              value={formData.grupo}
              onChange={(e) => handleChange('grupo', e.target.value)}
              placeholder="Nombre del grupo"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="cargo">Cargo *</Label>
          <Input
            id="cargo"
            value={formData.cargo}
            onChange={(e) => handleChange('cargo', e.target.value)}
            placeholder="Jefe de Tropa, Dirigente"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="distrito">Distrito *</Label>
          <Input
            id="distrito"
            value={formData.distrito}
            onChange={(e) => handleChange('distrito', e.target.value)}
            placeholder="Distrito"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zona">Zona *</Label>
          <Input
            id="zona"
            value={formData.zona}
            onChange={(e) => handleChange('zona', e.target.value)}
            placeholder="Zona"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nivel">Nivel *</Label>
          <select
            id="nivel"
            value={formData.nivel}
            onChange={(e) => handleChange('nivel', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Seleccionar nivel</option>
            <option value="inicial">Inicial</option>
            <option value="medio">Medio</option>
            <option value="avanzado">Avanzado</option>
          </select>
        </div>

        {formData.nivel === 'avanzado' && (
          <div className="space-y-2">
            <Label htmlFor="ramaFormacion">Rama de Formación *</Label>
            <select
              id="ramaFormacion"
              value={formData.ramaFormacion}
              onChange={(e) => handleChange('ramaFormacion', e.target.value)}
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

        {formData.nivel === 'medio' && (
          <div className="space-y-2">
            <Label htmlFor="numeroMMAA">Número MMAA</Label>
            <Input
              id="numeroMMAA"
              value={formData.numeroMMAA}
              onChange={(e) => handleChange('numeroMMAA', e.target.value)}
              placeholder="Número MMAA"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="esFormador">¿Es formador? *</Label>
          <select
            id="esFormador"
            value={formData.esFormador}
            onChange={(e) => handleChange('esFormador', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Seleccionar</option>
            <option value="no">No</option>
            <option value="si">Sí</option>
          </select>
        </div>
      </div>

      {formData.esFormador === 'si' && (
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
