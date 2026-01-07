# 🚀 INSTRUCCIONES PARA INICIAR - Semana 1

## ⚡ PASO A PASO (5 minutos)

### PASO 1: Detener Procesos Actuales
```bash
# Si algo está corriendo:
Ctrl+C  (en ambas terminales)
```

---

### PASO 2: Iniciar Backend

**En Terminal 1:**
```bash
cd c:\Users\jasso\Documents\nomina-main\backend
uvicorn app.main:app --reload --port 8000
```

**Debe mostrar:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

✅ **Dejar corriendo** (no cerrar esta terminal)

---

### PASO 3: Iniciar Frontend

**En Terminal 2 (NEW):**
```bash
cd c:\Users\jasso\Documents\nomina-main
npm run dev -- -p 9002
```

**Debe mostrar:**
```
  ✓ Ready in XXXX ms
```

✅ **Dejar corriendo** (no cerrar esta terminal)

---

### PASO 4: Abrir Browser

**Opción A - Empleados:**
```
http://localhost:9002/empleados
```

**Opción B - Nómina:**
```
http://localhost:9002/nomina
```

**Opción C - Ambas en pestañas:**
```
Ctrl+T → http://localhost:9002/empleados
Ctrl+T → http://localhost:9002/nomina
```

---

### PASO 5: Hard Refresh
```
Ctrl+Shift+R  (Windows/Linux)
Cmd+Shift+R   (Mac)
```

⏳ Esperar 2-3 segundos a que cargue todo

---

## ✅ Verificación Rápida

### En Página Empleados:
```
☐ Ves el botón azul "Nuevo Registro"?
☐ Ves el botón gris "Exportar"?
☐ Ves tabla con empleados?
☐ Ves menú (⋮) en cada fila?
```

### En Página Nómina:
```
☐ Ves el botón "Generar Nómina"?
☐ Ves tabla de nóminas?
☐ Ves selectores de mes y año?
```

**Si todo sí → Continuar con Testing**
**Si hay "no" → Ver sección "Troubleshooting"**

---

## 🧪 TESTING (10 minutos)

### Test 1: Crear Empleado
```
1. Click "Nuevo Registro"
2. Llenar:
   - Nombre: "Test"
   - Apellido: "Usuario"
   - Email: "test@test.com"
   - Cédula: "9999999"
   - Salario: "2000000"
   - Rol: "Empleado"
   - Depto: "IT"
3. Click "Crear"
4. ✅ Debe aparecer en tabla con toast verde
```

---

### Test 2: Editar Empleado
```
1. En tabla, click menú (⋮) de cualquier empleado
2. Click "Editar Datos"
3. Cambiar Nombre a: "Actualizado"
4. Click "Guardar Cambios"
5. ✅ Debe actualizar en la tabla
```

---

### Test 3: Eliminar Empleado
```
1. Click menú (⋮) 
2. Click "Dar de Baja"
3. LEER la advertencia
4. Click "Sí, Eliminar"
5. ✅ Debe desaparecer de la tabla
```

---

### Test 4: Generar Nómina
```
1. Ir a /nomina
2. Click "Generar Nómina"
3. Mes: "Enero"
4. Año: "2025"
5. Click "Generar Nómina"
6. ✅ Debe mostrar resultado y actualizar tabla
```

---

### Test 5: Exportar CSV
```
1. En /empleados, click "Exportar"
2. Mes: "Enero"
3. Año: "2025"
4. Click "Descargar CSV"
5. ✅ Debe descargar archivo nomina_1_2025.csv
```

---

## ⚠️ Si No Funciona Algo

### Error: "No se pudo conectar con el servidor"

**Solución:**
```bash
# Verificar que Backend esté corriendo
# Terminal 1 debe mostrar:
INFO:     Application startup complete

# Si no:
Ctrl+C
uvicorn app.main:app --reload --port 8000
```

---

### Error: "CORS error" (en Console del browser)

**Solución:**
```bash
# Backend tiene CORS mal configurado
# Verificar archivo: backend/app/config.py

ALLOWED_ORIGINS = [
    "http://localhost:9002",  ← Debe estar aquí
]
```

---

### Error: Dialog no se abre

**Solución:**
```bash
# Frontend no se refrescó
Ctrl+C en Terminal 2
npm run dev -- -p 9002

# En Browser:
Ctrl+Shift+R
```

---

### Error: Botón sin reacción

**Solución:**
```bash
1. Abrir DevTools: F12
2. Console tab
3. Buscar errores rojos
4. Expandir error
5. Anotar línea de código
6. Revisar ese archivo
```

---

### Error: API retorna 404

**Solución:**
```bash
1. DevTools → Network tab
2. Hacer la acción (crear, editar, etc)
3. Buscar request a localhost:8000
4. Click en request
5. Ver URL exacta
6. Comparar con rutas en backend/app/routes/
7. Deben coincidir
```

---

### Error: API retorna 500

