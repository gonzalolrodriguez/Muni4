# 🏛️ MUNIFOR - Sistema Municipal de Gestión de Reportes

## 📊 Resumen Ejecutivo

**MuniFor** es una aplicación web completa de gestión municipal diseñada para conectar ciudadanos con el gobierno local, facilitando el reporte, seguimiento y resolución de problemas urbanos. Es un sistema multi-rol que gestiona el flujo de trabajo desde que un ciudadano reporta un problema hasta que un equipo de trabajadores lo resuelve.

---

## 🏗️ Arquitectura de la Aplicación

### Stack Tecnológico

| Tecnología       | Versión     | Propósito                      |
| ---------------- | ----------- | ------------------------------ |
| React            | 19.0.0-rc.1 | Framework principal            |
| Vite             | 7.1.7       | Build tool y dev server        |
| React Router DOM | 7.9.5       | Routing y navegación           |
| Tailwind CSS     | 4.1.16      | Estilos y diseño               |
| React Hook Form  | 7.65.0      | Manejo de formularios          |
| Zod              | 4.1.12      | Validación de esquemas         |
| Leaflet          | 1.9.4       | Mapas interactivos             |
| React Leaflet    | 5.0.0-rc.2  | Integración de mapas con React |
| Chart.js         | 4.5.1       | Gráficas y visualizaciones     |
| React Chartjs 2  | 5.3.1       | Componentes de gráficas        |
| Headless UI      | 2.2.9       | Componentes UI accesibles      |
| JWT Decode       | 4.0.0       | Decodificación de tokens       |

### Estructura del Proyecto

```
munifor-front-react/
├── public/                    # Recursos públicos estáticos
├── src/
│   ├── assets/               # Imágenes y recursos
│   │   └── img/
│   ├── components/           # Componentes reutilizables
│   │   ├── Chart/           # Componentes de gráficas
│   │   ├── details/         # Componentes de detalles
│   │   ├── LeafletMaps/     # Componentes de mapas
│   │   └── navbars/         # Barras de navegación
│   ├── context/             # Context API - Estado global
│   ├── hooks/               # Custom hooks
│   ├── layout/              # Layouts por rol
│   ├── pages/               # Páginas organizadas por rol
│   │   ├── Admin/          # Páginas del administrador
│   │   ├── Citizen/        # Páginas del ciudadano
│   │   ├── General/        # Páginas públicas
│   │   ├── Operator/       # Páginas del operador
│   │   └── Worker/         # Páginas del trabajador
│   ├── schemas/            # Esquemas de validación Zod
│   ├── App.jsx            # Componente principal
│   ├── index.css          # Estilos globales
│   └── main.jsx           # Punto de entrada
├── package.json
├── vite.config.js
└── README.md
```

---

## 👥 Sistema de Roles y Permisos

### 1. 🏘️ CIUDADANO (Citizen)

**Rol:** Usuario final que reporta problemas urbanos.

#### Capacidades

- ✅ Crear reportes de problemas urbanos con geolocalización
- ✅ Ver estado de sus reportes en tiempo real
- ✅ Dashboard personalizado con estadísticas
- ✅ Buscar y filtrar reportes propios
- ✅ Editar perfil personal
- ✅ Contactar a la municipalidad

#### Páginas Disponibles

| Ruta                    | Componente       | Descripción                             |
| ----------------------- | ---------------- | --------------------------------------- |
| `/citizen/dashboard`    | CitizenDashboard | Vista general y estadísticas personales |
| `/citizen/reports`      | CitizenReports   | Formulario para crear nuevos reportes   |
| `/citizen/reportstatus` | ReportStatus     | Estado y seguimiento de reportes        |
| `/citizen/profile`      | CitizenProfile   | Perfil y datos personales               |
| `/citizen/contact`      | Contact          | Formulario de contacto municipal        |

#### Tipos de Reportes

- 🕳️ **Baches** - Problemas en pavimento
- 💡 **Alumbrado** - Fallas en alumbrado público
- 🗑️ **Basura** - Acumulación de residuos
- ⚠️ **Incidente** - Situaciones de emergencia
- 📝 **Otro** - Con especificación personalizada

#### Estados de Reportes que Puede Ver

1. **Pendiente** 🟡 - Reporte recién creado
2. **Revisado** 🔵 - Operador revisó el reporte
3. **Aceptado** 🟢 - Reporte convertido en tarea
4. **Completado** ✅ - Problema resuelto
5. **Rechazado** 🔴 - Reporte no procedente

