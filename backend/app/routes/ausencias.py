from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.schemas.ausencia_schema import AusenciaCreate, AusenciaResponse
from app.services.ausencia_service import AusenciaService

router = APIRouter(prefix="/ausencias", tags=["ausencias"])

@router.post("/", response_model=AusenciaResponse)
def crear_ausencia(ausencia: AusenciaCreate, db: Session = Depends(get_db)):
    return AusenciaService.crear_ausencia(db, ausencia)

@router.get("/{ausencia_id}", response_model=AusenciaResponse)
def obtener_ausencia(ausencia_id: int, db: Session = Depends(get_db)):
    ausencia = AusenciaService.obtener_ausencia(db, ausencia_id)
    if not ausencia:
        raise HTTPException(status_code=404, detail="Ausencia no encontrada")
    return ausencia

@router.get("/empleado/{empleado_id}")
def obtener_ausencias_empleado(empleado_id: int, db: Session = Depends(get_db)):
    return AusenciaService.obtener_ausencias_empleado(db, empleado_id)

@router.put("/{ausencia_id}/aprobar")
def aprobar_ausencia(ausencia_id: int, db: Session = Depends(get_db)):
    ausencia = AusenciaService.aprobar_ausencia(db, ausencia_id)
    if not ausencia:
        raise HTTPException(status_code=404, detail="Ausencia no encontrada")
    return ausencia

@router.put("/{ausencia_id}/rechazar")
def rechazar_ausencia(ausencia_id: int, db: Session = Depends(get_db)):
    ausencia = AusenciaService.rechazar_ausencia(db, ausencia_id)
    if not ausencia:
        raise HTTPException(status_code=404, detail="Ausencia no encontrada")
    return ausencia