from sqlalchemy.orm import Session
from app.database.models import Ausencia
from app.schemas.ausencia_schema import AusenciaCreate

class AusenciaService:
    @staticmethod
    def crear_ausencia(db: Session, ausencia: AusenciaCreate):
        dias = (ausencia.fecha_fin - ausencia.fecha_inicio).days + 1
        db_ausencia = Ausencia(
            empleado_id=ausencia.empleado_id,
            tipo=ausencia.tipo,
            fecha_inicio=ausencia.fecha_inicio,
            fecha_fin=ausencia.fecha_fin,
            dias=dias,
            motivo=ausencia.motivo
        )
        db.add(db_ausencia)
        db.commit()
        db.refresh(db_ausencia)
        return db_ausencia

    @staticmethod
    def obtener_ausencia(db: Session, ausencia_id: int):
        return db.query(Ausencia).filter(Ausencia.id == ausencia_id).first()

    @staticmethod
    def obtener_ausencias_empleado(db: Session, empleado_id: int):
        return db.query(Ausencia).filter(Ausencia.empleado_id == empleado_id).all()

    @staticmethod
    def aprobar_ausencia(db: Session, ausencia_id: int):
        ausencia = db.query(Ausencia).filter(Ausencia.id == ausencia_id).first()
        if ausencia:
            ausencia.estado = "aprobado"
            db.commit()
            db.refresh(ausencia)
        return ausencia

    @staticmethod
    def rechazar_ausencia(db: Session, ausencia_id: int):
        ausencia = db.query(Ausencia).filter(Ausencia.id == ausencia_id).first()
        if ausencia:
            ausencia.estado = "rechazado"
            db.commit()
            db.refresh(ausencia)
        return ausencia