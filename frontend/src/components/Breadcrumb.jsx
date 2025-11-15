import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap = {
    coordinador: 'Coordinador',
    dashboard: 'Dashboard',
    ejecutivo: 'Dashboard Ejecutivo',
    'gestion-cursos': 'Gestión de Cursos',
    preinscripcion: 'Preinscripción',
    'gestion-pagos': 'Gestión de Pagos',
    'gestion-personas': 'Gestión de Personas',
    'envio-correos': 'Envío de Correos',
    acreditacion: 'Acreditación',
    maestros: 'Maestros',
    'acreditacion-manual': 'Acreditación Manual',
    'verificador-qr': 'Verificador QR',
  };

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const displayName =
            breadcrumbNameMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

          if (index === 0) return null; // Skip 'coordinador'

          return (
            <li key={to} className="inline-flex items-center">
              {index > 1 && <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />}
              {last ? (
                <span className="text-sm font-medium text-gray-800">{displayName}</span>
              ) : (
                <Link
                  to={to}
                  className="text-sm font-medium text-gray-500 hover:text-primary-foreground"
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
