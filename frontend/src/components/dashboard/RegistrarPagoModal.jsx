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

const RegistrarPagoModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [personas, setPersonas] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [conceptos, setConceptos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        per_id: '',
        cur_id: '',
        pap_tipo: '1', // 1: Ingreso, 2: Egreso
        pap_valor: '',
        pap_observacion: '',
        coc_id: '', // Concepto Contable
        file: null // Comprobante/Foto
    });

    useEffect(() => {
        if (isOpen) {
            fetchData();
            if (initialData) {
                setFormData({
                    per_id: initialData.per_id,
                    cur_id: initialData.cur_id,
                    pap_tipo: initialData.pap_tipo.toString(),
                    pap_valor: initialData.pap_valor,
                    pap_observacion: initialData.pap_observacion || '',
                    coc_id: '', // Edit doesn't support changing concept/file yet easily
                    file: null
                });
            } else {
                setFormData({
                    per_id: '',
                    cur_id: '',
                    pap_tipo: '1',
                    pap_valor: '',
                    pap_observacion: '',
                    coc_id: '',
                    file: null
                });
            }
        }
    }, [isOpen, initialData]);

    const fetchData = async () => {
        try {
            const [personasRes, cursosRes, conceptosRes] = await Promise.all([
                api.get('/personas/personas/'),
                api.get('/cursos/cursos/'),
                api.get('/maestros/conceptos-contables/')
            ]);

            setPersonas(Array.isArray(personasRes.data) ? personasRes.data : personasRes.data.results || []);
            setCursos(Array.isArray(cursosRes.data) ? cursosRes.data : cursosRes.data.results || []);
            setConceptos(Array.isArray(conceptosRes.data) ? conceptosRes.data : conceptosRes.data.results || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los datos necesarios.',
                variant: 'destructive',
            });
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'file') {
            setFormData(prev => ({ ...prev, file: files[0] }));
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

            // Use FormData for file upload
            const data = new FormData();
            data.append('per_id', formData.per_id);
            data.append('cur_id', formData.cur_id);
            data.append('usu_id', userId);
            data.append('pap_tipo', formData.pap_tipo);
            data.append('pap_valor', formData.pap_valor);
            data.append('pap_observacion', formData.pap_observacion || '');
            data.append('pap_fecha_hora', new Date().toISOString());

            if (formData.coc_id) {
                data.append('coc_id', formData.coc_id);
            }
            if (formData.file) {
                data.append('file', formData.file);
            }

            if (initialData) {
                // PUT doesn't support FormData easily with standard DRF update unless overridden, 
                // but we are mostly creating new payments with files. 
                // For update, we might stick to JSON if no file, or handle multipart.
                // Let's assume update is JSON for now as file update is complex logic.
                const payload = {
                    per_id: parseInt(formData.per_id),
                    cur_id: parseInt(formData.cur_id),
                    usu_id: userId,
                    pap_tipo: parseInt(formData.pap_tipo),
                    pap_valor: parseFloat(formData.pap_valor),
                    pap_observacion: formData.pap_observacion || '',
                    pap_fecha_hora: new Date().toISOString(),
                };
                await api.put(`/pagos/pagopersonas/${initialData.pap_id}/`, payload);
                toast({ title: '✅ Pago Actualizado', variant: 'success' });
            } else {
                // POST with FormData
                await api.post('/pagos/pagopersonas/', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast({
                    title: '✅ Pago Registrado',
                    description: `Se ha registrado un ${formData.pap_tipo === '1' ? 'ingreso' : 'egreso'} correctamente.`,
                    variant: 'success',
                });
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error registering payment:', error);
            const errorMessage = error.response?.data?.detail || 'Error desconocido';
            toast({
                title: 'Error',
                description: 'No se pudo registrar el pago. ' + errorMessage,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-slate-900 border border-white/10 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col"
                >
                    <div className="bg-slate-800/50 p-4 flex justify-between items-center border-b border-white/10">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <FaMoneyBillWave className="text-emerald-400" /> {initialData ? 'Editar Pago' : 'Registrar Nuevo Pago'}
                        </h2>
                        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
                            <FaXmark size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column: Core Info */}
                            <div className="space-y-4">
                                <div className="space-y-2 relative">
                                    <Label htmlFor="per_id" className="text-white">Persona</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                                        <Input
                                            type="text"
                                            placeholder="Buscar por nombre o RUN..."
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                if (formData.per_id) {
                                                    setFormData(prev => ({ ...prev, per_id: '' }));
                                                }
                                            }}
                                            className="!bg-slate-800 border-white/10 !text-white pl-10"
                                        />
                                    </div>

                                    {/* Selected Persona Display */}
                                    {formData.per_id && (
                                        <div className="mt-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex justify-between items-center">
                                            <span className="text-sm text-emerald-400 font-medium">
                                                {personas.find(p => p.per_id.toString() === formData.per_id.toString())?.per_nombres} {personas.find(p => p.per_id.toString() === formData.per_id.toString())?.per_apelpat}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, per_id: '' }))}
                                                className="text-white/40 hover:text-white"
                                            >
                                                <FaXmark />
                                            </button>
                                        </div>
                                    )}

                                    {/* Dropdown Results */}
                                    {searchTerm && !formData.per_id && (
                                        <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-white/10 rounded-lg shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                                            {personas
                                                .filter(p => {
                                                    const search = searchTerm.toLowerCase();
                                                    const fullName = `${p.per_nombres} ${p.per_apelpat}`.toLowerCase();
                                                    const run = p.per_run?.toString() || '';
                                                    return fullName.includes(search) || run.includes(search);
                                                })
                                                .map(p => (
                                                    <div
                                                        key={p.per_id}
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, per_id: p.per_id }));
                                                            setSearchTerm(`${p.per_nombres} ${p.per_apelpat}`);
                                                        }}
                                                        className="p-2 hover:bg-white/5 cursor-pointer text-sm text-white border-b border-white/5 last:border-0"
                                                    >
                                                        <div className="font-medium">{p.per_nombres} {p.per_apelpat}</div>
                                                        <div className="text-xs text-white/40">RUN: {p.per_run}</div>
                                                    </div>
                                                ))}
                                            {personas.filter(p => `${p.per_nombres} ${p.per_apelpat}`.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                                                <div className="p-3 text-center text-white/40 text-sm">No se encontraron resultados</div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cur_id" className="text-white">Curso</Label>
                                    <Select
                                        id="cur_id"
                                        name="cur_id"
                                        value={formData.cur_id}
                                        onChange={handleChange}
                                        required
                                        className="!bg-slate-800 border-white/10 !text-white"
                                    >
                                        <option value="" className="bg-slate-800 text-white">Seleccione Curso</option>
                                        {cursos.map(curso => (
                                            <option key={curso.cur_id} value={curso.cur_id} className="bg-slate-800 text-white">
                                                {curso.cur_codigo} - {curso.cur_descripcion}
                                            </option>
                                        ))}
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="pap_tipo" className="text-white">Tipo</Label>
                                        <Select
                                            id="pap_tipo"
                                            name="pap_tipo"
                                            value={formData.pap_tipo}
                                            onChange={handleChange}
                                            required
                                            className="!bg-slate-800 border-white/10 !text-white"
                                        >
                                            <option value="1" className="bg-slate-800 text-white">Ingreso</option>
                                            <option value="2" className="bg-slate-800 text-white">Egreso</option>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="pap_valor" className="text-white">Valor ($)</Label>
                                        <Input
                                            id="pap_valor"
                                            name="pap_valor"
                                            type="number"
                                            placeholder="0"
                                            value={formData.pap_valor}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            className="!bg-slate-800 border-white/10 !text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Optional & Observation */}
                            <div className="space-y-4">
                                {!initialData && (
                                    <div className="grid grid-cols-2 gap-4 bg-slate-800/50 p-3 rounded-lg border border-white/10">
                                        <div className="space-y-2 col-span-2">
                                            <Label className="text-xs font-bold text-white/60 uppercase">Opcional: Generar Comprobante</Label>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="coc_id" className="text-white">Concepto</Label>
                                            <Select
                                                id="coc_id"
                                                name="coc_id"
                                                value={formData.coc_id}
                                                onChange={handleChange}
                                                className="!bg-slate-800 border-white/10 !text-white"
                                            >
                                                <option value="" className="bg-slate-800 text-white">Seleccione</option>
                                                {conceptos.map(c => (
                                                    <option key={c.coc_id} value={c.coc_id} className="bg-slate-800 text-white">{c.coc_descripcion}</option>
                                                ))}
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="file" className="text-white">Archivo</Label>
                                            <div className="relative">
                                                <Input
                                                    id="file"
                                                    name="file"
                                                    type="file"
                                                    onChange={handleChange}
                                                    className="pl-8 text-xs !bg-slate-800 border-white/10 !text-white file:bg-slate-700 file:text-white file:border-0 file:rounded-sm file:px-2 file:py-1 file:mr-2 file:hover:bg-slate-600 file:cursor-pointer"
                                                    accept="image/*,.pdf"
                                                />
                                                <FaCamera className="absolute left-2.5 top-2.5 text-white/40" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="pap_observacion" className="text-white">Observación</Label>
                                    <Textarea
                                        id="pap_observacion"
                                        name="pap_observacion"
                                        placeholder="Detalles adicionales..."
                                        value={formData.pap_observacion}
                                        onChange={handleChange}
                                        className="!bg-slate-800 border-white/10 !text-white min-h-[100px]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="bg-transparent border-white/10 text-white hover:bg-white/5">
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                {loading ? 'Guardando...' : (initialData ? 'Actualizar Pago' : 'Guardar Pago')}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default RegistrarPagoModal;
