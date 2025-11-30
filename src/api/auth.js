import apiClient from './apiclient';
import { isMockMode, setMockUserId } from './apiConfig';
import { mockAuth } from './mocks/mockApi';

export const login = async (username, password) => {
  try {
    if (isMockMode) {
      const { tokens, user } = await mockAuth.login(username, password);
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      setMockUserId(user.id);
      return { tokens, user };
    }

    const response = await apiClient.post('/token/', { username, password });
    const { access, refresh } = response.data;

    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;

    const userResponse = await apiClient.get('/users/me/');
    return {
      tokens: response.data,
      user: userResponse.data
    };
  } catch (error) {
    console.error('Login error:', error.response || error);
    throw error;
  }
};

export const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token && !isMockMode) {
    throw new Error('No refresh token available');
  }

  try {
    if (isMockMode) {
      const data = await mockAuth.refreshToken(refresh_token || 'mock-refresh-0');
      localStorage.setItem('access_token', data.access);
      return data.access;
    }

    const response = await apiClient.post('/token/refresh/', { refresh: refresh_token });
    const { access } = response.data;
    localStorage.setItem('access_token', access);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    return access;
  } catch (error) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    throw error;
  }
};

export const getCurrentUser = async () => {
  if (isMockMode) {
    return mockAuth.currentUser();
  }
  const response = await apiClient.get('/users/me/');
  return response.data;
};
