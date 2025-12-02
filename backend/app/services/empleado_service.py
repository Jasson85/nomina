
from sqlalchemy.orm import Session
from app.database.models import Empleado
from app.schemas.empleado_schema import EmpleadoCreate, EmpleadoUpdate

class EmpleadoService:
    @staticmethod
    def crear_empleado(db: Session, empleado: EmpleadoCreate) -> Empleado:
        db_empleado = Empleado(**empleado.dict())
        db.add(db_empleado)
        db.commit()
        db.refresh(db_empleado)
        return db_empleado

    @staticmethod
    def obtener_empleado(db: Session, empleado_id: int) -> Empleado | None:
        return db.query(Empleado).filter(Empleado.id == empleado_id).first()

    @staticmethod
    def obtener_todos_empleados(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Empleado).offset(skip).limit(limit).all()

    @staticmethod
    def actualizar_empleado(db: Session, empleado_id: int, empleado_update: EmpleadoUpdate):
        db_empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
        if not db_empleado:
            return None
        data = empleado_update.dict(exclude_unset=True)
        for k, v in data.items():
            setattr(db_empleado, k, v)
        db.commit()
        db.refresh(db_empleado)
        return db_empleado

    @staticmethod
    def eliminar_empleado(db: Session, empleado_id: int):
        db_empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
        if db_empleado:
            db_empleado.activo = False
            db.commit()
            db.refresh(db_empleado)
        return db_empleado