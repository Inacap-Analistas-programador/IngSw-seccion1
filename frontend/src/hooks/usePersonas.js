import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import personasService from '@/services/personasService';
import maestrosService from '@/services/maestrosService';
import { getGrupos, getComunas } from '@/services/geografiaService';

/**
 * Custom hook for managing personas state and operations
 */
export const usePersonas = () => {
  const { toast } = useToast();

  // Main state
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Catalogs/Master data
  const [estadosCiviles, setEstadosCiviles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [ramas, setRamas] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [alimentaciones, setAlimentaciones] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [comunas, setComunas] = useState([]);

  // UI state
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    vigente: '',
  });

  // Form data
  const getInitialFormData = () => ({
    per_run: '',
    per_dv: '',
    per_apelpat: '',
    per_apelmat: '',
    per_nombres: '',
    per_email: '',
    per_fecha_nac: '',
    per_direccion: '',
    per_tipo_fono: 1,
    per_fono: '',
    per_alergia_enfermedad: '',
    per_limitacion: '',
    per_nom_emergencia: '',
    per_fono_emergencia: '',
    per_otros: '',
    per_num_mmaa: '',
    per_profesion: '',
    per_tiempo_nnaj: '',
    per_tiempo_adulto: '',
    per_religion: '',
    per_apodo: '',
    per_foto: '',
    per_vigente: true,
    esc_id: '',
    com_id: '',
    usu_id: 1, // Default user for now
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [formErrors, setFormErrors] = useState({});

  // Load initial data
  useEffect(() => {
    loadPersonas();
    loadCatalogs();
  }, []);

  // Load personas
  const loadPersonas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await personasService.getAll();
      // Handle paginated response
      const personasData = data.results || data || [];
      setPersonas(Array.isArray(personasData) ? personasData : []);
    } catch (err) {
      console.error('Error loading personas:', err);
      setError('Error al cargar las personas');
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las personas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load catalogs
  const loadCatalogs = async () => {
    try {
      const [
        estadosCivilesData,
        rolesData,
        gruposData,
        ramasData,
        nivelesData,
        alimentacionesData,
        cargosData,
        comunasData,
      ] = await Promise.all([
        maestrosService.estadosCiviles.getAll(),
        maestrosService.roles.getAll(),
        getGrupos().catch(() => []),
        maestrosService.ramas.getAll(),
        maestrosService.niveles.getAll(),
        maestrosService.alimentaciones.getAll(),
        maestrosService.cargos.getAll(),
        getComunas().catch(() => []),
      ]);

      // Helper to extract results from paginated response
      const extractData = (data) => {
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.results)) return data.results;
        return [];
      };

      setEstadosCiviles(extractData(estadosCivilesData));
      setRoles(extractData(rolesData));
      setGrupos(extractData(gruposData));
      setRamas(extractData(ramasData));
      setNiveles(extractData(nivelesData));
      setAlimentaciones(extractData(alimentacionesData));
      setCargos(extractData(cargosData));
      setComunas(extractData(comunasData));
    } catch (err) {
      console.error('Error loading catalogs:', err);
    }
  };

  // Filter personas
  const filteredPersonas = useCallback(() => {
    let result = [...personas];

    // Search filter (name, RUT, email)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((p) => {
        const fullName = `${p.per_nombres || ''} ${p.per_apelpat || ''} ${p.per_apelmat || ''}`.toLowerCase();
        const rut = (p.per_run || '').toString();
        const email = (p.per_email || '').toLowerCase();
        return fullName.includes(searchLower) || rut.includes(searchLower) || email.includes(searchLower);
      });
    }

    // Vigente filter
    if (filters.vigente !== '') {
      const vigenteBool = filters.vigente === 'true';
      result = result.filter((p) => p.per_vigente === vigenteBool);
    }

    return result;
  }, [personas, filters]);

  // Form handlers
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Calculate RUT verification digit
  const calculateDV = (rut) => {
    if (!rut) return '';
    const rutClean = rut.toString().replace(/\D/g, '');
    if (!rutClean) return '';

    let suma = 0;
    let multiplo = 2;

    for (let i = rutClean.length - 1; i >= 0; i--) {
      suma += parseInt(rutClean[i]) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    const resto = suma % 11;
    const dv = 11 - resto;

    if (dv === 11) return '0';
    if (dv === 10) return 'K';
    return dv.toString();
  };

  const handleRutChange = (rut) => {
    handleInputChange('per_run', rut);
    const dv = calculateDV(rut);
    handleInputChange('per_dv', dv);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.per_run) errors.per_run = 'RUT es requerido';
    if (!formData.per_nombres) errors.per_nombres = 'Nombres es requerido';
    if (!formData.per_apelpat) errors.per_apelpat = 'Apellido paterno es requerido';
    if (!formData.per_email) errors.per_email = 'Email es requerido';
    if (!formData.per_fecha_nac) errors.per_fecha_nac = 'Fecha de nacimiento es requerida';
    if (!formData.per_direccion) errors.per_direccion = 'Dirección es requerida';
    if (!formData.per_fono) errors.per_fono = 'Teléfono es requerido';
    if (!formData.per_apodo) errors.per_apodo = 'Apodo es requerido';
    if (!formData.esc_id) errors.esc_id = 'Estado civil es requerido';
    if (!formData.com_id) errors.com_id = 'Comuna es requerida';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData(getInitialFormData());
    setFormErrors({});
    setSelectedPersona(null);
    setIsEditing(false);
    setShowFormModal(false);
    setShowViewModal(false);
    setShowDeleteModal(false);
  };

  // CRUD Operations
  const handleView = (persona) => {
    setSelectedPersona(persona);
    setShowViewModal(true);
  };

  const handleCreate = () => {
    setFormData(getInitialFormData());
    setIsEditing(false);
    setShowFormModal(true);
  };

  const handleEdit = (persona) => {
    setSelectedPersona(persona);
    setFormData({
      ...persona,
      per_fecha_nac: persona.per_fecha_nac
        ? new Date(persona.per_fecha_nac).toISOString().split('T')[0]
        : '',
    });
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleDelete = (persona) => {
    setSelectedPersona(persona);
    setShowDeleteModal(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: 'Error de validación',
        description: 'Por favor complete todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);

      // Prepare data for API
      const dataToSend = {
        ...formData,
        per_run: parseInt(formData.per_run) || 0,
        per_tipo_fono: parseInt(formData.per_tipo_fono) || 1,
        per_num_mmaa: formData.per_num_mmaa ? parseInt(formData.per_num_mmaa) : null,
        esc_id: parseInt(formData.esc_id),
        com_id: parseInt(formData.com_id),
        usu_id: parseInt(formData.usu_id) || 1,
      };

      if (isEditing && selectedPersona) {
        await personasService.update(selectedPersona.per_id, dataToSend);
        toast({
          title: 'Éxito',
          description: 'Persona actualizada correctamente',
        });
      } else {
        await personasService.create(dataToSend);
        toast({
          title: 'Éxito',
          description: 'Persona creada correctamente',
        });
      }

      await loadPersonas();
      resetForm();
    } catch (err) {
      console.error('Error saving persona:', err);
      toast({
        title: 'Error',
        description: isEditing ? 'Error al actualizar la persona' : 'Error al crear la persona',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedPersona) return;

    try {
      setSaving(true);
      await personasService.delete(selectedPersona.per_id);
      toast({
        title: 'Éxito',
        description: 'Persona eliminada correctamente',
      });
      await loadPersonas();
      resetForm();
    } catch (err) {
      console.error('Error deleting persona:', err);
      toast({
        title: 'Error',
        description: 'Error al eliminar la persona',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Toggle vigente status
  const handleToggleVigente = async (persona) => {
    try {
      await personasService.patch(persona.per_id, {
        per_vigente: !persona.per_vigente,
      });
      toast({
        title: 'Éxito',
        description: persona.per_vigente ? 'Persona desactivada' : 'Persona reactivada',
      });
      await loadPersonas();
    } catch (err) {
      console.error('Error toggling vigente:', err);
      toast({
        title: 'Error',
        description: 'Error al cambiar el estado de la persona',
        variant: 'destructive',
      });
    }
  };

  // Statistics
  const stats = {
    total: personas.length,
    vigentes: personas.filter((p) => p.per_vigente).length,
    noVigentes: personas.filter((p) => !p.per_vigente).length,
  };

  return {
    // Data
    personas,
    filteredPersonas: filteredPersonas(),
    loading,
    error,
    stats,

    // Catalogs
    estadosCiviles,
    roles,
    grupos,
    ramas,
    niveles,
    alimentaciones,
    cargos,
    comunas,

    // Selection & Modals
    selectedPersona,
    showViewModal,
    showFormModal,
    showDeleteModal,
    isEditing,
    saving,

    // Form
    formData,
    formErrors,

    // Filters
    filters,
    setFilters,

    // Setters
    setShowViewModal,
    setShowFormModal,
    setShowDeleteModal,

    // Handlers
    handleInputChange,
    handleRutChange,
    handleView,
    handleCreate,
    handleEdit,
    handleDelete,
    handleSubmit,
    confirmDelete,
    handleToggleVigente,
    resetForm,
    loadPersonas,
  };
};

export default usePersonas;
