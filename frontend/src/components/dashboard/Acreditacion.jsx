import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/use-toast';

const Acreditacion = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Generación de Códigos QR</h2>
        <p className="text-gray-600 mb-4">Generar códigos QR para participantes (RF-16).</p>
        <Button onClick={() => toast({ description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Generar QR
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Verificación de Códigos QR</h2>
        <p className="text-gray-600 mb-4">Verificar la acreditación de participantes escaneando su QR (RF-16).</p>
        <Button onClick={() => toast({ description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })} variant="outline" className="text-primary-foreground border-border">
          Escanear QR
        </Button>
      </div>
    </div>
  );
};

export default Acreditacion;