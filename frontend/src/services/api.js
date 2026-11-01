import axios from 'axios';

// Using just '/api' forces the request through the Vite proxy, avoiding CORS issues
const api = axios.create({
    baseURL: '/api', 
});

// This intercepts every request and physically attaches your token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;