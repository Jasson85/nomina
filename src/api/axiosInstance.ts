// frontend/src/api/axiosInstance.ts

import axios from 'axios';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; 

const axiosInstance = axios.create({
    baseURL: API_URL, 
    headers: {
        'Content-Type': 'application/json',
    },
});


axiosInstance.interceptors.request.use(
    (config) => {
        
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null; 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {            
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;