import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const CourseEditModal = ({
  isOpen,
  onClose,
  selectedCourse,
  handleUpdateCourse
}) => {
  if (!isOpen || !selectedCourse) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-white/10 sticky top-0 bg-slate-900/95 z-10">
          <h2 className="text-2xl font-bold text-white">Editar Curso</h2>
          <Button onClick={onClose} variant="ghost" className="p-2 text-white/60 hover:text-white">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-6">
          <p className="text-white/60">Modal de edición - Implementación pendiente</p>
          <div className="flex justify-end mt-6">
            <Button onClick={handleUpdateCourse} className="bg-blue-500 hover:bg-blue-600 text-white">
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEditModal;
