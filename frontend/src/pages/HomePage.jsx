import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import cursosService from '@/services/cursosService';
import scoutBg from '@/assets/scout-digital-bg.png';
import scoutLogo from '@/assets/scout-logo.png';
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaArrowRight,
  FaCampground,
  FaStar,
} from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await cursosService.getAll();
        const allCursos = response.data || response;
        const activeCursos = allCursos
          .filter(c => c.cur_estado === 1 || c.cur_estado === 2)
          .slice(0, 3);
        setCursos(activeCursos);
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  const getModalidadLabel = (modalidad) => {
    const modalidades = { 1: 'Presencial', 2: 'Online', 3: 'Híbrido' };
    return modalidades[modalidad] || 'Mixto';
  };

  return (
    <>
      <Helmet>
        <title>GIC - Tu Futuro Scout Comienza Aquí</title>
        <meta
          name="description"
          content="Plataforma de gestión de cursos Scout. Inscríbete y gestiona tu aprendizaje."
        />
      </Helmet>

      <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500 selection:text-white font-sans">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-transparent">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden">
                <img src={scoutLogo} alt="GIC Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold tracking-tight">GIC Platform</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => navigate('/cursos')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Cursos
              </button>
              <button onClick={() => navigate('/coordinador/login')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Coordinadores
              </button>
              <Button
                onClick={() => navigate('/preinscripcion')}
                className="bg-white text-black hover:bg-gray-100 font-semibold rounded-full px-6"
              >
                Inscribirse
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={scoutBg}
              alt="Scout Digital Background"
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle vignette for edges */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,#020617_100%)] opacity-60" />
            {/* Vertical gradient for text readability at bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/20 via-transparent to-[#020617]" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          </div>

          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 backdrop-blur-sm">
                <FaCampground />
                <span>Gestión Integral de Cursos Scout</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                Tu Aventura <br />
                <span className="text-blue-500">Comienza Aquí</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Una plataforma moderna diseñada para la gestión eficiente de cursos y capacitaciones.
                Explora, aprende y crece con nosotros.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={() => navigate('/preinscripcion')}
                  className="h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-lg font-medium shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
                >
                  Pre-inscripción
                  <FaArrowRight className="ml-2" />
                </Button>
                <Button
                  onClick={() => navigate('/cursos')}
                  className="h-14 px-8 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-sm text-lg font-medium transition-all"
                >
                  Ver Cursos
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
          >
            <span className="text-xs uppercase tracking-widest">Descubre Más</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-blue-500 to-transparent" />
          </motion.div>
        </section>

        {/* Featured Courses Section */}
        <section className="py-32 relative z-10">
          <div className="container mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Cursos Destacados</h2>
                <p className="text-gray-400">Explora las últimas oportunidades de formación disponibles.</p>
              </div>
              <Button
                onClick={() => navigate('/cursos')}
                variant="link"
                className="text-blue-400 hover:text-blue-300 hidden md:flex"
              >
                Ver todos los cursos <FaArrowRight className="ml-2" />
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-96 rounded-3xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {cursos.map((curso, index) => (
                  <motion.div
                    key={curso.cur_id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative rounded-3xl bg-white/5 border border-white/10 overflow-hidden hover:border-blue-500/50 transition-colors duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020617] opacity-60" />

                    <div className="relative p-8 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-6">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/20">
                          {getModalidadLabel(curso.cur_modalidad)}
                        </span>
                        <FaStar className="text-yellow-500/50" />
                      </div>

                      <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                        {curso.cur_descripcion}
                      </h3>

                      <div className="space-y-3 mb-8 text-gray-400 text-sm">
                        <div className="flex items-center gap-3">
                          <FaMapMarkerAlt className="text-blue-500" />
                          <span>{curso.cur_lugar}</span>
                        </div>
                        {curso.fechas && curso.fechas[0] && (
                          <div className="flex items-center gap-3">
                            <FaCalendar className="text-blue-500" />
                            <span>
                              {new Date(curso.fechas[0].cuf_fecha_inicio).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Valor</span>
                          <span className="text-xl font-bold text-white">
                            ${parseInt(curso.cur_cuota_sin_almuerzo).toLocaleString()}
                          </span>
                        </div>
                        <Button
                          onClick={() => navigate(`/preinscripcion?curso=${curso.cur_id}`)}
                          className="rounded-full bg-white text-black hover:bg-gray-200 font-medium px-6"
                        >
                          Inscribirse
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-12 text-center md:hidden">
              <Button
                onClick={() => navigate('/cursos')}
                className="w-full bg-white/5 border border-white/10 text-white"
              >
                Ver todos los cursos
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-[#020617] py-12 relative z-10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden">
                  <img src={scoutLogo} alt="GIC Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-gray-300">GIC Platform</span>
              </div>
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Gestión Integral de Cursos. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
