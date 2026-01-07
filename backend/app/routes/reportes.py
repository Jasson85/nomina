from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.db import get_db
from app.schemas.reporte_schema import EstadisticasNomina
from app.services.reporte_service import ReporteService
from app.database.models import Usuario, RolUsuario
from app.dependencies.auth import requires_role 

router = APIRouter(prefix="/reportes", tags=["Reportes y Estadísticas"])

# Los reportes accesibles por personal clave.
GESTION_ROLES = [RolUsuario.ADMIN, RolUsuario.PAYROLL_MGR]

# ESTADÍSTICAS DEL DASHBOARD 
@router.get("/estadisticas/{anio}", response_model=EstadisticasNomina)
def obtener_estadisticas_dashboard(
    anio: int,
    db: Session = Depends(get_db),
    # PROTECCIÓN: Gestores pueden ver estadísticas
    current_user: Usuario = Depends(
        requires_role(GESTION_ROLES)
    )
):
    """
    Retorna datos agregados y KPIs para el dashboard de nómina (Salario Promedio, Tendencias, Costos por Departamento).
    """
    try:
        stats = ReporteService.obtener_estadisticas_generales(db, anio)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar estadísticas: {str(e)}")


# --- RUTA: REPORTE DETALLADO (Para Exportar) ---
@router.get("/detallado/{mes}/{anio}", response_model=List[Dict[str, Any]])
def generar_reporte_detallado(
    mes: int,
    anio: int,
    db: Session = Depends(get_db),
    # PROTECCIÓN: Gestores acceder a datos detallados
    current_user: Usuario = Depends(
        requires_role(GESTION_ROLES)
    )
):
    """
    Genera un reporte detallado de todas las nóminas de un periodo (ideal para exportar a Excel/CSV).
    """
    if mes < 1 or mes > 12:
        raise HTTPException(status_code=400, detail="El mes debe ser un valor entre 1 y 12.")
        
    try:
        reporte = ReporteService.generar_reporte_detallado(db, mes, anio)
        if not reporte:
            raise HTTPException(status_code=404, detail="No se encontraron nóminas para este periodo.")
        return reporte
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar el reporte: {str(e)}")