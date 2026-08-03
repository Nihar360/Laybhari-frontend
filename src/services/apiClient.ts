import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://laybhari-backend-production.up.railway.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('laybhari_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let customError = 'An unexpected error occurred. Please try again.';
    if (error.response?.data) {
      const serverErr = error.response.data;
      customError = serverErr.message || serverErr.error || `Error ${error.response.status}: Request failed`;
    } else if (error.message) {
      if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
        customError = 'Unable to connect to Laybhari Backend. Please ensure Spring Boot is running.';
      } else {
        customError = error.message;
      }
    }
    return Promise.reject(new Error(customError));
  }
);

export default apiClient;
