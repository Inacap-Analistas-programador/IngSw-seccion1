import apiClient from './api';

const acreditacionService = {
  getParticipantes(cursoId: number) {
    return apiClient.get(`/cursos/${cursoId}/participantes/`);
  },

  acreditarParticipante(cursoId: number, participanteId: number) {
    return apiClient.post(`/cursos/${cursoId}/participantes/${participanteId}/acreditar/`);
  },
};

export default acreditacionService;
