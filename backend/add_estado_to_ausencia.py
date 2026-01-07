#!/usr/bin/env python3
"""
Script para agregar la columna 'estado' a la tabla 'ausencias'
"""
import sys
from sqlalchemy import text
from app.database.db import engine

def migrate():
    """Agrega la columna estado a la tabla ausencias si no existe."""
    try:
        with engine.connect() as conn:
            # Verificar si la columna ya existe
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='ausencias' AND column_name='estado'
            """))
            
            if result.fetchone():
                print("✓ Columna 'estado' ya existe en la tabla 'ausencias'")
            else:
                # Agregar la columna
                conn.execute(text("""
                    ALTER TABLE ausencias 
                    ADD COLUMN estado VARCHAR(50) DEFAULT 'pendiente' NOT NULL
                """))
                conn.commit()
                print("✓ Columna 'estado' agregada correctamente a la tabla 'ausencias'")
    except Exception as e:
        print(f"✗ Error durante la migración: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    migrate()
