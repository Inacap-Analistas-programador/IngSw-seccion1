import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/use-toast';

const AcreditacionManual = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Acreditación Manual</h1>
          <p className="text-gray-600 mt-2">Registro manual de acreditaciones</p>
        </div>
        <Button 
          onClick={() => toast({ description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Nueva Acreditación
        </Button>
      </div>

      <Card>
        <p className="text-gray-600">Formulario de acreditación manual aparecerá aquí.</p>
      </Card>
    </div>
  );
};

export default AcreditacionManual;