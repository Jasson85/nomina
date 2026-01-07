from sqlalchemy.orm import Session, joinedload
from app.database.models import Ausencia, Empleado 
from datetime import date, timedelta
from app.schemas.ausencia_schema import AusenciaCreate
from typing import List, Optional

class AusenciaService:
    @staticmethod
    def obtener_todas_ausencias(db: Session) -> List[Ausencia]:
        """
        Retorna todas las ausencias incluyendo el nombre del empleado 
        para que la Tabla del Frontend se llene correctamente.
        """        
        ausencias = db.query(Ausencia).options(joinedload(Ausencia.empleado)).all()        
        
        for ausencia in ausencias:
            if ausencia.empleado:
                ausencia.nombre_empleado = f"{ausencia.empleado.nombre} {ausencia.empleado.apellido}"
        
        return ausencias

    @staticmethod
    def crear_ausencia(db: Session, ausencia: AusenciaCreate):        
        if ausencia.dias is None:
            dias = (ausencia.fecha_fin - ausencia.fecha_inicio).days + 1
        else:
            dias = ausencia.dias
            
        db_ausencia = Ausencia(
            empleado_id=ausencia.empleado_id,
            tipo=ausencia.tipo,
            fecha_inicio=ausencia.fecha_inicio,
            fecha_fin=ausencia.fecha_fin,
            dias=dias,
            motivo=ausencia.motivo,
            estado="pendiente" 
        )
        db.add(db_ausencia)
        db.commit()
        db.refresh(db_ausencia)
        return db_ausencia
    

    @staticmethod
    def calcular_dias_ausencia_no_pagos(db: Session, empleado_id: int, periodo_inicio: date, periodo_fin: date) -> int:
        """
        Calcula días para descuento en pre-nómina (Licencias, Sanciones, etc.)
        """
        ausencias_no_pagas = db.query(Ausencia).filter(
            Ausencia.empleado_id == empleado_id,
            Ausencia.estado == "aprobada",            
            Ausencia.tipo.in_(['Licencia No Remunerada', 'Sanción', 'Suspensión', 'Inasistencia']),
            Ausencia.fecha_inicio <= periodo_fin,
            Ausencia.fecha_fin >= periodo_inicio
        ).all()
        
        dias_no_laborados = 0
        for ausencia in ausencias_no_pagas:
            fecha_inicio_efectiva = max(periodo_inicio, ausencia.fecha_inicio)
            fecha_fin_efectiva = min(periodo_fin, ausencia.fecha_fin)
            dias_superpuestos = (fecha_fin_efectiva - fecha_inicio_efectiva).days + 1
            dias_no_laborados += dias_superpuestos

        return dias_no_laborados