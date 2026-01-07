# 🏗️ RECOMENDACIONES DE ARQUITECTURA Y LIMPIEZA

**Fecha:** Enero 6, 2025  
**Para:** Profesionalización del código  
**Objetivo:** Mantener código limpio y escalable

---

## 📂 ESTRUCTURA PROPUESTA (Post-Refactorización)

### Backend

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    ← Punto de entrada
│   ├── config.py                  ← Settings (MANTENER)
│   │
│   ├── database/
│   │   ├── __init__.py
│   │   ├── db.py                  ← Conexión (MANTENER)
│   │   └── models.py              ← Modelos ORM (LIMPIAR)
│   │
│   ├── schemas/                   ← Validaciones Pydantic
│   │   ├── __init__.py
│   │   ├── empleado_schema.py     (REFACTORIZAR)
│   │   ├── nomina_schema.py       (REFACTORIZAR)
│   │   ├── ausencia_schema.py     (REVISAR)
│   │   ├── auth_schema.py         (REVISAR)
│   │   └── base.py                ← CREAR - Esquemas base
│   │
│   ├── routes/                    ← Endpoints
│   │   ├── __init__.py
│   │   ├── empleados.py           (REFACTORIZAR)
│   │   ├── nomina.py              (REFACTORIZAR)
│   │   ├── ausencias.py           (REVISAR)
│   │   ├── auth.py                (REVISAR)
│   │   ├── reportes.py            (REVISAR)
│   │   └── health.py              ← CREAR - Health checks
│   │
│   ├── services/                  ← Lógica de negocio
│   │   ├── __init__.py
│   │   ├── empleado_service.py    (REFACTORIZAR)
│   │   ├── nomina_service.py      (REFACTORIZAR)
│   │   ├── ausencia_service.py    (REVISAR)
│   │   ├── auth_service.py        (REVISAR)
│   │   ├── reporte_service.py     (REVISAR)
│   │   ├── configuracion_service.py
│   │   └── validator_service.py   ← CREAR - Validaciones
│   │
│   ├── dependencies/              ← Dependencias
│   │   ├── __init__.py
│   │   └── auth.py                ← Guards (MANTENER)
│   │
│   ├── exceptions/                ← CREAR Excepciones custom
│   │   ├── __init__.py
│   │   ├── empleado_exceptions.py
│   │   ├── nomina_exceptions.py
│   │   └── base_exceptions.py
│   │
│   ├── utils/                     ← CREAR - Funciones helper
│   │   ├── __init__.py
│   │   ├── formatters.py
│   │   ├── validators.py
│   │   └── constants.py
│   │
│   ├── middleware/                ← CREAR - Middleware custom
│   │   ├── __init__.py
│   │   ├── error_handler.py
│   │   ├── logging.py
│   │   └── cors.py
│   │
│   └── __pycache__/
│
├── tests/                         ← Tests
│   ├── __init__.py
│   ├── conftest.py                ← CREAR - Fixtures
│   ├── test_empleados.py          (EXPANDIR)
│   ├── test_nomina.py             (EXPANDIR)
│   ├── test_auth.py               ← CREAR
│   ├── test_ausencias.py          ← CREAR
│   └── integration/
│       └── test_workflow.py        ← CREAR
│
├── migrations/                    ← Alembic (RENOMBRAR de alembic/)
│   └── ...
│
├── .env                           ← Secretos (NO VERSIONAR)
├── .env.example                   ← CREAR - Template
├── .env.test                      ← CREAR - Para tests
├── requirements.txt               (ACTUALIZAR)
├── pytest.ini                     ← CREAR
├── setup.py                       ← CREAR
└── README.md                      (MEJORAR)
```

### Frontend

```
src/
├── app/                           ← Rutas Next.js (MANTENER)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── empleados/page.tsx
│   │   ├── nomina/page.tsx
│   │   ├── ausencias/page.tsx
│   │   ├── reportes/page.tsx
│   │   ├── asesor-ia/page.tsx
│   │   ├── ajustes/page.tsx       ← CREAR
│   │   └── [otros]/page.tsx
│   └── error.tsx                  ← CREAR
│
├── components/                    ← Componentes reutilizables
│   ├── ui/                        ← UI base (MANTENER)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── ... (30+ componentes)
│   │
│   ├── dialogs/                   ← CREAR - Modal forms
│   │   ├── index.ts
│   │   ├── DialogNuevoEmpleado.tsx
│   │   ├── DialogEditarEmpleado.tsx
│   │   ├── DialogEliminarEmpleado.tsx
│   │   ├── DialogGenerarNomina.tsx
│   │   ├── DialogExportarNomina.tsx
│   │   └── DialogConfirmacion.tsx
│   │
│   ├── layout/                    ← CREAR - Componentes de layout
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── PageHeader.tsx
│   │
│   ├── tables/                    ← CREAR - Tablas complejas
│   │   ├── TablaEmpleados.tsx
│   │   ├── TablaNomina.tsx
│   │   ├── TablaAusencias.tsx
│   │   └── columns.ts
│   │
│   ├── cards/                     ← CREAR - Tarjetas
│   │   ├── EmpleadoCard.tsx
│   │   ├── MetricaCard.tsx
│   │   └── EstadisticaCard.tsx
│   │
│   ├── forms/                     ← CREAR - Formularios
│   │   ├── FormEmpleado.tsx
│   │   ├── FormNomina.tsx
│   │   ├── FormAusencia.tsx
│   │   └── useFormValidation.ts
│   │
│   ├── estado/                    ← CREAR - Estados UI
│   │   ├── EmptyState.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ErrorState.tsx
│   │   └── NotFoundState.tsx
│   │
│   └── diseño/                    ← RENOMBRAR a 'layout'
│       └── ... (mantener existentes)
│
├── hooks/                         ← Custom hooks
│   ├── use-empleados.ts           (REFACTORIZAR)
│   ├── use-nomina.ts              ← CREAR
│   ├── use-ausencias.ts           ← CREAR
│   ├── use-auth.ts                ← CREAR
│   ├── use-toast.ts               (MANTENER)
│   ├── use-mobile.tsx             (MANTENER)
│   └── use-query-params.ts        ← CREAR
│
├── lib/                           ← Utilidades
│   ├── api.ts                     (REFACTORIZAR)
│   ├── tipos.ts                   (REFACTORIZAR)
│   ├── utils.ts                   (REFACTORIZAR)
│   ├── datos.ts                   (REVISAR)
│   ├── excel-service.ts           (REFACTORIZAR)
│   ├── ServicioEmpleado.ts        (ELIMINAR - Duplicado)
│   ├── formatters.ts              ← CREAR
│   ├── validators.ts              ← CREAR
│   ├── constants.ts               ← CREAR
│   ├── storage.ts                 ← CREAR
│   ├── date-utils.ts              ← CREAR
│   └── math-utils.ts              ← CREAR
│
├── context/                       ← Contextos
│   ├── contexto-autenticacion.tsx (REFACTORIZAR)
│   ├── ToastContext.tsx           ← CREAR si falta
│   └── AppContext.tsx             ← CREAR
│
├── schemas/                       ← Validación con Zod
│   ├── appSchemas.ts              (REFACTORIZAR)
│   ├── employee.schema.ts         ← CREAR
│   ├── payroll.schema.ts          ← CREAR
│   ├── auth.schema.ts             ← CREAR
│   └── common.schema.ts           ← CREAR
│
├── types/                         ← CREAR - Tipos puros
│   ├── index.ts
│   ├── entities.ts
│   ├── api.ts
│   └── ui.ts
│
├── api/                           ← CREAR - Clientes API
│   ├── client.ts
│   ├── empleados.api.ts
│   ├── nomina.api.ts
│   ├── auth.api.ts
│   └── interceptors.ts
│
├── constants/                     ← CREAR - Constantes
│   ├── index.ts
│   ├── api.ts
│   ├── roles.ts
│   ├── messages.ts
│   └── colors.ts
│
├── utils/                         ← CREAR - Utilidades
│   ├── index.ts
│   ├── formatters.ts
│   ├── validators.ts
│   ├── date.ts
│   └── number.ts
│
├── instrumentation.ts             ← CREAR - Logging
├── middleware.ts                  ← CREAR - Middleware
├── env.ts                         ← CREAR - Env validation
└── README.md
```

---

## 🔧 CAMBIOS ESPECÍFICOS POR ARCHIVO

### 1. Backend - Consolidación de duplicados

**archivo:** `backend/app/services/empleado_service.py`

```python
# ELIMINAR LÍNEAS 56-64 (duplicadas)
# MANTENER SOLO:

