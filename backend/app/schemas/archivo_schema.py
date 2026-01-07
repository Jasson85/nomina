from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# ===== ARCHIVOS DE EMPLEADO =====

class ArchivoEmpleadoCreate(BaseModel):
    tipo: str = Field(..., description="Tipo de archivo: cv, cedula, contrato, etc")
    nombre_archivo: str
    tamaño_bytes: Optional[int] = None

class ArchivoEmpleadoResponse(BaseModel):
    id: int
    empleado_id: int
    tipo: str
    nombre_archivo: str
    ruta_archivo: str
    tamaño_bytes: Optional[int] = None
    fecha_carga: datetime
    
    class Config:
        from_attributes = True

# ===== OBSERVACIONES =====

class RegistroObservacionesCreate(BaseModel):
    observacion_nueva: str
    motivo_cambio: Optional[str] = None

class RegistroObservacionesResponse(BaseModel):
    id: int
    empleado_id: int
    observacion_anterior: Optional[str] = None
    observacion_nueva: str
    modificado_por_id: Optional[int] = None
    fecha_modificacion: datetime
    motivo_cambio: Optional[str] = None
    
    class Config:
        from_attributes = True
