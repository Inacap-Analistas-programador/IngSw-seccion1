import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import pagosService from '../services/pagosService';
import cursosService from '../services/cursosService'; // Asumiendo que existe
import personasService from '../services/personasService'; // Asumiendo que existe
import ComprobantesPagos from '../components/dashboard/ComprobantesPagos';
import PagosProveedores from '../components/dashboard/PagosProveedores';

const PagosPage = () => {
  const { toast } = useToast();
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCursos();
  }, []);

  useEffect(() => {
    if (selectedCurso) {
      loadDashboard(selectedCurso);
    }
  }, [selectedCurso]);

  const loadCursos = async () => {
    try {
      // Ajustar según el servicio real de cursos
      const data = await cursosService.getAll();
      setCursos(data.results || data);
    } catch (error) {
      console.error("Error cargando cursos", error);
    }
  };

  const loadDashboard = async (curId) => {
    try {
      const data = await pagosService.getDashboard(curId);
      setDashboardData(data);
    } catch (error) {
      console.error("Error cargando dashboard", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión Financiera</h1>

      <div className="mb-6">
        <Label>Seleccionar Curso</Label>
        <Select onValueChange={setSelectedCurso} value={selectedCurso}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Seleccione un curso..." />
          </SelectTrigger>
          <SelectContent>
            {cursos.map(c => (
              <SelectItem key={c.cur_id} value={c.cur_id.toString()}>
                {c.cur_descripcion || c.cur_codigo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCurso && (
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="pagos">Pagos</TabsTrigger>
            <TabsTrigger value="comprobantes">Comprobantes</TabsTrigger>
            <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
            <TabsTrigger value="prepagos">Prepagos (Gastos Previstos)</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardTab data={dashboardData} />
          </TabsContent>

          <TabsContent value="pagos">
            <PagosTab curId={selectedCurso} />
          </TabsContent>

          <TabsContent value="comprobantes">
            <ComprobantesPagos />
          </TabsContent>

          <TabsContent value="proveedores">
            <PagosProveedores />
          </TabsContent>

          <TabsContent value="prepagos">
            <PrepagosTab curId={selectedCurso} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

const DashboardTab = ({ data }) => {
  if (!data) return <div>Cargando...</div>;

  const { global, evolucion } = data;

  return (
    <div className="grid gap-4 md:grid-cols-3 mt-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">${global.total_ingresos}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Egresos Totales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">${global.total_egresos}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${global.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            ${global.balance}
          </div>
        </CardContent>
      </Card>

      {/* Aquí se podría agregar un gráfico con 'evolucion' */}
    </div>
  );
};

const PagosTab = ({ curId }) => {
  // Implementación simplificada para registro masivo/multi-persona
  const { toast } = useToast();
  const [mode, setMode] = useState('individual'); // individual, multi
  const [amount, setAmount] = useState('');
  const [observacion, setObservacion] = useState('');

  const handleRegister = async () => {
    // Lógica de registro
    toast({ title: "Función en desarrollo", description: "Aquí iría el formulario de pagos." });
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Registro de Pagos</CardTitle>
        <CardDescription>Registra ingresos o egresos del curso.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button variant={mode === 'individual' ? 'default' : 'outline'} onClick={() => setMode('individual')}>Individual</Button>
            <Button variant={mode === 'multi' ? 'default' : 'outline'} onClick={() => setMode('multi')}>Masivo / Multi-persona</Button>
          </div>

          <div className="grid gap-2">
            <Label>Monto</Label>
            <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Observación</Label>
            <Input value={observacion} onChange={e => setObservacion(e.target.value)} />
          </div>

          <Button onClick={handleRegister}>Registrar Pago</Button>
        </div>
      </CardContent>
    </Card>
  );
};


const PrepagosTab = ({ curId }) => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Gastos Previstos (Prepagos)</CardTitle>
        <CardDescription>Registre gastos futuros o solicitudes de fondos (ej. movilización).</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Lista de prepagos y formulario de creación...</p>
      </CardContent>
    </Card>
  );
};

export default PagosPage;
