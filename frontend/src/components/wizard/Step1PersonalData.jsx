import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import personasService from '@/services/personasService';
import { Loader2, Search } from 'lucide-react';

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
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => updateFormData({ [field]: value });

  const handleRutChange = (value) => {
    const digits = stripRutDigits(value);
    const maxDigits = digits.slice(0, 9);

    setRutInput(maxDigits);
    updateFormData({ rut: maxDigits });
  };

  const handleSearchByRut = async () => {
    const rutDigits = stripRutDigits(rutInput);
    if (!rutDigits) return; // Silent return if empty, or maybe alert? User wants "lupa" to trigger.

    setSearching(true);
    try {
      const resp = await personasService.searchByRut(rutDigits);

      // Normalize different API shapes
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
        results = [resp];
      }

      if (Array.isArray(results) && results.length > 0) {
        const p = results[0];
        updateFormData({
          searchedRut: true,
          personaFound: true,
          nombres: p.per_nombres || '',
          apellidoPaterno: p.per_apelpat || '',
          apellidoMaterno: p.per_apelmat || '',
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
        // Optional: toast or small alert saying "Person not found, please fill details"
      }
    } catch (err) {
      console.error('Error buscando RUT:', err);
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


      <div className="grid md:grid-cols-4 gap-3">
        <div className="space-y-1 md:col-span-2 flex items-end gap-2">
          <div className="w-full relative">
            <Label htmlFor="rut" className="text-xs text-gray-400">RUT *</Label>
            <div className="relative">
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
                placeholder="12345678-9"
                className="h-7 bg-white text-black border-gray-300 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 pr-8"
              />
              <button
                type="button"
                onClick={handleSearchByRut}
                disabled={searching}
                className="absolute right-0 top-0 h-full px-2 text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50"
                aria-label="Buscar RUT"
              >
                {searching ? (
                  <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                ) : (
                  <Search className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        </div>


        <>
          <div className="space-y-1">
            <Label htmlFor="nombres" className="text-xs text-gray-400">Nombres *</Label>
            <Input
              id="nombres"
              value={formData.nombres}
              onChange={(e) => handleChange('nombres', e.target.value)}
              placeholder="Juan Andrés"
              className="h-7 bg-white text-black border-gray-300 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="apellidoPaterno" className="text-xs text-gray-400">Apellido Paterno *</Label>
            <Input
              id="apellidoPaterno"
              value={formData.apellidoPaterno}
              onChange={(e) => handleChange('apellidoPaterno', e.target.value)}
              placeholder="Pérez"
              className="h-7 bg-white text-black border-gray-300 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="apellidoMaterno" className="text-xs text-gray-400">Apellido Materno *</Label>
            <Input
              id="apellidoMaterno"
              value={formData.apellidoMaterno}
              onChange={(e) => handleChange('apellidoMaterno', e.target.value)}
              placeholder="González"
              className="h-7 bg-white text-black border-gray-300 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="fechaNacimiento" className="text-xs text-gray-400">Fecha de Nacimiento *</Label>
            <Input
              id="fechaNacimiento"
              type="date"
              value={formData.fechaNacimiento}
              onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
              className="h-7 bg-white text-black border-gray-300 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="correo" className="text-xs text-gray-400">Correo Electrónico *</Label>
            <Input
              id="correo"
              type="email"
              value={formData.correo}
              onChange={(e) => handleChange('correo', e.target.value)}
              placeholder="correo@ejemplo.cl"
              className="h-7 bg-white text-black border-gray-300 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="provincia" className="text-xs text-gray-400">Provincia</Label>
            <Input
              id="provincia"
              value={formData.provincia}
              onChange={(e) => handleChange('provincia', e.target.value)}
              placeholder="Provincia"
              className="h-7 bg-white text-black border-gray-300 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="comuna" className="text-xs text-gray-400">Comuna *</Label>
            <Input
              id="comuna"
              value={formData.comuna}
              onChange={(e) => handleChange('comuna', e.target.value)}
              placeholder="Comuna"
              className="h-7 bg-white text-black border-gray-300 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="direccion" className="text-xs text-gray-400">Dirección *</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              placeholder="Calle Principal 123"
              className="h-7 bg-white text-black border-gray-300 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="tipoTelefono" className="text-xs text-gray-400">Tipo de Teléfono *</Label>
            <select
              id="tipoTelefono"
              value={formData.tipoTelefono}
              onChange={(e) => handleChange('tipoTelefono', e.target.value)}
              className="flex h-7 w-full rounded-lg border border-gray-300 bg-white text-black px-2 py-0 text-xs focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none"
            >
              <option value="">Seleccionar tipo</option>
              <option value="movil" className="bg-slate-800">Móvil</option>
              <option value="fijo" className="bg-slate-800">Fijo</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="telefono" className="text-xs text-gray-400">Teléfono *</Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              placeholder="+56 9 1234 5678"
              className="h-7 bg-white text-black border-gray-300 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="profesion" className="text-xs text-gray-400">Profesión u Oficio</Label>
            <Input
              id="profesion"
              value={formData.profesion}
              onChange={(e) => handleChange('profesion', e.target.value)}
              placeholder="Tu profesión u oficio"
              className="h-7 bg-white text-black border-gray-300 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label className="text-xs text-gray-400">Foto de Perfil</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors shadow-lg shadow-blue-500/20"
                >
                  Subir Foto
                </button>
                <input
                  ref={fileInputRef}
                  id="fotoPerfil"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPreviewFile(file);
                    }
                  }}
                  className="hidden"
                />
                {formData.fotoPerfil && !previewFile && (
                  <span className="text-sm text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Foto cargada
                  </span>
                )}
              </div>

              {previewFile && (
                <div className="mt-2 p-4 bg-white/5 rounded-xl border border-white/10 w-full max-w-md">
                  <p className="text-sm text-gray-300 font-medium mb-2">Previsualización (ajusta y acepta):</p>
                  <div className="w-48 h-48 overflow-hidden bg-slate-900 rounded-lg mb-3 mx-auto border border-white/10">
                    <img
                      src={URL.createObjectURL(previewFile)}
                      alt="preview"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: fotoCrop === 'center' ? 'center' : fotoCrop }}
                    />
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 mb-3">
                    {['center', 'top', 'bottom', 'left', 'right'].map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setFotoCrop(pos)}
                        className={`px-2 py-1 text-xs border rounded transition-colors ${fotoCrop === pos
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-white/10 text-gray-400 hover:bg-white/5'
                          }`}
                      >
                        {pos === 'center' ? 'Centro' : pos === 'top' ? 'Arriba' : pos === 'bottom' ? 'Abajo' : pos === 'left' ? 'Izq' : 'Der'}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        const compressed = await compressImageFile(previewFile, 100, fotoCrop);
                        handleChange('fotoPerfil', compressed);
                        updateFormData({ fotoCrop });
                        setPreviewFile(null);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Aceptar Foto
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewFile(null)}
                      className="px-3 py-1.5 border border-white/10 hover:bg-white/5 text-gray-300 rounded-lg text-xs font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>

      </div>
    </div>
  );
};

export default Step1PersonalData;
