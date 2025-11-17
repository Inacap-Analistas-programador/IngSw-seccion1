import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, CreditCard, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import { getDashboardStats } from '@/lib/api';

const DashboardHome = () => {
  const [stats, setStats] = useState([
    { icon: Users, label: 'Total Personas', value: '0', color: 'bg-blue-500', loading: true },
    { icon: BookOpen, label: 'Cursos Activos', value: '0', color: 'bg-primary', loading: true },
    { icon: CreditCard, label: 'Pagos Pendientes', value: '0', color: 'bg-yellow-500', loading: true },
    { icon: TrendingUp, label: 'Inscripciones', value: '0', color: 'bg-purple-500', loading: true },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      
      setStats([
        { icon: Users, label: 'Total Personas', value: data.total_personas.toString(), color: 'bg-blue-500' },
        { icon: BookOpen, label: 'Cursos Activos', value: data.cursos_activos.toString(), color: 'bg-primary' },
        { icon: CreditCard, label: 'Pagos Pendientes', value: data.pagos_pendientes.toString(), color: 'bg-yellow-500' },
        { icon: TrendingUp, label: 'Inscripciones', value: data.inscripciones_totales.toString(), color: 'bg-purple-500' },
      ]);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

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
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {loading ? (
                      <span className="inline-block animate-pulse bg-gray-300 rounded h-8 w-16"></span>
                    ) : (
                      stat.value
                    )}
                  </p>
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
        {loading ? (
          <div className="space-y-2">
            <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4"></div>
            <div className="animate-pulse bg-gray-200 h-4 rounded w-1/2"></div>
          </div>
        ) : (
          <p className="text-gray-600">Sistema operativo. Datos actualizados desde la base de datos.</p>
        )}
      </Card>
    </div>
  );
};

export default DashboardHome;
