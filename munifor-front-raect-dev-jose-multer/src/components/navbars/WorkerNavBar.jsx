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
    <nav className="flex items-center justify-between border p-1 mb-4">
      {/* //? Links de funcionalidad de trabajador */}
      <ul className="flex gap-4">
        <li>
          <Link to="/worker/dashboard" className="border rounded">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/worker/tasks" className="border rounded">
            Tareas
          </Link>
        </li>
        {/* //! Link crítico: Crear avances con imágenes */}
        <li>
          <Link to="/worker/progress" className="border rounded">
            Crea un nuevo avance
          </Link>
        </li>

        <li>
          <Link to="/worker/progress-history" className="border rounded">
            Historial de avances
          </Link>
        </li>

        <li>
          <Link to="/worker/team" className="border rounded">
            Equipo
          </Link>
        </li>
        <li>
          <Link to="/worker/history" className="border rounded">
            Historial
          </Link>
        </li>
      </ul>

      {/* //! Menú desplegable: Perfil y Sign out */}
      <NavBarMenu profileType="worker" />
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
