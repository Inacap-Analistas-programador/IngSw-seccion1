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


      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 
          ${dragActive ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-emerald-500/50 hover:bg-white/5'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={triggerFileDialog}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
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
            className={`inline-flex items-center px-4 py-2 border rounded-lg transition-colors ${formData.medicalFile ? 'border-emerald-500 text-emerald-400 hover:bg-emerald-500/10' : 'border-white/10 text-gray-500 cursor-not-allowed'
              }`}
            disabled={!formData.medicalFile}
          >
            <Download className="w-4 h-4 mr-2" />
            DESCARGAR
          </button>
        </div>

        {formData.medicalFile && (
          <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <p className="text-sm text-emerald-300 font-medium">
              Archivo seleccionado: {formData.medicalFile.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step5MedicalFile;