---

### 2. 👷 TRABAJADOR (Worker)

**Rol:** Personal de campo que ejecuta las tareas asignadas.

#### Capacidades

- ✅ Ver tareas asignadas a su equipo
- ✅ Diferenciar entre tarea actual y tareas futuras
- ✅ Reportar progreso de trabajo con evidencias
- ✅ Ver historial de trabajos completados
- ✅ Consultar información del equipo
- ✅ Subir imágenes de avances

#### Páginas Disponibles

| Ruta                       | Componente            | Descripción                         |
| -------------------------- | --------------------- | ----------------------------------- |
| `/worker/dashboard`        | WorkerDashboard       | Estadísticas de tareas              |
| `/worker/tasks`            | WorkerTasks           | Tareas asignadas (actual y futuras) |
| `/worker/progress`         | WorkerProgress        | Formulario de reporte de avances    |
| `/worker/progress-history` | WorkerProgressHistory | Historial de progresos reportados   |
| `/worker/history`          | WorkerHistory         | Historial completo de trabajos      |
| `/worker/team`             | WorkerTeam            | Información del equipo              |
| `/worker/profile`          | WorkerProfile         | Perfil personal                     |

#### Estados de Tareas

- **Pendiente** - Tarea asignada pero no iniciada
- **En Progreso** - Tarea actual en ejecución
- **Finalizada** - Tarea completada

---

### 3. 👨‍💼 OPERADOR (Operator)

**Rol:** Gestor intermedio que coordina reportes y asigna tareas.

#### Capacidades

- ✅ Gestionar todos los reportes ciudadanos
- ✅ Revisar, aceptar o rechazar reportes
- ✅ Crear tareas basadas en reportes aceptados
- ✅ Asignar tareas a equipos de trabajo (crews)
- ✅ Crear y gestionar equipos de trabajadores
- ✅ Monitorear progreso de trabajadores
- ✅ Visualizar reportes en mapa interactivo
- ✅ Generar estadísticas operacionales
- ✅ Buscar y filtrar reportes por múltiples criterios

#### Páginas Disponibles

| Ruta                        | Componente             | Descripción                      |
| --------------------------- | ---------------------- | -------------------------------- |
| `/operator/dashboard`       | OperatorDashboard      | Vista general operativa          |
| `/operator/reports`         | OperatorReports        | Gestión completa de reportes     |
| `/operator/tasks`           | OperatorTasks          | Crear y asignar tareas           |
| `/operator/teams`           | OperatorTeams          | Gestión de equipos de trabajo    |
| `/operator/map`             | OperatorMap            | Mapa con ubicaciones de reportes |
| `/operator/statistics`      | OperatorStatistics     | Estadísticas y métricas          |
| `/operator/worker-progress` | OperatorWorkerProgress | Seguimiento de trabajadores      |
| `/operator/profile`         | OperatorProfile        | Perfil personal                  |

#### Flujo de Trabajo del Operador

```
1. Recibe reportes ciudadanos (Estado: Pendiente)
   ↓
2. Revisa el reporte → Cambia a "Revisado"
   ↓
3. Evalúa procedencia del reporte
   ↓
4a. ACEPTA → Convierte en tarea → Asigna equipo
4b. RECHAZA → Cierra el reporte
```

---

### 4. 🛡️ ADMINISTRADOR (Admin)

**Rol:** Supervisor con acceso total al sistema.

#### Capacidades

- ✅ Acceso completo a todas las funcionalidades
- ✅ Aprobar/rechazar solicitudes de registro de personal
- ✅ Gestionar todos los usuarios del sistema
- ✅ Ver estadísticas globales del sistema
- ✅ Vista panorámica (GlobalView)
- ✅ Búsqueda avanzada de perfiles
- ✅ Visualizar mapa con todos los reportes
- ✅ Supervisión completa del sistema

#### Páginas Disponibles

