import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ className = '' }) => {
  return (
    <aside
      className={`w-64 bg-card text-card-foreground ${className} flex flex-col justify-center`}
    >
      <div className="px-4 py-2" style={{ borderColor: 'hsl(var(--border) / 0.6)' }}>
        <h2 className="text-xl font-bold text-primary-foreground">Panel</h2>
      </div>
      <nav className="p-4 flex-1 flex flex-col justify-center">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-3 px-3 py-2 rounded hover:bg-primary/10 w-full text-left"
            >
              <span className="flex-0">Inicio</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/gestion-personas"
              className="inline-flex items-center gap-3 px-3 py-2 rounded hover:bg-primary/10 w-full text-left"
            >
              <span className="flex-0">Personas</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/gestion-pagos"
              className="inline-flex items-center gap-3 px-3 py-2 rounded hover:bg-primary/10 w-full text-left"
            >
              <span className="flex-0">Pagos</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/gestion-cursos"
              className="inline-flex items-center gap-3 px-3 py-2 rounded hover:bg-primary/10 w-full text-left"
            >
              <span className="flex-0">Cursos</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/inscripciones"
              className="inline-flex items-center gap-3 px-3 py-2 rounded hover:bg-primary/10 w-full text-left"
            >
              <span className="flex-0">Inscripciones</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/preinscripcion"
              className="inline-flex items-center gap-3 px-3 py-2 rounded hover:bg-primary/10 w-full text-left"
            >
              <span className="flex-0">Preinscripción</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
