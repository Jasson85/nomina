# 🧪 Guía de Testing - Cambios Semana 1

## ⚡ ANTES DE PROBAR

### 1. Reiniciar el Frontend
```bash
# En la terminal donde corre npm:
Ctrl+C

# Luego ejecutar:
npm run dev -- -p 9002
```

Esperar a que se vea: `✓ Ready in XXXX ms`

### 2. Verificar Backend
```bash
# En la otra terminal, debe mostrar:
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

### 3. Limpiar Browser Cache
- Abrir DevTools: `F12`
- Network tab → desmarcar "Disable cache"
- Recargar página: `Ctrl+Shift+R` (hard refresh)

---

## 📋 Test Cases - Página Empleados

### TC-001: Crear Nuevo Empleado
**Pasos:**
1. Ir a `http://localhost:9002/empleados`
2. Click en botón azul **"Nuevo Registro"**
3. Llenar formulario:
   - Nombre: "Juan"
   - Apellido: "Pérez"
   - Cédula: "1234567890"
   - Email: "juan@test.com"
   - Salario: "2000000"
   - Rol: "Empleado"
   - Departamento: "Ventas"
   - Fecha: hoy
4. Click en **"Crear"**

**Resultado esperado:**
- [ ] Toast verde con "Empleado creado exitosamente"
- [ ] Diálogo se cierra automáticamente
- [ ] Nuevo empleado aparece en la tabla
- [ ] Contador "Personal Activo" aumenta en 1

**Si falla:**
- Abrir DevTools → Network tab
- Verificar POST a `http://localhost:8000/empleados/`
- Status debe ser `201`

---

### TC-002: Validar Campo Salario
**Pasos:**
1. Click "Nuevo Registro"
2. Llenar todos excepto salario
3. Ingresar: "0" en salario
4. Click "Crear"

**Resultado esperado:**
- [ ] Mensaje de error: "Salario debe ser mayor a 0"
- [ ] Botón "Crear" permanece deshabilitado

---

### TC-003: Campo Obligatorio
**Pasos:**
1. Click "Nuevo Registro"
2. Dejar campos vacíos
3. Click "Crear"

**Resultado esperado:**
- [ ] Toast rojo con "Los campos marcados son obligatorios"
- [ ] Diálogo permanece abierto

---

### TC-004: Editar Empleado
**Pasos:**
1. En tabla de empleados, click en menú (⋮) de cualquier empleado
2. Click en **"Editar Datos"**
3. Cambiar:
   - Nombre: "Javier"
   - Salario: "3000000"
4. Click **"Guardar Cambios"**

**Resultado esperado:**
- [ ] Toast verde: "Javier ha sido actualizado correctamente"
- [ ] Datos refrescados en la tabla
- [ ] El nombre en la fila cambió a "Javier"

---

### TC-005: Eliminar Empleado
**Pasos:**
1. Click en menú (⋮) de un empleado
2. Click **"Dar de Baja"**
3. Leer el modal de confirmación
4. Click **"Sí, Eliminar"**

**Resultado esperado:**
- [ ] Toast rojo: "Has sido eliminado correctamente"
- [ ] Empleado desaparece de la tabla
- [ ] Contador "Personal Activo" disminuye

**Si das "Cancelar":**
- [ ] El modal se cierra sin eliminar nada

---

### TC-006: Exportar Nómina
**Pasos:**
1. Click en botón **"Exportar"**
2. Seleccionar mes: "Enero"
3. Seleccionar año: "2025"
4. Click **"Descargar CSV"**

**Resultado esperado:**
- [ ] Archivo `nomina_1_2025.csv` se descarga
- [ ] Archivo abre en Excel/Sheets correctamente
- [ ] Contiene columnas: ID, Empleado, Salario Neto, etc.

**Troubleshooting:**
- Si no descarga: Revisar DevTools → Network tab
- GET a `/nominas/periodo/1/2025` debe retornar `200`

---

## 📊 Test Cases - Página Nómina

### TC-007: Generar Nómina Mensual
**Pasos:**
1. Ir a `http://localhost:9002/nomina`
2. Click botón azul **"Generar Nómina"**
3. Seleccionar:
   - Mes: "Enero"
   - Año: "2025"
4. Click **"Generar Nómina"**

**Resultado esperado:**
- [ ] Diálogo muestra "Procesando..."
- [ ] Después de 2 segundos, muestra resultado
- [ ] Toast verde: "Nómina generada: X empleados procesados"
- [ ] Tabla se actualiza con nuevos registros
- [ ] Diálogo se cierra automáticamente

