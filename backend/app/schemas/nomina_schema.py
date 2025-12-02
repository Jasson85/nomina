from pydantic import BaseModel
from datetime import date
from typing import Optional

class NominaCreate(BaseModel):
    empleado_id: int
    periodo_mes: int
    periodo_año: int
    horas_trabajadas: float = 0
    horas_extra: float = 0.0

class NominaResponse(BaseModel):
    id: int
    empleado_id: int
    periodo_mes: int
    periodo_año: int
    salario_base: float
    horas_extra: float
    valor_horas_extra: float
    aporte_eps: float
    aporte_afp: float
    aporte_arl: float
    retencion_renta: float
    total_deduciones: float
    salario_neto: float
    fecha_pago: Optional[date]
    estado: str

    class Config:
        from_attributes = True