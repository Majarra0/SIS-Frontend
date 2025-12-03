import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';

const loginMock = vi.fn();
const refreshTokenMock = vi.fn();
const getCurrentUserMock = vi.fn();

vi.mock('../api/auth', () => ({
  login: (...args) => loginMock(...args),
  refreshToken: (...args) => refreshTokenMock(...args),
  getCurrentUser: (...args) => getCurrentUserMock(...args)
}));

vi.mock('../api/apiConfig', () => ({
  isMockMode: false
}));

const Consumer = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="status">{auth.loading ? 'loading' : 'ready'}</div>
      <div data-testid="user-role">{auth.userRole || 'none'}</div>
      <button onClick={() => auth.login('user', 'pass')}>login</button>
      <button onClick={() => auth.logout()}>logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    loginMock.mockReset();
    refreshTokenMock.mockReset();
    getCurrentUserMock.mockReset();
    localStorage.clear();
  });

  it('throws when useAuth is called outside the provider', () => {
    const Broken = () => {
      useAuth();
      return null;
    };
    expect(() => render(<Broken />)).toThrow('useAuth must be used within an AuthProvider');
  });

  it('initializes user profile when a token is present', async () => {
    localStorage.setItem('access_token', 'token');
    getCurrentUserMock.mockResolvedValueOnce({ id: 1, role: 'admin' });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('ready'));
    expect(screen.getByTestId('user-role').textContent).toBe('admin');
  });

  it('attempts refresh when the first profile fetch fails', async () => {
    localStorage.setItem('access_token', 'token');
    localStorage.setItem('refresh_token', 'refresh');
    getCurrentUserMock
      .mockRejectedValueOnce(new Error('expired'))
      .mockResolvedValueOnce({ id: 2, role: 'student' });
    refreshTokenMock.mockResolvedValue('new-token');

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('user-role').textContent).toBe('student'));
    expect(refreshTokenMock).toHaveBeenCalled();
  });

  it('login updates user state and propagates role', async () => {
    loginMock.mockResolvedValue({ user: { id: 3, role: 'faculty' } });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('login'));
    await waitFor(() => expect(screen.getByTestId('user-role').textContent).toBe('faculty'));
  });

  it('logout clears storage and resets user', async () => {
    loginMock.mockResolvedValue({ user: { id: 3, role: 'faculty' } });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('login'));
    await waitFor(() => expect(screen.getByTestId('user-role').textContent).toBe('faculty'));
    localStorage.setItem('access_token', 'value');

    fireEvent.click(screen.getByText('logout'));
    expect(screen.getByTestId('user-role').textContent).toBe('none');
    expect(localStorage.getItem('access_token')).toBeNull();
  });
});
