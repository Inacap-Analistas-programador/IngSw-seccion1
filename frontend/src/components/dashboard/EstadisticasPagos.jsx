import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Users,
    Activity,
    PieChart as PieChartIcon,
    BarChart3,
    Loader2,
    AlertCircle,
    Wallet,
    CreditCard,
    TrendingUp
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
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
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center backdrop-blur-xl">
                <AlertCircle className="mx-auto text-red-400 mb-2" size={32} />
                <p className="text-red-200 font-medium">{error}</p>
                <button
                    onClick={loadPaymentStats}
                    className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg text-sm transition-colors"
                >
                    Intentar nuevamente
                </button>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-120px)]">
            {/* Left Sidebar: Recent Activity */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full xl:w-72 flex-shrink-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden flex flex-col"
            >
                <div className="p-6 border-b border-white/10 bg-white/5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                        <CreditCard className="text-purple-400" size={16} />
                        Últimos Movimientos
                    </h3>
                </div>
                <div className="overflow-y-auto custom-scrollbar flex-1 p-2">
                    <div className="space-y-2">
                        {stats.recent_payments.map((pago) => (
                            <div key={pago.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${pago.tipo === 'Ingreso' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                        {pago.tipo === 'Ingreso' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white/90 text-xs font-bold truncate w-32">{pago.persona}</p>
                                        <p className="text-white/40 text-[10px] truncate w-32">{pago.curso}</p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className={`text-xs font-bold ${pago.tipo === 'Ingreso' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {formatCurrency(pago.monto)}
                                    </p>
                                    <p className="text-white/30 text-[10px]">{pago.fecha}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Right Content: Charts Grid */}
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">

                {/* Summary Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-emerald-500/10 backdrop-blur-xl p-4 rounded-2xl border border-emerald-500/20"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-emerald-200/60 text-xs font-medium uppercase tracking-wider">Ingresos Mes</p>
                                <h3 className="text-xl font-bold text-emerald-100 mt-1">
                                    {formatCurrency(stats.total_ingresos)}
                                </h3>
                            </div>
                            <div className="p-2 bg-emerald-500/20 rounded-lg">
                                <DollarSign className="text-emerald-400" size={20} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-amber-500/10 backdrop-blur-xl p-4 rounded-2xl border border-amber-500/20"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-amber-200/60 text-xs font-medium uppercase tracking-wider">Pendientes</p>
                                <h3 className="text-xl font-bold text-amber-100 mt-1">
                                    {stats.pagos_pendientes}
                                </h3>
                            </div>
                            <div className="p-2 bg-amber-500/20 rounded-lg">
                                <Wallet className="text-amber-400" size={20} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-blue-500/10 backdrop-blur-xl p-4 rounded-2xl border border-blue-500/20"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-blue-200/60 text-xs font-medium uppercase tracking-wider">Cursos Activos</p>
                                <h3 className="text-xl font-bold text-blue-100 mt-1">
                                    {stats.cursos_pagados}
                                </h3>
                            </div>
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <BarChart3 className="text-blue-400" size={20} />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">

                    {/* 1. Balance Financiero (Area Chart) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex flex-col"
                    >
                        <h3 className="text-xs font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                            <Activity className="text-emerald-400" size={14} />
                            Balance Mensual
                        </h3>
                        <div className="flex-1 min-h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.balance_stats} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} dy={5} />
                                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} formatter={(value) => formatCurrency(value)} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                                    <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="#10B981" fillOpacity={1} fill="url(#colorIngresos)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="egresos" name="Egresos" stroke="#EF4444" fillOpacity={1} fill="url(#colorEgresos)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* 2. Tendencia Diaria (Line Chart - NEW) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex flex-col"
                    >
                        <h3 className="text-xs font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                            <TrendingUp className="text-cyan-400" size={14} />
                            Tendencia Diaria (30 Días)
                        </h3>
                        <div className="flex-1 min-h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.daily_stats} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorDailyIngresos" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} dy={5} minTickGap={30} />
                                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} formatter={(value) => formatCurrency(value)} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                                    <Area type="monotone" dataKey="ingresos" name="Ingresos Diarios" stroke="#06B6D4" fillOpacity={1} fill="url(#colorDailyIngresos)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* 3. Inscripciones por Curso (Stacked Bar Chart) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex flex-col"
                    >
                        <h3 className="text-xs font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                            <BarChart3 className="text-blue-400" size={14} />
                            Inscripciones por Curso
                        </h3>
                        <div className="flex-1 min-h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.curso_stats} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={60} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                                    <Bar dataKey="vigentes" name="Vigentes" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} barSize={12} />
                                    <Bar dataKey="pendientes" name="Pendientes" stackId="a" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* 4. Estado General (Donut Chart) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex flex-col"
                    >
                        <h3 className="text-xs font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                            <PieChartIcon className="text-amber-400" size={14} />
                            Estado General
                        </h3>
                        <div className="flex-1 min-h-[180px] w-full flex items-center justify-center relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={stats.inscripcion_stats} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                                        {stats.inscripcion_stats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                                    <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px', paddingLeft: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-24">
                                <span className="text-xl font-bold text-white">
                                    {stats.inscripcion_stats.reduce((acc, curr) => acc + curr.value, 0)}
                                </span>
                                <span className="text-[9px] text-white/40 uppercase tracking-wider">Total</span>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default EstadisticasPagos;
