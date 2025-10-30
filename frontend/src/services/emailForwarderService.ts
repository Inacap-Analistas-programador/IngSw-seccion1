import apiClient from './api';

export interface EmailPayload {
  from: string;
  to: string;
  subject: string;
  body: string;
}

const emailForwarderService = {
  sendEmail(payload: EmailPayload) {
    return apiClient.post('/email-forwarder/', payload);
  },
};

export default emailForwarderService;
