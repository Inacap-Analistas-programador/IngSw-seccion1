import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ExternalLink, GraduationCap, UserPlus } from 'lucide-react';

const Maestros = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maestros/Formadores</h1>
          <p className="text-gray-600 mt-2">Gestión de formadores del sistema</p>
        </div>
        <Button
          onClick={() => navigate('/maestros')}
          className="bg-scout-azul-medio hover:bg-scout-azul-oscuro"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Ir a Gestión Completa
        </Button>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-scout-azul-muy-claro flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-10 h-10 text-scout-azul-medio" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Gestión Completa de Formadores
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Accede al sistema completo de gestión de formadores para administrar habilitaciones,
            verificaciones y el historial de capacitaciones.
          </p>
          <div className="space-y-2 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button
              onClick={() => navigate('/maestros')}
              className="bg-scout-azul-medio hover:bg-scout-azul-oscuro w-full sm:w-auto"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Ver Todos los Formadores
            </Button>
            <Button
              onClick={() => navigate('/maestros/nuevo')}
              variant="outline"
              className="border-scout-azul-medio text-scout-azul-medio hover:bg-scout-azul-muy-claro w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Crear Nuevo Formador
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Maestros;
