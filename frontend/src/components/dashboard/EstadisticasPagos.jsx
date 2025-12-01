import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {

    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Users,
    Activity,
    PieChart,
    BarChart3,
    Loader2,
    AlertCircle
} from 'lucide-react';
import api from '../../config/api';

const EstadisticasPagos = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadPaymentStats();
    }, []);

    const loadPaymentStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/usuarios/dashboard/payment-stats/');
            setStats(response.data);
        } catch (error) {
            console.error('Error loading payment stats:', error);
            setError('No se pudieron cargar las estadísticas');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // --- Components ---



    const SectionHeader = ({ title, icon: Icon, color }) => (
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">{title}</h3>
            <Icon className={color} size={16} />
        </div>
    );

    // --- Charts ---

    const BalanceChart = ({ data }) => {
        const maxVal = data ? Math.max(...data.map(d => Math.max(d.ingresos, d.egresos))) : 100;

        return (
            <div className="h-48 flex items-end justify-between gap-2 mt-4">
                {data?.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="relative w-full h-full flex items-end justify-center gap-1">
                            {/* Ingresos Bar */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(item.ingresos / maxVal) * 100}%` }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className="w-3 bg-emerald-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            {/* Egresos Bar */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(item.egresos / maxVal) * 100}%` }}
                                transition={{ duration: 0.8, delay: i * 0.1 + 0.05 }}
                                className="w-3 bg-rose-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                        </div>
                        <span className="text-[10px] text-white/40 uppercase">{item.name}</span>
                    </div>
                ))}
            </div>
        );
    };

    const EnrollmentDonut = ({ data }) => {
        const total = data.reduce((acc, curr) => acc + curr.value, 0);
        let currentAngle = 0;

        return (
            <div className="flex items-center justify-center h-48 relative">
                <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
                    {data.map((item, i) => {
                        const percentage = (item.value / total) * 100;
                        const dashArray = (percentage * Math.PI * 2 * 40) / 100; // Circumference = 2*PI*r (r=40)
                        const dashOffset = 0; // Handled by rotation in CSS if needed, but here we stack segments

                        // Simple SVG arc calculation is complex, using stroke-dasharray trick
                        // Circumference is approx 251.2
                        const circumference = 251.2;
                        const strokeLength = (percentage / 100) * circumference;
                        const spaceLength = circumference - strokeLength;

                        const circle = (
                            <circle
                                key={i}
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke={item.color}
                                strokeWidth="12"
                                strokeDasharray={`${strokeLength} ${spaceLength}`}
                                strokeDashoffset={-currentAngle * (circumference / 360)}
                                className="opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                            />
                        );

                        currentAngle += (percentage / 100) * 360;
                        return circle;
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-white">{total}</span>
                    <span className="text-[10px] text-white/50 uppercase">Total</span>
                </div>

                {/* Legend */}
                <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center gap-2 pl-4">
                    {data.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <div className="flex flex-col">
                                <span className="text-xs text-white/80 font-medium">{item.name}</span>
                                <span className="text-[10px] text-white/50">{item.value} ({Math.round(item.value / total * 100)}%)</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const TopCourses = ({ data }) => (
        <div className="space-y-4 mt-2">
            {data?.map((curso, i) => (
                <div key={i} className="group">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/80 font-medium truncate max-w-[180px]">{curso.full_name}</span>
                        <span className="text-white/60">{curso.value} inscritos</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(curso.value / Math.max(...data.map(c => c.value))) * 100}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className="h-full bg-blue-500 rounded-full group-hover:bg-blue-400 transition-colors"
                        />
                    </div>
                </div>
            ))}
            {(!data || data.length === 0) && (
                <div className="text-center text-white/30 text-xs py-8">No hay datos de cursos</div>
            )}
        </div>
    );

    const RecentActivity = ({ data }) => (
        <div className="space-y-3 mt-2 overflow-y-auto max-h-48 custom-scrollbar pr-2">
            {data?.map((pago, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                >
                    <div className={`p-2 rounded-full ${pago.tipo === 'Ingreso' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        <DollarSign size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white/90 text-xs font-medium truncate">{pago.persona}</p>
                        <p className="text-white/50 text-[10px] truncate">{pago.curso}</p>
                    </div>
                    <div className="text-right">
                        <p className={`text-xs font-bold ${pago.tipo === 'Ingreso' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {pago.tipo === 'Ingreso' ? '+' : '-'}{formatCurrency(pago.monto)}
                        </p>
                        <p className="text-white/40 text-[10px]">{pago.fecha}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-white" /></div>;
    if (error) return <div className="text-red-400 p-6 text-center">{error}</div>;

    return (
        <div className="space-y-6">
            {/* Top Stats Row */}


            {/* 2x2 Grid for Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* 1. Balance Social */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5"
                >
                    <SectionHeader title="Balance Social" icon={BarChart3} color="text-emerald-400" />
                    <BalanceChart data={stats?.balance_stats} />
                </motion.div>

                {/* 2. Estado Inscripciones */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5"
                >
                    <SectionHeader title="Estado Inscripciones" icon={PieChart} color="text-amber-400" />
                    <EnrollmentDonut data={stats?.inscripcion_stats || []} />
                </motion.div>

                {/* 3. Cursos Populares */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5"
                >
                    <SectionHeader title="Cursos Más Solicitados" icon={Users} color="text-blue-400" />
                    <TopCourses data={stats?.curso_stats} />
                </motion.div>

                {/* 4. Actividad Reciente */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5"
                >
                    <SectionHeader title="Actividad Reciente" icon={Activity} color="text-purple-400" />
                    <RecentActivity data={stats?.recent_payments} />
                </motion.div>

            </div>
        </div>
    );
};

export default EstadisticasPagos;
