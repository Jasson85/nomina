# Endpoint para modificar observaciones y auditar cambios
from app.database.models import NovedadAudit
from datetime import datetime

@router.patch("/{empleado_id}/observaciones", status_code=200)
async def modificar_observaciones_empleado(
    empleado_id: int,
    observaciones: str,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(requires_role(GESTION_ROLES))
):
    """Modifica el campo observaciones de un empleado y registra el cambio en auditoría."""
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado.")
    valor_anterior = empleado.observaciones or ""
    empleado.observaciones = observaciones
    db.commit()
    # Registrar auditoría
    audit = NovedadAudit(
        usuario_id=current_user.id,
        empleado_id=empleado_id,
        accion="modificar_observaciones",
        valor_anterior=valor_anterior,
        valor_nuevo=observaciones,
        timestamp=datetime.utcnow()
    )
    db.add(audit)
    db.commit()
    return {"message": "Observaciones modificadas y auditadas correctamente."}
# Endpoint para subir hoja de vida (CV)
import os
from fastapi import UploadFile, File

@router.post("/{empleado_id}/hoja-vida", status_code=200)
async def subir_hoja_vida_empleado(
    empleado_id: int,
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(requires_role(GESTION_ROLES))
):
    """Sube y guarda el archivo de hoja de vida (CV) de un empleado."""
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado.")
    # Carpeta destino
    carpeta_destino = os.path.join("public", "hojas_vida")
    os.makedirs(carpeta_destino, exist_ok=True)
    # Nombre único para el archivo
    nombre_archivo = f"cv_{empleado_id}_{archivo.filename}"
    ruta_archivo = os.path.join(carpeta_destino, nombre_archivo)
    # Guardar archivo
    with open(ruta_archivo, "wb") as f:
        contenido = await archivo.read()
        f.write(contenido)
    # Guardar ruta en la base de datos
    empleado.url_hoja_vida = f"/{ruta_archivo.replace(os.sep, '/')}"
    empleado.tiene_hoja_vida = True
    db.commit()
    return {"message": "Hoja de vida subida correctamente", "url_hoja_vida": empleado.url_hoja_vida}
import io
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, Query, status, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional, Dict, Any
from datetime import date
from app.schemas.empleado_schema import (
    EmpleadoImportacion,
    EstadisticasResponse,
    EmpleadoResponse,
    EmpleadoCreate,
    EmpleadoUpdate
)
from app.database.db import get_db
from app.database.models import Empleado, Ausencia, Usuario, RolUsuario

router = APIRouter(prefix="", tags=["Empleados"])

# ...existing code...
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional, Dict, Any
from datetime import date
from app.schemas.empleado_schema import (
     EmpleadoImportacion,
     EstadisticasResponse,
     EmpleadoResponse,
     EmpleadoCreate,
     EmpleadoUpdate
)
from app.database.db import get_db
from app.database.models import Empleado, Ausencia, Usuario, RolUsuario

router = APIRouter(prefix="", tags=["Empleados"])

# ...existing code...
from app.services.auth_service import AuthService
from app.services.empleado_service import EmpleadoService 
from app.dependencies.auth import requires_role
from app.database import models 

router = APIRouter(prefix="", tags=["Empleados"]) 

# Configuración de Roles
GESTION_ROLES = [RolUsuario.ADMIN, RolUsuario.PAYROLL_MGR]
LECTURA_ROLES = [RolUsuario.ADMIN, RolUsuario.PAYROLL_MGR, RolUsuario.SUPERVISOR]

@router.post("/importar-json")
async def importar_empleados_json(datos: List[EmpleadoImportacion], db: Session = Depends(get_db)):
    """Importar empleados desde JSON (uso interno)."""
    creados = 0
    actualizados = 0
    
    for emp_data in datos:         
        
        empleado_existente = db.query(models.Empleado).filter(
            models.Empleado.numero_documento == emp_data.numero_documento
        ).first()

        if empleado_existente:            
            
            empleado_existente.salario_base = emp_data.salario_base
            empleado_existente.eps_nombre = emp_data.eps_nombre
            empleado_existente.afp_nombre = emp_data.afp_nombre
            empleado_existente.arl_nombre = emp_data.arl_nombre
            empleado_existente.observaciones = emp_data.observaciones
            empleado_existente.cargo = emp_data.cargo
            empleado_existente.departamento_empresa = emp_data.departamento_empresa
            actualizados += 1

        else:           
            
            nombres_partes = emp_data.primer_nombre.strip().split() if emp_data.primer_nombre else []
            
            
            p_ape = nombres_partes[0] if len(nombres_partes) > 0 else "Sin Apellido"
            s_ape = nombres_partes[1] if len(nombres_partes) > 2 else None
            p_nom = " ".join(nombres_partes[2:]) if len(nombres_partes) > 2 else (nombres_partes[1] if len(nombres_partes) > 1 else "Sin Nombre")

            nuevo_emp = models.Empleado(
                primer_nombre=p_nom,
                primer_apellido=p_ape,
                segundo_apellido=s_ape,
                numero_documento=emp_data.numero_documento,
                salario_base=emp_data.salario_base,
                eps_nombre=emp_data.eps_nombre,
                afp_nombre=emp_data.afp_nombre,
                arl_nombre=emp_data.arl_nombre,
                observaciones=emp_data.observaciones,
                cargo=emp_data.cargo,
                departamento_empresa=emp_data.departamento_empresa,
                fecha_ingreso=date.today(), 
                activo=True,
                #estado="Activo"
            )
            db.add(nuevo_emp)
            creados += 1

    try:
        db.commit()
        return {"message": "Proceso completado con éxito", "creados": creados, "actualizados": actualizados}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al guardar en la base de datos: {str(e)}")

