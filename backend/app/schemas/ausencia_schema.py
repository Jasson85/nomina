# app/schemas/ausencia_schema.py

from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class AusenciaCreate(BaseModel):
    empleado_id: int
    tipo: str
    fecha_inicio: date
    fecha_fin: date   
    dias: Optional[int] = Field(None, description="Días de ausencia (calculado automáticamente si no se provee)") 
    motivo: Optional[str] = None

class AusenciaResponse(BaseModel):
    id: int
    nombre_empleado: Optional[str] = None
    empleado_id: int
    tipo: str
    fecha_inicio: date
    fecha_fin: date
    dias: int
    motivo: Optional[str] = None
    estado: str 
    
    class Config:
        from_attributes = True