import React from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import { vi } from 'vitest';
import ProtectedRoute from '../components/common/ProtectedRoute';
import PermissionManagement from '../pages/permissions/PermissionManagement';
import { renderWithProviders } from './test-utils';

describe('ProtectedRoute', () => {
  const renderProtected = (authOverrides = {}, allowedRoles = ['admin']) =>
    renderWithProviders(
      <ProtectedRoute allowedRoles={allowedRoles}>
        <div>Secret Area</div>
      </ProtectedRoute>,
      {
        auth: authOverrides,
        initialEntries: ['/protected'],
        routePath: '/protected',
        routeConfig: [
          <Route
            key="protected"
            path="/protected"
            element={
              <ProtectedRoute allowedRoles={allowedRoles}>
                <div>Secret Area</div>
              </ProtectedRoute>
            }
          />,
          <Route key="login" path="/login" element={<div>Login Page</div>} />,
          <Route key="unauthorized" path="/unauthorized" element={<div>Unauthorized</div>} />
        ]
      }
    );

  it('shows a loading indicator when auth state is still resolving', () => {
    const { container } = renderProtected({ loading: true });
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('redirects unauthenticated users to login', async () => {
    renderProtected({ isAuthenticated: false, user: null });
    expect(await screen.findByText(/login page/i)).toBeInTheDocument();
  });

  it('blocks unauthorized roles and sends them to the unauthorized page', async () => {
    renderProtected({ isAuthenticated: true, userRole: 'student' }, ['admin']);
    expect(await screen.findByText(/unauthorized/i)).toBeInTheDocument();
  });

  it('renders children for allowed roles', async () => {
    renderProtected({ isAuthenticated: true, userRole: 'admin' }, ['admin']);
    expect(await screen.findByText(/secret area/i)).toBeInTheDocument();
  });

  it('permits any authenticated user when allowedRoles is not provided', async () => {
    renderProtected({ isAuthenticated: true, userRole: 'student' }, null);
    expect(await screen.findByText(/secret area/i)).toBeInTheDocument();
  });
});

describe('PermissionManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays users and loads permissions when a user is selected', async () => {
    renderWithProviders(<PermissionManagement />, { auth: { isAuthenticated: true, userRole: 'admin' } });

    await userEvent.click(screen.getByText('Ali Ahmed'));
    expect(await screen.findByText(/permissions for ali ahmed/i)).toBeInTheDocument();
    expect(screen.getByText(/courses/i)).toBeInTheDocument();
  });

  it('filters users by search term', async () => {
    renderWithProviders(<PermissionManagement />, { auth: { isAuthenticated: true, userRole: 'admin' } });

    const search = screen.getByPlaceholderText(/search by name/i);
    await userEvent.type(search, 'Engineering');

    expect(screen.queryByText('Ali Ahmed')).not.toBeInTheDocument();
    expect(screen.getByText('Sarah Ali')).toBeInTheDocument();
  });

  it('toggles a permission flag for the selected user', async () => {
    renderWithProviders(<PermissionManagement />, { auth: { isAuthenticated: true, userRole: 'admin' } });

    await userEvent.click(screen.getByText('Ali Ahmed'));
    const coursesRow = (await screen.findByText(/courses/i)).closest('tr');
    const viewButton = within(coursesRow).getAllByRole('button')[0];
    const enabledClass = 'bg-green-100';

    await userEvent.click(viewButton);
    expect(viewButton.className).not.toContain(enabledClass);

    await userEvent.click(viewButton);
    expect(viewButton.className).toContain(enabledClass);
  });

  it('shows selection styling for the active user card', async () => {
    renderWithProviders(<PermissionManagement />, { auth: { isAuthenticated: true, userRole: 'admin' } });

    const aliCard = screen.getByText('Ali Ahmed').closest('button');
    await userEvent.click(aliCard);

    expect(aliCard.className).toContain('border-blue-500');
  });

  it('saves permission changes and shows a success toast', async () => {
    const successSpy = vi.spyOn(toast, 'success');

    renderWithProviders(<PermissionManagement />, { auth: { isAuthenticated: true, userRole: 'admin' } });

    await userEvent.click(screen.getByText('Ali Ahmed'));
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
    await waitFor(() => expect(successSpy).toHaveBeenCalled());
  });
});
