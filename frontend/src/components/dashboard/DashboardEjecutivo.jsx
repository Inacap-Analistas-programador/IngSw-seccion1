import { useState, useEffect } from 'react';
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
  Calendar,
  Clock,
  MapPin,
  Users,
} from 'lucide-react';
import api from '@/lib/api';

const DashboardEjecutivo = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');
  const [stats, setStats] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all dashboard data in parallel
      const [statsData, coursesData, activityData] = await Promise.all([
        api.get('/usuarios/dashboard/executive-stats/').then(r => r.data),
        api.get('/usuarios/dashboard/recent-courses/').then(r => r.data),
        api.get('/usuarios/dashboard/recent-activity/').then(r => r.data)
      ]);

      // Map stats to include icons
      const statsWithIcons = statsData.stats.map((stat) => {
        let icon;
        switch (stat.label) {
          case 'Total Participantes':
            icon = FaUsers;
            break;
          case 'Cursos Activos':
            icon = FaBook;
            break;
          case 'Pagos Pendientes':
            icon = FaCreditCard;
            break;
          case 'Ingresos del Mes':
            icon = FaChartLine;
            break;
          default:
            icon = FaBook;
        }
        return { ...stat, icon };
      });

      setStats(statsWithIcons);
      setRecentCourses(coursesData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set default empty arrays on error
      setStats([]);
      setRecentCourses([]);
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

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
    return <Badge variant={variants[estado] || 'default'}>{labels[estado] || 'Desconocido'}</Badge>;
  };

  const getIconComponent = (iconName) => {
    const icons = {
      FaUserCheck,
      FaCreditCard,
      FaCalendarDays,
    };
    return icons[iconName] || FaCalendarDays;
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
        {loading ? (
          // Loading skeletons
          [1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </Card>
          ))
        ) : stats.length > 0 ? (
          stats.map((stat, index) => (
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
          ))
        ) : (
          <div className="col-span-4">
            <Card>
              <CardContent>
                <p className="text-gray-500 text-center py-4">No hay datos disponibles</p>
              </CardContent>
            </Card>
          </div>
        )}
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
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentCourses.length > 0 ? (
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
                      {curso.fecha && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-scout-azul-medio" />
                          <span>{curso.fecha}</span>
                        </div>
                      )}
                      {curso.lugar && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-scout-azul-medio" />
                          <span>{curso.lugar}</span>
                        </div>
                      )}
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
            ) : (
              <p className="text-gray-500 text-center py-4">No hay cursos próximos</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Actividad Reciente</CardTitle>
              <Button variant="ghost" size="sm" onClick={loadDashboardData}>
                <Clock className="w-4 h-4 mr-1" />
                Actualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const IconComponent = getIconComponent(activity.icon);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-scout-azul-claro hover:bg-scout-azul-muy-claro/30 transition-all duration-200"
                    >
                      <div className={`mt-1 ${activity.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">{activity.descripcion}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.fecha}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay actividad reciente</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardEjecutivo;
