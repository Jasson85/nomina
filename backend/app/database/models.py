from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Date, Text, Enum, func
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime
import enum
from app.database.db import Base

# --- ENUMERACIONES ---
class TipoDocumento(str, enum.Enum):
    CC = "CC"
    CE = "CE"
    PASAPORTE = "Pasaporte"
    TI = "TI"
    PEP = "PEP"
    PPT = "PPT"

class TipoContrato(str, enum.Enum):
    INDEFINIDO = "Indefinido"
    FIJO = "Fijo"
    OBRA_LABOR = "Obra o Labor"
    APRENDIZAJE = "Aprendizaje"
    TEMPORAL = "Temporal"
    PRESTACION_SERVICIOS = "Prestación de Servicios"

class EstadoEmpleado(str, enum.Enum):
    ACTIVO = "Activo"
    INACTIVO = "Inactivo"
    SUSPENDIDO = "Suspension"
    RETIRADO = "Retirado"

class NivelRiesgoARL(str, enum.Enum):
    I = "I"
    II = "II"
    III = "III"
    IV = "IV"
    V = "V"

class RolUsuario(str, enum.Enum):
    ADMIN = "ADMIN"
    PAYROLL_MGR = "PAYROLL_MGR"  
    SUPERVISOR = "SUPERVISOR"   
    EMPLEADO = "EMPLEADO"     

class EstadoNomina(str, enum.Enum):
    BORRADOR = "Borrador"
    GENERADA = "Generada"
    EN_REVISION = "En Revisión"
    APROBADA = "Aprobada"
    PAGADA = "Pagada"
    CERRADA = "Cerrada"

# --- MODELOS DE TABLAS ---

class Usuario(Base):
    __tablename__ = "usuarios"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    nombre = Column(String(255), nullable=True)    
    rol = Column(Enum(RolUsuario), default=RolUsuario.EMPLEADO, nullable=False)
    es_admin = Column(Boolean, default=False) 
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relaciones
    nominas_creadas = relationship("Nomina", back_populates="creador", foreign_keys="[Nomina.creado_por_id]")
    nominas_aprobadas = relationship("Nomina", back_populates="aprobador", foreign_keys="[Nomina.aprobado_por_id]")
    auditorias = relationship("NovedadAudit", back_populates="usuario") 

class Empleado(Base):
    __tablename__ = "empleados"
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True, index=True)
    codigo_empleado = Column(String(50), unique=True, index=True, nullable=True)
    
    # Información Personal
    primer_nombre = Column(String(100), nullable=False, index=True)
    segundo_nombre = Column(String(100), nullable=True)
    primer_apellido = Column(String(100), nullable=False, index=True)
    segundo_apellido = Column(String(100), nullable=True)
    
    tipo_documento = Column(String(20), nullable=False, default="CC")
    numero_documento = Column(String(50), unique=True, nullable=False, index=True)
    lugar_expedicion = Column(String(100), nullable=True)
    fecha_expedicion = Column(Date, nullable=True)
    
    fecha_nacimiento = Column(Date, nullable=True)
    lugar_nacimiento = Column(String(200), nullable=True)
    sexo = Column(String(10), nullable=True)
    estado_civil = Column(String(50), nullable=True)
    rh = Column(String(10), nullable=True)
    
    # Ubicación y Contacto
    direccion_residencia = Column(String(255), nullable=True)
    ciudad = Column(String(100), nullable=True)
    departamento = Column(String(100), nullable=True)
    codigo_postal = Column(String(20), nullable=True)
    telefono_fijo = Column(String(50), nullable=True)
    telefono_celular = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True, index=True)
    email_corporativo = Column(String(255), nullable=True)
    
    contacto_emergencia_nombre = Column(String(255), nullable=True)
    contacto_emergencia_parentesco = Column(String(100), nullable=True)
    contacto_emergencia_telefono = Column(String(50), nullable=True)
    
    # Información Laboral
    fecha_ingreso = Column(Date, nullable=True)
    fecha_terminacion = Column(Date, nullable=True)
    cargo = Column(String(200), nullable=True, index=True)
    departamento_empresa = Column(String(200), nullable=True, index=True)
    centro_costo = Column(String(100), nullable=True)
    jefe_inmediato = Column(String(255), nullable=True)
    tipo_contrato = Column(String(50), nullable=True, default="Indefinido")
    duracion_contrato = Column(Integer, nullable=True)
    fecha_fin_contrato = Column(Date, nullable=True)
    
    # Compensación
    tipo_salario = Column(String(50), nullable=True, default="Mensual")
    salario_base = Column(Float, nullable=False, default=0.0) # Sincronizado con Postgres (NOT NULL)
    tipo_jornada = Column(String(50), nullable=True, default="Ordinaria")
    horas_semanales = Column(Integer, nullable=True, default=48)
    horario_entrada = Column(String(20), nullable=True)
    horario_salida = Column(String(20), nullable=True)
    
    # Seguridad Social 
    eps_nombre = Column(String(200), nullable=True)
    eps_codigo = Column(String(50), nullable=True)
    afp_nombre = Column(String(200), nullable=True)
    afp_codigo = Column(String(50), nullable=True)
    arl_nombre = Column(String(200), nullable=True)
    arl_codigo = Column(String(50), nullable=True)
    nivel_riesgo_arl = Column(String(10), nullable=True, default="I")
    caja_compensacion = Column(String(200), nullable=True)
    codigo_caja_compensacion = Column(String(50), nullable=True)
    fondo_cesantias = Column(String(200), nullable=True)
    codigo_fondo_cesantias = Column(String(50), nullable=True)
    
    # Bancos y Educación
    banco = Column(String(200), nullable=True)
    tipo_cuenta = Column(String(50), nullable=True)
    numero_cuenta = Column(String(100), nullable=True)
    tiene_personas_a_cargo = Column(Boolean, default=False)
    numero_hijos = Column(Integer, nullable=True, default=0)
    nivel_educacion = Column(String(100), nullable=True)
    profesion = Column(String(200), nullable=True)
    titulo_obtenido = Column(String(255), nullable=True)
    tiene_libreta_militar = Column(Boolean, nullable=True)
    numero_libreta_militar = Column(String(50), nullable=True)
    discapacidad = Column(Boolean, default=False)
    tipo_discapacidad = Column(String(255), nullable=True)
    
    # Estado y Observaciones
    url_avatar = Column(String(255), nullable=True, default="/default-avatar.png")
    url_hoja_vida = Column(String(255), nullable=True, default=None)
    observaciones = Column(Text, nullable=True) # Tu campo clave
    activo = Column(Boolean, default=True, index=True)
    estado = Column(String(50), nullable=True, default="Activo")
    motivo_retiro = Column(Text, nullable=True)
    
    # Control Documental
    tiene_contrato_firmado = Column(Boolean, default=False)
    tiene_hoja_vida = Column(Boolean, default=False)
    tiene_examen_medico = Column(Boolean, default=False)
    tiene_afiliaciones = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    ausencias = relationship("Ausencia", back_populates="empleado", cascade="all, delete-orphan")
    nominas = relationship("Nomina", back_populates="empleado", cascade="all, delete-orphan")
    auditorias_novedades = relationship("NovedadAudit", back_populates="empleado")

    @property
    def nombre_completo(self):
        partes = [self.primer_nombre, self.segundo_nombre, self.primer_apellido, self.segundo_apellido]
        return " ".join(filter(None, partes))

