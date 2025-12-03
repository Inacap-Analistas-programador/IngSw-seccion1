import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Edit, Truck } from 'lucide-react';
import proveedorService from '../../services/proveedorService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import api from '../../config/api';

const PagosProveedores = () => {
    const { toast } = useToast();
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        prv_descripcion: '',
        prv_celular1: '',
        prv_celular2: '',
        prv_direccion: '',
        prv_observacion: '',
        prv_vigente: true
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchProveedores();
    }, []);

    const fetchProveedores = async () => {
        try {
            setLoading(true);
            const data = await proveedorService.getAll();
            setProveedores(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error('Error fetching proveedores:', error);
            toast({ title: 'Error', description: 'No se pudieron cargar los proveedores', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await proveedorService.update(editingId, formData);
                toast({ title: 'Éxito', description: 'Proveedor actualizado correctamente', variant: 'success' });
            } else {
                await proveedorService.create(formData);
                toast({ title: 'Éxito', description: 'Proveedor creado correctamente', variant: 'success' });
            }
            setIsModalOpen(false);
            resetForm();
            fetchProveedores();
        } catch (error) {
            console.error('Error saving proveedor:', error);
            toast({ title: 'Error', description: 'No se pudo guardar el proveedor', variant: 'destructive' });
        }
    };

    const handleEdit = (proveedor) => {
        setFormData({
            prv_descripcion: proveedor.prv_descripcion,
            prv_celular1: proveedor.prv_celular1,
            prv_celular2: proveedor.prv_celular2,
            prv_direccion: proveedor.prv_direccion,
            prv_observacion: proveedor.prv_observacion,
            prv_vigente: proveedor.prv_vigente
        });
        setEditingId(proveedor.prv_id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este proveedor?')) {
            try {
                await proveedorService.delete(id);
                toast({ title: 'Éxito', description: 'Proveedor eliminado', variant: 'success' });
                fetchProveedores();
            } catch (error) {
                console.error('Error deleting proveedor:', error);
                toast({ title: 'Error', description: 'No se pudo eliminar el proveedor', variant: 'destructive' });
            }
        }
    };

    const resetForm = () => {
        setFormData({
            prv_descripcion: '',
            prv_celular1: '',
            prv_celular2: '',
            prv_direccion: '',
            prv_observacion: '',
            prv_vigente: true
        });
        setEditingId(null);
    };

    const filteredProveedores = proveedores.filter(p =>
        p.prv_descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-2xl backdrop-blur-xl border border-white/10 shadow-xl">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar proveedor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    />
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm text-white font-semibold transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95"
                >
                    <Plus size={18} />
                    <span>Nuevo Proveedor</span>
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProveedores.map((proveedor) => (
                    <div key={proveedor.prv_id} className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Truck size={24} />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(proveedor)} className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(proveedor.prv_id)} className="p-2 hover:bg-red-500/20 rounded-lg text-white/60 hover:text-red-400 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-1">{proveedor.prv_descripcion}</h3>
                        <p className="text-white/60 text-sm mb-2">{proveedor.prv_direccion || 'Sin dirección'}</p>
                        <div className="text-white/40 text-xs space-y-1">
                            <p>Tel: {proveedor.prv_celular1}</p>
                            {proveedor.prv_celular2 && <p>Tel 2: {proveedor.prv_celular2}</p>}
                        </div>
                    </div>
                ))}
                {filteredProveedores.length === 0 && !loading && (
                    <div className="col-span-full text-center py-12 text-white/40">
                        No se encontraron proveedores.
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border border-white/10 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">
                                {editingId ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-white">Nombre / Razón Social</Label>
                                <Input
                                    value={formData.prv_descripcion}
                                    onChange={(e) => setFormData({ ...formData, prv_descripcion: e.target.value })}
                                    required
                                    className="bg-slate-800 border-white/10 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Teléfono 1</Label>
                                <Input
                                    value={formData.prv_celular1}
                                    onChange={(e) => setFormData({ ...formData, prv_celular1: e.target.value })}
                                    required
                                    className="bg-slate-800 border-white/10 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Teléfono 2 (Opcional)</Label>
                                <Input
                                    value={formData.prv_celular2}
                                    onChange={(e) => setFormData({ ...formData, prv_celular2: e.target.value })}
                                    className="bg-slate-800 border-white/10 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Dirección</Label>
                                <Input
                                    value={formData.prv_direccion}
                                    onChange={(e) => setFormData({ ...formData, prv_direccion: e.target.value })}
                                    className="bg-slate-800 border-white/10 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Observación</Label>
                                <Input
                                    value={formData.prv_observacion}
                                    onChange={(e) => setFormData({ ...formData, prv_observacion: e.target.value })}
                                    className="bg-slate-800 border-white/10 text-white"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-white/10 text-white hover:bg-white/5">
                                    Cancelar
                                </Button>
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                                    Guardar
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default PagosProveedores;
