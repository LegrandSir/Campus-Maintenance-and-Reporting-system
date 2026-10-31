// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Vite proxy handles the localhost:5000 routing
});

// Automatically inject JWT token into requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;