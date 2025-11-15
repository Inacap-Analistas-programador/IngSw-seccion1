import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Step4AdditionalData = ({ formData, updateFormData }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-foreground mb-2">Datos Adicionales</h2>
        <p className="text-gray-600">Información complementaria para tu registro.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicle">¿Tienes Vehículo?</Label>
          <select
            id="vehicle"
            value={formData.vehicle}
            onChange={(e) => handleChange('vehicle', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Seleccionar</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        {formData.vehicle === 'si' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="vehicleBrand">Marca del Vehículo</Label>
              <Input
                id="vehicleBrand"
                value={formData.vehicleBrand}
                onChange={(e) => handleChange('vehicleBrand', e.target.value)}
                placeholder="Toyota, Chevrolet, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleModel">Modelo del Vehículo</Label>
              <Input
                id="vehicleModel"
                value={formData.vehicleModel}
                onChange={(e) => handleChange('vehicleModel', e.target.value)}
                placeholder="Corolla, Spark, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehiclePlate">Patente del Vehículo</Label>
              <Input
                id="vehiclePlate"
                value={formData.vehiclePlate}
                onChange={(e) => handleChange('vehiclePlate', e.target.value)}
                placeholder="AB-CD-12"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="profession">Profesión u Oficio</Label>
          <Input
            id="profession"
            value={formData.profession}
            onChange={(e) => handleChange('profession', e.target.value)}
            placeholder="Tu profesión u oficio"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="workingWithYouth">¿Trabajas con Jóvenes? *</Label>
          <select
            id="workingWithYouth"
            value={formData.workingWithYouth}
            onChange={(e) => handleChange('workingWithYouth', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Seleccionar</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        {formData.workingWithYouth === 'si' && (
          <div className="space-y-2">
            <Label htmlFor="youthWorkTime">Tiempo trabajado con jóvenes</Label>
            <Input
              id="youthWorkTime"
              value={formData.youthWorkTime}
              onChange={(e) => handleChange('youthWorkTime', e.target.value)}
              placeholder="Ejemplo: 5 años, 2 meses, etc."
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="nickname">Apodo Scout</Label>
          <Input
            id="nickname"
            value={formData.nickname}
            onChange={(e) => handleChange('nickname', e.target.value)}
            placeholder="Tu nombre Scout"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="needsAccommodation">¿Necesitas Alojamiento?</Label>
          <select
            id="needsAccommodation"
            value={formData.needsAccommodation}
            onChange={(e) => handleChange('needsAccommodation', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Seleccionar</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="courseExpectations">Observación del curso (qué esperas del curso)</Label>
          <textarea
            id="courseExpectations"
            value={formData.courseExpectations}
            onChange={(e) => handleChange('courseExpectations', e.target.value)}
            placeholder="Describe tus expectativas sobre el curso"
            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            rows={4}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="observations">Observaciones Adicionales</Label>
          <textarea
            id="observations"
            value={formData.observations}
            onChange={(e) => handleChange('observations', e.target.value)}
            placeholder="Información adicional relevante"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default Step4AdditionalData;