// Tipos de Usuario y Autenticación
export type RolUsuario = 'ADMIN' | 'GERENTE_RRHH' | 'GERENTE_NOMINA' | 'EMPLEADO';

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: RolUsuario;
  estaActivo: boolean;
}

// Tipos de Empleado
export type TipoContrato = 'INDEFINIDO' | 'TERMINO_FIJO' | 'OBRA_LABOR' | 'PRESTACION_SERVICIOS';
export type EstadoEmpleado = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO' | 'TERMINADO';
export type Departamento = 'TECNOLOGIA' | 'RECURSOS_HUMANOS' | 'VENTAS' | 'MARKETING' | 'OPERACIONES';

export interface Empleado {
  id: string;
  usuarioId?: string;
  nombre: string;
  apellido: string;
  numeroIdentificacion: string;
  tipoIdentificacion: 'CC' | 'CE' | 'PASAPORTE';
  fechaNacimiento: string;
  genero: 'MASCULINO' | 'FEMENINO' | 'OTRO';
  telefono: string;
  direccion: string;
  ciudad: string;
  
  // Información Laboral
  codigoEmpleado: string;
  cargo: string;
  departamento: Departamento;
  tipoContrato: TipoContrato;
  fechaIngreso: string;
  fechaTerminacion?: string;
  salario: number;
  estado: EstadoEmpleado;
  
  // Seguridad Social
  proveedorEps: string;
  proveedorPension: string;
  proveedorArl: string;
  proveedorCesantias: string;
  
  // Información Bancaria
  nombreBanco: string;
  tipoCuenta: 'AHORROS' | 'CORRIENTE';
  numeroCuenta: string;
  
  // Metadata
  urlAvatar?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

// Tipos de Ausencias
export type TipoAusencia = 
  | 'VACACIONES'
  | 'INCAPACIDAD_MEDICA'
  | 'LICENCIA_REMUNERADA'
  | 'LICENCIA_NO_REMUNERADA'
  | 'PERMISO'
  | 'CALAMIDAD_DOMESTICA'
  | 'LICENCIA_MATERNIDAD'
  | 'LICENCIA_PATERNIDAD';

export type EstadoAusencia = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';

export interface Ausencia {
  id: string;
  empleadoId: string;
  nombreEmpleado: string;
  tipo: TipoAusencia;
  fechaInicio: string;
  fechaFin: string;
  dias: number;
  motivo: string;
  estado: EstadoAusencia;
  documentoSoporte?: string;
  aprobadoPor?: string;
  fechaAprobacion?: string;
  fechaCreacion: string;
}

// Tipos de Nómina
export type EstadoNomina = 'BORRADOR' | 'CALCULADA' | 'APROBADA' | 'PAGADA';

export interface Nomina {
  id: string;
  empleadoId: string;
  nombreEmpleado: string;
  periodo: string; // "2024-01"
  año: number;
  mes: number;
  
  // Devengos
  salarioBase: number;
  auxilioTransporte: number;
  horasExtras: number;
  recargosNocturnos: number;
  comisiones: number;
  bonificaciones: number;
  
  // Deducciones
  salud: number;
  pension: number;
  retencionFuente: number;
  otrasDeducciones: number;
  
  // Aportes Patronales
  saludEmpleador: number;
  pensionEmpleador: number;
  arl: number;
  cajaCompensacion: number;
  icbf: number;
  sena: number;
  
  // Provisiones
  cesantias: number;
  interesesCesantias: number;
  prima: number;
  vacaciones: number;
  
  // Totales
  totalDevengado: number;
  totalDeducciones: number;
  netoAPagar: number;
  costoEmpleador: number;
  
  estado: EstadoNomina;
  fechaPago?: string;
  fechaCreacion: string;
}

// Tipos de Documentos
export type TipoDocumento = 
  | 'CONTRATO'
  | 'HOJA_VIDA'
  | 'CEDULA'
  | 'CERTIFICADO_BANCARIO'
  | 'EXAMEN_MEDICO'
  | 'CERTIFICADO_EPS'
  | 'CERTIFICADO_PENSION'
  | 'OTRO';

export interface Documento {
  id: string;
  empleadoId: string;
  nombre: string;
  tipo: TipoDocumento;
  urlArchivo: string;
  tamañoArchivo: number;
  fechaSubida: string;
  fechaVencimiento?: string;
}

// Configuración del Sistema
export interface ConfiguracionSistema {
  id: string;
  clave: string;
  valor: string;
  descripcion?: string;
}

// Métricas del Dashboard
export interface MetricasTablero {
  nominaTotal: string;
  cambioNomina: string;
  tipoCambioNomina: 'aumento' | 'disminucion';
  empleadosActivos: number;
  cambioEmpleados: string;
  tipoCambioEmpleados: 'aumento' | 'disminucion';
  salarioPromedio: string;
  cambioSalarioPromedio: string;
  tipoCambioSalarioPromedio: 'aumento' | 'disminucion';
  enAusencia: number;
  cambioAusencia: string;
  tipoCambioAusencia: 'aumento' | 'disminucion';
}