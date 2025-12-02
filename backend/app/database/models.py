from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.db import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    nombre = Column(String, nullable=True)
    es_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Empleado(Base):
    __tablename__ = "empleados"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True, nullable=False)
    apellido = Column(String, nullable=True)
    cedula = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    telefono = Column(String, nullable=True)
    departamento = Column(String, nullable=True)
    cargo = Column(String, nullable=True)
    salario_base = Column(Float, nullable=False, default=0.0)
    fecha_ingreso = Column(Date, nullable=True)
    activo = Column(Boolean, default=True)
    eps = Column(String, nullable=True)
    afp = Column(String, nullable=True)
    arl = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    ausencias = relationship("Ausencia", back_populates="empleado", cascade="all, delete-orphan")
    nominas = relationship("Nomina", back_populates="empleado", cascade="all, delete-orphan")

class Nomina(Base):
    __tablename__ = "nominas"
    id = Column(Integer, primary_key=True, index=True)
    empleado_id = Column(Integer, ForeignKey("empleados.id"), nullable=False)
    periodo_mes = Column(Integer, nullable=False)
    periodo_año = Column(Integer, nullable=False)
    salario_base = Column(Float, nullable=False)
    horas_trabajadas = Column(Float, default=0)
    horas_extra = Column(Float, default=0)
    valor_horas_extra = Column(Float, default=0)
    aporte_eps = Column(Float, default=0)
    aporte_afp = Column(Float, default=0)
    aporte_arl = Column(Float, default=0)
    retencion_renta = Column(Float, default=0)
    total_deduciones = Column(Float, default=0)
    salario_neto = Column(Float, default=0)
    fecha_pago = Column(Date, nullable=True)
    estado = Column(String, default="borrador")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    empleado = relationship("Empleado", back_populates="nominas")

class Ausencia(Base):
    __tablename__ = "ausencias"
    id = Column(Integer, primary_key=True, index=True)
    empleado_id = Column(Integer, ForeignKey("empleados.id"), nullable=False)
    tipo = Column(String, nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)
    dias = Column(Integer, nullable=False)
    motivo = Column(String, nullable=True)
    estado = Column(String, default="pendiente")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    empleado = relationship("Empleado", back_populates="ausencias")

class DescuentoLey(Base):
    __tablename__ = "descuentos_ley"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    porcentaje = Column(Float, nullable=False)
    activo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)