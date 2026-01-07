# 🔗 REFERENCIAS RÁPIDAS - Bookmarks y Comandos

**Para:** Acceso rápido durante desarrollo  
**Actualizar:** Según avances

---

## 📍 ARCHIVOS CLAVE A MODIFICAR

### Backend - Rutas
- **Archivo:** `backend/app/routes/nomina.py`
- **Línea:** 16
- **Verificar:** `router = APIRouter(prefix=\"/nominas\", tags=[\"Nóminas\"])`
- **Acción:** YA CORRECTO ✅

### Backend - Rutas empleados
- **Archivo:** `backend/app/routes/empleados.py`
- **Línea:** 23
- **Verificar:** `@router.post(\"/importar\")`
- **Acción:** YA CORRECTO ✅

### Frontend - API Service
- **Archivo:** `src/lib/api.ts`
- **Línea:** ~68
- **Cambiar:** `/empleados/importar-archivo` → `/empleados/importar`
- **Acción:** CAMBIAR AHORA ⚠️

### Frontend - Página nómina
- **Archivo:** `src/app/nomina/page.tsx`
- **Líneas:** 57, 77, 84
- **Cambiar:** `/nomina/` → `/nominas/`
- **Acción:** CAMBIAR AHORA ⚠️

### Frontend - Hook empleados
- **Archivo:** `src/hooks/use-empleados.ts`
- **Línea:** 15
- **Cambiar:** Hardcoded URL → `process.env.NEXT_PUBLIC_API_URL`
- **Acción:** CAMBIAR AHORA ⚠️

---

## 🔧 COMANDOS ÚTILES

### Desarrollo

```bash
# Backend
cd backend
python -m uvicorn app.main:app --reload --port 8000

# Frontend
npm run dev -- -p 9002

# Both (en 2 terminales)
Terminal 1: cd backend && uvicorn app.main:app --reload --port 8000
Terminal 2: npm run dev -- -p 9002
```

### Testing

```bash
# Backend - Todos los tests
pytest backend/tests/ -v

# Backend - Tests específicos
pytest backend/tests/test_empleados.py -v

# Backend - Con cobertura
pytest backend/tests/ --cov=app/ --cov-report=html

# Frontend - Ejecutar tests
npm test

# Frontend - Con cobertura
npm test -- --coverage
```

### Code Quality

```bash
# Backend - Linting
pylint backend/app/

# Backend - Formatting
black backend/app/

# Frontend - Linting
eslint src/

# Frontend - Formatting
prettier --write src/
```

### Database

```bash
# Conectarse a PostgreSQL
psql -U postgres -h localhost -d nomina

# Ver estructura
\\dt                    # Ver tablas
\\d empleados          # Ver estructura de tabla
SELECT COUNT(*) FROM empleados;

# Resetear BD (cuidado)
DROP DATABASE nomina;
CREATE DATABASE nomina;
```

### Git

```bash
# Antes de cambios importantes
git status
git add .
git commit -m \"FEAT: [descripción]\"

# Ver cambios
git diff
git log --oneline
```

---

## 📚 REFERENCIA DE TIPOS

### Empleado
```typescript
interface Empleado {
  id: number;
  numero_documento: string;
  primer_nombre: string;
  primer_apellido: string;
  email?: string;
  telefono_celular?: string;
  salario_base: number;
  cargo?: string;
  departamento_empresa?: string;
  fecha_ingreso?: string;
  activo: boolean;
}
```

### Nómina
```typescript
interface Nomina {
  id: number;
  empleado_id: number;
  periodo_mes: number;
  periodo_anio: number;
  salario_devengado: number;
  salario_neto: number;
  total_deducciones: number;
  estado: string;
}
```

### Ausencia
```typescript
interface Ausencia {
  id: number;
  empleado_id: number;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  dias: number;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
}
```

---

## 🔐 VARIABLES DE ENTORNO

### Backend (.env)
```bash
DATABASE_URL=postgresql+psycopg2://postgres:password@localhost:5432/nomina
SECRET_KEY=tu-clave-secreta-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📞 ENDPOINTS PRINCIPALES

### Autenticación
```
POST   /auth/register          Crear usuario
POST   /auth/login             Login
GET    /auth/me                Usuario actual
```

### Empleados
```
GET    /empleados/             Listar todos
POST   /empleados/             Crear
GET    /empleados/{id}         Obtener por ID
PATCH  /empleados/{id}         Actualizar
DELETE /empleados/{id}         Eliminar
POST   /empleados/importar     Importar Excel
GET    /empleados/estadisticas Estadísticas
```

### Nómina
```
GET    /nominas/               Listar todas
POST   /nominas/               Crear
GET    /nominas/{id}           Obtener por ID
POST   /nominas/generar        Generar masiva
GET    /nominas/periodo/{mes}/{anio}  Por período
GET    /nominas/comprobante/{id}      Descargar PDF
```

### Ausencias
```
GET    /ausencias/             Listar
POST   /ausencias/             Crear
PATCH  /ausencias/{id}/aprobar Aprobar
PATCH  /ausencias/{id}/rechazar Rechazar
```

---

## 🐛 DEBUGGING

### Frontend
```javascript
// Verificar token
console.log(localStorage.getItem('token'));

