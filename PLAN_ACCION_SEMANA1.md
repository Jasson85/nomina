# 🔧 PLAN DE ACCIÓN DETALLADO - IMPLEMENTACIÓN INMEDIATA

**Fecha:** Enero 6, 2025  
**Scope:** Hacer la aplicación 100% funcional y limpia  
**Metodología:** Cambios mínimos, máximo impacto

---

## 📝 TAREAS ESPECÍFICAS A EJECUTAR

### SEMANA 1: ALINEAR INTEGRACIÓN (20 minutos c/día)

#### Día 1: Rutas de API
**Tiempo estimado:** 20 minutos  
**Archivos a modificar:** 6

##### 1. Cambiar prefijo de router en Backend
**Archivo:** `backend/app/routes/nomina.py`  
**Línea:** 16

```python
# ACTUAL:
router = APIRouter(prefix="/nominas", tags=["Nóminas"])

# ✅ YA ESTÁ CORRECTO (con 's')
# VERIFICAR que NO esté como `/nomina`
```
✅ **Estado:** YA CORRECTO

---

##### 2. Revisar ruta de importación de empleados
**Archivo:** `backend/app/routes/empleados.py`  
**Línea:** 23

```python
# ACTUAL:
@router.post("/importar")
async def importar_empleados(datos: List[EmpleadoImportacion], db: Session = Depends(get_db)):

# ✅ YA ESTÁ CORRECTO
```
✅ **Estado:** YA CORRECTO

---

##### 3. PROBLEMA ENCONTRADO: Ruta de importación en frontend
**Archivo:** `src/app/empleados/page.tsx`  
**Línea:** ~40

```typescript
// ACTUAL (INCORRECTO):
const response = await servicioEmpleados.importarDesdeArchivo(file);

// En src/lib/api.ts (LÍNEA ~68):
importarDesdeArchivo: async (archivo: File) => {
    const res = await axiosInstance.post('/empleados/importar-archivo', formData, {
    // ❌ Dice '/empleados/importar-archivo'
```

**CAMBIAR A:**
```typescript
importarDesdeArchivo: async (archivo: File) => {
    const res = await axiosInstance.post('/empleados/importar', formData, {  // ✅
```

**Acción:** Cambiar línea en `api.ts` de `/importar-archivo` → `/importar`

---

##### 4. PROBLEMA: Llamadas a /nomina en lugar de /nominas
**Archivo:** `src/app/nomina/page.tsx`  
**Línea:** 57

```typescript
// ACTUAL (INCORRECTO):
const response = await fetch(`${apiUrl}/nomina/periodo/${numMes}/${anio}`, {
    // ❌ Falta la 's'

// DEBE SER:
const response = await fetch(`${apiUrl}/nominas/periodo/${numMes}/${anio}`, {
    // ✅
```

**Líninas a cambiar:**
- Línea 57: `/nomina/` → `/nominas/`
- Línea 77: `/nomina/generar` → `/nominas/generar`
- Línea 84: `/nomina/` → `/nominas/`

---

##### 5. PROBLEMA: Variables de entorno en use-empleados.ts
**Archivo:** `src/hooks/use-empleados.ts`  
**Línea:** 15

```typescript
// ACTUAL (HARDCODED):
const response = await fetch(`http://localhost:8000/empleados/`);

// DEBE SER:
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const response = await fetch(`${apiUrl}/empleados/`);
```

---

##### 6. VERIFICAR: Consistencia en servicioNominas
**Archivo:** `src/lib/api.ts`  
**Línea:** ~68-80

```typescript
export const servicioNominas = {
    obtenerTodas: async () => apiClient.get('/nominas/'),  // ✅ CON 's'
    obtenerDetalle: async (id: string) => apiClient.get(`/nominas/${id}`),  // ✅
    generar: async (datos: { mes: number; anio: number }) => apiClient.post('/nominas/generar', datos),  // ✅
    descargarComprobante: async (id: number) => {
        return axiosInstance.get(`/nominas/comprobante/${id}`, { responseType: 'blob' });  // ✅
    }
};
```

✅ **Estado:** OK

---

#### Día 2: Completar Endpoints

**Archivo:** `backend/app/routes/nomina.py`  
**Tarea:** Agregar endpoint faltante para descargar comprobante

```python
# AGREGAR DESPUÉS DE LÍNEA 85 (después de generar_nomina_periodo):

