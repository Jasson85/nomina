export type Departamento = 'TECNOLOGIA' | 'RECURSOS_HUMANOS' | 'VENTAS' | 'MARKETING' | 'OPERACIONES';
export type TipoContrato = 'INDEFINIDO' | 'TERMINO_FIJO' | 'OBRA_LABOR' | 'PRESTACION_SERVICIOS';

export type EstadoEmpleado = 'ACTIVO' | 'INACTIVO' | 'Activo' | 'Inactivo';

export interface Empleado {
  id: number; 
  numero_documento: string; 
  
  // Nombres
  primer_nombre: string;
  primer_apellido: string;
  nombre_completo?: string; 
  
  // Datos de contacto y ubicación
  email?: string;
  telefono_celular?: string;
  direccion_residencia?: string;
  
  // Datos de Nómina 
  salario_base: number;
  cargo?: string;
  departamento_empresa?: string;
  
  // Seguridad Social
  eps_nombre?: string;
  afp_nombre?: string;
  arl_nombre?: string;
  
 
  observaciones?: string;
  activo: boolean;
  estado?: string;
  fecha_ingreso?: string;
}

export interface Ausencia {
  id: number;
  empleado_id: number;
  nombre_empleado?: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  dias: number;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  motivo?: string;
}

export interface MetricasTablero {
  total_empleados: number;
  empleados_activos: number;
  empleados_inactivos: number;
  total_nomina_mes: number; 
  promedio_salario: number;
  ausencias_pendientes: number;  
  departamentos: Record<string, number>; 
  costo_por_departamento: Record<string, number>;
  actividades: Array<{
    id: number;
    titulo: string;
    descripcion: string;
    tiempo: string;
    urlAvatar: string;
  }>;
}

export interface EmpleadoBackend {
  id: number;
  primer_nombre: string;
  primer_apellido: string;
  numero_documento: string;
  email: string;
  telefono?: string;
  cargo: string;
  departamento_empresa: string;
  salario_base: number;
  fecha_ingreso: string;
  activo: boolean;
  eps_nombre?: string;
  afp_nombre?: string;
  arl_nombre?: string;
  observaciones?: string;
  hoja_vida_url?: string;
  creado_en?: string;
}

export interface ListaPaginada<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface EmpleadoImportResult {
  status: string;
  creados: number;
  actualizados: number;
  errores?: string[];
  mensaje?: string;
}

export interface EmpleadoConCalculos extends Empleado {
  calculos?: {
    salud: number;
    pension: number;
    auxilio: number;
    netoPagar: number;
  };
}