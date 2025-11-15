import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import {
  Save,
  ChevronLeft,
  Award,
  User,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
} from 'lucide-react';
import Card from '@/components/ui/Card';

const MaestroForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [formData, setFormData] = useState({
    personaId: '',
    habilitacion1: false,
    habilitacion2: false,
    verificacion: false,
    historialCapacitaciones: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Cargar personas disponibles
  useEffect(() => {
    const storedPersonas = JSON.parse(localStorage.getItem('personas') || '[]');
    // Filtrar personas que no sean ya formadores (excepto si estamos editando)
    const formadores = JSON.parse(localStorage.getItem('formadores') || '[]');
    const personasNoFormadores = storedPersonas.filter(
      (persona) =>
        !formadores.some((formador) => formador.personaId === persona.id) ||
        (isEdit && parseInt(id) === persona.id)
    );
    setPersonas(personasNoFormadores);
  }, [id, isEdit]);

  // Cargar datos si es edición
  useEffect(() => {
    if (isEdit) {
      const personas = JSON.parse(localStorage.getItem('personas') || '[]');
      const formadores = JSON.parse(localStorage.getItem('formadores') || '[]');

      const persona = personas.find((p) => p.id === parseInt(id));
      const formador = formadores.find((f) => f.personaId === parseInt(id));

      if (persona && formador) {
        setSelectedPersona(persona);
        setFormData({
          personaId: persona.id,
          habilitacion1: formador.habilitacion1 || false,
          habilitacion2: formador.habilitacion2 || false,
          verificacion: formador.verificacion || false,
          historialCapacitaciones: formador.historialCapacitaciones || '',
        });
      }
    }
  }, [id, isEdit]);

  // Actualizar persona seleccionada
  const handlePersonaChange = (personaId) => {
    const persona = personas.find((p) => p.id === parseInt(personaId));
    setSelectedPersona(persona);
    setFormData((prev) => ({
      ...prev,
      personaId: parseInt(personaId),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.personaId) {
      newErrors.personaId = 'Debe seleccionar una persona';
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
      const formadores = JSON.parse(localStorage.getItem('formadores') || '[]');
      const personas = JSON.parse(localStorage.getItem('personas') || '[]');

      if (isEdit) {
        // Actualizar formador existente
        const index = formadores.findIndex((f) => f.personaId === parseInt(id));
        if (index !== -1) {
          formadores[index] = {
            ...formadores[index],
            ...formData,
          };
        }
      } else {
        // Crear nuevo formador
        const newFormador = {
          id: Date.now(),
          ...formData,
        };
        formadores.push(newFormador);
      }

      // Actualizar persona para marcarla como formador
      const personaIndex = personas.findIndex((p) => p.id === formData.personaId);
      if (personaIndex !== -1) {
        personas[personaIndex] = {
          ...personas[personaIndex],
          esFormador: true,
          habilitacion1: formData.habilitacion1,
          habilitacion2: formData.habilitacion2,
          verificacion: formData.verificacion,
          historialCapacitaciones: formData.historialCapacitaciones,
        };
      }

      localStorage.setItem('formadores', JSON.stringify(formadores));
      localStorage.setItem('personas', JSON.stringify(personas));

      navigate('/maestros');
    } catch (error) {
      console.error('Error al guardar formador:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo cuando se modifica
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const getEstadoFormador = () => {
    const habilitaciones = [formData.habilitacion1, formData.habilitacion2].filter(Boolean).length;

    if (formData.verificacion && habilitaciones >= 2) {
      return { estado: 'Formador Completo', color: 'green', icon: CheckCircle };
    } else if (formData.verificacion || habilitaciones >= 1) {
      return { estado: 'En Proceso', color: 'yellow', icon: Clock };
    } else {
      return { estado: 'Inicial', color: 'red', icon: Clock };
    }
  };

  const estadoFormador = getEstadoFormador();
  const EstadoIcon = estadoFormador.icon;

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Editar Formador' : 'Nuevo Formador'} - Scout Formación</title>
        <meta
          name="description"
          content={`${isEdit ? 'Editar' : 'Crear'} formador en el sistema Scout.`}
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-scout-azul-oscuro text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/maestros')}
                  className="text-white hover:bg-scout-azul-medio"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Volver
                </Button>
                <div className="flex items-center space-x-3">
                  <Award className="w-8 h-8" />
                  <h1 className="text-2xl font-bold">
                    {isEdit ? 'Editar Formador' : 'Nuevo Formador'}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="container mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            {/* Selección de Persona */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card>
                <div className="flex items-center mb-6">
                  <User className="w-6 h-6 text-scout-azul-medio mr-3" />
                  <h2 className="text-xl font-semibold text-scout-azul-oscuro">
                    Seleccionar Persona
                  </h2>
                </div>

                {!isEdit && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Persona a convertir en formador *
                    </label>
                    <select
                      value={formData.personaId}
                      onChange={(e) => handlePersonaChange(e.target.value)}
                      className={`input-scout ${errors.personaId ? 'border-red-500' : ''}`}
                    >
                      <option value="">Seleccione una persona...</option>
                      {personas.map((persona) => (
                        <option key={persona.id} value={persona.id}>
                          {persona.nombres} {persona.apellidoPaterno} {persona.apellidoMaterno} -{' '}
                          {persona.rut}-{persona.dv}
                        </option>
                      ))}
                    </select>
                    {errors.personaId && (
                      <p className="text-red-500 text-sm mt-1">{errors.personaId}</p>
                    )}
                  </div>
                )}

                {/* Mostrar información de la persona seleccionada */}
                {selectedPersona && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-scout-azul-muy-claro rounded-lg p-4 mb-6"
                  >
                    <h3 className="font-semibold text-scout-azul-oscuro mb-3">
                      Información de la Persona:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <strong>Nombre:</strong> {selectedPersona.nombres}{' '}
                          {selectedPersona.apellidoPaterno} {selectedPersona.apellidoMaterno}
                        </p>
                        <p>
                          <strong>RUT:</strong> {selectedPersona.rut}-{selectedPersona.dv}
                        </p>
                        <p>
                          <strong>Correo Electrónico:</strong>{' '}
                          {selectedPersona.correo || selectedPersona.email}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Teléfono:</strong> {selectedPersona.telefono}
                        </p>
                        <p>
                          <strong>Profesión:</strong>{' '}
                          {selectedPersona.profesion || 'No especificada'}
                        </p>
                        <p>
                          <strong>Apodo:</strong> {selectedPersona.apodo}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>

            {/* Habilitaciones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <Card>
                <div className="flex items-center mb-6">
                  <BookOpen className="w-6 h-6 text-scout-azul-medio mr-3" />
                  <h2 className="text-xl font-semibold text-scout-azul-oscuro">Habilitaciones</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.habilitacion1}
                        onChange={(e) => handleInputChange('habilitacion1', e.target.checked)}
                        className="mr-3 w-5 h-5 text-scout-azul-medio focus:ring-scout-azul-medio border-gray-300 rounded"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Habilitación 1</div>
                        <div className="text-xs text-gray-500">Curso básico de formación</div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.habilitacion2}
                        onChange={(e) => handleInputChange('habilitacion2', e.target.checked)}
                        className="mr-3 w-5 h-5 text-scout-azul-medio focus:ring-scout-azul-medio border-gray-300 rounded"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Habilitación 2</div>
                        <div className="text-xs text-gray-500">Curso avanzado de formación</div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.verificacion}
                        onChange={(e) => handleInputChange('verificacion', e.target.checked)}
                        className="mr-3 w-5 h-5 text-scout-azul-medio focus:ring-scout-azul-medio border-gray-300 rounded"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Verificación</div>
                        <div className="text-xs text-gray-500">Formador verificado y activo</div>
                      </div>
                    </label>
                  </div>

                  {/* Estado del Formador */}
                  <div className="md:col-span-2">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Estado del Formador
                      </h3>
                      <div className="flex items-center mb-4">
                        <EstadoIcon
                          className={`w-8 h-8 mr-3 ${
                            estadoFormador.color === 'green'
                              ? 'text-green-500'
                              : estadoFormador.color === 'yellow'
                                ? 'text-yellow-500'
                                : 'text-red-500'
                          }`}
                        />
                        <div>
                          <p
                            className={`text-lg font-semibold ${
                              estadoFormador.color === 'green'
                                ? 'text-green-700'
                                : estadoFormador.color === 'yellow'
                                  ? 'text-yellow-700'
                                  : 'text-red-700'
                            }`}
                          >
                            {estadoFormador.estado}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formData.habilitacion1 &&
                            formData.habilitacion2 &&
                            formData.verificacion
                              ? 'Este formador tiene todas las habilitaciones y está verificado.'
                              : formData.verificacion
                                ? 'Formador verificado pero le faltan habilitaciones.'
                                : formData.habilitacion1 || formData.habilitacion2
                                  ? 'Tiene algunas habilitaciones pero necesita verificación.'
                                  : 'Formador en etapa inicial, necesita habilitaciones y verificación.'}
                          </p>
                        </div>
                      </div>

                      {/* Progreso */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Progreso de Habilitaciones</span>
                          <span>
                            {
                              [formData.habilitacion1, formData.habilitacion2].filter(Boolean)
                                .length
                            }
                            /2
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-scout-azul-medio h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${([formData.habilitacion1, formData.habilitacion2].filter(Boolean).length / 2) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Historial de Capacitaciones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Card>
                <div className="flex items-center mb-6">
                  <FileText className="w-6 h-6 text-scout-azul-medio mr-3" />
                  <h2 className="text-xl font-semibold text-scout-azul-oscuro">
                    Historial de Capacitaciones
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Historial y experiencia en capacitaciones
                  </label>
                  <textarea
                    value={formData.historialCapacitaciones}
                    onChange={(e) => handleInputChange('historialCapacitaciones', e.target.value)}
                    className="input-scout"
                    rows="6"
                    placeholder="Describe la experiencia previa del formador, cursos dictados, especializaciones, años de experiencia, etc.

Ejemplo:
- 2020-2022: Instructor de Curso Básico Scout en Zona Norte
- 2021: Capacitación en Metodología Scout Avanzada
- 2022-presente: Coordinador de Formación Regional
- Especialización en Actividades al Aire Libre
- 8 años de experiencia en formación de dirigentes"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Este campo es importante para llevar un registro del historial de capacitaciones
                    que no están registradas en esta plataforma.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Botones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-end space-x-4"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/maestros')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={loading || !selectedPersona}
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
                    {isEdit ? 'Actualizar' : 'Crear'} Formador
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

export default MaestroForm;
