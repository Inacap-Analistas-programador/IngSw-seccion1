import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { FaChevronLeft, FaChevronRight, FaCheck, FaAward } from 'react-icons/fa6';
// import { useToast } from '@/components/ui/use-toast';
import Step1PersonalData from '@/components/wizard/Step1PersonalData';
import Step2ScoutInfo from '@/components/wizard/Step2ScoutInfo';
import Step3Health from '@/components/wizard/Step3Health';
import Step4AdditionalData from '@/components/wizard/Step4AdditionalData';
import Step5MedicalFile from '@/components/wizard/Step5MedicalFile';
import Step6Review from '@/components/wizard/Step6Review';
import personasService from '@/services/personasService';
import { personaToApi } from '@/lib/mappers';

const PreRegistrationForm = () => {
  const navigate = useNavigate();
  // const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  // Move console logs to useEffect to avoid side-effects in render (React Strict Mode friendly)
  useEffect(() => {
    console.log(
      '✅ Formulario de Pre-inscripción renderizado correctamente, paso actual:',
      currentStep
    );
  }, [currentStep]);
  const [formData, setFormData] = useState({
    // Paso 1: Datos Personales (llaves en español para coherencia)
    nombreCompleto: '',
    rut: '',
    fechaNacimiento: '',
    correo: '',
    direccion: '',
    comuna: '',
    telefono: '',
    tipoTelefono: '',
    // Paso 2: Información de Organización
    rol: '',
    grupo: '',
    ramaFormacion: '',
    cargo: '',
    antiguedadUnidad: '',
    distrito: '',
    zona: '',
    // Paso 3: Salud y Alimentación
    alimentacion: '',
    alergias: '',
    enfermedades: '',
    limitaciones: '',
    nombreEmergencia: '',
    parentescoEmergencia: '',
    telefonoEmergencia: '',
    // Paso 4: Datos Adicionales
    vehiculo: '',
    vehiculoMarca: '',
    vehiculoModelo: '',
    vehiculoPatente: '',
    profesion: '',
    religion: '',
    numeroMMAA: '',
    trabajaConNNAJ: '',
    tiempoTrabajoNNAJ: '',
    tiempoTrabajoAdultos: '',
    apodo: '',
    needsAccommodation: '',
    expectativasCurso: '',
    observaciones: '',
    // Paso 5: Carga de Ficha Médica
    medicalFile: null,
    // Paso 6: Revisión
    consent: false,
  });

  const totalSteps = 6;

  const steps = [
    { number: 1, title: 'Datos Personales', component: Step1PersonalData },
    { number: 2, title: 'Información de Organización', component: Step2ScoutInfo },
    { number: 3, title: 'Salud y Alimentación', component: Step3Health },
    { number: 4, title: 'Datos Adicionales', component: Step4AdditionalData },
    { number: 5, title: 'Carga de Ficha Médica', component: Step5MedicalFile },
    { number: 6, title: 'Revisión y Confirmación', component: Step6Review },
  ];

  const handleStepClick = (stepNumber) => {
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!formData.consent) {
      alert('Debes aceptar los términos y condiciones para continuar.');
      return;
    }

    const [nombres, ...apellidos] = (formData.nombreCompleto || '').split(' ');
    const apellidoPaterno = apellidos[0] || '';
    const apellidoMaterno = apellidos.slice(1).join(' ') || '';
    const [rutVal, dv] = (formData.rut || '').split('-');

    const newPersona = {
      id: Date.now(),
      rut: rutVal || '',
      dv: dv || '',
      nombres: nombres || '',
      apellidoPaterno,
      apellidoMaterno,
      correo: formData.correo || '',
      fechaNacimiento: formData.fechaNacimiento || '',
      direccion: formData.direccion || '',
      tipoTelefono: formData.tipoTelefono === 'celular' ? 2 : 1,
      telefono: formData.telefono || '',
      profesion: formData.profesion || '',
      religion: formData.religion || '',
      numeroMMAA: formData.numeroMMAA || '',
      apodo: formData.apodo || '',
      alergiasEnfermedades: formData.alergias || '',
      limitaciones: formData.limitaciones || '',
      nombreEmergencia: formData.nombreEmergencia || '',
      telefonoEmergencia: formData.telefonoEmergencia || '',
      otros: formData.observaciones || '',
      tiempoNNAJ: formData.tiempoTrabajoNNAJ || '',
      tiempoAdulto: formData.tiempoTrabajoAdultos || '',
      estadoCivilId: '',
      comunaId: formData.comuna || '',
      usuarioId: '',
      vigente: true,
      esFormador: false,
      habilitacion1: false,
      habilitacion2: false,
      verificacion: false,
      historialCapacitaciones: '',
      fechaCreacion: new Date().toISOString(),
    };

    try {
      // Enviar al backend con mapeador para mantener coherencia con la API (per_*)
      await personasService.create(personaToApi(newPersona));
      console.log('Persona enviada al API correctamente');
      
      alert('¡Pre-inscripción Exitosa! Tu pre-inscripción ha sido registrada correctamente.');
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Error al enviar pre-inscripción:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
      alert(`Error al enviar la pre-inscripción: ${errorMessage}. Por favor, verifica tu conexión e intenta nuevamente.`);
    }
  };

  const updateFormData = (data) => {
    setFormData({ ...formData, ...data });
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <>
      <Helmet>
        <title>Pre-inscripción - GIC Platform</title>
        <meta
          name="description"
          content="Completa tu pre-inscripción para los cursos de capacitación."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Encabezado */}
        <div className="bg-primary text-primary-foreground shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <FaAward className="w-6 h-6 text-[#001558]" />
                </div>
                <span className="text-xl font-bold">Formulario de Pre-inscripción</span>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-white hover:bg-primary/90"
              >
                Volver al Inicio
              </Button>
            </div>
          </div>
        </div>

        {/* Indicador de Progreso */}
        <div className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                        currentStep > step.number
                          ? 'bg-primary text-primary-foreground'
                          : currentStep === step.number
                            ? 'bg-primary text-primary-foreground ring-4 ring-primary/30'
                            : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {currentStep > step.number ? <FaCheck className="w-5 h-5" /> : step.number}
                    </div>
                    <span
                      className={`text-xs mt-2 text-center hidden md:block ${
                        currentStep >= step.number
                          ? 'text-[#001558] font-semibold'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                        currentStep > step.number ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Paso {currentStep} de {totalSteps}:{' '}
                <span className="font-semibold text-[#001558]">{steps[currentStep - 1].title}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Contenido del Formulario */}
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CurrentStepComponent formData={formData} updateFormData={updateFormData} />
              </motion.div>
            </AnimatePresence>

            {/* Botones de Navegación */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                variant="outline"
                className="border border-border text-[#001558] hover:bg-primary/5"
              >
                <FaChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Siguiente
                  <FaChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <FaCheck className="w-4 h-4 mr-2" />
                  Enviar Pre-inscripción
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PreRegistrationForm;
