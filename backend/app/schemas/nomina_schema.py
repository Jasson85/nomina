from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional, Dict
from app.database.models import EstadoNomina, RolUsuario 

# --- Entrada para el Cálculo ---
class NominaCalculoInput(BaseModel):
    empleado_id: int
    periodo_mes: int = Field(..., ge=1, le=12)
    periodo_año: int = Field(..., ge=2023)
    
    # Rango de fechas real para el cálculo (Ej: 1 al 30 de cada mes)
    fecha_inicio: date
    fecha_fin: date

# --- Resultado del Cálculo (Output) ---
class NominaCalculoOutput(BaseModel):
    """Esquema que representa un cálculo, antes de ser guardado en la DB."""
    empleado_id: int
    periodo_mes: int
    periodo_año: int
    
    # Devengos
    salario_base: float
    dias_trabajados: int
    salario_devengado: float = Field(..., description="Salario proporcional a los días trabajados.")
    auxilio_transporte: float
    horas_extra_valor: float = 0.0
    comisiones: float = 0.0
    bonificaciones: float = 0.0
    total_devengado: float
    
    # Deducciones (Empleado)
    base_salud_pension: float
    aporte_eps_empleado: float
    aporte_afp_empleado: float
    retencion_renta: float = 0.0
    otras_deducciones: float = 0.0
    total_deducciones: float
    
    # Neto
    salario_neto: float
    
    # Aportes (Empleador)
    salud_empleador: float
    pension_empleador: float
    arl_empleador: float
    caja_compensacion_empleador: float
    icbf: float = 0.0
    sena: float = 0.0
    total_aportes_patronales: float
    
    # Provisiones
    cesantias: float
    intereses_cesantias: float
    prima: float
    vacaciones: float
    total_provisiones: float

    costo_empleador_total: float
    
# --- Respuesta de Nómina (Guardada en DB) ---
class NominaResponse(NominaCalculoOutput):
    id: int
    estado: EstadoNomina # Ahora definido
    creado_por_id: int
    fecha_pago: Optional[date] = None
    fecha_aprobacion: Optional[datetime] = None # Ahora definido

    class Config:
        from_attributes = True
        
# --- Esquema de Configuración Legal (Para el servicio) ---
class ConfiguracionLegal(BaseModel):
    salario_minimo: float = 1300000.0 
    auxilio_transporte_legal: float = 162000.0 
    
    eps_empleado_porcentaje: float = 0.04
    afp_empleado_porcentaje: float = 0.04
    
    eps_empleador_porcentaje: float = 0.085
    afp_empleador_porcentaje: float = 0.12
    arl_minimo_porcentaje: float = 0.00522 
    
    caja_compensacion_porcentaje: float = 0.04
    icbf_porcentaje: float = 0.03
    sena_porcentaje: float = 0.02