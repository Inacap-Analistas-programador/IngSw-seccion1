import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaMoneyBillTrendUp, FaClockRotateLeft, FaGraduationCap, FaArrowTrendUp, FaSpinner } from 'react-icons/fa6';
import api from '../../config/api';

const EstadisticasPagos = () => {
    const [stats, setStats] = useState({
        total_ingresos: 0,
        pagos_pendientes: 0,
        cursos_pagados: 0
    });
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

    // Animated counter component
    const AnimatedCounter = ({ value, format = 'number' }) => {
        const [displayValue, setDisplayValue] = useState(0);

        useEffect(() => {
            const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
            const duration = 1500; // 1.5 seconds
            const steps = 60;
            const stepValue = numValue / steps;
            const stepDuration = duration / steps;

            let current = 0;
            const timer = setInterval(() => {
                current += stepValue;
                if (current >= numValue) {
                    setDisplayValue(numValue);
                    clearInterval(timer);
                } else {
                    setDisplayValue(current);
                }
            }, stepDuration);

            return () => clearInterval(timer);
        }, [value]);

        if (format === 'currency') {
            return <span>{formatCurrency(displayValue)}</span>;
        }
        return <span>{Math.floor(displayValue)}</span>;
    };

    const StatCard = ({ title, value, subtitle, icon: Icon, gradient, iconBg, delay, format = 'number' }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            className={`relative overflow-hidden rounded-2xl p-6 shadow-xl backdrop-blur-lg border border-white/20 ${gradient}`}
            whileHover={{ scale: 1.02, y: -5 }}
        >
            {/* Background glow effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>

            {/* Icon container */}
            <div className={`inline-flex p-3 rounded-xl ${iconBg} mb-4 shadow-lg`}>
                <Icon className="text-2xl text-white" />
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide">
                {title}
            </h3>

            {/* Value */}
            {loading ? (
                <div className="flex items-center gap-2">
                    <FaSpinner className="animate-spin text-white text-3xl" />
                    <span className="text-white/60">Cargando...</span>
                </div>
            ) : error ? (
                <div className="text-white/60 text-sm">{error}</div>
            ) : (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: delay + 0.3 }}
                >
                    <p className="text-4xl font-bold text-white mb-2 tracking-tight">
                        <AnimatedCounter value={value} format={format} />
                    </p>
                    <div className="flex items-center gap-2">
                        <FaArrowTrendUp className="text-white/70 text-sm" />
                        <p className="text-xs text-white/70 font-medium">{subtitle}</p>
                    </div>
                </motion.div>
            )}

            {/* Decorative corner accent */}
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-tl-full"></div>
        </motion.div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                title="Total Ingresos"
                value={stats.total_ingresos}
                subtitle="Este mes"
                icon={FaMoneyBillTrendUp}
                gradient="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600"
                iconBg="bg-emerald-600/80"
                delay={0}
                format="currency"
            />

            <StatCard
                title="Pagos Registrados"
                value={stats.pagos_pendientes}
                subtitle="Total en sistema"
                icon={FaClockRotateLeft}
                gradient="bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600"
                iconBg="bg-amber-600/80"
                delay={0.1}
            />

            <StatCard
                title="Cursos con Pago"
                value={stats.cursos_pagados}
                subtitle="Inscritos activos"
                icon={FaGraduationCap}
                gradient="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600"
                iconBg="bg-blue-600/80"
                delay={0.2}
            />
        </div>
    );
};

export default EstadisticasPagos;
