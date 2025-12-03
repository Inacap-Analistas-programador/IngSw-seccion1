import React from 'react';
import { Search, X, UserCheck, UserX, Users } from 'lucide-react';

/**
 * Persona Filters Component - Compact Style
 */
const PersonaFilters = ({ filters, setFilters, compact }) => {
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="px-5 py-3 border-b border-white/5 flex flex-wrap items-center gap-3">
      {/* Search Input */}
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input
          type="text"
          placeholder="Buscar nombre, RUT, email..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full pl-9 pr-8 py-2 !bg-slate-800 border border-white/10 rounded-lg !text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-sm"
        />
        {filters.search && (
          <button
            onClick={() => handleFilterChange('search', '')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Status Quick Filters */}
      <div className="flex items-center gap-1 bg-white/[0.02] rounded-lg p-1 border border-white/5">
        <button
          onClick={() => handleFilterChange('vigente', '')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            !filters.vigente
              ? 'bg-white/10 text-white'
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          Todos
        </button>
        <button
          onClick={() => handleFilterChange('vigente', 'true')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            filters.vigente === 'true'
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'text-white/50 hover:text-emerald-400 hover:bg-emerald-500/10'
          }`}
        >
          <UserCheck className="h-3.5 w-3.5" />
          Activos
        </button>
        <button
          onClick={() => handleFilterChange('vigente', 'false')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            filters.vigente === 'false'
              ? 'bg-red-500/20 text-red-400'
              : 'text-white/50 hover:text-red-400 hover:bg-red-500/10'
          }`}
        >
          <UserX className="h-3.5 w-3.5" />
          Inactivos
        </button>
      </div>
    </div>
  );
};

export default PersonaFilters;
