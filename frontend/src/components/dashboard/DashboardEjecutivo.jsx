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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
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
      nombre: 'Formación Básica',
      fecha: '2024-02-15',
      inscritos: 45,
      capacidad: 50,
      estado: 'activo',
      lugar: 'Centro Regional',
    },
    {
      id: 2,
      nombre: 'Curso de Liderazgo',
      fecha: '2024-02-20',
      inscritos: 30,
      capacidad: 35,
      estado: 'activo',
      lugar: 'Sala de Capacitación',
    },
    {
      id: 3,
      nombre: 'Especialidades Técnicas',
      fecha: '2024-02-25',
      inscritos: 28,
      capacidad: 40,
      estado: 'inscripcion',
      lugar: 'Sede Principal',
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
    { nombre: 'Formación Básica', participantes: 145, porcentaje: 92 },
    { nombre: 'Curso de Liderazgo', participantes: 98, porcentaje: 78 },
    { nombre: 'Especialidades Técnicas', participantes: 87, porcentaje: 69 },
    { nombre: 'Técnicas de Gestión', participantes: 65, porcentaje: 52 },
  ];

  const getEstadoBadge = (estado) => {
    const variants = {
      activo: 'success',
      inscripcion: 'info',
      completo: 'default',
    };
    const labels = {
      activo: 'Activo',
      inscripcion: 'En Inscripción',
      completo: 'Completo',
    };
    return <Badge variant={variants[estado]}>{labels[estado]}</Badge>;
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
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            color={stat.color}
            index={index}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Cursos Próximos</CardTitle>
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCourses.map((curso) => (
                <div
                  key={curso.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-scout-azul-claro hover:bg-scout-azul-muy-claro/30 transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900">{curso.nombre}</h3>
                    {getEstadoBadge(curso.estado)}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-scout-azul-medio" />
                      <span>{curso.fecha}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-scout-azul-medio" />
                      <span>{curso.lugar}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-scout-azul-medio" />
                      <span>
                        {curso.inscritos}/{curso.capacidad} participantes
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-scout-azul-medio to-scout-azul-claro h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(curso.inscritos / curso.capacidad) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Actividad Reciente</CardTitle>
              <Button variant="ghost" size="sm">
                <Clock className="w-4 h-4 mr-1" />
                Actualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-scout-azul-claro hover:bg-scout-azul-muy-claro/30 transition-all duration-200"
                >
                  <div className={`mt-1 ${activity.color}`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">{activity.descripcion}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.fecha}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Cursos Más Populares</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCourses.map((curso, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-scout-dorado-aventura" />
                    <span className="font-medium text-gray-900">{curso.nombre}</span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{curso.participantes} participantes</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-scout-azul-medio to-scout-azul-claro h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${curso.porcentaje}%` }}
                  >
                    <span className="text-xs text-white font-semibold">{curso.porcentaje}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardEjecutivo;
