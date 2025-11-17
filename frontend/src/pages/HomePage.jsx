import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import {
  FaCalendar,
  FaUsers,
  FaAward,
  FaKey,
  FaMapMarkerAlt,
  FaEnvelope,
  FaChartLine,
  FaShieldAlt,
  FaRocket,
  FaMobileAlt,
  FaCheck,
} from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaMapMarkerAlt className="w-8 h-8" />,
      title: 'Integración Google Maps',
      description: 'Selección de ubicaciones con autocompletado inteligente de direcciones',
      color: 'from-blue-500 to-blue-600',
      demo: '/demo/google-maps',
    },
    {
      icon: <FaEnvelope className="w-8 h-8" />,
      title: 'Sistema de Emails',
      description: 'Plantillas personalizables y envío automático con SendGrid',
      color: 'from-purple-500 to-purple-600',
      demo: '/demo/email-system',
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: 'Gestión de Personas',
      description: 'Control completo de participantes, dirigentes y coordinadores',
      color: 'from-green-500 to-green-600',
      demo: '/personas',
    },
    {
      icon: <FaCalendar className="w-8 h-8" />,
      title: 'Catálogo de Cursos',
      description: 'Explora y selecciona cursos disponibles para inscribirte',
      color: 'from-orange-500 to-orange-600',
      demo: '/cursos',
    },
    {
      icon: <FaChartLine className="w-8 h-8" />,
      title: 'Reportes y Estadísticas',
      description: 'Dashboard con métricas en tiempo real y análisis',
      color: 'from-pink-500 to-pink-600',
      demo: '/dashboard',
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: 'Seguridad Avanzada',
      description: 'Autenticación JWT, CSRF protection y rate limiting',
      color: 'from-red-500 to-red-600',
      demo: null,
    },
  ];

  const stats = [
    { number: '47', label: 'Modelos de Datos', icon: <FaChartLine /> },
    { number: '100%', label: 'API REST Completa', icon: <FaRocket /> },
    { number: 'JWT', label: 'Autenticación Segura', icon: <FaShieldAlt /> },
    { number: 'React 18', label: 'Frontend Moderno', icon: <FaMobileAlt /> },
  ];

  const technologies = [
    { name: 'React 18', description: 'Framework frontend moderno' },
    { name: 'TailwindCSS', description: 'Estilos utility-first' },
    { name: 'Django 5', description: 'Backend robusto' },
    { name: 'Django REST', description: 'API RESTful completa' },
    { name: 'MySQL', description: 'Base de datos confiable' },
    { name: 'Google Maps', description: 'Geolocalización' },
    { name: 'SendGrid', description: 'Email delivery' },
    { name: 'JWT', description: 'Autenticación segura' },
  ];

  return (
    <>
      <Helmet>
        <title>GIC - Plataforma de Gestión Integral de Cursos</title>
        <meta
          name="description"
          content="Sistema completo de gestión de cursos. Google Maps, emails automatizados, gestión de personas y mucho más."
        />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 text-white shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md"
              >
                <FaAward className="w-7 h-7 text-blue-900" />
              </motion.div>
              <div>
                <span className="text-2xl font-bold block">GIC Platform</span>
                <span className="text-xs text-white/80">Gestión Integral de Cursos</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => navigate('/preinscripcion')}
                className="bg-white text-blue-900 hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Inscribirse
              </Button>
              <Button
                onClick={() => navigate('/coordinador/login')}
                className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300"
              >
                <FaKey className="w-4 h-4 mr-2" />
                Acceso Admin
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 text-white py-24 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [90, 0, 90],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
            />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl">
                Plataforma GIC
              </h1>
              <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto text-white/95 font-medium">
                Sistema completo de gestión de cursos y capacitaciones
              </p>
              <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-white/80">
                Google Maps • Emails Automatizados • Gestión de Personas • API REST Completa
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/preinscripcion')}
                  className="bg-white text-blue-900 hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl text-lg px-8 py-4"
                >
                  <FaRocket className="inline-block mr-2" />
                  Comenzar Ahora
                </Button>
                <Button
                  onClick={() => navigate('/demo/google-maps')}
                  className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 transition-all duration-300 text-lg px-8 py-4"
                >
                  Ver Demos
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-blue-900 mb-2 flex justify-center">
                    {stat.icon && <div className="text-4xl">{stat.icon}</div>}
                  </div>
                  <div className="text-4xl font-bold text-blue-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Características Principales
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Todo lo que necesitas para gestionar tus cursos y actividades en una sola
                plataforma
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                  onClick={() => feature.demo && navigate(feature.demo)}
                >
                  <div className="p-8">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl mb-4 text-white shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    {feature.demo && (
                      <span className="text-scout-azul-oscuro font-medium group-hover:underline">
                        Ver demo →
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Tecnologías Modernas
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Construido con las mejores herramientas y frameworks del mercado
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all"
                >
                  <div className="text-2xl font-bold text-scout-azul-oscuro mb-2">
                    {tech.name}
                  </div>
                  <div className="text-sm text-gray-600">{tech.description}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-scout-azul-oscuro to-scout-azul-medio text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                ¿Listo para empezar?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
                Únete a la plataforma de gestión más completa para organizaciones Scout
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/preinscripcion')}
                  className="bg-white text-scout-azul-oscuro hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl text-lg px-8 py-4"
                >
                  Inscribirse Ahora
                </Button>
                <Button
                  onClick={() => navigate('/coordinador/login')}
                  className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 transition-all duration-300 text-lg px-8 py-4"
                >
                  <FaKey className="inline-block mr-2" />
                  Acceso Coordinador
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">GIC Platform</h3>
                <p className="text-gray-400">
                  Sistema de Gestión Integral de Cursos para la Asociación de Guías y Scouts
                  de Chile
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <button
                      onClick={() => navigate('/preinscripcion')}
                      className="hover:text-white transition-colors"
                    >
                      Preinscripción
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/demo/google-maps')}
                      className="hover:text-white transition-colors"
                    >
                      Demo Google Maps
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/demo/email-system')}
                      className="hover:text-white transition-colors"
                    >
                      Demo Sistema de Emails
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Tecnología</h3>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center">
                    <FaCheck className="mr-2 text-green-400" />
                    React 18 + Vite
                  </li>
                  <li className="flex items-center">
                    <FaCheck className="mr-2 text-green-400" />
                    Django 5 + DRF
                  </li>
                  <li className="flex items-center">
                    <FaCheck className="mr-2 text-green-400" />
                    Google Maps API
                  </li>
                  <li className="flex items-center">
                    <FaCheck className="mr-2 text-green-400" />
                    SendGrid Emails
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>© 2024 GIC Platform - Asociación de Guías y Scouts de Chile</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
