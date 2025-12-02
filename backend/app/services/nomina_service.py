from sqlalchemy.orm import Session
from app.database.models import Nomina, Empleado
from app.schemas.nomina_schema import NominaCreate
from app.services.calculadora_colombiana import CalculadoraNomina
from datetime import date

class NominaService:
    @staticmethod
    def crear_nomina(db: Session, nomina: NominaCreate):
        empleado = db.query(Empleado).filter(Empleado.id == nomina.empleado_id).first()
        if not empleado:
            return None

        calc = CalculadoraNomina.calcular_nomina_completa(
            empleado.salario_base,
            nomina.horas_extra,
            porcentaje_arl=None
        )

        db_nomina = Nomina(
            empleado_id=nomina.empleado_id,
            periodo_mes=nomina.periodo_mes,
            periodo_año=nomina.periodo_año,
            salario_base=empleado.salario_base,
            horas_trabajadas=nomina.horas_trabajadas,
            horas_extra=nomina.horas_extra,
            valor_horas_extra=calc["valor_horas_extra"],
            aporte_eps=calc["aporte_eps"],
            aporte_afp=calc["aporte_afp"],
            aporte_arl=calc["aporte_arl"],
            retencion_renta=calc["retencion_renta"],
            total_deduciones=calc["total_deduciones"],
            salario_neto=calc["salario_neto"],
            fecha_pago=date.today(),
            estado="procesado"
        )

        db.add(db_nomina)
        db.commit()
        db.refresh(db_nomina)
        return db_nomina

    @staticmethod
    def obtener_nomina(db: Session, nomina_id: int):
        return db.query(Nomina).filter(Nomina.id == nomina_id).first()

    @staticmethod
    def obtener_nominas_empleado(db: Session, empleado_id: int):
        return db.query(Nomina).filter(Nomina.empleado_id == empleado_id).all()

    @staticmethod
    def obtener_nominas_periodo(db: Session, mes: int, año: int):
        return db.query(Nomina).filter(Nomina.periodo_mes == mes, Nomina.periodo_año == año).all()