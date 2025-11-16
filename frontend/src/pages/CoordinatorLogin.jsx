import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { FaAward, FaLock, FaEnvelope, FaCircleExclamation } from 'react-icons/fa6';
import { useToast } from '@/components/ui/use-toast';
import authService from '@/services/authService';

const CoordinatorLogin = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar si ya está autenticado
    if (authService.isAuthenticated()) {
      navigate('/coordinador/dashboard/ejecutivo');
    }

    // Mostrar mensaje si la sesión expiró
    const reason = searchParams.get('reason');
    if (reason === 'timeout') {
      toast({
        title: 'Sesión Expirada',
        description: 'Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.',
        variant: 'destructive',
      });
    }
  }, [navigate, searchParams, toast]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(email, password);

      toast({
        title: '¡Bienvenido!',
        description: 'Inicio de sesión exitoso.',
      });

      setTimeout(() => {
        navigate('/coordinador/dashboard/ejecutivo');
      }, 500);
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Error de inicio de sesión',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login Coordinador - Scout Formación</title>
        <meta name="description" content="Acceso para coordinadores de la plataforma Scout." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary to-primary/90 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="bg-primary text-primary-foreground p-8 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <FaAward className="w-10 h-10 text-[#001558]" />
              </div>
              <h1 className="text-3xl font-bold">Portal Coordinador</h1>
              <p className="text-primary-foreground mt-2">Scout Formación</p>
            </div>

            <form onSubmit={handleLogin} className="p-8 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start">
                  <FaCircleExclamation className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="correo" className="text-gray-700">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="correo"
                    type="email"
                    placeholder="coordinador@scout.cl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-primary focus:ring-primary/30"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contrasena" className="text-gray-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="contrasena"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-primary focus:ring-primary/30"
                    required
                    minLength={8}
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>

              <div className="text-center text-sm text-gray-600 mt-4">
                <p>Credenciales de desarrollo:</p>
                <p className="font-mono text-xs mt-1">admin@test.com / Admin123!</p>
                <p className="font-mono text-xs mt-1">coordinador@test.com / Coord123!</p>
                <p className="font-mono text-xs mt-1">dirigente@test.com / Dirig123!</p>
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate('/')}
                  className="text-[#001558] hover:text-primary-foreground"
                >
                  Volver al Inicio
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default CoordinatorLogin;