@staticmethod
def eliminar_empleado(db: Session, empleado_id: int):
    """Marca un empleado como inactivo (no borrar datos)."""
    db_empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if db_empleado:
        db_empleado.activo = False
        db_empleado.estado = "Retirado"
        db.commit()
        db.refresh(db_empleado)
    return db_empleado
```

---

### 2. Backend - Consolidar excepciones

**Crear:** `backend/app/exceptions/empleado_exceptions.py`

```python
from fastapi import HTTPException, status

class EmpleadoException(HTTPException):
    """Base para excepciones de Empleado"""
    pass

class EmpleadoNoEncontrado(EmpleadoException):
    def __init__(self, empleado_id: int = None, documento: str = None):
        detail = "Empleado no encontrado"
        if empleado_id:
            detail = f"Empleado con ID {empleado_id} no encontrado"
        elif documento:
            detail = f"Empleado con documento {documento} no encontrado"
        
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail
        )

class SalarioInvalido(EmpleadoException):
    def __init__(self, valor: float):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Salario inválido: {valor}. Debe ser mayor a 0"
        )

class DocumentoDuplicado(EmpleadoException):
    def __init__(self, documento: str):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe un empleado con el documento {documento}"
        )

class DatosIncompletos(EmpleadoException):
    def __init__(self, campos_faltantes: list):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Campos requeridos faltantes: {', '.join(campos_faltantes)}"
        )
