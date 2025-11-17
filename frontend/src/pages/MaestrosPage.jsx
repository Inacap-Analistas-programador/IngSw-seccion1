import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, BookOpen, Database } from 'lucide-react';
import Card from '@/components/ui/Card';

const maestros = [
  { name: 'Regiones', path: '/geografia/regiones', icon: '🗺️' },
  { name: 'Provincias', path: '/geografia/provincias', icon: '📍' },
  { name: 'Comunas', path: '/geografia/comunas', icon: '🏘️' },
  { name: 'Zonas', path: '/geografia/zonas', icon: '🌐' },
  { name: 'Distritos', path: '/geografia/distritos', icon: '📌' },
  { name: 'Grupos', path: '/geografia/grupos', icon: '👥' },
  { name: 'Estados Civiles', path: '/maestros/estados-civiles', icon: '💑' },
  { name: 'Cargos', path: '/maestros/cargos', icon: '👔' },
  { name: 'Niveles', path: '/maestros/niveles', icon: '📊' },
  { name: 'Ramas', path: '/maestros/ramas', icon: '🌳' },
  { name: 'Roles', path: '/maestros/roles', icon: '🎭' },
  { name: 'Tipos de Archivo', path: '/maestros/tipos-archivo', icon: '📄' },
  { name: 'Tipos de Curso', path: '/maestros/tipos-curso', icon: '📚' },
  { name: 'Alimentación', path: '/maestros/alimentaciones', icon: '🍽️' },
  { name: 'Conceptos Contables', path: '/maestros/conceptos-contables', icon: '💰' },
];

const MaestrosPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Gestión de Maestros - Scout Formación</title>
        <meta name="description" content="Administración de tablas maestras del sistema." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-primary text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  className="text-white hover:bg-primary/90"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Volver
                </Button>
                <div className="flex items-center space-x-3">
                  <Database className="w-8 h-8" />
                  <div>
                    <h1 className="text-2xl font-bold">Gestión de Maestros</h1>
                    <p className="text-sm text-white/80">Vista general de todas las tablas maestras</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maestros Grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Tablas Maestras del Sistema</h2>
            <p className="text-gray-600">
              Gestiona los datos base y configuraciones del sistema desde un solo lugar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {maestros.map((maestro, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                onClick={() => navigate(maestro.path)}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-3xl">{maestro.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors">
                      {maestro.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Gestionar {maestro.name.toLowerCase()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MaestrosPage;
