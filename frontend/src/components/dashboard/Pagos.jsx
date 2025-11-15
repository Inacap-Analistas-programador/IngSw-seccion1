import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/use-toast';
import useFetch from '@/hooks/useFetch';
import { getPayments, createPayment, deletePayment } from '@/lib/api';

const Pagos = () => {
  const { toast } = useToast();
  const { data: pagos = [], loading, error, load } = useFetch(getPayments, true, []);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    per_id: '',
    cur_id: '',
    pap_tipo: 1,
    pap_valor: '',
    pap_observacion: '',
  });

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (ev) => {
    ev.preventDefault();
    try {
      const payload = {
        per_id: Number(form.per_id) || null,
        cur_id: Number(form.cur_id) || null,
        pap_tipo: Number(form.pap_tipo),
        pap_valor: Number(form.pap_valor) || 0,
        pap_observacion: form.pap_observacion || null,
      };
      await createPayment(payload);
      toast({ description: 'Pago registrado correctamente.' });
      setShowForm(false);
      setForm({ per_id: '', cur_id: '', pap_tipo: 1, pap_valor: '', pap_observacion: '' });
      load();
    } catch (err) {
      toast({ description: `Error al crear pago: ${err.message || err}` });
    }
  };

  const onDelete = async (id) => {
    if (!confirm('¿Eliminar pago? Esta acción no se puede deshacer.')) return;
    try {
      await deletePayment(id);
      toast({ description: 'Pago eliminado.' });
      load();
    } catch (err) {
      toast({ description: `Error al eliminar: ${err.message || err}` });
    }
  };

  const rows = useMemo(() => (Array.isArray(pagos) ? pagos : []), [pagos]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary-foreground">Pagos</h1>
          <p className="text-muted-foreground mt-2">Gestión de pagos y transacciones</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-primary text-primary-foreground hover:opacity-90"
        >
          Registrar Pago
        </Button>
      </div>

      {/* Sección de filtros para listar pagos */}
      <div className="bg-card rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Filtros de Pagos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block">
            <div className="text-sm text-muted-foreground">Filtrar por Persona</div>
            <input
              type="text"
              placeholder="ID o Nombre de Persona"
              className="mt-1 w-full rounded-md p-2 bg-input text-card-foreground"
            />
          </label>
          <label className="block">
            <div className="text-sm text-muted-foreground">Filtrar por Curso</div>
            <input
              type="text"
              placeholder="ID o Nombre de Curso"
              className="mt-1 w-full rounded-md p-2 bg-input text-card-foreground"
            />
          </label>
          <label className="block">
            <div className="text-sm text-muted-foreground">Filtrar por Fecha</div>
            <input
              type="date"
              className="mt-1 w-full rounded-md p-2 bg-input text-card-foreground"
            />
          </label>
        </div>
        <Button className="mt-4 bg-secondary text-secondary-foreground hover:opacity-90">
          Aplicar Filtros
        </Button>
      </div>

      <div className="bg-card rounded-lg shadow-md p-6">
        {loading && <p className="text-muted-foreground">Cargando pagos...</p>}
        {error && (
          <p className="text-destructive-foreground">Error: {String(error.message || error)}</p>
        )}

        {!loading && rows.length === 0 && (
          <p className="text-muted-foreground">No hay pagos registrados.</p>
        )}

        {!loading && rows.length > 0 && (
          <div className="overflow-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="py-2 px-3 text-sm text-muted-foreground">ID</th>
                  <th className="py-2 px-3 text-sm text-muted-foreground">Fecha</th>
                  <th className="py-2 px-3 text-sm text-muted-foreground">Persona</th>
                  <th className="py-2 px-3 text-sm text-muted-foreground">Curso</th>
                  <th className="py-2 px-3 text-sm text-muted-foreground">Tipo</th>
                  <th className="py-2 px-3 text-sm text-muted-foreground">Valor</th>
                  <th className="py-2 px-3 text-sm text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.pap_id} className="odd:bg-background/60">
                    <td className="py-2 px-3">{p.pap_id}</td>
                    <td className="py-2 px-3">{p.pap_fecha_hora || p.pap_fecha || ''}</td>
                    <td className="py-2 px-3">{p.per_id}</td>
                    <td className="py-2 px-3">{p.cur_id}</td>
                    <td className="py-2 px-3">{p.pap_tipo === 1 ? 'Ingreso' : 'Egreso'}</td>
                    <td className="py-2 px-3">{p.pap_valor}</td>
                    <td className="py-2 px-3 flex gap-2">
                      <button className="text-blue-500 underline">Ver Detalle</button>
                      <button className="text-yellow-500 underline">Editar</button>
                      <button
                        onClick={() => onDelete(p.pap_id)}
                        className="text-destructive-foreground underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sección de Gestión de Comprobantes */}
      <div className="bg-card rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Gestión de Comprobantes de Pago</h2>
        <p className="text-muted-foreground">
          Aquí se gestionarán los comprobantes de pago, se emitirán nuevos y se verá el historial.
        </p>
        <div className="flex gap-2 mt-4">
          <Button className="bg-primary text-primary-foreground hover:opacity-90">
            Emitir Comprobante
          </Button>
          <Button className="bg-secondary text-secondary-foreground hover:opacity-90">
            Ver Historial de Comprobantes
          </Button>
        </div>
      </div>

      {/* Sección de Historial de Cambios en Pagos */}
      <div className="bg-card rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Historial de Cambios en Pagos</h2>
        <p className="text-muted-foreground">
          Aquí se mostrará un registro de todos los cambios realizados en los pagos.
        </p>
        <Button className="mt-4 bg-secondary text-secondary-foreground hover:opacity-90">
          Ver Historial Completo
        </Button>
      </div>

      {/* Sección de Gestión de Prepagos */}
      <div className="bg-card rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Gestión de Prepagos</h2>
        <p className="text-muted-foreground">Funcionalidad para administrar pagos anticipados.</p>
        <Button className="mt-4 bg-primary text-primary-foreground hover:opacity-90">
          Registrar Prepago
        </Button>
      </div>

      {/* Sección de Dashboard de Pagos */}
      <div className="bg-card rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Dashboard de Pagos</h2>
        <p className="text-muted-foreground">
          Resumen visual de totales, pagos pendientes y pagos por curso.
        </p>
        <Button className="mt-4 bg-primary text-primary-foreground hover:opacity-90">
          Ver Dashboard
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <form
            onSubmit={onSubmit}
            className="relative bg-card text-card-foreground rounded-lg p-6 w-full max-w-md shadow-lg"
          >
            <h2 className="text-lg font-semibold mb-4">Registrar Pago</h2>
            <div className="space-y-3">
              <label className="block">
                <div className="text-sm text-muted-foreground">Persona ID</div>
                <input
                  name="per_id"
                  value={form.per_id}
                  onChange={onChange}
                  className="mt-1 w-full rounded-md p-2 bg-input text-card-foreground"
                />
              </label>
              <label className="block">
                <div className="text-sm text-muted-foreground">Curso ID</div>
                <input
                  name="cur_id"
                  value={form.cur_id}
                  onChange={onChange}
                  className="mt-1 w-full rounded-md p-2 bg-input text-card-foreground"
                />
              </label>
              <label className="block">
                <div className="text-sm text-muted-foreground">Tipo</div>
                <select
                  name="pap_tipo"
                  value={form.pap_tipo}
                  onChange={onChange}
                  className="mt-1 w-full rounded-md p-2 bg-input text-card-foreground"
                >
                  <option value={1}>Ingreso</option>
                  <option value={2}>Egreso</option>
                </select>
              </label>
              <label className="block">
                <div className="text-sm text-muted-foreground">Valor</div>
                <input
                  name="pap_valor"
                  value={form.pap_valor}
                  onChange={onChange}
                  type="number"
                  step="0.01"
                  className="mt-1 w-full rounded-md p-2 bg-input text-card-foreground"
                />
              </label>
              <label className="block">
                <div className="text-sm text-muted-foreground">Observación</div>
                <input
                  name="pap_observacion"
                  value={form.pap_observacion}
                  onChange={onChange}
                  className="mt-1 w-full rounded-md p-2 bg-input text-card-foreground"
                />
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-muted text-muted-foreground"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Guardar
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Pagos;
