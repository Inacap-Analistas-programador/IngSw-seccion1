import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Card from '@/components/ui/Card';
import { useToast } from '@/components/ui/use-toast';
import {
  Mail,
  Send,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2,
} from 'lucide-react';

const EnvioCorreo = () => {
  const { toast } = useToast();
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [emailData, setEmailData] = useState({
    destinatarios: '',
    asunto: '',
    mensaje: '',
    tipoDestinatario: 'todos',
  });
  const [sentEmails, setSentEmails] = useState([
    {
      id: 1,
      asunto: 'Recordatorio: Curso de Liderazgo Scout',
      destinatarios: 45,
      fecha: '2024-01-15 14:30',
      estado: 'enviado',
    },
    {
      id: 2,
      asunto: 'Inscripciones abiertas para Formación Básica',
      destinatarios: 120,
      fecha: '2024-01-14 10:15',
      estado: 'enviado',
    },
    {
      id: 3,
      asunto: 'Actualización: Nuevas fechas disponibles',
      destinatarios: 78,
      fecha: '2024-01-13 16:45',
      estado: 'enviado',
    },
  ]);

  const stats = [
    {
      label: 'Correos Enviados',
      value: sentEmails.length,
      icon: Mail,
      color: 'bg-blue-500',
    },
    {
      label: 'Destinatarios Totales',
      value: sentEmails.reduce((acc, email) => acc + email.destinatarios, 0),
      icon: Users,
      color: 'bg-green-500',
    },
    {
      label: 'Plantillas',
      value: 5,
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      label: 'Programados',
      value: 0,
      icon: Clock,
      color: 'bg-yellow-500',
    },
  ];

  const handleInputChange = (field, value) => {
    setEmailData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSendEmail = () => {
    if (!emailData.asunto || !emailData.mensaje) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    const newEmail = {
      id: sentEmails.length + 1,
      asunto: emailData.asunto,
      destinatarios: emailData.tipoDestinatario === 'todos' ? 150 : 45,
      fecha: new Date().toLocaleString('es-CL'),
      estado: 'enviado',
    };

    setSentEmails([newEmail, ...sentEmails]);
    setShowComposeModal(false);
    setEmailData({
      destinatarios: '',
      asunto: '',
      mensaje: '',
      tipoDestinatario: 'todos',
    });

    toast({
      title: 'Correo enviado',
      description: `Se ha enviado el correo a ${newEmail.destinatarios} destinatarios`,
    });
  };

  const handleDeleteEmail = (id) => {
    setSentEmails(sentEmails.filter((email) => email.id !== id));
    toast({
      title: 'Correo eliminado',
      description: 'El registro ha sido eliminado del historial',
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Gestión de Correos</h2>
            <p className="text-gray-600 text-sm mt-1">
              Envía comunicaciones masivas a participantes y formadores
            </p>
          </div>
          <Button
            onClick={() => setShowComposeModal(true)}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            <Mail className="w-4 h-4 mr-2" />
            Redactar Correo
          </Button>
        </div>
      </Card>

      {/* Email History */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Historial de Envíos</h2>
        <div className="space-y-3">
          {sentEmails.length > 0 ? (
            sentEmails.map((email) => (
              <motion.div
                key={email.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{email.asunto}</h3>
                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {email.destinatarios} destinatarios
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {email.fecha}
                      </span>
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Enviado
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      toast({
                        title: 'Ver detalles',
                        description: 'Función de vista de detalles en desarrollo',
                      })
                    }
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEmail(email.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No hay correos enviados todavía</p>
            </div>
          )}
        </div>
      </Card>

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Redactar Correo</h3>
              <button
                onClick={() => setShowComposeModal(false)}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="tipoDestinatario">Destinatarios</Label>
                <select
                  id="tipoDestinatario"
                  value={emailData.tipoDestinatario}
                  onChange={(e) => handleInputChange('tipoDestinatario', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos los participantes</option>
                  <option value="inscritos">Solo inscritos en cursos</option>
                  <option value="formadores">Formadores y maestros</option>
                  <option value="pendientes">Con pagos pendientes</option>
                  <option value="custom">Lista personalizada</option>
                </select>
              </div>

              {emailData.tipoDestinatario === 'custom' && (
                <div>
                  <Label htmlFor="destinatarios">Correos (separados por coma)</Label>
                  <Input
                    id="destinatarios"
                    type="text"
                    placeholder="correo1@ejemplo.com, correo2@ejemplo.com"
                    value={emailData.destinatarios}
                    onChange={(e) => handleInputChange('destinatarios', e.target.value)}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="asunto">
                  Asunto <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="asunto"
                  type="text"
                  placeholder="Asunto del correo"
                  value={emailData.asunto}
                  onChange={(e) => handleInputChange('asunto', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="mensaje">
                  Mensaje <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="mensaje"
                  rows="8"
                  placeholder="Escribe tu mensaje aquí..."
                  value={emailData.mensaje}
                  onChange={(e) => handleInputChange('mensaje', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Variables disponibles:</p>
                    <p>
                      <code className="bg-white px-2 py-1 rounded">{'{{nombre}}'}</code> - Nombre
                      del destinatario
                    </p>
                    <p>
                      <code className="bg-white px-2 py-1 rounded">{'{{curso}}'}</code> - Nombre del
                      curso
                    </p>
                    <p>
                      <code className="bg-white px-2 py-1 rounded">{'{{fecha}}'}</code> - Fecha del
                      evento
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSendEmail}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Correo
                </Button>
                <Button variant="outline" onClick={() => setShowComposeModal(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EnvioCorreo;
