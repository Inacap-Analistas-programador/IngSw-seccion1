import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  UserPlus,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  FileText,
  Filter,
  Download,
  Edit,
  Trash2,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import preinscripcionService from '@/services/preinscripcionService';

const Inscripciones = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  // Load data on mount
  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await preinscripcionService.getAll();
      setSubmissions(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las inscripciones. Usando datos de ejemplo.',
        variant: 'destructive',
      });
      // Fallback to mock data
      setSubmissions([
        {
          id: 1,
          nombre: 'Juan Pérez González',
          email: 'juan.perez@email.com',
          telefono: '+56912345678',
          fechaEnvio: '2024-01-15 10:30',
          estado: 'pendiente',
          curso: 'Formación Básica Scout',
          edad: 15,
          grupoScout: 'Grupo Scout San Jorge',
        },
        {
          id: 2,
          nombre: 'María Silva Rodríguez',
          email: 'maria.silva@email.com',
          telefono: '+56923456789',
          fechaEnvio: '2024-01-14 14:20',
          estado: 'aprobada',
          curso: 'Curso de Liderazgo',
          edad: 17,
          grupoScout: 'Grupo Scout Santa María',
        },
        {
          id: 3,
          nombre: 'Carlos Muñoz López',
          email: 'carlos.munoz@email.com',
          telefono: '+56934567890',
          fechaEnvio: '2024-01-13 09:15',
          estado: 'rechazada',
          curso: 'Formación Básica Scout',
          edad: 14,
          grupoScout: 'Grupo Scout Montaña',
        },
        {
          id: 4,
          nombre: 'Ana Torres Vargas',
          email: 'ana.torres@email.com',
          telefono: '+56945678901',
          fechaEnvio: '2024-01-12 16:45',
          estado: 'pendiente',
          curso: 'Especialidades Scout',
          edad: 16,
          grupoScout: 'Grupo Scout Aventura',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: 'Total Envíos',
      value: submissions.length,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      label: 'Pendientes',
      value: submissions.filter((s) => s.estado === 'pendiente').length,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      label: 'Aprobadas',
      value: submissions.filter((s) => s.estado === 'aprobada').length,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      label: 'Rechazadas',
      value: submissions.filter((s) => s.estado === 'rechazada').length,
      icon: XCircle,
      color: 'bg-red-500',
    },
  ];

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      aprobada: 'bg-green-100 text-green-800 border-green-200',
      rechazada: 'bg-red-100 text-red-800 border-red-200',
    };
    const labels = {
      pendiente: 'Pendiente',
      aprobada: 'Aprobada',
      rechazada: 'Rechazada',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badges[estado]}`}>
        {labels[estado]}
      </span>
    );
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await preinscripcionService.updateStatus(id, newStatus);
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, estado: newStatus } : sub))
      );
      toast({
        title: 'Estado actualizado',
        description: `La inscripción ha sido ${newStatus}.`,
      });
      setShowDetailModal(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (submission) => {
    setSelectedSubmission(submission);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await preinscripcionService.update(selectedSubmission.id, updatedData);
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === selectedSubmission.id ? { ...sub, ...updatedData } : sub))
      );
      toast({
        title: 'Inscripción actualizada',
        description: 'Los datos han sido guardados correctamente.',
      });
      setShowEditModal(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la inscripción.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteConfirm = (submission) => {
    setSelectedSubmission(submission);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await preinscripcionService.delete(selectedSubmission.id);
      setSubmissions((prev) => prev.filter((sub) => sub.id !== selectedSubmission.id));
      toast({
        title: 'Inscripción eliminada',
        description: 'La inscripción ha sido eliminada correctamente.',
      });
      setShowDeleteModal(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la inscripción.',
        variant: 'destructive',
      });
    }
  };

  const handleExportData = () => {
    toast({
      title: 'Exportando datos',
      description: 'Los datos se están descargando en formato CSV.',
    });
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.curso.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || sub.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters and Actions */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar por nombre, email o curso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos</option>
                <option value="pendiente">Pendientes</option>
                <option value="aprobada">Aprobadas</option>
                <option value="rechazada">Rechazadas</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="flex-1 md:flex-none"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </Card>

      {/* Submissions Table */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Lista de Inscripciones</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nombre</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Curso</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Fecha Envío
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <motion.tr
                    key={submission.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{submission.nombre}</p>
                        <p className="text-sm text-gray-500">{submission.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{submission.curso}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{submission.fechaEnvio}</td>
                    <td className="py-3 px-4">{getEstadoBadge(submission.estado)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleViewDetails(submission)}
                          variant="ghost"
                          size="sm"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleEdit(submission)}
                          variant="ghost"
                          size="sm"
                          title="Editar"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteConfirm(submission)}
                          variant="ghost"
                          size="sm"
                          title="Eliminar"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No se encontraron preinscripciones
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      {showDetailModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Detalle de Preinscripción</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Nombre Completo</p>
                  <p className="text-gray-900">{selectedSubmission.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Email</p>
                  <p className="text-gray-900">{selectedSubmission.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Teléfono</p>
                  <p className="text-gray-900">{selectedSubmission.telefono}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Edad</p>
                  <p className="text-gray-900">{selectedSubmission.edad} años</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Curso Solicitado</p>
                  <p className="text-gray-900">{selectedSubmission.curso}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Grupo Scout</p>
                  <p className="text-gray-900">{selectedSubmission.grupoScout}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Fecha de Envío</p>
                  <p className="text-gray-900">{selectedSubmission.fechaEnvio}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Estado</p>
                  {getEstadoBadge(selectedSubmission.estado)}
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <p className="text-sm text-gray-600 font-medium mb-3">Acciones</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSubmission.estado === 'pendiente' && (
                    <>
                      <Button
                        onClick={() => handleUpdateStatus(selectedSubmission.id, 'aprobada')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprobar
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatus(selectedSubmission.id, 'rechazada')}
                        variant="destructive"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rechazar
                      </Button>
                    </>
                  )}
                  <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Editar Inscripción</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 font-medium">Nombre Completo</label>
                  <Input
                    value={selectedSubmission.nombre}
                    onChange={(e) =>
                      setSelectedSubmission({ ...selectedSubmission, nombre: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Email</label>
                  <Input
                    type="email"
                    value={selectedSubmission.email}
                    onChange={(e) =>
                      setSelectedSubmission({ ...selectedSubmission, email: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Teléfono</label>
                  <Input
                    value={selectedSubmission.telefono}
                    onChange={(e) =>
                      setSelectedSubmission({ ...selectedSubmission, telefono: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Edad</label>
                  <Input
                    type="number"
                    value={selectedSubmission.edad}
                    onChange={(e) =>
                      setSelectedSubmission({ ...selectedSubmission, edad: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Curso</label>
                  <Input
                    value={selectedSubmission.curso}
                    onChange={(e) =>
                      setSelectedSubmission({ ...selectedSubmission, curso: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Grupo Scout</label>
                  <Input
                    value={selectedSubmission.grupoScout}
                    onChange={(e) =>
                      setSelectedSubmission({ ...selectedSubmission, grupoScout: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="border-t pt-4 mt-6 flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => handleSaveEdit(selectedSubmission)}>
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Confirmar Eliminación</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                ¿Estás seguro de que deseas eliminar la inscripción de{' '}
                <span className="font-semibold">{selectedSubmission.nombre}</span>?
              </p>
              <p className="text-red-600 text-sm mt-2">Esta acción no se puede deshacer.</p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Inscripciones;
