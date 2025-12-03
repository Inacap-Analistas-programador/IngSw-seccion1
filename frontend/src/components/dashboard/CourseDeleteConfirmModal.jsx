import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * Course Delete Confirmation Modal
 * Simple dark-themed confirmation dialog
 */
const CourseDeleteConfirmModal = ({ isOpen, course, onConfirm, onCancel }) => {
    if (!isOpen || !course) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl max-w-md w-full">
                <div className="p-6">
                    {/* Icon */}
                    <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-rose-500/10 rounded-full border border-rose-500/20">
                            <AlertCircle className="h-8 w-8 text-rose-400" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-white mb-2">¿Eliminar curso?</h3>
                        <p className="text-white/60 text-sm">
                            Estás a punto de eliminar el curso <span className="font-semibold text-white">"{course.codigo}"</span>.
                            Esta acción no se puede deshacer.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            onClick={onCancel}
                            variant="outline"
                            className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={onConfirm}
                            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                        >
                            Eliminar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDeleteConfirmModal;
