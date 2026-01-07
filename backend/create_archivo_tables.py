#!/usr/bin/env python3
"""
Script para crear las nuevas tablas: archivos_empleados y registro_observaciones
"""
import sys
from sqlalchemy import text
from app.database.db import engine

def migrate():
    """Crea las nuevas tablas si no existen."""
    try:
        with engine.connect() as conn:
            # Crear tabla archivos_empleados
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS archivos_empleados (
                    id SERIAL PRIMARY KEY,
                    empleado_id INTEGER NOT NULL REFERENCES empleados(id),
                    tipo VARCHAR(50) NOT NULL,
                    nombre_archivo VARCHAR(255) NOT NULL,
                    ruta_archivo VARCHAR(500) NOT NULL,
                    tamaño_bytes INTEGER,
                    fecha_carga TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_empleado_id (empleado_id)
                )
            """))
            print("✓ Tabla 'archivos_empleados' creada/verificada")
            
            # Crear tabla registro_observaciones
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS registro_observaciones (
                    id SERIAL PRIMARY KEY,
                    empleado_id INTEGER NOT NULL REFERENCES empleados(id),
                    observacion_anterior TEXT,
                    observacion_nueva TEXT NOT NULL,
                    modificado_por_id INTEGER REFERENCES usuarios(id),
                    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    motivo_cambio VARCHAR(255),
                    INDEX idx_empleado_id (empleado_id)
                )
            """))
            print("✓ Tabla 'registro_observaciones' creada/verificada")
            
            conn.commit()
            print("✓ Migraciones completadas exitosamente")
            
    except Exception as e:
        print(f"✗ Error durante la migración: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    migrate()
