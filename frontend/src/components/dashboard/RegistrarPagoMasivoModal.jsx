import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaXmark, FaMoneyBillWave, FaUsers, FaUserPlus, FaCheck, FaCamera } from 'react-icons/fa6';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, Textarea } from '@/components/ui/Select';
import api from '../../config/api';
import authService from '../../services/authService';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Trash2, Plus, Search } from 'lucide-react';

const RegistrarPagoMasivoModal = ({ isOpen, onClose, onSuccess }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('grupo'); // 'grupo' or 'multi'

    // Data for selects
    const [cursos, setCursos] = useState([]);
    const [personas, setPersonas] = useState([]);
    const [cursoSecciones, setCursoSecciones] = useState([]);
    const [personaCursos, setPersonaCursos] = useState([]);
    const [conceptos, setConceptos] = useState([]);

    // Form Data - Tab 1: Grupo
    const [grupoForm, setGrupoForm] = useState({
        cur_id: '',
        valor_total: '',
        pap_tipo: '1',
        pap_observacion: '',
        coc_id: '',
        file: null,
        payer_id: '' // Added payer_id
    });
    const [selectedPersonas, setSelectedPersonas] = useState([]); // IDs of selected personas
    const [filteredPersonas, setFilteredPersonas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [payerSearchTerm, setPayerSearchTerm] = useState(''); // Search term for payer
    const [showPayerResults, setShowPayerResults] = useState(false); // Toggle for payer results
    const [conceptoSearchTerm, setConceptoSearchTerm] = useState('');
    const [showConceptoResults, setShowConceptoResults] = useState(false);

    // Filtered personas based on search
    const filteredPersonasList = filteredPersonas.filter(p => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        const fullName = `${p.per_nombres} ${p.per_apelpat}`.toLowerCase();
        const run = p.per_run?.toLowerCase() || '';
        return fullName.includes(search) || run.includes(search);
    });
    const filteredPersonasCount = filteredPersonasList.length;

    // Form Data - Tab 2: Multi-Persona
    const [multiForm, setMultiForm] = useState({
        payer_id: '',
        cur_id: '',
        pap_tipo: '1',
        observacion: ''
    });
    const [beneficiaries, setBeneficiaries] = useState([{ per_id: '', amount: '' }]);

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        try {
            const [cursosRes, personasRes, seccionesRes, inscripcionesRes, conceptosRes] = await Promise.all([
                api.get('/cursos/cursos/'),
                api.get('/personas/personas/'),
                api.get('/cursos/cursosecciones/'),
                api.get('/personas/personacursos/'),
                api.get('/maestros/conceptos-contables/')
            ]);
            setCursos(Array.isArray(cursosRes.data) ? cursosRes.data : cursosRes.data.results || []);
            setPersonas(Array.isArray(personasRes.data) ? personasRes.data : personasRes.data.results || []);
            setCursoSecciones(Array.isArray(seccionesRes.data) ? seccionesRes.data : seccionesRes.data.results || []);
            setPersonaCursos(Array.isArray(inscripcionesRes.data) ? inscripcionesRes.data : inscripcionesRes.data.results || []);
            setConceptos(Array.isArray(conceptosRes.data) ? conceptosRes.data : conceptosRes.data.results || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los datos.',
                variant: 'destructive',
            });
        }
    };

    // --- Logic for Tab 1: Grupo ---
    useEffect(() => {
        if (grupoForm.cur_id) {
            // 1. Find all sections for this course
            const sections = cursoSecciones.filter(s => s.cur_id === parseInt(grupoForm.cur_id));
            const sectionIds = sections.map(s => s.cus_id);

            // 2. Find all enrollments in these sections
            const enrollments = personaCursos.filter(pc => sectionIds.includes(pc.cus_id) && pc.pec_vigente !== false); // Assuming active enrollments
            const enrolledPersonIds = enrollments.map(pc => pc.per_id);

            // 3. Filter personas
            const enrolledPersonas = personas.filter(p => enrolledPersonIds.includes(p.per_id));
            setFilteredPersonas(enrolledPersonas);
        } else {
            // Show all personas if no course is selected
            setFilteredPersonas(personas);
        }
    }, [grupoForm.cur_id, personas, cursoSecciones, personaCursos]);

    const handleGrupoSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const currentUser = authService.getCurrentUser();
            const userId = currentUser?.id || currentUser?.usu_id;

            // Calculate unit value from total
            const count = selectedPersonas.length;
            if (count === 0) {
                toast({ title: 'Error', description: 'Seleccione al menos una persona.', variant: 'destructive' });
                setLoading(false);
                return;
            }

            const valorTotal = parseFloat(grupoForm.valor_total);
            const valorUnitario = valorTotal / count;

            const formData = new FormData();
            formData.append('valor_total', valorTotal);
            formData.append('valor_unitario', valorUnitario);
            formData.append('cur_id', parseInt(grupoForm.cur_id));
            formData.append('pap_tipo', parseInt(grupoForm.pap_tipo));
            formData.append('usu_id', userId);
            
            if (grupoForm.payer_id) {
                formData.append('payer_id', parseInt(grupoForm.payer_id));
            }

            selectedPersonas.forEach(p => formData.append('personas', parseInt(p)));

            if (grupoForm.coc_id) formData.append('coc_id', grupoForm.coc_id);
            if (grupoForm.file) formData.append('file', grupoForm.file);

            await api.post('/pagos/pagopersonas/masivo/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast({ title: '✅ Pagos Masivos Registrados', variant: 'success' });
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Falló el registro masivo.', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    // --- Logic for Tab 2: Multi-Persona ---
    const addBeneficiary = () => {
        setBeneficiaries([...beneficiaries, { per_id: '', amount: '' }]);
    };

    const removeBeneficiary = (index) => {
        const newList = [...beneficiaries];
        newList.splice(index, 1);
        setBeneficiaries(newList);
    };

    const updateBeneficiary = (index, field, value) => {
        const newList = [...beneficiaries];
        newList[index][field] = value;
        setBeneficiaries(newList);
    };

    const handleMultiSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const currentUser = authService.getCurrentUser();
            const userId = currentUser?.id || currentUser?.usu_id;

            const payload = {
                payer_id: multiForm.payer_id,
                cur_id: multiForm.cur_id ? parseInt(multiForm.cur_id) : null,
                payments: beneficiaries.map(b => ({
                    per_id: parseInt(b.per_id),
                    amount: parseFloat(b.amount)
                })),
                pap_tipo: parseInt(multiForm.pap_tipo),
                observacion: multiForm.observacion,
                usu_id: userId
            };

            await api.post('/pagos/pagopersonas/multi-persona/', payload);
            toast({ title: '✅ Pagos Multi-Persona Registrados', variant: 'success' });
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Falló el registro multi-persona.', variant: 'destructive' });
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
                    className="bg-slate-900 border border-white/10 rounded-xl shadow-2xl w-full max-w-[95vw] overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="bg-slate-800/50 p-4 flex justify-between items-center border-b border-white/10">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <FaMoneyBillWave className="text-emerald-400" /> Registrar Pago Masivo
                        </h2>
                        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
                            <FaXmark size={24} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-white/10">
                        <button
                            onClick={() => setActiveTab('grupo')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'grupo' ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500' : 'text-white/60 hover:bg-white/5'}`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <FaUsers /> Por Grupo/Curso
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('multi')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'multi' ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500' : 'text-white/60 hover:bg-white/5'}`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <FaUserPlus /> Multi-Persona (Un Pagador)
                            </div>
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                        {activeTab === 'grupo' ? (
                            <form onSubmit={handleGrupoSubmit} className="space-y-4 h-full flex flex-col">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
                                    {/* Column 1: Configuration */}
                                    <div className="space-y-4 overflow-y-auto pr-2">
                                        {/* Payer Selection (Optional) */}
                                        <div className="space-y-2 relative">
                                            <Label className="text-white">Pagador (Opcional)</Label>
                                            {grupoForm.payer_id ? (
                                                <div className="flex items-center justify-between p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                                    <span className="text-sm text-white truncate">
                                                        {personas.find(p => p.per_id.toString() === grupoForm.payer_id.toString())?.per_nombres} {personas.find(p => p.per_id.toString() === grupoForm.payer_id.toString())?.per_apelpat}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setGrupoForm({ ...grupoForm, payer_id: '' })}
                                                        className="text-white/40 hover:text-white"
                                                    >
                                                        <FaXmark />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <Input
                                                        placeholder="Buscar pagador..."
                                                        value={payerSearchTerm}
                                                        onChange={(e) => {
                                                            setPayerSearchTerm(e.target.value);
                                                            setShowPayerResults(true);
                                                        }}
                                                        onFocus={() => setShowPayerResults(true)}
                                                        className="!bg-slate-800 border-white/10 !text-white pl-8"
                                                    />
                                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" size={14} />
                                                    
                                                    {showPayerResults && payerSearchTerm && (
                                                        <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-slate-800 border border-white/10 rounded-lg shadow-xl">
                                                            {personas
                                                                .filter(p => 
                                                                    `${p.per_nombres} ${p.per_apelpat}`.toLowerCase().includes(payerSearchTerm.toLowerCase()) ||
                                                                    p.per_run?.includes(payerSearchTerm)
                                                                )
                                                                .slice(0, 10)
                                                                .map(p => (
                                                                    <div
                                                                        key={p.per_id}
                                                                        onClick={() => {
                                                                            setGrupoForm({ ...grupoForm, payer_id: p.per_id });
                                                                            setPayerSearchTerm('');
                                                                            setShowPayerResults(false);
                                                                        }}
                                                                        className="p-2 hover:bg-white/5 cursor-pointer text-sm text-white truncate"
                                                                    >
                                                                        {p.per_nombres} {p.per_apelpat}
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {showPayerResults && (
                                                <div className="fixed inset-0 z-40" onClick={() => setShowPayerResults(false)} />
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-white">Curso</Label>
                                            <Select
                                                value={grupoForm.cur_id}
                                                onChange={(e) => setGrupoForm({ ...grupoForm, cur_id: e.target.value })}
                                                required
                                                className="!bg-slate-800 border-white/10 !text-white"
                                            >
                                                <option value="" className="bg-slate-800 text-white">Seleccione Curso</option>
                                                {cursos.map(c => <option key={c.cur_id} value={c.cur_id} className="bg-slate-800 text-white">{c.cur_descripcion}</option>)}
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-white">Tipo</Label>
                                            <Select
                                                value={grupoForm.pap_tipo}
                                                onChange={(e) => setGrupoForm({ ...grupoForm, pap_tipo: e.target.value })}
                                                className="!bg-slate-800 border-white/10 !text-white"
                                            >
                                                <option value="1" className="bg-slate-800 text-white">Ingreso</option>
                                                <option value="2" className="bg-slate-800 text-white">Egreso</option>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-white">Valor Total a Repartir</Label>
                                            <Input
                                                type="number"
                                                value={grupoForm.valor_total}
                                                onChange={(e) => setGrupoForm({ ...grupoForm, valor_total: e.target.value })}
                                                placeholder="Ej: 100000"
                                                className="!bg-slate-800 border-white/10 !text-white text-lg font-medium"
                                            />
                                            <p className="text-xs text-white/40">
                                                Este monto se dividirá entre las personas seleccionadas.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Column 2: Summary & Extras */}
                                    <div className="space-y-4 overflow-y-auto pr-2">
                                        {/* Calculation Summary */}
                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-blue-200">Personas Seleccionadas:</span>
                                                <span className="font-bold text-white">{selectedPersonas.length}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-blue-200">Valor Total:</span>
                                                <span className="font-bold text-white">
                                                    ${parseInt(grupoForm.valor_total || 0).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="h-px bg-blue-500/20 my-2" />
                                            <div className="flex justify-between items-center">
                                                <span className="text-blue-300 font-medium">A Pagar por Persona:</span>
                                                <span className="text-xl font-bold text-emerald-400">
                                                    ${selectedPersonas.length > 0
                                                        ? Math.round((parseInt(grupoForm.valor_total || 0) / selectedPersonas.length)).toLocaleString()
                                                        : '0'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Optional: Comprobante */}
                                        <div className="bg-slate-800/50 p-3 rounded-lg border border-white/10 space-y-3">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-white/60 uppercase">Respaldo del Pago (Voucher)</Label>
                                            </div>
                                            <div className="space-y-2 relative">
                                                <Label className="text-white">Concepto Contable</Label>
                                                {grupoForm.coc_id ? (
                                                    <div className="flex items-center justify-between p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                                        <span className="text-sm text-white truncate">
                                                            {conceptos.find(c => c.coc_id.toString() === grupoForm.coc_id.toString())?.coc_descripcion}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setGrupoForm({ ...grupoForm, coc_id: '' })}
                                                            className="text-white/40 hover:text-white"
                                                        >
                                                            <FaXmark />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <Input
                                                            placeholder="Buscar concepto..."
                                                            value={conceptoSearchTerm}
                                                            onChange={(e) => {
                                                                setConceptoSearchTerm(e.target.value);
                                                                setShowConceptoResults(true);
                                                            }}
                                                            onFocus={() => setShowConceptoResults(true)}
                                                            className="!bg-slate-800 border-white/10 !text-white"
                                                        />
                                                        {showConceptoResults && (
                                                            <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-slate-800 border border-white/10 rounded-lg shadow-xl">
                                                                {conceptos
                                                                    .filter(c => 
                                                                        c.coc_descripcion.toLowerCase().includes(conceptoSearchTerm.toLowerCase())
                                                                    )
                                                                    .map(c => (
                                                                        <div
                                                                            key={c.coc_id}
                                                                            onClick={() => {
                                                                                setGrupoForm({ ...grupoForm, coc_id: c.coc_id });
                                                                                setConceptoSearchTerm('');
                                                                                setShowConceptoResults(false);
                                                                            }}
                                                                            className="p-2 hover:bg-white/5 cursor-pointer text-sm text-white truncate"
                                                                        >
                                                                            {c.coc_descripcion}
                                                                        </div>
                                                                    ))
                                                                }
                                                                {conceptos.filter(c => c.coc_descripcion.toLowerCase().includes(conceptoSearchTerm.toLowerCase())).length === 0 && (
                                                                    <div className="p-2 text-xs text-white/40">No se encontraron conceptos</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {showConceptoResults && (
                                                    <div className="fixed inset-0 z-40" onClick={() => setShowConceptoResults(false)} />
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-white">Subir Voucher/Comprobante</Label>
                                                <div className="relative">
                                                    <Input
                                                        type="file"
                                                        onChange={(e) => setGrupoForm({ ...grupoForm, file: e.target.files[0] })}
                                                        className="pl-8 text-xs !bg-slate-800 border-white/10 !text-white file:bg-slate-700 file:text-white file:border-0 file:rounded-sm file:px-2 file:py-1 file:mr-2 file:hover:bg-slate-600 file:cursor-pointer"
                                                        accept="image/*,.pdf"
                                                    />
                                                    <FaCamera className="absolute left-2.5 top-2.5 text-white/40" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 3: Personas Selection */}
                                    <div className="space-y-3 h-full flex flex-col min-h-0">
                                        <Label className="text-white">Buscar y Seleccionar Personas</Label>

                                        {/* Search Input */}
                                        <div className="relative">
                                            <Input
                                                type="text"
                                                placeholder="Buscar por nombre o RUN..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="!bg-slate-800 border-white/10 !text-white pl-10"
                                            />
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                                        </div>

                                        {/* Selected Personas Badges */}
                                        {selectedPersonas.length > 0 && (
                                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-emerald-400">
                                                        {selectedPersonas.length} seleccionada{selectedPersonas.length !== 1 ? 's' : ''}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedPersonas([])}
                                                        className="text-xs text-white/60 hover:text-white transition-colors"
                                                    >
                                                        Limpiar todo
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto custom-scrollbar">
                                                    {selectedPersonas.map(perId => {
                                                        const persona = personas.find(p => p.per_id.toString() === perId);
                                                        if (!persona) return null;
                                                        return (
                                                            <div
                                                                key={perId}
                                                                className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-md px-2 py-1 text-xs text-emerald-100"
                                                            >
                                                                <span className="truncate max-w-[120px]">
                                                                    {persona.per_nombres} {persona.per_apelpat}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setSelectedPersonas(selectedPersonas.filter(pid => pid !== perId))}
                                                                    className="text-emerald-300 hover:text-white transition-colors"
                                                                >
                                                                    <FaXmark size={10} />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Available Personas List */}
                                        <div className="flex-1 bg-slate-800 border border-white/10 rounded-lg overflow-hidden flex flex-col min-h-0">
                                            <div className="p-2 border-b border-white/10 bg-slate-700/30">
                                                <span className="text-xs text-white/60">
                                                    {filteredPersonasCount} persona{filteredPersonasCount !== 1 ? 's' : ''} disponible{filteredPersonasCount !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <div className="overflow-y-auto custom-scrollbar p-2 space-y-1 flex-1">
                                                {filteredPersonasList.length > 0 ? (
                                                    filteredPersonasList.map(p => {
                                                        const isSelected = selectedPersonas.includes(p.per_id.toString());
                                                        return (
                                                            <div
                                                                key={p.per_id}
                                                                onClick={() => {
                                                                    const id = p.per_id.toString();
                                                                    if (isSelected) {
                                                                        setSelectedPersonas(selectedPersonas.filter(pid => pid !== id));
                                                                    } else {
                                                                        setSelectedPersonas([...selectedPersonas, id]);
                                                                    }
                                                                }}
                                                                className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${isSelected
                                                                    ? 'bg-emerald-500/20 border border-emerald-500/30 scale-[0.98]'
                                                                    : 'hover:bg-white/5 border border-transparent hover:scale-[0.98]'
                                                                    }`}
                                                            >
                                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected
                                                                    ? 'bg-emerald-500 border-emerald-500 scale-110'
                                                                    : 'border-white/30'
                                                                    }`}>
                                                                    {isSelected && <FaCheck size={12} className="text-white" />}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className={`text-sm font-medium truncate ${isSelected ? 'text-emerald-100' : 'text-white/90'}`}>
                                                                        {p.per_nombres} {p.per_apelpat}
                                                                    </div>
                                                                    <div className="text-xs text-white/40 truncate">RUN: {p.per_run}</div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="text-center py-8 text-white/40 text-sm">
                                                        {personas.length === 0 ? 'No hay personas registradas en el sistema.' : 'No se encontraron personas con ese criterio.'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-white/10 mt-auto">
                                    <Button type="submit" disabled={loading} className="bg-emerald-500 hover:bg-emerald-600">
                                        {loading ? <Loader2 className="animate-spin mr-2" /> : 'Registrar Pagos'}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleMultiSubmit} className="space-y-4 h-full flex flex-col">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
                                    {/* Left Column: Configuration */}
                                    <div className="space-y-4 overflow-y-auto pr-2">
                                        <div className="space-y-2 relative">
                                            <Label className="text-white">Pagador (Quien realiza el pago)</Label>
                                            {multiForm.payer_id ? (
                                                <div className="flex items-center justify-between p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                                    <span className="text-sm text-white truncate">
                                                        {personas.find(p => p.per_id.toString() === multiForm.payer_id.toString())?.per_nombres} {personas.find(p => p.per_id.toString() === multiForm.payer_id.toString())?.per_apelpat}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setMultiForm({ ...multiForm, payer_id: '' })}
                                                        className="text-white/40 hover:text-white"
                                                    >
                                                        <FaXmark />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <Input
                                                        placeholder="Buscar pagador..."
                                                        value={payerSearchTerm}
                                                        onChange={(e) => {
                                                            setPayerSearchTerm(e.target.value);
                                                            setShowPayerResults(true);
                                                        }}
                                                        onFocus={() => setShowPayerResults(true)}
                                                        className="!bg-slate-800 border-white/10 !text-white pl-8"
                                                    />
                                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" size={14} />
                                                    
                                                    {showPayerResults && payerSearchTerm && (
                                                        <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-slate-800 border border-white/10 rounded-lg shadow-xl">
                                                            {personas
                                                                .filter(p => 
                                                                    `${p.per_nombres} ${p.per_apelpat}`.toLowerCase().includes(payerSearchTerm.toLowerCase()) ||
                                                                    p.per_run?.includes(payerSearchTerm)
                                                                )
                                                                .slice(0, 10)
                                                                .map(p => (
                                                                    <div
                                                                        key={p.per_id}
                                                                        onClick={() => {
                                                                            setMultiForm({ ...multiForm, payer_id: p.per_id });
                                                                            setPayerSearchTerm('');
                                                                            setShowPayerResults(false);
                                                                        }}
                                                                        className="p-2 hover:bg-white/5 cursor-pointer text-sm text-white truncate"
                                                                    >
                                                                        {p.per_nombres} {p.per_apelpat}
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {showPayerResults && (
                                                <div className="fixed inset-0 z-40" onClick={() => setShowPayerResults(false)} />
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-white">Curso (Opcional)</Label>
                                            <Select
                                                value={multiForm.cur_id}
                                                onChange={(e) => setMultiForm({ ...multiForm, cur_id: e.target.value })}
                                                className="!bg-slate-800 border-white/10 !text-white"
                                            >
                                                <option value="" className="bg-slate-800 text-white">Seleccione Curso</option>
                                                {cursos.map(c => <option key={c.cur_id} value={c.cur_id} className="bg-slate-800 text-white">{c.cur_descripcion}</option>)}
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-white">Observación</Label>
                                            <Textarea
                                                value={multiForm.observacion}
                                                onChange={(e) => setMultiForm({ ...multiForm, observacion: e.target.value })}
                                                placeholder="Detalle general..."
                                                className="!bg-slate-800 border-white/10 !text-white min-h-[100px]"
                                            />
                                        </div>
                                    </div>

                                    {/* Right Column: Beneficiaries */}
                                    <div className="space-y-2 h-full flex flex-col min-h-0">
                                        <Label className="text-white flex justify-between items-center">
                                            Beneficiarios y Montos
                                            <Button type="button" size="sm" variant="outline" onClick={addBeneficiary} className="h-7 text-xs bg-transparent border-white/20 text-white hover:bg-white/10">
                                                <Plus size={12} className="mr-1" /> Agregar
                                            </Button>
                                        </Label>
                                        <div className="space-y-2 overflow-y-auto custom-scrollbar pr-2 flex-1 bg-slate-800/30 rounded-lg p-2 border border-white/5">
                                            {beneficiaries.map((b, index) => (
                                                <div key={index} className="flex gap-2 items-center">
                                                    <Select
                                                        value={b.per_id}
                                                        onChange={(e) => updateBeneficiary(index, 'per_id', e.target.value)}
                                                        required
                                                        className="!bg-slate-800 border-white/10 !text-white flex-1"
                                                    >
                                                        <option value="" className="bg-slate-800 text-white">Seleccione Persona</option>
                                                        {personas.map(p => <option key={p.per_id} value={p.per_id} className="bg-slate-800 text-white">{p.per_nombres} {p.per_apelpat}</option>)}
                                                    </Select>
                                                    <Input
                                                        type="number"
                                                        value={b.amount}
                                                        onChange={(e) => updateBeneficiary(index, 'amount', e.target.value)}
                                                        placeholder="Monto"
                                                        required
                                                        className="!bg-slate-800 border-white/10 !text-white w-24"
                                                    />
                                                    {beneficiaries.length > 1 && (
                                                        <button type="button" onClick={() => removeBeneficiary(index)} className="text-red-400 hover:text-red-300 p-2">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-white/10 mt-auto">
                                    <Button type="submit" disabled={loading} className="bg-emerald-500 hover:bg-emerald-600">
                                        {loading ? <Loader2 className="animate-spin mr-2" /> : 'Registrar Pagos'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default RegistrarPagoMasivoModal;
