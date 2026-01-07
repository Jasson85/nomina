from sqlalchemy.orm import Session
from .configuracion_service import obtener_configuracion_global
from typing import Optional, Dict, Any


class CalculadoraNomina:    

    @staticmethod
    def calcular_arl_tasa(nivel_riesgo: str) -> float:
        """Retorna la tasa de ARL (ej. Clase I: 0.522%) basada en el nivel de riesgo."""
        TASAS_ARL = {
            "I": 0.00522,   # Riesgo Mínimo
            "II": 0.01044,  # Riesgo Bajo
            "III": 0.02436, # Riesgo Medio
            "IV": 0.04350,  # Riesgo Alto
            "V": 0.06960,   # Riesgo Máximo
        }
        # Retorna la tasa o la tasa mínima si el valor no se encuentra
        return TASAS_ARL.get(nivel_riesgo.upper(), TASAS_ARL["I"])

    @classmethod
    def calcular_horas_extra(cls, valor_hora: float, horas_extra_tipos: Dict[str, float]) -> float:
        """
        Calcula el valor total de las horas extra basado en los tipos de recargo.
        Las tasas son estáticas para Colombia (ej. 1.25, 1.35, 2.0, etc.).
        """        
        TASAS_RECARGO = {
            "DIURNA_EXTRA": 1.25,
            "NOCTURNA_EXTRA": 1.75, # Recargo nocturno (35%) + recargo extra (25%) = 1.35 + 0.4 = 1.75
            "DOMINICAL_DIURNA": 1.75,
            "DIURNA_FESTIVA": 2.00,
            # Añadir más tipos según las necesidades de tu sistema...
        }
        
        total_horas_extra = 0.0
        
        for tipo, horas in horas_extra_tipos.items():
            tasa = TASAS_RECARGO.get(tipo, 1.0) # Usa 1.0 como fallback si el tipo no existe
            valor_por_tipo = valor_hora * horas * tasa
            total_horas_extra += valor_por_tipo
            
        return total_horas_extra

    @staticmethod
    def calcular_aporte_eps(ibc: float) -> float:
        """Calcula el aporte del 4% del empleado para Salud (EPS) sobre el IBC."""
        TASA_EMPLEADO_SALUD = 0.04  # 4%
        return ibc * TASA_EMPLEADO_SALUD

    @staticmethod
    def calcular_aporte_afp(ibc: float) -> float:
        """Calcula el aporte del 4% del empleado para Pensión (AFP) sobre el IBC."""
        TASA_EMPLEADO_PENSION = 0.04  # 4%
        return ibc * TASA_EMPLEADO_PENSION 
    
    @staticmethod
    def calcular_aporte_arl_empleador(ibc: float, porcentaje_arl: float) -> float:
        """Calcula el aporte de Riesgos Laborales (ARL), pagado totalmente por el empleador."""
        # Se usa el porcentaje_arl que se calculó previamente en nomina_service.py
        return ibc * porcentaje_arl
    
    @classmethod
    def calcular_valor_hora(cls, salario_base: float) -> float:
        """Calcula el valor de una hora de trabajo."""
        return salario_base / 240 # (30 días * 8 horas)   

    @staticmethod
    def calcular_prima_servicios(salario_base: float, dias_trabajados: int, auxilio_transporte: float = 0) -> float:
        """Calcula la provisión de prima. La base incluye el auxilio de transporte."""
        base_prestacion = salario_base + auxilio_transporte 
        dias_max = min(dias_trabajados, 180) 
        return (base_prestacion * dias_max) / 360

    @staticmethod
    def calcular_cesantias(salario_base: float, dias_trabajados: int, auxilio_transporte: float = 0) -> float:
        """Calcula la provisión de cesantías."""
        base_prestacion = salario_base + auxilio_transporte 
        return (base_prestacion * dias_trabajados) / 360 # (30 días / 360) = 1/12 de la base
        
    @staticmethod
    def calcular_vacaciones(salario_base: float, dias_trabajados: int) -> float:
        """Calcula la provisión de vacaciones. NO incluye auxilio de transporte."""
        # Fórmula: (Salario * Días Trabajados) / 720 (360 * 2)
        return (salario_base * dias_trabajados) / 720 

    @classmethod
    def calcular_nomina_completa(
        cls, 
        salario_base: float, 
        db: Session, 
        horas_extra_tipos: Dict[str, float] = None, 
        dias_laborados: int = 30, 
        porcentaje_arl: float = 0.00522 # Viene de nomina_service.py
    ) -> Dict[str, Any]:
        
        horas_extra_tipos = horas_extra_tipos or {}
        
        # --- CARGA DE CONFIGURACIÓN DINÁMICA ---
        config = obtener_configuracion_global(db)
        
        # Debe manejar si la configuración es None
        SMMLV = config.get("SMMLV") if config else 1300000.0
        AUXILIO_TRANSPORTE = config.get("AUXILIO_TRANSPORTE") if config else 162000.0
        UVT = config.get("UVT_ACTUAL") if config else 47065.0
        
        # --- Inicio de Cálculo ---
        valor_hora = cls.calcular_valor_hora(salario_base)
        
        # 1. Devengos
        salario_devengado = (salario_base / 30) * dias_laborados
        
        auxilio_transporte = 0.0
        if salario_base <= (2 * SMMLV):
            auxilio_transporte = (AUXILIO_TRANSPORTE / 30) * dias_laborados
            
        valor_horas_extra = cls.calcular_horas_extra(valor_hora, horas_extra_tipos)
        total_devengos = salario_devengado + auxilio_transporte + valor_horas_extra
        
        # 💡 Lógica de IBC inline
        ibc_calculado = salario_devengado + valor_horas_extra
        ibc = max(ibc_calculado, SMMLV) # El IBC mínimo es 1 SMMLV
        
        eps = cls.calcular_aporte_eps(ibc)
        afp = cls.calcular_aporte_afp(ibc)
        
        # 💡 Lógica de Renta inline
        salario_pre_renta = salario_devengado + valor_horas_extra
        limite_exento = 3 * UVT 
        retencion_renta = salario_pre_renta * 0.05 if salario_pre_renta > limite_exento else 0.0
        
        # 3. Aporte Empleador (ARL)
        aporte_arl = cls.calcular_aporte_arl_empleador(ibc, porcentaje_arl)
        
        # 4. Neto
        total_deduciones = eps + afp + retencion_renta
        salario_neto = total_devengos - total_deduciones

        return {
            "salario_devengado": round(salario_devengado, 2),
            "auxilio_transporte": round(auxilio_transporte, 2),
            "valor_horas_extra": round(valor_horas_extra, 2),
            "total_ingresos": round(total_devengos, 2),
            "aporte_eps": round(eps, 2),
            "aporte_afp": round(afp, 2),
            "aporte_arl_empleador": round(aporte_arl, 2),
            "retencion_renta": round(retencion_renta, 2),
            "total_deducciones": round(total_deduciones, 2),
            "salario_neto": round(salario_neto, 2),
            # Llamadas a los métodos estáticos
            "prima_servicios_provision": round(cls.calcular_prima_servicios(salario_base, dias_laborados, auxilio_transporte), 2),
            "cesantias_provision": round(cls.calcular_cesantias(salario_base, dias_laborados, auxilio_transporte), 2),
            "vacaciones_provision": round(cls.calcular_vacaciones(salario_base, dias_laborados), 2),
        }