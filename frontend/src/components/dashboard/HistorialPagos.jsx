import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  History,
  Clock,
  TrendingUp,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../../config/api';

const HistorialPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/pagos/pagopersonas/');
        const data = response?.data;
        setPagos(Array.isArray(data) ? data : data?.results ?? []);
      } catch (err) {
        console.error('Error loading payment history:', err);
        setError('No se pudo cargar el historial de pagos.');
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, []);

  const MONTHS_TO_DISPLAY = 6;

  const historyStats = useMemo(() => {
    const counts = {};
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const today = new Date();

    for (let i = MONTHS_TO_DISPLAY - 1; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      counts[key] = { name: monthNames[d.getMonth()], cambios: 0 };
    }

    pagos.forEach((pago) => {
      if (pago.pap_fecha_hora) {
        const d = new Date(pago.pap_fecha_hora);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (counts[key] !== undefined) {
          counts[key].cambios += 1;
        }
      }
    });

    return Object.values(counts);
  }, [pagos]);

  const recentActivity = useMemo(() => {
    return [...pagos]
      .sort((a, b) => new Date(b.pap_fecha_hora) - new Date(a.pap_fecha_hora))
      .slice(0, 5)
      .map((pago) => {
        const fecha = new Date(pago.pap_fecha_hora);
        const diffMs = Date.now() - fecha.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        let timeLabel;
        if (diffHours < 1) timeLabel = 'Hace menos de 1 hora';
        else if (diffHours < 24) timeLabel = `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
        else timeLabel = `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;

        const tipoLabel = pago.pap_tipo === 1 ? 'Ingreso Registrado' : 'Egreso Registrado';

        return {
          id: pago.pap_id,
          action: tipoLabel,
          amount: pago.pap_valor,
          time: timeLabel,
          type: pago.pap_tipo === 1 ? 'create' : 'edit',
        };
      });
  }, [pagos]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 shadow-2xl">
          <p className="text-white font-semibold text-xs">{payload[0].payload.name}</p>
          <p className="text-purple-400 font-bold text-sm">
            {payload[0].value} {payload[0].value === 1 ? 'registro' : 'registros'}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 bg-white/5 p-6 rounded-3xl backdrop-blur-xl border border-white/10">
        <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
          <History size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Historial de Movimientos</h2>
          <p className="text-white/60 text-sm">Registro de pagos de los últimos 6 meses</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-300">
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="text-purple-400" size={20} />
              Pagos por Mes
            </h3>
            {loading && <Loader2 size={18} className="text-purple-400 animate-spin" />}
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={historyStats}>
              <defs>
                <linearGradient id="colorCambios" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="name"
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px' }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="cambios"
                stroke="#a855f7"
                strokeWidth={3}
                fill="url(#colorCambios)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="text-blue-400" size={20} />
            Pagos Recientes
          </h3>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 size={24} className="text-purple-400 animate-spin" />
            </div>
          ) : recentActivity.length === 0 ? (
            <p className="text-white/40 text-sm text-center py-8">Sin registros recientes</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex gap-4 items-start group">
                  <div
                    className={`mt-1 w-2 h-2 rounded-full ${
                      item.type === 'create' ? 'bg-emerald-400' : 'bg-yellow-400'
                    } shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
                  />
                  <div className="flex-1 pb-4 border-b border-white/5 last:border-0">
                    <p className="text-white font-medium text-sm group-hover:text-blue-300 transition-colors">
                      {item.action}
                    </p>
                    <p className="text-white/60 text-xs mt-1 font-mono">
                      {formatCurrency(item.amount)}
                    </p>
                    <p className="text-white/40 text-xs mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HistorialPagos;

