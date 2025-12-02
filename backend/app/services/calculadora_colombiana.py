from datetime import date

class CalculadoraNomina:
    APORTE_EPS = 0.04
    APORTE_AFP = 0.04
    APORTE_ARL = 0.00522
    UVT_2025 = 44.97

    @staticmethod
    def calcular_valor_hora(salario_base: float) -> float:
        horas_mes = 240
        return salario_base / horas_mes if horas_mes else 0.0

    @staticmethod
    def calcular_horas_extra(valor_hora: float, horas_extra: float, es_festivo: bool = False) -> float:
        if horas_extra <= 0:
            return 0.0
        if es_festivo:
            factor = 2.0
        else:
            factor = 1.25
        return valor_hora * horas_extra * factor

    @staticmethod
    def calcular_aporte_eps(salario: float) -> float:
        return salario * CalculadoraNomina.APORTE_EPS

    @staticmethod
    def calcular_aporte_afp(salario: float) -> float:
        return salario * CalculadoraNomina.APORTE_AFP

    @staticmethod
    def calcular_aporte_arl(salario: float, porcentaje_arl: float = None) -> float:
        pct = porcentaje_arl if porcentaje_arl is not None else CalculadoraNomina.APORTE_ARL
        return salario * pct

    @staticmethod
    def calcular_retencion_renta(salario_neto: float) -> float:
        UVT = CalculadoraNomina.UVT_2025
        limite_exento = 3 * UVT
        if salario_neto > limite_exento:
            return salario_neto * 0.05
        return 0.0

    @staticmethod
    def calcular_prima_servicios(salario_base: float, dias_trabajados: int = 15) -> float:
        return (salario_base / 30) * dias_trabajados * 0.0833

    @staticmethod
    def calcular_cesantias(salario_base: float, dias_trabajados: int = 30) -> float:
        return (salario_base / 30) * dias_trabajados * 0.12

    @staticmethod
    def calcular_vacaciones(salario_base: float, dias_trabajados: int = 15) -> float:
        return (salario_base / 30) * dias_trabajados * 0.0417

    @classmethod
    def calcular_nomina_completa(cls, salario_base: float, horas_extra: float = 0, porcentaje_arl: float = None) -> dict:
        valor_hora = cls.calcular_valor_hora(salario_base)
        valor_horas_extra = cls.calcular_horas_extra(valor_hora, horas_extra)
        total_ingresos = salario_base + valor_horas_extra

        eps = cls.calcular_aporte_eps(total_ingresos)
        afp = cls.calcular_aporte_afp(total_ingresos)
        arl = cls.calcular_aporte_arl(total_ingresos, porcentaje_arl)
        renta = cls.calcular_retencion_renta(total_ingresos)

        total_deduciones = eps + afp + arl + renta
        salario_neto = total_ingresos - total_deduciones

        return {
            "salario_base": salario_base,
            "horas_extra": horas_extra,
            "valor_horas_extra": valor_horas_extra,
            "total_ingresos": total_ingresos,
            "aporte_eps": round(eps, 2),
            "aporte_afp": round(afp, 2),
            "aporte_arl": round(arl, 2),
            "retencion_renta": round(renta, 2),
            "total_deduciones": round(total_deduciones, 2),
            "salario_neto": round(salario_neto, 2),
            "prima_servicios": round(cls.calcular_prima_servicios(salario_base), 2),
            "cesantias": round(cls.calcular_cesantias(salario_base), 2),
            "vacaciones": round(cls.calcular_vacaciones(salario_base), 2)
        }