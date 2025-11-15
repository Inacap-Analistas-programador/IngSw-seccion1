import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

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
            <p className="font-semibold text-gray-800">{formData.fullName || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">RUT</p>
            <p className="font-semibold text-gray-800">{formData.rut || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold text-gray-800">{formData.email || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Teléfono</p>
            <p className="font-semibold text-gray-800">{formData.phone || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Grupo Scout</p>
            <p className="font-semibold text-gray-800">{formData.group || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Rama</p>
            <p className="font-semibold text-gray-800">{formData.branch || 'No especificado'}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="consent"
            checked={formData.consent}
            onCheckedChange={(checked) => updateFormData({ consent: checked })}
          />
          <div className="flex-1">
            <Label htmlFor="consent" className="cursor-pointer">
              <span className="font-semibold text-gray-800">Acepto los términos y condiciones</span>
              <p className="text-sm text-gray-600 mt-1">
                Confirmo que la información proporcionada es correcta y autorizo el uso de mis datos personales 
                para fines de inscripción en los cursos de formación Scout.
              </p>
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step6Review;