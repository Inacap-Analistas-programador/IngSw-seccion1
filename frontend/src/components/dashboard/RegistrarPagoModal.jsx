import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaXmark, FaMoneyBillWave } from 'react-icons/fa6';
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

    const [formData, setFormData] = useState({
        per_id: '',
        cur_id: '',
        pap_tipo: '1', // 1: Ingreso, 2: Egreso
        pap_valor: '',
        pap_observacion: ''
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
                    pap_observacion: initialData.pap_observacion || ''
                });
            } else {
                setFormData({
                    per_id: '',
                    cur_id: '',
                    pap_tipo: '1',
                    pap_valor: '',
                    pap_observacion: ''
                });
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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get current user from authService
            // Get current user from authService
            const currentUser = authService.getCurrentUser();
            const userId = currentUser?.id || currentUser?.usu_id;

            if (!userId) {
                throw new Error('No se pudo obtener el usuario actual');
            }

            const payload = {
                per_id: parseInt(formData.per_id),
                cur_id: parseInt(formData.cur_id),
                usu_id: userId,
                pap_tipo: parseInt(formData.pap_tipo),
                pap_valor: parseFloat(formData.pap_valor),
                pap_observacion: formData.pap_observacion || '',
                pap_fecha_hora: new Date().toISOString(),
            };

            if (initialData) {
                await api.put(`/pagos/pagopersonas/${initialData.pap_id}/`, payload);
                toast({
                    title: '✅ Pago Actualizado Exitosamente',
                    description: 'El pago ha sido actualizado correctamente.',
                    variant: 'success',
                });
            } else {
                await api.post('/pagos/pagopersonas/', payload);
                toast({
                    title: '✅ Pago Registrado Exitosamente',
                    description: `Se ha registrado un ${formData.pap_tipo === '1' ? 'ingreso' : 'egreso'} de $${formData.pap_valor} correctamente.`,
                    variant: 'success',
                });
            }

            onSuccess();
            onClose();
            setFormData({
                per_id: '',
                cur_id: '',
                pap_tipo: '1',
                pap_valor: '',
                pap_observacion: ''
            });
        } catch (error) {
            console.error('Error registering payment:', error);
            const errorMessage = error.response?.data?.detail
                || error.response?.data?.message
                || error.response?.data?.non_field_errors?.[0]
                || Object.values(error.response?.data || {}).flat()[0]
                || error.message;
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
                    className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
                >
                    <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <FaMoneyBillWave /> {initialData ? 'Editar Pago' : 'Registrar Nuevo Pago'}
                        </h2>
                        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                            <FaXmark size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="per_id">Persona</Label>
                                <Select
                                    id="per_id"
                                    name="per_id"
                                    value={formData.per_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione Persona</option>
                                    {personas.map(persona => (
                                        <option key={persona.per_id} value={persona.per_id}>
                                            {persona.per_nombres} {persona.per_apelpat}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cur_id">Curso</Label>
                                <Select
                                    id="cur_id"
                                    name="cur_id"
                                    value={formData.cur_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione Curso</option>
                                    {cursos.map(curso => (
                                        <option key={curso.cur_id} value={curso.cur_id}>
                                            {curso.cur_codigo} - {curso.cur_descripcion}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pap_tipo">Tipo de Pago</Label>
                                <Select
                                    id="pap_tipo"
                                    name="pap_tipo"
                                    value={formData.pap_tipo}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="1">Ingreso</option>
                                    <option value="2">Egreso</option>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pap_valor">Valor ($)</Label>
                                <Input
                                    id="pap_valor"
                                    name="pap_valor"
                                    type="number"
                                    placeholder="0"
                                    value={formData.pap_valor}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pap_observacion">Observación</Label>
                            <Textarea
                                id="pap_observacion"
                                name="pap_observacion"
                                placeholder="Detalles adicionales del pago..."
                                value={formData.pap_observacion}
                                onChange={handleChange}
                                rows={3}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
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
