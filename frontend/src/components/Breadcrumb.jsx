import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap = {
    coordinador: 'Coordinador',
    dashboard: 'Dashboard',
    panel: 'Panel',
    ejecutivo: 'Dashboard Ejecutivo',
    'gestion-cursos': 'Gestión de Cursos',
    inscripciones: 'Inscripciones',
    preinscripcion: 'Preinscripción',
    'gestion-pagos': 'Gestión de Pagos',
    'envio-correos': 'Envío de Correos',
    acreditacion: 'Acreditación',
    maestros: 'Maestros',
    'acreditacion-manual': 'Acreditación Manual',
    'verificador-qr': 'Verificador QR',
    proveedores: 'Proveedores',
    'use-cases': 'Casos de Uso',
  };

  return (
    <nav className="flex items-center" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-scout-azul-medio transition-colors"
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const displayName =
            breadcrumbNameMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

          if (index === 0 && value === 'coordinador') return null; // Skip 'coordinador' root

          return (
            <li key={to} className="inline-flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
              {last ? (
                <span className="text-sm font-semibold text-scout-azul-oscuro">
                  {displayName}
                </span>
              ) : (
                <Link
                  to={to}
                  className={cn(
                    'text-sm font-medium text-gray-500 hover:text-scout-azul-medio transition-colors'
                  )}
                >
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
