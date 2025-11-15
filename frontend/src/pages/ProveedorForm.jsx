import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import api from '@/config/api';
import { proveedorFromApi, proveedorToApi } from '@/lib/mappers';

const ProveedorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    descripcion: '',
    celular1: '',
    celular2: '',
    direccion: '',
    observacion: '',
    vigente: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const response = await api.get(`/proveedores/${id}/`);
          setFormData(proveedorFromApi(response.data));
        } catch (err) {
          // fallback to localStorage
          const proveedores = JSON.parse(localStorage.getItem('proveedores') || '[]');
          const proveedor = proveedores.find((p) => p.id === parseInt(id));
          if (proveedor) setFormData(proveedor);
        }
      })();
    }
  }, [id, isEdit]);

  const validate = () => {
    if (!formData.descripcion) {
      alert('Descripción es requerida');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const proveedores = JSON.parse(localStorage.getItem('proveedores') || '[]');
      if (isEdit) {
        try {
          await api.put(`/proveedores/${id}/`, proveedorToApi({ ...formData, id: parseInt(id) }));
          console.log('Proveedor actualizado en API');
        } catch (err) {
          const index = proveedores.findIndex((p) => p.id === parseInt(id));
          if (index !== -1) proveedores[index] = { ...formData, id: parseInt(id) };
        }
      } else {
        const newProveedor = { ...formData, id: Date.now() };
        try {
          await api.post('/proveedores/', proveedorToApi(newProveedor));
          console.log('Proveedor creado en API');
        } catch (err) {
          proveedores.push(newProveedor);
        }
      }

      localStorage.setItem('proveedores', JSON.stringify(proveedores));
      navigate('/proveedores');
    } catch (error) {
      console.error('Error al guardar proveedor', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Editar' : 'Nuevo'} Proveedor - Scout Formación</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Editar' : 'Nuevo'} Proveedor</h1>
          <form onSubmit={handleSubmit} className="max-w-xl">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <input
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Nombre o razón social"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Celular 1</label>
              <input
                value={formData.celular1}
                onChange={(e) => handleChange('celular1', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="+56912345678"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <input
                value={formData.direccion}
                onChange={(e) => handleChange('direccion', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Dirección del proveedor"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Observación</label>
              <textarea
                value={formData.observacion}
                onChange={(e) => handleChange('observacion', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Notas o comentarios opcionales"
              />
            </div>

            <div className="flex space-x-3">
              <Button
                disabled={loading}
                className="bg-scout-azul-medio hover:bg-scout-azul-oscuro"
                type="submit"
              >
                Guardar
              </Button>
              <Button variant="ghost" onClick={() => navigate('/proveedores')}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProveedorForm;
