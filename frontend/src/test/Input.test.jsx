import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '../components/ui/Input';
import userEvent from '@testing-library/user-event';

describe('Input', () => {
  it('should render input element', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('should apply default type text', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('should apply custom type', () => {
    render(<Input type="email" placeholder="Email" />);
    const input = screen.getByPlaceholderText('Email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should apply custom className', () => {
    render(<Input className="custom-class" placeholder="Custom" />);
    const input = screen.getByPlaceholderText('Custom');
    expect(input).toHaveClass('custom-class');
  });

  it('should have default styling classes', () => {
    render(<Input placeholder="Styled" />);
    const input = screen.getByPlaceholderText('Styled');
    expect(input).toHaveClass('h-10', 'w-full', 'rounded-md', 'border');
  });

  it('should handle value changes', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText('Type here');

    await user.type(input, 'Hello');
    expect(input).toHaveValue('Hello');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled" />);
    const input = screen.getByPlaceholderText('Disabled');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50');
  });

  it('should handle onChange event', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Input onChange={handleChange} placeholder="Change" />);
    const input = screen.getByPlaceholderText('Change');

    await user.type(input, 'a');
    expect(handleChange).toHaveBeenCalled();
  });

  it('should forward ref', () => {
    const ref = { current: null };
    render(<Input ref={ref} placeholder="Ref input" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should render with placeholder', () => {
    render(<Input placeholder="Enter your name" />);
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
  });

  it('should accept defaultValue', () => {
    render(<Input defaultValue="Default text" />);
    const input = screen.getByDisplayValue('Default text');
    expect(input).toHaveValue('Default text');
  });

  it('should render password type', () => {
    render(<Input type="password" placeholder="Password" />);
    const input = screen.getByPlaceholderText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should render number type', () => {
    render(<Input type="number" placeholder="Age" />);
    const input = screen.getByPlaceholderText('Age');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('should have focus styling classes', () => {
    render(<Input placeholder="Focus" />);
    const input = screen.getByPlaceholderText('Focus');
    expect(input).toHaveClass('focus-visible:outline-none');
    expect(input).toHaveClass('focus-visible:ring-2');
  });

  it('should handle required attribute', () => {
    render(<Input required placeholder="Required" />);
    const input = screen.getByPlaceholderText('Required');
    expect(input).toBeRequired();
  });

  it('should handle maxLength attribute', () => {
    render(<Input maxLength={10} placeholder="Max length" />);
    const input = screen.getByPlaceholderText('Max length');
    expect(input).toHaveAttribute('maxLength', '10');
  });
});
