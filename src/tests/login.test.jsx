import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route } from 'react-router-dom';
import { vi } from 'vitest';
import LoginPage from '../pages/auth/LoginPage';
import { renderWithProviders } from './test-utils';

const baseRoutes = [
  <Route key="login" path="/login" element={<LoginPage />} />,
  <Route key="student" path="/student/dashboard" element={<div>Student Dashboard</div>} />,
  <Route key="faculty" path="/faculty/dashboard" element={<div>Faculty Dashboard</div>} />,
  <Route key="admin" path="/admin/dashboard" element={<div>Admin Dashboard</div>} />,
  <Route key="dashboard" path="/dashboard" element={<div>Generic Dashboard</div>} />
];

const typeCredentials = async (username = 'student', password = 'password') => {
  await userEvent.type(screen.getByLabelText(/username/i), username);
  await userEvent.type(screen.getByLabelText(/password/i), password);
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form with inputs and actions', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  it.each([
    { role: 'student', target: /student dashboard/i },
    { role: 'faculty', target: /faculty dashboard/i },
    { role: 'admin', target: /admin dashboard/i }
  ])('routes $role users to their dashboard on success', async ({ role, target }) => {
    const login = vi.fn().mockResolvedValue({ user: { role } });

    renderWithProviders(<LoginPage />, {
      auth: { login },
      initialEntries: ['/login'],
      routePath: '/login',
      routeConfig: baseRoutes
    });

    await typeCredentials(role, 'password');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(login).toHaveBeenCalledWith(role, 'password'));
    expect(await screen.findByText(target)).toBeInTheDocument();
  });

  it('falls back to a generic dashboard when role is unknown', async () => {
    const login = vi.fn().mockResolvedValue({ user: { role: 'observer' } });

    renderWithProviders(<LoginPage />, {
      auth: { login },
      initialEntries: ['/login'],
      routePath: '/login',
      routeConfig: baseRoutes
    });

    await typeCredentials('observer', 'password');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(login).toHaveBeenCalled());
    expect(await screen.findByText(/generic dashboard/i)).toBeInTheDocument();
  });

  it('shows an error when the login response does not include a role', async () => {
    const login = vi.fn().mockResolvedValue({ user: {} });

    renderWithProviders(<LoginPage />, {
      auth: { login },
      initialEntries: ['/login'],
      routePath: '/login',
      routeConfig: baseRoutes
    });

    await typeCredentials('student', 'password');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/role information is missing/i)).toBeInTheDocument();
  });

  it('surfaces backend error messages for invalid credentials', async () => {
    const login = vi.fn().mockRejectedValue(new Error('Invalid credentials. Please check your username and password.'));

    renderWithProviders(<LoginPage />, {
      auth: { login },
      initialEntries: ['/login'],
      routePath: '/login',
      routeConfig: baseRoutes
    });

    await typeCredentials('wrong', 'bad');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).not.toBeDisabled();
  });

  it.each([
    'Account locked due to too many attempts',
    'Account suspended',
    'Password expired'
  ])('displays security related error text: %s', async (message) => {
    const login = vi.fn().mockRejectedValue(new Error(message));

    renderWithProviders(<LoginPage />, {
      auth: { login },
      initialEntries: ['/login'],
      routePath: '/login',
      routeConfig: baseRoutes
    });

    await typeCredentials('student', 'password');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(message)).toBeInTheDocument();
  });

  it('disables the button and shows a spinner while submitting', async () => {
    let resolveLogin;
    const loginPromise = new Promise(resolve => { resolveLogin = resolve; });
    const login = vi.fn().mockReturnValue(loginPromise);

    renderWithProviders(<LoginPage />, {
      auth: { login },
      initialEntries: ['/login'],
      routePath: '/login',
      routeConfig: baseRoutes
    });

    await typeCredentials('student', 'password');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
    resolveLogin({ user: { role: 'student' } });
  });

  it('resets loading state after a failed login attempt', async () => {
    const login = vi.fn().mockRejectedValue(new Error('Invalid username or password'));

    renderWithProviders(<LoginPage />, {
      auth: { login },
      initialEntries: ['/login'],
      routePath: '/login',
      routeConfig: baseRoutes
    });

    await typeCredentials('student', 'bad');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await screen.findByText(/invalid username or password/i);

    expect(screen.getByRole('button', { name: /sign in/i })).not.toBeDisabled();
  });

  it('clears previous error when retrying successfully', async () => {
    const login = vi.fn()
      .mockRejectedValueOnce(new Error('Invalid username or password'))
      .mockResolvedValueOnce({ user: { role: 'student' } });

    renderWithProviders(<LoginPage />, {
      auth: { login },
      initialEntries: ['/login'],
      routePath: '/login',
      routeConfig: baseRoutes
    });

    await typeCredentials('student', 'bad');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/invalid username or password/i)).toBeInTheDocument();

    await userEvent.clear(screen.getByLabelText(/password/i));
    await userEvent.type(screen.getByLabelText(/password/i), 'password');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(login).toHaveBeenCalledTimes(2));
    expect(screen.queryByText(/invalid username or password/i)).not.toBeInTheDocument();
    expect(await screen.findByText(/student dashboard/i)).toBeInTheDocument();
  });

  it('auto-redirects authenticated users on initial render', async () => {
    renderWithProviders(<LoginPage />, {
      auth: { user: { id: 1, role: 'faculty' }, isAuthenticated: true },
      initialEntries: ['/login'],
      routePath: '/login',
      routeConfig: baseRoutes
    });

    expect(await screen.findByText(/faculty dashboard/i)).toBeInTheDocument();
  });

  it('marks remember me checkbox without affecting submission', async () => {
    const login = vi.fn().mockResolvedValue({ user: { role: 'student' } });

    renderWithProviders(<LoginPage />, {
      auth: { login },
      initialEntries: ['/login'],
      routePath: '/login',
      routeConfig: baseRoutes
    });

    await userEvent.click(screen.getByLabelText(/remember me/i));
    await typeCredentials('student', 'password');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(login).toHaveBeenCalled());
  });

  it('sends the typed username and password to the login service', async () => {
    const login = vi.fn().mockResolvedValue({ user: { role: 'admin' } });

    renderWithProviders(<LoginPage />, {
      auth: { login },
      initialEntries: ['/login'],
      routePath: '/login',
      routeConfig: baseRoutes
    });

    await typeCredentials('admin', 'admin123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(login).toHaveBeenCalledWith('admin', 'admin123'));
  });

  it('renders footer content for support context', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
  });
});
