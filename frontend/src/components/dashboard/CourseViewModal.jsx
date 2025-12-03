import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const CourseViewModal = ({
  isOpen,
  onClose,
  selectedCourse
}) => {
  if (!isOpen || !selectedCourse) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Detalles del Curso</h2>
          <Button onClick={onClose} variant="ghost" className="p-2 text-white/60 hover:text-white">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-white/60 text-sm">Código</p>
              <p className="text-white font-semibold">{selectedCourse.codigo}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Descripción</p>
              <p className="text-white">{selectedCourse.descripcion}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewModal;
