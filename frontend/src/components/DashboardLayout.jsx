import React from 'react';
import Sidebar from './Sidebar';
import SectionHeader from './ui/SectionHeader';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 p-6">
        <SectionHeader title="Dashboard" subtitle="Bienvenido al panel de gestión" actions={<div className="space-x-2"><button className="px-3 py-1 rounded bg-primary text-primary-foreground">Acciones</button></div>} />

        <main>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
