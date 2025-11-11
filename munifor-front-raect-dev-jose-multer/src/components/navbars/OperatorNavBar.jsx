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
    <nav className="flex items-center justify-between border p-1 mb-4">
      {/* //? Links de funcionalidad de operador */}
      <ul className="flex gap-4">
        <li>
          <Link to="/operator/dashboard" className="border rounded">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/operator/statistics" className="border rounded">
            Estadísticas
          </Link>
        </li>
        {/* //! Link importante: Reportes sin asignar */}
        <li>
          <Link to="/operator/new-reports" className="border rounded">
            Nuevos Reportes
          </Link>
        </li>
        <li>
          <Link to="/operator/reports" className="border rounded">
            Reportes
          </Link>
        </li>
        <li>
          <Link to="/operator/tasks" className="border rounded">
            Tareas
          </Link>
        </li>
        <li>
          <Link to="/operator/teams" className="border rounded">
            Equipos
          </Link>
        </li>
        {/* //! Links de creación */}
        <li>
          <Link to="/operator/create-task" className="border rounded">
            Crear Tarea
          </Link>
        </li>
        <li>
          <Link to="/operator/create-team" className="border rounded">
            Crear Equipo
          </Link>
        </li>
        <li>
          <Link to="/operator/worker-progress" className="border rounded">
            Progreso de Trabajadores
          </Link>
        </li>
        <li>
          <Link to="/operator/map" className="border rounded">
            Mapa
          </Link>
        </li>
      </ul>

      {/* //! Menú desplegable: Perfil y Sign out */}
      <NavBarMenu profileType="operator" />
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
