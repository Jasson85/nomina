from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.schemas.empleado_schema import EmpleadoCreate, EmpleadoUpdate, EmpleadoResponse
from app.services.empleado_service import EmpleadoService

router = APIRouter(prefix="/empleados", tags=["empleados"])

@router.post("/", response_model=EmpleadoResponse)
def crear_empleado(empleado: EmpleadoCreate, db: Session = Depends(get_db)):
    return EmpleadoService.crear_empleado(db, empleado)

@router.get("/{empleado_id}", response_model=EmpleadoResponse)
def obtener_empleado(empleado_id: int, db: Session = Depends(get_db)):
    empleado = EmpleadoService.obtener_empleado(db, empleado_id)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return empleado

@router.get("/", response_model=list[EmpleadoResponse])
def listar_empleados(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return EmpleadoService.obtener_todos_empleados(db, skip, limit)

@router.put("/{empleado_id}", response_model=EmpleadoResponse)
def actualizar_empleado(empleado_id: int, empleado: EmpleadoUpdate, db: Session = Depends(get_db)):
    empleado_actualizado = EmpleadoService.actualizar_empleado(db, empleado_id, empleado)
    if not empleado_actualizado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return empleado_actualizado

@router.delete("/{empleado_id}")
def eliminar_empleado(empleado_id: int, db: Session = Depends(get_db)):
    empleado = EmpleadoService.eliminar_empleado(db, empleado_id)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return {"mensaje": "Empleado desactivado"}