from fastapi.responses import FileResponse
from reportlab.pdfgen import canvas
from io import BytesIO

@router.get("/comprobante/{nomina_id}")
def descargar_comprobante(
    nomina_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(AuthService.get_current_user)
):
    """
    Descarga el comprobante de pago de una nómina en PDF.
    """
    nomina = db.query(Nomina).filter(Nomina.id == nomina_id).first()
    if not nomina:
        raise HTTPException(status_code=404, detail="Nómina no encontrada")
    
    # Obtener datos del empleado
    empleado = db.query(Empleado).filter(Empleado.id == nomina.empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    
    try:
        # Crear PDF en memoria
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=(595, 842))  # A4
        
        # Encabezado
        pdf.setFont("Helvetica-Bold", 16)
        pdf.drawString(50, 750, "COMPROBANTE DE PAGO")
        
        # Datos de la nómina
        pdf.setFont("Helvetica", 10)
        pdf.drawString(50, 720, f"Empleado: {empleado.primer_nombre} {empleado.primer_apellido}")
        pdf.drawString(50, 700, f"Documento: {empleado.numero_documento}")
        pdf.drawString(50, 680, f"Período: {nomina.periodo_mes}/{nomina.periodo_año}")
        pdf.drawString(50, 660, f"Salario Neto: ${nomina.salario_neto:,.2f}")
        
        # Guardar PDF
        pdf.save()
        buffer.seek(0)
        
        return FileResponse(
            buffer,
            media_type="application/pdf",
            filename=f"comprobante_{empleado.numero_documento}_{nomina.periodo_mes}_{nomina.periodo_año}.pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar PDF: {str(e)}")
```

**Instalar dependencia:**
```bash
pip install reportlab
```

---

#### Día 3: Diálogos en Frontend

**Crear archivo:** `src/components/dialogs/DialogNuevoEmpleado.tsx`

```tsx
'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { servicioEmpleados } from '@/lib/api';

interface DialogNuevoEmpleadoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DialogNuevoEmpleado({ open, onOpenChange, onSuccess }: DialogNuevoEmpleadoProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    primer_nombre: '',
    primer_apellido: '',
    numero_documento: '',
    email: '',
    salario_base: '',
    cargo: '',
    departamento_empresa: '',
    fecha_ingreso: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validaciones
      if (!formData.primer_nombre || !formData.primer_apellido || !formData.numero_documento) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Nombre, apellido y documento son obligatorios'
        });
        setIsLoading(false);
        return;
      }

      if (Number(formData.salario_base) <= 0) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'El salario debe ser mayor a 0'
        });
        setIsLoading(false);
        return;
      }

      await servicioEmpleados.crear({
        ...formData,
        salario_base: Number(formData.salario_base),
        fecha_ingreso: formData.fecha_ingreso,
        activo: true,
      });

      toast({
        title: 'Éxito',
        description: 'Empleado creado correctamente'
      });

      onOpenChange(false);
      setFormData({
        primer_nombre: '',
        primer_apellido: '',
        numero_documento: '',
        email: '',
        salario_base: '',
        cargo: '',
        departamento_empresa: '',
        fecha_ingreso: new Date().toISOString().split('T')[0],
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.response?.data?.detail || 'No se pudo crear el empleado'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo Empleado</DialogTitle>
          <DialogDescription>
            Completa los datos básicos del nuevo empleado. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primer_nombre">Nombre *</Label>
              <Input
                id="primer_nombre"
                name="primer_nombre"
                placeholder="Juan"
                value={formData.primer_nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primer_apellido">Apellido *</Label>
              <Input
                id="primer_apellido"
                name="primer_apellido"
                placeholder="Pérez"
                value={formData.primer_apellido}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numero_documento">Documento *</Label>
            <Input
              id="numero_documento"
              name="numero_documento"
              placeholder="123456789"
              value={formData.numero_documento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="juan@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salario_base">Salario Base *</Label>
            <Input
              id="salario_base"
              name="salario_base"
              type="number"
              placeholder="2600000"
              value={formData.salario_base}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo">Cargo</Label>
            <Input
              id="cargo"
              name="cargo"
              placeholder="Desarrollador"
              value={formData.cargo}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="departamento_empresa">Departamento</Label>
            <Input
              id="departamento_empresa"
              name="departamento_empresa"
              placeholder="Tecnología"
              value={formData.departamento_empresa}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha_ingreso">Fecha de Ingreso</Label>
            <Input
              id="fecha_ingreso"
              name="fecha_ingreso"
              type="date"
              value={formData.fecha_ingreso}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Empleado'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

**Actualizar:** `src/app/empleados/page.tsx`

```tsx
// Agregar import en línea 9:
import { DialogNuevoEmpleado } from '@/components/dialogs/DialogNuevoEmpleado';

// Agregar estado después de línea 25:
const [showDialogNuevo, setShowDialogNuevo] = useState(false);

// Cambiar botón en línea 76:
<Button 
  className="bg-blue-600 hover:bg-blue-700 shadow-md"
  onClick={() => setShowDialogNuevo(true)}  // ✅ AGREGAR
>
  <UserPlus className="h-4 w-4 mr-2" /> Nuevo Registro
</Button>

// Agregar componente antes del cierre de </div>:
<DialogNuevoEmpleado 
  open={showDialogNuevo}
  onOpenChange={setShowDialogNuevo}
  onSuccess={refrescar}
/>
```

---

#### Día 4: Botón de Exportar Nómina

**Crear archivo:** `src/components/dialogs/DialogExportarNomina.tsx`

```tsx
'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface DialogExportarNominaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function DialogExportarNomina({ open, onOpenChange }: DialogExportarNominaProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [mes, setMes] = useState<string>(MESES[new Date().getMonth()]);
  const [anio, setAnio] = useState<string>(new Date().getFullYear().toString());

  const handleExportar = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const numMes = MESES.indexOf(mes) + 1;

      // Por ahora, descargamos como JSON
      // En el futuro: cambiar a /nominas/exportar-excel/{mes}/{anio}
      const response = await fetch(`${apiUrl}/nominas/periodo/${numMes}/${anio}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al obtener datos');

      const data = await response.json();

      // Convertir a CSV y descargar
      const csv = generarCSV(data);
      descargarCSV(csv, `nomina_${numMes}_${anio}.csv`);

      toast({
        title: 'Éxito',
        description: `Nómina de ${mes} exportada correctamente`
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo exportar la nómina'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportar Nómina</DialogTitle>
          <DialogDescription>
            Selecciona el período que deseas exportar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mes">Mes</Label>
            <Select value={mes} onValueChange={setMes}>
              <SelectTrigger id="mes">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MESES.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="anio">Año</Label>
            <Select value={anio} onValueChange={setAnio}>
              <SelectTrigger id="anio">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[2023, 2024, 2025, 2026].map(a => (
                  <SelectItem key={a} value={a.toString()}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleExportar} disabled={isLoading}>
              {isLoading ? 'Exportando...' : 'Exportar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generarCSV(nominas: any[]): string {
  if (nominas.length === 0) return '';

  const headers = Object.keys(nominas[0]);
  const headerRow = headers.join(',');
  const dataRows = nominas.map(row =>
    headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value}"` : value;
    }).join(',')
  );

  return [headerRow, ...dataRows].join('\n');
}

function descargarCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
```

**Actualizar:** `src/app/nomina/page.tsx`

```tsx
// Agregar import:
import { DialogExportarNomina } from '@/components/dialogs/DialogExportarNomina';

// Agregar estado:
const [showDialogExportar, setShowDialogExportar] = useState(false);

// Cambiar botones (línea ~210):
<Button 
  variant="outline" 
  className="shadow-sm border-slate-200"
  onClick={() => setShowDialogExportar(true)}
>
  <Download className="h-4 w-4 mr-2" /> Exportar
</Button>

<Button 
  className="bg-blue-600 hover:bg-blue-700 shadow-md"
  onClick={() => setIsGenerating(true)} // Conectar con handleGenerarNomina
>
  <Plus className="h-4 w-4 mr-2" /> Generar Nómina
</Button>

// Agregar componente:
<DialogExportarNomina open={showDialogExportar} onOpenChange={setShowDialogExportar} />
```

---

#### Día 5: Validaciones y Testing

**Crear archivo:** `backend/app/exceptions/custom_exceptions.py`

```python
from fastapi import HTTPException, status

class EmpleadoNoEncontrado(HTTPException):
    def __init__(self, documento: str = None):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Empleado {'con documento ' + documento if documento else ''} no encontrado"
        )

class SalarioInvalido(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El salario debe ser mayor a 0"
        )

class DocumentoDuplicado(HTTPException):
    def __init__(self, documento: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe un empleado con el documento {documento}"
        )

class PeriodoNominaDuplicado(HTTPException):
    def __init__(self, mes: int, anio: int):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe nómina generada para {mes}/{anio}"
        )
```

---

### SEMANA 2: CONSOLIDACIÓN Y TESTING (3-4 horas/día)

#### Tareas Pendientes:

**1. Backend:**
- [ ] Agregar validaciones de salario > 0 en modelos
- [ ] Implementar validación de períodos duplicados
- [ ] Agregar índices a base de datos
- [ ] Crear tabla de auditoría
- [ ] Implementar logging centralizado

**2. Frontend:**
- [ ] Crear `DialogEditarEmpleado.tsx`
- [ ] Crear `DialogEliminarEmpleado.tsx`
- [ ] Crear `DialogGenerarNomina.tsx`
- [ ] Agregar validaciones en formularios
- [ ] Mejorar manejo de errores

**3. Testing:**
- [ ] Crear tests para empleados CRUD
- [ ] Crear tests para generación de nómina
- [ ] Crear tests para importación de archivos
- [ ] Crear tests para autenticación

---

## 🎯 COMANDOS A EJECUTAR

### Backend (desde `backend/`)

```bash
# 1. Instalar dependencia para PDF
pip install reportlab

# 2. Ejecutar tests
pytest tests/ -v

# 3. Iniciar servidor
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend (desde raíz)

```bash
# 1. Instalar dependencia de selects si falta
npm install @radix-ui/react-select

# 2. Ejecutar tests
npm test

# 3. Iniciar desarrollo
npm run dev -- -p 9002
```

---

## ✅ VALIDACIÓN DE CAMBIOS

Después de cada cambio, ejecuta:

```bash
# 1. Probar importación de empleados
curl -X POST http://localhost:8000/empleados/importar \
  -H "Content-Type: application/json" \
  -d '[{"numero_documento":"123","primer_nombre":"Juan","salario_base":2600000}]'

# 2. Probar listado de nóminas
curl -X GET http://localhost:8000/nominas/ \
  -H "Authorization: Bearer {token}"

# 3. Probar generación de nómina
curl -X POST "http://localhost:8000/nominas/generar?mes=1&anio=2025" \
  -H "Authorization: Bearer {token}"
```

---

## 📊 ESTADO DE PROGRESO

Después de completar:

- ✅ **Día 1:** Rutas alineadas - Frontend conecta correctamente con Backend
- ✅ **Día 2:** Endpoint de PDF completado - Descargar comprobantes funciona
- ✅ **Día 3:** Diálogo nuevo empleado - Crear empleados desde UI
- ✅ **Día 4:** Exportar nómina - Descargar datos
- ✅ **Día 5:** Validaciones - Evitar datos inválidos

**Resultado esperado:** ✅ Aplicación 100% funcional y limpia

