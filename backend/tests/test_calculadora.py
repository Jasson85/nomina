import pytest
from app.services.calculadora_colombiana import CalculadoraNomina

def test_calculo_nomina_basico():
    resultado = CalculadoraNomina.calcular_nomina_completa(1000000, horas_extra=10)
    assert "salario_neto" in resultado
    assert resultado["salario_base"] == 1000000