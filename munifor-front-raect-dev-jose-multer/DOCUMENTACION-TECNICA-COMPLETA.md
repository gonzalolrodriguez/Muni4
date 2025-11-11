# 📘 DOCUMENTACIÓN TÉCNICA COMPLETA - MUNIFOR FRONTEND

> **Autor:** José (Backend & Integración)  
> **Para:** Compañero de equipo (Diseño UI/UX con Tailwind)  
> **Fecha:** Noviembre 2025  
> **Propósito:** Entender TODA la aplicación antes de aplicar estilos visuales

---

## 📋 ÍNDICE

1. [Introducción General](#1-introducción-general)
2. [Arquitectura del Proyecto](#2-arquitectura-del-proyecto)
3. [Tecnologías y Dependencias](#3-tecnologías-y-dependencias)
4. [Sistema de Autenticación](#4-sistema-de-autenticación)
5. [Contexto Global (UserContext)](#5-contexto-global-usercontext)
6. [Custom Hooks](#6-custom-hooks)
7. [Sistema de Rutas y Layouts](#7-sistema-de-rutas-y-layouts)
8. [Componentes Principales](#8-componentes-principales)
9. [Páginas por Rol](#9-páginas-por-rol)
10. [Sistema de Mapas (Leaflet)](#10-sistema-de-mapas-leaflet)
11. [Sistema de Imágenes (Multer)](#11-sistema-de-imágenes-multer)
12. [Validación de Formularios](#12-validación-de-formularios)
13. [Filtros y Búsquedas](#13-filtros-y-búsquedas)
14. [Flujo de Datos](#14-flujo-de-datos)
15. [Sugerencias de Mejora Visual](#15-sugerencias-de-mejora-visual)
16. [Problemas Comunes y Soluciones](#16-problemas-comunes-y-soluciones)

---

## 1. INTRODUCCIÓN GENERAL

### ¿Qué es MuniFor?

MuniFor es un sistema de **gestión de reportes municipales** donde:

- **Ciudadanos** reportan problemas (baches, alumbrado, basura, etc.)
- **Operadores** aceptan reportes, crean tareas y asignan cuadrillas
- **Trabajadores** ejecutan las tareas y registran avances
- **Administradores** supervisan todo el sistema

### Ciclo de Vida Completo

```
Ciudadano crea reporte → Operador acepta → Operador crea tarea →
Operador asigna cuadrilla → Líder acepta tarea → Trabajadores registran avances →
Líder marca como Finalizado → Tarea y reportes se completan automáticamente
```

### Roles en el Sistema

| Rol            | Permisos                                                |
| -------------- | ------------------------------------------------------- |
| **Ciudadano**  | Crear reportes, ver estado de sus reportes              |
| **Trabajador** | Ver tareas asignadas, aceptar tareas, registrar avances |
| **Operador**   | Gestionar reportes, crear tareas, asignar cuadrillas    |
| **Admin**      | Supervisar todo, aprobar registros, ver estadísticas    |

---

## 2. ARQUITECTURA DEL PROYECTO

### Estructura de Carpetas

```
src/
├── App.jsx                    # Configuración de rutas principales
├── main.jsx                   # Entry point de React
├── index.css                  # Estilos globales (Tailwind)
├── assets/                    # Imágenes, logos, íconos
├── components/                # Componentes reutilizables
│   ├── ImageUploader.jsx      # Upload de imágenes
│   ├── FormRegister.jsx       # Formulario de registro
│   ├── CreateTaskModal.jsx    # Modal para crear tareas
│   ├── Chart/                 # Gráficos (Chart.js)
│   ├── details/               # Componentes de detalle
│   ├── LeafletMaps/           # Mapas interactivos
│   └── navbars/               # Navegación por rol
├── context/
│   └── UserContext.jsx        # Estado global del usuario
├── hooks/
│   ├── useFetch.js            # Peticiones HTTP
│   └── useFilter.js           # Filtros y búsquedas
├── layout/                    # Layouts por rol
│   ├── GeneralLayout.jsx      # Layout público
│   ├── CitizenLayout.jsx      # Layout ciudadano
│   ├── WorkerLayout.jsx       # Layout trabajador
│   ├── OperatorLayout.jsx     # Layout operador
│   └── AdminLayout.jsx        # Layout administrador
├── pages/                     # Páginas organizadas por rol
│   ├── General/               # Login, Register, Home
│   ├── Citizen/               # Dashboard, Reports, Profile
│   ├── Worker/                # Tasks, Progress, Team
│   ├── Operator/              # Reports, Tasks, Teams, Map
│   └── Admin/                 # Dashboard, Statistics, Map
└── schemas/                   # Validación con Zod
    ├── LoginSchema.js
    ├── RegisterSchema.js
    ├── ReportSchema.js
    └── TaskSchema.js
```

### Patrón de Diseño

MuniFor usa **componentes funcionales** con **React Hooks**:

- `useState`: Estado local de componentes
- `useEffect`: Efectos secundarios (fetch de datos)
- `useContext`: Acceso al contexto global (UserContext)
- `useForm`: Manejo de formularios (react-hook-form)
- `useNavigate`: Navegación programática (react-router)

---

## 3. TECNOLOGÍAS Y DEPENDENCIAS

### Frontend Core

```json
{
  "react": "^19.0.0-rc",
  "react-dom": "^19.0.0-rc",
  "react-router-dom": "^7.9.5",
  "vite": "^7.1.7"
}
```

### Manejo de Formularios

```json
{
  "react-hook-form": "^7.65.0",
  "@hookform/resolvers": "^3.10.3",
  "zod": "^4.1.12"
}
```

**¿Por qué?**

- `react-hook-form`: Manejo performante de formularios
- `zod`: Validación de esquemas con TypeScript-like
- `@hookform/resolvers`: Integración entre ambos

### Mapas Interactivos

```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^5.0.0-rc.2"
}
```

**¿Qué hace?**

- Muestra mapas con OpenStreetMap
- Permite marcar ubicaciones
- Filtra reportes/tareas por ubicación

### Gráficos y Estadísticas

```json
{
  "chart.js": "^4.5.1",
  "react-chartjs-2": "^6.0.2"
}
```

**¿Para qué?**

- Gráficos de barras (tipos de reportes)
- Gráficos circulares (estados)
- Gráficos de línea (tendencias temporales)

### Estilos

```json
{
  "tailwindcss": "^4.1.16",
  "autoprefixer": "^11.2.0",
  "postcss": "^9.1.1"
}
```

### Autenticación

```json
{
  "jwt-decode": "^4.0.0"
}
```

**¿Cómo funciona?**

- Backend envía JWT token al login
- Frontend guarda en `localStorage`
- Se decodifica para obtener `_id` y `role`

---

## 4. SISTEMA DE AUTENTICACIÓN

### Login Flow

#### 1. **Login.jsx** - Componente de Login

```jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import loginSchema from "../../schemas/LoginSchema.js";
import useFetch from "../../hooks/useFetch.js";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const { postFetch } = useFetch();
  const { setUser } = useContext(UserContext);
  const navigator = useNavigate();

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(loginSchema), // Validación con Zod
  });

  const onSubmit = async (data) => {
    const response = await postFetch("/auth/login", data);
    if (response.ok) {
      // Guardar token en localStorage
      localStorage.setItem("token", response.token);

      // Decodificar token y actualizar contexto
      const decoded = jwtDecode(response.token);
      setUser({ _id: decoded._id, role: decoded.role });

      // Redirigir según rol
      if (decoded.role === "Administrador") navigator("/admin/dashboard");
      else if (decoded.role === "Operador") navigator("/operator/dashboard");
      else if (decoded.role === "Trabajador") navigator("/worker/dashboard");
      else navigator("/citizen/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Inputs de username y password */}
    </form>
  );
};
```

**¿Qué hace este código?**

1. El usuario ingresa `username` y `password`
2. Se valida con `loginSchema` (Zod)
3. Se envía POST a `/auth/login`
4. Backend devuelve `{ ok: true, token: "..." }`
5. Se guarda token en `localStorage`
6. Se decodifica token con `jwt-decode`
7. Se actualiza `UserContext` con `_id` y `role`
8. Se redirige al dashboard correspondiente

#### 2. **LoginSchema.js** - Validación

```js
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(3, "Usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
});

export default loginSchema;
```

**¿Por qué Zod?**

- Validación en tiempo real
- Mensajes de error automáticos
- Integración perfecta con `react-hook-form`

### Registro de Ciudadanos

#### 1. **FormRegister.jsx** - Formulario Reutilizable

```jsx
const FormRegister = ({ role }) => {
  const { postFetch } = useFetch();

  const onSubmit = (data) => {
    // Separar datos de usuario y perfil
    const { first_name, last_name, age, dni, phone, address, sex, ...rest } =
      data;
    const profile = { first_name, last_name, age, dni, phone, address, sex };

    // Enviar al backend
    postFetch("/auth/register", { ...rest, role, profile });
    navigate("/login");
  };

  return <form onSubmit={handleSubmit(onSubmit)}>{/* Inputs */}</form>;
};
```

**¿Qué hace?**

1. Recibe `role` como prop (`"Ciudadano"`, `"Operador"`, etc.)
2. Usuario llena formulario
3. Se separan datos en `profile` (datos personales) y `rest` (usuario)
4. Se envía POST a `/auth/register`
5. Se redirige a `/login`

**Importante:** Operadores, Trabajadores y Admins deben ser aprobados por un Admin antes de poder ingresar.

---

## 5. CONTEXTO GLOBAL (UserContext)

### ¿Qué es UserContext?

Es el **estado global** que almacena la información del usuario autenticado.

### Código Completo

```jsx
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Al cargar la app, verifica si hay token en localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ _id: decoded._id, role: decoded.role });
      } catch (err) {
        // Token inválido, limpiar localStorage
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
```

### ¿Cómo usarlo?

```jsx
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const MyComponent = () => {
  const { user, setUser } = useContext(UserContext);

  console.log(user); // { _id: "507f...", role: "Ciudadano" }

  return <div>Hola {user?.role}</div>;
};
```

### ¿Cuándo se actualiza?

- Al hacer **login** (se decodifica el token)
- Al **refrescar la página** (se lee de `localStorage`)
- Al hacer **logout** (se limpia `setUser(null)`)

---

## 6. CUSTOM HOOKS

### 6.1. useFetch.js - Peticiones HTTP

#### ¿Qué hace?

Centraliza **todas las peticiones al backend** con manejo automático de token.

#### Funciones Disponibles

| Función                   | Método | Uso                                         |
| ------------------------- | ------ | ------------------------------------------- |
| `getFetchData(url)`       | GET    | Obtener datos (requiere token)              |
| `postFetch(url, data)`    | POST   | Enviar JSON (sin token - login/register)    |
| `postFetchLocalStorage`   | POST   | Enviar JSON (con token)                     |
| `postFetchFormData`       | POST   | Enviar FormData (con token - para imágenes) |
| `putFetch(url, id, data)` | PUT    | Actualizar recurso (con token)              |
| `patchFetch(url, data)`   | PATCH  | Actualización parcial (con token)           |
| `deleteFetch(url, id)`    | DELETE | Eliminar recurso (con token)                |

#### Código Completo

```js
const useFetch = () => {
  const hostPort = "http://localhost:3000/api";

  // GET con token
  const getFetchData = async (url) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/login");
      return;
    }

    const response = await fetch(`${hostPort}${url}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.msg || "Error");
    return data;
  };

  // POST JSON (sin token) - usado en login/register
  const postFetch = async (url, payload) => {
    const response = await fetch(`${hostPort}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.msg || "Error");
    return data;
  };

  // POST FormData (con token) - usado para imágenes
  const postFetchFormData = async (url, formData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/login");
      return;
    }

    const response = await fetch(`${hostPort}${url}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        // NO incluir Content-Type - el navegador lo configura automáticamente
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.msg || "Error");
    return data;
  };

  return {
    getFetchData,
    postFetch,
    postFetchLocalStorage,
    postFetchFormData,
    putFetch,
    patchFetch,
    deleteFetch,
  };
};
```

#### Ejemplo de Uso

```jsx
const MyComponent = () => {
  const { getFetchData, postFetchFormData } = useFetch();

  // GET
  useEffect(() => {
    const fetchReports = async () => {
      const data = await getFetchData("/reports");
      setReports(data.reports);
    };
    fetchReports();
  }, []);

  // POST con FormData (para imágenes)
  const handleSubmit = async (formData) => {
    await postFetchFormData("/report", formData);
  };
};
```

### 6.2. useFilter.js - Filtros y Búsquedas

#### ¿Qué hace?

Centraliza **toda la lógica de filtrado** de reportes, tareas, usuarios, etc.

#### Funciones Disponibles

| Función                  | Descripción                           |
| ------------------------ | ------------------------------------- |
| `filterBySearch`         | Búsqueda por texto en cualquier campo |
| `filterReportsByStatus`  | Filtrar reportes por estado           |
| `filterReportsByType`    | Filtrar reportes por tipo             |
| `filterTasksByStatus`    | Filtrar tareas por estado             |
| `filterTasksByPriority`  | Filtrar tareas por prioridad          |
| `filterProgressByStatus` | Filtrar avances por estado            |
| `filterByTime`           | Filtrar por rango de tiempo           |
| `filterForMap`           | Filtro combinado para mapas           |
| `sortData`               | Ordenar datos                         |
| `limitData`              | Paginación                            |

#### Ejemplo Completo

```jsx
import useFilter from "../../hooks/useFilter";

const OperatorReports = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const { filterBySearch, filterReportsByStatus } = useFilter();

  // Aplicar filtros
  const filteredReports = filterReportsByStatus(
    filterBySearch(reports, searchTerm, "title"),
    statusFilter
  );

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar por título..."
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="Todos">Todos</option>
        <option value="Pendiente">Pendiente</option>
        <option value="Aceptado">Aceptado</option>
        <option value="Completado">Completado</option>
      </select>

      {filteredReports.map((report) => (
        <div key={report._id}>{report.title}</div>
      ))}
    </div>
  );
};
```

---

## 7. SISTEMA DE RUTAS Y LAYOUTS

### App.jsx - Configuración de Rutas

```jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route element={<GeneralLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<CitizenRegister />} />
          </Route>

          {/* Rutas de Ciudadano */}
          <Route element={<CitizenLayout />}>
            <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
            <Route path="/citizen/reports" element={<CitizenReports />} />
          </Route>

          {/* Rutas de Trabajador */}
          <Route element={<WorkerLayout />}>
            <Route path="/worker/tasks" element={<WorkerTasks />} />
            <Route path="/worker/progress" element={<WorkerProgress />} />
          </Route>

          {/* Rutas de Operador */}
          <Route element={<OperatorLayout />}>
            <Route path="/operator/reports" element={<OperatorReports />} />
            <Route
              path="/operator/create-task"
              element={<OperatorCreateTask />}
            />
          </Route>

          {/* Rutas de Admin */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/map" element={<AdminMap />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};
```

### Layouts - Estructura Común

Cada layout incluye:

- **Navbar** específico del rol
- **Outlet** donde se renderizan las páginas hijas
- **Footer** (opcional)

```jsx
import { Outlet } from "react-router-dom";
import CitizenNavBar from "../components/navbars/CitizenNavBar";

const CitizenLayout = () => {
  return (
    <div>
      <CitizenNavBar />
      <Outlet /> {/* Aquí se renderizan las páginas */}
      <Footer />
    </div>
  );
};
```

---

## 8. COMPONENTES PRINCIPALES

### 8.1. ImageUploader.jsx - Subida de Imágenes

#### ¿Qué hace?

Componente **reutilizable** para subir múltiples imágenes con:

- ✅ Preview antes de subir
- ✅ Validación de formato (jpg, png, gif, webp)
- ✅ Validación de tamaño (15MB por imagen)
- ✅ Eliminar imágenes individualmente
- ✅ UI responsive con Tailwind

#### Código Completo

```jsx
const ImageUploader = ({ onFilesChange, maxFiles = 5, maxSizeMB = 15 }) => {
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState([]);

  const allowedFormats = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const newErrors = [];

    // Validar cantidad
    if (files.length > maxFiles) {
      newErrors.push(`Máximo ${maxFiles} imágenes permitidas`);
      setErrors(newErrors);
      return;
    }

    // Validar cada archivo
    files.forEach((file) => {
      if (!allowedFormats.includes(file.type)) {
        newErrors.push(`${file.name}: formato no permitido`);
        return;
      }
      if (file.size > maxSizeBytes) {
        newErrors.push(`${file.name}: excede ${maxSizeMB}MB`);
        return;
      }
      validFiles.push(file);
    });

    setErrors(newErrors);

    if (validFiles.length > 0) {
      const newPreviews = validFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      }));

      setPreviews(newPreviews);
      onFilesChange(validFiles); // Callback al componente padre
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        multiple
        onChange={handleFileChange}
      />

      {/* Mostrar errores */}
      {errors.map((error) => (
        <p className="text-red-500">{error}</p>
      ))}

      {/* Mostrar previews */}
      {previews.map((preview, index) => (
        <div key={index}>
          <img src={preview.url} alt={preview.name} />
          <button onClick={() => handleRemoveImage(index)}>×</button>
        </div>
      ))}
    </div>
  );
};
```

#### ¿Cómo usarlo?

```jsx
const CitizenReports = () => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImagesChange = (files) => {
    setSelectedImages(files);
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);

    // Agregar imágenes
    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

    postFetchFormData("/report", formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ImageUploader
        onFilesChange={handleImagesChange}
        maxFiles={5}
        maxSizeMB={15}
      />
    </form>
  );
};
```

### 8.2. CreateTaskModal.jsx - Modal para Crear Tareas

```jsx
const CreateTaskModal = ({
  onClose,
  crewSelected,
  reportSelected,
  onSubmit,
}) => {
  const { register, handleSubmit } = useForm();

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      crew: crewSelected,
      report: reportSelected, // Array de IDs
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <input {...register("title")} placeholder="Título" />
        <input {...register("description")} placeholder="Descripción" />
        <select {...register("priority")}>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>
        <button type="submit">Crear Tarea</button>
      </form>
    </div>
  );
};
```

---

## 9. PÁGINAS POR ROL

### 9.1. CIUDADANO

#### CitizenReports.jsx - Crear Reportes

**¿Qué hace?**

1. Usuario llena formulario (título, descripción, tipo)
2. Selecciona ubicación en el mapa
3. Opcionalmente sube hasta 5 imágenes
4. Se envía al backend con `postFetchFormData`

**Código Clave:**

```jsx
const CitizenReports = () => {
  const { postFetchFormData } = useFetch();
  const [markerPosition, setMarkerPosition] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

  const onSubmit = (data) => {
    if (!markerPosition) {
      alert("Selecciona una ubicación");
      return;
    }

    const [lat, lng] = markerPosition;
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("type_report", data.type_report);
    formData.append("location[lat]", lat);
    formData.append("location[lng]", lng);

    selectedImages.forEach((file) => formData.append("images", file));

    postFetchFormData("/report", formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("title")} />
      <select {...register("type_report")}>
        <option value="Bache">Bache</option>
        <option value="Alumbrado">Alumbrado</option>
        <option value="Basura">Basura</option>
      </select>

      <ImageUploader onFilesChange={setSelectedImages} />
      <CitizenLeafletMap onMarkerChange={setMarkerPosition} />

      <button type="submit">Enviar Reporte</button>
    </form>
  );
};
```

### 9.2. OPERADOR

#### OperatorCreateTask.jsx - Crear Tareas

**¿Qué hace?**

1. Muestra reportes aceptados (columna izquierda)
2. Muestra cuadrillas disponibles (columna derecha)
3. Operador selecciona reportes y una cuadrilla
4. Se abre modal para ingresar detalles
5. Se crea tarea con `POST /task`

**Código Clave:**

```jsx
const OperatorCreateTask = () => {
  const { getFetchData, postFetchLocalStorage } = useFetch();
  const [reports, setReports] = useState([]);
  const [crews, setCrews] = useState([]);
  const [reportSelected, setReportSelected] = useState([]); // Array de IDs
  const [crewSelected, setCrewSelected] = useState(null); // ID único

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFetchData("/reports/operator/accepted");
      setReports(data.reports);
      setCrews(data.crews);
    };
    fetchData();
  }, []);

  const handleSubmit = (payload) => {
    postFetchLocalStorage("/task", payload);
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Columna reportes */}
      <div>
        {reports.map((report) => (
          <div
            key={report._id}
            onClick={() => handleSelectReport(report)}
            className={reportSelected.includes(report._id) ? "ring-2" : ""}
          >
            {report.title}
          </div>
        ))}
      </div>

      {/* Columna crews */}
      <div>
        {crews.map((crew) => (
          <div
            key={crew._id}
            onClick={() => setCrewSelected(crew._id)}
            className={crewSelected === crew._id ? "ring-2" : ""}
          >
            {crew.name}
          </div>
        ))}
      </div>

      <CreateTaskModal
        reportSelected={reportSelected}
        crewSelected={crewSelected}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
```

### 9.3. TRABAJADOR

#### WorkerTasks.jsx - Ver y Aceptar Tareas

**¿Qué hace?**

1. Muestra tarea actual (En Progreso)
2. Muestra tareas futuras (Pendiente)
3. Solo el **líder de la cuadrilla** puede aceptar tareas
4. Al aceptar, se actualiza a "En Progreso"

**Código Clave:**

```jsx
const WorkerTasks = () => {
  const { getFetchData, putFetch } = useFetch();
  const { user } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);
  const [leaderCrew, setLeaderCrew] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getFetchData("/task/worker");
      setTasks(data.tasks);
      setLeaderCrew(data.crew.leader);
    };
    fetchTasks();
  }, []);

  const handleAcceptTask = async (id) => {
    await putFetch("/task/assign", id);
    // Recargar tareas
  };

  const currentTask = tasks.find((t) => t.status === "En Progreso");
  const futureTasks = tasks.filter((t) => t.status === "Pendiente");

  return (
    <div className="grid grid-cols-2">
      {/* Tarea actual */}
      <div>
        {currentTask ? (
          <div>{currentTask.title}</div>
        ) : (
          <p>No hay tarea actual</p>
        )}
      </div>

      {/* Tareas futuras */}
      <div>
        {futureTasks.map((task) => (
          <div key={task._id}>
            {task.title}
            {leaderCrew?.toString() === user._id?.toString() && (
              <button onClick={() => handleAcceptTask(task._id)}>
                Aceptar Tarea
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

**Importante:**

- `leaderCrew?.toString() === user._id?.toString()`: Comparación de ObjectId (MongoDB)
- Solo el líder puede aceptar tareas

#### WorkerProgress.jsx - Registrar Avances

**¿Qué hace?**

1. Muestra la tarea actual (En Progreso)
2. Worker registra avance con título, descripción, estado
3. Selecciona ubicación en el mapa
4. Opcionalmente sube hasta 5 imágenes
5. Si marca como **"Finalizado"**:
   - Tarea pasa a "Finalizada"
   - Todos los reportes asociados pasan a "Completado"
   - Se redirige a `/worker/tasks`

**Código Clave:**

```jsx
const WorkerProgress = () => {
  const { getFetchData, postFetchFormData } = useFetch();
  const [currentTask, setCurrentTask] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

  const onSubmit = async (data) => {
    if (!markerPosition) {
      alert("Marca tu ubicación");
      return;
    }

    // Confirmación si se marca como Finalizado
    if (data.status === "Finalizado") {
      const confirm = window.confirm(
        "¿Finalizar tarea? Se completarán todos los reportes asociados."
      );
      if (!confirm) return;
    }

    const [lat, lng] = markerPosition;
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("status", data.status);
    formData.append("task", currentTask._id);
    formData.append("crew", crew._id);
    formData.append("location[lat]", lat);
    formData.append("location[lng]", lng);

    selectedImages.forEach((file) => formData.append("images", file));

    await postFetchFormData("/progress-report", formData);

    if (data.status === "Finalizado") {
      alert("✅ Tarea finalizada exitosamente");
      setTimeout(() => {
        window.location.href = "/worker/tasks";
      }, 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("title")} />
      <textarea {...register("description")} />
      <select {...register("status")}>
        <option value="Pendiente">Pendiente</option>
        <option value="En Progreso">En Progreso</option>
        <option value="Finalizado">Finalizado</option>
      </select>

      <ImageUploader onFilesChange={setSelectedImages} />
      <MapContainer>{/* Mapa */}</MapContainer>

      <button type="submit">Registrar Avance</button>
    </form>
  );
};
```

---

## 10. SISTEMA DE MAPAS (Leaflet)

### ¿Qué es Leaflet?

Librería de mapas interactivos de código abierto. Usa **OpenStreetMap** como proveedor.

### Componentes de Mapas

#### GlobalLeafletMap.jsx - Mapa Principal

**¿Qué hace?**

- Muestra reportes, tareas y avances en un mapa
- Filtra por tipo de dato (reports, tasks, progress)
- Filtra por estado, tipo, prioridad
- **Diferencia entre Operador y Admin:**
  - **Operador:** solo ve datos asignados a él (`/map/operator-data`)
  - **Admin:** ve todos los datos (`/map/data`)

**Código Clave:**

```jsx
const GlobalLeafletMap = ({ role }) => {
  const { getFetchData } = useFetch();
  const [reports, setReports] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const endpoint = role === "Operador" ? "/map/operator-data" : "/map/data";
      const data = await getFetchData(endpoint);
      setReports(data.reports || []);
      setTasks(data.tasks || []);
      setProgress(data.progress || []);
    };
    fetchData();
  }, [role]);

  return (
    <MapContainer center={[-26.1849, -58.1756]} zoom={13}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Marcadores de reportes */}
      {reports
        .filter((r) => r.location?.lat && r.location?.lng)
        .map((report) => (
          <Marker
            key={report._id}
            position={[report.location.lat, report.location.lng]}
          >
            <Popup>{report.title}</Popup>
          </Marker>
        ))}

      {/* Marcadores de tareas */}
      {tasks
        .filter((t) => t.location?.lat && t.location?.lng)
        .map((task) => (
          <Marker
            key={task._id}
            position={[task.location.lat, task.location.lng]}
          >
            <Popup>{task.title}</Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};
```

#### CitizenLeafletMap.jsx - Mapa para Ciudadanos

**¿Qué hace?**

- Permite al ciudadano **marcar una ubicación** haciendo clic en el mapa
- Devuelve `[lat, lng]` al componente padre

**Código Clave:**

```jsx
const CitizenLeafletMap = ({ onMarkerChange }) => {
  const [markerPosition, setMarkerPosition] = useState(null);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setMarkerPosition([lat, lng]);
    onMarkerChange([lat, lng]);
  };

  return (
    <MapContainer center={[-26.1849, -58.1756]} zoom={13}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler onClickPosition={handleMapClick} />
      {markerPosition && (
        <Marker position={markerPosition}>
          <Popup>Ubicación seleccionada</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};
```

---

## 11. SISTEMA DE IMÁGENES (Multer)

### ¿Cómo funciona?

1. **Frontend:** Sube archivos usando `FormData`
2. **Backend:** Multer recibe los archivos y los guarda en `uploads/`
3. **Backend:** Devuelve las rutas en el response
4. **Frontend:** Muestra las imágenes usando `http://localhost:3000/uploads/...`

### Endpoints de Imágenes

| Endpoint                        | Campo FormData    | Cantidad | Descripción          |
| ------------------------------- | ----------------- | -------- | -------------------- |
| `POST /report`                  | `images`          | 0-5      | Imágenes de reportes |
| `POST /progress-report`         | `images`          | 0-5      | Imágenes de avances  |
| `PUT /user/profile-picture/:id` | `profile_picture` | 1        | Foto de perfil       |

### Ejemplo Completo

```jsx
const handleUploadReport = async (data, images) => {
  const formData = new FormData();

  // Campos de texto
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("type_report", data.type_report);
  formData.append("location[lat]", data.location.lat);
  formData.append("location[lng]", data.location.lng);

  // Imágenes (máximo 5)
  images.forEach((file) => {
    formData.append("images", file);
  });

  // Enviar al backend
  const response = await postFetchFormData("/report", formData);

  console.log(response.report.images);
  // ["uploads/reports/report-1699564800000-111.jpg", "uploads/reports/report-1699564800000-222.jpg"]
};
```

### Mostrar Imágenes

```jsx
const ReportDetails = ({ report }) => {
  return (
    <div>
      <h2>{report.title}</h2>
      <div className="grid grid-cols-3 gap-4">
        {report.images.map((img, index) => (
          <img
            key={index}
            src={`http://localhost:3000/${img}`}
            alt={`Imagen ${index + 1}`}
            className="w-full h-32 object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
};
```

---

## 12. VALIDACIÓN DE FORMULARIOS

### ¿Por qué Zod + React Hook Form?

- **Zod:** Define esquemas de validación con TypeScript-like
- **React Hook Form:** Manejo performante de formularios
- **@hookform/resolvers:** Conecta ambos

### Ejemplo: ReportSchema.js

```js
import { z } from "zod";

const reportSchema = z.object({
  title: z.string().min(5, "Título debe tener al menos 5 caracteres"),
  description: z
    .string()
    .min(10, "Descripción debe tener al menos 10 caracteres"),
  type_report: z.enum(["Bache", "Alumbrado", "Basura", "Incidente", "Otro"], {
    errorMap: () => ({ message: "Selecciona un tipo de reporte" }),
  }),
  other_type_detail: z.string().optional(),
});

export default reportSchema;
```

### Uso en Componente

```jsx
const CitizenReports = () => {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(reportSchema),
  });

  const { errors } = formState;

  const onSubmit = (data) => {
    console.log(data); // Datos validados
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("title")} />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <select {...register("type_report")}>
        <option value="">Seleccione</option>
        <option value="Bache">Bache</option>
        <option value="Alumbrado">Alumbrado</option>
      </select>
      {errors.type_report && (
        <p className="text-red-500">{errors.type_report.message}</p>
      )}

      <button type="submit">Enviar</button>
    </form>
  );
};
```

---

## 13. FILTROS Y BÚSQUEDAS

### Ejemplo Completo: OperatorReports.jsx

```jsx
const OperatorReports = () => {
  const { getFetchData } = useFetch();
  const { filterBySearch, filterReportsByStatus, sortData } = useFilter();

  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  useEffect(() => {
    const fetchReports = async () => {
      const data = await getFetchData("/reports/operator");
      setReports(data.reports);
    };
    fetchReports();
  }, []);

  // Aplicar filtros
  let filteredReports = reports;
  filteredReports = filterBySearch(filteredReports, searchTerm, "title");
  filteredReports = filterReportsByStatus(filteredReports, statusFilter);
  filteredReports = sortData(filteredReports, "created_at", "desc");

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar por título..."
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="Todos">Todos</option>
        <option value="Pendiente">Pendiente</option>
        <option value="Revisado">Revisado</option>
        <option value="Aceptado">Aceptado</option>
      </select>

      {filteredReports.map((report) => (
        <div key={report._id}>
          <h3>{report.title}</h3>
          <p>{report.status}</p>
        </div>
      ))}
    </div>
  );
};
```

---

## 14. FLUJO DE DATOS

### Ciclo Completo: Desde Reporte hasta Completado

```
1. Ciudadano crea reporte
   → POST /report
   → Estado: "Pendiente"

2. Operador revisa reporte
   → PUT /report/:id { status: "Revisado" }

3. Operador acepta reporte
   → PUT /report/:id { status: "Aceptado" }

4. Operador crea tarea
   → POST /task { report: [id1, id2], crew: id }
   → Estado tarea: "Pendiente"

5. Líder de cuadrilla acepta tarea
   → PUT /task/assign/:id
   → Estado tarea: "En Progreso"

6. Trabajadores registran avances
   → POST /progress-report { task: id, status: "En Progreso" }

7. Líder marca tarea como finalizada
   → POST /progress-report { task: id, status: "Finalizado" }
   → Backend automáticamente:
     - Tarea → "Finalizada"
     - Todos los reportes → "Completado"

8. Ciudadano ve su reporte completado ✅
```

---

## 15. SUGERENCIAS DE MEJORA VISUAL

### 15.1. Sistema de Colores por Rol

```jsx
// Colores recomendados con Tailwind
const roleColors = {
  Ciudadano: {
    primary: "bg-blue-600",
    secondary: "bg-blue-100",
    text: "text-blue-700",
  },
  Trabajador: {
    primary: "bg-green-600",
    secondary: "bg-green-100",
    text: "text-green-700",
  },
  Operador: {
    primary: "bg-indigo-600",
    secondary: "bg-indigo-100",
    text: "text-indigo-700",
  },
  Administrador: {
    primary: "bg-purple-600",
    secondary: "bg-purple-100",
    text: "text-purple-700",
  },
};
```

### 15.2. Estados con Badges

```jsx
const StatusBadge = ({ status }) => {
  const statusColors = {
    Pendiente: "bg-yellow-100 text-yellow-800",
    "En Progreso": "bg-blue-100 text-blue-800",
    Finalizada: "bg-green-100 text-green-800",
    Completado: "bg-green-100 text-green-800",
    Rechazado: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}
    >
      {status}
    </span>
  );
};
```

### 15.3. Cards Responsivas

```jsx
const ReportCard = ({ report }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{report.title}</h3>
        <StatusBadge status={report.status} />
      </div>
      <p className="text-gray-600 mb-4">{report.description}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{new Date(report.created_at).toLocaleDateString()}</span>
        <span className="font-medium text-indigo-600">
          {report.type_report}
        </span>
      </div>
    </div>
  );
};
```

### 15.4. Animaciones Sutiles

```jsx
// Hover effects
<button className="bg-indigo-600 text-white px-6 py-3 rounded-lg
  hover:bg-indigo-700 transform hover:scale-105
  transition-all duration-200 shadow-md hover:shadow-lg">
  Enviar Reporte
</button>

// Loading states
<div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>

// Fade in
<div className="animate-fade-in opacity-0 animate-delay-100">
  {/* Content */}
</div>
```

### 15.5. Iconos con Heroicons

```bash
npm install @heroicons/react
```

```jsx
import {
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

<div className="flex items-center gap-2">
  <MapPinIcon className="w-5 h-5 text-indigo-600" />
  <span>Ubicación seleccionada</span>
</div>;
```

### 15.6. Tablas Responsivas

```jsx
<div className="overflow-x-auto">
  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Título
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Estado
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Acciones
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      {reports.map((report) => (
        <tr key={report._id} className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {report.title}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <StatusBadge status={report.status} />
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <button className="text-indigo-600 hover:text-indigo-900">
              Ver detalles
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### 15.7. Dark Mode (Opcional)

```jsx
// Agregar a tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
}

// Usar en componentes
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  {/* Content */}
</div>
```

---

## 16. PROBLEMAS COMUNES Y SOLUCIONES

### Problema 1: "Can't perform React state update on unmounted component"

**Causa:** Actualizar estado después de desmontar componente

**Solución:** Usar cleanup en `useEffect`

```jsx
useEffect(() => {
  let isMounted = true;

  const fetchData = async () => {
    const data = await getFetchData("/reports");
    if (isMounted) {
      setReports(data.reports);
    }
  };

  fetchData();

  return () => {
    isMounted = false; // Cleanup
  };
}, []);
```

### Problema 2: "Invalid LatLng object"

**Causa:** Intentar renderizar marcador sin coordenadas válidas

**Solución:** Filtrar antes de renderizar

```jsx
{
  reports
    .filter((r) => r.location?.lat && r.location?.lng)
    .map((report) => (
      <Marker position={[report.location.lat, report.location.lng]}>
        <Popup>{report.title}</Popup>
      </Marker>
    ));
}
```

### Problema 3: Comparación de IDs de MongoDB

**Causa:** `ObjectId` no se compara directamente con `===`

**Solución:** Convertir a string

```jsx
// ❌ INCORRECTO
if (leaderCrew === user._id) { ... }

// ✅ CORRECTO
if (leaderCrew?.toString() === user._id?.toString()) { ... }
```

### Problema 4: FormData con imágenes no funciona

**Causa:** Incluir `Content-Type: application/json`

**Solución:** NO incluir Content-Type (el navegador lo configura automáticamente)

```jsx
// ❌ INCORRECTO
fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "multipart/form-data", // ❌ NO
  },
  body: formData,
});

// ✅ CORRECTO
fetch(url, {
  method: "POST",
  headers: {
    authorization: `Bearer ${token}`,
    // NO incluir Content-Type
  },
  body: formData,
});
```

### Problema 5: Token no se guarda

**Causa:** No guardar en `localStorage` después de login

**Solución:**

```jsx
const onSubmit = async (data) => {
  const response = await postFetch("/auth/login", data);
  if (response.ok) {
    localStorage.setItem("token", response.token); // ✅ GUARDAR
    const decoded = jwtDecode(response.token);
    setUser({ _id: decoded._id, role: decoded.role });
  }
};
```

---

## 📌 RESUMEN FINAL

### ¿Qué hace cada tecnología?

- **React:** UI components
- **React Router:** Navegación
- **React Hook Form:** Formularios
- **Zod:** Validación
- **Leaflet:** Mapas
- **Chart.js:** Gráficos
- **Tailwind:** Estilos
- **JWT Decode:** Autenticación

### ¿Qué falta implementar?

1. ✅ **Funcionalidad:** TODO funciona
2. ⏳ **Diseño Visual:** Tu parte con Tailwind
3. ⏳ **Animaciones:** Opcional
4. ⏳ **Dark Mode:** Opcional
5. ⏳ **Notificaciones:** Opcional (toast notifications)

### Próximos Pasos para Ti

1. **Lee este documento** completo (entiende TODO el código)
2. **Revisa el FLUJO.md** (entiende el ciclo de vida)
3. **Aplica Tailwind** a todas las páginas:
   - Colores consistentes por rol
   - Cards, badges, botones
   - Responsive design (mobile-first)
   - Hover effects
4. **Agrega iconos** con Heroicons
5. **Mejora UX** con animaciones sutiles
6. **Testing:** Prueba cada flujo completo

---

**¡Éxito en la presentación! 🚀**
