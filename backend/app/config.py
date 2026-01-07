from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):    

    # URL de la base de datos para SQLAlchemy
    DATABASE_URL: str
    
    # Clave secreta para firmar los JWTs
    SECRET_KEY: str
    
    # Algoritmo de JWT 
    ALGORITHM: str = "HS256"
    
    # Tiempo de expiración del token 
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Esto le dice a Pydantic dónde buscar el archivo .env
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding='utf-8', 
        extra='ignore' 
    )

# Instanciamos la configuración una sola vez
settings = Settings()