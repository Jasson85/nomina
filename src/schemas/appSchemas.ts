// frontend/src/schemas/appSchemas.ts

export interface LoginCredentials {
    username: string; 
    password: string;
}

export interface User {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    rol: 'ADMIN' | 'PAYROLL_MGR' | 'SUPERVISOR' | 'EMPLEADO'; 
    is_active: boolean;
    
}


export interface Empleado {
    id: number;
    nombre: string;
    apellido: string;
    cargo: string;
    salario_base: number;
    departamento_nombre: string;
}

export interface NominaCalculoInput {
    empleado_id: number;
    periodo_mes: number;
    periodo_año: number;
    fecha_inicio: string; 
    fecha_fin: string;
}

export interface NominaResponse {
    id: number;
    salario_neto: number;
    total_devengado: number;
    total_deducciones: number;
    estado: 'GENERADA' | 'APROBADA' | 'PAGADA';
    periodo_mes: number;
    periodo_año: number;
   
}