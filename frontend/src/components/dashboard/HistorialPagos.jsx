import React from 'react';
import { motion } from 'framer-motion';
import {
  History,
  Clock,
  RotateCcw,
  FileEdit,
  CheckCircle2,
  XCircle,
  TrendingUp
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const HistorialPagos = () => {
  // Mock data for the historical dashboard
  const historyStats = [
    { name: 'Jun', cambios: 12 },
    { name: 'Jul', cambios: 19 },
    { name: 'Ago', cambios: 15 },
    { name: 'Sep', cambios: 25 },
    { name: 'Oct', cambios: 32 },
    { name: 'Nov', cambios: 28 },
  ];

  const recentActivity = [
    { id: 1, action: 'Pago Modificado', user: 'Admin', time: 'Hace 2 horas', type: 'edit' },
    { id: 2, action: 'Pago Anulado', user: 'Coordinador', time: 'Hace 5 horas', type: 'delete' },
    { id: 3, action: 'Nuevo Registro', user: 'Admin', time: 'Hace 1 día', type: 'create' },
    { id: 4, action: 'Comprobante Emitido', user: 'Sistema', time: 'Hace 1 día', type: 'system' },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 shadow-2xl">
          <p className="text-white font-semibold text-xs">{payload[0].payload.name}</p>
          <p className="text-purple-400 font-bold text-sm">
            {payload[0].value} cambios
          </p>
        </div>
      );
    }
    return null;
  };

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
          <p className="text-white/60 text-sm">Registro de auditoría y cambios en el sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="text-purple-400" size={20} />
              Actividad del Sistema
            </h3>
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
            Actividad Reciente
          </h3>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex gap-4 items-start group">
                <div className={`mt-1 w-2 h-2 rounded-full ${item.type === 'edit' ? 'bg-yellow-400' :
                    item.type === 'delete' ? 'bg-red-400' :
                      item.type === 'create' ? 'bg-emerald-400' : 'bg-blue-400'
                  } shadow-[0_0_10px_rgba(255,255,255,0.3)]`}></div>
                <div className="flex-1 pb-4 border-b border-white/5 last:border-0">
                  <p className="text-white font-medium text-sm group-hover:text-blue-300 transition-colors">
                    {item.action}
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    por <span className="text-white/60">{item.user}</span> • {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HistorialPagos;
