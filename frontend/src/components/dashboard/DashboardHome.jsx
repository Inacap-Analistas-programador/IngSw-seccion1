import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, CreditCard, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';

const DashboardHome = () => {
  const stats = [
    { icon: Users, label: 'Total Personas', value: '156', color: 'bg-blue-500' },
    { icon: BookOpen, label: 'Cursos Activos', value: '8', color: 'bg-primary' },
    { icon: CreditCard, label: 'Pagos Pendientes', value: '23', color: 'bg-yellow-500' },
    { icon: TrendingUp, label: 'Inscripciones', value: '45', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bienvenido al panel de administración</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Actividad Reciente</h2>
        <p className="text-gray-600">No hay actividad reciente para mostrar.</p>
      </Card>
    </div>
  );
};

export default DashboardHome;
