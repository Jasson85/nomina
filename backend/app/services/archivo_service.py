from sqlalchemy.orm import Session
from app.database.models import ArchivoEmpleado, RegistroObservaciones, Empleado, Usuario
from app.schemas.archivo_schema import ArchivoEmpleadoCreate, RegistroObservacionesCreate
from typing import List, Optional
import os
import shutil
from datetime import datetime

class ArchivoService:
    """Servicio para manejar archivos de empleados."""
    
    DIRECTORIO_ARCHIVOS = "backend/uploaded_files"
    
    @staticmethod
    def crear_directorio_empleado(empleado_id: int):
        """Crea directorio para archivos del empleado."""
        directorio = f"{ArchivoService.DIRECTORIO_ARCHIVOS}/empleado_{empleado_id}"
        os.makedirs(directorio, exist_ok=True)
        return directorio
    
    @staticmethod
    def guardar_archivo(db: Session, empleado_id: int, archivo_contenido: bytes, 
                       nombre_archivo: str, tipo: str) -> ArchivoEmpleado:
        """Guarda un archivo asociado a un empleado."""
        
        # Crear directorio
        directorio = ArchivoService.crear_directorio_empleado(empleado_id)
        
        # Generar nombre único
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        nombre_archivo_unico = f"{timestamp}_{nombre_archivo}"
        ruta_completa = f"{directorio}/{nombre_archivo_unico}"
        
        # Guardar archivo
        with open(ruta_completa, 'wb') as f:
            f.write(archivo_contenido)
        
        # Registrar en BD
        archivo = ArchivoEmpleado(
            empleado_id=empleado_id,
            tipo=tipo,
            nombre_archivo=nombre_archivo,
            ruta_archivo=ruta_completa,
            tamaño_bytes=len(archivo_contenido)
        )
        
        db.add(archivo)
        db.commit()
        db.refresh(archivo)
        return archivo
    
    @staticmethod
    def obtener_archivos_empleado(db: Session, empleado_id: int, tipo: Optional[str] = None) -> List[ArchivoEmpleado]:
        """Obtiene todos los archivos de un empleado."""
        query = db.query(ArchivoEmpleado).filter(ArchivoEmpleado.empleado_id == empleado_id)
        
        if tipo:
            query = query.filter(ArchivoEmpleado.tipo == tipo)
        
        return query.order_by(ArchivoEmpleado.fecha_carga.desc()).all()
    
    @staticmethod
    def eliminar_archivo(db: Session, archivo_id: int) -> bool:
        """Elimina un archivo."""
        archivo = db.query(ArchivoEmpleado).filter(ArchivoEmpleado.id == archivo_id).first()
        
        if not archivo:
            return False
        
        # Eliminar archivo físico
        if os.path.exists(archivo.ruta_archivo):
            try:
                os.remove(archivo.ruta_archivo)
            except:
                pass
        
        # Eliminar registro de BD
        db.delete(archivo)
        db.commit()
        return True


class ObservacionService:
    """Servicio para manejar observaciones de empleados con auditoría."""
    
    @staticmethod
    def registrar_observacion(db: Session, empleado_id: int, 
                             observacion_nueva: str, 
                             modificado_por_id: int,
                             motivo_cambio: Optional[str] = None) -> RegistroObservaciones:
        """Registra un cambio en las observaciones con auditoría."""
        
        # Obtener observación anterior
        empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
        observacion_anterior = empleado.observaciones if empleado else None
        
        # Crear registro de auditoría
        registro = RegistroObservaciones(
            empleado_id=empleado_id,
            observacion_anterior=observacion_anterior,
            observacion_nueva=observacion_nueva,
            modificado_por_id=modificado_por_id,
            motivo_cambio=motivo_cambio
        )
        
        # Actualizar observación en empleado
        if empleado:
            empleado.observaciones = observacion_nueva
        
        db.add(registro)
        db.commit()
        db.refresh(registro)
        return registro
    
    @staticmethod
    def obtener_historial_observaciones(db: Session, empleado_id: int) -> List[RegistroObservaciones]:
        """Obtiene el historial de cambios en observaciones."""
        return db.query(RegistroObservaciones)\
            .filter(RegistroObservaciones.empleado_id == empleado_id)\
            .order_by(RegistroObservaciones.fecha_modificacion.desc())\
            .all()
