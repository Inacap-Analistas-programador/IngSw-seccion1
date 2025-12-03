import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaXmark, FaMoneyBillWave } from 'react-icons/fa6';
import { Search, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Select';
import api from '../../config/api';
import { useToast } from '@/components/ui/use-toast';

const RegistrarPrepagoModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [personas, setPersonas] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        per_id: '',
        cur_id: '',
        ppa_valor: '',
        ppa_observacion: '',
        ppa_vigente: true
    });

    useEffect(() => {
        if (isOpen) {
            fetchData();
            if (initialData) {
                setFormData({
                    per_id: initialData.per_id,
                    cur_id: initialData.cur_id,
                    ppa_valor: initialData.ppa_valor,
                    ppa_observacion: initialData.ppa_observacion || '',
                    ppa_vigente: initialData.ppa_vigente
                });
            } else {
                setFormData({
                    per_id: '',
                    cur_id: '',
                    ppa_valor: '',
                    ppa_observacion: '',
                    ppa_vigente: true
                });
                setSearchTerm('');
            }
        }
    }, [isOpen, initialData]);

    const fetchData = async () => {
        try {
            const [personasRes, cursosRes] = await Promise.all([
                api.get('/personas/personas/'),
                api.get('/cursos/cursos/')
            ]);

            setPersonas(Array.isArray(personasRes.data) ? personasRes.data : personasRes.data.results || []);
            setCursos(Array.isArray(cursosRes.data) ? cursosRes.data : cursosRes.data.results || []);
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
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (initialData) {
                await api.put(`/pagos/prepagos/${initialData.ppa_id}/`, formData);
                toast({ title: 'Éxito', description: 'Prepago actualizado correctamente.' });
            } else {
                await api.post('/pagos/prepagos/', formData);
                toast({ title: 'Éxito', description: 'Prepago registrado correctamente.' });
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving prepago:', error);
            toast({
                title: 'Error',
                description: 'No se pudo guardar el prepago.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredPersonas = personas.filter(p => 
        p.per_nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.per_apelpat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.per_run?.toString().includes(searchTerm)
    );

    const selectedPersonaObj = personas.find(p => p.per_id === formData.per_id);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
                    >
                        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/95 backdrop-blur">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FaMoneyBillWave className="text-emerald-500" />
                                {initialData ? 'Editar Prepago' : 'Registrar Prepago'}
                            </h2>
                            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                                <FaXmark size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Persona Selection */}
                            <div className="space-y-3">
                                <Label className="text-white">Persona</Label>
                                
                                {selectedPersonaObj ? (
                                    <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                                                {selectedPersonaObj.per_nombres.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">
                                                    {selectedPersonaObj.per_nombres} {selectedPersonaObj.per_apelpat}
                                                </p>
                                                <p className="text-xs text-white/60">
                                                    {selectedPersonaObj.per_run}-{selectedPersonaObj.per_dv}
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setFormData({ ...formData, per_id: '' })} 
                                            className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                                        >
                                            <FaXmark />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                                            <Input
                                                placeholder="Buscar por nombre o RUT..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 bg-slate-800 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500/50"
                                            />
                                        </div>
                                        
                                        <div className="max-h-48 overflow-y-auto border border-white/10 rounded-xl bg-slate-800/50 custom-scrollbar">
                                            {filteredPersonas.length > 0 ? (
                                                filteredPersonas.slice(0, 50).map(per => (
                                                    <div
                                                        key={per.per_id}
                                                        onClick={() => setFormData({ ...formData, per_id: per.per_id })}
                                                        className="p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 flex justify-between items-center group transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                                                                <User size={14} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-white group-hover:text-emerald-400 transition-colors">
                                                                    {per.per_nombres} {per.per_apelpat}
                                                                </p>
                                                                <p className="text-xs text-white/50">
                                                                    {per.per_run}-{per.per_dv}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Plus size={16} className="text-white/20 group-hover:text-emerald-400 transition-colors" />
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-white/30 text-sm">
                                                    No se encontraron personas
                                                </div>
                                            )}
                                        </div>
                                        {formData.per_id === '' && <p className="text-xs text-red-400 mt-1">Seleccione una persona</p>}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="cur_id" className="text-white">Curso</Label>
                                    <select
                                        id="cur_id"
                                        name="cur_id"
                                        value={formData.cur_id}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                        required
                                    >
                                        <option value="" className="bg-slate-800">Seleccione un curso...</option>
                                        {cursos.map(c => (
                                            <option key={c.cur_id} value={c.cur_id} className="bg-slate-800">
                                                {c.cur_descripcion} ({c.cur_codigo})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ppa_valor" className="text-white">Monto ($)</Label>
                                    <Input
                                        id="ppa_valor"
                                        name="ppa_valor"
                                        type="number"
                                        required
                                        value={formData.ppa_valor}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="bg-slate-800 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ppa_observacion" className="text-white">Observación</Label>
                                <Textarea
                                    id="ppa_observacion"
                                    name="ppa_observacion"
                                    value={formData.ppa_observacion}
                                    onChange={handleChange}
                                    placeholder="Detalles adicionales..."
                                    rows={3}
                                    className="bg-slate-800 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500/50 resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={onClose}
                                    className="text-white/60 hover:text-white hover:bg-white/5"
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    type="submit" 
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                    disabled={loading}
                                >
                                    {loading ? 'Guardando...' : (initialData ? 'Actualizar Prepago' : 'Registrar Prepago')}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RegistrarPrepagoModal;