import apiClient from './api';

export const preinscripcionService = {
  create(data: { curso: number; persona: number }): Promise<any> {
    return apiClient.post('/cursos/participantes/', data).then(res => res.data);
  },
};
