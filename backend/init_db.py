"""
Script para inicializar la base de datos con datos de ejemplo
Ejecutar: python init_db.py
"""

# 🔑 IMPORTACIÓN CRÍTICA: Importar el Enum RolUsuario
from app.database.db import Base, engine, SessionLocal
from app.database.models import Usuario, Empleado, Nomina, Ausencia, DescuentoLey, RolUsuario # <-- Importar RolUsuario
from app.services.auth_service import AuthService # <-- Mantenemos la referencia a tu servicio original
from datetime import date, datetime

def init_database():

    print("🗑️ Eliminando todas las tablas (¡Solo en desarrollo!)...")
    Base.metadata.drop_all(bind=engine)
    
    print("🚀 Iniciando creación de tablas...")
    
    # Crear todas las tablas
    # Nota: Alembic ya creó las tablas, pero esto sirve para un entorno de desarrollo nuevo.
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas creadas exitosamente")
    
    # Crear sesión
    db = SessionLocal()
    
    try:
        # 1. Crear usuario administrador (ROL: ADMIN)
        print("\n👤 Creando usuario administrador...")
        admin_exists = db.query(Usuario).filter(Usuario.email == "admin@nomina.co").first()
        
        if not admin_exists:
            hashed_password = AuthService.hash_password("admin123")
            admin = Usuario(
                email="admin@nomina.co",
                hashed_password=hashed_password,
                nombre="Administrador",
                es_admin=True,
                rol=RolUsuario.ADMIN # 👈 Asignar el Rol de Administrador
            )
            db.add(admin)
            db.commit()
            print(f"✅ Usuario admin (ADMIN) creado: admin@nomina.co / admin123")
        elif admin_exists.rol != RolUsuario.ADMIN:
             admin_exists.rol = RolUsuario.ADMIN
             db.commit()
             print("ℹ️  Rol de Admin actualizado")
        else:
            print("ℹ️  Usuario admin ya existe")
        
        # 2. Crear usuario Gerente de Nómina (ROL: PAYROLL_MGR)
        print("\n💰 Creando usuario Gerente de Nómina...")
        mgr_exists = db.query(Usuario).filter(Usuario.email == "manager@nomina.co").first()
        
        if not mgr_exists:
            hashed_password = AuthService.hash_password("manager123")
            manager_user = Usuario(
                email="manager@nomina.co",
                hashed_password=hashed_password,
                nombre="Gerente de Nómina",
                es_admin=False, 
                rol=RolUsuario.PAYROLL_MGR # 👈 Asignar el Rol de Gerente
            )
            db.add(manager_user)
            db.commit()
            print(f"✅ Usuario Manager (PAYROLL_MGR) creado: manager@nomina.co / manager123")
        elif mgr_exists.rol != RolUsuario.PAYROLL_MGR:
             mgr_exists.rol = RolUsuario.PAYROLL_MGR
             db.commit()
             print("ℹ️  Rol de Manager actualizado")
        else:
             print("ℹ️  Usuario Manager ya existe")
             
        # Crear usuario EMPLEADO de prueba (ROL: EMPLEADO)
        test_exists = db.query(Usuario).filter(Usuario.email == "test@ejemplo.com").first()
        
        if not test_exists:
            hashed_password = AuthService.hash_password("123456")
            test_user = Usuario(
                email="test@ejemplo.com",
                hashed_password=hashed_password,
                nombre="Usuario Test Empleado",
                es_admin=False,
                rol=RolUsuario.EMPLEADO # 👈 Asignar el Rol de Empleado
            )
            db.add(test_user)
            db.commit()
            print(f"✅ Usuario test (EMPLEADO) creado: test@ejemplo.com / 123456")
        elif test_exists.rol != RolUsuario.EMPLEADO:
             test_exists.rol = RolUsuario.EMPLEADO
             db.commit()
             print("ℹ️  Rol de Test (Empleado) actualizado")
        else:
             print("ℹ️  Usuario test ya existe")

        # 3. Crear empleados de ejemplo
        # ... (El resto del código de creación de empleados se mantiene igual)
        
        # ... (Código que crea empleados) ...
        
        # 4. Crear descuentos de ley
        # ... (Código que crea descuentos) ...

        print("\n" + "="*50)
        print("✅ Base de datos inicializada correctamente!")
        print("="*50)
        print("\n📝 Credenciales de acceso (con Roles):")
        print("   Admin: admin@nomina.co / admin123 (Rol ADMIN)")
        print("   Manager: manager@nomina.co / manager123 (Rol PAYROLL_MGR)")
        print("   Empleado: test@ejemplo.com / 123456 (Rol EMPLEADO)")
        
    except Exception as e:
        print(f"\n❌ Error durante la inicialización: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    init_database()