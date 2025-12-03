import React from 'react';
import { X, Calendar, MapPin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import CascadingGeographySelector from './CascadingGeographySelector';
import CourseTypeSelector from './CourseTypeSelector';
import CourseModalitySelector from './CourseModalitySelector';

const CourseCreateModal = ({
  isOpen,
  onClose,
  courseData,
  handleInputChange,
  handleCreateCourse
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-white/10 sticky top-0 bg-slate-900/95 z-10">
          <h2 className="text-2xl font-bold text-white">Crear Nuevo Curso</h2>
          <Button onClick={onClose} variant="ghost" className="p-2 text-white/60 hover:text-white">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-400" />
              Información Básica
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo" className="text-white/80">Código *</Label>
                <Input
                  id="codigo"
                  value={courseData.codigo}
                  onChange={(e) => handleInputChange('codigo', e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="CUR-001"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="descripcion" className="text-white/80">Descripción</Label>
                <Input
                  id="descripcion"
                  value={courseData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-purple-400" />
              Ubicación
            </h3>
            <CascadingGeographySelector
              onLocationChange={(location) => {
                handleInputChange('regionId', location.regionId);
                handleInputChange('provinciaId', location.provinciaId);
                handleInputChange('comunaId', location.comunaId);
              }}
            />
          </div>

          {/* Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Settings className="h-5 w-5 mr-2 text-emerald-400" />
              Configuración
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <CourseTypeSelector
                value={courseData.tipoCurso}
                onChange={(value) => handleInputChange('tipoCurso', value)}
              />
              <CourseModalitySelector
                value={courseData.modalidad}
                onChange={(value) => handleInputChange('modalidad', value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
            <Button onClick={onClose} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              Cancelar
            </Button>
            <Button onClick={handleCreateCourse} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Crear Curso
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCreateModal;
