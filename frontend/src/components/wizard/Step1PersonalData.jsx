import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { FaSearch } from 'react-icons/fa';
import { handleRutInput, validateRut } from '@/utils/rutUtils';
import { compressImage, validateImageFile, blobToFile } from '@/utils/imageUtils';
import cursosService from '@/services/cursosService';
import geografiaService from '@/services/geografiaService';
import personasService from '@/services/personasService';

const Step1PersonalData = ({ formData, updateFormData }) => {
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [filteredProvincias, setFilteredProvincias] = useState([]);
  const [filteredComunas, setFilteredComunas] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    loadCursos();
    loadGeografia();
  }, []);

  useEffect(() => {
    if (formData.curso) {
      loadSecciones(formData.curso);
    }
  }, [formData.curso]);

  useEffect(() => {
    if (formData.region) {
      const filtered = provincias.filter(p => p.reg_id === parseInt(formData.region));
      setFilteredProvincias(filtered);
    } else {
      setFilteredProvincias([]);
    }
  }, [formData.region, provincias]);

  useEffect(() => {
    if (formData.provincia) {
      const filtered = comunas.filter(c => c.pro_id === parseInt(formData.provincia));
      setFilteredComunas(filtered);
    } else {
      setFilteredComunas([]);
    }
  }, [formData.provincia, comunas]);

  const loadCursos = async () => {
    try {
      const response = await cursosService.getAll();
      setCursos(response.data || []);
    } catch (error) {
      console.error('Error loading cursos:', error);
    }
  };

  const loadSecciones = async (cursoId) => {
    try {
      const response = await cursosService.getById(cursoId);
      const seccionesData = response.data?.secciones || [];
      setSecciones(seccionesData);
      
      // Auto-select if only one section
      if (seccionesData.length === 1) {
        updateFormData({ seccion: seccionesData[0].sec_id });
      }
    } catch (error) {
      console.error('Error loading secciones:', error);
    }
  };

  const loadGeografia = async () => {
    try {
      const [regionesData, provinciasData, comunasData] = await Promise.all([
        geografiaService.getList('regiones'),
        geografiaService.getList('provincias'),
        geografiaService.getList('comunas')
      ]);
      setRegiones(regionesData || []);
      setProvincias(provinciasData || []);
      setComunas(comunasData || []);
    } catch (error) {
      console.error('Error loading geografia:', error);
    }
  };

  const handleRutSearch = async () => {
    if (!formData.rut) {
      alert('Por favor ingresa un RUT');
      return;
    }

    if (!validateRut(formData.rut)) {
      alert('RUT inválido');
      return;
    }

    setLoading(true);
    try {
      // Search for existing person by RUT
      const cleanedRut = formData.rut.replace(/[.-]/g, '').slice(0, -1);
      const response = await personasService.searchByRut(cleanedRut);
      
      if (response.data && response.data.length > 0) {
        // Auto-fill data
        const persona = response.data[0];
        updateFormData({
          nombreCompleto: `${persona.per_nombres || ''} ${persona.per_apellido_paterno || ''} ${persona.per_apellido_materno || ''}`.trim(),
          fechaNacimiento: persona.per_fecha_nacimiento || '',
          correo: persona.per_correo || '',
          direccion: persona.per_direccion || '',
          region: persona.per_region_id || '',
          provincia: persona.per_provincia_id || '',
          comuna: persona.com_id || '',
          telefono: persona.per_telefono || '',
          tipoTelefono: persona.per_tipo_telefono === 2 ? 'celular' : 'fijo',
          profesion: persona.per_profesion || '',
          religion: persona.per_religion || '',
          apodo: persona.per_apodo || '',
        });
        console.log('Persona encontrada y datos auto-rellenados');
      } else {
        console.log('Persona no encontrada, permitir nuevo registro');
      }
    } catch (error) {
      console.log('Persona no encontrada, permitir nuevo registro');
    } finally {
      setLoading(false);
      setSearchPerformed(true);
    }
  };

  const handleChange = (field, value) => {
    if (field === 'rut') {
      value = handleRutInput(value);
    }
    updateFormData({ [field]: value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageError('');

    if (!validateImageFile(file)) {
      setImageError('Por favor selecciona una imagen válida (JPG, PNG, WEBP)');
      return;
    }

    try {
      // Compress to max 100KB
      const compressedBlob = await compressImage(file, 100);
      const compressedFile = blobToFile(compressedBlob, file.name);
      
      // Create preview
      const preview = URL.createObjectURL(compressedBlob);
      setImagePreview(preview);
      
      handleChange('fotoPerfil', compressedFile);
    } catch (error) {
      console.error('Error compressing image:', error);
      setImageError('Error al procesar la imagen');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#001558] mb-2">Datos Personales</h2>
        <p className="text-gray-600">Por favor completa tu información personal básica.</p>
      </div>

      {/* Curso and Sección Selection */}
      <div className="grid md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
        <div className="space-y-2">
          <Label htmlFor="curso">Curso *</Label>
          <select
            id="curso"
            value={formData.curso || ''}
            onChange={(e) => handleChange('curso', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Seleccionar curso</option>
            {cursos.map((curso) => (
              <option key={curso.cur_id} value={curso.cur_id}>
                {curso.cur_nombre}
              </option>
            ))}
          </select>
        </div>

        {secciones.length > 1 && (
          <div className="space-y-2">
            <Label htmlFor="seccion">Sección *</Label>
            <select
              id="seccion"
              value={formData.seccion || ''}
              onChange={(e) => handleChange('seccion', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Seleccionar sección</option>
              {secciones.map((seccion) => (
                <option key={seccion.sec_id} value={seccion.sec_id}>
                  Sección {seccion.sec_numero} - {seccion.rama_nombre || 'Sin rama'}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* RUT Search */}
      <div className="space-y-2">
        <Label htmlFor="rut">RUT *</Label>
        <div className="flex gap-2">
          <Input
            id="rut"
            value={formData.rut}
            onChange={(e) => handleChange('rut', e.target.value)}
            placeholder="12345678-9 (solo números)"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleRutSearch}
            disabled={loading || !formData.rut}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? (
              'Buscando...'
            ) : (
              <>
                <FaSearch className="mr-2" />
                Buscar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form fields - shown only after search */}
      {searchPerformed && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nombreCompleto">Nombre Completo *</Label>
              <Input
                id="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={(e) => handleChange('nombreCompleto', e.target.value)}
                placeholder="Juan Pérez González"
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

            <div className="space-y-2">
              <Label htmlFor="profesion">Profesión u Oficio</Label>
              <Input
                id="profesion"
                value={formData.profesion}
                onChange={(e) => handleChange('profesion', e.target.value)}
                placeholder="Tu profesión u oficio"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="religion">Religión</Label>
              <Input
                id="religion"
                value={formData.religion}
                onChange={(e) => handleChange('religion', e.target.value)}
                placeholder="Tu religión (opcional)"
              />
            </div>

            {/* Geographic hierarchy */}
            <div className="space-y-2">
              <Label htmlFor="region">Región *</Label>
              <select
                id="region"
                value={formData.region || ''}
                onChange={(e) => handleChange('region', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Seleccionar región</option>
                {regiones.map((region) => (
                  <option key={region.reg_id} value={region.reg_id}>
                    {region.reg_nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provincia">Provincia *</Label>
              <select
                id="provincia"
                value={formData.provincia || ''}
                onChange={(e) => handleChange('provincia', e.target.value)}
                disabled={!formData.region}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Seleccionar provincia</option>
                {filteredProvincias.map((provincia) => (
                  <option key={provincia.pro_id} value={provincia.pro_id}>
                    {provincia.pro_nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comuna">Comuna *</Label>
              <select
                id="comuna"
                value={formData.comuna || ''}
                onChange={(e) => handleChange('comuna', e.target.value)}
                disabled={!formData.provincia}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Seleccionar comuna</option>
                {filteredComunas.map((comuna) => (
                  <option key={comuna.com_id} value={comuna.com_id}>
                    {comuna.com_nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección *</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => handleChange('direccion', e.target.value)}
                placeholder="Calle Principal 123"
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
                <option value="celular">Móvil</option>
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
            <Label htmlFor="fotoPerfil">Foto de Perfil (máx. 100 KB)</Label>
            <Input
              id="fotoPerfil"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/5 file:text-[#001558] hover:file:bg-primary/10"
            />
            {imageError && (
              <p className="text-sm text-red-600">{imageError}</p>
            )}
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Vista previa" 
                  className="max-w-xs rounded-lg shadow-md"
                />
              </div>
            )}
            {formData.fotoPerfil && !imageError && (
              <p className="text-sm text-gray-600">
                Archivo: {formData.fotoPerfil.name} ({(formData.fotoPerfil.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
        </>
      )}

      {!searchPerformed && (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Por favor ingresa tu RUT y presiona "Buscar" para continuar</p>
        </div>
      )}      {!searchPerformed && (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Por favor ingresa tu RUT y presiona "Buscar" para continuar</p>
        </div>
      )}
    </div>
  );
};

export default Step1PersonalData;
