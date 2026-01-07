from sqlalchemy.orm import Session
from sqlalchemy import func, extract, literal_column
from typing import List, Dict, Any

from app.database.models import Empleado, Nomina, Usuario 
from app.schemas.reporte_schema import EstadisticasNomina, NominaResumenMensual, DistribucionCosto

class ReporteService:

    @staticmethod
    def obtener_estadisticas_generales(db: Session, anio: int) -> EstadisticasNomina:
        
        # Cálculo de Métricas Globales ---
        total_empleados_activos = db.query(Empleado).filter(Empleado.estado == 'Activo').count()
        salario_promedio_result = db.query(func.avg(Empleado.salario_base)).filter(Empleado.estado == 'Activo').scalar()
        salario_promedio = float(salario_promedio_result or 0.0)

        costo_anual_total = db.query(func.sum(Nomina.costo_empleador))\
            .filter(extract('year', Nomina.fecha_pago) == anio)\
            .scalar() or 0.0
        
        costo_promedio_empleado = (costo_anual_total / total_empleados_activos) if total_empleados_activos else 0.0


        # Análisis de Tendencia Mensual (NominaResumenMensual) ---
        
        resumen_mensual_q = db.query(
            extract('month', Nomina.fecha_pago).label('mes'),
            func.sum(Nomina.total_devengado).label('total_devengado'),
            
            func.sum(Nomina.total_deducciones).label('total_deducciones'), 
            
            func.sum(Nomina.salario_neto).label('total_neto_pagado'),            
           
            func.sum(
                Nomina.salud_empleador + Nomina.pension_empleador + Nomina.arl_empleador + 
                Nomina.caja_compensacion_empleador + Nomina.icbf + Nomina.sena
            ).label('total_aportes_patronales') 
            
        ).filter(extract('year', Nomina.fecha_pago) == anio)\
          .group_by(literal_column('mes'))\
          .order_by('mes')\
          .all()

        resumen_mensual: List[NominaResumenMensual] = [
            NominaResumenMensual(
                mes=int(r.mes),
                total_devengado=float(r.total_devengado or 0.0),
                total_deducciones=float(r.total_deducciones or 0.0),
                total_neto_pagado=float(r.total_neto_pagado or 0.0),
                total_aportes_patronales=float(r.total_aportes_patronales or 0.0)
            ) for r in resumen_mensual_q
            ]       
        
        # Costo por Departamento (OK)
        costo_dep_results = db.query(
            Empleado.departamento_empresa.label('nombre_categoria'),
            func.sum(Nomina.costo_empleador).label('total_costo')
        ).join(
            Nomina, Nomina.empleado_id == Empleado.id 
        ).filter(extract('year', Nomina.fecha_pago) == anio)\
          .group_by(Empleado.departamento_empresa)\
          .all()
        
        costo_por_departamento: List[DistribucionCosto] = [
            DistribucionCosto(
                nombre_categoria=row.nombre_categoria,
                total_costo=float(row.total_costo or 0.0),
                porcentaje=(float(row.total_costo or 0.0) / costo_anual_total * 100) if costo_anual_total else 0.0
            ) for row in costo_dep_results
        ]        
        
        costo_rol_results = db.query(
            Usuario.rol.label('nombre_categoria'), 
            func.sum(Nomina.costo_empleador).label('total_costo')
        ).select_from(Nomina).join(  
            Empleado, Nomina.empleado_id == Empleado.id 
        ).join(
            Usuario, Empleado.email_corporativo == Usuario.email 
        ).filter(extract('year', Nomina.fecha_pago) == anio)\
          .group_by(Usuario.rol)\
          .all()
        
        costo_por_rol: List[DistribucionCosto] = [
            DistribucionCosto(
                nombre_categoria=str(row.nombre_categoria.value), 
                total_costo=float(row.total_costo or 0.0),
                porcentaje=(float(row.total_costo or 0.0) / costo_anual_total * 100) if costo_anual_total else 0.0
            ) for row in costo_rol_results
        ]

        # Días de Ausencia No Pagados ---
        dias_no_pagados_totales = 0
        
        
        # Construcción del modelo de respuesta final ---
        return EstadisticasNomina(
            salario_promedio=salario_promedio,
            costo_promedio_empleado=costo_promedio_empleado,
            resumen_mensual=resumen_mensual,
            costo_por_departamento=costo_por_departamento,
            costo_por_rol=costo_por_rol, 
            dias_no_pagados_totales=int(dias_no_pagados_totales)
        )

    @staticmethod
    def generar_reporte_detallado(db: Session, mes: int, anio: int) -> List[Dict[str, Any]]:
        return []