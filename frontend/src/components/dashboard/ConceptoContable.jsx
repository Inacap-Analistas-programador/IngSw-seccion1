import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Search, Filter, ArrowUpRight, ArrowDownRight, Edit, Trash2 } from 'lucide-react';

const ConceptoContable = () => {
    // Mock data
    const conceptos = [
        { id: 1, codigo: 'ING-001', nombre: 'Cuota Mensual', tipo: 'Ingreso', categoria: 'Operacional' },
        { id: 2, codigo: 'EGR-001', nombre: 'Compra Materiales', tipo: 'Egreso', categoria: 'Logística' },
        { id: 3, codigo: 'ING-002', nombre: 'Donación', tipo: 'Ingreso', categoria: 'Extraordinario' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 bg-white/5 p-3 rounded-2xl backdrop-blur-xl border border-white/10">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar concepto..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500/50 transition-colors"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white transition-colors">
                    <Filter size={16} />
                    <span>Filtrar</span>
                </button>
            </div>

            {/* Table */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-white/60 text-xs uppercase tracking-wider">
                                <th className="p-4 font-medium">Código</th>
                                <th className="p-4 font-medium">Nombre</th>
                                <th className="p-4 font-medium">Tipo</th>
                                <th className="p-4 font-medium">Categoría</th>
                                <th className="p-4 font-medium text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {conceptos.map((concepto) => (
                                <tr key={concepto.id} className="text-white/80 hover:bg-white/5 transition-colors text-sm">
                                    <td className="p-4 font-medium text-white">{concepto.codigo}</td>
                                    <td className="p-4">{concepto.nombre}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${concepto.tipo === 'Ingreso'
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}>
                                            {concepto.tipo === 'Ingreso' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                            {concepto.tipo}
                                        </span>
                                    </td>
                                    <td className="p-4">{concepto.categoria}</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-emerald-400 transition-colors" title="Editar">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-red-400 transition-colors" title="Eliminar">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default ConceptoContable;