| Ruta                          | Componente           | Descripción                       |
| ----------------------------- | -------------------- | --------------------------------- |
| `/admin/dashboard`            | AdminDashboard       | Dashboard administrativo completo |
| `/admin/statistics`           | AdminStatistics      | Estadísticas y análisis globales  |
| `/admin/map`                  | AdminMap             | Mapa con todos los reportes       |
| `/admin/registrationrequests` | RegistrationRequests | Aprobar solicitudes de registro   |
| `/admin/profilesearch`        | AdminProfileSearch   | Búsqueda de usuarios              |
| `/admin/globalview`           | AdminGlobalView      | Vista panorámica del sistema      |
| `/admin/profile`              | AdminProfile         | Perfil personal                   |

#### Métricas del Dashboard

- 👥 Total de usuarios en el sistema
- 📋 Total de reportes registrados
- ⚠️ Reportes pendientes de atención
- ✅ Reportes completados
- 🔧 Trabajadores activos
- 👨‍💼 Operadores activos
- 📊 Tasa de eficiencia global

---

## 🔐 Sistema de Autenticación

### Arquitectura de Seguridad

```
Usuario → Registro → Validación → Aprobación Admin → Login → JWT Token
```

### Flujo de Autenticación

#### 1. Registro de Usuario

```javascript
POST /api/auth/register
Body: {
  username: string,
  email: string,
  password: string,
  confirmpassword: string,
  role: string,
  profile: {
    first_name: string,
    last_name: string,
    age: number,
    dni: string,
    phone: string,
    address: string,
    sex: string
  }
}
```

#### 2. Inicio de Sesión

