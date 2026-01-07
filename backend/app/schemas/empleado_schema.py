from pydantic import BaseModel, EmailStr, Field, model_validator
from datetime import date
from typing import Optional, List, Dict, Any 
from enum import Enum 

class ActividadDashboard(BaseModel):
    id: int
    titulo: str
    descripcion: Optional[str] = ""
    tiempo: str
    urlAvatar: Optional[str] = None

class EmpleadoBase(BaseModel):    
    primer_nombre: str = Field(..., max_length=50)
    segundo_nombre: Optional[str] = Field(None, max_length=50)
    primer_apellido: str = Field(..., max_length=50)
    segundo_apellido: Optional[str] = Field(None, max_length=50)
    
    # Identificación
    tipo_documento: Optional[str] = Field("CC", max_length=10)
    numero_documento: str = Field(..., max_length=20)
    fecha_nacimiento: Optional[date] = None
    sexo: Optional[str] = Field(None, max_length=1)
    
    # Contacto
    telefono_celular: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = Field(None, description="Debe ser un email válido")
    ciudad: Optional[str] = Field(None, max_length=50)
    direccion_residencia: Optional[str] = Field(None, max_length=100)
    
    # Laboral
    fecha_ingreso: date
    cargo: Optional[str] = Field(None, max_length=50)
    departamento_empresa: Optional[str] = Field(None, max_length=50)
    tipo_contrato: Optional[str] = Field("Indefinido", max_length=50)
    salario_base: float = Field(..., gt=0.0)
    
    # Seguridad Social
    eps_nombre: Optional[str] = Field(None, max_length=50)
    afp_nombre: Optional[str] = Field(None, max_length=50)
    arl_nombre: Optional[str] = Field(None, max_length=50, description="Nivel de Riesgo ARL (I, II, III, IV, V)")
    caja_compensacion: Optional[str] = Field(None, max_length=50)
    fondo_cesantias: Optional[str] = Field(None, max_length=50) 
    
    # Estado 
    observaciones: Optional[str] = Field(None, description="Notas o novedades de la pre-nómina")
    estado: str = Field("Activo", max_length=20)
    activo: bool = Field(True)
    

# Creación y Actualización ---

class EmpleadoCreate(EmpleadoBase):
    pass

class EmpleadoUpdate(EmpleadoBase):    
    primer_nombre: Optional[str] = None
    primer_apellido: Optional[str] = None
    numero_documento: Optional[str] = None
    fecha_ingreso: Optional[date] = None
    salario_base: Optional[float] = None

class EmpleadoResponse(BaseModel):
    id: int
    codigo_empleado: Optional[str] = None
    
    # Información Personal
    nombre_completo: str
    primer_nombre: str
    segundo_nombre: Optional[str] = None
    primer_apellido: str
    segundo_apellido: Optional[str] = None
    
    tipo_documento: str
    numero_documento: str
    lugar_expedicion: Optional[str] = None
    fecha_expedicion: Optional[date] = None
    
    fecha_nacimiento: Optional[date] = None
    lugar_nacimiento: Optional[str] = None
    sexo: Optional[str] = None
    estado_civil: Optional[str] = None
    rh: Optional[str] = None
    
    # Ubicación y Contacto
    direccion_residencia: Optional[str] = None
    ciudad: Optional[str] = None
    departamento: Optional[str] = None
    codigo_postal: Optional[str] = None
    telefono_fijo: Optional[str] = None
    telefono_celular: Optional[str] = None
    email: Optional[str] = None
    email_corporativo: Optional[str] = None
    
    contacto_emergencia_nombre: Optional[str] = None
    contacto_emergencia_parentesco: Optional[str] = None
    contacto_emergencia_telefono: Optional[str] = None
    
    # Información Laboral
    fecha_ingreso: Optional[date] = None
    fecha_terminacion: Optional[date] = None
    cargo: Optional[str] = None
    departamento_empresa: Optional[str] = None
    centro_costo: Optional[str] = None
    jefe_inmediato: Optional[str] = None
    tipo_contrato: Optional[str] = None
    duracion_contrato: Optional[int] = None
    fecha_fin_contrato: Optional[date] = None
    
    # Compensación
    tipo_salario: Optional[str] = None
    salario_base: float
    tipo_jornada: Optional[str] = None
    horas_semanales: Optional[int] = None
    horario_entrada: Optional[str] = None
    horario_salida: Optional[str] = None
    
    # Seguridad Social
    eps_nombre: Optional[str] = None
    eps_codigo: Optional[str] = None
    afp_nombre: Optional[str] = None
    afp_codigo: Optional[str] = None
    arl_nombre: Optional[str] = None
    arl_codigo: Optional[str] = None
    nivel_riesgo_arl: Optional[str] = None
    caja_compensacion: Optional[str] = None
    codigo_caja_compensacion: Optional[str] = None
    fondo_cesantias: Optional[str] = None
    codigo_fondo_cesantias: Optional[str] = None
    
    # Bancos y Educación
    banco: Optional[str] = None
    tipo_cuenta: Optional[str] = None
    numero_cuenta: Optional[str] = None
    tiene_personas_a_cargo: bool = False
    numero_hijos: Optional[int] = None
    nivel_educacion: Optional[str] = None
    profesion: Optional[str] = None
    titulo_obtenido: Optional[str] = None
    tiene_libreta_militar: Optional[bool] = None
    numero_libreta_militar: Optional[str] = None
    discapacidad: bool = False
    tipo_discapacidad: Optional[str] = None
    
    # Estado y Observaciones
    url_avatar: Optional[str] = None
    observaciones: Optional[str] = None
    activo: bool
    estado: Optional[str] = None
    motivo_retiro: Optional[str] = None
    
    # Control Documental
    tiene_contrato_firmado: bool = False
    tiene_hoja_vida: bool = False
    tiene_examen_medico: bool = False
    tiene_afiliaciones: bool = False
    
    class Config:
        from_attributes = True


