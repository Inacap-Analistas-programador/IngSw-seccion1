import React, { useState } from 'react';
import DashboardPagos from './DashboardPagos';
import GestionPagos from './GestionPagos';
import ComprobantesPagos from './ComprobantesPagos';
import Prepagos from './Prepagos';
import HistorialPagos from './HistorialPagos';

const Pagos = () => {
  const [activeSection, setActiveSection] = useState('gestion'); // 'gestion', 'comprobantes', 'prepagos', 'historial'
  const [error, setError] = useState(null);

  const renderSection = () => {
    try {
      switch (activeSection) {
        case 'gestion':
          return <GestionPagos />;
        case 'comprobantes':
          return <ComprobantesPagos />;
        case 'prepagos':
          return <Prepagos />;
        case 'historial':
          return <HistorialPagos />;
        default:
          return null;
      }
    } catch (err) {
      console.error('Error al renderizar sección de pagos:', err);
      setError(err.message);
      return (
        <div className="p-4 text-red-600 bg-red-50 rounded-lg">
          <p className="font-semibold">Error al cargar la sección</p>
          <p className="text-sm mt-1">{err.message}</p>
        </div>
      );
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Módulo de Pagos</h1>
        <div className="p-4 text-red-600 bg-red-50 rounded-lg">
          <p className="font-semibold">Error al cargar el módulo de pagos</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setActiveSection('gestion');
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Módulo de Pagos</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <DashboardPagos />
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md ${activeSection === 'gestion' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveSection('gestion')}
        >
          Gestión de Pagos
        </button>
        <button
          className={`px-4 py-2 rounded-md ${activeSection === 'comprobantes' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveSection('comprobantes')}
        >
          Comprobantes
        </button>
        <button
          className={`px-4 py-2 rounded-md ${activeSection === 'prepagos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveSection('prepagos')}
        >
          Prepagos
        </button>
        <button
          className={`px-4 py-2 rounded-md ${activeSection === 'historial' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveSection('historial')}
        >
          Historial de Cambios
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">{renderSection()}</div>
    </div>
  );
};

export default Pagos;
