import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { 
  Save, 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  FileText,
  Heart,
  AlertTriangle,
  Car,
  Award,
  Clock
} from 'lucide-react';

const PersonaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    // Datos básicos
    rut: '',
    dv: '',
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    fechaNacimiento: '',
    direccion: '',
    tipoTelefono: 1, // 1: Fijo, 2: Celular, 3: Celular/WhatsApp, 4: WhatsApp
    telefono: '',
    
    // Información adicional
    profesion: '',
    religion: '',
    apodo: '',
    
    // Datos médicos y emergencia
    alergiasEnfermedades: '',
    limitaciones: '',
    nombreEmergencia: '',
    telefonoEmergencia: '',
    otros: '',
    
    // Experiencia Scout
    numeroMMAA: '',
    tiempoNNAJ: '',
    tiempoAdulto: '',
    
    // Relaciones
    estadoCivilId: '',
    comunaId: '',
    usuarioId: '',
    
    // Estados
    vigente: true,
    esFormador: false,
    
    // Datos de formador (si aplica)
    habilitacion1: false,
    habilitacion2: false,
    verificacion: false,
    historialCapacitaciones: '',
    
    // Timestamps
    fechaCreacion: new Date().toISOString()
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Cargar datos si es edición
  useEffect(() => {
    if (isEdit) {
      const personas = JSON.parse(localStorage.getItem('personas') || '[]');
      const persona = personas.find(p => p.id === parseInt(id));
      if (persona) {
        setFormData(persona);
      }
    }
  }, [id, isEdit]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.rut) newErrors.rut = 'RUT es requerido';
    if (!formData.dv) newErrors.dv = 'Dígito verificador es requerido';
    if (!formData.nombres) newErrors.nombres = 'Nombres son requeridos';
    if (!formData.apellidoPaterno) newErrors.apellidoPaterno = 'Apellido paterno es requerido';
    if (!formData.email) newErrors.email = 'Email es requerido';
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'Fecha de nacimiento es requerida';
    if (!formData.direccion) newErrors.direccion = 'Dirección es requerida';
    if (!formData.telefono) newErrors.telefono = 'Teléfono es requerido';
    if (!formData.apodo) newErrors.apodo = 'Apodo es requerido';
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }
    
    // Validar RUT (básico)
    const rutRegex = /^\d{7,8}$/;
    if (formData.rut && !rutRegex.test(formData.rut)) {
      newErrors.rut = 'RUT debe tener 7 u 8 dígitos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const personas = JSON.parse(localStorage.getItem('personas') || '[]');
      
      if (isEdit) {
        // Actualizar persona existente
        const index = personas.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
          personas[index] = { ...formData, id: parseInt(id) };
        }
      } else {
        // Crear nueva persona
        const newPersona = {
          ...formData,
          id: Date.now()
        };
        personas.push(newPersona);
        
        // Si es formador, agregar también a la lista de formadores
        if (formData.esFormador) {
          const formadores = JSON.parse(localStorage.getItem('formadores') || '[]');
          formadores.push({
            id: newPersona.id,
            personaId: newPersona.id,
            habilitacion1: formData.habilitacion1,
            habilitacion2: formData.habilitacion2,
            verificacion: formData.verificacion,
            historialCapacitaciones: formData.historialCapacitaciones
          });
          localStorage.setItem('formadores', JSON.stringify(formadores));
        }
      }
      
      localStorage.setItem('personas', JSON.stringify(personas));
      
      navigate('/personas');
    } catch (error) {
      console.error('Error al guardar persona:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando se modifica
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Editar Persona' : 'Nueva Persona'} - Scout Formación</title>
        <meta name="description" content={`${isEdit ? 'Editar' : 'Crear'} persona en el sistema Scout.`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-scout-azul-oscuro text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/personas')}
                  className="text-white hover:bg-scout-azul-medio"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Volver
                </Button>
                <div className="flex items-center space-x-3">
                  <User className="w-8 h-8" />
                  <h1 className="text-2xl font-bold">
                    {isEdit ? 'Editar Persona' : 'Nueva Persona'}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="container mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            {/* Datos Básicos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6 mb-6"
            >
              <div className="flex items-center mb-6">
                <User className="w-6 h-6 text-scout-azul-medio mr-3" />
                <h2 className="text-xl font-semibold text-scout-azul-oscuro">Datos Básicos</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RUT *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="12345678"
                      value={formData.rut}
                      onChange={(e) => handleInputChange('rut', e.target.value)}
                      className={`flex-1 input-scout ${errors.rut ? 'border-red-500' : ''}`}
                    />
                    <input
                      type="text"
                      placeholder="9"
                      maxLength="1"
                      value={formData.dv}
                      onChange={(e) => handleInputChange('dv', e.target.value)}
                      className={`w-16 input-scout ${errors.dv ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.rut && <p className="text-red-500 text-sm mt-1">{errors.rut}</p>}
                  {errors.dv && <p className="text-red-500 text-sm mt-1">{errors.dv}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombres *
                  </label>
                  <input
                    type="text"
                    value={formData.nombres}
                    onChange={(e) => handleInputChange('nombres', e.target.value)}
                    className={`input-scout ${errors.nombres ? 'border-red-500' : ''}`}
                  />
                  {errors.nombres && <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido Paterno *
                  </label>
                  <input
                    type="text"
                    value={formData.apellidoPaterno}
                    onChange={(e) => handleInputChange('apellidoPaterno', e.target.value)}
                    className={`input-scout ${errors.apellidoPaterno ? 'border-red-500' : ''}`}
                  />
                  {errors.apellidoPaterno && <p className="text-red-500 text-sm mt-1">{errors.apellidoPaterno}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido Materno
                  </label>
                  <input
                    type="text"
                    value={formData.apellidoMaterno}
                    onChange={(e) => handleInputChange('apellidoMaterno', e.target.value)}
                    className="input-scout"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`input-scout ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                    className={`input-scout ${errors.fechaNacimiento ? 'border-red-500' : ''}`}
                  />
                  {errors.fechaNacimiento && <p className="text-red-500 text-sm mt-1">{errors.fechaNacimiento}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Dirección *
                  </label>
                  <textarea
                    value={formData.direccion}
                    onChange={(e) => handleInputChange('direccion', e.target.value)}
                    className={`input-scout ${errors.direccion ? 'border-red-500' : ''}`}
                    rows="2"
                  />
                  {errors.direccion && <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apodo *
                  </label>
                  <input
                    type="text"
                    value={formData.apodo}
                    onChange={(e) => handleInputChange('apodo', e.target.value)}
                    className={`input-scout ${errors.apodo ? 'border-red-500' : ''}`}
                  />
                  {errors.apodo && <p className="text-red-500 text-sm mt-1">{errors.apodo}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Teléfono *
                  </label>
                  <select
                    value={formData.tipoTelefono}
                    onChange={(e) => handleInputChange('tipoTelefono', parseInt(e.target.value))}
                    className="input-scout"
                  >
                    <option value={1}>Teléfono Fijo</option>
                    <option value={2}>Celular</option>
                    <option value={3}>Celular/WhatsApp</option>
                    <option value={4}>WhatsApp</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Teléfono *
                  </label>
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    className={`input-scout ${errors.telefono ? 'border-red-500' : ''}`}
                  />
                  {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
                </div>
              </div>
            </motion.div>

            {/* Información Adicional */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 mb-6"
            >
              <div className="flex items-center mb-6">
                <FileText className="w-6 h-6 text-scout-azul-medio mr-3" />
                <h2 className="text-xl font-semibold text-scout-azul-oscuro">Información Adicional</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profesión
                  </label>
                  <input
                    type="text"
                    value={formData.profesion}
                    onChange={(e) => handleInputChange('profesion', e.target.value)}
                    className="input-scout"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Religión
                  </label>
                  <input
                    type="text"
                    value={formData.religion}
                    onChange={(e) => handleInputChange('religion', e.target.value)}
                    className="input-scout"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número MMAA
                  </label>
                  <input
                    type="number"
                    value={formData.numeroMMAA}
                    onChange={(e) => handleInputChange('numeroMMAA', e.target.value)}
                    className="input-scout"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Tiempo trabajo con NNAJ
                  </label>
                  <input
                    type="text"
                    placeholder="ej. 5 años"
                    value={formData.tiempoNNAJ}
                    onChange={(e) => handleInputChange('tiempoNNAJ', e.target.value)}
                    className="input-scout"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Tiempo trabajo con Adultos
                  </label>
                  <input
                    type="text"
                    placeholder="ej. 3 años"
                    value={formData.tiempoAdulto}
                    onChange={(e) => handleInputChange('tiempoAdulto', e.target.value)}
                    className="input-scout"
                  />
                </div>
              </div>
            </motion.div>

            {/* Información Médica y Emergencia */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6 mb-6"
            >
              <div className="flex items-center mb-6">
                <Heart className="w-6 h-6 text-scout-azul-medio mr-3" />
                <h2 className="text-xl font-semibold text-scout-azul-oscuro">Información Médica y Emergencia</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    Alergias y Enfermedades
                  </label>
                  <textarea
                    value={formData.alergiasEnfermedades}
                    onChange={(e) => handleInputChange('alergiasEnfermedades', e.target.value)}
                    className="input-scout"
                    rows="3"
                    placeholder="Describe cualquier alergia o enfermedad relevante..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Limitaciones
                  </label>
                  <textarea
                    value={formData.limitaciones}
                    onChange={(e) => handleInputChange('limitaciones', e.target.value)}
                    className="input-scout"
                    rows="3"
                    placeholder="Describe cualquier limitación física o médica..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Contacto de Emergencia
                  </label>
                  <input
                    type="text"
                    value={formData.nombreEmergencia}
                    onChange={(e) => handleInputChange('nombreEmergencia', e.target.value)}
                    className="input-scout"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono de Emergencia
                  </label>
                  <input
                    type="text"
                    value={formData.telefonoEmergencia}
                    onChange={(e) => handleInputChange('telefonoEmergencia', e.target.value)}
                    className="input-scout"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Otros datos relevantes
                </label>
                <textarea
                  value={formData.otros}
                  onChange={(e) => handleInputChange('otros', e.target.value)}
                  className="input-scout"
                  rows="3"
                  placeholder="Cualquier otra información relevante..."
                />
              </div>
            </motion.div>

            {/* Configuración de Formador */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6 mb-6"
            >
              <div className="flex items-center mb-6">
                <Award className="w-6 h-6 text-scout-azul-medio mr-3" />
                <h2 className="text-xl font-semibold text-scout-azul-oscuro">Configuración de Formador</h2>
              </div>
              
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.esFormador}
                    onChange={(e) => handleInputChange('esFormador', e.target.checked)}
                    className="mr-3 w-4 h-4 text-scout-azul-medio focus:ring-scout-azul-medio border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Esta persona es un formador
                  </span>
                </label>
              </div>
              
              {formData.esFormador && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.habilitacion1}
                        onChange={(e) => handleInputChange('habilitacion1', e.target.checked)}
                        className="mr-3 w-4 h-4 text-scout-azul-medio focus:ring-scout-azul-medio border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Habilitación 1
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.habilitacion2}
                        onChange={(e) => handleInputChange('habilitacion2', e.target.checked)}
                        className="mr-3 w-4 h-4 text-scout-azul-medio focus:ring-scout-azul-medio border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Habilitación 2
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.verificacion}
                        onChange={(e) => handleInputChange('verificacion', e.target.checked)}
                        className="mr-3 w-4 h-4 text-scout-azul-medio focus:ring-scout-azul-medio border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Verificado
                      </span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Historial de Capacitaciones
                    </label>
                    <textarea
                      value={formData.historialCapacitaciones}
                      onChange={(e) => handleInputChange('historialCapacitaciones', e.target.value)}
                      className="input-scout"
                      rows="4"
                      placeholder="Describe el historial de capacitaciones y cursos realizados..."
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Estado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6 mb-6"
            >
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.vigente}
                    onChange={(e) => handleInputChange('vigente', e.target.checked)}
                    className="mr-3 w-4 h-4 text-scout-azul-medio focus:ring-scout-azul-medio border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Persona activa en el sistema
                  </span>
                </label>
              </div>
            </motion.div>

            {/* Botones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end space-x-4"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/personas')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              
              <Button
                type="submit"
                disabled={loading}
                className="bg-scout-azul-medio hover:bg-scout-azul-oscuro"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEdit ? 'Actualizar' : 'Crear'} Persona
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PersonaForm;