class Nomina(Base):
    __tablename__ = "nominas"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    empleado_id = Column(Integer, ForeignKey("empleados.id"), nullable=False, index=True)
    periodo_mes = Column(Integer, nullable=False, index=True)
    periodo_anio = Column(Integer, nullable=False, index=True)
    
    salario_base = Column(Float, nullable=False)
    auxilio_transporte = Column(Float, default=0)
    total_devengado = Column(Float, default=0)
    total_deducciones = Column(Float, default=0)
    salario_neto = Column(Float, default=0)
    
    estado = Column(Enum(EstadoNomina), default=EstadoNomina.BORRADOR)
    creado_por_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    aprobado_por_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    empleado = relationship("Empleado", back_populates="nominas")
    creador = relationship("Usuario", foreign_keys=[creado_por_id], back_populates="nominas_creadas")
    aprobador = relationship("Usuario", foreign_keys=[aprobado_por_id], back_populates="nominas_aprobadas")

class NovedadAudit(Base):
    __tablename__ = "novedades_audit"
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True, index=True)    
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False) 
    timestamp = Column(DateTime, default=datetime.utcnow)
    empleado_id = Column(Integer, ForeignKey("empleados.id"), nullable=False)
    accion = Column(String(20), nullable=False)
    valor_anterior = Column(Text, nullable=True) 
    valor_nuevo = Column(Text, nullable=True)    
    
    usuario = relationship("Usuario", back_populates="auditorias")
    empleado = relationship("Empleado", back_populates="auditorias_novedades")

class Ausencia(Base):
    __tablename__ = "ausencias"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    empleado_id = Column(Integer, ForeignKey("empleados.id"), nullable=False)
    tipo = Column(String(100), nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)
    dias = Column(Integer, nullable=False)
    estado = Column(String(50), default="pendiente", nullable=False)
    empleado = relationship("Empleado", back_populates="ausencias")    

class ConfiguracionSistema(Base):
    __tablename__ = "configuracion_sistema"
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True, index=True)
    clave = Column(String(100), unique=True, nullable=False)
    valor = Column(Text, nullable=False)
    descripcion = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class DescuentoLey(Base):
    __tablename__ = "descuentos_ley"
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    porcentaje = Column(Float, nullable=False)
    activo = Column(Boolean, default=True)

class ArchivoEmpleado(Base):
    """Almacena los archivos (CV, documentos, etc.) de cada empleado."""
    __tablename__ = "archivos_empleados"
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True, index=True)
    empleado_id = Column(Integer, ForeignKey("empleados.id"), nullable=False, index=True)
    tipo = Column(String(50), nullable=False)  # cv, cedula, contrato, etc
    nombre_archivo = Column(String(255), nullable=False)
    ruta_archivo = Column(String(500), nullable=False)
    tamaño_bytes = Column(Integer, nullable=True)
    fecha_carga = Column(DateTime, default=datetime.utcnow)
    
    empleado = relationship("Empleado", backref="archivos")

class RegistroObservaciones(Base):
    """Registro de auditoría para observaciones de empleados."""
    __tablename__ = "registro_observaciones"
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True, index=True)
    empleado_id = Column(Integer, ForeignKey("empleados.id"), nullable=False, index=True)
    observacion_anterior = Column(Text, nullable=True)
    observacion_nueva = Column(Text, nullable=False)
    modificado_por_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True)
    fecha_modificacion = Column(DateTime, default=datetime.utcnow)
    motivo_cambio = Column(String(255), nullable=True)
    
    empleado = relationship("Empleado", backref="historial_observaciones")
    usuario = relationship("Usuario")