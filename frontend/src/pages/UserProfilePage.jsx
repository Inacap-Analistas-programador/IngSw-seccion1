import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import authService from '@/services/authService';
import api from '@/config/api';
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaArrowLeft,
  FaShieldAlt,
  FaImage,
} from 'react-icons/fa';
import { Loader2 } from 'lucide-react';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        navigate('/coordinador/login');
        return;
      }

      // Fetch full user info from the API
      const response = await api.get('/auth/me/');
      setUser(response.data);
    } catch (err) {
      console.error('Error loading profile:', err);
      // Fall back to data stored in session if the API call fails
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        setError('No se pudo cargar la información del perfil.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p>{error || 'No se pudo cargar el perfil.'}</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            <FaArrowLeft className="mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  const displayName = user.name || user.username || '—';

  return (
    <>
      <Helmet>
        <title>Mi Perfil - GIC Platform</title>
        <meta name="description" content="Información de tu cuenta de usuario." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 text-white py-8">
          <div className="container mx-auto px-4">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="text-white hover:bg-white/10 mb-4"
            >
              <FaArrowLeft className="mr-2" />
              Volver
            </Button>
            <h1 className="text-4xl font-bold">Mi Perfil</h1>
            <p className="text-blue-100 mt-2">Información de tu cuenta</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
              <FaUser className="mr-2 text-blue-600" />
              Datos de la Cuenta
            </h2>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                {user.foto ? (
                  <img
                    src={user.foto}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaImage className="text-blue-400 text-2xl" />
                )}
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-900">
                  {displayName}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                  {user.rol || user.perfil || 'Usuario'}
                </span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaIdCard className="inline mr-1 text-gray-400" />
                  ID de Usuario
                </label>
                <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-mono">
                  {user.id}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaUser className="inline mr-1 text-gray-400" />
                  Nombre de Usuario
                </label>
                <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                  {displayName}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaEnvelope className="inline mr-1 text-gray-400" />
                  Correo Electrónico
                </label>
                <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                  {user.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaShieldAlt className="inline mr-1 text-gray-400" />
                  Perfil / Rol
                </label>
                <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                  {user.rol || user.perfil || '—'}
                </p>
              </div>
            </motion.div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