```javascript
POST /api/auth/login
Body: {
  username: string,
  password: string
}

Response: {
  ok: true,
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Gestión de Token

- Token se almacena en `localStorage`
- Se decodifica para extraer `_id` y `role`
- Se incluye en cada request: `Authorization: Bearer <token>`
- UserContext mantiene el estado global del usuario

#### 4. Protección de Rutas

```javascript
// En useFetch.js
const token = localStorage.getItem("token");
if (!token) {
  window.location.replace("/login");
  return;
}
```

### Context API - UserContext

```javascript
{
  user: {
    _id: string,
    role: "Ciudadano" | "Trabajador" | "Operador" | "Administrador"
  },
  setUser: function
}
```

---

## 🗺️ Sistema de Mapas con Leaflet

### Componentes de Mapas

#### 1. CitizenLeafletMap

**Propósito:** Permitir al ciudadano seleccionar la ubicación del reporte.

**Características:**

- Geolocalización automática del usuario
- Marcador arrastrable
- Click en mapa para cambiar ubicación
- Muestra coordenadas en tiempo real

**Uso:**

```jsx
<CitizenLeafletMap onMarkerChange={handleMarkerChange} />
```

#### 2. OperatorLeafletMap

**Propósito:** Vista de todos los reportes para operadores.

**Características:**

- Múltiples marcadores (uno por reporte)
- Popup con información del reporte
- Filtrado por tipo de reporte
- Clustering de marcadores cercanos

#### 3. ReportLeafletMap

**Propósito:** Vista detallada de un reporte específico.

**Características:**

- Marcador fijo en ubicación del reporte
- Botón "Cómo llegar" integrado con Google Maps
- Vista de solo lectura

#### 4. MapClickHandler

**Propósito:** Capturar eventos de click en el mapa.

```jsx
const MapClickHandler = ({ onClickPosition }) => {
  useMapEvent("click", (e) => {
    onClickPosition([e.latlng.lat, e.latlng.lng]);
  });
  return null;
};
```

### Estructura de Coordenadas

```javascript
location: {
  lat: -26.18489,  // Latitud
  lng: -58.17214   // Longitud (Formosa, Argentina)
}
```

### Integración con Google Maps

```javascript
const handleGetDirections = () => {
  const { lat, lng } = report.location;
  const url = `https://www.google.com/maps?q=${lat},${lng}`;
  window.open(url, "_blank");
};
```

---

## 📊 Sistema de Estadísticas y Visualizaciones

### Gráficas Implementadas

#### 1. ReportStatusPieChart

**Tipo:** Gráfica de pastel (Pie Chart)
**Datos:** Distribución de reportes por estado

```javascript
Labels: ["Pendiente", "Revisado", "Aceptado", "Completado", "Rechazado"];
Colores: ["#fbbf24", "#60a5fa", "#34d399", "#818cf8", "#f87171"];
```

#### 2. ReportTypeBarChart

**Tipo:** Gráfica de barras (Bar Chart)
**Datos:** Cantidad de reportes por tipo

```javascript
Labels: ["Bache", "Alumbrado", "Basura", "Otro"];
```

#### 3. UserRoleBarChart

**Tipo:** Gráfica de barras
**Datos:** Distribución de usuarios por rol

```javascript
Labels: ["Ciudadano", "Trabajador", "Operador", "Administrador"];
```

#### 4. MonthlyLineChart

**Tipo:** Gráfica de líneas (Line Chart)
**Datos:** Tendencias mensuales de reportes

---

## 🔧 Custom Hooks

### useFetch.js

Hook principal para todas las peticiones HTTP al backend.

#### Configuración

```javascript
const hostPort = "http://localhost:3000/api";
```

#### Funciones Disponibles

##### GET con autenticación

```javascript
const { getFetchData } = useFetch();
const data = await getFetchData("/reports");
```

##### GET por ID

```javascript
const { getByIdFetch } = useFetch();
const data = await getByIdFetch("/user", userId);
```

##### POST sin autenticación

```javascript
const { postFetch } = useFetch();
const data = await postFetch("/auth/login", { username, password });
```

##### POST con autenticación

```javascript
const { postFetchLocalStorage } = useFetch();
const data = await postFetchLocalStorage("/report", reportData);
```

##### PUT con autenticación

```javascript
const { putFetch } = useFetch();
const data = await putFetch("/report/review", reportId, payload);
```

##### PATCH con autenticación

```javascript
const { patchFetch } = useFetch();
const data = await patchFetch("/user/update", userData);
```

##### DELETE con autenticación

```javascript
const { deleteFetch } = useFetch();
const data = await deleteFetch("/report", reportId);
```

#### Manejo de Errores

- Validación automática de token
- Redirección a `/login` si no hay token
- Propagación de errores con mensajes descriptivos

### useFilter.js

Hook para filtrado de datos (pendiente de implementación).

---

## 📋 Schemas de Validación con Zod

### RegisterSchema.js

Validación completa para registro de usuarios.

```javascript
{
  username: string (min: 3, max: 20),
  email: string (email válido),
  password: string (min: 8, mayúscula, minúscula, número),
  confirmpassword: string (debe coincidir),
  first_name: string,
  last_name: string,
  age: number (min: 18, max: 100),
  dni: string (8 dígitos),
  phone: string (formato teléfono),
  address: string,
  sex: "Masculino" | "Femenino" | "Otro"
}
```

### LoginSchema.js

```javascript
{
  username: string (min: 3),
  password: string (min: 8)
}
```

### ReportSchema.js

```javascript
{
  title: string (min: 5, max: 100),
  description: string (min: 10, max: 500),
  type_report: "Bache" | "Alumbrado" | "Basura" | "Incidente" | "Otro",
  other_type_detail: string (requerido si type_report === "Otro"),
  image: File (opcional)
}
```

### TaskSchema.js

```javascript
{
  equipo: string (ObjectId de MongoDB válido: /^[a-f0-9]{24}$/)
}
```

### CrewSchema.js

```javascript
{
  name: string (min: 3, max: 50),
  members: array de ObjectIds,
  description: string (opcional)
}
```

### UpdatePasswordSchema.js

```javascript
{
  currentPassword: string,
  newPassword: string (min: 8, con requisitos),
  confirmNewPassword: string (debe coincidir)
}
```

---

## 📡 API Endpoints

### Autenticación

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
PUT  /api/auth/update-password
```

### Reportes

```http
GET    /api/reports                # Todos los reportes
GET    /api/reports/author         # Reportes del usuario logueado
GET    /api/reports/accepted       # Reportes aceptados
POST   /api/report                 # Crear nuevo reporte
PUT    /api/report/review/:id      # Marcar como revisado
PUT    /api/report/accept/:id      # Aceptar reporte
PUT    /api/report/reject/:id      # Rechazar reporte
DELETE /api/report/:id             # Eliminar reporte
```

### Tareas

```http
GET    /api/task                   # Todas las tareas
GET    /api/task/worker            # Tareas del trabajador logueado
POST   /api/task                   # Crear nueva tarea
PUT    /api/task/:id               # Actualizar tarea
DELETE /api/task/:id               # Eliminar tarea
```

### Equipos (Crews)

```http
GET    /api/crew                   # Todos los equipos
POST   /api/crew                   # Crear equipo
PUT    /api/crew/:id               # Actualizar equipo
DELETE /api/crew/:id               # Eliminar equipo
```

