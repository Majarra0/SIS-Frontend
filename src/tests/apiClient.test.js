import apiClient from '../api/apiclient';

describe('apiClient interceptors', () => {
  const getRequestInterceptor = () =>
    apiClient.interceptors.request.handlers.find(Boolean)?.fulfilled;
  const getResponseInterceptor = () =>
    apiClient.interceptors.response.handlers.find(Boolean)?.rejected;

  beforeEach(() => {
    localStorage.clear();
  });

  it('adds Authorization header when an access token exists', () => {
    localStorage.setItem('access_token', 'abc123');
    const interceptor = getRequestInterceptor();
    const config = { headers: {} };
    const result = interceptor(config);
    expect(result.headers.Authorization).toBe('Bearer abc123');
  });

  it('preserves headers when no token exists', () => {
    const interceptor = getRequestInterceptor();
    const config = { headers: {} };
    expect(interceptor(config).headers.Authorization).toBeUndefined();
  });

  it('throws a friendly error on 403 responses', async () => {
    const interceptor = getResponseInterceptor();
    await expect(interceptor({
      config: {},
      response: { status: 403, data: { detail: 'Forbidden' } }
    })).rejects.toThrow('Forbidden');
  });

  it('prefers detail, message, then key/value formatting for errors', async () => {
    const interceptor = getResponseInterceptor();

    await expect(interceptor({
      config: {},
      response: { data: { detail: 'Bad detail' } }
    })).rejects.toThrow('Bad detail');

    await expect(interceptor({
      config: {},
      response: { data: { message: 'Bad request' } }
    })).rejects.toThrow('Bad request');

    await expect(interceptor({
      config: {},
      response: { data: { field: 'is required' } }
    })).rejects.toThrow('field: is required');
  });
});
