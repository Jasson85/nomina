# app/schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class UsuarioCreate(BaseModel):
    email: EmailStr
    password: str
    nombre: str

class UsuarioResponse(BaseModel):
    id: int
    email: EmailStr
    nombre: str
    activo: bool

    class Config:
        from_attributes = True 