```

---

### 3. Backend - Crear validators

**Crear:** `backend/app/services/validator_service.py`

```python
from app.database.models import Empleado
from sqlalchemy.orm import Session
from app.exceptions.empleado_exceptions import (
    SalarioInvalido, DocumentoDuplicado, DatosIncompletos
)

class ValidatorService:
    
    @staticmethod
    def validar_salario(salario: float):
        """Validar que el salario sea mayor a 0"""
        if salario is None or salario <= 0:
            raise SalarioInvalido(salario)
    
    @staticmethod
    def validar_documento_unico(db: Session, documento: str, empleado_id: int = None):
        """Validar que el documento no esté duplicado"""
        query = db.query(Empleado).filter(Empleado.numero_documento == documento)
        
        # Si estamos editando, excluir el empleado actual
        if empleado_id:
            query = query.filter(Empleado.id != empleado_id)
        
        if query.first():
            raise DocumentoDuplicado(documento)
    
    @staticmethod
    def validar_datos_empleado(datos: dict):
        """Validar datos requeridos"""
        campos_requeridos = ['primer_nombre', 'primer_apellido', 'numero_documento', 'salario_base']
        faltantes = [c for c in campos_requeridos if not datos.get(c)]
        
        if faltantes:
            raise DatosIncompletos(faltantes)
```

---

### 4. Frontend - Centralizar tipos

**Refactorizar:** `src/lib/tipos.ts`

```typescript
// TIPOS BÁSICOS
export enum EstadoEmpleado {
  ACTIVO = 'Activo',
  INACTIVO = 'Inactivo',
  SUSPENDIDO = 'Suspendido',
  RETIRADO = 'Retirado'
}

export enum RolUsuario {
  ADMIN = 'ADMIN',
  PAYROLL_MGR = 'PAYROLL_MGR',
  SUPERVISOR = 'SUPERVISOR',
  EMPLEADO = 'EMPLEADO'
}

// INTERFACES
export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  rol: RolUsuario;
  created_at: string;
}

export interface Empleado {
  id: number;
  numero_documento: string;
  primer_nombre: string;
  primer_apellido: string;
  segundo_nombre?: string;
  segundo_apellido?: string;
  email?: string;
  telefono_celular?: string;
  salario_base: number;
  cargo?: string;
  departamento_empresa?: string;
  fecha_ingreso?: string;
  estado?: EstadoEmpleado;
  activo: boolean;
  eps_nombre?: string;
  afp_nombre?: string;
  arl_nombre?: string;
  observaciones?: string;
}

export interface Nomina {
  id: number;
  empleado_id: number;
  empleado?: Empleado;
  periodo_mes: number;
  periodo_anio: number;
  salario_devengado: number;
  salario_neto: number;
  total_deducciones: number;
  estado: string;
  fecha_pago?: string;
  creado_en?: string;
}

export interface Ausencia {
  id: number;
  empleado_id: number;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  dias: number;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  motivo?: string;
}

