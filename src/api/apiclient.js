import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
}

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Ensure proper Bearer token format
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle Forbidden (403)
    if (error.response?.status === 403) {
      console.error('Permission denied:', error.response.data);
      const errorMessage = error.response.data.detail || 
                          error.response.data.message || 
                          'Permission denied';
      throw new Error(errorMessage);
    }
    
    // Handle Unauthorized (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return apiClient(originalRequest);
        });
      }
    
      originalRequest._retry = true;
      isRefreshing = true;
      
      const refresh_token = localStorage.getItem('refresh_token');
  return axios.post(`${API_URL}token/refresh/`, { refresh: refresh_token })
    .then(res => {
      const { access } = res.data;
      localStorage.setItem('access_token', access);
      apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + access;
      originalRequest.headers.Authorization = 'Bearer ' + access;
      processQueue(null, access);
      return apiClient(originalRequest);
    })
    .catch(err => {
      processQueue(err, null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
      return Promise.reject(err);
    })
    .finally(() => {
      isRefreshing = false;
    });
}

    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (typeof error.response?.data === 'object') {
      const messages = Object.entries(error.response.data)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      throw new Error(messages);
    }
    
    // Handle other errors
    return Promise.reject(error);
  }
);

export default apiClient;