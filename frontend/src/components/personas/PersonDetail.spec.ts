import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PersonDetail from './PersonDetail.vue';

describe('PersonDetail.vue', () => {
  it('muestra los datos de la persona', () => {
    const persona = {
      id: 1,
      nombres: 'Juan',
      email: 'juan@example.com',
      telefono: '123456789',
      direccion: 'Calle 1',
      fecha_nacimiento: '1990-01-01',
      vigente: true,
    };
    const wrapper = mount(PersonDetail, {
      props: { persona },
    });
    expect(wrapper.text()).toContain('Juan');
    expect(wrapper.text()).toContain('juan@example.com');
    expect(wrapper.text()).toContain('Sí');
  });
});
