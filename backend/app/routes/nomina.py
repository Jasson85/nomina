from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.db import get_db
from app.schemas.nomina_schema import NominaCalculoInput, NominaCalculoOutput, NominaResponse
from app.schemas.empleado_schema import EmpleadoResponse
from app.services.nomina_service import NominaService
from app.database.models import Nomina, Usuario, RolUsuario
from app.services.auth_service import AuthService
from datetime import datetime, date

from app.dependencies.auth import requires_role 

router = APIRouter(prefix="", tags=["Nóminas"])

# Obtener todas las nóminas
@router.get("/", response_model=List[dict])
def obtener_todas_nominas(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(
        requires_role([RolUsuario.PAYROLL_MGR, RolUsuario.ADMIN, RolUsuario.SUPERVISOR])
    )
):
    """Retorna todas las nóminas procesadas en el sistema, incluyendo EPS y Fondo de Pensión."""
    nominas = db.query(Nomina).all()
    resultado = []
    for nomina in nominas:
        empleado = db.query(Empleado).filter(Empleado.id == nomina.empleado_id).first()
        data = NominaResponse.model_validate(nomina, from_attributes=True).model_dump()
        if empleado:
            data["eps_nombre"] = empleado.eps_nombre
            data["afp_nombre"] = empleado.afp_nombre
        resultado.append(data)
    return resultado

@router.post("/", response_model=NominaResponse, status_code=status.HTTP_201_CREATED)
def crear_nomina(
    nomina_input: NominaCalculoInput, 
    db: Session = Depends(get_db),
    
    current_user: Usuario = Depends(
        requires_role([RolUsuario.PAYROLL_MGR, RolUsuario.ADMIN])
    )
):
    """Procesa y crea un registro de nómina INDIVIDUAL."""
    from app.database.models import Empleado
    empleado = db.query(Empleado).filter(Empleado.id == nomina_input.empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado.")

    try:
        calculo = NominaService.calcular_nomina_empleado(db, empleado, nomina_input)
       
        nueva_nomina = NominaService.guardar_nomina(db, calculo, creador_id=current_user.id)
        if not nueva_nomina:
            raise HTTPException(status_code=404, detail="Empleado no encontrado o error al procesar la nómina.")
        return nueva_nomina
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Error de datos: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno al calcular la nómina: {str(e)}")


# detalle de nómina por ID
@router.get("/{nomina_id}", response_model=dict)
def obtener_nomina(
    nomina_id: int, 
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(AuthService.get_current_user)
):
    """Obtiene el detalle de una nómina por ID, incluyendo EPS y Fondo de Pensión."""
    nomina = NominaService.obtener_nomina(db, nomina_id, current_user=current_user)
    if not nomina:
        raise HTTPException(status_code=404, detail="Nómina no encontrada")
    empleado = db.query(Empleado).filter(Empleado.id == nomina.empleado_id).first()
    data = NominaResponse.model_validate(nomina, from_attributes=True).model_dump()
    if empleado:
        data["eps_nombre"] = empleado.eps_nombre
        data["afp_nombre"] = empleado.afp_nombre
    return data


# Obtener historial de nóminas
@router.get("/empleado/{empleado_id}", response_model=List[NominaResponse])
def obtener_nominas_empleado(
    empleado_id: int, 
    db: Session = Depends(get_db),    
    
    current_user: Usuario = Depends(AuthService.get_current_user)
):
    """Obtiene el historial de nóminas de un empleado específico."""
    
    return NominaService.obtener_nominas_empleado(db, empleado_id, current_user=current_user)


# Obtener nóminas por período
@router.get("/periodo/{mes}/{anio}", response_model=List[NominaResponse])
def obtener_nominas_periodo(
    mes: int,
    anio: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(
        requires_role([RolUsuario.PAYROLL_MGR, RolUsuario.ADMIN, RolUsuario.SUPERVISOR])
    )
):
    """Obtiene todas las nóminas pagadas en un mes y año específicos, incluyendo EPS, AFP y nombre completo del empleado."""
    nominas = NominaService.obtener_nominas_por_periodo(db, mes, anio)
    resultado = []
    for nomina in nominas:
        empleado = db.query(Empleado).filter(Empleado.id == nomina.empleado_id).first()
        data = NominaResponse.model_validate(nomina, from_attributes=True).model_dump()
        if empleado:
            data["eps_nombre"] = empleado.eps_nombre
            data["afp_nombre"] = empleado.afp_nombre
            data["nombre_completo"] = empleado.nombre_completo
            data["departamento_empresa"] = empleado.departamento_empresa
            data["cargo"] = empleado.cargo
        resultado.append(data)
    return resultado

# GENERACIÓN MASIVA

@router.post("/generar", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
def generar_nomina_periodo(
    mes: int,
    anio: int,
    db: Session = Depends(get_db),    
    current_user: Usuario = Depends(
        requires_role([RolUsuario.PAYROLL_MGR, RolUsuario.ADMIN])
    )
):
    """
    Genera masivamente la nómina para todos los empleados activos en el mes y año especificados.
    """
    if mes < 1 or mes > 12:
        raise HTTPException(status_code=400, detail="Mes inválido.")
        
    try:       
        # servicio para la generación masiva
        resumen = NominaService.generar_nomina_masiva(db, mes, anio, creado_por_id=current_user.id)
        
        # Si no se creó ninguna nómina, retornar error
        if resumen.get("creados", 0) == 0:
            errores = resumen.get("errores_detalle", [])
            detalle = f"No se generaron nóminas. Errores: {'; '.join(errores)}" if errores else "No hay empleados activos"
            raise HTTPException(
                status_code=400, 
                detail=detalle
            )
            
        return {
            "mensaje": f"Nómina de {mes}/{anio} generada exitosamente",
            "empleados_procesados": resumen.get("creados"),
            "errores": resumen.get("errores", 0),
            "total_empleados": resumen.get("total", 0),
            "fecha_ejecucion": datetime.now().isoformat()
        } 
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error en procesamiento: {str(e)}")