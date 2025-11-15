import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WelcomeMessage from '../components/common/WelcomeMessage';

describe('WelcomeMessage', () => {
  it('should render default message without name', () => {
    render(<WelcomeMessage />);
    expect(screen.getByText('Bienvenido')).toBeInTheDocument();
  });

  it('should render with name', () => {
    render(<WelcomeMessage name="Juan" />);
    expect(screen.getByText('Bienvenido, Juan')).toBeInTheDocument();
  });

  it('should render with name and role', () => {
    render(<WelcomeMessage name="María" role="Coordinadora" />);
    expect(screen.getByText('Bienvenido Coordinadora, María')).toBeInTheDocument();
  });

  it('should render custom message', () => {
    render(<WelcomeMessage name="Pedro" message="Es un placer tenerte aquí" />);
    expect(screen.getByText('Bienvenido, Pedro')).toBeInTheDocument();
    expect(screen.getByText('Es un placer tenerte aquí')).toBeInTheDocument();
  });

  it('should render only default message when no name is provided', () => {
    render(<WelcomeMessage message="Custom message" />);
    expect(screen.getByText('Bienvenido')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<WelcomeMessage className="custom-class" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should have default styling classes', () => {
    const { container } = render(<WelcomeMessage />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('bg-scout-azul-muy-claro');
    expect(wrapper).toHaveClass('p-6');
    expect(wrapper).toHaveClass('rounded-lg');
    expect(wrapper).toHaveClass('shadow-scout');
  });

  it('should render title with proper styling', () => {
    render(<WelcomeMessage name="Test" />);
    const title = screen.getByText('Bienvenido, Test');
    expect(title).toHaveClass('text-2xl');
    expect(title).toHaveClass('font-bold');
    expect(title).toHaveClass('text-scout-azul-oscuro');
  });

  it('should render message with proper styling', () => {
    render(<WelcomeMessage message="Test message" />);
    const message = screen.getByText('Test message');
    expect(message).toHaveClass('text-gray-700');
  });

  it('should not render message paragraph if no message provided', () => {
    const { container } = render(<WelcomeMessage name="Test" />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(0);
  });

  it('should combine custom className with default classes', () => {
    const { container } = render(<WelcomeMessage className="extra-class" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('bg-scout-azul-muy-claro');
    expect(wrapper).toHaveClass('extra-class');
  });

  it('should render with role but no name shows default', () => {
    render(<WelcomeMessage role="Dirigente" />);
    expect(screen.getByText('Bienvenido')).toBeInTheDocument();
  });

  it('should handle empty string name', () => {
    render(<WelcomeMessage name="" />);
    expect(screen.getByText('Bienvenido')).toBeInTheDocument();
  });

  it('should render complete welcome message', () => {
    render(
      <WelcomeMessage
        name="Carlos"
        role="Dirigente"
        message="Gracias por tu dedicación"
        className="custom-welcome"
      />
    );

    expect(screen.getByText('Bienvenido Dirigente, Carlos')).toBeInTheDocument();
    expect(screen.getByText('Gracias por tu dedicación')).toBeInTheDocument();
  });
});
