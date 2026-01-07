
from http.client import HTTPException
from sqlalchemy.orm import Session
from app.database.models import Empleado
from app.schemas.empleado_schema import EmpleadoCreate, EmpleadoUpdate 
from typing import Optional, List
import pandas as pd
import io

class EmpleadoService:
    @staticmethod
    def crear_empleado(db: Session, empleado: EmpleadoCreate) -> Empleado:        
        db_empleado = Empleado(**empleado.model_dump()) 
        db.add(db_empleado)
        db.commit()
        db.refresh(db_empleado)
        return db_empleado

    @staticmethod
    def obtener_empleado(db: Session, empleado_id: int) -> Empleado | None:
        return db.query(Empleado).filter(Empleado.id == empleado_id).first()
    
    @staticmethod
    def obtener_empleado_por_documento(db: Session, numero_documento: str) -> Empleado | None:
        """Busca un empleado por su número de documento."""
        return db.query(Empleado).filter(Empleado.numero_documento == numero_documento).first()

    @staticmethod
    def obtener_todos_empleados(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Empleado).offset(skip).limit(limit).all()

    @staticmethod
    def actualizar_empleado(db: Session, empleado_id: int, empleado_update: EmpleadoUpdate):
        db_empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
        if not db_empleado:
            return None
        
        data = empleado_update.model_dump(exclude_unset=True) 
        for k, v in data.items():
            setattr(db_empleado, k, v)
        
        # Lógica de estado y activo
        if 'estado' in data:
            db_empleado.activo = db_empleado.estado == "Activo"
            
        db.commit()
        db.refresh(db_empleado)
        return db_empleado

    @staticmethod
    def eliminar_empleado(db: Session, empleado_id: int):
        """Marca un empleado como inactivo (práctica recomendada en HR/Nómina)."""
        db_empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
        if db_empleado:
            db_empleado.activo = False
            db_empleado.estado = "Retirado"
            db.commit()
            db.refresh(db_empleado)
        return db_empleado
    
    @staticmethod
    def eliminar_empleado(db: Session, empleado_id: int):
        db_empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
        if db_empleado:
            db_empleado.activo = False
            db_empleado.estado = "Retirado"
            db.commit()
            db_empleado.refresh(db_empleado)
        return db_empleado
    
    @staticmethod
    def importar_desde_archivo(db: Session, contenido_archivo: bytes):
        try:           
            try:
                df = pd.read_excel(io.BytesIO(contenido_archivo))
            except Exception:               
                df = pd.read_csv(io.BytesIO(contenido_archivo), encoding='latin1', sep=None, engine='python')
            
            stats = {"creados": 0, "actualizados": 0}

            for _, row in df.iterrows():                
                cedula_raw = row.get('Cedula Numero') or row.get('Documento')
                cedula = str(cedula_raw).strip().split('.')[0] if pd.notnull(cedula_raw) else None
                
                if not cedula or cedula == 'nan' or cedula == '':
                    continue
              
                empleado = db.query(Empleado).filter(Empleado.numero_documento == cedula).first()
               
                datos_mapeo = {
                    "numero_documento": cedula,
                    "salario_base": float(row.get('Sueldo Base', 0)) if pd.notnull(row.get('Sueldo Base')) else 0,
                    "cargo": str(row.get('DESRIPCION.6', row.get('DESRIPCION', ''))),
                    "eps_nombre": str(row.get('DESRIPCION.3', '')),
                    "afp_nombre": str(row.get('DESRIPCION.4', '')),
                    "arl_nombre": str(row.get('DESRIPCION.5', '')),
                    "departamento_empresa": str(row.get('DESRIPCION.1', '')),
                    "email": str(row.get('Correo Electronico', '')),
                    "telefono_celular": str(row.get('Telefono(S)', '')),
                    
                    "observaciones": f"{row.get('Criterio', '')} - {row.get('Descripcion', '')}".strip(" -"),
                    "activo": True,
                    "estado": "Activo"
                }

                # Nombres y Apellidos
                nombre_completo_raw = row.get('Apellidos y Nombres')
                if pd.notnull(nombre_completo_raw):
                    partes = str(nombre_completo_raw).split()
                    if len(partes) >= 2:
                        datos_mapeo["primer_apellido"] = partes[0]
                        datos_mapeo["primer_nombre"] = " ".join(partes[1:])

                if empleado:
                    # Actualizar campos empleado existente
                    for key, value in datos_mapeo.items():
                        setattr(empleado, key, value)
                    stats["actualizados"] += 1
                else:
                    # Crear nuevo registro
                    nuevo_empleado = Empleado(**datos_mapeo)
                    db.add(nuevo_empleado)
                    stats["creados"] += 1

            db.commit()
            return stats

        except Exception as e:
            db.rollback()
            print(f"Error detallado en importación: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Error al procesar el archivo: {str(e)}")