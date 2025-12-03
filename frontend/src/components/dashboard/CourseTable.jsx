import React from 'react';
import { Eye, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
    formatDate,
    formatCurrency,
    getEstadoName,
    getTipoCursoName,
    getModalidadName,
    calcularEstadisticasCurso,
} from '@/utils/courseHelpers';

/**
 * Course Table Component
 * Displays courses in a dark-themed table
 */
const CourseTable = ({ courses, onView, onEdit }) => {
    if (courses.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-white/60 text-lg">No hay cursos registrados</p>
                <p className="text-white/40 text-sm mt-2">
                    Crea tu primer curso haciendo clic en "Nuevo Curso"
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                            Código
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                            Descripción
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                            Fecha Solicitud
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                            Fecha y Hora
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                            Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                            Modalidad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                            Cuotas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                            Participantes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                            Equipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                            Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {courses.map((course) => {
                        const estadoInfo = getEstadoName(course.estado);
                        const stats = calcularEstadisticasCurso(course);

                        return (
                            <tr key={course.id} className="hover:bg-white/5 transition-colors">
                                {/* Código */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                    {course.codigo}
                                </td>

                                {/* Descripción */}
                                <td className="px-6 py-4 text-sm text-white">
                                    <div className="max-w-xs">
                                        <p className="truncate font-medium">{course.descripcion}</p>
                                        <p className="text-xs text-white/40 truncate">{course.lugar}</p>
                                    </div>
                                </td>

                                {/* Fecha Solicitud */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                                    {formatDate(course.fechaSolicitud)}
                                </td>

                                {/* Fecha y Hora */}
                                <td className="px-6 py-4 text-sm text-white">
                                    {course.fechas && course.fechas.length > 0 ? (
                                        <div className="space-y-1">
                                            {course.fechas.map((fecha, idx) => (
                                                <div key={idx} className="text-xs">
                                                    <span className="font-medium">
                                                        {formatDate(fecha.fecha_inicio)}
                                                    </span>
                                                    {' - '}
                                                    <span>{formatDate(fecha.fecha_termino)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        formatDate(course.fechaHora)
                                    )}
                                </td>

                                {/* Tipo */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className="inline-flex px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-200">
                                        {getTipoCursoName(course.tipoCurso)}
                                    </span>
                                </td>

                                {/* Modalidad */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className="inline-flex px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-200">
                                        {getModalidadName(course.modalidad)}
                                    </span>
                                </td>

                                {/* Cuotas */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="text-xs space-y-1">
                                        <p className="font-medium text-emerald-400">Con: {formatCurrency(course.cuotaConAlmuerzo)}</p>
                                        <p className="font-medium text-amber-400">Sin: {formatCurrency(course.cuotaSinAlmuerzo)}</p>
                                    </div>
                                </td>

                                {/* Participantes */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="text-xs space-y-1">
                                        <p className="font-semibold text-blue-400">{stats.totalParticipantes} personas</p>
                                        <p className="text-white/40">{stats.totalSecciones} {stats.totalSecciones === 1 ? 'sección' : 'secciones'}</p>
                                    </div>
                                </td>

                                {/* Equipo */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="text-xs space-y-1 text-white/60">
                                        <p><span className="font-medium">Coord:</span> {stats.totalCoordinadores}</p>
                                        <p><span className="font-medium">Dir:</span> {stats.totalDirectores}</p>
                                        <p><span className="font-medium">Form:</span> {course.formadores?.length || 0}</p>
                                    </div>
                                </td>

                                {/* Estado */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${estadoInfo.color}`}
                                    >
                                        {estadoInfo.name}
                                    </span>
                                </td>

                                {/* Acciones */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onView(course)}
                                            className="p-2 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300"
                                            title="Ver detalles"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onEdit(course)}
                                            className="p-2 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300"
                                            title="Editar curso"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CourseTable;
