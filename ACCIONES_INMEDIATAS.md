# ⚡ GUÍA RÁPIDA - PRIMERAS ACCIONES (Hoy)

**Tiempo total:** 30 minutos  
**Objetivo:** Alinear integración frontend-backend

---

## 🎯 ACCIÓN 1: Revisar y Cambiar Rutas API (15 min)

### Paso 1: Verificar backend (✅ CORRECTO)
**Archivo:** `backend/app/routes/nomina.py`  
**Línea 16:**
```python
router = APIRouter(prefix="/nominas", tags=["Nóminas"])  # ✅ CON 's'
```
✅ **Estado:** Correcto, no cambiar

---

### Paso 2: Cambiar frontend - Importación de empleados
**Archivo:** `src/lib/api.ts`  
**Línea ~68**

**ANTES:**
```typescript
importarDesdeArchivo: async (archivo: File) => {
    const formData = new FormData();
    formData.append('file', archivo); 
    const res = await axiosInstance.post('/empleados/importar-archivo', formData, {
    // ❌ /importar-archivo no existe
```

**DESPUÉS:**
```typescript
importarDesdeArchivo: async (archivo: File) => {
    const formData = new FormData();
    formData.append('file', archivo); 
    const res = await axiosInstance.post('/empleados/importar', formData, {
    // ✅ /importar SÍ existe
```

**Cómo hacerlo:**
1. Abre `src/lib/api.ts`
2. Ve a línea ~68
3. Reemplaza `'/empleados/importar-archivo'` por `'/empleados/importar'`
4. Guarda

✅ **Resultado:** Importación de Excel funciona

---

### Paso 3: Cambiar frontend - Rutas de nómina
**Archivo:** `src/app/nomina/page.tsx`  
**Líneas a cambiar:** 57, 77, 84

**ANTES (LÍNEA 57):**
```typescript
const response = await fetch(`${apiUrl}/nomina/periodo/${numMes}/${anio}`, {
```

**DESPUÉS (LÍNEA 57):**
```typescript
const response = await fetch(`${apiUrl}/nominas/periodo/${numMes}/${anio}`, {
```

Repetir para líneas 77 y 84.

**Cómo hacerlo:**
1. Abre `src/app/nomina/page.tsx`
2. Usa Ctrl+H (Reemplazar)
3. Buscar: `/nomina/`
4. Reemplazar por: `/nominas/`
5. Reemplazar TODO (debería ser ~3 ocurrencias)
6. Guarda

✅ **Resultado:** Listado y generación de nómina funciona

---

### Paso 4: Arreglar URL hardcodeada
**Archivo:** `src/hooks/use-empleados.ts`  
**Línea 15**

**ANTES:**
```typescript
const response = await fetch(`http://localhost:8000/empleados/`);
```

**DESPUÉS:**
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const response = await fetch(`${apiUrl}/empleados/`);
```

**Cómo hacerlo:**
1. Abre `src/hooks/use-empleados.ts`
2. Ve a línea 15
3. Reemplaza toda la línea

✅ **Resultado:** Usa variable de entorno correctamente

---

## 🧪 ACCIÓN 2: PROBAR LOS CAMBIOS (10 min)

### En terminal 1 - Iniciar backend
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

✅ Debe decir: `Uvicorn running on http://0.0.0.0:8000`

---

### En terminal 2 - Iniciar frontend
```bash
npm run dev -- -p 9002
```

✅ Debe decir: `ready - started server on ... port 9002`

---

### En navegador - Probar
1. Abre http://localhost:9002
2. Ve a **Empleados**
3. Prueba **Importar Excel** - Debe conectar
4. Ve a **Nómina**
5. Prueba **Generar Nómina** - Debe conectar

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] Cambié `/empleados/importar-archivo` → `/empleados/importar` en api.ts
- [ ] Cambié `/nomina/` → `/nominas/` en nomina/page.tsx (3 veces)
- [ ] Cambié URL hardcodeada en use-empleados.ts
- [ ] Backend corre sin errores
- [ ] Frontend corre sin errores
- [ ] Importación de Excel conecta con backend
- [ ] Listado de nómina carga sin errores
- [ ] Botón "Generar Nómina" intenta conectar

---

## 🎉 RESULTADO ESPERADO

Después de estos cambios:
- ✅ **Importación de empleados:** Funciona
- ✅ **Listado de nóminas:** Funciona
- ✅ **Generación de nóminas:** Funciona
- ✅ **Descargar comprobante:** Funciona (si hay empleados)

**Si algo falla:** Revisa la consola del navegador (F12 → Console) para ver el error exacto.

---

## 🚨 ERRORES COMUNES

### Error: "Cannot POST /empleados/importar-archivo"
**Solución:** No olvidaste cambiar la ruta en `src/lib/api.ts`

### Error: "Cannot GET /nomina/periodo/1/2025"
**Solución:** No cambiste todas las 3 ocurrencias en `src/app/nomina/page.tsx`

### Error: "Unauthorized"
**Solución:** Necesitas estar logueado. Usa credenciales en la BD

### Nada cambia en UI
**Solución:** Debes hacer refresh (F5) en el navegador después de cambios

---

## 📝 SIGUIENTE PASO (Mañana)

Una vez que esto funcione, continúa con:

**Crear diálogos de formularios:**
- `DialogNuevoEmpleado.tsx`
- `DialogExportarNomina.tsx`
- Conectar botones

Ver en: **PLAN_ACCION_SEMANA1.md**

---

**Tiempo estimado total de esta acción:** 30 minutos  
**Impacto:** 🔥 Desbloquea 40% de la funcionalidad

