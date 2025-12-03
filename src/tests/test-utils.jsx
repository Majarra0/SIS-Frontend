import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { vi } from 'vitest';
import AuthContext from '../context/AuthContext';

export const createAuthValue = (overrides = {}) => {
  const user = overrides.user ?? (overrides.isAuthenticated ? {
    id: 1,
    username: 'test-user',
    role: overrides.userRole || 'student'
  } : null);

  const userRole = overrides.userRole ?? user?.role ?? null;

  return {
    user,
    currentUser: user,
    setUser: vi.fn(),
    loading: overrides.loading ?? false,
    isAuthenticated: overrides.isAuthenticated ?? !!user,
    userRole,
    isAdmin: overrides.isAdmin ?? userRole === 'admin',
    login: overrides.login ?? vi.fn(),
    logout: overrides.logout ?? vi.fn(),
    ...overrides
  };
};

export const renderWithProviders = (ui, options = {}) => {
  const {
    auth = {},
    initialEntries = ['/'],
    routePath = '*',
    routeConfig
  } = options;

  const authValue = createAuthValue(auth);

  const Wrapper = ({ children }) => (
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={initialEntries}>
        {routeConfig ? (
          <Routes>
            {routeConfig}
            <Route path={routePath} element={children} />
          </Routes>
        ) : children}
      </MemoryRouter>
      <ToastContainer />
    </AuthContext.Provider>
  );

  return render(ui, { wrapper: Wrapper });
};
