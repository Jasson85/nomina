import pytest
from app.services.calculadora_colombiana import CalculadoraNomina
from typing import Dict, Any


# --- PRUEBAS BÁSICAS DE ESTRUCTURA Y SALARIO ---

def test_calculo_nomina_basico():
    """Verifica que la función retorne la estructura mínima y el salario base."""
    # Salario Base de $1'000.000 (Trabajó 30 días, no tiene auxilio)
    resultado = CalculadoraNomina.calcular_nomina_completa(1000000, dias_trabajados=30)
    assert isinstance(resultado, Dict)
    assert "salario_neto" in resultado
    assert "aporte_eps_empleado" in resultado
    assert resultado["salario_base"] == 1000000.00
    assert resultado["dias_trabajados"] == 30

# --- PRUEBAS DE SALARIO DEVENGADO Y DÍAS TRABAJADOS ---

@pytest.mark.parametrize("salario, dias_trabajados, expected_devengado", [
    (3000000, 30, 3000000.00),  # Mes completo
    (3000000, 15, 1500000.00),  # Quincena
    (1500000, 5, 250000.00),    # 5 días
])
def test_salario_devengado_proporcional(salario, dias_trabajados, expected_devengado):
    """Verifica el cálculo proporcional del salario devengado."""
    resultado = CalculadoraNomina.calcular_nomina_completa(salario, dias_trabajados=dias_trabajados)
    assert resultado["salario_devengado"] == expected_devengado

# --- PRUEBAS DEL AUXILIO DE TRANSPORTE (AT) ---

# (Asumiendo SMMLV = 1'300.000, 2 SMMLV = 2'600.000, AT Mensual = 162.000, AT Diario = 5.400)
AT_DIARIO = 5400.0 # 162000 / 30

@pytest.mark.parametrize("salario, dias_trabajados, expected_at", [
    # Gana < 2 SMMLV y trabajó mes completo
    (1500000, 30, 162000.00),
    # Gana < 2 SMMLV y trabajó 15 días (15 * 5400)
    (1500000, 15, 81000.00), 
    # Gana > 2 SMMLV (2'600.000) -> NO recibe auxilio
    (3000000, 30, 0.00),
    # Gana exactamente 2 SMMLV -> NO recibe auxilio
    (2600000, 30, 0.00),
    # Trabajó 0 días (aunque tenga derecho) -> NO recibe auxilio
    (1500000, 0, 0.00), 
])
def test_auxilio_transporte(salario, dias_trabajados, expected_at):
    """Verifica que el Auxilio de Transporte se pague solo si el salario es < 2 SMMLV y se prorratee."""
    resultado = CalculadoraNomina.calcular_nomina_completa(salario, dias_trabajados=dias_trabajados)
    # Redondeamos para evitar errores de coma flotante
    assert round(resultado["auxilio_transporte"], 2) == round(expected_at, 2)


# --- PRUEBAS DE DEDUCCIONES (4% EPS y 4% AFP) ---

@pytest.mark.parametrize("salario, dias_trabajados, expected_eps, expected_afp", [
    # Caso 1: Salario devengado = 3'000.000 (Base = 3'000.000)
    (3000000, 30, 120000.00, 120000.00),
    # Caso 2: Salario devengado = 1'500.000 (Base = 1'500.000)
    (1500000, 30, 60000.00, 60000.00),
    # Caso 3: Salario devengado = 1'500.000 (15 días trabajados, Base = 750.000)
    # Base debe ser el salario devengado (750.000)
    (1500000, 15, 30000.00, 30000.00), # 750.000 * 0.04
])
def test_deducciones_seguridad_social(salario, dias_trabajados, expected_eps, expected_afp):
    """Verifica que los aportes a EPS y AFP (4% c/u) se calculen sobre el Salario Devengado (BASS)."""
    resultado = CalculadoraNomina.calcular_nomina_completa(salario, dias_trabajados=dias_trabajados)
    
    # Verificación de la BASS (Base de Aportes de Seguridad Social)
    salario_diario = salario / 30
    expected_bass = salario_diario * dias_trabajados
    assert round(resultado["base_salud_pension"], 2) == round(expected_bass, 2)
    
    # Verificación de los aportes (4% de la BASS)
    assert round(resultado["aporte_eps_empleado"], 2) == round(expected_eps, 2)
    assert round(resultado["aporte_afp_empleado"], 2) == round(expected_afp, 2)