from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.schemas.nomina_schema import NominaCreate, NominaResponse
from app.services.nomina_service import NominaService

router = APIRouter(prefix="/nomina", tags=["nomina"])

@router.post("/", response_model=NominaResponse)
def crear_nomina(nomina: NominaCreate, db: Session = Depends(get_db)):
    nueva_nomina = NominaService.crear_nomina(db, nomina)
    if not nueva_nomina:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return nueva_nomina

@router.get("/{nomina_id}", response_model=NominaResponse)
def obtener_nomina(nomina_id: int, db: Session = Depends(get_db)):
    nomina = NominaService.obtener_nomina(db, nomina_id)
    if not nomina:
        raise HTTPException(status_code=404, detail="Nómina no encontrada")
    return nomina

@router.get("/empleado/{empleado_id}")
def obtener_nominas_empleado(empleado_id: int, db: Session = Depends(get_db)):
    return NominaService.obtener_nominas_empleado(db, empleado_id)

@router.get("/periodo/{mes}/{año}")
def obtener_nominas_periodo(mes: int, año: int, db: Session = Depends(get_db)):
    return NominaService.obtener_nominas_periodo(db, mes, año)