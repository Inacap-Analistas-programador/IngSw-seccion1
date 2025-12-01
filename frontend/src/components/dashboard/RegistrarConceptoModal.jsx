import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, AlertCircle } from 'lucide-react';
import api from '../../config/api';

const RegistrarConceptoModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
    const [formData, setFormData] = useState({
        coc_descripcion: '',
        coc_vigente: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    coc_descripcion: initialData.coc_descripcion || '',
                    coc_vigente: initialData.coc_vigente !== undefined ? initialData.coc_vigente : true
                });
            } else {
                setFormData({
                    coc_descripcion: '',
                    coc_vigente: true
                });
            }
            setError(null);
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.coc_descripcion.trim()) {
                throw new Error('La descripción es obligatoria');
            }

            if (initialData) {
                await api.put(`/maestros/conceptos-contables/${initialData.coc_id}/`, formData);
            } else {
                await api.post('/maestros/conceptos-contables/', formData);
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error saving concepto:', err);
            setError(err.response?.data?.detail || err.message || 'Error al guardar el concepto');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#1a1f37] w-full max-w-md rounded-2xl border border-white/10 shadow-xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold text-white">
                            {initialData ? 'Editar Concepto' : 'Nuevo Concepto Contable'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                                <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
                                <p className="text-sm text-red-200">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60">
                                Descripción <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.coc_descripcion}
                                onChange={(e) => setFormData({ ...formData, coc_descripcion: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-colors"
                                placeholder="Ej: Cuota Mensual"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="coc_vigente"
                                checked={formData.coc_vigente}
                                onChange={(e) => setFormData({ ...formData, coc_vigente: e.target.checked })}
                                className="w-5 h-5 rounded border-white/10 bg-white/5 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0"
                            />
                            <label htmlFor="coc_vigente" className="text-sm font-medium text-white/80 cursor-pointer select-none">
                                Concepto Vigente
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Guardar
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default RegistrarConceptoModal;
