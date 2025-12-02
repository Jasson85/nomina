from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.models import Usuario
from app.schemas.auth_schema import UsuarioCreate
from app.config import settings
import hashlib
import secrets

class AuthService:
    @staticmethod
    def hash_password(password: str) -> str:
        salt = secrets.token_hex(32)
        pwd_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return f"{salt}${pwd_hash}"

    @staticmethod
    def verificar_contraseña(password: str, hashed_password: str) -> bool:
        try:
            salt, pwd_hash = hashed_password.split('$')
            return hashlib.sha256((password + salt).encode()).hexdigest() == pwd_hash
        except:
            return False

    @staticmethod
    def crear_usuario(db: Session, usuario: UsuarioCreate):
        hashed_password = AuthService.hash_password(usuario.password)
        db_usuario = Usuario(
            email=usuario.email,
            hashed_password=hashed_password,
            nombre=usuario.nombre
        )
        db.add(db_usuario)
        db.commit()
        db.refresh(db_usuario)
        return db_usuario

    @staticmethod
    def crear_token(user_id: int, email: str) -> str:
        to_encode = {
            "sub": str(user_id),
            "email": email,
            "exp": datetime.utcnow() + timedelta(days=7)
        }
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    @staticmethod
    def obtener_user_id_del_token(token: str) -> int:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id: str = payload.get("sub")
            if user_id is None:
                raise HTTPException(status_code=401, detail="Token inválido")
            return int(user_id)
        except JWTError:
            raise HTTPException(status_code=401, detail="Token inválido o expirado")

    @staticmethod
    async def get_current_user(token: str = None, db: Session = Depends(get_db)):
        if not token:
            raise HTTPException(status_code=401, detail="Token no proporcionado")
        
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id: str = payload.get("sub")
            if user_id is None:
                raise HTTPException(status_code=401, detail="Token inválido")
        except JWTError:
            raise HTTPException(status_code=401, detail="Token inválido")
        
        usuario = db.query(Usuario).filter(Usuario.id == int(user_id)).first()
        if not usuario:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")
        return usuario