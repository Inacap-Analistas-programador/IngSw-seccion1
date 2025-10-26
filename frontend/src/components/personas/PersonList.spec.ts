import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PersonList from './PersonList.vue';

const personas = [
  { id: 1, nombres: 'Juan', email: 'juan@example.com', telefono: '123456789' },
  { id: 2, nombres: 'Ana', email: 'ana@example.com', telefono: '987654321' },
];

describe('PersonList.vue', () => {
  it('muestra la lista de personas', () => {
    const wrapper = mount(PersonList, {
      props: { personas, loading: false },
    });
    expect(wrapper.text()).toContain('Juan');
    expect(wrapper.text()).toContain('Ana');
  });

  it('emite evento ver-detalle', async () => {
    const wrapper = mount(PersonList, {
      props: { personas, loading: false },
    });
    await wrapper.findAll('button')[0].trigger('click');
    expect(wrapper.emitted('ver-detalle')).toBeTruthy();
  });

  it('emite evento editar-persona', async () => {
    const wrapper = mount(PersonList, {
      props: { personas, loading: false },
    });
    await wrapper.findAll('button')[1].trigger('click');
    expect(wrapper.emitted('editar-persona')).toBeTruthy();
  });

  it('emite evento eliminar-persona', async () => {
    const wrapper = mount(PersonList, {
      props: { personas, loading: false },
    });
    await wrapper.findAll('button')[2].trigger('click');
    expect(wrapper.emitted('eliminar-persona')).toBeTruthy();
  });
});
