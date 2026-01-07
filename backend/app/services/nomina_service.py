# app/services/nomina_service.py

from sqlalchemy.orm import Session
from app.database.models import Empleado, Nomina, ConfiguracionSistema, DescuentoLey, RolUsuario, EstadoNomina
from app.schemas.nomina_schema import NominaCalculoInput, NominaCalculoOutput, NominaResponse, ConfiguracionLegal
from app.services.ausencia_service import AusenciaService
from app.services.configuracion_service import ConfiguracionService 
from fastapi import HTTPException, status
from typing import Optional, List, Dict
from datetime import date, datetime
import math

class NominaService:

    # Calcular Nómina
    @staticmethod
    def calcular_nomina_empleado(
        db: Session, 
        empleado: Empleado, 
        nomina_input: NominaCalculoInput
    ) -> NominaCalculoOutput:
        """Realiza el cálculo completo de la nómina para un empleado en un período dado."""

        #Obtener Configuración Legal
        config = ConfiguracionService.obtener_configuracion_legal(db)

        # Variables del Período
        dias_del_mes = (nomina_input.fecha_fin - nomina_input.fecha_inicio).days + 1
        salario_base_mensual = empleado.salario_base
        salario_base_diario = salario_base_mensual / 30 
        
        # Novedades: Días No Pagos (Ausencias)
        dias_no_laborados_no_pagos = AusenciaService.calcular_dias_ausencia_no_pagos(
            db, empleado.id, nomina_input.fecha_inicio, nomina_input.fecha_fin
        )
        
        dias_trabajados_efectivos = dias_del_mes - dias_no_laborados_no_pagos
        
        # Validación de días trabajados
        if dias_trabajados_efectivos <= 0:
            # Podríamos retornar una nómina con cero, o lanzar un error, 
            # pero por ahora, la calculamos con 0 si es <= 0.
            pass 

        # --- CÁLCULO DE DEVENGOS ---
        
        # Salario Devengado
        salario_devengado = dias_trabajados_efectivos * salario_base_diario
        
        #Auxilio de Transporte        
        es_beneficiario_transporte = (salario_base_mensual <= (2 * config.salario_minimo))
        auxilio_transporte_total = 0.0
        if es_beneficiario_transporte and dias_trabajados_efectivos > 0:          
            auxilio_transporte_diario = config.auxilio_transporte_legal / 30
            auxilio_transporte_total = auxilio_transporte_diario * dias_trabajados_efectivos
            
        # [PENDIENTE: Sumar Horas Extra, Comisiones, Bonificaciones (Novedades)]
        
        total_devengado = (
            salario_devengado + 
            auxilio_transporte_total + 
            0.0 # Horas Extra
        )

        # CÁLCULO DE DEDUCCIONES (EMPLEADO) 
        
        # Base de Aportes de Seguridad Social 
       
        base_salud_pension = max(salario_devengado, config.salario_minimo)         
        aporte_eps_empleado = base_salud_pension * config.eps_empleado_porcentaje
        aporte_afp_empleado = base_salud_pension * config.afp_empleado_porcentaje
        
        # [PENDIENTE: Retención en la Fuente - Requiere la tabla de UVT y cálculos complejos]
        retencion_renta = 0.0
        
        total_deducciones = (
            aporte_eps_empleado + 
            aporte_afp_empleado + 
            retencion_renta
        )

        #Salario Neto
        salario_neto = total_devengado - total_deducciones
        
        # CÁLCULO DE APORTES PATRONALES 
        
        # Salud y Pensión Empleador 
        salud_empleador = base_salud_pension * config.eps_empleador_porcentaje
        pension_empleador = base_salud_pension * config.afp_empleador_porcentaje
        
        # 7. ARL        
        arl_empleador = base_salud_pension * config.arl_minimo_porcentaje 
        
        # Parafiscales
        caja_compensacion_empleador = base_salud_pension * config.caja_compensacion_porcentaje        
        icbf = base_salud_pension * config.icbf_porcentaje
        sena = base_salud_pension * config.sena_porcentaje
        
        total_aportes_patronales = (
            salud_empleador + pension_empleador + arl_empleador + 
            caja_compensacion_empleador + icbf + sena
        )
        
        # CÁLCULO DE PROVISIONES 
        
        # (Salario + Auxilio Transporte + Horas Extra + Comisiones + Bonificaciones)
        # Cesantías, Prima,
        base_provision = salario_devengado + auxilio_transporte_total 
        
        # Provision Mensual
        cesantias = base_provision * (8.33 / 100) 
        prima = base_provision * (8.33 / 100)   
        intereses_cesantias = base_provision * (1 / 100) 
        
        # Vacaciones 
        vacaciones = salario_devengado * (4.17 / 100) 
        
        total_provisiones = cesantias + intereses_cesantias + prima + vacaciones
        
        costo_empleador_total = total_aportes_patronales + total_provisiones
        
        # CONSTRUCCIÓN OUTPUT ---
        
        return NominaCalculoOutput(
            empleado_id=empleado.id,
            periodo_mes=nomina_input.periodo_mes,
            periodo_año=nomina_input.periodo_año,
            salario_base=salario_base_mensual,
            dias_trabajados=dias_trabajados_efectivos,
            salario_devengado=salario_devengado,
            auxilio_transporte=auxilio_transporte_total,
            total_devengado=total_devengado,
            base_salud_pension=base_salud_pension,
            aporte_eps_empleado=aporte_eps_empleado,
            aporte_afp_empleado=aporte_afp_empleado,
            retencion_renta=retencion_renta,
            total_deducciones=total_deducciones,
            salario_neto=salario_neto,
            salud_empleador=salud_empleador,
            pension_empleador=pension_empleador,
            arl_empleador=arl_empleador,
            caja_compensacion_empleador=caja_compensacion_empleador,
            icbf=icbf,
            sena=sena,
            total_aportes_patronales=total_aportes_patronales,
            cesantias=cesantias,
            intereses_cesantias=intereses_cesantias,
            prima=prima,
            vacaciones=vacaciones,
            total_provisiones=total_provisiones,
            costo_empleador_total=salario_neto + total_aportes_patronales + total_provisiones 
        )

    # Guardar Nómina
    @staticmethod
    def guardar_nomina(
        db: Session, 
        calculo: NominaCalculoOutput, 
        creado_por_id: int
    ) -> Nomina:
        """Convierte el cálculo en un registro de Nómina y lo guarda en la DB."""
        
        db_nomina = Nomina(
            empleado_id=calculo.empleado_id,
            periodo_mes=calculo.periodo_mes,
            periodo_anio=calculo.periodo_año,
            salario_base=calculo.salario_base,
            auxilio_transporte=calculo.auxilio_transporte,
            total_devengado=calculo.total_devengado,
            total_deducciones=calculo.total_deducciones,
            salario_neto=calculo.salario_neto,
            estado=EstadoNomina.GENERADA,
            creado_por_id=creado_por_id
        )
        
        db.add(db_nomina)
        db.commit()
        db.refresh(db_nomina)
        return db_nomina
        
    # CRUD de Nómina 
    
    @staticmethod
    def obtener_nomina_por_id(db: Session, nomina_id: int) -> Optional[Nomina]:
        return db.query(Nomina).filter(Nomina.id == nomina_id).first()
        
    @staticmethod
    def obtener_nominas_por_periodo(db: Session, mes: int, anio: int) -> List[Nomina]:
        return db.query(Nomina).filter(Nomina.periodo_mes == mes, Nomina.periodo_anio == anio).all()
        
    @staticmethod
    def generar_nomina_masiva(db: Session, mes: int, anio: int, creado_por_id: int) -> Dict:
        """Genera nómina para todos los empleados activos en un período."""
        empleados = db.query(Empleado).filter(Empleado.activo == True).all()
        
        if not empleados:
            raise Exception("No hay empleados activos en la base de datos")
        
        creados = 0
        errores = 0
        errores_detalle = []
        
        for empleado in empleados:
            try:
                # Crear input de cálculo
                nomina_input = NominaCalculoInput(
                    empleado_id=empleado.id,
                    periodo_mes=mes,
                    periodo_año=anio,
                    fecha_inicio=date(anio, mes, 1),
                    fecha_fin=date(anio, mes, 28) if mes == 2 else (
                        date(anio, mes, 30) if mes in [4, 6, 9, 11] else date(anio, mes, 31)
                    )
                )
                
                # Calcular nómina
                calculo = NominaService.calcular_nomina_empleado(db, empleado, nomina_input)
                
                # Guardar
                NominaService.guardar_nomina(db, calculo, creado_por_id)
                db.commit()
                creados += 1
            except Exception as e:
                db.rollback()
                errores += 1
                errores_detalle.append(f"Empleado {empleado.id}: {str(e)}")
                continue
        
        return {"creados": creados, "errores": errores, "total": len(empleados), "errores_detalle": errores_detalle}
    
    @staticmethod
    def aprobar_nomina(db: Session, nomina_id: int, aprobado_por_id: int) -> Optional[Nomina]:
        db_nomina = NominaService.obtener_nomina_por_id(db, nomina_id)
        if db_nomina and db_nomina.estado == EstadoNomina.GENERADA:
            db_nomina.estado = EstadoNomina.APROBADA
            db_nomina.aprobado_por_id = aprobado_por_id
            db_nomina.fecha_aprobacion = datetime.utcnow()
            db.commit()
            db.refresh(db_nomina)
            return db_nomina
        return None