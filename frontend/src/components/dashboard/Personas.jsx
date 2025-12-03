import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, RefreshCw, AlertCircle, Users, UserCheck, UserX, PieChart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Modular components
import PersonaFilters from './PersonaFilters';
import PersonaTable from './PersonaTable';
import PersonaViewModal from './PersonaViewModal';
import PersonaFormModal from './PersonaFormModal';
import PersonaDeleteModal from './PersonaDeleteModal';

// Custom hook
import { usePersonas } from '@/hooks/usePersonas';

/**
 * Mini Chart - Donut/Pie style
 */
const DonutChart = ({ data, colors, size = 120 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;

  const createArc = (startAngle, endAngle, radius) => {
    const start = {
      x: 50 + radius * Math.cos((startAngle * Math.PI) / 180),
      y: 50 + radius * Math.sin((startAngle * Math.PI) / 180),
    };
    const end = {
      x: 50 + radius * Math.cos((endAngle * Math.PI) / 180),
      y: 50 + radius * Math.sin((endAngle * Math.PI) / 180),
    };
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {data.map((item, index) => {
        const angle = total > 0 ? (item.value / total) * 360 : 0;
        const path = createArc(currentAngle, currentAngle + angle - 0.5, 35);
        currentAngle += angle;
        return (
          <path
            key={index}
            d={path}
            fill="none"
            stroke={colors[index]}
            strokeWidth="12"
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        );
      })}
      <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="fill-white text-lg font-bold">
        {total}
      </text>
    </svg>
  );
};

/**
 * Stat Mini Card
 */
const StatMini = ({ icon: Icon, label, value, color, bgColor }) => (
  <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5">
    <div className={`p-2 rounded-lg ${bgColor}`}>
      <Icon className={`h-4 w-4 ${color}`} />
    </div>
    <div>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-xs text-white/50">{label}</p>
    </div>
  </div>
);

/**
 * Main Personas Component
 * Layout: Gráficos izquierda + Tabla paginada derecha
 */
const Personas = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const {
    personas,
    filteredPersonas,
    loading,
    error,
    stats,
    estadosCiviles,
    comunas,
    selectedPersona,
    showViewModal,
    showFormModal,
    showDeleteModal,
    isEditing,
    saving,
    formData,
    formErrors,
    filters,
    setFilters,
    setShowViewModal,
    setShowFormModal,
    setShowDeleteModal,
    handleInputChange,
    handleRutChange,
    handleView,
    handleCreate,
    handleEdit,
    handleSubmit,
    confirmDelete,
    handleToggleVigente,
    resetForm,
    loadPersonas,
  } = usePersonas();

  // Pagination
  const totalPages = Math.ceil(filteredPersonas.length / itemsPerPage);
  const paginatedPersonas = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPersonas.slice(start, start + itemsPerPage);
  }, [filteredPersonas, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Chart data
  const chartData = useMemo(() => ({
    vigencia: [
      { label: 'Vigentes', value: stats.vigentes || 0 },
      { label: 'Inactivos', value: stats.inactivos || 0 },
    ],
  }), [stats]);

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* LEFT PANEL - Charts & Stats */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-72 flex-shrink-0 space-y-4"
      >
        {/* Stats Overview */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
            Resumen
          </h3>
          <div className="space-y-3">
            <StatMini
              icon={Users}
              label="Total Personas"
              value={stats.total || 0}
              color="text-blue-400"
              bgColor="bg-blue-500/10"
            />
            <StatMini
              icon={UserCheck}
              label="Vigentes"
              value={stats.vigentes || 0}
              color="text-emerald-400"
              bgColor="bg-emerald-500/10"
            />
            <StatMini
              icon={UserX}
              label="Inactivos"
              value={stats.inactivos || 0}
              color="text-red-400"
              bgColor="bg-red-500/10"
            />
          </div>
        </div>

        {/* Chart - Vigencia */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
              Estado
            </h3>
          </div>
          <div className="flex justify-center">
            <DonutChart
              data={chartData.vigencia}
              colors={['#10b981', '#ef4444']}
              size={140}
            />
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-white/60">Vigentes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-white/60">Inactivos</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
              Filtros Activos
            </h3>
          </div>
          <div className="text-center py-3">
            <p className="text-3xl font-bold text-white">{filteredPersonas.length}</p>
            <p className="text-xs text-white/50 mt-1">
              de {personas.length} personas
            </p>
          </div>
          {filteredPersonas.length !== personas.length && (
            <button
              onClick={() => setFilters({ search: '', vigente: '' })}
              className="w-full mt-3 py-2 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </motion.div>

      {/* RIGHT PANEL - Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col overflow-hidden"
      >
        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p className="flex-1">{error}</p>
            <button onClick={loadPersonas} className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded transition-colors">
              Reintentar
            </button>
          </div>
        )}

        {/* Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Gestión de Personas</h2>
              <p className="text-white/50 text-xs mt-0.5">
                Mostrando {paginatedPersonas.length} de {filteredPersonas.length}
              </p>
            </div>
            <div>
              <Button
                onClick={handleCreate}
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar nueva persona
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <PersonaFilters filters={filters} setFilters={setFilters} compact />

        {/* Table */}
        <div className="flex-1 overflow-auto px-5 py-3">
          <PersonaTable
            personas={paginatedPersonas}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onToggleVigente={handleToggleVigente}
            compact
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between">
            <p className="text-xs text-white/50">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-2 py-1 text-xs text-white/60 hover:text-white hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ««
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs text-white/60 hover:text-white hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              
              {/* Page numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 text-xs rounded transition-colors ${
                        currentPage === pageNum
                          ? 'bg-emerald-500 text-white'
                          : 'text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-xs text-white/60 hover:text-white hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-xs text-white/60 hover:text-white hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                »»
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <PersonaViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        persona={selectedPersona}
      />

      <PersonaFormModal
        isOpen={showFormModal}
        onClose={resetForm}
        formData={formData}
        formErrors={formErrors}
        isEditing={isEditing}
        saving={saving}
        estadosCiviles={estadosCiviles}
        comunas={comunas}
        onInputChange={handleInputChange}
        onRutChange={handleRutChange}
        onSubmit={handleSubmit}
      />

      <PersonaDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        persona={selectedPersona}
        onConfirm={confirmDelete}
        saving={saving}
      />
    </div>
  );
};

export default Personas;
