from pydantic import BaseModel, EmailStr

class UsuarioCreate(BaseModel):
    email: EmailStr
    password: str
    nombre: str

class UsuarioLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str