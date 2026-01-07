# app/schemas/reporte_schema.py (VERSIÓN LIMPIA)
from pydantic import BaseModel
from typing import List, Dict, Optional

# --- 1. Definiciones de Subclases (OK) ---
class NominaResumenMensual(BaseModel):
    mes: int
    total_devengado: float
    # ... (resto de campos)

class DistribucionCosto(BaseModel):
    nombre_categoria: str 
    # ... (resto de campos)
    
# --- 2. Clase Principal (EstadisticasNomina) ---
class EstadisticasNomina(BaseModel):
    """Estructura completa para el dashboard de nómina."""
    
    # ... (Otros campos)
    
    # Referencia directa a las clases definidas arriba SIN importación
    resumen_mensual: List[NominaResumenMensual] 
    costo_por_departamento: List[DistribucionCosto] 
    # ... (resto de campos)
    
    class Config:
        from_attributes = True

