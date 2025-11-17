import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import GestionPagos from '../components/dashboard/GestionPagos';
import api from '../config/api';

// Mock the API module
vi.mock('../config/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('GestionPagos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle paginated API response correctly', async () => {
    const mockPaginatedResponse = {
      data: {
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            pap_id: 1,
            per_id: 101,
            cur_id: 201,
            pap_fecha_hora: '2024-01-01T10:00:00Z',
            pap_tipo: 1,
            pap_valor: 50000,
            pap_observacion: 'Test payment 1',
          },
          {
            pap_id: 2,
            per_id: 102,
            cur_id: 202,
            pap_fecha_hora: '2024-01-02T11:00:00Z',
            pap_tipo: 2,
            pap_valor: 30000,
            pap_observacion: 'Test payment 2',
          },
        ],
      },
    };

    api.get.mockResolvedValueOnce(mockPaginatedResponse);

    render(<GestionPagos />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Cargando pagos/i)).not.toBeInTheDocument();
    });

    // Check that pagos are rendered
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('$50000')).toBeInTheDocument();
    expect(screen.getByText('$30000')).toBeInTheDocument();
  });

  it('should handle array API response correctly', async () => {
    const mockArrayResponse = {
      data: [
        {
          pap_id: 1,
          per_id: 101,
          cur_id: 201,
          pap_fecha_hora: '2024-01-01T10:00:00Z',
          pap_tipo: 1,
          pap_valor: 50000,
          pap_observacion: 'Test payment',
        },
      ],
    };

    api.get.mockResolvedValueOnce(mockArrayResponse);

    render(<GestionPagos />);

    await waitFor(() => {
      expect(screen.queryByText(/Cargando pagos/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('$50000')).toBeInTheDocument();
  });

  it('should handle empty paginated response', async () => {
    const mockEmptyResponse = {
      data: {
        count: 0,
        next: null,
        previous: null,
        results: [],
      },
    };

    api.get.mockResolvedValueOnce(mockEmptyResponse);

    render(<GestionPagos />);

    await waitFor(() => {
      expect(screen.queryByText(/Cargando pagos/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/No hay pagos registrados/i)).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    api.get.mockRejectedValueOnce(new Error('Network error'));

    render(<GestionPagos />);

    await waitFor(() => {
      expect(screen.queryByText(/Cargando pagos/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/No se pudieron cargar los pagos/i)).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    api.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<GestionPagos />);

    expect(screen.getByText(/Cargando pagos/i)).toBeInTheDocument();
  });
});
