import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, CreditCard, TrendingUp } from 'lucide-react';

const DashboardEjecutivo = () => {
  const stats = [
    { icon: Users, label: 'Total Participantes', value: '156', color: 'bg-blue-500' },
    { icon: BookOpen, label: 'Cursos Activos', value: '8', color: 'bg-primary' },
    { icon: CreditCard, label: 'Pagos Pendientes', value: '23', color: 'bg-yellow-500' },
    { icon: TrendingUp, label: 'Ingresos del Mes', value: '$4,560', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Estado de Cursos</h2>
          <p className="text-gray-600">Gráfico de estado de cursos aparecerá aquí (RF-02).</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Progreso de Pagos</h2>
          <p className="text-gray-600">Gráfico de progreso de pagos aparecerá aquí (RF-02).</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardEjecutivo;
