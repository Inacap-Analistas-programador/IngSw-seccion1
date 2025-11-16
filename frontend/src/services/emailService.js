import httpClient from './httpClient';

/**
 * Servicio para gestión de emails
 */
const emailService = {
  /**
   * Obtener todas las plantillas de email
   */
  getTemplates: async (params = {}) => {
    try {
      const response = await httpClient.get('/emails/templates/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching email templates:', error);
      throw error;
    }
  },

  /**
   * Obtener una plantilla específica
   */
  getTemplate: async (id) => {
    try {
      const response = await httpClient.get(`/emails/templates/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching email template:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva plantilla
   */
  createTemplate: async (templateData) => {
    try {
      const response = await httpClient.post('/emails/templates/', templateData);
      return response.data;
    } catch (error) {
      console.error('Error creating email template:', error);
      throw error;
    }
  },

  /**
   * Actualizar una plantilla
   */
  updateTemplate: async (id, templateData) => {
    try {
      const response = await httpClient.put(`/emails/templates/${id}/`, templateData);
      return response.data;
    } catch (error) {
      console.error('Error updating email template:', error);
      throw error;
    }
  },

  /**
   * Eliminar una plantilla
   */
  deleteTemplate: async (id) => {
    try {
      await httpClient.delete(`/emails/templates/${id}/`);
    } catch (error) {
      console.error('Error deleting email template:', error);
      throw error;
    }
  },

  /**
   * Probar una plantilla con datos de ejemplo
   */
  testTemplate: async (id, context) => {
    try {
      const response = await httpClient.post(`/emails/templates/${id}/test_template/`, {
        context
      });
      return response.data;
    } catch (error) {
      console.error('Error testing email template:', error);
      throw error;
    }
  },

  /**
   * Enviar un email directo
   */
  sendEmail: async (emailData) => {
    try {
      const response = await httpClient.post('/emails/send/send/', emailData);
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },

  /**
   * Enviar un email desde una plantilla
   */
  sendFromTemplate: async (templateData) => {
    try {
      const response = await httpClient.post('/emails/send/send_from_template/', templateData);
      return response.data;
    } catch (error) {
      console.error('Error sending email from template:', error);
      throw error;
    }
  },

  /**
   * Obtener logs de emails
   */
  getLogs: async (params = {}) => {
    try {
      const response = await httpClient.get('/emails/logs/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching email logs:', error);
      throw error;
    }
  },

  /**
   * Obtener un log específico
   */
  getLog: async (id) => {
    try {
      const response = await httpClient.get(`/emails/logs/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching email log:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de envío
   */
  getStatistics: async () => {
    try {
      const response = await httpClient.get('/emails/logs/statistics/');
      return response.data;
    } catch (error) {
      console.error('Error fetching email statistics:', error);
      throw error;
    }
  },

  /**
   * Obtener cola de emails
   */
  getQueue: async (params = {}) => {
    try {
      const response = await httpClient.get('/emails/queue/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching email queue:', error);
      throw error;
    }
  },

  /**
   * Procesar cola de emails
   */
  processQueue: async (batchSize = 10) => {
    try {
      const response = await httpClient.post('/emails/queue/process/', {
        batch_size: batchSize
      });
      return response.data;
    } catch (error) {
      console.error('Error processing email queue:', error);
      throw error;
    }
  },

  /**
   * Obtener configuraciones de email
   */
  getConfigurations: async () => {
    try {
      const response = await httpClient.get('/emails/configurations/');
      return response.data;
    } catch (error) {
      console.error('Error fetching email configurations:', error);
      throw error;
    }
  },

  /**
   * Actualizar configuración
   */
  updateConfiguration: async (id, configData) => {
    try {
      const response = await httpClient.put(`/emails/configurations/${id}/`, configData);
      return response.data;
    } catch (error) {
      console.error('Error updating email configuration:', error);
      throw error;
    }
  },
};

export default emailService;
