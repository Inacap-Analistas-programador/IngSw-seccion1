import React from 'react';
import Card from '@/components/ui/Card';
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
          <p className="text-gray-600 mt-2">Gestión CRUD de personas registradas</p>
        </div>
        <Button
          onClick={() => navigate('/personas')}
          className="bg-scout-azul-medio hover:bg-scout-azul-oscuro"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Ver Lista CRUD
        </Button>
      </div>

      <Card>
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-scout-azul-medio mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Lista CRUD de Personas</h3>
          <p className="text-gray-600 mb-6">
            Ve, modifica y administra las personas registradas a través de la preinscripción.
          </p>
          <div className="space-y-2 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button
              onClick={() => navigate('/personas')}
              className="bg-scout-azul-medio hover:bg-scout-azul-oscuro w-full sm:w-auto"
            >
              <Users className="w-4 h-4 mr-2" />
              Ver Lista de Personas
            </Button>
            <Button
              onClick={() => navigate('/preinscripcion')}
              variant="outline"
              className="border-scout-azul-medio text-scout-azul-medio hover:bg-scout-azul-muy-claro w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Nueva Preinscripción
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Personas;
