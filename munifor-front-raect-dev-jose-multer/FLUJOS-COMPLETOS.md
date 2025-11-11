# 🔄 FLUJOS COMPLETOS - MUNIFOR

> **Documento:** Flujos de usuario desde inicio hasta fin  
> **Propósito:** Entender TODOS los caminos posibles en la aplicación  
> **Para:** Compañero de equipo - Exposición de la aplicación

---

## 📋 ÍNDICE DE FLUJOS

1. [Flujo Principal: Ciudadano → Reporte Completado](#1-flujo-principal-ciudadano--reporte-completado)
2. [Flujo de Registro y Autenticación](#2-flujo-de-registro-y-autenticación)
3. [Flujo de Ciudadano](#3-flujo-de-ciudadano)
4. [Flujo de Operador](#4-flujo-de-operador)
5. [Flujo de Trabajador](#5-flujo-de-trabajador)
6. [Flujo de Administrador](#6-flujo-de-administrador)
7. [Flujos de Datos (Backend ↔ Frontend)](#7-flujos-de-datos-backend--frontend)
8. [Flujos de Imágenes](#8-flujos-de-imágenes)
9. [Flujos de Mapas](#9-flujos-de-mapas)
10. [Casos de Error](#10-casos-de-error)

---

## 1. FLUJO PRINCIPAL: Ciudadano → Reporte Completado

Este es el **flujo completo** desde que un ciudadano crea un reporte hasta que se completa.

### Diagrama Visual

```
┌─────────────┐
│  CIUDADANO  │
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│ 1. Crea Reporte          │ → Estado: "Pendiente"
│    - Título              │
│    - Descripción         │
│    - Tipo (Bache, etc)   │
│    - Ubicación (mapa)    │
│    - Imágenes (opcional) │
└──────┬───────────────────┘
       │
       ▼
┌─────────────┐
│  OPERADOR   │
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│ 2. Revisa Reporte        │ → Estado: "Revisado"
│    - Ve detalles         │
│    - Verifica ubicación  │
│    - Ve imágenes         │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ 3. Acepta Reporte        │ → Estado: "Aceptado"
│    (o Rechaza)           │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ 4. Crea Tarea            │ → Estado tarea: "Pendiente"
│    - Selecciona reportes │
│    - Selecciona cuadrilla│
│    - Define prioridad    │
└──────┬───────────────────┘
       │
       ▼
┌─────────────┐
│ TRABAJADOR  │
│  (LÍDER)    │
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│ 5. Acepta Tarea          │ → Estado tarea: "En Progreso"
│    - Ve tareas asignadas │
│    - Solo líder acepta   │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ 6. Registra Avances      │ → Progress reports creados
│    - Título avance       │
│    - Descripción         │
│    - Estado: "En Prog."  │
│    - Ubicación           │
│    - Imágenes            │
└──────┬───────────────────┘
       │ (puede repetirse varias veces)
       │
       ▼
┌──────────────────────────┐
│ 7. Marca como Finalizado │ → AUTOMÁTICO:
│    - Progress: "Finaliz."│   - Tarea → "Finalizada"
│                          │   - Todos reportes → "Completado"
└──────┬───────────────────┘
       │
       ▼
┌─────────────┐
│  CIUDADANO  │
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│ 8. Ve Reporte Completado │ ✅
│    - En "Mis Reportes"   │
│    - Estado: "Completado"│
│    - Ve imágenes finales │
└──────────────────────────┘
```

### Paso a Paso Detallado

#### 🟦 PASO 1: Ciudadano Crea Reporte

**Página:** `/citizen/reports` (CitizenReports.jsx)

**Acciones:**

1. Ciudadano hace login
2. Va a "Crear Reporte"
3. Llena formulario:
   - **Título:** "Bache grande en Av. Alberdi"
   - **Descripción:** "Bache de aproximadamente 1m de diámetro"
   - **Tipo:** Selecciona "Bache"
   - **Ubicación:** Hace clic en el mapa (lat: -26.1849, lng: -58.1756)
   - **Imágenes:** Sube 3 fotos del bache
4. Click en "Enviar Reporte"

**Backend:**

- `POST /api/report`
- Se crea reporte con `status: "Pendiente"`
- Se guardan las 3 imágenes en `uploads/reports/`

**Frontend:**

- FormData con todos los campos
- `postFetchFormData("/report", formData)`
- Muestra mensaje de éxito
- Redirige a dashboard o lista de reportes

---

#### 🟦 PASO 2: Operador Revisa Reporte

**Página:** `/operator/reports` (OperatorReports.jsx)

**Acciones:**

1. Operador hace login
2. Ve lista de reportes pendientes
3. Busca por "bache" en el buscador
4. Click en el reporte
5. Ve detalles completos:
   - Título, descripción, tipo
   - Ubicación en el mapa
   - Las 3 imágenes
   - Datos del ciudadano
6. Click en "Revisar"

**Backend:**

- `PUT /api/report/:id { status: "Revisado" }`

**Frontend:**

- `putFetch("/report", reportId, { status: "Revisado" })`
- Se actualiza el estado visual del reporte

---

#### 🟦 PASO 3: Operador Acepta Reporte

**Página:** Misma página de reportes

**Acciones:**

1. Operador decide que el reporte es válido
2. Click en "Aceptar Reporte"
3. Confirma la acción

**Backend:**

- `PUT /api/report/:id { status: "Aceptado" }`

**Frontend:**

- `putFetch("/report", reportId, { status: "Aceptado" })`
- El reporte desaparece de la lista de pendientes
- Ahora está disponible para crear tareas

---

#### 🟦 PASO 4: Operador Crea Tarea

**Página:** `/operator/create-task` (OperatorCreateTask.jsx)

**Acciones:**

1. Operador va a "Crear Tarea"
2. Ve dos columnas:
   - **Izquierda:** Reportes aceptados
   - **Derecha:** Cuadrillas disponibles
3. Selecciona reportes (puede ser más de uno):
   - Click en "Bache grande en Av. Alberdi" ✅
   - Click en "Bache en calle San Martín" ✅
4. Selecciona cuadrilla:
   - Click en "Cuadrilla Norte" ✅
5. Click en "Crear Tarea"
6. Se abre modal, llena:
   - **Título:** "Reparación de baches Zona Norte"
   - **Descripción:** "Reparar 2 baches en zona norte de la ciudad"
   - **Prioridad:** "Alta"
7. Click en "Confirmar"

**Backend:**

- `POST /api/task`
- Payload:
  ```json
  {
    "title": "Reparación de baches Zona Norte",
    "description": "...",
    "priority": "Alta",
    "report": ["507f1f77...", "507f1f77..."], // Array de IDs
    "crew": "507f1f77..." // ID de cuadrilla
  }
  ```
- Se crea tarea con `status: "Pendiente"`

**Frontend:**

- `postFetchLocalStorage("/task", payload)`
- Muestra mensaje de éxito
- Limpia selecciones

---

#### 🟦 PASO 5: Líder Acepta Tarea

**Página:** `/worker/tasks` (WorkerTasks.jsx)

**Acciones:**

1. Líder de cuadrilla hace login
2. Ve "Tareas Futuras"
3. Click en "Reparación de baches Zona Norte"
4. Ve detalles:
   - Título, descripción, prioridad
   - 2 reportes asociados
   - Ubicaciones en el mapa
5. **Solo el líder** ve botón "Aceptar Tarea"
6. Click en "Aceptar Tarea"

**Backend:**

- `PUT /api/task/assign/:id`
- Tarea pasa a `status: "En Progreso"`

**Frontend:**

- `putFetch("/task/assign", taskId)`
- La tarea se mueve de "Futuras" a "Actual"
- Todos los miembros de la cuadrilla ven la tarea actual

**Importante:**

```jsx
// Solo el líder puede aceptar
{
  leaderCrew?.toString() === user._id?.toString() && (
    <button onClick={() => handleAcceptTask(task._id)}>Aceptar Tarea</button>
  );
}
```

---

#### 🟦 PASO 6: Trabajadores Registran Avances

**Página:** `/worker/progress` (WorkerProgress.jsx)

**Acciones - DÍA 1:**

1. Trabajador va a "Registrar Avance"
2. Ve tarea actual: "Reparación de baches Zona Norte"
3. Llena formulario:
   - **Título:** "Inicio de reparación"
   - **Descripción:** "Se comenzó con la reparación del primer bache"
   - **Estado:** "En Progreso"
   - **Ubicación:** Marca en el mapa donde están trabajando
   - **Imágenes:** Sube 2 fotos del inicio del trabajo
4. Click en "Registrar Avance"

**Backend:**

- `POST /api/progress-report`
- Se crea progress report con `status: "En Progreso"`
- Se guardan las 2 imágenes

**Acciones - DÍA 2:**

1. Mismo proceso, nuevo avance:
   - **Título:** "Avance 50%"
   - **Descripción:** "Primer bache reparado, segundo en proceso"
   - **Estado:** "En Progreso"
   - **Imágenes:** Sube 3 fotos

**Acciones - DÍA 3 (FINALIZACIÓN):**

1. Líder registra avance final:
   - **Título:** "Trabajo finalizado"
   - **Descripción:** "Ambos baches reparados exitosamente"
   - **Estado:** "Finalizado" ⚠️
   - **Imágenes:** Sube 4 fotos del resultado final
2. **Aparece confirmación:**
   ```
   ¿Estás seguro de marcar esta tarea como FINALIZADA?
   Esto completará automáticamente todos los reportes asociados.
   ```
3. Click en "Aceptar"

**Backend (AUTOMÁTICO):**

```js
// Controller de backend
if (newProgressReport.status === "Finalizado") {
  // 1. Actualizar tarea a "Finalizada"
  await TaskModel.findByIdAndUpdate(taskId, {
    status: "Finalizada",
    completed_at: new Date(),
  });

  // 2. Actualizar TODOS los reportes asociados
  await ReportModel.updateMany(
    { _id: { $in: task.report } },
    {
      status: "Completado",
      completed_at: new Date(),
    }
  );
}
```

**Frontend:**

- Muestra mensaje: "✅ Tarea finalizada exitosamente. Todos los reportes asociados han sido completados."
- Redirige automáticamente a `/worker/tasks` después de 2 segundos
- La tarea desaparece de "Actual" (ya está finalizada)

---

#### 🟦 PASO 7: Ciudadano Ve Reporte Completado

**Página:** `/citizen/reportstatus` (ReportStatus.jsx)

**Acciones:**

1. Ciudadano hace login
2. Va a "Mis Reportes"
3. Ve su reporte con **Estado: "Completado" ✅**
4. Click en el reporte
5. Ve detalles completos:
   - Su descripción original
   - Sus 3 imágenes originales
   - **Progreso de la reparación:**
     - Avance 1: "Inicio de reparación" (2 imágenes)
     - Avance 2: "Avance 50%" (3 imágenes)
     - Avance 3: "Trabajo finalizado" (4 imágenes)
   - **Total:** 12 imágenes del proceso completo
   - Fecha de finalización

---

## 2. FLUJO DE REGISTRO Y AUTENTICACIÓN

### 2.1. Registro de Ciudadano

```
Usuario sin cuenta
       ↓
Página de Inicio (/)
       ↓
Click en "Registrarse"
       ↓
/register (CitizenRegister.jsx)
       ↓
Llena formulario:
  - Username: "juan123"
  - Email: "juan@example.com"
  - Password: "********"
  - Datos personales (nombre, DNI, etc.)
       ↓
Click en "Registrar"
       ↓
Backend: POST /api/auth/register
  {
    username: "juan123",
    email: "juan@example.com",
    password: "...",
    role: "Ciudadano",
    profile: { first_name, last_name, dni, ... }
  }
       ↓
Usuario creado con:
  - is_active: true (ciudadanos se activan automáticamente)
  - role: "Ciudadano"
       ↓
Redirige a /login
       ↓
Usuario puede iniciar sesión inmediatamente ✅
```

### 2.2. Registro de Operador/Trabajador/Admin

```
Usuario sin cuenta
       ↓
Va a /operator/register (o /worker/register, /admin/register)
       ↓
Llena formulario (igual que ciudadano)
       ↓
Click en "Registrar"
       ↓
Backend: POST /api/auth/register
  {
    username: "operador123",
    role: "Operador",
    ...
  }
       ↓
Usuario creado con:
  - is_active: false ⚠️ (debe ser aprobado)
  - role: "Operador"
       ↓
Redirige a /login
       ↓
Usuario NO puede iniciar sesión (is_active: false)
       ↓
ADMIN debe aprobar en /admin/registrationrequests
       ↓
Admin aprueba:
  PUT /api/user/active/:id { is_active: true }
       ↓
Usuario puede iniciar sesión ✅
```

### 2.3. Login

```
Usuario con cuenta
       ↓
/login (Login.jsx)
       ↓
Ingresa credenciales:
  - Username: "juan123"
  - Password: "********"
       ↓
Click en "Iniciar sesión"
       ↓
Backend: POST /api/auth/login
       ↓
Backend valida:
  ✅ Usuario existe
  ✅ Password correcto
  ✅ is_active: true
       ↓
Backend devuelve:
  {
    ok: true,
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
       ↓
Frontend:
  1. Guarda token en localStorage
     localStorage.setItem("token", response.token)

  2. Decodifica token
     const decoded = jwtDecode(response.token)
     // decoded = { _id: "507f...", role: "Ciudadano" }

  3. Actualiza UserContext
     setUser({ _id: decoded._id, role: decoded.role })

  4. Redirige según rol:
     - Ciudadano → /citizen/dashboard
     - Trabajador → /worker/dashboard
     - Operador → /operator/dashboard
     - Admin → /admin/dashboard
       ↓
Usuario autenticado ✅
```

### 2.4. Persistencia de Sesión

```
Usuario refresca página
       ↓
App.jsx se monta
       ↓
UserContext useEffect se ejecuta
       ↓
Lee token de localStorage
  const token = localStorage.getItem("token")
       ↓
Si existe token:
  1. Decodifica
     const decoded = jwtDecode(token)

  2. Actualiza estado
     setUser({ _id: decoded._id, role: decoded.role })
       ↓
Usuario sigue autenticado ✅

Si NO existe token:
  setUser(null)
       ↓
Usuario no autenticado
```

### 2.5. Logout

```
Usuario autenticado
       ↓
Click en "Cerrar Sesión" (en navbar)
       ↓
Frontend:
  1. Limpia localStorage
     localStorage.removeItem("token")

  2. Limpia UserContext
     setUser(null)

  3. Redirige a /login
       ↓
Usuario deslogueado ✅
```

---

## 3. FLUJO DE CIUDADANO

### 3.1. Dashboard

```
Ciudadano hace login
       ↓
/citizen/dashboard (CitizenDashboard.jsx)
       ↓
Frontend: GET /api/dashboard/citizens
       ↓
Backend devuelve:
  {
    totalReports: 5,
    pendingReports: 2,
    completedReports: 3,
    recentReports: [...]
  }
       ↓
Muestra:
  - Total de reportes creados
  - Reportes pendientes
  - Reportes completados
  - Gráfico de tipos de reportes
  - Últimos 5 reportes
```

### 3.2. Crear Reporte

```
/citizen/reports
       ↓
Llena formulario → Marca ubicación → Sube imágenes
       ↓
Click en "Enviar Reporte"
       ↓
Frontend construye FormData:
  formData.append("title", "...")
  formData.append("description", "...")
  formData.append("type_report", "Bache")
  formData.append("location[lat]", -26.1849)
  formData.append("location[lng]", -58.1756)
  selectedImages.forEach(file => formData.append("images", file))
       ↓
POST /api/report (FormData)
       ↓
Backend:
  - Guarda imágenes en uploads/reports/
  - Crea reporte con status: "Pendiente"
       ↓
Muestra mensaje: "Reporte creado exitosamente"
       ↓
Redirige a dashboard o lista de reportes
```

### 3.3. Ver Estado de Reportes

```
/citizen/reportstatus
       ↓
Frontend: GET /api/report/citizen
       ↓
Backend devuelve todos los reportes del ciudadano
       ↓
Muestra lista con filtros:
  - Buscar por título
  - Filtrar por estado (Todos, Pendiente, Completado, etc.)
  - Filtrar por tipo (Bache, Alumbrado, etc.)
       ↓
Click en un reporte
       ↓
Muestra detalles completos:
  - Título, descripción, tipo
  - Estado con badge de color
  - Ubicación en el mapa
  - Imágenes del reporte
  - SI está completado:
    - Ver todos los progress reports
    - Ver imágenes de los avances
    - Fecha de finalización
```

---

## 4. FLUJO DE OPERADOR

### 4.1. Dashboard

```
Operador hace login
       ↓
/operator/dashboard
       ↓
GET /api/dashboard/operators
       ↓
Muestra:
  - Total de reportes asignados
  - Reportes pendientes de revisión
  - Tareas creadas
  - Tareas en progreso
  - Gráficos:
    - Estados de reportes
    - Tipos de reportes
    - Prioridades de tareas
```

### 4.2. Gestionar Reportes

```
/operator/reports
       ↓
GET /api/reports/operator
       ↓
Muestra todos los reportes asignados al operador
       ↓
Puede filtrar por:
  - Estado (Pendiente, Revisado, Aceptado, Rechazado)
  - Tipo (Bache, Alumbrado, etc.)
  - Búsqueda por título
       ↓
Click en un reporte
       ↓
Ve detalles + mapa + imágenes
       ↓
Opciones:
  1. Marcar como "Revisado"
     PUT /api/report/:id { status: "Revisado" }

  2. Aceptar reporte
     PUT /api/report/:id { status: "Aceptado" }

  3. Rechazar reporte
     PUT /api/report/:id { status: "Rechazado", reject_reason: "..." }
```

### 4.3. Crear Tarea

```
/operator/create-task
       ↓
GET /api/reports/operator/accepted
       ↓
Backend devuelve:
  - Reportes aceptados
  - Cuadrillas disponibles
       ↓
Operador selecciona:
  - 1 o más reportes (click en cada uno)
  - 1 cuadrilla (solo una)
       ↓
Click en "Crear Tarea"
       ↓
Se abre modal CreateTaskModal
       ↓
Llena:
  - Título: "Reparación de alumbrado zona sur"
  - Descripción: "..."
  - Prioridad: "Alta"
       ↓
Click en "Confirmar"
       ↓
POST /api/task
  {
    title: "...",
    description: "...",
    priority: "Alta",
    report: ["507f...", "507f..."], // Array de IDs
    crew: "507f..." // ID único
  }
       ↓
Tarea creada con status: "Pendiente"
       ↓
Cuadrilla la ve en /worker/tasks
```

### 4.4. Ver Mapa

```
/operator/map
       ↓
GET /api/map/operator-data
       ↓
Backend devuelve SOLO datos asignados al operador:
  - Reportes aceptados por él
  - Tareas creadas por él
  - Progress de esas tareas
       ↓
Muestra mapa con marcadores
       ↓
Puede filtrar por:
  - Tipo de dato (Reports, Tasks, Progress)
  - Estado
  - Tipo
  - Rango de tiempo (últimas 24h, 7d, etc.)
       ↓
Click en marcador → Popup con detalles
```

---

## 5. FLUJO DE TRABAJADOR

### 5.1. Dashboard

```
Trabajador hace login
       ↓
/worker/dashboard
       ↓
GET /api/dashboard/workers
       ↓
Muestra:
  - Tarea actual (si tiene)
  - Total de tareas completadas
  - Avances registrados
  - Estado de la cuadrilla
```

### 5.2. Ver Tareas

```
/worker/tasks
       ↓
GET /api/task/worker
       ↓
Backend devuelve:
  - Tareas asignadas a su cuadrilla
  - Datos de la cuadrilla
  - ID del líder
       ↓
Frontend separa:
  - Tarea actual (status: "En Progreso")
  - Tareas futuras (status: "Pendiente")
       ↓
Click en una tarea → Ve detalles
       ↓
SI es el líder Y NO hay tarea actual:
  Muestra botón "Aceptar Tarea"
       ↓
Click en "Aceptar Tarea"
       ↓
PUT /api/task/assign/:id
       ↓
Tarea pasa a "En Progreso"
       ↓
Todos los trabajadores ven la tarea actual
```

### 5.3. Registrar Avance

```
/worker/progress
       ↓
GET /api/task/worker
       ↓
Busca tarea con status: "En Progreso"
       ↓
Si NO hay tarea actual:
  Muestra mensaje: "No tienes ninguna tarea en progreso"
  Botón: "Acepta una tarea"
       ↓
Si HAY tarea actual:
  Muestra formulario de avance
       ↓
Trabajador llena:
  - Título: "Avance día 1"
  - Descripción: "..."
  - Estado: "En Progreso" (o "Finalizado")
  - Marca ubicación en el mapa
  - Sube imágenes (opcional)
       ↓
Click en "Registrar Avance"
       ↓
SI estado es "Finalizado":
  Muestra confirmación:
  "¿Estás seguro de marcar esta tarea como FINALIZADA?
   Esto completará automáticamente todos los reportes asociados."
       ↓
Click en "Aceptar"
       ↓
FormData con todos los campos + imágenes
       ↓
POST /api/progress-report
       ↓
Backend:
  - Guarda imágenes
  - Crea progress report

  SI status es "Finalizado":
    1. Actualiza tarea a "Finalizada"
    2. Actualiza TODOS los reportes a "Completado"
       ↓
Muestra mensaje de éxito
       ↓
SI fue finalizado:
  Redirige a /worker/tasks después de 2 segundos
```

### 5.4. Ver Historial de Avances

```
/worker/progress-history
       ↓
GET /api/progress/worker
       ↓
Muestra todos los avances registrados por el trabajador
       ↓
Puede filtrar por:
  - Tarea
  - Estado
  - Fecha
       ↓
Click en un avance → Ve detalles + imágenes
```

---

## 6. FLUJO DE ADMINISTRADOR

### 6.1. Dashboard

```
Admin hace login
       ↓
/admin/dashboard
       ↓
GET /api/dashboard/admin
       ↓
Muestra:
  - Total de usuarios
  - Total de reportes
  - Total de tareas
  - Usuarios pendientes de aprobación
  - Gráficos generales del sistema
```

### 6.2. Aprobar Registros

```
/admin/registrationrequests
       ↓
GET /api/user/inactive
       ↓
Muestra usuarios con is_active: false
       ↓
Click en un usuario → Ve datos completos
       ↓
Opciones:
  1. Aprobar
     PUT /api/user/active/:id { is_active: true }

  2. Rechazar
     DELETE /api/user/:id
       ↓
Usuario aprobado puede hacer login
```

### 6.3. Ver Mapa Global

```
/admin/map
       ↓
GET /api/map/data
       ↓
Backend devuelve TODOS los datos del sistema:
  - Todos los reportes
  - Todas las tareas
  - Todos los progress
       ↓
Muestra mapa con marcadores
       ↓
Puede filtrar por:
  - Tipo de dato
  - Estado
  - Operador asignado
  - Fecha
       ↓
Click en marcador → Popup con detalles completos
```

### 6.4. Buscar Perfiles

```
/admin/profilesearch
       ↓
Busca usuarios por:
  - Username
  - Email
  - DNI
       ↓
GET /api/user/search?query=juan
       ↓
Muestra resultados
       ↓
Click en usuario → Ve perfil completo
       ↓
Puede:
  - Ver datos personales
  - Ver estadísticas del usuario
  - Desactivar/activar cuenta
  - Cambiar rol (con cuidado)
```

---

## 7. FLUJOS DE DATOS (Backend ↔ Frontend)

### 7.1. Petición GET Simple

```
Frontend                          Backend
   │                                 │
   │  GET /api/reports               │
   │  Authorization: Bearer token    │
   │────────────────────────────────>│
   │                                 │
   │         Valida token            │
   │         Busca reportes en DB    │
   │                                 │
   │  { ok: true, reports: [...] }   │
   │<────────────────────────────────│
   │                                 │
   │  setState(data.reports)         │
   │                                 │
```

### 7.2. Petición POST JSON

```
Frontend                          Backend
   │                                 │
   │  POST /api/auth/login           │
   │  Content-Type: application/json │
   │  { username, password }         │
   │────────────────────────────────>│
   │                                 │
   │         Valida credenciales     │
   │         Genera JWT token        │
   │                                 │
   │  { ok: true, token: "..." }     │
   │<────────────────────────────────│
   │                                 │
   │  localStorage.setItem(token)    │
   │  jwtDecode(token)               │
   │  setUser({ _id, role })         │
   │  navigate(dashboard)            │
   │                                 │
```

### 7.3. Petición POST FormData (Imágenes)

```
Frontend                          Backend
   │                                 │
   │  POST /api/report               │
   │  Authorization: Bearer token    │
   │  Content-Type: (auto)           │
   │  FormData:                      │
   │    - title: "Bache"             │
   │    - images: [File, File]       │
   │────────────────────────────────>│
   │                                 │
   │         Multer procesa archivos │
   │         Guarda en uploads/      │
   │         Crea reporte en DB      │
   │                                 │
   │  {                              │
   │    ok: true,                    │
   │    report: {                    │
   │      images: ["uploads/.."]     │
   │    }                            │
   │  }                              │
   │<────────────────────────────────│
   │                                 │
```

### 7.4. Petición PUT

```
Frontend                          Backend
   │                                 │
   │  PUT /api/report/507f...        │
   │  Authorization: Bearer token    │
   │  { status: "Aceptado" }         │
   │────────────────────────────────>│
   │                                 │
   │         Valida permisos         │
   │         Actualiza reporte       │
   │                                 │
   │  { ok: true, report: {...} }    │
   │<────────────────────────────────│
   │                                 │
   │  Actualiza estado local         │
   │                                 │
```

---

## 8. FLUJOS DE IMÁGENES

### 8.1. Subir Imágenes en Reporte

```
Ciudadano selecciona imágenes
       ↓
ImageUploader valida:
  ✅ Máximo 5 archivos
  ✅ Formatos permitidos (jpg, png, gif, webp)
  ✅ Tamaño máximo 15MB por archivo
       ↓
Crea previews con URL.createObjectURL()
       ↓
onFilesChange([file1, file2, file3])
       ↓
CitizenReports guarda en estado:
  setSelectedImages([file1, file2, file3])
       ↓
Al hacer submit:
  const formData = new FormData()
  selectedImages.forEach(file => {
    formData.append("images", file)
  })
       ↓
POST /api/report (FormData)
       ↓
Backend (Multer):
  1. Recibe archivos
  2. Valida formato y tamaño
  3. Genera nombres únicos:
     report-1699564800000-123456789.jpg
  4. Guarda en uploads/reports/
  5. Devuelve rutas en el response
       ↓
Frontend recibe:
  {
    ok: true,
    report: {
      images: [
        "uploads/reports/report-1699564800000-111.jpg",
        "uploads/reports/report-1699564800000-222.jpg",
        "uploads/reports/report-1699564800000-333.jpg"
      ]
    }
  }
       ↓
Para mostrar las imágenes:
  <img src={`http://localhost:3000/${report.images[0]}`} />
```

### 8.2. Mostrar Imágenes Guardadas

```
Frontend hace GET /api/report/:id
       ↓
Backend devuelve reporte con:
  {
    _id: "507f...",
    title: "Bache en Av. Alberdi",
    images: [
      "uploads/reports/report-1699564800000-111.jpg",
      "uploads/reports/report-1699564800000-222.jpg"
    ]
  }
       ↓
Frontend renderiza:
  {report.images.map((img, index) => (
    <img
      key={index}
      src={`http://localhost:3000/${img}`}
      alt={`Imagen ${index + 1}`}
    />
  ))}
       ↓
Navegador carga imágenes desde:
  http://localhost:3000/uploads/reports/report-1699564800000-111.jpg
  http://localhost:3000/uploads/reports/report-1699564800000-222.jpg
```

---

## 9. FLUJOS DE MAPAS

### 9.1. Marcar Ubicación (Ciudadano)

```
Ciudadano en /citizen/reports
       ↓
Ve componente CitizenLeafletMap
       ↓
MapContainer renderiza mapa
       ↓
Ciudadano hace click en el mapa
       ↓
MapClickHandler captura evento:
  const { lat, lng } = e.latlng
  setMarkerPosition([lat, lng])
  onMarkerChange([lat, lng])
       ↓
CitizenReports recibe [lat, lng]
       ↓
Al hacer submit:
  formData.append("location[lat]", lat)
  formData.append("location[lng]", lng)
       ↓
Backend guarda:
  {
    location: {
      type: "Point",
      coordinates: [lng, lat], // OJO: MongoDB usa [lng, lat]
      lat: lat,
      lng: lng
    }
  }
```

### 9.2. Ver Marcadores en Mapa (Operador/Admin)

```
Operador en /operator/map
       ↓
GlobalLeafletMap se monta
       ↓
useEffect:
  const endpoint = role === "Operador"
    ? "/map/operator-data"
    : "/map/data"
  const data = await getFetchData(endpoint)
       ↓
Backend devuelve:
  {
    reports: [
      { _id, title, location: { lat, lng }, ... },
      ...
    ],
    tasks: [...],
    progress: [...]
  }
       ↓
Frontend filtra datos sin ubicación:
  reports.filter(r => r.location?.lat && r.location?.lng)
       ↓
Renderiza marcadores:
  {filteredReports.map(report => (
    <Marker
      position={[report.location.lat, report.location.lng]}
    >
      <Popup>
        <h3>{report.title}</h3>
        <p>{report.description}</p>
        <StatusBadge status={report.status} />
      </Popup>
    </Marker>
  ))}
       ↓
Usuario hace click en marcador
       ↓
Popup se abre con detalles
```

### 9.3. Filtros en Mapa

```
Operador selecciona filtros:
  - Tipo: "Reports"
  - Estado: "Aceptado"
  - Tiempo: "últimas 24h"
       ↓
useFilter.filterForMap(data, {
  dataType: "report",
  status: "Aceptado",
  timeRange: "24h"
})
       ↓
Hook aplica filtros en orden:
  1. Selecciona solo reports
  2. Filtra por tiempo (created_at)
  3. Filtra por estado
       ↓
Devuelve array filtrado
       ↓
Solo renderiza marcadores de reportes aceptados
de las últimas 24 horas
```

---

## 10. CASOS DE ERROR

### 10.1. Token Inválido o Expirado

```
Usuario hace petición
       ↓
Frontend: GET /api/reports
       ↓
Backend valida token
       ↓
Token inválido o expirado
       ↓
Backend: { ok: false, msg: "Token inválido" }
       ↓
Frontend en useFetch:
  if (!response.ok) {
    // Limpiar localStorage
    localStorage.removeItem("token")
    // Redirigir a login
    window.location.replace("/login")
  }
```

### 10.2. Usuario Intenta Aceptar Tarea sin Ser Líder

```
Trabajador (no líder) en /worker/tasks
       ↓
Ve tarea futura
       ↓
Frontend verifica:
  leaderCrew?.toString() === user._id?.toString()
       ↓
Resultado: false
       ↓
NO muestra botón "Aceptar Tarea"
       ↓
Solo el líder ve el botón ✅
```

### 10.3. Subir Imagen Muy Grande

```
Usuario selecciona imagen de 20MB
       ↓
ImageUploader valida:
  if (file.size > maxSizeBytes) {
    newErrors.push(`${file.name}: excede 15MB`)
  }
       ↓
Muestra error en UI:
  <div className="bg-red-50">
    <p>foto.jpg: tamaño excede 15MB (20.5MB)</p>
  </div>
       ↓
NO agrega archivo a validFiles
       ↓
onFilesChange recibe array vacío
       ↓
No se sube ningún archivo ❌
```

### 10.4. Intentar Marcar Tarea como Finalizada sin Ubicación

```
Trabajador en /worker/progress
       ↓
Llena formulario pero NO marca ubicación
       ↓
Click en "Registrar Avance"
       ↓
onSubmit verifica:
  if (!markerPosition) {
    alert("Por favor, marca tu ubicación en el mapa")
    return
  }
       ↓
No hace petición al backend
       ↓
Usuario debe marcar ubicación ⚠️
```

### 10.5. Operador Intenta Crear Tarea sin Seleccionar Cuadrilla

```
Operador en /operator/create-task
       ↓
Selecciona reportes pero NO selecciona cuadrilla
       ↓
Click en "Crear Tarea"
       ↓
CreateTaskModal se abre
       ↓
handleFormSubmit construye payload:
  {
    title: "...",
    crew: null ❌
  }
       ↓
Backend valida:
  if (!crew) {
    return res.status(400).json({
      ok: false,
      msg: "Debes seleccionar una cuadrilla"
    })
  }
       ↓
Frontend muestra error:
  "Debes seleccionar una cuadrilla"
```

---

## 🎯 RESUMEN EJECUTIVO PARA LA EXPOSICIÓN

### Flujo Completo en 1 Minuto

1. **Ciudadano** crea reporte con ubicación e imágenes → Estado: "Pendiente"
2. **Operador** revisa y acepta reporte → Estado: "Aceptado"
3. **Operador** crea tarea asignando reportes a cuadrilla → Estado tarea: "Pendiente"
4. **Líder** de cuadrilla acepta tarea → Estado tarea: "En Progreso"
5. **Trabajadores** registran avances con fotos
6. **Líder** marca tarea como "Finalizado" → **AUTOMÁTICO:**
   - Tarea → "Finalizada"
   - Reportes → "Completado"
7. **Ciudadano** ve su reporte completado con todas las fotos del proceso ✅

### Actores Principales

- **4 Roles:** Ciudadano, Trabajador, Operador, Administrador
- **Cada uno tiene dashboard propio**
- **Cada uno ve solo sus datos (excepto Admin)**

### Tecnologías Clave

- **React 19** + React Router para UI
- **Leaflet** para mapas interactivos
- **Multer** (backend) para imágenes
- **JWT** para autenticación
- **Tailwind** para estilos (TU PARTE)

### Ciclo de Vida de Datos

```
Reporte: Pendiente → Revisado → Aceptado → Completado
Tarea: Pendiente → En Progreso → Finalizada
Progress: En Progreso → Finalizado
```

### Flujos Críticos

1. **Autenticación:** Login → Token → UserContext → Redirige según rol
2. **Reportes:** Ciudadano crea → Operador gestiona → Trabajador resuelve
3. **Imágenes:** Frontend FormData → Backend Multer → Guardar → Servir
4. **Mapas:** Marcar ubicación → Enviar coords → Mostrar marcadores → Filtrar

---

**¡Todo funciona! Ahora dale color y vida con Tailwind! 🎨**
