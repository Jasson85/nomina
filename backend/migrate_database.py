from sqlalchemy import create_engine, text
from app.config import settings
from app.database.db import Base
from app.database.models import Empleado, Usuario, Nomina, Ausencia, ConfiguracionSistema
import sys

def migrar_base_datos():
    print("🔄 Iniciando migración de base de datos...")
    
    try:
        # Crear engine
        engine = create_engine(settings.DATABASE_URL)
        
        print("Verificando conexión a la base de datos...")
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Conexión exitosa")
        
        # Crear todas las tablas
        print("Creando/actualizando tablas...")
        Base.metadata.create_all(bind=engine)
        print("✅ Tablas creadas/actualizadas correctamente")
        
        # Verificar tablas creadas
        print("\n Tablas en la base de datos:")
        with engine.connect() as conn:
            if 'postgresql' in settings.DATABASE_URL:
                result = conn.execute(text("""
                    SELECT tablename FROM pg_tables 
                    WHERE schemaname = 'public'
                    ORDER BY tablename
                """))
            else:
                result = conn.execute(text("""
                    SELECT name FROM sqlite_master 
                    WHERE type='table'
                    ORDER BY name
                """))
            
            for row in result:
                print(f"  ✓ {row[0]}")
        
        print("\n Migración completada exitosamente!")
        print("\n Próximos pasos:")
        print("  1. Iniciar el servidor: python -m app.main")
        print("  2. Ir a http://localhost:8000/docs para ver la API")
        print("  3. Importar empleados desde el Excel")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error durante la migración: {str(e)}")
        print(f"   Tipo de error: {type(e).__name__}")
        return False

if __name__ == "__main__":
    exito = migrar_base_datos()
    sys.exit(0 if exito else 1)