**Si muestra error:**
- Verificar que existan empleados activos
- Backend status POST `/nominas/generar` = `200`

---

### TC-008: Ver Nóminas por Período
**Pasos:**
1. En página Nómina, cambiar Mes a "Febrero"
2. Cambiar Año a "2024"

**Resultado esperado:**
- [ ] Tabla se vacía mientras carga
- [ ] Se cargan nóminas de Feb 2024
- [ ] Si no hay, muestra "No hay nóminas registradas"

---

### TC-009: Ver Detalles de Nómina
**Pasos:**
1. En tabla de nóminas, click en **"Ver"** de cualquier registro
2. Se abre página `/nomina/detalles/[id]`

**Resultado esperado:**
- [ ] Muestra datos del empleado
- [ ] Desglose de salario:
  - Salario base
  - Deducciones (EPS, AFP, etc.)
  - Bonificaciones
  - Salario neto

---

## 🔴 Casos de Error Esperados

### Error: "No se pudo conectar con el servidor"
**Causa:** Backend no está corriendo
**Solución:**
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

---

### Error: "Token expirado"
**Causa:** Sesión expirada (después de 30 min)
**Solución:**
1. Ir a `/login`
2. Ingresar credenciales nuevamente
3. Reintentar operación

---

### Error: "CORS error"
**Causa:** Dominio frontend no autorizado
**Solución:**
Verificar en `backend/app/config.py`:
```python
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:9002",  # ← Debe estar aquí
    "http://localhost:8000",
]
```

---

### Error: "Permiso denegado"
**Causa:** Usuario no tiene rol necesario
**Solución:**
- Usuario debe ser ADMIN o GESTOR_NOMINA
- Verificar en base de datos:
```sql
SELECT email, rol FROM usuario WHERE email = 'tu@email.com';
```

---

## 📱 Testing en Navegadores

### Chrome/Edge
- [ ] Abrir DevTools → Console
- [ ] Revisar errores rojos
- [ ] Network tab → filtrar por 8000
- [ ] Respuestas deben ser `200`, `201`, `204`

### Firefox
- [ ] Inspector → Network
- [ ] Performance → capturar tiempo de carga
- [ ] Debe ser < 2 segundos

### Safari (MacOS)
- [ ] Habilitar Developer Menu
- [ ] Revisar Console para errores

---

## 🎯 Checklist de Testing Completo

### Frontend
- [ ] Todos los botones funcionan
- [ ] Formularios validan datos
- [ ] Toasts se muestran correctamente
- [ ] Tablas se actualizan
- [ ] Diálogos se abren/cierran
- [ ] Responsive en móvil (F12 → Toggle Device)

### Backend
- [ ] Endpoints retornan datos correctos
- [ ] Validaciones funcionan
- [ ] JWT tokens válidos
- [ ] CORS funcionando
- [ ] Base de datos persiste datos

### Base de Datos
- [ ] Nuevos registros se guardan
- [ ] Updates se aplican
- [ ] Deletes se ejecutan
- [ ] Relaciones se mantienen

---

## 🐛 Debugging

### Ver logs del frontend
```bash
# En DevTools → Console (F12)
- Buscar errores rojos
- Expandir para ver stack trace
- Nota la línea de código problemática
```

### Ver logs del backend
```bash
# En terminal uvicorn
- Aparecen todos los requests
- Muestra código de respuesta
- Cualquier error en Python
```

### Ver requests/responses
```bash
# En DevTools → Network
1. Abrir tab
2. Realizar acción
3. Ver petición en lista
4. Click para ver:
   - Headers
   - Payload (request body)
   - Response
   - Status code
```

---

## 📝 Formato de Reporte de Bug

Si encuentras un error, reporta:

```
Título: [Módulo] Descripción breve

Pasos para reproducir:
1. ...
2. ...
3. ...

Resultado esperado:
...

Resultado actual:
...

Screenshots/Logs:
(Adjuntar DevTools screenshot)

Navegador/OS:
Chrome 120 / Windows 11
```

---

## ✅ Checklist Antes de Pasar a Semana 2

- [ ] Crear empleado funciona
- [ ] Editar empleado funciona
- [ ] Eliminar empleado funciona y pide confirmación
- [ ] Exportar nómina descarga CSV
- [ ] Generar nómina muestra resultado
- [ ] Sin errores en DevTools console
- [ ] Todos los endpoints responden
- [ ] Base de datos persiste cambios

**Si todo ✅, pasar a:**
- Validaciones avanzadas
- Campos adicionales
- Generación PDF
- Tests automatizados

---

*Guía generada para asegurar funcionalidad 100% antes de pasar a features adicionales*
