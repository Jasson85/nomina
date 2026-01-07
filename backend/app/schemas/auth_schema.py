
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.database.models import RolUsuario # Importamos el Enum del modelo

# --- Esquema de Base ---
class UsuarioBase(BaseModel):
    email: EmailStr
    nombre: Optional[str] = None

# --- Esquema para el Registro (Input) ---
class UsuarioCreate(UsuarioBase):
    password: str = Field(..., min_length=6)

# --- Esquema de Respuesta para el usuario (Output) ---
class Usuario(UsuarioBase):
    id: int
    rol: RolUsuario
    es_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Esquema de Solicitud de Login (Input) ---
# Usamos OAuth2PasswordRequestForm, pero este esquema es útil para otros logins.
class UsuarioLogin(UsuarioBase):
    password: str

# --- Esquema de Respuesta del Token (Output) ---
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"