### Usuarios

```http
GET    /api/user/:id               # Usuario por ID
GET    /api/user/requests          # Solicitudes de registro pendientes
GET    /api/worker                 # Lista de trabajadores
POST   /api/user/request/:id/accept  # Aprobar solicitud
POST   /api/user/request/:id/reject  # Rechazar solicitud
```

### Dashboard

```http
GET    /api/dashboard/citizens     # Estadísticas para ciudadano
GET    /api/dashboard/workers      # Estadísticas para trabajador
GET    /api/dashboard/operators    # Estadísticas para operador
GET    /api/dashboard/admins       # Estadísticas para administrador
```

### Progreso

```http
GET    /api/progress-report        # Todos los reportes de progreso
POST   /api/progress-report        # Crear reporte de progreso
GET    /api/progress-report/worker # Progresos del trabajador
```

---

## 🔄 Flujo de Trabajo del Sistema

### Ciclo de Vida de un Reporte

```
┌─────────────────────────────────────────────────────────┐
│                    FASE 1: CREACIÓN                     │
└─────────────────────────────────────────────────────────┘
    👤 CIUDADANO
    ↓
    1. Accede a /citizen/reports
    2. Completa formulario:
       - Título
       - Descripción
       - Tipo de reporte
       - Ubicación (mapa)
       - Imagen (opcional)
    3. Envía reporte
    ↓
    📋 Estado: "Pendiente" 🟡

┌─────────────────────────────────────────────────────────┐
│                    FASE 2: REVISIÓN                     │
└─────────────────────────────────────────────────────────┘
    👨‍💼 OPERADOR
    ↓
    1. Ve reporte en /operator/reports
    2. Abre detalles del reporte
    3. Revisa información y ubicación
    ↓
    📋 Estado: "Revisado" 🔵

┌─────────────────────────────────────────────────────────┐
│                   FASE 3: EVALUACIÓN                    │
└─────────────────────────────────────────────────────────┘
    👨‍💼 OPERADOR evalúa
    ↓
    ┌────────────────┬────────────────┐
    │   ACEPTAR      │   RECHAZAR     │
    └────────────────┴────────────────┘
         ↓                    ↓
    🟢 "Aceptado"        🔴 "Rechazado"
         ↓                    ↓
    Continúa flujo       FIN DEL FLUJO

┌─────────────────────────────────────────────────────────┐
│                FASE 4: CREACIÓN DE TAREA                │
└─────────────────────────────────────────────────────────┘
    👨‍💼 OPERADOR
    ↓
    1. Accede a /operator/tasks
    2. Crea tarea basada en reporte:
       - Título
       - Reporte asociado
       - Equipo asignado
       - Prioridad
    3. Asigna tarea a equipo

┌─────────────────────────────────────────────────────────┐
│                  FASE 5: EJECUCIÓN                      │
└─────────────────────────────────────────────────────────┘
    👷 TRABAJADOR
    ↓
    1. Ve tarea en /worker/tasks
    2. Trabaja en el problema
    3. Reporta progreso en /worker/progress:
       - Título del avance
       - Descripción del trabajo
       - Imágenes de evidencia
       - Estado actual
    ↓
    📊 Operador monitorea en /operator/worker-progress

┌─────────────────────────────────────────────────────────┐
│                  FASE 6: FINALIZACIÓN                   │
└─────────────────────────────────────────────────────────┘
    👷 TRABAJADOR marca tarea como "Finalizada"
    ↓
    👨‍💼 OPERADOR verifica y cierra
    ↓
    📋 Estado: "Completado" ✅
    ↓
    👤 CIUDADANO ve estado actualizado
```

### Diagrama de Estados de Reporte

```
    [Pendiente] 🟡
         ↓
    [Revisado] 🔵
         ↓
    ┌────┴────┐
    ↓         ↓
[Aceptado] [Rechazado]
    🟢        🔴
    ↓         ↓
[Completado] [FIN]
    ✅
```

---

## 🎨 Sistema de UI/UX

### Diseño y Estilos

#### Paleta de Colores por Estado

| Estado     | Color    | Código    | Uso                  |
| ---------- | -------- | --------- | -------------------- |
| Pendiente  | Amarillo | `#fbbf24` | Reportes sin revisar |
| Revisado   | Azul     | `#60a5fa` | En evaluación        |
| Aceptado   | Verde    | `#34d399` | Aprobados            |
| Completado | Morado   | `#818cf8` | Finalizados          |
| Rechazado  | Rojo     | `#f87171` | No procedentes       |

