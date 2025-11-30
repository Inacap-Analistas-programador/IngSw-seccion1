import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import personasService from '@/services/personasService';
import { Search } from 'lucide-react';

// Format and strip helpers
const stripRutDigits = (value) => (value || '').replace(/\D/g, '');
const formatRutDisplay = (digits) => {
  if (!digits) return '';
  const run = digits.replace(/\D/g, '');
  const dv = run.slice(-1);
  const body = run.slice(0, -1);
  const parts = [];
  for (let i = body.length; i > 0; i -= 3) {
    const start = Math.max(0, i - 3);
    parts.unshift(body.slice(start, i));
  }
  return parts.length ? `${parts.join('.')}-${dv}` : `${body}-${dv}`;
};

const Step1PersonalData = ({ formData, updateFormData }) => {
  const [searching, setSearching] = useState(false);
  const [rutInput, setRutInput] = useState(formData.rut || '');
  const [previewFile, setPreviewFile] = useState(null);
  const [fotoCrop, setFotoCrop] = useState(formData.fotoCrop || 'center');

  const handleChange = (field, value) => updateFormData({ [field]: value });

  const handleRutChange = (value) => {
    const digits = stripRutDigits(value);
    setRutInput(digits);
    updateFormData({ rut: digits });
  };

  const handleSearchByRut = async () => {
    const rutDigits = stripRutDigits(rutInput);
    if (!rutDigits) return alert('Ingrese el RUT (solo números) antes de buscar.');
    setSearching(true);
    try {
      const resp = await personasService.searchByRut(rutDigits);

      // Normalize different API shapes:
      // - Array: [ { ... }, ... ]
      // - { results: [...] }
      // - { data: { results: [...] } }
      // - { data: [...] }
      let results = [];
      if (Array.isArray(resp)) {
        results = resp;
      } else if (Array.isArray(resp?.results)) {
        results = resp.results;
      } else if (Array.isArray(resp?.data?.results)) {
        results = resp.data.results;
      } else if (Array.isArray(resp?.data)) {
        results = resp.data;
      } else if (resp && typeof resp === 'object') {
        // API might return a single object for a single match
        results = [resp];
      }

      if (Array.isArray(results) && results.length > 0) {
        const p = results[0];
        updateFormData({
          searchedRut: true,
          personaFound: true,
          nombreCompleto: `${p.per_nombres || ''} ${p.per_apelpat || ''} ${p.per_apelmat || ''}`.trim(),
          correo: p.per_email || '',
          fechaNacimiento: p.per_fecha_nac || '',
          direccion: p.per_direccion || '',
          comuna: p.com_id || p.comuna || '',
          telefono: p.per_fono || '',
          profesion: p.per_profesion || '',
          rut: rutDigits,
        });
      } else {
        updateFormData({ searchedRut: true, personaFound: false, rut: rutDigits });
      }
    } catch (err) {
      console.error('Error buscando RUT:', err);
      // Mostrar campos para ingreso manual si ocurre un error en la búsqueda
      updateFormData({ searchedRut: true, personaFound: false, rut: rutDigits });
      alert('Ocurrió un error buscando el RUT. Intenta nuevamente. Si el problema persiste, completa los datos manualmente.');
    } finally {
      setSearching(false);
    }
  };

  // compress and optionally crop image to <= maxKb (approx) using canvas
  const compressImageFile = (file, maxKb = 100, crop = 'center') =>
    new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = () => {
          // Target final square size for consistent encuadre
          const targetSize = 600;

          // Compute scale to cover target (cover behavior)
          const scale = Math.max(targetSize / img.width, targetSize / img.height);
          const sw = Math.min(img.width, Math.round(targetSize / scale));
          const sh = Math.min(img.height, Math.round(targetSize / scale));

          // Compute source x,y according to crop choice
          let sx = Math.max(0, Math.floor((img.width - sw) / 2));
          let sy = Math.max(0, Math.floor((img.height - sh) / 2));

          if (crop === 'left') sx = 0;
          if (crop === 'right') sx = Math.max(0, img.width - sw);
          if (crop === 'top') sy = 0;
          if (crop === 'bottom') sy = Math.max(0, img.height - sh);

          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext('2d');

          // draw the selected crop area into the canvas
          try {
            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetSize, targetSize);
          } catch (err) {
            // Fallback: draw scaled full image
            const scaleFit = Math.min(1, 800 / img.width);
            canvas.width = img.width * scaleFit;
            canvas.height = img.height * scaleFit;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }

          let quality = 0.9;
          const attempt = () => {
            canvas.toBlob(
              (blob) => {
                if (!blob) return resolve(file);
                if (blob.size / 1024 <= maxKb || quality < 0.1) {
                  const newFile = new File([blob], file.name.replace(/\.(jpg|jpeg|png)$/i, '') + '.jpg', { type: 'image/jpeg' });
                  resolve(newFile);
                } else {
                  quality -= 0.1;
                  attempt();
                }
              },
              'image/jpeg',
              quality
            );
          };
          attempt();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#001558] mb-2">Datos Personales</h2>
        <p className="text-gray-600">Por favor completa tu información personal básica.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2 flex items-end gap-3">
          <div className="w-full">
            <Label htmlFor="rut">RUT *</Label>
            <Input
              id="rut"
              value={formatRutDisplay(rutInput)}
              onChange={(e) => handleRutChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearchByRut();
                }
              }}
              placeholder="Escribe solo números"
            />
          </div>
          <div className="mb-1">
            <button
              type="button"
              onClick={handleSearchByRut}
              className="inline-flex items-center px-3 py-2 bg-primary text-white rounded-md"
              disabled={searching}
              aria-label="Buscar por RUT"
            >
              <Search className="w-4 h-4 mr-2" />
              {searching ? 'BUSCANDO...' : 'BUSCAR'}
            </button>
          </div>
        </div>

        {!formData.searchedRut ? null : (
          <>
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
              <Label htmlFor="region">Región *</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => handleChange('region', e.target.value)}
                placeholder="Región"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provincia">Provincia *</Label>
              <Input
                id="provincia"
                value={formData.provincia}
                onChange={(e) => handleChange('provincia', e.target.value)}
                placeholder="Provincia"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comuna">Comuna *</Label>
              <Input
                id="comuna"
                value={formData.comuna}
                onChange={(e) => handleChange('comuna', e.target.value)}
                placeholder="Comuna"
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

            <div className="space-y-2">
              <Label htmlFor="profesion">Profesión u Oficio</Label>
              <Input
                id="profesion"
                value={formData.profesion}
                onChange={(e) => handleChange('profesion', e.target.value)}
                placeholder="Tu profesión u oficio"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fotoPerfil">Foto de Perfil</Label>
              <Input
                id="fotoPerfil"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // keep preview for crop/ajuste
                    setPreviewFile(file);
                  }
                }}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/5 file:text-[#001558] hover:file:bg-primary/10"
              />

              {previewFile && (
                <div className="mt-4">
                  <p className="text-sm text-[#001558] font-medium mb-2">Previsualización (ajusta y acepta):</p>
                  <div className="w-48 h-48 overflow-hidden bg-gray-100 mb-2">
                    <img
                      src={URL.createObjectURL(previewFile)}
                      alt="preview"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: fotoCrop === 'center' ? 'center' : fotoCrop }}
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm">Encadrar:</label>
                    <button type="button" onClick={() => setFotoCrop('center')} className={`px-2 py-1 border rounded ${fotoCrop==='center'?'bg-primary text-white':''}`}>Centro</button>
                    <button type="button" onClick={() => setFotoCrop('top')} className={`px-2 py-1 border rounded ${fotoCrop==='top'?'bg-primary text-white':''}`}>Arriba</button>
                    <button type="button" onClick={() => setFotoCrop('bottom')} className={`px-2 py-1 border rounded ${fotoCrop==='bottom'?'bg-primary text-white':''}`}>Abajo</button>
                    <button type="button" onClick={() => setFotoCrop('left')} className={`px-2 py-1 border rounded ${fotoCrop==='left'?'bg-primary text-white':''}`}>Izquierda</button>
                    <button type="button" onClick={() => setFotoCrop('right')} className={`px-2 py-1 border rounded ${fotoCrop==='right'?'bg-primary text-white':''}`}>Derecha</button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        const compressed = await compressImageFile(previewFile, 100, fotoCrop);
                        handleChange('fotoPerfil', compressed);
                        updateFormData({ fotoCrop });
                        setPreviewFile(null);
                      }}
                      className="px-3 py-2 bg-primary text-white rounded-md"
                    >
                      Aceptar Foto
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewFile(null)}
                      className="px-3 py-2 border rounded-md"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {formData.fotoPerfil && !previewFile && (
                <p className="text-sm text-gray-600">Archivo seleccionado: {formData.fotoPerfil.name}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Step1PersonalData;
