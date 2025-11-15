import React from 'react';
import { QrCode } from 'lucide-react';
import Card from '@/components/ui/Card';

const VerificadorQR = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Verificador QR</h1>
        <p className="text-gray-600 mt-2">Escaneo y verificación de códigos QR</p>
      </div>

      <Card className="text-center">
        <QrCode className="w-24 h-24 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Escáner de códigos QR aparecerá aquí.</p>
      </Card>
    </div>
  );
};

export default VerificadorQR;