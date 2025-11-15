import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
      <Link
        to="/"
        className="flex items-center hover:text-scout-azul-oscuro transition-colors"
        aria-label="Inicio"
      >
        <Home className="w-4 h-4" />
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.href && index < items.length - 1 ? (
            <Link to={item.href} className="hover:text-scout-azul-oscuro transition-colors">
              {item.label}
            </Link>
          ) : (
            <span
              className={index === items.length - 1 ? 'font-medium text-scout-azul-oscuro' : ''}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
