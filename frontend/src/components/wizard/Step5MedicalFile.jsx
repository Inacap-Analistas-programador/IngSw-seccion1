import React, { useRef } from 'react';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Upload, Download } from 'lucide-react';

const Step5MedicalFile = ({ formData, updateFormData }) => {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      if (allowedTypes.includes(file.type)) {
        updateFormData({ medicalFile: file });
      } else {
        alert('Por favor selecciona un archivo PDF, DOCX o XLSX');
      }
    }
  };

  const triggerFileDialog = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleDownload = () => {
    const file = formData.medicalFile;
    if (!file) return alert('No hay archivo para descargar.');
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name || 'ficha_medica';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#001558] mb-2">Carga de Ficha Médica</h2>
        <p className="text-gray-600">Sube tu ficha médica en formato PDF, DOCX o XLSX.</p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary/60 transition-colors duration-300">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={triggerFileDialog}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md"
          >
            <Upload className="w-4 h-4 mr-2" />
            SUBIR
          </button>

          <input
            ref={inputRef}
            id="medicalFile"
            type="file"
            accept=".pdf,.docx,.xlsx"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleDownload}
            className={`inline-flex items-center px-4 py-2 border rounded-md ${
              formData.medicalFile ? 'border-primary text-primary' : 'border-gray-300 text-gray-400'
            }`}
            disabled={!formData.medicalFile}
          >
            <Download className="w-4 h-4 mr-2" />
            DESCARGAR
          </button>
        </div>
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
