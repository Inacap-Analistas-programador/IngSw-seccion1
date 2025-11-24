import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import geografiaService from '@/services/geografiaService';
import maestrosService from '@/services/maestrosService';

const Step2ScoutInfo = ({ formData, updateFormData }) => {
  const [zonas, setZonas] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [roles, setRoles] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [ramas, setRamas] = useState([]);
  const [filteredDistritos, setFilteredDistritos] = useState([]);
  const [filteredGrupos, setFilteredGrupos] = useState([]);
  const [showCargoField, setShowCargoField] = useState(true);
  const [selectedRamasMedio, setSelectedRamasMedio] = useState([]);
  const [selectedRamasAvanzado, setSelectedRamasAvanzado] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (formData.zona) {
      const filtered = distritos.filter(d => d.zon_id === parseInt(formData.zona));
      setFilteredDistritos(filtered);
    } else {
      setFilteredDistritos([]);
    }
  }, [formData.zona, distritos]);

  useEffect(() => {
    if (formData.distrito) {
      const filtered = grupos.filter(g => g.dis_id === parseInt(formData.distrito));
      setFilteredGrupos(filtered);
    } else {
      setFilteredGrupos([]);
    }
  }, [formData.distrito, grupos]);

  useEffect(() => {
    // CARGO logic: hide if zona + distrito + grupo are selected
    const shouldShowCargo = !(formData.zona && formData.distrito && formData.grupo);
    setShowCargoField(shouldShowCargo);
    
    if (!shouldShowCargo) {
      updateFormData({ cargo: '' });
    }
  }, [formData.zona, formData.distrito, formData.grupo]);

  const loadData = async () => {
    try {
      const [zonasData, distritosData, gruposData, rolesData, cargosData, ramasData] = await Promise.all([
        geografiaService.getList('zonas'),
        geografiaService.getList('distritos'),
        geografiaService.getList('grupos'),
        maestrosService.getList('roles'),
        maestrosService.getList('cargos'),
        maestrosService.getList('ramas')
      ]);
      setZonas(zonasData || []);
      setDistritos(distritosData || []);
      setGrupos(gruposData || []);
      setRoles(rolesData || []);
      setCargos(cargosData || []);
      setRamas(ramasData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const toggleRama = (ramaId, nivel) => {
    if (nivel === 'medio') {
      const newRamas = selectedRamasMedio.includes(ramaId)
        ? selectedRamasMedio.filter(id => id !== ramaId)
        : [...selectedRamasMedio, ramaId];
      setSelectedRamasMedio(newRamas);
      updateFormData({ ramasMedio: newRamas });
    } else if (nivel === 'avanzado') {
      const newRamas = selectedRamasAvanzado.includes(ramaId)
        ? selectedRamasAvanzado.filter(id => id !== ramaId)
        : [...selectedRamasAvanzado, ramaId];
      setSelectedRamasAvanzado(newRamas);
      updateFormData({ ramasAvanzado: newRamas });
    }
  };

  const showNivelAvanzado = formData.nivel === 'medio';
  const showRamasSelection = formData.nivel === 'medio' || formData.nivelSecundario === 'avanzado';
  const requiresMMAA = formData.nivel === 'medio' || formData.nivelSecundario === 'avanzado';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-900 mb-2">@Información Asociación@</h2>
        <p className="text-gray-600">
          Completa tu información organizacional (opcional para inscripción individual).
        </p>
      </div>

      {/* First line: ZONA, DISTRITO, GRUPO */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zona">Zona *</Label>
          <select
            id="zona"
            value={formData.zona || ''}
            onChange={(e) => handleChange('zona', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Seleccionar zona</option>
            {zonas.map((zona) => (
              <option key={zona.zon_id} value={zona.zon_id}>
                {zona.zon_nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="distrito">Distrito</Label>
          <select
            id="distrito"
            value={formData.distrito || ''}
            onChange={(e) => handleChange('distrito', e.target.value)}
            disabled={!formData.zona}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Seleccionar distrito</option>
            {filteredDistritos.map((distrito) => (
              <option key={distrito.dis_id} value={distrito.dis_id}>
                {distrito.dis_nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="grupo">Grupo</Label>
          <select
            id="grupo"
            value={formData.grupo || ''}
            onChange={(e) => handleChange('grupo', e.target.value)}
            disabled={!formData.distrito}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Seleccionar grupo</option>
            {filteredGrupos.map((grupo) => (
              <option key={grupo.gru_id} value={grupo.gru_id}>
                {grupo.gru_nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Second line: ROL and CARGO */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rol">Rol *</Label>
          <select
            id="rol"
            value={formData.rol || ''}
            onChange={(e) => handleChange('rol', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Seleccionar rol</option>
            {roles.map((rol) => (
              <option key={rol.rol_id} value={rol.rol_id}>
                {rol.rol_nombre}
              </option>
            ))}
          </select>
        </div>

        {showCargoField && (
          <div className="space-y-2">
            <Label htmlFor="cargo">Cargo *</Label>
            <select
              id="cargo"
              value={formData.cargo || ''}
              onChange={(e) => handleChange('cargo', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Seleccionar cargo</option>
              {cargos.map((cargo) => (
                <option key={cargo.car_id} value={cargo.car_id}>
                  {cargo.car_nombre}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* NIVEL selection */}
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nivel">Nivel *</Label>
            <select
              id="nivel"
              value={formData.nivel || ''}
              onChange={(e) => handleChange('nivel', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Seleccionar nivel</option>
              <option value="inicial">Inicial</option>
              <option value="ninguno">Ninguno</option>
              <option value="medio">Medio</option>
            </select>
          </div>

          {showNivelAvanzado && (
            <div className="space-y-2">
              <Label htmlFor="nivelSecundario">Nivel Avanzado (opcional)</Label>
              <select
                id="nivelSecundario"
                value={formData.nivelSecundario || ''}
                onChange={(e) => handleChange('nivelSecundario', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Ninguno</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
          )}
        </div>

        {/* Ramas selection for Medio */}
        {formData.nivel === 'medio' && (
          <div className="space-y-2">
            <Label>Ramas - Nivel Medio</Label>
            <div className="flex flex-wrap gap-2">
              {ramas.map((rama) => (
                <button
                  key={rama.ram_id}
                  type="button"
                  onClick={() => toggleRama(rama.ram_id, 'medio')}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedRamasMedio.includes(rama.ram_id)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rama.ram_nombre}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ramas selection for Avanzado */}
        {formData.nivelSecundario === 'avanzado' && (
          <div className="space-y-2">
            <Label>Ramas - Nivel Avanzado</Label>
            <div className="flex flex-wrap gap-2">
              {ramas.map((rama) => (
                <button
                  key={rama.ram_id}
                  type="button"
                  onClick={() => toggleRama(rama.ram_id, 'avanzado')}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedRamasAvanzado.includes(rama.ram_id)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rama.ram_nombre}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MMAA date field */}
        {requiresMMAA && (
          <div className="space-y-2">
            <Label htmlFor="numeroMMAA">Número MMAA (MMAA - Mes/Año) *</Label>
            <Input
              id="numeroMMAA"
              value={formData.numeroMMAA || ''}
              onChange={(e) => handleChange('numeroMMAA', e.target.value)}
              placeholder="MM/AA (ej: 03/24)"
              maxLength={5}
            />
          </div>
        )}
      </div>

      {/* FORMADOR section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="esFormador">¿Es formador? *</Label>
          <select
            id="esFormador"
            value={formData.esFormador || ''}
            onChange={(e) => handleChange('esFormador', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Seleccionar</option>
            <option value="no">No</option>
            <option value="si">Sí</option>
          </select>
        </div>

        {formData.esFormador === 'si' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900">Información de Formador</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="habilitacion1">Habilitación 1</Label>
                <Input
                  id="habilitacion1"
                  value={formData.habilitacion1 || ''}
                  onChange={(e) => handleChange('habilitacion1', e.target.value)}
                  placeholder="Habilitación 1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="habilitacion2">Habilitación 2</Label>
                <Input
                  id="habilitacion2"
                  value={formData.habilitacion2 || ''}
                  onChange={(e) => handleChange('habilitacion2', e.target.value)}
                  placeholder="Habilitación 2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="verificador">Verificador (con R)</Label>
                <Input
                  id="verificador"
                  value={formData.verificador || ''}
                  onChange={(e) => {
                    let value = e.target.value.toUpperCase();
                    // Auto-add R at the end if not present
                    if (value && !value.endsWith('R')) {
                      value = value.replace(/R$/g, '') + 'R';
                    }
                    handleChange('verificador', value);
                  }}
                  placeholder="Verificador (termina en R)"
                />
              </div>
            </div>
            {/* HISTORIAL hidden when formador is selected */}
          </div>
        )}

        {formData.esFormador === 'no' && (
          <div className="space-y-2">
            <Label htmlFor="historialFormador">Historial de Capacitaciones</Label>
            <textarea
              id="historialFormador"
              value={formData.historialFormador || ''}
              onChange={(e) => handleChange('historialFormador', e.target.value)}
              placeholder="Historial de capacitaciones"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows={4}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Step2ScoutInfo;
