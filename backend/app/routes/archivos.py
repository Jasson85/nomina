from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, status
from sqlalchemy.orm import Session
from typing import List
from app.database.db import get_db
from app.database.models import Usuario, RolUsuario
from app.services.archivo_service import ArchivoService, ObservacionService
from app.schemas.archivo_schema import ArchivoEmpleadoResponse, RegistroObservacionesResponse
from app.dependencies.auth import requires_role
from app.services.auth_service import AuthService

router = APIRouter(prefix="/empleados", tags=["Archivos Empleados"])

GESTION_ROLES = [RolUsuario.ADMIN, RolUsuario.PAYROLL_MGR]

# ===== ARCHIVOS DE EMPLEADO =====

@router.post("/{empleado_id}/archivos", response_model=ArchivoEmpleadoResponse, status_code=status.HTTP_201_CREATED)
async def subir_archivo_empleado(
    empleado_id: int,
    tipo: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(requires_role(GESTION_ROLES))
):
    """Sube un archivo (CV, cédula, contrato, etc) para un empleado."""
    try:
        contenido = await file.read()
        
        archivo = ArchivoService.guardar_archivo(
            db=db,
            empleado_id=empleado_id,
            archivo_contenido=contenido,
            nombre_archivo=file.filename or "documento",
            tipo=tipo
        )
        
        return archivo
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al guardar archivo: {str(e)}")

@router.get("/{empleado_id}/archivos", response_model=List[ArchivoEmpleadoResponse])
async def obtener_archivos_empleado(
    empleado_id: int,
    tipo: str = None,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(AuthService.get_current_user)
):
    """Obtiene todos los archivos de un empleado."""
    archivos = ArchivoService.obtener_archivos_empleado(db, empleado_id, tipo)
    return archivos

@router.delete("/{empleado_id}/archivos/{archivo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_archivo(
    empleado_id: int,
    archivo_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(requires_role(GESTION_ROLES))
):
    """Elimina un archivo de un empleado."""
    if not ArchivoService.eliminar_archivo(db, archivo_id):
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    return None

# ===== OBSERVACIONES CON AUDITORÍA =====

@router.post("/{empleado_id}/observaciones", response_model=RegistroObservacionesResponse, status_code=status.HTTP_201_CREATED)
async def actualizar_observaciones(
    empleado_id: int,
    observacion_nueva: str,
    motivo_cambio: str = None,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(requires_role(GESTION_ROLES))
):
    """Actualiza las observaciones de un empleado con registro de auditoría."""
    try:
        registro = ObservacionService.registrar_observacion(
            db=db,
            empleado_id=empleado_id,
            observacion_nueva=observacion_nueva,
            modificado_por_id=current_user.id,
            motivo_cambio=motivo_cambio
        )
        return registro
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al registrar observación: {str(e)}")

@router.get("/{empleado_id}/observaciones/historial", response_model=List[RegistroObservacionesResponse])
async def obtener_historial_observaciones(
    empleado_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(AuthService.get_current_user)
):
    """Obtiene el historial de cambios en observaciones."""
    registros = ObservacionService.obtener_historial_observaciones(db, empleado_id)
    return registros
