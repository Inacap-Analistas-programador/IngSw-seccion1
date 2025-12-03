import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, MapPin, Settings } from 'lucide-react';
import { calcularEstadisticasCurso } from '@/utils/courseHelpers';

/**
 * Course Statistics Cards Component
 * Displays 4 summary cards with dark glassmorphism design
 */
const CourseStatCards = ({ courses }) => {
    // Calculate totals
    const totalCourses = courses.length;
    const activeCourses = courses.filter(c => c.estado === '1' || c.estado === '3').length;

    const totalParticipants = courses.reduce((sum, course) => {
        const stats = calcularEstadisticasCurso(course);
        return sum + stats.totalParticipantes;
    }, 0);

    const totalCoordinators = courses.reduce((sum, course) => {
        const stats = calcularEstadisticasCurso(course);
        return sum + stats.totalCoordinadores;
    }, 0);

    // Don't render if no courses
    if (totalCourses === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Cursos */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-blue-500/10 backdrop-blur-xl p-4 rounded-2xl border border-blue-500/20"
            >
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-blue-200/60 text-xs font-medium uppercase tracking-wider">Total Cursos</p>
                        <h3 className="text-2xl font-bold text-blue-100 mt-1">{totalCourses}</h3>
                    </div>
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Calendar className="text-blue-400" size={20} />
                    </div>
                </div>
            </motion.div>

            {/* Cursos Activos */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-emerald-500/10 backdrop-blur-xl p-4 rounded-2xl border border-emerald-500/20"
            >
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-emerald-200/60 text-xs font-medium uppercase tracking-wider">Activos</p>
                        <h3 className="text-2xl font-bold text-emerald-100 mt-1">{activeCourses}</h3>
                    </div>
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Filter className="text-emerald-400" size={20} />
                    </div>
                </div>
            </motion.div>

            {/* Total Participantes */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-purple-500/10 backdrop-blur-xl p-4 rounded-2xl border border-purple-500/20"
            >
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-purple-200/60 text-xs font-medium uppercase tracking-wider">Participantes</p>
                        <h3 className="text-2xl font-bold text-purple-100 mt-1">{totalParticipants}</h3>
                    </div>
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <MapPin className="text-purple-400" size={20} />
                    </div>
                </div>
            </motion.div>

            {/* Total Coordinadores */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-amber-500/10 backdrop-blur-xl p-4 rounded-2xl border border-amber-500/20"
            >
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-amber-200/60 text-xs font-medium uppercase tracking-wider">Coordinadores</p>
                        <h3 className="text-2xl font-bold text-amber-100 mt-1">{totalCoordinators}</h3>
                    </div>
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Settings className="text-amber-400" size={20} />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CourseStatCards;