**Solución:**
```bash
1. Revisar Terminal 1 (Backend)
2. Buscar línea con "ERROR"
3. Leer el mensaje
4. Si es base de datos:
   - Verificar que PostgreSQL esté corriendo
   - Verificar DATABASE_URL en .env
5. Si es código:
   - Buscar el archivo mencionado
   - Revisar sintaxis
```

---

## 🔍 Debugging (DevTools)

### Abrir DevTools:
```
F12  (Windows/Linux)
Cmd+Option+I  (Mac)
```

### Pestaña Console:
```
- Buscar errores rojos
- Expandir para ver detalles
- Stack trace muestra archivo y línea
```

### Pestaña Network:
```
1. Hacer acción (crear, editar, etc)
2. Ver lista de peticiones
3. Click en una para ver detalles
4. Headers → Authorization token
5. Response → datos del servidor
6. Status → código HTTP (200, 201, 400, 500, etc)
```

### Pestaña Application:
```
- Storage → Local Storage
- Ver el token JWT guardado
- Ver cualquier variable que setees
```

---

## 📝 Checklist Pre-Testing

Antes de probar, verificar:

```
☐ Terminal 1 Backend: corriendo sin errores
☐ Terminal 2 Frontend: "Ready in X ms"
☐ Browser: página cargó sin errores (console limpia)
☐ Botones visibles: "Nuevo Registro", "Exportar", etc
☐ Tabla visible con datos
☐ Token válido (probablemente sí si está logueado)
```

---

## 🎯 Qué Testear Primero

**Prioridad 1 (crítico):**
- [ ] Crear empleado funciona
- [ ] Editar empleado funciona
- [ ] Eliminar confirmación aparece

**Prioridad 2 (importante):**
- [ ] Generar nómina funciona
- [ ] Exportar CSV descarga

**Prioridad 3 (validar):**
- [ ] Toast mensajes aparecen
- [ ] Tabla se actualiza
- [ ] Sin errores en console

---

## 🔧 Configuración Verificar

### .env.local (en root de proyecto)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Si no existe, crear:**
```bash
# En raíz del proyecto (c:\Users\jasso\Documents\nomina-main)
# Crear archivo .env.local
# Agregar:
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

### backend/.env
```bash
DATABASE_URL=postgresql://usuario:password@localhost:5432/nomina_db
SECRET_KEY=tu_clave_secreta
ALGORITHM=HS256
```

---

## 📞 Si Aún No Funciona

**Hacer en orden:**

1. **Reiniciar TODO:**
   ```bash
   Ctrl+C x2 (ambas terminales)
   Cerrar browser
   Esperar 3 segundos
   Volver a iniciar Backend → Frontend → Browser
   ```

2. **Revisar error en Console:**
   ```bash
   F12 → Console
   ¿Hay errores rojos?
   → Anotar el error exacto
   ```

3. **Revisar Network:**
   ```bash
   F12 → Network
   Hacer acción
   ¿Request llega a localhost:8000?
   ¿Qué status retorna?
   ```

4. **Revisar sintaxis:**
   ```bash
   Backend: python -m py_compile backend/app/routes/empleados.py
   Frontend: npm run build (verificar errores)
   ```

5. **Logs del Backend:**
   ```bash
   Terminal Backend: ¿Qué dice después de la acción?
   ¿Hay ERROR?
   ¿Qué endpoint se llamó?
   ```

---

## 📊 Resumen de URLs

```
Frontend:       http://localhost:9002
Empleados:      http://localhost:9002/empleados
Nómina:         http://localhost:9002/nomina
Backend API:    http://localhost:8000
API Docs:       http://localhost:8000/docs
```

---

## ✅ Señales de Éxito

```
✅ Botones abren dialogs
✅ Formularios aceptan datos
✅ Toasts verdes confirman éxito
✅ Tabla se actualiza automáticamente
✅ CSV se descarga
✅ Sin errores en console
✅ Todas las 5 funcionalidades funcionan
```

---

## 🎉 ¡LISTO!

Si todo funciona:
```
1. Abre CAMBIOS_REALIZADOS_SEMANA1.md (para entender qué se hizo)
2. Lee RESUMEN_EJECUTIVO_SEMANA1.md (visión general)
3. Inicia GUIA_TESTING_SEMANA1.md (testing completo)
4. Checklist final en VERIFICACION_CAMBIOS.md
```

---

## 🆘 Contacto Rápido

**Si hay error crítico:**
1. Anotar el error exacto
2. Tomar screenshot de console
3. Anotar pasos para reproducir
4. Revisar archivo mencionado en error
5. Buscar la línea problemática

---

## ⏱️ Timeline

```
Tiempo 0:00 → PASO 1: Detener procesos
Tiempo 0:30 → PASO 2: Iniciar Backend
Tiempo 1:00 → PASO 3: Iniciar Frontend
Tiempo 2:00 → PASO 4: Abrir Browser
Tiempo 2:30 → PASO 5: Hard Refresh
Tiempo 3:00 → Verificación Rápida
Tiempo 5:00 → Testing (5 tests × 2min cada uno)
Tiempo 15:00 → ¡TODO FUNCIONA!
```

---

*Guía rápida de inicio - Semana 1 implementación* ✅
