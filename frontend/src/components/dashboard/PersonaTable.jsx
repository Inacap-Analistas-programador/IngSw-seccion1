import React, { useState } from 'react';
import { Eye, Edit2, UserX, UserCheck, MoreHorizontal, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Format RUT with verification digit
 */
const formatRut = (run, dv) => {
  if (!run) return '-';
  const formatted = run.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${dv || ''}`;
};

/**
 * Action Dropdown Component
 */
const ActionDropdown = ({ persona, onView, onEdit, onToggleVigente }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 hover:bg-white/10 rounded-lg transition-all text-white/50 hover:text-white"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              className="absolute right-0 top-full mt-1 w-40 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <button
                onClick={() => { onView(persona); setIsOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Eye className="h-3.5 w-3.5 text-blue-400" />
                Ver Detalles
              </button>
              <button
                onClick={() => { onEdit(persona); setIsOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5 text-amber-400" />
                Editar
              </button>
              <div className="border-t border-white/10" />
              <button
                onClick={() => { onToggleVigente(persona); setIsOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors ${
                  persona.per_vigente 
                    ? 'text-red-400 hover:bg-red-500/10' 
                    : 'text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                {persona.per_vigente ? (
                  <>
                    <UserX className="h-3.5 w-3.5" />
                    Desactivar
                  </>
                ) : (
                  <>
                    <UserCheck className="h-3.5 w-3.5" />
                    Reactivar
                  </>
                )}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Persona Table Component - Compact Table Style
 */
const PersonaTable = ({ personas, onView, onEdit, onToggleVigente, loading, compact }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="relative">
          <div className="h-10 w-10 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        </div>
        <p className="text-white/50 text-sm">Cargando...</p>
      </div>
    );
  }

  if (personas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="h-16 w-16 rounded-xl bg-white/5 flex items-center justify-center">
          <Users className="h-8 w-8 text-white/20" />
        </div>
        <div className="text-center">
          <p className="text-white/60 font-medium">Sin resultados</p>
          <p className="text-white/40 text-xs mt-1">No se encontraron personas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-3 text-xs font-medium text-white/50 uppercase tracking-wider">Persona</th>
            <th className="text-left py-3 px-3 text-xs font-medium text-white/50 uppercase tracking-wider">RUT</th>
            <th className="text-left py-3 px-3 text-xs font-medium text-white/50 uppercase tracking-wider hidden md:table-cell">Email</th>
            <th className="text-left py-3 px-3 text-xs font-medium text-white/50 uppercase tracking-wider hidden lg:table-cell">Teléfono</th>
            <th className="text-center py-3 px-3 text-xs font-medium text-white/50 uppercase tracking-wider">Estado</th>
            <th className="text-right py-3 px-3 text-xs font-medium text-white/50 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {personas.map((persona, index) => (
            <motion.tr
              key={persona.per_id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.02 }}
              className="group hover:bg-white/[0.02] transition-colors"
            >
              {/* Persona */}
              <td className="py-3 px-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-medium text-xs flex-shrink-0">
                    {persona.per_nombres?.charAt(0)?.toUpperCase() || '?'}
                    {persona.per_apelpat?.charAt(0)?.toUpperCase() || ''}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {persona.per_nombres} {persona.per_apelpat}
                    </p>
                    {persona.per_apodo && (
                      <p className="text-xs text-white/40 truncate">"{persona.per_apodo}"</p>
                    )}
                  </div>
                </div>
              </td>

              {/* RUT */}
              <td className="py-3 px-3">
                <span className="text-sm text-white/70 font-mono">
                  {formatRut(persona.per_run, persona.per_dv)}
                </span>
              </td>

              {/* Email */}
              <td className="py-3 px-3 hidden md:table-cell">
                <span className="text-sm text-white/60 truncate block max-w-[180px]">
                  {persona.per_email || '-'}
                </span>
              </td>

              {/* Teléfono */}
              <td className="py-3 px-3 hidden lg:table-cell">
                <span className="text-sm text-white/60">
                  {persona.per_fono || '-'}
                </span>
              </td>

              {/* Estado */}
              <td className="py-3 px-3 text-center">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  persona.per_vigente
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${persona.per_vigente ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  {persona.per_vigente ? 'Activo' : 'Inactivo'}
                </span>
              </td>

              {/* Acciones */}
              <td className="py-3 px-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onView(persona)}
                    className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-colors text-white/40 hover:text-blue-400 opacity-0 group-hover:opacity-100"
                    title="Ver"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(persona)}
                    className="p-1.5 hover:bg-amber-500/20 rounded-lg transition-colors text-white/40 hover:text-amber-400 opacity-0 group-hover:opacity-100"
                    title="Editar"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <ActionDropdown
                    persona={persona}
                    onView={onView}
                    onEdit={onEdit}
                    onToggleVigente={onToggleVigente}
                  />
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PersonaTable;
