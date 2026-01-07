# test_auth.py

from app.database.db import SessionLocal, Base, engine
from app.database.models import Usuario, RolUsuario 
from app.services.auth_service import AuthService
from app.schemas.user import UsuarioCreate 

# Crear tablas 
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Limpiar usuarios anteriores
    db.query(Usuario).delete()
    db.commit()

    # Preparar datos  
    test_usuario_data = UsuarioCreate(
        email='test_rbac@ejemplo.com',
        password='123456',
        nombre='Usuario RBAC Test'
    )

    # Crear usuario 
    print("\nAttempting to create user with PAYROLL_MGR role...")
    test_usuario = AuthService.crear_usuario(
        db=db,
        usuario=test_usuario_data,
        rol=RolUsuario.PAYROLL_MGR # 
    )

    print(f"✅ Usuario creado: {test_usuario.email}")
    print(f"ID: {test_usuario.id}")
    print(f"Rol asignado: {test_usuario.rol.value}") 
    print(f"Hash: {test_usuario.hashed_password[:30]}...")

    # Verificar contraseña 
    is_valid = AuthService.verificar_contraseña('123456', test_usuario.hashed_password)
    print(f"✅ Verificación de contraseña: {is_valid}")
    
    # PRUEBA DE GENERACIÓN DE TOKEN CON ROL
    test_token = AuthService.crear_token(
        user_id=test_usuario.id,
        email=test_usuario.email,
        rol=test_usuario.rol 
    )
    print(f"✅ Token creado con éxito. Inicia: {test_token[:30]}...")

    # PRUEBA DE LECTURA DEL ROL 
    payload = AuthService.obtener_payload_del_token(test_token)
    token_rol = payload.get("rol")
    print(f"✅ Rol leído desde el JWT: {token_rol}")
    
    if token_rol == RolUsuario.PAYROLL_MGR.value:
        print("🎉 Test de seguridad (RBAC) pasado: El rol fue correctamente incluido en el token.")
    else:
        print("❌ Test de seguridad fallido: El rol no coincide en el token.")

except Exception as e:
    print(f"\n❌ Fallo en la prueba de AuthService: {e}")
    db.rollback()

finally:
    db.close()