#### Iconos por Sección

```
📋 Reportes
👥 Usuarios/Equipos
📊 Estadísticas
🗺️ Mapas
⚙️ Configuración
🔧 Trabajadores
👨‍💼 Operadores
🛡️ Administradores
✅ Completado
⚠️ Pendiente
```

### Componentes Reutilizables

#### CreateTaskModal

Modal para crear nuevas tareas.

**Props:**

```javascript
{
  closeModal: () => void
}
```

#### ReportDetails

Panel lateral deslizable con detalles de reporte.

**Props:**

```javascript
{
  report: Object,
  onClose: () => void,
  role: string,
  onAccept: (id) => void,
  onReject: (id) => void
}
```

#### TaskDetails

Vista detallada de una tarea.

**Props:**

```javascript
{
  task: Object,
  onClose: () => void
}
```

#### CrewDetails

Información detallada de un equipo.

**Props:**

```javascript
{
  crew: Object,
  members: Array,
  onClose: () => void
}
```

#### Profile

Componente de perfil de usuario reutilizable.

**Muestra:**

- Imagen de perfil
- Rol del usuario
- Fecha de registro
- Información personal
- Datos de contacto

### Navbars por Rol

Cada rol tiene su propia barra de navegación:

- **GeneralNavBar** - Para usuarios no autenticados
- **CitizenNavBar** - Para ciudadanos
- **WorkerNavBar** - Para trabajadores
- **OperatorNavBar** - Para operadores
- **AdminNavBar** - Para administradores

**Componente común:**

```jsx
<NavBarMenu profileType="citizen" />
```

### Diseño Responsive

- **Mobile First:** Diseño optimizado para móviles
- **Breakpoints:**
  - `sm:` 640px
  - `md:` 768px
  - `lg:` 1024px
  - `xl:` 1280px

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 18+
- npm o yarn
- Backend de MuniFor corriendo en `http://localhost:3000`

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Navegar al directorio
cd munifor-front-react

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview
```

### Variables de Entorno

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3000/api
VITE_MAPS_DEFAULT_LAT=-26.18489
VITE_MAPS_DEFAULT_LNG=-58.17214
```

### Configuración de Vite

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: true,
  },
});
```

---

## 🔧 Scripts Disponibles

```json
{
  "dev": "vite", // Servidor de desarrollo
  "build": "vite build", // Build para producción
  "lint": "eslint .", // Linter
  "preview": "vite preview" // Preview del build
}
```

---

## 🐛 Debugging y Desarrollo

### Console Logs Importantes

```javascript
// UserContext.jsx - Al decodificar token
console.log(`Decoded token:`, decoded);

// Login.jsx - Respuesta del servidor
console.log(response);

