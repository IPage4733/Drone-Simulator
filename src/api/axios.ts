import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // only if backend uses cookies (optional)
});

// 🔐 Attach latest token dynamically before each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('drone_auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
