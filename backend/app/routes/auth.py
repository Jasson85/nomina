from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database.db import get_db
from app.database.models import Usuario
from app.schemas.auth_schema import UsuarioCreate, UsuarioLogin, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=dict)
def registrar(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    nuevo_usuario = AuthService.crear_usuario(db, usuario)
    return {"mensaje": "Usuario registrado", "email": nuevo_usuario.email}

@router.post("/login", response_model=TokenResponse)
def login(usuario: UsuarioLogin, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if not db_usuario or not AuthService.verificar_contraseña(usuario.password, db_usuario.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    access_token = AuthService.crear_token(db_usuario.id, db_usuario.email)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
def obtener_usuario_actual(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token no proporcionado")
    
    try:
        # Extraer token del header "Bearer <token>"
        parts = authorization.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise HTTPException(status_code=401, detail="Formato de token inválido")
        
        token = parts[1]
        user_id = AuthService.obtener_user_id_del_token(token)
        usuario = db.query(Usuario).filter(Usuario.id == user_id).first()
        
        if not usuario:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")
        
        return {
            "id": usuario.id,
            "email": usuario.email,
            "nombre": usuario.nombre,
            "es_admin": getattr(usuario, 'es_admin', False)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))