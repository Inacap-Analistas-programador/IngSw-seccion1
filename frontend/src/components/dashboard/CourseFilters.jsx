import React from 'react';
import { Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';

/**
 * Course Filters Component
 * Dark glassmorphism filters section
 */
const CourseFilters = ({ filters, setFilters }) => {
    const handleClearFilters = () => {
        setFilters({ search: '', estado: '', modalidad: '', tipoCurso: '' });
    };

    const hasActiveFilters = filters.search || filters.estado || filters.modalidad || filters.tipoCurso;

    return (
        <div className="p-6 border-b border-white/10 bg-white/5">
            <details className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-white/60" />
                        <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">Filtros</span>
                    </div>
                    <span className="text-white/40 group-open:rotate-180 transition-transform">▼</span>
                </summary>

                <div className="grid md:grid-cols-4 gap-4 mt-4">
                    {/* Search */}
                    <div className="space-y-2">
                        <Label htmlFor="search" className="text-white/60 text-xs">Buscar</Label>
                        <Input
                            id="search"
                            placeholder="CÓDIGO, DESCRIPCIÓN, LUGAR..."
                            value={filters.search}
                            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        />
                    </div>

                    {/* Estado */}
                    <div className="space-y-2">
                        <Label htmlFor="filter-estado" className="text-white/60 text-xs">Estado</Label>
                        <select
                            id="filter-estado"
                            value={filters.estado}
                            onChange={(e) => setFilters((prev) => ({ ...prev, estado: e.target.value }))}
                            className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                        >
                            <option value="">Todos</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="1">Activo</option>
                            <option value="2">Inactivo</option>
                            <option value="3">En Proceso</option>
                            <option value="4">Finalizado</option>
                            <option value="5">Cancelado</option>
                        </select>
                    </div>

                    {/* Modalidad */}
                    <div className="space-y-2">
                        <Label htmlFor="filter-modalidad" className="text-white/60 text-xs">Modalidad</Label>
                        <select
                            id="filter-modalidad"
                            value={filters.modalidad}
                            onChange={(e) => setFilters((prev) => ({ ...prev, modalidad: e.target.value }))}
                            className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                        >
                            <option value="">Todas</option>
                            <option value="1">Presencial</option>
                            <option value="2">Online</option>
                            <option value="3">Híbrida</option>
                        </select>
                    </div>

                    {/* Tipo de Curso */}
                    <div className="space-y-2">
                        <Label htmlFor="filter-tipoCurso" className="text-white/60 text-xs">Tipo de Curso</Label>
                        <select
                            id="filter-tipoCurso"
                            value={filters.tipoCurso}
                            onChange={(e) => setFilters((prev) => ({ ...prev, tipoCurso: e.target.value }))}
                            className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                        >
                            <option value="">Todos</option>
                            <option value="1">Presencial</option>
                            <option value="2">Online</option>
                            <option value="3">Híbrido</option>
                        </select>
                    </div>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <div className="mt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClearFilters}
                            className="bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                )}
            </details>
        </div>
    );
};

export default CourseFilters;
