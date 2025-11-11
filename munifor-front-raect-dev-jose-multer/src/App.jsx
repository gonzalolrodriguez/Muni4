//* ========================================
//* COMPONENTE PRINCIPAL: App
//* ========================================
//* Propósito: Configurar el enrutamiento de toda la aplicación MuniFor
//* Estructura de rutas:
//*   1. Rutas Generales (sin autenticación): /, /login, /register, /faq
//*   2. Rutas de Ciudadano: /citizen/*
//*   3. Rutas de Trabajador: /worker/*
//*   4. Rutas de Operador: /operator/*
//*   5. Rutas de Administrador: /admin/*
//*   6. Rutas de Registro: /operator/register, /worker/register, /admin/register
//*   7. Ruta de Actualización de Contraseña: /updatepassword
//* Características:
//*   - UserProvider envuelve toda la app para manejar autenticación global
//*   - Layouts específicos por rol protegen las rutas
//*   - React Router v7.9.5 con Routes y Route

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

//* ========================================
//* IMPORTACIONES: Páginas Generales
//* ========================================
//* Páginas públicas sin autenticación
import Home from "./pages/General/Home";
import CitizenRegister from "./pages/General/CitizenRegister";
import Login from "./pages/General/Login";
import ForgotPassword from "./pages/General/ForgotPassword";
import FAQ from "./pages/General/Faq";
import UpdatePassword from "./pages/General/UpdatePassword";

//* ========================================
//* IMPORTACIONES: Páginas de Ciudadano
//* ========================================
import CitizenDashboard from "./pages/Citizen/CitizenDashboard";
import CitizenProfile from "./pages/Citizen/CitizenProfile";
import CitizenReports from "./pages/Citizen/CitizenReports";
import Contact from "./pages/Citizen/Contact";
import ReportStatus from "./pages/Citizen/ReportStatus";

//* ========================================
//* IMPORTACIONES: Páginas de Trabajador
//* ========================================
import WorkerDashboard from "./pages/Worker/WorkerDashboard";
import WorkerProgress from "./pages/Worker/WorkerProgress";
import WorkerTasks from "./pages/Worker/WorkerTasks";
import WorkerTeam from "./pages/Worker/WorkerTeam";
import WorkerProfile from "./pages/Worker/WorkerProfile";
import WorkerProgressHistory from "./pages/Worker/WorkerProgressHistory";

//* ========================================
//* IMPORTACIONES: Páginas de Operador
//* ========================================
import OperatorDashboard from "./pages/Operator/OperatorDashboard";
import OperatorReports from "./pages/Operator/OperatorReports";
import OperatorTasks from "./pages/Operator/OperatorTasks";
import OperatorTeams from "./pages/Operator/OperatorTeams";
import OperatorWorkerProgress from "./pages/Operator/OperatorWorkerProgress";
import OperatorMap from "./pages/Operator/OperatorMap";
import OperatorStatistics from "./pages/Operator/OperatorStatistics";
import OperatorProfile from "./pages/Operator/OperatorProfile";
import OperatorCreateTask from "./pages/Operator/OperatorCreateTask";
import OperatorCreateTeams from "./pages/Operator/OperatorCreateTeam";
import OperatorNewReports from "./pages/Operator/OperatorNewReports";

//* ========================================
//* IMPORTACIONES: Páginas de Administrador
//* ========================================
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminStatistics from "./pages/Admin/AdminStatistics";
import AdminMap from "./pages/Admin/AdminMap";
import RegistrationRequests from "./pages/Admin/RegistrationRequests";
import AdminProfileSearch from "./pages/Admin/AdminProfileSearch";
import AdminProfile from "./pages/Admin/AdminProfile";
import AdminGlobalView from "./pages/Admin/AdminGlobalView";

//* ========================================
//* IMPORTACIONES: Páginas de Registro (por rol)
//* ========================================
import OperatorRegister from "./pages/Operator/OperatorRegister";
import WorkerRegister from "./pages/Worker/WorkerRegister";
import AdminRegister from "./pages/Admin/AdminRegister";

