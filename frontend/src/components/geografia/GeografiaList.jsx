import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, Edit, Trash2, ChevronLeft, MapPin, Eye, Ban, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import geografiaService from '@/services/geografiaService';

const MaestrosList = ({ maestroType, title, fields, idField = 'id', statusField = 'vigente' }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    loadItems();
  }, [maestroType]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await geografiaService.getList(maestroType);
      setItems(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    // Initialize with empty values for all fields except status
    const newItem = fields.reduce((acc, field) => {
      // Skip status field - it will be set automatically on backend
      if (field.key !== statusField && !field.key.includes('vigente') && !field.key.includes('estado')) {
        acc[field.key] = '';
      }
      return acc;
    }, {});
    // Set status as ACTIVE by default (will be handled on backend)
    newItem[statusField] = true;
    setCurrentItem(newItem);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setCurrentItem({ ...item });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleView = (item) => {
    setCurrentItem({ ...item });
    setShowViewModal(true);
  };

  const handleToggleStatus = async (item) => {
    const newStatus = !item[statusField];
    const actionText = newStatus ? 'ACTIVAR' : 'ANULAR';
    
    if (!window.confirm(`¿Está seguro de que desea ${actionText} este registro? ESTA ACCIÓN NO SE PUEDE DESHACER.`)) {
      return;
    }

    try {
      const updatedItem = { ...item, [statusField]: newStatus };
      await geografiaService.update(maestroType, item[idField], updatedItem);
      setItems((prev) =>
        prev.map((i) => (i[idField] === item[idField] ? updatedItem : i))
      );
      toast({
        title: newStatus ? 'Activado' : 'Anulado',
        description: `El registro ha sido ${newStatus ? 'activado' : 'anulado'} correctamente.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `No se pudo ${newStatus ? 'activar' : 'anular'} el registro.`,
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    try {
      if (isEdit) {
        await geografiaService.update(maestroType, currentItem[idField], currentItem);
        setItems((prev) =>
          prev.map((item) => (item[idField] === currentItem[idField] ? currentItem : item))
        );
        toast({
          title: 'Actualizado',
          description: 'El registro ha sido actualizado correctamente.',
        });
      } else {
        const newItem = await geografiaService.create(maestroType, currentItem);
        setItems((prev) => [...prev, newItem]);
        toast({
          title: 'Creado',
          description: 'El registro ha sido creado correctamente.',
        });
      }
      setShowModal(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el registro.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteConfirm = (item) => {
    setCurrentItem(item);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await geografiaService.delete(maestroType, currentItem[idField]);
      setItems((prev) => prev.filter((item) => item[idField] !== currentItem[idField]));
      toast({
        title: 'Eliminado',
        description: 'El registro ha sido eliminado correctamente.',
      });
      setShowDeleteModal(false);
    } catch (error) {
      // Handle cascade deletion errors
      const errorMessage = error.response?.data?.message || error.message || 'No se pudo eliminar el registro.';
      const isCascadeError = errorMessage.includes('referencia') || 
                            errorMessage.includes('relacionado') || 
                            errorMessage.includes('constraint') ||
                            errorMessage.includes('foreign key');
      
      toast({
        title: 'Error',
        description: isCascadeError 
          ? 'No se puede eliminar el registro porque está siendo utilizado en otros registros del sistema.'
          : errorMessage,
        variant: 'destructive',
      });
    }
  };

  const filteredItems = items.filter((item) => {
    const searchStr = searchTerm.toLowerCase();
    return fields.some((field) => {
      const value = item[field.key];
      return value && value.toString().toLowerCase().includes(searchStr);
    });
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/geografia')}
                className="text-white hover:bg-primary/90"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                VOLVER
              </Button>
              <div className="flex items-center space-x-3">
                <MapPin className="w-8 h-8" />
                <h1 className="text-2xl font-bold">{title}</h1>
              </div>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              NUEVO
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Search */}
        <Card className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="BUSCAR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {fields.map((field) => (
                    <th
                      key={field.key}
                      className="text-left py-3 px-4 text-sm font-semibold text-gray-700"
                    >
                      {field.label}
                    </th>
                  ))}
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={fields.length + 1} className="text-center py-8 text-gray-500">
                      CARGANDO...
                    </td>
                  </tr>
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <motion.tr
                      key={item[idField]}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      {fields.map((field) => (
                        <td key={field.key} className="py-3 px-4 text-sm text-gray-700">
                          {field.render ? field.render(item[field.key]) : item[field.key]}
                        </td>
                      ))}
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleView(item)}
                            variant="ghost"
                            size="sm"
                            title="VER"
                            className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleEdit(item)}
                            variant="ghost"
                            size="sm"
                            title="EDITAR"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleToggleStatus(item)}
                            variant="ghost"
                            size="sm"
                            title={item[statusField] ? 'ANULAR' : 'ACTIVAR'}
                            className={item[statusField] 
                              ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                              : 'text-green-600 hover:text-green-700 hover:bg-green-50'}
                          >
                            {item[statusField] ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={fields.length + 1} className="text-center py-8 text-gray-500">
                      NO SE ENCONTRARON REGISTROS
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Edit/Create Modal */}
      {showModal && currentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                {isEdit ? 'EDITAR' : 'NUEVO'} {title.toUpperCase()}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields
                  .filter(field => 
                    // Exclude status field from forms as per requirements
                    field.key !== statusField && 
                    !field.key.includes('vigente') && 
                    !field.key.includes('estado')
                  )
                  .map((field) => (
                  <div key={field.key} className={field.fullWidth ? 'md:col-span-2' : ''}>
                    <label className="text-sm text-gray-600 font-medium">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={currentItem[field.key] || ''}
                        onChange={(e) => {
                          const upperValue = e.target.value.toUpperCase();
                          setCurrentItem({ ...currentItem, [field.key]: upperValue });
                        }}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                        rows={3}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        value={currentItem[field.key] || ''}
                        onChange={(e) =>
                          setCurrentItem({ ...currentItem, [field.key]: e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">SELECCIONAR...</option>
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        type={field.type || 'text'}
                        value={currentItem[field.key] || ''}
                        onChange={(e) =>
                          setCurrentItem({ ...currentItem, [field.key]: e.target.value })
                        }
                        className="mt-1"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-6 flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  CANCELAR
                </Button>
                <Button onClick={handleSave}>GUARDAR</Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">CONFIRMAR ELIMINACIÓN</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                ¿ESTÁ SEGURO DE QUE DESEA ELIMINAR ESTE REGISTRO?
              </p>
              <p className="text-red-600 font-bold text-sm mt-2">ESTA ACCIÓN NO SE PUEDE DESHACER.</p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                CANCELAR
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                ELIMINAR
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && currentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">VER {title}</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field.key} className={field.fullWidth ? 'md:col-span-2' : ''}>
                    <label className="text-sm text-gray-600 font-medium uppercase">{field.label}</label>
                    <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                      {field.render ? field.render(currentItem[field.key]) : currentItem[field.key] || '-'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-6 flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                  CERRAR
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MaestrosList;
