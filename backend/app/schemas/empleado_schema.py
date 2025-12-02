from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional

class EmpleadoCreate(BaseModel):
    nombre: str
    apellido: Optional[str] = None
    cedula: str
    email: EmailStr
    telefono: Optional[str] = None
    departamento: Optional[str] = None
    cargo: Optional[str] = None
    salario_base: float
    fecha_ingreso: Optional[date] = None
    eps: Optional[str] = None
    afp: Optional[str] = None
    arl: Optional[str] = None

class EmpleadoUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    email: Optional[EmailStr] = None
    telefono: Optional[str] = None
    departamento: Optional[str] = None
    cargo: Optional[str] = None
    salario_base: Optional[float] = None
    eps: Optional[str] = None
    afp: Optional[str] = None
    arl: Optional[str] = None

class EmpleadoResponse(BaseModel):
    id: int
    nombre: str
    apellido: Optional[str] = None
    cedula: str
    email: str
    telefono: Optional[str] = None
    departamento: Optional[str] = None
    cargo: Optional[str] = None
    salario_base: float
    fecha_ingreso: Optional[date] = None
    activo: bool
    eps: Optional[str] = None
    afp: Optional[str] = None
    arl: Optional[str] = None

    class Config:
        from_attributes = True