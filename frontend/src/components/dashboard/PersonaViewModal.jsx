import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, Calendar, Heart, Briefcase } from 'lucide-react';

/**
 * Format RUT with verification digit
 */
const formatRut = (run, dv) => {
  if (!run) return '-';
  const formatted = run.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${dv || ''}`;
};

/**
 * Format date
 */
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '-';
  }
};

/**
 * Format phone number
 */
const formatPhone = (phone) => {
  if (!phone) return '-';
  const clean = phone.toString().replace(/\D/g, '');
  if (clean.startsWith('56')) {
    return `+${clean.slice(0, 2)} ${clean.slice(2, 3)} ${clean.slice(3, 7)} ${clean.slice(7)}`;
  }
  return `+56 ${clean}`;
};

/**
 * Detail Row Component
 */
const DetailRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3 py-2">
    {Icon && <Icon className="h-4 w-4 text-white/40 mt-0.5 flex-shrink-0" />}
    <div className="flex-1">
      <span className="text-white/50 text-sm">{label}:</span>
      <span className="text-white ml-2">{value || '-'}</span>
    </div>
  </div>
);

/**
 * Section Component
 */
const Section = ({ title, icon: Icon, children }) => (
  <div className="border-b border-white/10 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
    <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
      {Icon && <Icon className="h-5 w-5 text-emerald-400" />}
      {title}
    </h3>
    <div className="space-y-1">{children}</div>
  </div>
);

/**
 * Persona View Modal Component
 */
const PersonaViewModal = ({ isOpen, onClose, persona }) => {
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="relative w-full max-w-2xl bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
                    {persona.per_nombres?.charAt(0) || '?'}
                    {persona.per_apelpat?.charAt(0) || ''}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {persona.per_nombres} {persona.per_apelpat} {persona.per_apelmat || ''}
                    </h2>
                    <p className="text-white/50">
                      RUT: {formatRut(persona.per_run, persona.per_dv)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {/* Estado Badge */}
                <div className="mb-6 flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      persona.per_vigente
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {persona.per_vigente ? 'Vigente' : 'No Vigente'}
                  </span>
                  {persona.per_apodo && (
                    <span className="text-white/60">Apodo: "{persona.per_apodo}"</span>
                  )}
                </div>

                {/* Personal Information */}
                <Section title="Información Personal" icon={User}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <DetailRow label="Fecha de Nacimiento" value={formatDate(persona.per_fecha_nac)} icon={Calendar} />
                    <DetailRow label="Religión" value={persona.per_religion} />
                    <DetailRow label="Profesión" value={persona.per_profesion} icon={Briefcase} />
                    <DetailRow label="Nº MMA" value={persona.per_num_mmaa} />
                    <DetailRow label="Tiempo NNAJ" value={persona.per_tiempo_nnaj} />
                    <DetailRow label="Tiempo Adulto" value={persona.per_tiempo_adulto} />
                  </div>
                </Section>

                {/* Contact Information */}
                <Section title="Información de Contacto" icon={Phone}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <DetailRow label="Email" value={persona.per_email} icon={Mail} />
                    <DetailRow label="Teléfono" value={formatPhone(persona.per_fono)} icon={Phone} />
                    <DetailRow
                      label="Dirección"
                      value={persona.per_direccion}
                      icon={MapPin}
                    />
                  </div>
                </Section>

                {/* Emergency Contact */}
                <Section title="Contacto de Emergencia" icon={Phone}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <DetailRow label="Nombre" value={persona.per_nom_emergencia} />
                    <DetailRow label="Teléfono" value={formatPhone(persona.per_fono_emergencia)} />
                  </div>
                </Section>

                {/* Health Information */}
                <Section title="Salud" icon={Heart}>
                  <DetailRow label="Alergias/Enfermedades" value={persona.per_alergia_enfermedad} />
                  <DetailRow label="Limitaciones" value={persona.per_limitacion} />
                </Section>

                {/* Other Information */}
                {persona.per_otros && (
                  <Section title="Otros">
                    <p className="text-white/80">{persona.per_otros}</p>
                  </Section>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 flex justify-end flex-shrink-0">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PersonaViewModal;
