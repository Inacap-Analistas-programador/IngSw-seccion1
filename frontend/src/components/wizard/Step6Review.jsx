import React from 'react';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';

const Step6Review = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">


      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Nombres</p>
            <p className="font-semibold text-white">
              {formData.nombres || 'No especificado'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Apellidos</p>
            <p className="font-semibold text-white">
              {`${formData.apellidoPaterno || ''} ${formData.apellidoMaterno || ''}`.trim() || 'No especificado'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">RUT</p>
            <p className="font-semibold text-white">{formData.rut || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Correo</p>
            <p className="font-semibold text-white">{formData.correo || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Teléfono</p>
            <p className="font-semibold text-white">{formData.telefono || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Profesión</p>
            <p className="font-semibold text-white">{formData.profesion || 'No especificada'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Religión</p>
            <p className="font-semibold text-white">{formData.religion || 'No especificada'}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Apodo Scout</p>
            <p className="font-semibold text-white">{formData.apodo || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Grupo Scout</p>
            <p className="font-semibold text-white">{formData.grupo || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Rama</p>
            <p className="font-semibold text-white">
              {formData.ramaFormacion || 'No especificado'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Tiempo trabajo con NNAJ</p>
            <p className="font-semibold text-white">
              {formData.tiempoTrabajoNNAJ || 'No especificado'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Tiempo trabajo con Adultos</p>
            <p className="font-semibold text-white">
              {formData.trabajaConAdultos === 'si' ? formData.tiempoTrabajoAdultos : 'No'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Beneficiario</p>
            <p className="font-semibold text-white">
              {formData.esBeneficiario === 'si' ? `Sí (${formData.tiempoBeneficiario})` : 'No'}
            </p>
          </div>
          {formData.needsAccommodation === 'si' && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-400">Alojamiento</p>
              <p className="font-semibold text-white">
                Sí - {formData.detalleAlojamiento || 'Sin detalles'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Terms and consent removed per requirement: only 'Enviar' will be shown on final step */}
    </div>
  );
};

export default Step6Review;
