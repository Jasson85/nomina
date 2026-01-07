import { axiosInstance, apiClient } from '@/lib/api'; 
import { 
  EmpleadoBackend, 
  ListaPaginada, 
  EmpleadoImportResult 
} from '@/lib/tipos'; 

const EMPLEADOS_URL = '/empleados';

export const ServicioEmpleado = { 

  // OBTENER LISTA
  async obtenerEmpleados( 
    page: number = 1, 
    limit: number = 10, 
    search: string = '', 
    periodo: string = '' 
  ): Promise<ListaPaginada<EmpleadoBackend>> {
    const endpoint = `${EMPLEADOS_URL}?page=${page}&limit=${limit}&search=${search}&periodo=${periodo}`;
    return apiClient.get(endpoint); 
  },

  // OBTENER UN EMPLEADO POR ID
  async obtenerEmpleadoPorId(id: string): Promise<EmpleadoBackend> {
    const response = await axiosInstance.get<EmpleadoBackend>(`${EMPLEADOS_URL}/${id}`);
    return response.data;
  },

  // CREAR NUEVO EMPLEADO 
  async crearEmpleado(data: FormData | any): Promise<EmpleadoBackend> {
    const headers = data instanceof FormData 
      ? { 'Content-Type': 'multipart/form-data' } 
      : { 'Content-Type': 'application/json' };

    const response = await axiosInstance.post<EmpleadoBackend>(
      EMPLEADOS_URL, 
      data, 
      { headers }
    );
    return response.data;
  },

  // ACTUALIZAR EMPLEADO
  async actualizarEmpleado(id: string, data: any): Promise<EmpleadoBackend> {
    const response = await axiosInstance.patch<EmpleadoBackend>(
      `${EMPLEADOS_URL}/${id}`, 
      data
    );
    return response.data;
  },

  // IMPORTAR EMPLEADOS DESDE CSV
  async importarEmpleados(formData: FormData): Promise<EmpleadoImportResult> {
    const response = await axiosInstance.post<EmpleadoImportResult>(
      `${EMPLEADOS_URL}/importar`, 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // DESACTIVAR EMPLEADO 
  async desactivarEmpleado(id: string): Promise<void> { 
    await apiClient.delete(`${EMPLEADOS_URL}/${id}`);
  },

  // ELIMINAR EMPLEADO 
  async eliminarEmpleado(id: string): Promise<void> { 
    await apiClient.delete(`${EMPLEADOS_URL}/${id}/permanente`);
  },
};