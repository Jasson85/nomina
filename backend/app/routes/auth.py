from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.models import Usuario, RolUsuario
from app.schemas.auth_schema import UsuarioCreate, TokenResponse, Usuario as UsuarioSchema 
from app.services.auth_service import AuthService
from typing import Dict, Any

router = APIRouter(tags=["Auth"])

# REGISTRO
@router.post("/register", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
def registrar(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    """Registra un nuevo usuario (Por defecto con rol EMPLEADO)."""
    
    nuevo_usuario = AuthService.crear_usuario(db, usuario, rol=RolUsuario.EMPLEADO)
    return {"mensaje": "Usuario registrado exitosamente", "email": nuevo_usuario.email}

# LOGIN (Obtener Token)
@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Verifica las credenciales y devuelve un token JWT.
    Utiliza el formato estándar OAuth2 (username = email, password).
    """
    db_usuario = db.query(Usuario).filter(Usuario.email == form_data.username).first()

    if not db_usuario or not AuthService.verificar_contraseña(form_data.password, db_usuario.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Credenciales inválidas", 
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Crear token usando el ID, email y ROL
    access_token = AuthService.crear_token(db_usuario.id, db_usuario.email, db_usuario.rol) 
    return {"access_token": access_token, "token_type": "bearer"}

# OBTENER USUARIO ACTUAL
@router.get("/me", response_model=UsuarioSchema)
def obtener_usuario_actual(current_user: Usuario = Depends(AuthService.get_current_user)):
    """Retorna la información del usuario actualmente autenticado (Rol y detalles)."""
    return current_user