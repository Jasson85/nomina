from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.models import Usuario, RolUsuario
from app.schemas.auth_schema import UsuarioCreate 
from app.config import settings
import hashlib
import secrets

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login") 

class AuthService:
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Genera un hash seguro para la contraseña usando SHA256 y un salt."""
        salt = secrets.token_hex(32)
        pwd_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return f"{salt}${pwd_hash}"

    @staticmethod
    def verificar_contraseña(password: str, hashed_password: str) -> bool:
        """Verifica si la contraseña dada coincide con el hash almacenado."""
        try:
            salt, pwd_hash = hashed_password.split('$')
            return hashlib.sha256((password + salt).encode()).hexdigest() == pwd_hash
        except ValueError:
            return False

    @staticmethod
    def crear_usuario(db: Session, usuario: UsuarioCreate, rol: RolUsuario = RolUsuario.EMPLEADO):
        """Crea un nuevo usuario y lo almacena en la base de datos."""
        if db.query(Usuario).filter(Usuario.email == usuario.email).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El correo ya está registrado.")
            
        hashed_password = AuthService.hash_password(usuario.password)
        db_usuario = Usuario(
            email=usuario.email,
            hashed_password=hashed_password,
            nombre=usuario.nombre,
            rol=rol
            )
        db.add(db_usuario)
        db.commit()
        db.refresh(db_usuario)
        return db_usuario

    @staticmethod
    def crear_token(user_id: int, email: str, rol: RolUsuario) -> str:
        """Crea un token JWT de acceso usando la configuración de expiración."""
        to_encode = {
            "sub": str(user_id),
            "email": email,
            "rol": rol.value,
            "exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES) 
        }
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    @staticmethod
    def obtener_payload_del_token(token: str) -> dict:
        """Decodifica el token y retorna el payload."""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Token inválido o expirado",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    # 💡 Dependencia clave para la seguridad de la API
    @staticmethod
    def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Usuario:
        """Dependencia que extrae el token del encabezado y retorna el objeto Usuario."""
        
        try:
            payload = AuthService.obtener_payload_del_token(token)
            user_id = payload.get("sub") 
        except HTTPException as e:
            raise e
        
        usuario = db.query(Usuario).filter(Usuario.id == user_id).first()
        
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Usuario no encontrado o token inválido",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return usuario