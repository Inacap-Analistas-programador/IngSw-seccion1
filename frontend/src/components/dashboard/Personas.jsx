import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ExternalLink, Users, UserPlus } from 'lucide-react';

const Personas = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Personas</h1>
          <p className="text-gray-600 mt-2">Gestión de personas registradas</p>
        </div>
        <Button 
          onClick={() => navigate('/personas')}
          className="bg-scout-azul-medio hover:bg-scout-azul-oscuro"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Ir a Gestión Completa
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-scout-azul-medio mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Gestión Completa de Personas
          </h3>
          <p className="text-gray-600 mb-6">
            Accede al sistema completo de gestión de personas para crear, editar, buscar y administrar todos los registros.
          </p>
          <div className="space-y-2 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button 
              onClick={() => navigate('/personas')}
              className="bg-scout-azul-medio hover:bg-scout-azul-oscuro w-full sm:w-auto"
            >
              <Users className="w-4 h-4 mr-2" />
              Ver Todas las Personas
            </Button>
            <Button 
              onClick={() => navigate('/personas/nuevo')}
              variant="outline"
              className="border-scout-azul-medio text-scout-azul-medio hover:bg-scout-azul-muy-claro w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Nueva Persona
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personas;