import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { FaCalendarDays, FaUsers, FaAward, FaKey } from 'react-icons/fa6';

const HomePage = () => {
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      name: 'Curso Básico de Formación',
      description: 'Introducción a los fundamentos del movimiento Scout y metodología educativa.',
      startDate: '15 Enero 2026',
      endDate: '20 Enero 2026',
      location: 'Centro Scout Nacional',
    },
    {
      id: 2,
      name: 'Curso Avanzado de Liderazgo',
      description: 'Desarrollo de habilidades de liderazgo y gestión de equipos Scout.',
      startDate: '10 Febrero 2026',
      endDate: '15 Febrero 2026',
      location: 'Campamento Regional',
    },
    {
      id: 3,
      name: 'Especialización en Actividades al Aire Libre',
      description: 'Técnicas avanzadas de campismo, orientación y supervivencia.',
      startDate: '5 Marzo 2026',
      endDate: '10 Marzo 2026',
      location: 'Base Scout Cordillera',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Scout - Plataforma de Formación</title>
        <meta
          name="description"
          content="Plataforma oficial de formación Scout. Inscríbete en nuestros cursos y desarrolla tus habilidades como dirigente Scout."
        />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-gradient-to-r from-scout-azul-oscuro to-scout-azul-medio text-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <FaAward className="w-7 h-7 text-scout-azul-oscuro" />
              </div>
              <div>
                <span className="text-2xl font-bold block">Scout Formación</span>
                <span className="text-xs text-white/80">Plataforma GIC</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-white text-scout-azul-oscuro hover:bg-scout-azul-muy-claro transition-all duration-300"
              >
                Panel
              </Button>
              <Button
                onClick={() => navigate('/coordinador/login')}
                className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300"
              >
                <FaKey className="w-4 h-4 mr-2" />
                Ingreso Coordinador
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-scout-azul-oscuro via-scout-azul-medio to-scout-azul-claro text-white py-20 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                Bienvenido a la Plataforma Scout
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
                Desarrolla tus habilidades como dirigente Scout a través de nuestros cursos de
                formación especializados
              </p>
              <Button
                onClick={() => navigate('/preinscripcion')}
                size="lg"
                className="bg-white text-scout-azul-oscuro hover:bg-scout-azul-muy-claro text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Iniciar Pre-inscripción
              </Button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-12 max-w-sm mx-auto bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20"
              >
                <div className="flex items-center justify-center mb-4">
                  <FaKey className="w-6 h-6 mr-3 text-white" />
                  <h3 className="text-xl font-semibold text-white">Credenciales de Coordinador</h3>
                </div>
                <div className="text-left space-y-2 text-white/90 bg-white/5 rounded-lg p-4">
                  <p className="text-sm">
                    <span className="font-semibold text-white">Correo:</span>{' '}
                    coordinador@scout.cl
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-white">Contraseña:</span>{' '}
                    scout2024
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Courses Section */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold text-center mb-4 text-scout-azul-oscuro">
                Cursos Disponibles
              </h2>
              <p className="text-center text-gray-600 mb-12 text-lg">
                Explora nuestros programas de formación diseñados para dirigentes Scout
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-scout-azul-medio to-scout-azul-claro h-2"></div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-3 text-scout-azul-oscuro">{course.name}</h3>
                      <p className="text-gray-600 mb-4 min-h-[60px] leading-relaxed">{course.description}</p>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                          <FaCalendarDays className="w-4 h-4 text-scout-azul-medio" />
                          <span>Inicio: {course.startDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaCalendarDays className="w-4 h-4 text-scout-azul-medio" />
                          <span>Término: {course.endDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaUsers className="w-4 h-4 text-scout-azul-medio" />
                          <span>{course.location}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => navigate('/preinscripcion')}
                        className="w-full mt-6 bg-scout-azul-medio hover:bg-scout-azul-oscuro text-white transition-colors duration-300"
                      >
                        Inscribirse
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-scout-azul-oscuro to-scout-azul-medio text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                  <FaAward className="w-6 h-6 text-scout-azul-oscuro" />
                </div>
                <div>
                  <span className="text-xl font-bold block">Scout Formación</span>
                  <span className="text-xs text-white/70">Plataforma GIC</span>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-white/90">
                  © 2025 Scout Formación. Todos los derechos reservados.
                </p>
                <p className="text-white/70 text-sm mt-1">Siempre Listo para Servir</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