# CRUD 
@router.post("/", response_model=EmpleadoResponse, status_code=status.HTTP_201_CREATED)
def crear_empleado_endpoint(
    empleado: EmpleadoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(requires_role(GESTION_ROLES))
):
    if EmpleadoService.obtener_empleado_por_documento(db, empleado.numero_documento):
        raise HTTPException(status_code=400, detail="Ya existe un empleado con ese documento.")
    return EmpleadoService.crear_empleado(db, empleado)

@router.patch("/{empleado_id}", response_model=EmpleadoResponse)
def patch_empleado_endpoint(
    empleado_id: int, 
    empleado_data: EmpleadoUpdate, 
    db: Session = Depends(get_db),
    current_user: Any = Depends(requires_role(GESTION_ROLES))
):
    db_empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not db_empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")    
    
    update_data = empleado_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_empleado, key, value)
    
    try:
        db.commit()
        db.refresh(db_empleado)
        return db_empleado
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error interno al actualizar")

@router.get("/", response_model=List[EmpleadoResponse])
async def listar_empleados(
    skip: int = 0,
    limit: int = 100,
    activo: Optional[bool] = None,
    departamento: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(requires_role(LECTURA_ROLES))
):
    query = db.query(Empleado)
    if activo is not None:
        query = query.filter(Empleado.activo == activo)
    if departamento:
        query = query.filter(Empleado.departamento_empresa == departamento)
    
    return query.offset(skip).limit(limit).all()

# ESTADÍSTICAS Y DASHBOARD - ANTES DE /{empleado_id} PARA EVITAR CONFLICTO DE RUTAS
@router.get("/estadisticas", response_model=EstadisticasResponse)
async def obtener_estadisticas(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(requires_role(LECTURA_ROLES))
):
    total = db.query(func.count(Empleado.id)).scalar() or 0
    activos_count = db.query(func.count(Empleado.id)).filter(Empleado.activo == True).scalar() or 0
    
    empleados_activos = db.query(Empleado).filter(Empleado.activo == True).all()
    costo_total_proyectado = 0.0
    costo_por_depto = {}

    for emp in empleados_activos:
        salario = float(emp.salario_base or 0)        
        deducciones = salario * 0.08
        auxilio = 162000.0 if 0 < salario <= 2600000.0 else 0.0
        neto = salario - deducciones + auxilio
        
        costo_total_proyectado += neto
        depto = emp.departamento_empresa or "Sin Asignar"
        costo_por_depto[depto] = costo_por_depto.get(depto, 0.0) + neto

    novedades_db = db.query(Empleado).filter(
        Empleado.observaciones.isnot(None),
        Empleado.observaciones != ""
    ).order_by(Empleado.updated_at.desc()).limit(5).all() 

    actividades = [{
        "id": n.id,
        "titulo": f"{n.primer_nombre} {n.primer_apellido}",
        "descripcion": n.observaciones,
        "tiempo": "Reciente",
        "urlAvatar": f"https://ui-avatars.com/api/?name={n.primer_nombre}+{n.primer_apellido}&background=random"
    } for n in novedades_db]

    ausencias = db.query(func.count(Ausencia.id)).scalar() or 0
    
    return {
        "total_empleados": total,
        "empleados_activos": activos_count,
        "empleados_inactivos": total - activos_count,
        "total_nomina_mes": costo_total_proyectado,
        "promedio_salario": costo_total_proyectado / activos_count if activos_count > 0 else 0,
        "ausencias_pendientes": ausencias,
        "departamentos": {str(d[0] or "Sin Asignar"): d[1] for d in db.query(Empleado.departamento_empresa, func.count(Empleado.id)).filter(Empleado.activo == True).group_by(Empleado.departamento_empresa).all()},
        "costo_por_departamento": costo_por_depto,
        "actividades": actividades
    }

# OBTENER UN EMPLEADO ESPECÍFICO POR ID
@router.get("/{empleado_id}", response_model=EmpleadoResponse)
async def obtener_empleado_por_id(
    empleado_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(requires_role(LECTURA_ROLES))
):
    """Obtiene un empleado específico por su ID."""
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado.")
    return empleado

@router.post("/importar")
async def importar_archivo_excel(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(requires_role(GESTION_ROLES))
):
    """Importar empleados desde archivo Excel."""
    try:
        contenido = await file.read()
        resultado = EmpleadoService.importar_desde_archivo(db, contenido)
        return {"resultado": resultado}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))