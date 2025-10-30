import apiClient from './api';

export default {
  getArchivos() {
    return apiClient.get('/archivos/');
  },
  getArchivo(id: number) {
    return apiClient.get(`/archivos/${id}/`);
  },
  createArchivo(archivo: FormData) { // Archivos se envían como FormData
    return apiClient.post('/archivos/', archivo, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateArchivo(id: number, archivo: FormData) {
    return apiClient.put(`/archivos/${id}/`, archivo, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteArchivo(id: number) {
    return apiClient.delete(`/archivos/${id}/`);
  },
};
