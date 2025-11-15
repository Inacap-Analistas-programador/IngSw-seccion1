import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, BookOpen } from 'lucide-react';
import Card from '@/components/ui/Card';

const maestros = [
  { name: 'Regiones', path: '/maestros/regiones' },
  { name: 'Provincias', path: '/maestros/provincias' },
  { name: 'Comunas', path: '/maestros/comunas' },
  { name: 'Zonas', path: '/maestros/zonas' },
  { name: 'Distritos', path: '/maestros/distritos' },
  { name: 'Grupos', path: '/maestros/grupos' },
  { name: 'Estados Civiles', path: '/maestros/estados-civiles' },
  { name: 'Cargos', path: '/maestros/cargos' },
  { name: 'Niveles', path: '/maestros/niveles' },
  { name: 'Ramas', path: '/maestros/ramas' },
  { name: 'Roles', path: '/maestros/roles' },
  { name: 'Tipos de Archivo', path: '/maestros/tipos-archivo' },
  { name: 'Tipos de Curso', path: '/maestros/tipos-curso' },
  { name: 'Alimentación', path: '/maestros/alimentaciones' },
  { name: 'Conceptos Contables', path: '/maestros/conceptos-contables' },
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
        <div className="bg-scout-azul-oscuro text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  className="text-white hover:bg-scout-azul-medio"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Volver
                </Button>
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-8 h-8" />
                  <h1 className="text-2xl font-bold">Gestión de Maestros</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maestros Grid */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {maestros.map((maestro, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300"
                onClick={() => navigate(maestro.path)}
              >
                <h2 className="text-xl font-semibold text-scout-azul-oscuro mb-2">
                  {maestro.name}
                </h2>
                <p className="text-gray-600">Gestionar {maestro.name.toLowerCase()}.</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MaestrosPage;
