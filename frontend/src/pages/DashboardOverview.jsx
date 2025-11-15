import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';

const Card = ({ to, title, desc }) => (
  <Link to={to} className="block p-4 rounded-lg bg-card hover:shadow-md">
    <h3 className="text-lg font-semibold text-primary-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground mt-1">{desc}</p>
  </Link>
);

const DashboardOverview = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Personas management is handled in a separate module/repo; card removed */}
        <Card
          to="/dashboard/gestion-pagos"
          title="Pagos"
          desc="Registrar y gestionar pagos y comprobantes."
        />
        <Card to="/dashboard/gestion-cursos" title="Cursos" desc="Gestionar cursos y cuotas." />
        <Card
          to="/dashboard/inscripciones"
          title="Inscripciones"
          desc="Ver y gestionar inscripciones."
        />
        <Card
          to="/dashboard/preinscripcion"
          title="Preinscripción"
          desc="Revisar solicitudes de preinscripción."
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;
