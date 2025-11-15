import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from '../hooks/useForm';

describe('useForm', () => {
  it('should initialize with default values', () => {
    const initialValues = { name: '', email: '' };
    const { result } = renderHook(() => useForm(initialValues));

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should handle input changes', () => {
    const { result } = renderHook(() => useForm({ name: '' }));

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John', type: 'text' },
      });
    });

    expect(result.current.values.name).toBe('John');
  });

  it('should validate required fields', () => {
    const validationRules = {
      name: {
        required: 'El nombre es requerido',
      },
    };
    const { result } = renderHook(() => useForm({ name: '' }, validationRules));

    act(() => {
      result.current.handleBlur({
        target: { name: 'name', value: '' },
      });
    });

    expect(result.current.errors.name).toBe('El nombre es requerido');
    expect(result.current.touched.name).toBe(true);
  });

  it('should validate minLength', () => {
    const validationRules = {
      password: {
        minLength: {
          value: 6,
          message: 'La contraseña debe tener al menos 6 caracteres',
        },
      },
    };
    const { result } = renderHook(() => useForm({ password: '' }, validationRules));

    act(() => {
      result.current.handleChange({
        target: { name: 'password', value: '123', type: 'text' },
      });
      result.current.handleBlur({
        target: { name: 'password', value: '123' },
      });
    });

    expect(result.current.errors.password).toBe('La contraseña debe tener al menos 6 caracteres');
  });

  it('should reset form', () => {
    const initialValues = { name: '', email: '' };
    const { result } = renderHook(() => useForm(initialValues));

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John', type: 'text' },
      });
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('should set field value programmatically', () => {
    const { result } = renderHook(() => useForm({ name: '' }));

    act(() => {
      result.current.setFieldValue('name', 'Jane');
    });

    expect(result.current.values.name).toBe('Jane');
  });
});
