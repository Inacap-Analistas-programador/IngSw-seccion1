import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import { Database } from 'lucide-react';

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

const Maestros = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Database className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Tablas Maestras del Sistema</h2>
        </div>
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
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {maestro.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Gestionar {maestro.name.toLowerCase()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Maestros;