// Páginas con fetch - Datos obtenidos
console.log("Reportes obtenidos:", data.reports);
```

### DevTools

- **React Developer Tools** - Inspector de componentes
- **Redux DevTools** - Para Context API
- **Network Tab** - Monitorear peticiones HTTP

---

## 🚨 Problemas Conocidos y Áreas de Mejora

### ⚠️ Funcionalidades Incompletas

1. **useFilter.js** - Hook vacío sin implementar
2. **OperatorStatistics.jsx** - Página sin desarrollar
3. **CreateTaskModal** - No conectado al backend
4. **AdminGlobalView** - Vista sin implementar
5. **Upload de imágenes** - Funcionalidad no operativa

### 🔒 Seguridad

1. Token en localStorage (vulnerable a XSS)
2. Falta implementar refresh tokens
3. No hay timeout de sesión
4. Falta CSRF protection
5. Validación de permisos en frontend limitada

### ⚡ Performance

1. No hay lazy loading de rutas
2. Falta memoization en componentes
3. Sin caché de peticiones HTTP
4. Imágenes sin optimizar
5. Bundle size sin optimizar

### 🎨 UX/UI

1. Dashboards con datos hardcodeados (-)
2. Estados vacíos inconsistentes
3. Falta paginación en listas largas
4. Sin sistema de notificaciones push
5. Loading states inconsistentes
6. Feedback visual limitado

### 📊 Estadísticas

1. Datos de dashboards no dinámicos
2. Gráficas con datos estáticos
3. Falta integración con datos reales
4. Sin exportación de reportes

---

## ✨ Roadmap de Mejoras

### Corto Plazo (1-2 semanas)

- [ ] Completar useFilter.js
- [ ] Implementar OperatorStatistics
- [ ] Conectar CreateTaskModal al backend
- [ ] Agregar loading states globales
- [ ] Implementar sistema de notificaciones

### Mediano Plazo (1 mes)

- [ ] Implementar lazy loading de rutas
- [ ] Agregar paginación en listas
- [ ] Sistema de caché con React Query
- [ ] Optimización de imágenes
- [ ] Mejora de seguridad (refresh tokens)

### Largo Plazo (3 meses)

- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Chat en tiempo real
- [ ] Dashboard en tiempo real con WebSockets
- [ ] Exportación de reportes a PDF/Excel
- [ ] Sistema de permisos granular

---

## 📚 Guías de Uso

### Para Desarrolladores

#### Agregar un Nuevo Endpoint

1. Agregar función en `useFetch.js`:

```javascript
const getNewData = async (url) => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.replace("/login");
    return;
  }
  try {
    const response = await fetch(`${hostPort}${url}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.msg || "Error de red");
    }
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
```

2. Exportar en el return del hook
3. Usar en componente

#### Crear un Nuevo Schema de Validación

```javascript
// schemas/NewSchema.js
import z from "zod";

const newSchema = z.object({
  field: z.string().min(1, "Campo requerido"),
  // más campos...
});

export default newSchema;
```

#### Agregar Nueva Página

1. Crear componente en `pages/[Role]/`
2. Agregar ruta en `App.jsx`:

```jsx
<Route path="/role/newpage" element={<NewPage />} />
```

3. Agregar link en navbar correspondiente

---

## 🤝 Contribución

### Estilo de Código

- **ESLint** configurado
- **Prettier** recomendado
- Componentes funcionales con hooks
- Props destructuring
- Named exports para componentes

### Convenciones de Nombres

```javascript
// Componentes: PascalCase
const UserProfile = () => {};

// Hooks: camelCase con prefijo 'use'
const useFetch = () => {};

// Funciones: camelCase
const handleSubmit = () => {};

// Constantes: UPPER_CASE
const API_URL = "...";
```

### Estructura de Componentes

```jsx
// 1. Imports
import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";

// 2. Componente
const MyComponent = ({ prop1, prop2 }) => {
  // 3. Hooks
  const [state, setState] = useState(null);
  const { getFetchData } = useFetch();

  // 4. Effects
  useEffect(() => {
    // ...
  }, []);

  // 5. Handlers
  const handleClick = () => {
    // ...
  };

  // 6. Render
  return <div>{/* JSX */}</div>;
};

// 7. Export
export default MyComponent;
```

---

## 📝 Notas Técnicas

### Context API vs Redux

Se eligió Context API por:

- Simplicidad para un estado global pequeño
- Menos boilerplate
- Suficiente para las necesidades actuales
- Fácil migración a Redux si es necesario

### React Hook Form vs Formik

Se eligió React Hook Form por:

- Mejor performance (uncontrolled components)
- Menor re-renders
- Excelente integración con Zod
- Bundle size más pequeño

### Leaflet vs Google Maps

Se eligió Leaflet por:

- Open source y gratuito
- Sin límites de API
- Altamente customizable
- React Leaflet bien mantenido

---

## 📞 Contacto y Soporte

### Documentación Adicional

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Leaflet](https://leafletjs.com)
- [Chart.js](https://www.chartjs.org)

---

## 📄 Licencia

Este proyecto es parte de prácticas profesionales de TSDSM (Tecnicatura Superior en Desarrollo de Software Multiplataforma).

---

## 🎯 Conclusión

**MuniFor** es una solución completa y escalable para la gestión de reportes municipales. Con una arquitectura sólida basada en React, un sistema de roles bien definido, y herramientas modernas de desarrollo, proporciona una base excelente para la modernización de servicios municipales.

El sistema facilita la comunicación entre ciudadanos y gobierno local, mejora los tiempos de respuesta, y permite un seguimiento transparente de los problemas urbanos desde su reporte hasta su resolución.

---

**Última actualización:** 5 de noviembre de 2025
**Versión:** 1.0.0
**Desarrollado con** ❤️ **para la comunidad**
