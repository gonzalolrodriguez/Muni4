//* ========================================
//* COMPONENTE: WorkerNavBar
//* ========================================
//* Propósito: Barra de navegación para usuarios con rol "Trabajador"
//* Usado en: WorkerLayout.jsx
//* Links disponibles:
//*   - Dashboard (/worker/dashboard)
//*   - Tareas (/worker/tasks) - Ver tareas asignadas
//*   - Crear avance (/worker/progress) - Reportar progreso con imágenes
//*   - Historial de avances (/worker/progress-history) - Ver avances previos
//*   - Equipo (/worker/team) - Ver cuadrilla asignada
//*   - Historial (/worker/history) - Historial general
//* Incluye: NavBarMenu con perfil y logout

import { Link } from "react-router-dom";
import NavBarMenu from "./NavBarMenu";

const WorkerNavBar = () => {
  return (
    //* Navbar: Links a la izquierda, menú de usuario a la derecha
    <nav className="flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur-md shadow-lg rounded-b-2xl border-b-4 border-orange-500">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-extrabold text-orange-600 tracking-tight">
          MuniFor
        </span>
        <span className="px-2 py-1 rounded bg-orange-100 text-orange-700 text-xs font-semibold">
          Trabajador
        </span>
      </div>
      <ul className="flex gap-6 text-base font-semibold">
        <li>
          <Link
            to="/worker/dashboard"
            className="hover:text-orange-600 transition"
          >
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/worker/tasks" className="hover:text-orange-600 transition">
            Mis Tareas
          </Link>
        </li>
        <li>
          <Link
            to="/worker/progress"
            className="hover:text-orange-600 transition"
          >
            Nuevo Avance
          </Link>
        </li>
        <li>
          <Link
            to="/worker/progress-history"
            className="hover:text-orange-600 transition"
          >
            Historial
          </Link>
        </li>
        <li>
          <Link to="/worker/team" className="hover:text-orange-600 transition">
            Equipo
          </Link>
        </li>
      </ul>
      <div className="flex items-center gap-4">
        <NavBarMenu profileType="worker" />
      </div>
    </nav>
  );
};
export default WorkerNavBar;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * WorkerNavBar = barra de navegación de trabajador
 * profileType = tipo de perfil
 */
