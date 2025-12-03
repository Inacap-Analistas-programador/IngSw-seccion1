import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaXmark, FaMoneyBillWave, FaCamera } from 'react-icons/fa6';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, Textarea } from '@/components/ui/Select';
import api from '../../config/api';
import authService from '../../services/authService';
import { useToast } from '@/components/ui/use-toast';

const RegistrarPagoProveedorModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [proveedores, setProveedores] = useState([]);
    const [conceptos, setConceptos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        prv_id: '',
        ppr_valor: '',
        ppr_fecha: new Date().toISOString().split('T')[0],
        ppr_observacion: '',
        coc_id: '', // Concepto Contable
        ppr_archivo: null // Comprobante/Foto
    });

    useEffect(() => {
        if (isOpen) {
            fetchData();
            if (initialData) {
                setFormData({
                    prv_id: initialData.prv_id,
                    ppr_valor: initialData.ppr_valor,
                    ppr_fecha: initialData.ppr_fecha,
                    ppr_observacion: initialData.ppr_observacion || '',
                    coc_id: initialData.coc_id || '',
                    ppr_archivo: null
                });
            } else {
                setFormData({
                    prv_id: '',
                    ppr_valor: '',
                    ppr_fecha: new Date().toISOString().split('T')[0],
                    ppr_observacion: '',
                    coc_id: '',
                    ppr_archivo: null
                });
            }
        }
    }, [isOpen, initialData]);

    const fetchData = async () => {
        try {
            const [proveedoresRes, conceptosRes] = await Promise.all([
                api.get('/proveedores/proveedores/'),
                api.get('/maestros/conceptos-contables/')
            ]);

            setProveedores(Array.isArray(proveedoresRes.data) ? proveedoresRes.data : proveedoresRes.data.results || []);
            setConceptos(Array.isArray(conceptosRes.data) ? conceptosRes.data : conceptosRes.data.results || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los datos necesarios (Proveedores/Conceptos).',
                variant: 'destructive',
            });
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'ppr_archivo') {
            setFormData(prev => ({ ...prev, ppr_archivo: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const currentUser = authService.getCurrentUser();
            const userId = currentUser?.id || currentUser?.usu_id;

            if (!userId) {
                throw new Error('No se pudo obtener el usuario actual');
            }

            const data = new FormData();
            data.append('prv_id', formData.prv_id);
            data.append('usu_id', userId);
            data.append('coc_id', formData.coc_id);
            data.append('ppr_fecha', formData.ppr_fecha);
            data.append('ppr_valor', formData.ppr_valor);
            data.append('ppr_observacion', formData.ppr_observacion);
            
            if (formData.ppr_archivo) {
                data.append('ppr_archivo', formData.ppr_archivo);
            }

            if (initialData) {
                await api.patch(`/pagos/pagos-proveedores/${initialData.ppr_id}/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast({ title: 'Éxito', description: 'Pago a proveedor actualizado correctamente.' });
            } else {
                await api.post('/pagos/pagos-proveedores/', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast({ title: 'Éxito', description: 'Pago a proveedor registrado correctamente.' });
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving payment:', error);
            toast({
                title: 'Error',
                description: 'No se pudo guardar el pago.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredProveedores = proveedores.filter(p => 
        p.prv_nombre_fantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.prv_rut?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                    >
                        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/95 backdrop-blur">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FaMoneyBillWave className="text-emerald-500" />
                                {initialData ? 'Editar Pago a Proveedor' : 'Registrar Pago a Proveedor'}
                            </h2>
                            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                                <FaXmark size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Proveedor Selection */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Proveedor</Label>
                                    <span className="text-xs text-white/40">¿No está? Gestione en la pestaña Proveedores</span>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                                    <Input
                                        placeholder="Buscar proveedor por nombre o RUT..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 mb-2"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-white/10 rounded-lg bg-black/20">
                                    {filteredProveedores.map(prov => (
                                        <div
                                            key={prov.prv_id}
                                            onClick={() => setFormData({ ...formData, prv_id: prov.prv_id })}
                                            className={`p-3 rounded-lg cursor-pointer transition-all border ${
                                                formData.prv_id === prov.prv_id
                                                    ? 'bg-emerald-500/20 border-emerald-500'
                                                    : 'bg-white/5 border-transparent hover:bg-white/10'
                                            }`}
                                        >
                                            <p className="font-medium text-white">{prov.prv_nombre_fantasia}</p>
                                            <p className="text-xs text-white/60">{prov.prv_rut}</p>
                                        </div>
                                    ))}
                                </div>
                                {formData.prv_id === '' && <p className="text-xs text-red-400">Seleccione un proveedor</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="ppr_valor">Monto ($)</Label>
                                    <Input
                                        id="ppr_valor"
                                        name="ppr_valor"
                                        type="number"
                                        required
                                        value={formData.ppr_valor}
                                        onChange={handleChange}
                                        placeholder="0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ppr_fecha">Fecha</Label>
                                    <Input
                                        id="ppr_fecha"
                                        name="ppr_fecha"
                                        type="date"
                                        required
                                        value={formData.ppr_fecha}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="coc_id">Concepto Contable</Label>
                                <select
                                    id="coc_id"
                                    name="coc_id"
                                    value={formData.coc_id}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    required
                                >
                                    <option value="">Seleccione un concepto...</option>
                                    {conceptos.map(c => (
                                        <option key={c.coc_id} value={c.coc_id}>
                                            {c.coc_descripcion}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ppr_observacion">Observación</Label>
                                <Textarea
                                    id="ppr_observacion"
                                    name="ppr_observacion"
                                    value={formData.ppr_observacion}
                                    onChange={handleChange}
                                    placeholder="Detalles adicionales del pago..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Comprobante (Opcional)</Label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-white/20 bg-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <FaCamera className="w-8 h-8 mb-3 text-white/40" />
                                            <p className="mb-2 text-sm text-white/60">
                                                <span className="font-semibold">Click para subir</span> o arrastrar
                                            </p>
                                            <p className="text-xs text-white/40">PDF, PNG, JPG (MAX. 10MB)</p>
                                        </div>
                                        <input 
                                            type="file" 
                                            name="ppr_archivo"
                                            className="hidden" 
                                            onChange={handleChange}
                                            accept="image/*,.pdf"
                                        />
                                    </label>
                                </div>
                                {formData.ppr_archivo && (
                                    <p className="text-sm text-emerald-400">
                                        Archivo seleccionado: {formData.ppr_archivo.name}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                <Button type="button" variant="ghost" onClick={onClose}>
                                    Cancelar
                                </Button>
                                <Button 
                                    type="submit" 
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                                    disabled={loading}
                                >
                                    {loading ? 'Guardando...' : (initialData ? 'Actualizar Pago' : 'Registrar Pago')}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RegistrarPagoProveedorModal;