//* ========================================
//* IMPORTACIONES: Layouts
//* ========================================
//* Cada layout maneja:
//*   - Navbar específico del rol
//*   - Protección de rutas según rol
//*   - Estructura común (header, content, footer)
import GeneralLayout from "./layout/GeneralLayout";
import CitizenLayout from "./layout/CitizenLayout";
import OperatorLayout from "./layout/OperatorLayout";
import WorkerLayout from "./layout/WorkerLayout";
import AdminLayout from "./layout/AdminLayout";

//* ========================================
//* COMPONENTE: App
//* ========================================
const App = () => {
  return (
    //* UserProvider: Provee el contexto de usuario a toda la app
    //* Permite acceder a user y setUser desde cualquier componente
    <UserProvider>
      {/* BrowserRouter: Activa el enrutamiento del lado del cliente */}
      <BrowserRouter>
        {/* Routes: Contenedor de todas las rutas */}
        <Routes>
          {/***********************************************
           * SECCIÓN 1: RUTAS GENERALES (PÚBLICAS)
           ***********************************************
           * Layout: GeneralLayout
           * Acceso: Sin autenticación
           * Navbar: GeneralNavBar (sin opciones de usuario)
           */}
          <Route element={<GeneralLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<CitizenRegister />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/faq" element={<FAQ />} />
          </Route>

          {/***********************************************
           * SECCIÓN 2: RUTAS DE CIUDADANO
           ***********************************************
           * Layout: CitizenLayout
           * Protección: Solo usuarios con role="citizen"
           * Navbar: CitizenNavBar
           * Funcionalidades:
           *   - Dashboard: Resumen de reportes propios
           *   - Reports: Crear nuevos reportes con imágenes
           *   - ReportStatus: Ver estado de reportes enviados
           *   - Contact: Formulario de contacto
           *   - Profile: Editar información personal
           */}
          <Route element={<CitizenLayout />}>
            <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
            <Route path="/citizen/profile" element={<CitizenProfile />} />
            <Route path="/citizen/reports" element={<CitizenReports />} />
            <Route path="/citizen/contact" element={<Contact />} />
            <Route path="/citizen/reportstatus" element={<ReportStatus />} />
          </Route>

          {/***********************************************
           * SECCIÓN 3: RUTAS DE TRABAJADOR
           ***********************************************
           * Layout: WorkerLayout
           * Protección: Solo usuarios con role="worker"
           * Navbar: WorkerNavBar
           * Funcionalidades:
           *   - Dashboard: Vista general de tareas asignadas
           *   - Progress: Subir reportes de progreso con imágenes
           *   - ProgressHistory: Historial de reportes enviados
           *   - Tasks: Lista de tareas asignadas
           *   - Team: Información de la cuadrilla
           *   - Profile: Editar información personal
           */}
          <Route element={<WorkerLayout />}>
            <Route path="/worker/dashboard" element={<WorkerDashboard />} />
            <Route path="/worker/progress" element={<WorkerProgress />} />
            <Route
              path="/worker/progress-history"
              element={<WorkerProgressHistory />}
            />
            <Route path="/worker/tasks" element={<WorkerTasks />} />
            <Route path="/worker/team" element={<WorkerTeam />} />
            <Route path="/worker/profile" element={<WorkerProfile />} />
          </Route>

          {/***********************************************
           * SECCIÓN 4: RUTAS DE OPERADOR
           ***********************************************
           * Layout: OperatorLayout
           * Protección: Solo usuarios con role="operator"
           * Navbar: OperatorNavBar
           * Funcionalidades:
           *   - Dashboard: Resumen general de reportes y tareas
           *   - Reports: Gestionar reportes ciudadanos
           *   - NewReports: Revisar reportes nuevos (Pendiente)
           *   - Tasks: Gestionar tareas del sistema
           *   - CreateTask: Crear nuevas tareas y asignar cuadrillas
           *   - Teams: Gestionar cuadrillas de trabajadores
           *   - CreateTeam: Crear nuevas cuadrillas
           *   - WorkerProgress: Ver reportes de progreso de trabajadores
           *   - Map: Mapa global con filtros avanzados
           *   - Statistics: Estadísticas y gráficos
           *   - Profile: Editar información personal
           */}
          <Route element={<OperatorLayout />}>
            <Route path="/operator/dashboard" element={<OperatorDashboard />} />
            <Route path="/operator/reports" element={<OperatorReports />} />
            <Route path="/operator/tasks" element={<OperatorTasks />} />
            <Route path="/operator/teams" element={<OperatorTeams />} />
            <Route path="/operator/profile" element={<OperatorProfile />} />
            <Route
              path="/operator/worker-progress"
              element={<OperatorWorkerProgress />}
            />
            <Route path="/operator/map" element={<OperatorMap />} />
            <Route
              path="/operator/statistics"
              element={<OperatorStatistics />}
            />
            <Route
              path="/operator/create-task"
              element={<OperatorCreateTask />}
            />
            <Route
              path="/operator/create-team"
              element={<OperatorCreateTeams />}
            />
            <Route
              path="/operator/new-reports"
              element={<OperatorNewReports />}
            />
          </Route>

          {/***********************************************
           * SECCIÓN 5: RUTAS DE ADMINISTRADOR
           ***********************************************
           * Layout: AdminLayout
           * Protección: Solo usuarios con role="admin"
           * Navbar: AdminNavBar
           * Funcionalidades:
           *   - Dashboard: Resumen completo del sistema
           *   - Statistics: Estadísticas avanzadas
           *   - Map: Mapa global con todos los datos
           *   - GlobalView: Vista global de reportes/tareas/progreso
           *   - RegistrationRequests: Aprobar/rechazar solicitudes de registro
           *   - ProfileSearch: Buscar y editar perfiles de usuarios
           *   - Profile: Editar información personal
           */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/statistics" element={<AdminStatistics />} />
            <Route path="/admin/map" element={<AdminMap />} />
            <Route
              path="/admin/registrationrequests"
              element={<RegistrationRequests />}
            />
            <Route
              path="/admin/profilesearch"
              element={<AdminProfileSearch />}
            />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/globalview" element={<AdminGlobalView />} />
          </Route>

          {/***********************************************
           * SECCIÓN 6: RUTA DE ACTUALIZACIÓN DE CONTRASEÑA
           ***********************************************
           * Acceso: Desde link de email (ForgotPassword)
           * Sin layout específico
           */}
          <Route path="/updatepassword" element={<UpdatePassword />} />

          {/***********************************************
           * SECCIÓN 7: RUTAS DE REGISTRO (POR ROL)
           ***********************************************
           * Acceso: Según permisos
           * Sin layout específico
           * Notas:
           *   - CitizenRegister está en rutas generales (público)
           *   - Operator/Worker/Admin Register requieren autorización
           */}
          <Route path="/operator/register" element={<OperatorRegister />} />
          <Route path="/worker/register" element={<WorkerRegister />} />
          <Route path="/admin/register" element={<AdminRegister />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * BrowserRouter = Enrutador del navegador
 * Routes = Rutas
 * Route = Ruta
 * path = ruta / camino
 * element = elemento
 * UserProvider = Proveedor de usuario
 * GeneralLayout = Diseño general
 * CitizenLayout = Diseño de ciudadano
 * WorkerLayout = Diseño de trabajador
 * OperatorLayout = Diseño de operador
 * AdminLayout = Diseño de administrador
 * Home = Inicio
 * Login = Iniciar sesión
 * Register = Registrarse
 * Dashboard = Tablero / Panel de control
 * Profile = Perfil
 * Reports = Reportes
 * Tasks = Tareas
 * Teams = Cuadrillas / Equipos
 * Progress = Progreso / Avance
 * Map = Mapa
 * Statistics = Estadísticas
 * Contact = Contacto
 * ForgotPassword = Olvidé mi contraseña
 * UpdatePassword = Actualizar contraseña
 */
