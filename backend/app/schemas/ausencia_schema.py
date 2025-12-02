from pydantic import BaseModel
from datetime import date
from typing import Optional

class AusenciaCreate(BaseModel):
    empleado_id: int
    tipo: str
    fecha_inicio: date
    fecha_fin: date
    motivo: Optional[str] = None

class AusenciaResponse(BaseModel):
    id: int
    empleado_id: int
    tipo: str
    fecha_inicio: date
    fecha_fin: date
    dias: int
    motivo: Optional[str] = None
    estado: str

    class Config:
        from_attributes = True