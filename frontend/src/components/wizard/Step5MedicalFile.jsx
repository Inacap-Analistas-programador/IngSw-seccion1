import React from 'react';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Upload } from 'lucide-react';

const Step5MedicalFile = ({ formData, updateFormData }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (allowedTypes.includes(file.type)) {
        updateFormData({ medicalFile: file });
      } else {
        alert('Por favor selecciona un archivo PDF, DOCX o XLSX');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#001558] mb-2">Carga de Ficha Médica</h2>
        <p className="text-gray-600">Sube tu ficha médica en formato PDF, DOCX o XLSX.</p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary/60 transition-colors duration-300">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <Label htmlFor="medicalFile" className="cursor-pointer">
          <span className="text-[#001558] font-semibold hover:text-primary-foreground">
            Haz clic para seleccionar un archivo
          </span>
          <p className="text-sm text-gray-500 mt-2">PDF, DOCX o XLSX (máx. 10MB)</p>
        </Label>
        <Input
          id="medicalFile"
          type="file"
          accept=".pdf,.docx,.xlsx"
          onChange={handleFileChange}
          className="hidden"
        />
        {formData.medicalFile && (
          <div className="mt-4 p-3 bg-primary/5 rounded-md">
            <p className="text-sm text-[#001558] font-medium">
              Archivo seleccionado: {formData.medicalFile.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step5MedicalFile;