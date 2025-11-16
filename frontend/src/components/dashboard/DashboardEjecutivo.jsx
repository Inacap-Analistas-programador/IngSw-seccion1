import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUsers,
  FaBook,
  FaCreditCard,
  FaChartLine,
  FaUserCheck,
  FaCalendarDays,
} from 'react-icons/fa6';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
  Clock,
  MapPin,
  Users,
  BookOpen,
} from 'lucide-react';

const DashboardEjecutivo = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');

  const stats = [
    {
      icon: FaUsers,
      label: 'Total Participantes',
      value: '156',
      change: '+12%',
      trend: 'up',
      color: 'bg-blue-500',
    },
    {
      icon: FaBook,
      label: 'Cursos Activos',
      value: '8',
      change: '+2',
      trend: 'up',
      color: 'bg-primary',
    },
    {
      icon: FaCreditCard,
      label: 'Pagos Pendientes',
      value: '23',
      change: '-5%',
      trend: 'down',
      color: 'bg-yellow-500',
    },
    {
      icon: FaChartLine,
      label: 'Ingresos del Mes',
      value: '$4,560,000',
      change: '+18%',
      trend: 'up',
      color: 'bg-purple-500',
    },
  ];

  const recentCourses = [
    {
      id: 1,
      nombre: 'Formación Básica Scout',
      fecha: '2024-02-15',
      inscritos: 45,
      capacidad: 50,
      estado: 'activo',
      lugar: 'Centro Scout Regional',
    },
    {
      id: 2,
      nombre: 'Curso de Liderazgo',
      fecha: '2024-02-20',
      inscritos: 30,
      capacidad: 35,
      estado: 'activo',
      lugar: 'Campamento Base',
    },
    {
      id: 3,
      nombre: 'Especialidades Scout',
      fecha: '2024-02-25',
      inscritos: 28,
      capacidad: 40,
      estado: 'inscripcion',
      lugar: 'Sede Nacional',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      tipo: 'inscripcion',
      descripcion: 'Nueva inscripción: Juan Pérez - Formación Básica',
      fecha: 'Hace 2 horas',
      icon: FaUserCheck,
      color: 'text-green-600',
    },
    {
      id: 2,
      tipo: 'pago',
      descripcion: 'Pago confirmado: María Silva - $25,000',
      fecha: 'Hace 4 horas',
      icon: FaCreditCard,
      color: 'text-blue-600',
    },
    {
      id: 3,
      tipo: 'curso',
      descripcion: 'Nuevo curso creado: Campamento de Verano',
      fecha: 'Hace 6 horas',
      icon: FaCalendarDays,
      color: 'text-purple-600',
    },
  ];

  const topCourses = [
    { nombre: 'Formación Básica Scout', participantes: 145, porcentaje: 92 },
    { nombre: 'Curso de Liderazgo', participantes: 98, porcentaje: 78 },
    { nombre: 'Especialidades Scout', participantes: 87, porcentaje: 69 },
    { nombre: 'Técnicas de Campamento', participantes: 65, porcentaje: 52 },
  ];

  const getEstadoBadge = (estado) => {
    const badges = {
      activo: 'bg-green-100 text-green-800 border-green-200',
      inscripcion: 'bg-blue-100 text-blue-800 border-blue-200',
      completo: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    const labels = {
      activo: 'Activo',
      inscripcion: 'En Inscripción',
      completo: 'Completo',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badges[estado]}`}>
        {labels[estado]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Vista Ejecutiva</h2>
          <p className="text-gray-600 text-sm mt-1">Resumen general de la plataforma</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === 'semana' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('semana')}
          >
            Semana
          </Button>
          <Button
            variant={selectedPeriod === 'mes' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('mes')}
          >
            Mes
          </Button>
          <Button
            variant={selectedPeriod === 'año' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('año')}
          >
            Año
          </Button>
        </div>
      </div>

      {/* Stats Cards with Trends */}
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
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-600" />
                    )}
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    <span className="text-sm text-gray-500">vs {selectedPeriod} anterior</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Cursos Próximos</h2>
            <Button variant="ghost" size="sm">
              Ver todos
            </Button>
          </div>
          <div className="space-y-3">
            {recentCourses.map((curso) => (
              <div
                key={curso.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{curso.nombre}</h3>
                  {getEstadoBadge(curso.estado)}
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{curso.fecha}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{curso.lugar}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {curso.inscritos}/{curso.capacidad} participantes
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(curso.inscritos / curso.capacidad) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Actividad Reciente</h2>
            <Button variant="ghost" size="sm">
              <Clock className="w-4 h-4 mr-1" />
              Actualizar
            </Button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`mt-1 ${activity.color}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.descripcion}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.fecha}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Courses */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Cursos Más Populares</h2>
        <div className="space-y-4">
          {topCourses.map((curso, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-gray-900">{curso.nombre}</span>
                </div>
                <span className="text-sm text-gray-600">{curso.participantes} participantes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${curso.porcentaje}%` }}
                >
                  <span className="flex items-center justify-end pr-2 text-xs text-white font-medium h-full">
                    {curso.porcentaje}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardEjecutivo;
