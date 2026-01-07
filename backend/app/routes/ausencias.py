from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.db import get_db
from app.schemas.ausencia_schema import AusenciaCreate, AusenciaResponse
from app.services.ausencia_service import AusenciaService
from app.database.models import Ausencia, Usuario, RolUsuario 
from app.services.auth_service import AuthService 

router = APIRouter(prefix="", tags=["Ausencias"])

GESTION_ROLES = [RolUsuario.ADMIN, RolUsuario.PAYROLL_MGR, RolUsuario.SUPERVISOR]

# Obtener todas ausencias 
@router.get("/", response_model=List[AusenciaResponse])
def obtener_todas_ausencias(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(AuthService.get_current_user)
):
    """Retorna todas las ausencias del sistema (Solo ADMIN/PAYROLL_MGR)."""
    if current_user.rol not in GESTION_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tienes permiso para ver todas las ausencias.")
        
    return AusenciaService.obtener_todas_ausencias(db)
    
@router.post("/", response_model=AusenciaResponse, status_code=status.HTTP_201_CREATED)
def crear_ausencia(
    ausencia: AusenciaCreate, 
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(AuthService.get_current_user)
):
    """Crea una nueva solicitud de ausencia. Se recomienda que el empleado solo cree para sí mismo."""
    
    if current_user.rol == RolUsuario.EMPLEADO and ausencia.empleado_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Solo puedes crear ausencias para ti mismo.")
        
    try:
        return AusenciaService.crear_ausencia(db, ausencia)
    except Exception as e:
        
        raise HTTPException(status_code=400, detail=f"Error al crear ausencia: {str(e)}")

@router.get("/{ausencia_id}", response_model=AusenciaResponse)
def obtener_ausencia(
    ausencia_id: int, 
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(AuthService.get_current_user)
):
    """Obtiene el detalle de una ausencia por ID. Solo gestor o el empleado dueño."""
    ausencia = AusenciaService.obtener_ausencia(db, ausencia_id)
    if not ausencia:
        raise HTTPException(status_code=404, detail="Ausencia no encontrada")
        
    # Permisos de Lectura Individual
    if current_user.rol not in GESTION_ROLES and ausencia.empleado_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tienes permiso para ver esta ausencia.")
        
    return ausencia

@router.get("/empleado/{empleado_id}", response_model=List[AusenciaResponse])
def obtener_ausencias_empleado(
    empleado_id: int, 
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(AuthService.get_current_user)
):
    """Obtiene todas las ausencias de un empleado específico. Solo gestor o el empleado dueño."""
    # Permisos de Lectura por Empleado
    if current_user.rol not in GESTION_ROLES and empleado_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tienes permiso para ver las ausencias de este empleado.")

    return AusenciaService.obtener_ausencias_empleado(db, empleado_id)

@router.put("/{ausencia_id}/aprobar", response_model=AusenciaResponse)
def aprobar_ausencia(
    ausencia_id: int, 
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(AuthService.get_current_user)
):
    """Aprueba una solicitud de ausencia (Solo ADMIN/PAYROLL_MGR/SUPERVISOR)."""
    if current_user.rol not in GESTION_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Solo el personal de gestión puede aprobar ausencias.")
        
    ausencia = AusenciaService.aprobar_ausencia(db, ausencia_id)
    if not ausencia:
        raise HTTPException(status_code=404, detail="Ausencia no encontrada")
    return ausencia

@router.put("/{ausencia_id}/rechazar", response_model=AusenciaResponse)
def rechazar_ausencia(
    ausencia_id: int, 
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(AuthService.get_current_user)
):
    """Rechaza una solicitud de ausencia (Solo ADMIN/PAYROLL_MGR/SUPERVISOR)."""
    if current_user.rol not in GESTION_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Solo el personal de gestión puede rechazar ausencias.")
        
    ausencia = AusenciaService.rechazar_ausencia(db, ausencia_id)
    if not ausencia:
        raise HTTPException(status_code=404, detail="Ausencia no encontrada")
    return ausencia