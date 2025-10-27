import { defineStore } from 'pinia';
import axios from 'axios';

export const usePersonasStore = defineStore('personas', {
  state: () => ({
    personas: [],
    loading: false,
    selected: null,
    showForm: false,
    showDetail: false,
    editPersona: null,
  }),
  actions: {
    async fetchPersonas() {
      this.loading = true;
      try {
        const res = await axios.get('/api/personas/personas/');
        this.personas = res.data;
      } finally {
        this.loading = false;
      }
    },
  selectPersona(persona: any) {
      this.selected = persona;
      this.showDetail = true;
    },
  openForm(persona: any = null) {
      this.editPersona = persona;
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
      this.editPersona = null;
    },
    closeDetail() {
      this.showDetail = false;
      this.selected = null;
    },
  async savePersona(data: any) {
      if (data.id) {
        await axios.patch(`/api/personas/personas/${data.id}/`, data);
      } else {
        await axios.post('/api/personas/personas/', data);
      }
      await this.fetchPersonas();
      this.closeForm();
    },
  async deletePersona(id: number) {
      await axios.delete(`/api/personas/personas/${id}/`);
      await this.fetchPersonas();
    },
  },
});