# ESQUEMAS PARA IMPORTACIÓN 
class EmpleadoImportacion(BaseModel):    
    primer_nombre: str = Field(alias="Apellidos y Nombres") 
    numero_documento: str = Field(alias="Cedula Numero")
    direccion_residencia: Optional[str] = Field(None, alias="Direccion")
    telefono_celular: Optional[Any] = Field(None, alias="Telefono(S)")
    fecha_nacimiento: Optional[Any] = Field(None, alias="Fecha de Nacimiento")
    fecha_ingreso: Optional[Any] = Field(None, alias="Fecha de Ingreso Contrato")
    salario_base: float = Field(..., alias="Sueldo Base")    
    departamento_empresa: Optional[str] = Field(None, alias="DESRIPCION")
    eps_nombre: Optional[str] = Field(None, alias="DESRIPCION.3")
    afp_nombre: Optional[str] = Field(None, alias="DESRIPCION.4")
    arl_nombre: Optional[str] = Field(None, alias="DESRIPCION.5")
    cargo: Optional[str] = Field(None, alias="DESRIPCION.6")
    
    # Campos de soporte
    email: Optional[Any] = Field(None, alias="Correo Electronico")
    caja_compensacion: Optional[str] = Field(None, alias="DESRIPCION.8")
    
    # Captura nuevas columnas de observación 
    criterio: Optional[str] = Field(None, alias="Criterio")
    descripcion_novedad: Optional[str] = Field(None, alias="Descripcion")
    observaciones: Optional[str] = None 

    class Config:
        populate_by_name = True  
    
    @model_validator(mode='before')
    @classmethod
    def process_nan_values(cls, data: Dict[str, Any]) -> Dict[str, Any]:     
        processed_data = {}
        for key, value in data.items():
            if isinstance(value, str) and value.lower() == 'nan':
                processed_data[key] = None
            elif isinstance(value, float) and value.is_integer():                 
                processed_data[key] = str(int(value))
            else:
                processed_data[key] = value
        
        # Criterio y Descripcion en el campo observaciones
        crit = processed_data.get("Criterio") or ""
        desc = processed_data.get("Descripcion") or ""
        if crit or desc:
            processed_data["observaciones"] = f"{crit} - {desc}".strip(" -")
            
        return processed_data

# ESQUEMA DE ESTADÍSTICAS 

class EstadisticasResponse(BaseModel):
    total_empleados: int
    empleados_activos: int
    empleados_inactivos: int
    total_nomina_mes: float
    promedio_salario: float
    ausencias_pendientes: int
    departamentos: Dict[str, int] 
    costo_por_departamento: Dict[str, float] 
    actividades: List[ActividadDashboard]

    class Config:
        from_attributes = True