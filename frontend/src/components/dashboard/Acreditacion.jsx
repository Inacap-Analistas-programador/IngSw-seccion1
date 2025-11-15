import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Scanner } from '@yudiel/react-qr-scanner';
import { QrCode, Scan, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Acreditacion = () => {
  const { toast } = useToast();

  // --- Generación de QR ---
  const [generatedQR, setGeneratedQR] = useState(null);
  const [copiedGenerated, setCopiedGenerated] = useState(false);

  const generarQR = () => {
    const fakeQR = `https://scout-acreditacion.cl/qr/${crypto.randomUUID()}`;
    setGeneratedQR(fakeQR);

    toast({
      title: 'QR generado',
      description: 'El código QR se generó correctamente.',
    });

    setTimeout(() => setCopiedGenerated(false), 1500);
  };

  const copiarGenerated = () => {
    navigator.clipboard.writeText(generatedQR);
    setCopiedGenerated(true);
    setTimeout(() => setCopiedGenerated(false), 1500);
  };

  // --- Escáner ---
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrResult, setQrResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(qrResult || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-10">
      {/* ---------------------- Card: Generación QR ---------------------- */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-3">
          <QrCode className="w-6 h-6 text-blue-600" />
          Generación de Códigos QR
        </h2>

        <p className="text-gray-600 mb-4">
          Genera un código QR único para la acreditación de un participante.
        </p>

        <Button onClick={generarQR} className="bg-blue-600 hover:bg-blue-900 text-white">
          Generar QR
        </Button>

        {/* Resultado QR */}
        {generatedQR && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
            <p className="text-sm text-gray-700 font-semibold">QR Generado:</p>

            <div className="mt-2 flex items-center gap-2">
              <code className="text-black bg-white px-2 py-1 rounded border">{generatedQR}</code>

              <Button
                variant="ghost"
                size="icon"
                onClick={copiarGenerated}
                className="hover:bg-gray-200"
              >
                {copiedGenerated ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-700" />
                )}
              </Button>
            </div>

            {/* Imagen QR */}
            <div className="mt-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${generatedQR}`}
                alt="QR generado"
                className="border rounded p-2 bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* ---------------------- Card: Escaneo QR ---------------------- */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Scan className="w-6 h-6 text-blue-600" />
          Verificación de Códigos QR
        </h2>

        <p className="text-gray-600 mb-4">
          Escanea el QR de un participante para verificar su acreditación.
        </p>

        <Button
          variant="outline"
          onClick={() => {
            setQrModalOpen(true);
            setQrResult(null);
          }}
        >
          Escanear QR
        </Button>
      </div>

      {/* ---------------------- Modal Escáner ---------------------- */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 relative">
            {/* Botón cerrar */}
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Escanear Código QR
            </h3>

            <div className="rounded-lg overflow-hidden border border-gray-300">
              <Scanner
                onScan={(result) => {
                  if (!result) return;
                  setQrResult(result[0]?.rawValue || null);

                  toast({
                    title: 'QR detectado',
                    description: 'El código se ha leído correctamente.',
                  });
                }}
                onError={(error) => console.error('Error en escáner:', error.message)}
                components={{ torch: true, zoom: true }}
                styles={{ container: { width: '100%' } }}
              />
            </div>

            {/* Resultado del Escáner */}
            {qrResult && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800">Resultado del Código:</h4>

                <div className="flex items-center gap-3 mt-2 bg-white border p-3 rounded-md shadow-sm">
                  <span className="text-gray-700 break-all">{qrResult}</span>

                  {!copied ? (
                    <button onClick={handleCopy} className="text-blue-600 hover:text-blue-800">
                      <Copy className="w-5 h-5" />
                    </button>
                  ) : (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                </div>

                <p className="text-sm mt-3 text-blue-700">
                  *En próximas versiones se validará directamente con el backend.*
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button
                variant="ghost"
                onClick={() => setQrModalOpen(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Acreditacion;
