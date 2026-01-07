# app/services/configuracion_service.py

from sqlalchemy.orm import Session
from app.database.models import ConfiguracionSistema
from app.schemas.nomina_schema import ConfiguracionLegal 
from typing import Dict, Any, List

class ConfiguracionService:
    """Servicio para manejar la obtención de parámetros legales y del sistema."""

    @staticmethod
    def obtener_configuracion_global(db: Session) -> Dict[str, Any]:
        """Obtiene valores críticos de configuración del sistema (SMMLV, Auxilio, UVT) desde la DB."""        
        
        config_base = {
            "SMMLV": 1300000.00,
            "AUXILIO_TRANSPORTE": 162000.00,
            "UVT_ACTUAL": 47065.0,  
            "HORAS_MES": 240.0,            
            "EPS_EMPLEADO": 0.04,
            "AFP_EMPLEADO": 0.04,
            "ARL_MINIMO": 0.00522,
            
        }
        
        records: List[ConfiguracionSistema] = db.query(ConfiguracionSistema).all()
        
        for record in records:
            try:
                config_base[record.clave] = float(record.valor)
            except (ValueError, TypeError):                
                config_base[record.clave] = record.valor
                
        return config_base

    @staticmethod
    def obtener_configuracion_legal(db: Session) -> ConfiguracionLegal:
        """
        Obtiene los valores de ley y los mapea al esquema ConfiguracionLegal
        para ser consumidos por el servicio de nómina.
        """
        config_dict = ConfiguracionService.obtener_configuracion_global(db)        
        
        return ConfiguracionLegal(
            salario_minimo=config_dict.get("SMMLV", 1300000.00),
            auxilio_transporte_legal=config_dict.get("AUXILIO_TRANSPORTE", 162000.00),            
            
            eps_empleado_porcentaje=config_dict.get("EPS_EMPLEADO", 0.04),
            afp_empleado_porcentaje=config_dict.get("AFP_EMPLEADO", 0.04),
            # porcentajes son constantes en el esquema Configuracion Legal 
            
        )
