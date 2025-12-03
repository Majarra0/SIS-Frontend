import { vi } from 'vitest';

const createMocks = (overrides = {}) => {
  const mockApiClient = {
    post: vi.fn(),
    get: vi.fn(),
    defaults: { headers: { common: {} } }
  };
  const mockApiConfig = {
    isMockMode: false,
    setMockUserId: vi.fn()
  };
  const mockAuthApi = {
    mockAuth: {
      login: vi.fn(),
      refreshToken: vi.fn(),
      currentUser: vi.fn()
    }
  };

  Object.assign(mockApiConfig, overrides.config);
  Object.assign(mockApiClient, overrides.client);
  Object.assign(mockAuthApi.mockAuth, overrides.mockAuth);

  return { mockApiClient, mockApiConfig, mockAuthApi };
};

describe('auth api helpers', () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('logs in via mock api and stores tokens', async () => {
    const { mockApiConfig, mockAuthApi } = createMocks({
      config: { isMockMode: true }
    });
    mockAuthApi.mockAuth.login.mockResolvedValue({
      tokens: { access: 'mock-access', refresh: 'mock-refresh' },
      user: { id: 5, role: 'faculty' }
    });

    vi.doMock('../api/apiConfig', () => mockApiConfig);
    vi.doMock('../api/apiclient', () => ({ default: {} }));
    vi.doMock('../api/mocks/mockApi', () => mockAuthApi);
    const { login } = await import('../api/auth');

    const result = await login('user', 'pass');
    expect(result.user.id).toBe(5);
    expect(localStorage.getItem('access_token')).toBe('mock-access');
    expect(mockApiConfig.setMockUserId).toHaveBeenCalledWith(5);
  });

  it('logs in against real api and fetches profile', async () => {
    const { mockApiClient } = createMocks();
    mockApiClient.post.mockResolvedValueOnce({
      data: { access: 'real-access', refresh: 'real-refresh' }
    });
    mockApiClient.get.mockResolvedValueOnce({ data: { id: 7, role: 'student' } });

    vi.doMock('../api/apiConfig', () => ({ isMockMode: false, setMockUserId: vi.fn() }));
    vi.doMock('../api/apiclient', () => ({ default: mockApiClient }));
    vi.doMock('../api/mocks/mockApi', () => ({ mockAuth: {} }));

    const { login } = await import('../api/auth');
    const result = await login('user', 'pass');

    expect(mockApiClient.post).toHaveBeenCalledWith('/token/', { username: 'user', password: 'pass' });
    expect(mockApiClient.get).toHaveBeenCalledWith('/users/me/');
    expect(result.user.id).toBe(7);
    expect(localStorage.getItem('refresh_token')).toBe('real-refresh');
    expect(mockApiClient.defaults.headers.common.Authorization).toBe('Bearer real-access');
  });

  it('refreshToken refreshes via mock mode and stores access token', async () => {
    const { mockApiConfig, mockAuthApi } = createMocks({
      config: { isMockMode: true }
    });
    mockAuthApi.mockAuth.refreshToken.mockResolvedValue({ access: 'new-access' });
    localStorage.setItem('refresh_token', 'mock-refresh');

    vi.doMock('../api/apiConfig', () => mockApiConfig);
    vi.doMock('../api/apiclient', () => ({ default: {} }));
    vi.doMock('../api/mocks/mockApi', () => mockAuthApi);

    const { refreshToken } = await import('../api/auth');
    const token = await refreshToken();
    expect(token).toBe('new-access');
    expect(localStorage.getItem('access_token')).toBe('new-access');
  });

  it('refreshToken throws when no token exists in real mode', async () => {
    vi.doMock('../api/apiConfig', () => ({ isMockMode: false, setMockUserId: vi.fn() }));
    vi.doMock('../api/apiclient', () => ({ default: {} }));
    vi.doMock('../api/mocks/mockApi', () => ({ mockAuth: {} }));

    const { refreshToken } = await import('../api/auth');
    await expect(refreshToken()).rejects.toThrow('No refresh token available');
  });

  it('refreshToken refreshes via api client and updates Authorization header', async () => {
    const { mockApiClient } = createMocks();
    mockApiClient.post.mockResolvedValue({ data: { access: 'next-token' } });
    localStorage.setItem('refresh_token', 'stored-refresh');

    vi.doMock('../api/apiConfig', () => ({ isMockMode: false, setMockUserId: vi.fn() }));
    vi.doMock('../api/apiclient', () => ({ default: mockApiClient }));
    vi.doMock('../api/mocks/mockApi', () => ({ mockAuth: {} }));

    const { refreshToken } = await import('../api/auth');
    const token = await refreshToken();
    expect(token).toBe('next-token');
    expect(mockApiClient.post).toHaveBeenCalledWith('/token/refresh/', { refresh: 'stored-refresh' });
    expect(mockApiClient.defaults.headers.common.Authorization).toBe('Bearer next-token');
  });

  it('clears tokens when refresh fails in real mode', async () => {
    const { mockApiClient } = createMocks();
    mockApiClient.post.mockRejectedValue(new Error('bad token'));
    localStorage.setItem('refresh_token', 'old');
    localStorage.setItem('access_token', 'stale');

    vi.doMock('../api/apiConfig', () => ({ isMockMode: false, setMockUserId: vi.fn() }));
    vi.doMock('../api/apiclient', () => ({ default: mockApiClient }));
    vi.doMock('../api/mocks/mockApi', () => ({ mockAuth: {} }));

    const { refreshToken } = await import('../api/auth');
    await expect(refreshToken()).rejects.toThrow('bad token');
    expect(localStorage.getItem('refresh_token')).toBeNull();
    expect(localStorage.getItem('access_token')).toBeNull();
  });

  it('getCurrentUser delegates to mock auth when mock mode is enabled', async () => {
    const { mockApiConfig, mockAuthApi } = createMocks({
      config: { isMockMode: true }
    });
    mockAuthApi.mockAuth.currentUser.mockResolvedValue({ id: 9 });

    vi.doMock('../api/apiConfig', () => mockApiConfig);
    vi.doMock('../api/apiclient', () => ({ default: {} }));
    vi.doMock('../api/mocks/mockApi', () => mockAuthApi);

    const { getCurrentUser } = await import('../api/auth');
    const user = await getCurrentUser();
    expect(user.id).toBe(9);
  });
});