export interface Estadisticas {
  total_empleados: number;
  empleados_activos: number;
  empleados_inactivos: number;
  total_nomina_mes: number;
  promedio_salario: number;
  ausencias_pendientes: number;
  departamentos: Record<string, number>;
  costo_por_departamento: Record<string, number>;
}

export interface PaginacionResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

---

### 5. Frontend - Crear API client modular

**Crear:** `src/lib/api-client.ts`

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse } from './tipos';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor de solicitud
axiosClient.interceptors.request.use(config => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuesta
axiosClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export class ApiClient {
  static async get<T>(endpoint: string): Promise<T> {
    const response = await axiosClient.get<T>(endpoint);
    return response.data;
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await axiosClient.post<T>(endpoint, data);
    return response.data;
  }

  static async patch<T>(endpoint: string, data: any): Promise<T> {
    const response = await axiosClient.patch<T>(endpoint, data);
    return response.data;
  }

  static async delete<T>(endpoint: string): Promise<T> {
    const response = await axiosClient.delete<T>(endpoint);
    return response.data;
  }

  static async upload(endpoint: string, formData: FormData): Promise<any> {
    const response = await axiosClient.post(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
}
```

---

## 📋 CHECKLIST DE REFACTORIZACIÓN

### Backend:
- [ ] Eliminar métodos duplicados en `EmpleadoService`
- [ ] Crear carpeta `exceptions/` y mover excepciones
- [ ] Crear carpeta `utils/` con helpers
- [ ] Crear `validator_service.py`
- [ ] Crear `pytest.ini` y fixtures en `conftest.py`
- [ ] Crear `.env.example`
- [ ] Mejorar docstrings en todas las funciones
- [ ] Renombrar `alembic/` a `migrations/`
- [ ] Agregar `setup.py`

### Frontend:
- [ ] Crear carpeta `components/dialogs/`
- [ ] Crear carpeta `components/forms/`
- [ ] Crear carpeta `components/estado/`
- [ ] Crear carpeta `api/` con clientes modularizados
- [ ] Consolidar todos los tipos en `lib/tipos.ts`
- [ ] Crear `lib/api-client.ts`
- [ ] Crear `lib/formatters.ts`
- [ ] Crear `lib/validators.ts`
- [ ] Crear `constants/` para constantes
- [ ] Crear `middleware.ts`
- [ ] Eliminar `ServicioEmpleado.ts` (duplicado)

### Base de datos:
- [ ] Agregar índices complejos
- [ ] Crear tabla de auditoría
- [ ] Agregar constraints de validación
- [ ] Documentar schema

---

## 🎯 PRÁCTICAS RECOMENDADAS

### 1. **Separación de responsabilidades**
```python
# ❌ MAL - Todo mezclado
def obtener_empleado(id):
    emp = db.query(Empleado).get(id)
    emp.salario_neto = emp.salario_base * 0.92  # Cálculo aquí
    return emp

# ✅ BIEN - Responsabilidades separadas
def obtener_empleado(id):
    return db.query(Empleado).get(id)

def calcular_neto_empleado(empleado):
    return NominaService.calcular_deducciones(empleado)
```

### 2. **Manejo de errores consistente**
```typescript
// ❌ MAL - Manejo inconsistente
try {
    await fetch(url);
} catch (e) {
    console.log('Error');  // Genérico
}

// ✅ BIEN - Manejo específico
try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new ApiError(response.status, response.statusText);
    }
} catch (error) {
    if (error instanceof ApiError) {
        handleApiError(error);
    } else {
        handleUnknownError(error);
    }
}
```

### 3. **Validación en dos capas**
```python
# Capa 1: Schema (Pydantic)
class EmpleadoCreate(BaseModel):
    salario_base: float = Field(..., gt=0)  # Validación automática

# Capa 2: Lógica (Service)
ValidatorService.validar_documento_unico(db, documento)

# Capa 3: BD (Constraints)
CheckConstraint('salario_base > 0')
```

### 4. **Logging estructurado**
```python
import logging

logger = logging.getLogger(__name__)

logger.info("Empleado creado", extra={
    "empleado_id": emp.id,
    "usuario_id": current_user.id,
    "timestamp": datetime.now()
})
```

### 5. **Testing por capas**
```bash
# Unit tests - Lógica pura
pytest tests/test_validators.py

# Integration tests - BD + Services
pytest tests/integration/test_empleado_flow.py

# E2E tests - Frontend + Backend
npm run test:e2e
```

---

**Próxima revisión después de implementar el Plan de Acción Semana 1**