// Verificar API URL
console.log(process.env.NEXT_PUBLIC_API_URL);

// Debugging de state
console.log('Empleados:', empleados);

// Networking
window.fetch('http://localhost:8000/empleados/')
  .then(r => r.json())
  .then(d => console.log(d));
```

### Backend
```python
# Logging
import logging
logger = logging.getLogger(__name__)
logger.info(f\"Creando empleado: {empleado}\")

# Debugging de BD
empleados = db.query(Empleado).all()
print(f\"Empleados: {len(empleados)}\")

# Verificar endpoint
from pydantic import ValidationError
```

---

## 🎯 CHECKLIST ANTES DE CADA CAMBIO

```
PRE-CAMBIO:
- [ ] Backup de BD
- [ ] Branch nuevo en Git
- [ ] Lee el documento relevante
- [ ] Identifica archivos a cambiar

DURANTE:
- [ ] Haz cambio pequeño
- [ ] Prueba inmediatamente
- [ ] Revisa consola para errores
- [ ] Commit frecuente

POST-CAMBIO:
- [ ] Frontend: F5 (refresh)
- [ ] Backend: Reinicia si es necesario
- [ ] Tests pasan
- [ ] Mensaje claro en Git
```

---

## 📊 ESTADO DE CAMBIOS

### Cambio 1: Alinear rutas de nómina
```
Archivo:    src/app/nomina/page.tsx
Líneas:     57, 77, 84
Cambio:     /nomina/ → /nominas/
Status:     ⏳ PENDIENTE
Tiempo:     5 minutos
```

### Cambio 2: Ruta de importación
```
Archivo:    src/lib/api.ts
Línea:      68
Cambio:     /importar-archivo → /importar
Status:     ⏳ PENDIENTE
Tiempo:     5 minutos
```

### Cambio 3: URLs dinámicas
```
Archivo:    src/hooks/use-empleados.ts
Línea:      15
Cambio:     Usar process.env
Status:     ⏳ PENDIENTE
Tiempo:     5 minutos
```

---

## 🚨 ERRORES COMUNES Y SOLUCIONES

| Error | Causa | Solución |
|-------|-------|----------|
| `Cannot POST /empleados/importar-archivo` | Ruta incorrecta | Verificar `src/lib/api.ts` línea 68 |
| `Cannot GET /nomina/periodo/1/2025` | Falta 's' | Cambiar `/nomina/` → `/nominas/` |
| `401 Unauthorized` | Sin token | Loguéate primero |
| `404 Not Found` | Empleado no existe | Crear empleado antes |
| `CORS Error` | Headers faltantes | Backend tiene CORS configurado |
| `Network Error` | Backend no corre | Verifica puerto 8000 |

---

## 📈 MÉTRICAS MÍNIMAS

```
✅ Cuando todo esté listo:
- 100% de rutas funcionando
- 0 errores en console
- >80% test coverage
- Todos los botones funcionales
- Documentación completa
```

---

## 🔍 VERIFICACIÓN RÁPIDA

```bash
# ¿Backend anda?
curl http://localhost:8000/health

# ¿BD conectada?
curl -H \"Authorization: Bearer {token}\" http://localhost:8000/empleados/

# ¿Frontend corre?
Abre http://localhost:9002 en navegador

# ¿Rutas correctas?
Abre Network en DevTools (F12) y verifica URLs
```

---

## 📝 NOTAS PERSONALES

Área para tus propias notas durante el desarrollo:

```
Lunes:
_____________________________________________
_____________________________________________

Martes:
_____________________________________________
_____________________________________________

Miércoles:
_____________________________________________
_____________________________________________

Jueves:
_____________________________________________
_____________________________________________

Viernes:
_____________________________________________
_____________________________________________
```

---

**Última actualización:** Enero 6, 2025  
**Próxima revisión:** Durante implementación  
**Responsable:** [Tu nombre]

