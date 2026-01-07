import { Empleado, MetricasTablero } from './tipos';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const headers = {
  'Content-Type': 'application/json',
};

export const API = {
  // Obtener todos los empleados 
  getEmployees: async (): Promise<Empleado[]> => {
    const response = await fetch(`${API_BASE_URL}/empleados`, { method: 'GET', headers });
    if (!response.ok) throw new Error("Error en Fetch: /empleados");
    return response.json();
  },

  // Obtener métricas Dashboard
  getDashboardMetrics: async (): Promise<MetricasTablero> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/metrics`, { method: 'GET', headers });
    if (!response.ok) throw new Error("Error en Fetch: /metrics");
    return response.json();
  },

  // Actualizar observaciones  
  updateEmployee: async (id: string, data: Partial<Empleado>): Promise<Empleado> => {
    const response = await fetch(`${API_BASE_URL}/empleados/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al actualizar empleado");
    return response.json();
  }
};