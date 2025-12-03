import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
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
import preinscripcionService from '@/services/preinscripcionService';
import { personaToApi } from '@/lib/mappers';

const PreRegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    // Paso 1: Datos Personales (llaves en español para coherencia)
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
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
    estadoCivil: '',
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
    // If navigating forward, validate current step before allowing
    if (stepNumber > currentStep) {
      const validation = validateCurrentStep();
      if (!validation.ok) {
        alert(validation.message);
        return;
      }
    }
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const validation = validateCurrentStep();
      if (!validation.ok) {
        alert(validation.message);
        return;
      }
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
    // Removed consent requirement: proceed to submit without checking terms checkbox

    const nombres = formData.nombres || '';
    const apellidoPaterno = formData.apellidoPaterno || '';
    const apellidoMaterno = formData.apellidoMaterno || '';
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
      const createdPersonaResp = await personasService.create(personaToApi(newPersona));
      const createdPersonaData = createdPersonaResp?.data || createdPersonaResp;
      // Extract persona id from possible response shapes
      const personaId = createdPersonaData?.per_id || createdPersonaData?.id || createdPersonaData?.perId || null;

      // Si viene el id del curso en la URL (?curso=123), crear la preinscripción
      const params = new URLSearchParams(location.search);
      const cursoId = params.get('curso');

      // If needs accommodation, append marker to observaciones in PERSONA_CURSO
      let observ = formData.observaciones || '';
      if (formData.needsAccommodation === 'si') {
        observ = observ ? `${observ} (*ALOJAMIENTO*)` : '(*ALOJAMIENTO*)';
      }

      // Validation: Cargo required when Zona + Distrito selected but Grupo not
      if (formData.zona && formData.distrito && !formData.grupo && !formData.cargo) {
        alert('El campo Cargo es obligatorio cuando se selecciona Zona y Distrito sin Grupo.');
        return;
      }

      if (cursoId && personaId) {
        try {
          await preinscripcionService.create({
            persona: personaId,
            curso: cursoId,
            estado: 'enviado',
            observaciones: observ,
          });

          // Upload medical file if exists
          if (formData.medicalFile) {
            const docData = new FormData();
            docData.append('persona', personaId);
            docData.append('tipo_documento', 'ficha_medica');
            docData.append('archivo', formData.medicalFile);

            await preinscripcionService.uploadDocument(docData);
          }
        } catch (e) {
          console.warn('No se pudo crear preinscripción o subir archivo:', e);
        }
      }

      alert('¡Pre-inscripción Exitosa! Tu pre-inscripción ha sido registrada correctamente.');

      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err) {
      console.error('Error al enviar pre-inscripción:', err);
      const errorMessage = err.response?.data || err.response?.data?.message || err.message || 'Error desconocido';
      alert(`Error al enviar la pre-inscripción: ${JSON.stringify(errorMessage)}. Por favor, verifica tu conexión e intenta nuevamente.`);
    }
  };

  const updateFormData = (data) => {
    setFormData({ ...formData, ...data });
  };

  // Validación por paso: evita avanzar si faltan campos obligatorios
  const validateCurrentStep = () => {
    // Devuelve { ok: true } si pasa, o { ok: false, message: '...' } si falla
    switch (currentStep) {
      case 1: {
        if (!formData.nombres || formData.nombres.trim() === '')
          return { ok: false, message: 'Complete sus Nombres antes de continuar.' };
        if (!formData.apellidoPaterno || formData.apellidoPaterno.trim() === '')
          return { ok: false, message: 'Complete su Apellido Paterno antes de continuar.' };
        if (!formData.apellidoMaterno || formData.apellidoMaterno.trim() === '')
          return { ok: false, message: 'Complete su Apellido Materno antes de continuar.' };
        if (!formData.rut || formData.rut.trim() === '')
          return { ok: false, message: 'Complete el RUT antes de continuar.' };
        if (!formData.telefono || formData.telefono.trim() === '')
          return { ok: false, message: 'Complete el teléfono antes de continuar.' };
        return { ok: true };
      }
      case 2: {
        // Requerimos al menos rol o grupo para avanzar
        if ((!formData.rol || formData.rol.trim() === '') && (!formData.grupo || formData.grupo.trim() === ''))
          return { ok: false, message: 'Complete rol o grupo antes de continuar.' };
        return { ok: true };
      }
      case 3: {
        if (!formData.alimentacion || formData.alimentacion.trim() === '')
          return { ok: false, message: 'Indique la alimentación antes de continuar.' };
        return { ok: true };
      }
      case 4: {
        // Paso opcional: no hay campos estrictos, permitir avanzar
        return { ok: true };
      }
      case 5: {
        if (!formData.medicalFile)
          return { ok: false, message: 'Adjunte la ficha médica (PDF) antes de continuar.' };
        return { ok: true };
      }
      default:
        return { ok: true };
    }
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

      <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden flex flex-col">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/scout-planning-bg.png"
            alt="Background"
            className="w-full h-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/30 via-[#020617]/20 to-[#020617]/50" />
        </div>

        {/* Navbar */}
        <nav className="relative z-50 border-b border-white/5 bg-[#020617]/20 backdrop-blur-md h-16 flex-none">
          <div className="container mx-auto px-4 h-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden">
                <img src="/src/assets/scout-logo.png" alt="GIC Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-lg font-bold tracking-tight hidden md:block">GIC Platform</span>
            </div>

            {/* Progress Bar in Navbar (Desktop) or just below */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Paso {currentStep} de {totalSteps}</span>
                <span>{Math.round((currentStep / totalSteps) * 100)}% completado</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-white hover:bg-white/5 text-sm h-8 px-3"
            >
              Salir
            </Button>
          </div>
        </nav>

        {/* Mobile Progress Bar */}
        <div className="md:hidden relative z-40 px-4 py-2 bg-[#020617]/40 backdrop-blur-sm border-b border-white/5">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Paso {currentStep} de {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto relative z-10 py-6 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Form Container */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Step Header */}
              <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  {steps[currentStep - 1].title}
                </h2>
                <div className="text-xs text-emerald-400 font-medium px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                  En progreso
                </div>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CurrentStepComponent formData={formData} updateFormData={updateFormData} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Buttons */}
              <div className="px-6 py-4 bg-white/5 border-t border-white/5 flex justify-between items-center">
                <Button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white disabled:opacity-30 h-9 text-sm"
                >
                  <FaChevronLeft className="w-3 h-3 mr-2" />
                  Anterior
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    onClick={handleNext}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white border-0 h-9 text-sm px-6"
                  >
                    Siguiente
                    <FaChevronRight className="w-3 h-3 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-500 text-white border-0 h-9 text-sm px-6"
                  >
                    <FaCheck className="w-3 h-3 mr-2" />
                    Enviar
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreRegistrationForm;
