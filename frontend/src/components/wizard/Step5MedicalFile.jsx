import React, { useRef, useState } from 'react';
import { Upload, Download } from 'lucide-react';

const Step5MedicalFile = ({ formData, updateFormData }) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  const handleFileChange = (file) => {
    if (file) {
      if (allowedTypes.includes(file.type)) {
        if (file.size > 2 * 1024 * 1024) {
          alert('El archivo no debe superar los 2MB.');
          return;
        }
        updateFormData({ medicalFile: file });
      } else {
        alert('Por favor selecciona un archivo PDF, DOCX o XLSX');
      }
    }
  };

  const onInputChange = (e) => handleFileChange(e.target.files[0]);

  const triggerFileDialog = () => inputRef.current?.click();

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

  // Eventos drag & drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#001558] mb-2">Carga de Ficha Médica</h2>
        <p className="text-gray-600">Sube tu ficha médica en formato PDF, DOCX o XLSX.</p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-primary/60'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
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
            onChange={onInputChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleDownload}
            className={`inline-flex items-center px-4 py-2 border rounded-md ${formData.medicalFile ? 'border-primary text-primary' : 'border-gray-300 text-gray-400'
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
