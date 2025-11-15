
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Check, Award } from 'lucide-react';
// import { useToast } from '@/components/ui/use-toast';
import Step1PersonalData from '@/components/wizard/Step1PersonalData';
import Step2ScoutInfo from '@/components/wizard/Step2ScoutInfo';
import Step3Health from '@/components/wizard/Step3Health';
import Step4AdditionalData from '@/components/wizard/Step4AdditionalData';
import Step5MedicalFile from '@/components/wizard/Step5MedicalFile';
import Step6Review from '@/components/wizard/Step6Review';

const PreRegistrationForm = () => {
  const navigate = useNavigate();
  // const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  
  console.log('✅ PreRegistrationForm renderizado correctamente, currentStep:', currentStep);
  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    rut: '',
    birthDate: '',
    email: '',
    address: '',
    commune: '',
    phone: '',
    phoneType: '',
    // Step 2
    role: '',
    group: '',
    branch: '',
    position: '',
    unitAntiquity: '',
    district: '',
    zone: '',
    // Step 3 - Salud
    diet: '',
    allergies: '',
    diseases: '',
    limitations: '',
    emergencyContact: '',
    emergencyRelation: '',
    emergencyPhone: '',
    // Step 4 - Datos Adicionales
    vehicle: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehiclePlate: '',
    profession: '',
    workingWithYouth: '',
    youthWorkTime: '',
    nickname: '',
    needsAccommodation: '',
    courseExpectations: '',
    observations: '',
    // Step 5 - Ficha Médica
    medicalFile: null,
    // Step 6 - Revisión
    consent: false
  });

  const totalSteps = 6;

  const steps = [
    { number: 1, title: 'Datos Personales', component: Step1PersonalData },
    { number: 2, title: 'Información Scout', component: Step2ScoutInfo },
    { number: 3, title: 'Salud y Alimentación', component: Step3Health },
    { number: 4, title: 'Datos Adicionales', component: Step4AdditionalData },
    { number: 5, title: 'Carga de Ficha Médica', component: Step5MedicalFile },
    { number: 6, title: 'Revisión y Confirmación', component: Step6Review }
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

  const handleSubmit = () => {
    if (!formData.consent) {
      // toast({
      //   title: "Error",
      //   description: "Debes aceptar los términos y condiciones para continuar.",
      //   variant: "destructive"
      // });
      alert("Debes aceptar los términos y condiciones para continuar.");
      return;
    }

    // Store in localStorage
    const existingRegistrations = JSON.parse(localStorage.getItem('preregistrations') || '[]');
    const newRegistration = {
      id: Date.now(),
      ...formData,
      submittedAt: new Date().toISOString()
    };
    existingRegistrations.push(newRegistration);
    localStorage.setItem('preregistrations', JSON.stringify(existingRegistrations));

    // toast({
    //   title: "¡Preinscripción Exitosa!",
    //   description: "Tu preinscripción ha sido registrada correctamente.",
    // });
    alert("¡Preinscripción Exitosa! Tu preinscripción ha sido registrada correctamente.");

    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const updateFormData = (data) => {
    setFormData({ ...formData, ...data });
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <>
      <Helmet>
        <title>Preinscripción - Scout Formación</title>
        <meta name="description" content="Completa tu preinscripción para los cursos de formación Scout." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-primary text-primary-foreground shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#001558]" />
                </div>
                <span className="text-xl font-bold">Preinscripción Scout</span>
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

        {/* Progress Indicator */}
        <div className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      currentStep > step.number 
                        ? 'bg-primary text-primary-foreground' 
                        : currentStep === step.number 
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/30' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                    </div>
                    <span className={`text-xs mt-2 text-center hidden md:block ${
                      currentStep >= step.number ? 'text-[#001558] font-semibold' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                      currentStep > step.number ? 'bg-primary' : 'bg-gray-200'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Paso {currentStep} de {totalSteps}: <span className="font-semibold text-[#001558]">{steps[currentStep - 1].title}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
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
                <CurrentStepComponent 
                  formData={formData} 
                  updateFormData={updateFormData}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                variant="outline"
                className="border border-border text-[#001558] hover:bg-primary/5"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Enviar Preinscripción
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