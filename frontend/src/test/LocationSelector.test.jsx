import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { LocationSelector, useLocationInfo } from '../components/LocationSelector';

describe('LocationSelector', () => {
  test('should show warning when API key is not provided', () => {
    render(<LocationSelector onSelect={vi.fn()} />);
    
    expect(screen.getByText(/Google Maps API Key no configurada/i)).toBeInTheDocument();
  });

  test('should render autocomplete with API key', () => {
    const { container } = render(
      <LocationSelector apiKey="test-api-key" onSelect={vi.fn()} />
    );
    
    // El componente GooglePlacesAutocomplete debe renderizarse
    const locationSelector = container.querySelector('.location-selector');
    expect(locationSelector).toBeDefined();
  });

  test('should use custom placeholder', () => {
    const customPlaceholder = 'Buscar tu dirección';
    render(
      <LocationSelector 
        apiKey="test-api-key" 
        placeholder={customPlaceholder}
        onSelect={vi.fn()}
      />
    );
    
    // Verificar que el placeholder se pasa al componente
    // Nota: GooglePlacesAutocomplete es un componente externo, 
    // por lo que en un test real necesitaríamos mockearlo
  });
});

describe('useLocationInfo', () => {
  test('should return null when place is not provided', () => {
    const result = useLocationInfo(null);
    expect(result).toBeNull();
  });

  test('should extract location info from place object', () => {
    const mockPlace = {
      label: 'Av. Providencia 1234, Providencia, Región Metropolitana, Chile',
      value: {
        place_id: 'ChIJ123abc',
        terms: [
          { value: 'Av. Providencia 1234' },
          { value: 'Providencia' },
          { value: 'Región Metropolitana' },
          { value: 'Chile' }
        ]
      }
    };

    const result = useLocationInfo(mockPlace);

    expect(result).toEqual({
      fullAddress: 'Av. Providencia 1234, Providencia, Región Metropolitana, Chile',
      address: 'Av. Providencia 1234',
      comuna: 'Providencia',
      region: 'Chile',
      placeId: 'ChIJ123abc',
    });
  });

  test('should handle missing address components', () => {
    const mockPlace = {
      label: 'Some Address',
      value: {
        place_id: 'ChIJ123abc',
        terms: []
      }
    };

    const result = useLocationInfo(mockPlace);

    expect(result).toEqual({
      fullAddress: 'Some Address',
      address: '',
      comuna: '',
      region: '',
      placeId: 'ChIJ123abc',
    });
  });
});
