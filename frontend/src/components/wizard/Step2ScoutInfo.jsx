import React from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

const Step2ScoutInfo = ({ formData, updateFormData }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  // Static options (replace with API data if available)
  const zonas = ['Norte', 'Sur', 'Centro', 'Occidente'];
  const distritos = ['Distrito 1', 'Distrito 2', 'Distrito 3'];
  const grupos = ['Grupo A', 'Grupo B', 'Grupo C'];
  const roles = ['Dirigente', 'Colaborador', 'Voluntario'];
  const estadosCiviles = [
    { value: 'soltero', label: 'Soltero(a)' },
    { value: 'casado', label: 'Casado(a)' },
    { value: 'otro', label: 'Otro' },
  ];
  const ramas = ['Castores', 'Lobatos', 'Scouts', 'Pioneros', 'Rovers'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Información de Organización</h2>
        <p className="text-gray-600">
          Completa tu información organizacional (opcional para inscripción individual).
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Association top row: Zona, Distrito, Grupo (compact) */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="zona">Zona</Label>
              <select
                id="zona"
                value={formData.zona}
                onChange={(e) => handleChange('zona', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Seleccionar Zona</option>
                {zonas.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="distrito">Distrito</Label>
              <select
                id="distrito"
                value={formData.distrito}
                onChange={(e) => handleChange('distrito', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Seleccionar Distrito</option>
                {distritos.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grupo">Grupo</Label>
              <select
                id="grupo"
                value={formData.grupo}
                onChange={(e) => handleChange('grupo', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Seleccionar Grupo</option>
                {grupos.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Role and cargo next */}
        <div className="space-y-2 md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="rol">Rol</Label>
              <select
                id="rol"
                value={formData.rol}
                onChange={(e) => handleChange('rol', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Seleccionar Rol</option>
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              {/* Cargo visibility/requirement rules handled here */}
              {!(formData.zona && formData.distrito && formData.grupo) ? (
                <>
                  <Label htmlFor="cargo">Cargo {formData.zona && formData.distrito && !formData.grupo ? '*' : ''}</Label>
                  <Input
                    id="cargo"
                    value={formData.cargo}
                    onChange={(e) => handleChange('cargo', e.target.value)}
                    placeholder="Jefe de Tropa, Dirigente"
                  />
                </>
              ) : (
                // If zona + distrito + grupo present, hide cargo and clear it
                <>
                  {formData.cargo && handleChange('cargo', '')}
                  <Label className="text-sm text-gray-500">Cargo (no aplica con Zona+Distrito+Grupo)</Label>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estadoCivil">Estado Civil</Label>
              <select
                id="estadoCivil"
                value={formData.estadoCivil}
                onChange={(e) => handleChange('estadoCivil', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Seleccionar</option>
                {estadosCiviles.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
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

        {formData.nivel === 'medio' && (
          <div className="space-y-2">
            <Label htmlFor="subNivel">Sub-nivel</Label>
            <select
              id="subNivel"
              value={formData.subNivel || ''}
              onChange={(e) => handleChange('subNivel', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Ninguno</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
        )}

        {/* Show ramas list to pick from depending on nivel */}
        {formData.nivel && (
          <div className="space-y-2 md:col-span-2">
            <Label>Ramas (haz click para seleccionar)</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {ramas.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleChange('ramaFormacion', r)}
                  className={`px-3 py-1 border rounded ${formData.ramaFormacion===r? 'bg-primary text-white':''}`}
                >
                  {r}
                </button>
              ))}
            </div>
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
          <h3 className="text-lg font-semibold text-blue-900">Información de Formador</h3>
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
                onBlur={(e) => {
                  const val = (e.target.value || '').toUpperCase();
                  if (val && !val.endsWith('R')) {
                    handleChange('verificador', `${val}R`);
                  }
                }}
                placeholder="Verificador (se añadirá 'R' si falta)"
              />
            </div>

            {/* Do not show historial when esFormador === 'si' per requirement */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2ScoutInfo;
