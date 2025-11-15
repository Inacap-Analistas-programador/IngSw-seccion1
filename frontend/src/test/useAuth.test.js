import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with unauthenticated state', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should login and store user data', () => {
    const { result } = renderHook(() => useAuth());
    const mockUser = { id: 1, name: 'Test User', role: 'coordinador' };
    const mockToken = 'test-token';

    act(() => {
      result.current.login(mockToken, mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('idToken', mockToken);
  });

  it('should logout and clear user data', () => {
    const { result } = renderHook(() => useAuth());
    const mockUser = { id: 1, name: 'Test User' };

    act(() => {
      result.current.login('token', mockUser);
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.removeItem).toHaveBeenCalledWith('idToken');
    expect(localStorage.removeItem).toHaveBeenCalledWith('userData');
  });

  it('should update user data', () => {
    const { result } = renderHook(() => useAuth());
    const mockUser = { id: 1, name: 'Test User' };
    const updatedUser = { id: 1, name: 'Updated User' };

    act(() => {
      result.current.login('token', mockUser);
    });

    act(() => {
      result.current.updateUser(updatedUser);
    });

    expect(result.current.user).toEqual(updatedUser);
  });
});
