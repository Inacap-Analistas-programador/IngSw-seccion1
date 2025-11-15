import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CallToAction from '../components/common/CallToAction';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CallToAction', () => {
  it('should render with title', () => {
    renderWithRouter(<CallToAction title="Join Us" />);
    expect(screen.getByText('Join Us')).toBeInTheDocument();
  });

  it('should render with description', () => {
    renderWithRouter(<CallToAction description="Become a scout today" />);
    expect(screen.getByText('Become a scout today')).toBeInTheDocument();
  });

  it('should render with default button text', () => {
    renderWithRouter(<CallToAction />);
    expect(screen.getByText('Comenzar')).toBeInTheDocument();
  });

  it('should render with custom button text', () => {
    renderWithRouter(<CallToAction buttonText="Sign Up" />);
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('should render link with default href', () => {
    renderWithRouter(<CallToAction />);
    const link = screen.getByText('Comenzar').closest('a');
    expect(link).toHaveAttribute('href', '/preinscripcion');
  });

  it('should render link with custom href', () => {
    renderWithRouter(<CallToAction href="/registro" />);
    const link = screen.getByText('Comenzar').closest('a');
    expect(link).toHaveAttribute('href', '/registro');
  });

  it('should apply primary variant background color', () => {
    const { container } = renderWithRouter(<CallToAction variant="primary" />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-scout-azul-oscuro');
  });

  it('should apply secondary variant background color', () => {
    const { container } = renderWithRouter(<CallToAction variant="secondary" />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-scout-verde-natura');
  });

  it('should render complete call to action', () => {
    renderWithRouter(
      <CallToAction
        title="Join the Adventure"
        description="Be part of something amazing"
        buttonText="Get Started"
        href="/join"
        variant="primary"
      />
    );

    expect(screen.getByText('Join the Adventure')).toBeInTheDocument();
    expect(screen.getByText('Be part of something amazing')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    
    const link = screen.getByText('Get Started').closest('a');
    expect(link).toHaveAttribute('href', '/join');
  });

  it('should render arrow icon', () => {
    renderWithRouter(<CallToAction />);
    const button = screen.getByText('Comenzar').closest('a');
    expect(button?.querySelector('svg')).toBeInTheDocument();
  });

  it('should have hover effects classes', () => {
    renderWithRouter(<CallToAction />);
    const link = screen.getByText('Comenzar').closest('a');
    expect(link).toHaveClass('hover:shadow-hover-scout');
    expect(link).toHaveClass('hover:scale-105');
  });

  it('should render without title', () => {
    renderWithRouter(<CallToAction description="Just description" />);
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    expect(screen.getByText('Just description')).toBeInTheDocument();
  });

  it('should render without description', () => {
    renderWithRouter(<CallToAction title="Just title" />);
    expect(screen.getByText('Just title')).toBeInTheDocument();
  });

  it('should have text-white class', () => {
    const { container } = renderWithRouter(<CallToAction title="Test" />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('text-white');
  });
});
