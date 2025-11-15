import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/use-toast';

const EnvioCorreo = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Envío de Correo</h1>
          <p className="text-gray-600 mt-2">Envío masivo de correos electrónicos</p>
        </div>
        <Button
          onClick={() =>
            toast({
              description:
                "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
            })
          }
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Nuevo Correo
        </Button>
      </div>

      <div className="bg-card rounded-lg shadow-md p-6">
        <p className="text-muted-foreground">Herramienta de envío de correos aparecerá aquí.</p>
      </div>
    </div>
  );
};

export default EnvioCorreo;
