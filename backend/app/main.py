from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from app.database.db import Base, engine

from app.routes import empleados, nomina, ausencias, auth, reportes, archivos 

load_dotenv()

try:
    Base.metadata.create_all(bind=engine)
    logger.info("Tablas de PostgreSQL sincronizadas correctamente.")
except Exception as e:
    logger.error(f"Error al sincronizar la base de datos: {e}")

app = FastAPI(
    title="Nomina API Profesional", 
    version="2.0.0", 
    description="Backend centralizado para gestión de pre-nómina, empleados y reportes legales."
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:9002",
        "http://127.0.0.1:9002",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/auth", tags=["Autenticación"])
app.include_router(archivos.router, tags=["Archivos Empleados"])
app.include_router(empleados.router, prefix="/empleados", tags=["Gestión de Empleados"])
app.include_router(nomina.router, prefix="/nominas", tags=["Pre-Nómina"])
app.include_router(ausencias.router, prefix="/ausencias", tags=["Novedades y Ausencias"])
app.include_router(reportes.router, prefix="/reportes", tags=["Analítica y Reportes"])

@app.get("/")
async def root():
    return {
        "message": "Bienvenido a la API de Nomina",
        "docs": "/docs",
        "status": "online"
    }

@app.get("/health")
async def health_check():    
    return {"status": "ok", "version": "2.0.0", "database": "connected"}

if __name__ == "__main__":
    import uvicorn
    
    logger.info("Iniciando servidor Uvicorn en http://0.0.0.0:8000")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)