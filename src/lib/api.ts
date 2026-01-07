import axios, { AxiosInstance } from 'axios';
import { Empleado, Ausencia } from './tipos';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const axiosInstance: AxiosInstance = axios.create({ 
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

axiosInstance.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            if (typeof window !== 'undefined') window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export const apiClient = {
    async get(endpoint: string) {
        const res = await axiosInstance.get(endpoint);
        return res.data;
    },
    async post(endpoint: string, data: any) {
        const res = await axiosInstance.post(endpoint, data);
        return res.data;
    },
    async patch(endpoint: string, data: any) {
        const res = await axiosInstance.patch(endpoint, data);
        return res.data;
    },
    async delete(endpoint: string) {
        const res = await axiosInstance.delete(endpoint);
        return res.data;
    }
};

export const servicioAuth = {
    obtenerUsuarioActual: async () => {
        return apiClient.get('/auth/me');
    }
};

export const servicioEmpleados = {
    obtenerTodos: async (): Promise<Empleado[]> => apiClient.get('/empleados/'),
    obtenerPorId: async (id: number): Promise<Empleado> => apiClient.get(`/empleados/${id}`),    
    
    importarDesdeArchivo: async (archivo: File) => {
        const formData = new FormData();
        formData.append('file', archivo); 
        const res = await axiosInstance.post('/empleados/importar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },

    crear: async (datos: any) => apiClient.post('/empleados/', datos),
    actualizar: async (id: number, datos: any) => apiClient.patch(`/empleados/${id}`, datos),
    eliminar: async (id: number) => apiClient.delete(`/empleados/${id}`),
    obtenerEstadisticas: async () => apiClient.get('/empleados/estadisticas')
};

export const servicioNominas = {
    // Listar periodos de nómina
    obtenerTodas: async () => apiClient.get('/nominas/'),
    
    // detalle pago específico
    obtenerDetalle: async (id: string) => apiClient.get(`/nominas/${id}`),
    
    // nueva nómina empleados
    generar: async (datos: { mes: number; anio: number }) => apiClient.post('/nominas/generar', datos),
    
    // Exportar a PDF
    descargarComprobante: async (id: number) => {
        return axiosInstance.get(`/nominas/comprobante/${id}`, { responseType: 'blob' });
    }
};

export const servicioAusencias = {
    obtenerTodas: async (): Promise<Ausencia[]> => apiClient.get('/ausencias/'),
    crear: (datos: any) => apiClient.post('/ausencias/', datos),
    aprobar: (id: number) => apiClient.patch(`/ausencias/${id}/aprobar`, {}),
    rechazar: (id: number) => apiClient.patch(`/ausencias/${id}/rechazar`, {}),
};