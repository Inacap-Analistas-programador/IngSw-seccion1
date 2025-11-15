import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-primary-foreground">Dashboard</h1>
          <div className="space-x-2">
            <button className="px-3 py-1 rounded bg-primary text-primary-foreground">
              Acciones
            </button>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
