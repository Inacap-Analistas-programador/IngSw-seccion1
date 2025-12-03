import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2, Loader2 } from 'lucide-react';

/**
 * Format RUT with verification digit
 */
const formatRut = (run, dv) => {
  if (!run) return '-';
  const formatted = run.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${dv || ''}`;
};

/**
 * Persona Delete Confirmation Modal Component
 */
const PersonaDeleteModal = ({ isOpen, onClose, persona, onConfirm, saving }) => {
  if (!persona) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Confirmar Eliminación</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-white/80 mb-4">
                  ¿Está seguro que desea eliminar a la siguiente persona?
                </p>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-bold">
                      {persona.per_nombres?.charAt(0) || '?'}
                      {persona.per_apelpat?.charAt(0) || ''}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {persona.per_nombres} {persona.per_apelpat} {persona.per_apelmat || ''}
                      </p>
                      <p className="text-white/50 text-sm">
                        RUT: {formatRut(persona.per_run, persona.per_dv)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-400 text-sm">
                    <strong>Advertencia:</strong> Esta acción no se puede deshacer. Se eliminarán
                    todos los datos asociados a esta persona.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirm}
                  disabled={saving}
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PersonaDeleteModal;
