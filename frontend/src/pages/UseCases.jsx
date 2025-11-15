import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/use-toast';

const cases = [
  {
    id: 'registrar-pago',
    title: 'Registrar Pago',
    desc: 'Crear un pago asociado a una persona y curso (placeholder)',
    path: '/dashboard/gestion-pagos',
  },
  {
    id: 'emitir-comprobante',
    title: 'Emitir Comprobante',
    desc: 'Generar comprobante y asociarlo a pagos (placeholder)',
    path: '/dashboard/gestion-pagos',
  },
  {
    id: 'anular-pago',
    title: 'Anular / Revertir Pago',
    desc: 'Marcar pago como anulado y registrar trazabilidad (placeholder)',
    path: '/dashboard/gestion-pagos',
  },
  {
    id: 'registrar-prepago',
    title: 'Registrar Prepago',
    desc: 'Registrar pagos parciales o reservas (placeholder)',
    path: '/dashboard/preinscripcion',
  },
  {
    id: 'reasignar-pago',
    title: 'Reasignar Pago',
    desc: 'Cambiar el pago a otra persona con registro (placeholder)',
    path: '/dashboard/gestion-pagos',
  },
  {
    id: 'conciliacion',
    title: 'Conciliación y Reportes',
    desc: 'Generar reportes y exportar para contabilidad (placeholder)',
    path: '/dashboard/ejecutivo',
  },
  {
    id: 'gestion-cuotas',
    title: 'Gestión de Cuotas',
    desc: 'Validar pagos respecto a cuotas del curso (placeholder)',
    path: '/dashboard/gestion-cursos',
  },
  {
    id: 'historial',
    title: 'Consultar Historial de Pagos',
    desc: 'Ver historial por persona o curso (placeholder)',
    path: '/dashboard/gestion-pagos',
  },
  {
    id: 'adjuntar-comprobante',
    title: 'Adjuntar/Consultar Comprobante',
    desc: 'Subir o visualizar comprobantes (placeholder)',
    path: '/dashboard/gestion-pagos',
  },
  {
    id: 'auditoria',
    title: 'Auditoría y Seguridad',
    desc: 'Ver trazabilidad de cambios en pagos (placeholder)',
    path: '/dashboard/ejecutivo',
  },
];

const UseCases = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const go = (c) => {
    // try to navigate to a target page if exists
    if (c.path) {
      navigate(c.path);
      toast({ description: `Navegando a ${c.title} (placeholder)` });
    } else {
      toast({ description: `Acción de placeholder: ${c.title}` });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Casos de Uso - Módulo Pagos</h1>
        <p className="text-muted-foreground mt-2">
          Lista de casos de uso implementados como placeholders en el frontend.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cases.map((c) => (
          <div key={c.id} className="p-4 rounded-lg bg-card shadow-sm">
            <h3 className="text-lg font-semibold text-primary-foreground">{c.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
            <div className="mt-3">
              <Button onClick={() => go(c)} className="bg-primary text-primary-foreground">
                Abrir placeholder
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UseCases;
