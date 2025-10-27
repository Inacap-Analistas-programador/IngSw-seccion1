import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PersonForm from './PersonForm.vue';

describe('PersonForm.vue', () => {
  it('muestra el formulario de nueva persona', () => {
    const wrapper = mount(PersonForm, {
      props: { persona: null },
    });
    expect(wrapper.text()).toContain('Agregar Persona');
    expect(wrapper.find('form').exists()).toBe(true);
  });

  it('muestra el formulario de edición', () => {
    const persona = { id: 1, nombres: 'Juan', email: 'juan@example.com', telefono: '123456789', direccion: 'Calle 1', fecha_nacimiento: '1990-01-01', vigente: true };
    const wrapper = mount(PersonForm, {
      props: { persona },
    });
    expect(wrapper.text()).toContain('Editar Persona');
    expect(wrapper.find('form').exists()).toBe(true);
  });
});
