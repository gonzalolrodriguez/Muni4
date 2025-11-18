//* ========================================
//* COMPONENTE: OperatorNavBar
//* ========================================
//* Propósito: Barra de navegación para usuarios con rol "Operador"
//* Usado en: OperatorLayout.jsx
//* Links disponibles (11 rutas):
//*   - Dashboard (/operator/dashboard)
//*   - Estadísticas (/operator/statistics)
//*   - Nuevos Reportes (/operator/new-reports) - Reportes sin asignar
//*   - Reportes (/operator/reports) - Todos los reportes
//*   - Tareas (/operator/tasks) - Gestión de tareas
//*   - Equipos (/operator/teams) - Ver cuadrillas
//*   - Crear Tarea (/operator/create-task) - Asignar tarea a cuadrilla
//*   - Crear Equipo (/operator/create-team) - Nueva cuadrilla
//*   - Progreso (/operator/worker-progress) - Ver avances de trabajadores
//*   - Mapa (/operator/map) - Vista geográfica
//* Incluye: NavBarMenu con perfil y logout

import { Link } from "react-router-dom";
import NavBarMenu from "./NavBarMenu";

const OperatorNavBar = () => {
  return (
    //* Navbar: Links a la izquierda, menú de usuario a la derecha
    <nav className="flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur-md shadow-lg rounded-b-2xl border-b-4 border-purple-500">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-extrabold text-purple-600 tracking-tight">
          MuniFor
        </span>
        <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-semibold">
          Operador
        </span>
      </div>
      <ul className="flex gap-6 text-base font-semibold">
        <li>
          <Link
            to="/operator/dashboard"
            className="hover:text-purple-600 transition"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/operator/reports"
            className="hover:text-purple-600 transition"
          >
            Reportes
          </Link>
        </li>
        <li>
          <Link
            to="/operator/tasks"
            className="hover:text-purple-600 transition"
          >
            Tareas
          </Link>
        </li>
        <li>
          <Link
            to="/operator/teams"
            className="hover:text-purple-600 transition"
          >
            Cuadrillas
          </Link>
        </li>
        <li>
          <Link
            to="/operator/create-task"
            className="hover:text-purple-600 transition"
          >
            Crear Tarea
          </Link>
        </li>
        <li>
          <Link
            to="/operator/create-team"
            className="hover:text-purple-600 transition"
          >
            Crear Cuadrilla
          </Link>
        </li>
        <li>
          <Link
            to="/operator/worker-progress"
            className="hover:text-purple-600 transition"
          >
            Progreso
          </Link>
        </li>
        <li>
          <Link to="/operator/map" className="hover:text-purple-600 transition">
            Mapa
          </Link>
        </li>
        <li>
          <Link
            to="/operator/statistics"
            className="hover:text-purple-600 transition"
          >
            Estadísticas
          </Link>
        </li>
      </ul>
      <div className="flex items-center gap-4">
        <NavBarMenu profileType="operator" />
      </div>
    </nav>
  );
};
export default OperatorNavBar;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * OperatorNavBar = barra de navegación de operador
 * profileType = tipo de perfil
 */
