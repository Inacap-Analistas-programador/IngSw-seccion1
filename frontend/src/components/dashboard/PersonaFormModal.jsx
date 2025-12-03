import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, User, Phone, Briefcase, Heart, AlertCircle } from 'lucide-react';

/**
 * Tab Button Component
 */
const TabButton = ({ active, icon: Icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
      active
        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        : 'text-white/60 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon className="h-4 w-4" />
    {label}
  </button>
);

/**
 * Persona Form Modal Component
 * Modal con pestañas para organizar secciones
 */
const PersonaFormModal = ({
  isOpen,
  onClose,
  formData,
  formErrors,
  isEditing,
  saving,
  estadosCiviles,
  comunas,
  onInputChange,
  onRutChange,
  onSubmit,
}) => {
  const [activeTab, setActiveTab] = useState('personal');

  const inputClass = "w-full px-3 py-2 !bg-slate-800 border border-white/10 rounded-lg !text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm";
  const selectClass = "w-full px-3 py-2 !bg-slate-800 border border-white/10 rounded-lg !text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm appearance-none";
  const labelClass = "block text-xs font-medium text-white/70 mb-1";
  const errorClass = "text-red-400 text-xs mt-0.5";
  const textareaClass = "w-full px-3 py-2 !bg-slate-800 border border-white/10 rounded-lg !text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none text-sm";

  const estadoCivilOptions = estadosCiviles.map((ec) => ({
    value: ec.esc_id,
    label: ec.esc_descripcion,
  }));

  const comunaOptions = comunas.map((c) => ({
    value: c.com_id,
    label: c.com_descripcion,
  }));

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'contacto', label: 'Contacto', icon: Phone },
    { id: 'profesional', label: 'Profesional', icon: Briefcase },
    { id: 'salud', label: 'Salud', icon: Heart },
  ];

  // Check if tab has errors
  const getTabErrors = (tabId) => {
    const tabFields = {
      personal: ['per_nombres', 'per_apelpat', 'per_run', 'per_fecha_nac', 'esc_id', 'per_apodo'],
      contacto: ['per_email', 'per_fono', 'com_id', 'per_direccion'],
      profesional: [],
      salud: [],
    };
    return tabFields[tabId]?.some(field => formErrors[field]);
  };

  if (!isOpen) return null;

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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-2xl bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <User className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">
                    {isEditing ? 'Editar Persona' : 'Nueva Persona'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 px-6 py-3 border-b border-white/10 overflow-x-auto">
                {tabs.map((tab) => (
                  <div key={tab.id} className="relative">
                    <TabButton
                      active={activeTab === tab.id}
                      icon={tab.icon}
                      label={tab.label}
                      onClick={() => setActiveTab(tab.id)}
                    />
                    {getTabErrors(tab.id) && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900" />
                    )}
                  </div>
                ))}
              </div>

              {/* Form Content */}
              <form onSubmit={onSubmit}>
                <div className="p-6 min-h-[320px]">
                  {/* Tab: Personal */}
                  {activeTab === 'personal' && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <label className={labelClass}>Nombres *</label>
                        <input
                          type="text"
                          placeholder="Ingrese nombres"
                          value={formData.per_nombres || ''}
                          onChange={(e) => onInputChange('per_nombres', e.target.value)}
                          className={`${inputClass} ${formErrors.per_nombres ? 'border-red-500/50' : ''}`}
                        />
                        {formErrors.per_nombres && <p className={errorClass}>{formErrors.per_nombres}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>Apellido Paterno *</label>
                        <input
                          type="text"
                          placeholder="Apellido paterno"
                          value={formData.per_apelpat || ''}
                          onChange={(e) => onInputChange('per_apelpat', e.target.value)}
                          className={`${inputClass} ${formErrors.per_apelpat ? 'border-red-500/50' : ''}`}
                        />
                        {formErrors.per_apelpat && <p className={errorClass}>{formErrors.per_apelpat}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>Apellido Materno</label>
                        <input
                          type="text"
                          placeholder="Apellido materno"
                          value={formData.per_apelmat || ''}
                          onChange={(e) => onInputChange('per_apelmat', e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>RUT *</label>
                        <div className="flex gap-1">
                          <input
                            type="text"
                            placeholder="12345678"
                            value={formData.per_run || ''}
                            onChange={(e) => onRutChange(e.target.value.replace(/\D/g, ''))}
                            className={`flex-1 ${inputClass} ${formErrors.per_run ? 'border-red-500/50' : ''}`}
                          />
                          <span className="flex items-center text-white/50 text-sm">-</span>
                          <input
                            type="text"
                            value={formData.per_dv || ''}
                            readOnly
                            className={`w-10 text-center ${inputClass}`}
                          />
                        </div>
                        {formErrors.per_run && <p className={errorClass}>{formErrors.per_run}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>Fecha Nacimiento *</label>
                        <input
                          type="date"
                          value={formData.per_fecha_nac || ''}
                          onChange={(e) => onInputChange('per_fecha_nac', e.target.value)}
                          className={`${inputClass} ${formErrors.per_fecha_nac ? 'border-red-500/50' : ''}`}
                        />
                        {formErrors.per_fecha_nac && <p className={errorClass}>{formErrors.per_fecha_nac}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>Estado Civil *</label>
                        <select
                          value={formData.esc_id || ''}
                          onChange={(e) => onInputChange('esc_id', e.target.value)}
                          className={`${selectClass} ${formErrors.esc_id ? 'border-red-500/50' : ''}`}
                        >
                          <option value="" className="bg-slate-800 text-white">Seleccione...</option>
                          {estadoCivilOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-slate-800 text-white">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {formErrors.esc_id && <p className={errorClass}>{formErrors.esc_id}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>Apodo *</label>
                        <input
                          type="text"
                          placeholder="Ingrese apodo"
                          value={formData.per_apodo || ''}
                          onChange={(e) => onInputChange('per_apodo', e.target.value)}
                          className={`${inputClass} ${formErrors.per_apodo ? 'border-red-500/50' : ''}`}
                        />
                        {formErrors.per_apodo && <p className={errorClass}>{formErrors.per_apodo}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>Religión</label>
                        <input
                          type="text"
                          placeholder="Religión"
                          value={formData.per_religion || ''}
                          onChange={(e) => onInputChange('per_religion', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Contacto */}
                  {activeTab === 'contacto' && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <label className={labelClass}>Email *</label>
                        <input
                          type="email"
                          placeholder="correo@ejemplo.com"
                          value={formData.per_email || ''}
                          onChange={(e) => onInputChange('per_email', e.target.value)}
                          className={`${inputClass} ${formErrors.per_email ? 'border-red-500/50' : ''}`}
                        />
                        {formErrors.per_email && <p className={errorClass}>{formErrors.per_email}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>Teléfono *</label>
                        <input
                          type="text"
                          placeholder="912345678"
                          value={formData.per_fono || ''}
                          onChange={(e) => onInputChange('per_fono', e.target.value)}
                          className={`${inputClass} ${formErrors.per_fono ? 'border-red-500/50' : ''}`}
                        />
                        {formErrors.per_fono && <p className={errorClass}>{formErrors.per_fono}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>Comuna *</label>
                        <select
                          value={formData.com_id || ''}
                          onChange={(e) => onInputChange('com_id', e.target.value)}
                          className={`${selectClass} ${formErrors.com_id ? 'border-red-500/50' : ''}`}
                        >
                          <option value="" className="bg-slate-800 text-white">Seleccione...</option>
                          {comunaOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-slate-800 text-white">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {formErrors.com_id && <p className={errorClass}>{formErrors.com_id}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>Dirección *</label>
                        <input
                          type="text"
                          placeholder="Dirección completa"
                          value={formData.per_direccion || ''}
                          onChange={(e) => onInputChange('per_direccion', e.target.value)}
                          className={`${inputClass} ${formErrors.per_direccion ? 'border-red-500/50' : ''}`}
                        />
                        {formErrors.per_direccion && <p className={errorClass}>{formErrors.per_direccion}</p>}
                      </div>

                      <div>
                        <label className={labelClass}>Contacto Emergencia</label>
                        <input
                          type="text"
                          placeholder="Nombre contacto"
                          value={formData.per_nom_emergencia || ''}
                          onChange={(e) => onInputChange('per_nom_emergencia', e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Tel. Emergencia</label>
                        <input
                          type="text"
                          placeholder="912345678"
                          value={formData.per_fono_emergencia || ''}
                          onChange={(e) => onInputChange('per_fono_emergencia', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Profesional */}
                  {activeTab === 'profesional' && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <label className={labelClass}>Profesión</label>
                        <input
                          type="text"
                          placeholder="Profesión"
                          value={formData.per_profesion || ''}
                          onChange={(e) => onInputChange('per_profesion', e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Nº MMA</label>
                        <input
                          type="number"
                          placeholder="Número"
                          value={formData.per_num_mmaa || ''}
                          onChange={(e) => onInputChange('per_num_mmaa', e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Tiempo NNAJ</label>
                        <input
                          type="text"
                          placeholder="Ej: 5 años"
                          value={formData.per_tiempo_nnaj || ''}
                          onChange={(e) => onInputChange('per_tiempo_nnaj', e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Tiempo Adulto</label>
                        <input
                          type="text"
                          placeholder="Ej: 3 años"
                          value={formData.per_tiempo_adulto || ''}
                          onChange={(e) => onInputChange('per_tiempo_adulto', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Salud */}
                  {activeTab === 'salud' && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className={labelClass}>Alergias / Enfermedades</label>
                        <textarea
                          placeholder="Describa alergias o enfermedades"
                          value={formData.per_alergia_enfermedad || ''}
                          onChange={(e) => onInputChange('per_alergia_enfermedad', e.target.value)}
                          rows={3}
                          className={textareaClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Limitaciones</label>
                        <textarea
                          placeholder="Limitaciones físicas u otras"
                          value={formData.per_limitacion || ''}
                          onChange={(e) => onInputChange('per_limitacion', e.target.value)}
                          rows={3}
                          className={textareaClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Observaciones</label>
                        <textarea
                          placeholder="Información adicional"
                          value={formData.per_otros || ''}
                          onChange={(e) => onInputChange('per_otros', e.target.value)}
                          rows={3}
                          className={textareaClass}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.per_vigente ?? true}
                        onChange={(e) => onInputChange('per_vigente', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-700 rounded-full peer peer-checked:bg-emerald-500 transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </div>
                    <span className="text-sm text-white/70">Vigente</span>
                  </label>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all text-sm font-medium shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          {isEditing ? 'Actualizar' : 'Guardar'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PersonaFormModal;
