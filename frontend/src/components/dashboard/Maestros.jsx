import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ExternalLink, GraduationCap } from 'lucide-react';

const Maestros = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-scout-azul-muy-claro flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-10 h-10 text-scout-azul-medio" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Visor de Atributos
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Accede al sistema de gestión de tablas maestras para administrar los atributos del sistema.
          </p>
          <div className="space-y-2 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button
              onClick={() => navigate('/maestros')}
              className="bg-scout-azul-medio hover:bg-scout-azul-oscuro w-full sm:w-auto"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Ver Tablas Maestras
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Maestros;
