from app.database.db import SessionLocal, Base, engine
from app.database.models import Usuario
from app.services.auth_service import AuthService

# Crear tablas
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Limpiar usuarios anteriores
db.query(Usuario).delete()
db.commit()

# Crear usuario de prueba
test_usuario = AuthService.crear_usuario(
    db,
    type('obj', (object,), {
        'email': 'test@ejemplo.com',
        'password': '123456',
        'nombre': 'Usuario Test'
    })
)

print(f"✅ Usuario creado: {test_usuario.email}")
print(f"ID: {test_usuario.id}")
print(f"Hash: {test_usuario.hashed_password[:50]}...")

# Verificar contraseña
is_valid = AuthService.verificar_contraseña('123456', test_usuario.hashed_password)
print(f"✅ Verificación de contraseña: {is_valid}")

db.close()