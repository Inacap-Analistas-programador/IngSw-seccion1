import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Breadcrumb', () => {
  it('should render home icon', () => {
    renderWithRouter(<Breadcrumb items={[]} />);
    const homeLink = screen.getByLabelText('Inicio');
    expect(homeLink).toBeInTheDocument();
  });

  it('should render breadcrumb items', () => {
    const items = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Usuarios' },
    ];
    renderWithRouter(<Breadcrumb items={items} />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
  });

  it('should render last item as current page', () => {
    const items = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Usuarios' },
    ];
    renderWithRouter(<Breadcrumb items={items} />);

    const lastItem = screen.getByText('Usuarios');
    expect(lastItem).toHaveClass('font-medium', 'text-scout-azul-oscuro');
  });

  it('should render links for non-last items', () => {
    const items = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Usuarios' },
    ];
    renderWithRouter(<Breadcrumb items={items} />);

    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink.closest('a')).toHaveAttribute('href', '/dashboard');
  });
});
