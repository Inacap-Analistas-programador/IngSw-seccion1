import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import useFetch from '../hooks/useFetch';

describe('useFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with null data and not loading', () => {
    const fetcher = vi.fn().mockResolvedValue({ data: 'test' });
    const { result } = renderHook(() => useFetch(fetcher, false));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should auto-fetch when auto is true', async () => {
    const mockData = { data: 'test' };
    const fetcher = vi.fn().mockResolvedValue(mockData);
    const { result } = renderHook(() => useFetch(fetcher, true));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('should not auto-fetch when auto is false', () => {
    const fetcher = vi.fn().mockResolvedValue({ data: 'test' });
    renderHook(() => useFetch(fetcher, false));

    expect(fetcher).not.toHaveBeenCalled();
  });

  it('should handle manual load', async () => {
    const mockData = { data: 'test' };
    const fetcher = vi.fn().mockResolvedValue(mockData);
    const { result } = renderHook(() => useFetch(fetcher, false));

    expect(result.current.data).toBeNull();

    await act(async () => {
      await result.current.load();
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to load function', async () => {
    const mockData = { data: 'test' };
    const fetcher = vi.fn().mockResolvedValue(mockData);
    const { result } = renderHook(() => useFetch(fetcher, false));

    await act(async () => {
      await result.current.load('arg1', 'arg2');
    });

    expect(fetcher).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should handle errors', async () => {
    const error = new Error('Fetch failed');
    const fetcher = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useFetch(fetcher, false));

    await act(async () => {
      try {
        await result.current.load();
      } catch (e) {
        // Expected to throw
      }
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it('should update data with setData', () => {
    const fetcher = vi.fn().mockResolvedValue({ data: 'test' });
    const { result } = renderHook(() => useFetch(fetcher, false));

    const newData = { data: 'updated' };
    act(() => {
      result.current.setData(newData);
    });

    expect(result.current.data).toEqual(newData);
  });

  it('should set loading to true during fetch', async () => {
    const fetcher = vi.fn(() => new Promise(resolve => setTimeout(() => resolve({ data: 'test' }), 100)));
    const { result } = renderHook(() => useFetch(fetcher, false));

    act(() => {
      result.current.load();
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should clear error on successful fetch', async () => {
    const error = new Error('Initial error');
    const fetcher = vi.fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce({ data: 'success' });

    const { result } = renderHook(() => useFetch(fetcher, false));

    // First fetch fails
    await act(async () => {
      try {
        await result.current.load();
      } catch (e) {
        // Expected
      }
    });

    expect(result.current.error).toEqual(error);

    // Second fetch succeeds
    await act(async () => {
      await result.current.load();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual({ data: 'success' });
  });
});
