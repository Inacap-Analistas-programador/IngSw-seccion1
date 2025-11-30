import React from 'react';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';

const Step6Review = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-foreground mb-2">Revisión y Confirmación</h2>
        <p className="text-gray-600">Revisa tu información antes de enviar la preinscripción.</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Nombre Completo</p>
            <p className="font-semibold text-gray-800">
              {formData.nombreCompleto || 'No especificado'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">RUT</p>
            <p className="font-semibold text-gray-800">{formData.rut || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Correo</p>
            <p className="font-semibold text-gray-800">{formData.correo || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Teléfono</p>
            <p className="font-semibold text-gray-800">{formData.telefono || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Profesión</p>
            <p className="font-semibold text-gray-800">{formData.profesion || 'No especificada'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Religión</p>
            <p className="font-semibold text-gray-800">{formData.religion || 'No especificada'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Número MMAA</p>
            <p className="font-semibold text-gray-800">{formData.numeroMMAA || 'No asignado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Apodo Scout</p>
            <p className="font-semibold text-gray-800">{formData.apodo || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Grupo Scout</p>
            <p className="font-semibold text-gray-800">{formData.grupo || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Rama</p>
            <p className="font-semibold text-gray-800">
              {formData.ramaFormacion || 'No especificado'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tiempo trabajo con NNAJ</p>
            <p className="font-semibold text-gray-800">
              {formData.tiempoTrabajoNNAJ || 'No especificado'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tiempo trabajo con Adultos</p>
            <p className="font-semibold text-gray-800">
              {formData.tiempoTrabajoAdultos || 'No especificado'}
            </p>
          </div>
        </div>
      </div>

      {/* Terms and consent removed per requirement: only 'Enviar' will be shown on final step */}
    </div>
  );
};

export default Step6Review;
