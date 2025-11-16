import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import emailService from '../services/emailService';
import { Button } from '@/components/ui/Button';
import {
  FaEnvelope,
  FaPaperPlane,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaChartBar,
} from 'react-icons/fa';

/**
 * Página de demostración del sistema de correos electrónicos
 * Muestra ejemplos de envío y gestión de emails
 */
const EmailSystemDemo = () => {
  const [templates, setTemplates] = useState([]);
  const [logs, setLogs] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailForm, setEmailForm] = useState({
    recipientEmail: '',
    recipientName: '',
    templateName: 'registration_confirmation',
  });
  const [activeTab, setActiveTab] = useState('send');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchTemplates();
    fetchLogs();
    fetchStatistics();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await emailService.getTemplates();
      setTemplates(data.results || data);
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  const fetchLogs = async () => {
    try {
      const data = await emailService.getLogs({ limit: 10 });
      setLogs(data.results || data);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  const fetchStatistics = async () => {
    try {
      const data = await emailService.getStatistics();
      setStatistics(data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setSendingEmail(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await emailService.sendFromTemplate({
        template_name: emailForm.templateName,
        recipient_email: emailForm.recipientEmail,
        context: {
          username: emailForm.recipientName,
          email: emailForm.recipientEmail,
          verification_token: 'demo-token-' + Date.now(),
          verification_url: `${window.location.origin}/verificar`,
        },
        queue: false,
        priority: 2,
      });

      setSuccessMessage('Email enviado exitosamente!');
      setEmailForm({
        recipientEmail: '',
        recipientName: '',
        templateName: 'registration_confirmation',
      });
      fetchLogs();
      fetchStatistics();
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error || 'Error al enviar el email. Intenta nuevamente.'
      );
    } finally {
      setSendingEmail(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'failed':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaEnvelope className="text-gray-500" />;
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      sent: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      delivered: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('es-CL');
  };

  return (
    <>
      <Helmet>
        <title>Sistema de Emails - GIC</title>
        <meta name="description" content="Demostración del sistema de correos electrónicos" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mb-4 shadow-lg">
              <FaEnvelope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Sistema de Correos Electrónicos
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sistema completo de gestión de emails con plantillas, logs y estadísticas
            </p>
          </motion.div>

          {/* Statistics */}
          {statistics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <FaChartBar className="w-8 h-8 text-blue-500" />
                  <span className="text-3xl font-bold text-gray-900">
                    {statistics.total || 0}
                  </span>
                </div>
                <p className="text-gray-600 font-medium">Total Enviados</p>
              </div>

              {statistics.statistics?.map((stat) => (
                <div key={stat.status} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    {getStatusIcon(stat.status)}
                    <span className="text-3xl font-bold text-gray-900">{stat.count}</span>
                  </div>
                  <p className="text-gray-600 font-medium capitalize">{stat.status}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('send')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === 'send'
                      ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <FaPaperPlane className="inline-block mr-2" />
                  Enviar Email
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === 'logs'
                      ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <FaEnvelope className="inline-block mr-2" />
                  Historial de Emails
                </button>
              </div>
            </div>

            <div className="p-8">
              {activeTab === 'send' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Enviar Email desde Plantilla
                  </h2>

                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center"
                    >
                      <FaCheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-green-800">{successMessage}</span>
                    </motion.div>
                  )}

                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
                    >
                      <FaTimesCircle className="w-5 h-5 text-red-600 mr-2" />
                      <span className="text-red-800">{errorMessage}</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleSendEmail} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email del Destinatario
                      </label>
                      <input
                        type="email"
                        value={emailForm.recipientEmail}
                        onChange={(e) =>
                          setEmailForm({ ...emailForm, recipientEmail: e.target.value })
                        }
                        placeholder="ejemplo@correo.com"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Destinatario
                      </label>
                      <input
                        type="text"
                        value={emailForm.recipientName}
                        onChange={(e) =>
                          setEmailForm({ ...emailForm, recipientName: e.target.value })
                        }
                        placeholder="Juan Pérez"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Plantilla de Email
                      </label>
                      <select
                        value={emailForm.templateName}
                        onChange={(e) =>
                          setEmailForm({ ...emailForm, templateName: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        {templates.length > 0 ? (
                          templates.map((template) => (
                            <option key={template.template_id} value={template.template_name}>
                              {template.template_name} - {template.subject}
                            </option>
                          ))
                        ) : (
                          <option value="registration_confirmation">
                            registration_confirmation - Confirmación de Registro
                          </option>
                        )}
                      </select>
                      <p className="mt-2 text-sm text-gray-500">
                        Nota: El email se envía con el backend configurado (console o SendGrid)
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={sendingEmail}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {sendingEmail ? (
                        <>
                          <FaClock className="inline-block mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="inline-block mr-2" />
                          Enviar Email
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-3">
                      Configuración del Sistema
                    </h3>
                    <div className="space-y-2 text-sm text-blue-800">
                      <p>
                        • <strong>Desarrollo:</strong> Los emails se muestran en la consola del
                        backend
                      </p>
                      <p>
                        • <strong>Producción:</strong> Configura SendGrid en el archivo .env del
                        backend
                      </p>
                      <p>
                        • <strong>Plantillas:</strong> Editables desde Django Admin o por API
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'logs' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Historial de Emails Recientes
                  </h2>

                  {logs.length === 0 ? (
                    <div className="text-center py-12">
                      <FaEnvelope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No hay emails en el historial</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Envía tu primer email usando el formulario
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {logs.map((log, index) => (
                        <motion.div
                          key={log.log_id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                {getStatusIcon(log.status)}
                                <h3 className="font-semibold text-gray-900 ml-2">
                                  {log.subject}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-600">
                                Para: <strong>{log.recipient_email}</strong>
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                                log.status
                              )}`}
                            >
                              {log.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="text-gray-500">Creado:</span>{' '}
                              {formatDate(log.created_at)}
                            </div>
                            {log.sent_at && (
                              <div>
                                <span className="text-gray-500">Enviado:</span>{' '}
                                {formatDate(log.sent_at)}
                              </div>
                            )}
                          </div>

                          {log.error_message && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                              <strong>Error:</strong> {log.error_message}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Usage Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Cómo usar el sistema de emails en tu código
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  1. Importar el servicio
                </h3>
                <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`import emailService from '../services/emailService';`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  2. Enviar email desde plantilla
                </h3>
                <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>
                    {`const result = await emailService.sendFromTemplate({
  template_name: 'course_enrollment',
  recipient_email: 'usuario@ejemplo.com',
  context: {
    username: 'Juan Pérez',
    course_name: 'Curso Básico de Campismo',
    course_code: 'CBC-2024'
  },
  queue: false,  // true para envío asíncrono
  priority: 2    // 1-4: baja, normal, alta, urgente
});`}
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  3. Configurar SendGrid (Producción)
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-2">
                    Configura estas variables en{' '}
                    <code className="bg-yellow-100 px-1 rounded">backend/.env</code>:
                  </p>
                  <pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto text-sm">
                    <code>
                      {`EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=tu_sendgrid_api_key_aqui
DEFAULT_FROM_EMAIL=noreply@scouts.cl`}
                    </code>
                  </pre>
                  <p className="text-sm text-gray-600 mt-2">
                    📧 Obtén tu API Key en:{' '}
                    <a
                      href="https://sendgrid.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      SendGrid
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default EmailSystemDemo;
