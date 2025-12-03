import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { FaLock, FaEnvelope, FaCircleExclamation, FaEye, FaEyeSlash } from 'react-icons/fa6';
import { useToast } from '@/components/ui/use-toast';
import authService from '@/services/authService';
import scoutBg from '@/assets/scout-digital-bg.png';
import scoutLogo from '@/assets/scout-logo.png';

const CoordinatorLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/coordinador/dashboard/ejecutivo');
    }

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
        <title>Login Coordinador - GIC Platform</title>
        <meta name="description" content="Acceso para coordinadores de la plataforma GIC." />
      </Helmet>

      <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#020617]">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={scoutBg}
            alt="Background"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-[#020617]/70 to-[#020617]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md z-10 px-4"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 text-center border-b border-white/5">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20 overflow-hidden">
                <img src={scoutLogo} alt="GIC Logo" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Bienvenido de nuevo</h1>
              <p className="text-gray-400 text-sm">Ingresa tus credenciales para continuar</p>
            </div>

            <form onSubmit={handleLogin} className="p-8 space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-start text-sm">
                  <FaCircleExclamation className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="correo" className="text-gray-300">
                  Correo Electrónico
                </Label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="correo"
                    type="email"
                    placeholder="coordinador@scout.cl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl h-12"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contrasena" className="text-gray-300">
                  Contraseña
                </Label>
                <div className="relative group">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="contrasena"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl h-12"
                    required
                    minLength={8}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
                    disabled={loading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate('/')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
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
