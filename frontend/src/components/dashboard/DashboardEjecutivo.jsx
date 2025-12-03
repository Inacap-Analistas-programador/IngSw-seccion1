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
  const [cursosActivos, setCursosActivos] = useState([]);
  const [cursosPendientes, setCursosPendientes] = useState([]);
  const [cursosFinalizar, setCursosFinalizar] = useState([]);
  const [activeTab, setActiveTab] = useState('activos');
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

      // Categorize courses
      const activos = coursesData.filter(c => c.estado === 'activo' || c.estado === 'inscripcion');
      const pendientes = coursesData.filter(c => c.estado === 'pendiente' || c.estado === 'borrador');
      const finalizar = coursesData.filter(c => c.estado === 'completo' || c.estado === 'cerrado');

      setCursosActivos(activos);
      setCursosPendientes(pendientes);
      setCursosFinalizar(finalizar);

      setRecentActivity(activityData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set default empty arrays on error
      setStats([]);
      setCursosActivos([]);
      setCursosPendientes([]);
      setCursosFinalizar([]);
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

  const calculateTrafficLight = (curso) => {
    // Red: Critical missing info
    if (!curso.coordinador || !curso.nivel) return 'red';
    // Yellow: Warnings (e.g. pending payments logic could go here)
    if (curso.pagos_pendientes > 0) return 'yellow';
    // Green: All good
    return 'green';
  };

  const getTrafficLightColor = (status) => {
    switch (status) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      case 'green': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  const renderCourseList = (courses) => (
    <div className="space-y-3">
      {courses.length > 0 ? (
        courses.map((curso) => {
          const trafficLight = calculateTrafficLight(curso);
          return (
            <div
              key={curso.id}
              className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-200 bg-white/5 cursor-pointer group"
              onClick={() => window.location.href = `/coordinador/dashboard/gestion-cursos?id=${curso.id}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getTrafficLightColor(trafficLight)} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} title="Estado de Salud del Curso"></div>
                  <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{curso.nombre}</h3>
                </div>
                {getEstadoBadge(curso.estado)}
              </div>
              <div className="space-y-2 text-sm text-white/60">
                {curso.fecha && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>{curso.fecha}</span>
                  </div>
                )}
                {curso.lugar && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{curso.lugar}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>
                    {curso.inscritos}/{curso.capacidad} participantes
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(curso.inscritos / curso.capacidad) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-white/50 text-center py-4">No hay cursos en esta categoría</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-end items-center">
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
            <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="animate-pulse p-4">
                <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-white/10 rounded w-3/4"></div>
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
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent>
                <p className="text-white/50 text-center py-4">No hay datos disponibles</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-3 border-b border-white/5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <CardTitle className="text-xl text-white">Gestión de Cursos</CardTitle>
              <div className="flex bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('activos')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'activos' ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/60 hover:text-white'}`}
                >
                  Activos
                </button>
                <button
                  onClick={() => setActiveTab('pendientes')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'pendientes' ? 'bg-yellow-500/20 text-yellow-400' : 'text-white/60 hover:text-white'}`}
                >
                  Pendientes
                </button>
                <button
                  onClick={() => setActiveTab('finalizar')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'finalizar' ? 'bg-blue-500/20 text-blue-400' : 'text-white/60 hover:text-white'}`}
                >
                  Por Finalizar
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {activeTab === 'activos' && renderCourseList(cursosActivos)}
                {activeTab === 'pendientes' && renderCourseList(cursosPendientes)}
                {activeTab === 'finalizar' && renderCourseList(cursosFinalizar)}
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-3 border-b border-white/5">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-white">Actividad Reciente</CardTitle>
              <Button variant="ghost" size="sm" onClick={loadDashboardData} className="text-white/70 hover:text-white hover:bg-white/10">
                <Clock className="w-4 h-4 mr-1" />
                Actualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
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
                      className="flex items-start gap-3 p-3 border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-200 bg-white/5"
                    >
                      <div className={`mt-1 p-2 rounded-lg bg-white/10 ${activity.color?.replace('text-', 'text-') || 'text-emerald-400'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">{activity.descripcion}</p>
                        <p className="text-xs text-white/50 mt-1">{activity.fecha}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="text-white/50 text-center py-4">No hay actividad reciente</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardEjecutivo;
