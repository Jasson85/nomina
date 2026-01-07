
import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# ==================================================
# 🔑 PASOS CRÍTICOS: Importar Modelos y Cargar .env
# ==================================================

from dotenv import load_dotenv

# Añadir la ruta superior al path para importar módulos de 'app'
sys.path.insert(0, os.path.abspath("..")) 

# Carga las variables de entorno (incluyendo DATABASE_URL)
load_dotenv() 

# Importa el objeto Base de SQLAlchemy y todos tus modelos
# from app.database.db import Base 
# import app.database.models # Asegúrate de que este archivo contiene todos tus modelos ORM

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ----------------------------------------------------
# 🔑 ASIGNAR TARGET_METADATA: Le dice a Alembic qué modelos revisar
# ----------------------------------------------------
# target_metadata = Base.metadata

target_metadata = None # Restaurar a None temporalmente


def get_url():
    """Obtiene la URL de la base de datos desde el archivo .env."""
    # Retorna la variable DATABASE_URL del .env. 
    # Asegúrate de que el formato 'postgresql+psycopg2://...' es compatible con Alembic
    return os.environ.get("DATABASE_URL")


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    # Usa la función get_url() para obtener la cadena de conexión
    url = get_url() 
    
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    from app.database.db import Base
    import app.database.models
    global target_metadata
    target_metadata = Base.metadata 

if 'app.database.models' in sys.modules:
    # Esto elimina las tablas definidas por la carga temprana
    del sys.modules['app.database.models'] 
    
    # Importamos modelos y Base. Esto fuerza a Python a cargarlos de nuevo,
    # pero ahora la carga es controlada por Alembic.
    from app.database.db import Base
    import app.database.models    

    configuration = config.get_section(config.config_ini_section, {})
    
    # 🔑 INYECTAR LA URL EN LA CONFIGURACIÓN DE SQLAlchemy
    configuration["sqlalchemy.url"] = get_url()
    
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()