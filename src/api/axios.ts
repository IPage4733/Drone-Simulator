import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://34-93-79-185.nip.io/api/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // only if backend uses cookies (optional)
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('drone_auth_token'); // ✅ use sessionStorage
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
