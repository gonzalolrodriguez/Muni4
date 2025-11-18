//* ========================================
//* COMPONENTE: AdminNavBar
//* ========================================
//* Propósito: Barra de navegación para usuarios con rol "Administrador"
//* Usado en: AdminLayout.jsx
//* Links disponibles (7 rutas):
//*   - Dashboard (/admin/dashboard)
//*   - Estadísticas (/admin/statistics)
//*   - Mapa (/admin/map) - Vista geográfica completa
//*   - Solicitudes (/admin/registrationrequests) - Aprobar/rechazar registros
//*   - Búsqueda (/admin/profilesearch) - Buscar usuarios por perfil
//*   - Vista Global (/admin/globalview) - Panel de control completo
//* Incluye: NavBarMenu con perfil y logout

import { Link } from "react-router-dom";
import NavBarMenu from "./NavBarMenu";

const AdminNavBar = () => {
  return (
    //* Navbar: Links a la izquierda, menú de usuario a la derecha
    <nav className="flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur-md shadow-lg rounded-b-2xl border-b-4 border-pink-500">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-extrabold text-pink-600 tracking-tight">
          MuniFor
        </span>
        <span className="px-2 py-1 rounded bg-pink-100 text-pink-700 text-xs font-semibold">
          Administrador
        </span>
      </div>
      <ul className="flex gap-6 text-base font-semibold">
        <li>
          <Link
            to="/admin/dashboard"
            className="hover:text-pink-600 transition"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/admin/statistics"
            className="hover:text-pink-600 transition"
          >
            Estadísticas
          </Link>
        </li>
        <li>
          <Link to="/admin/map" className="hover:text-pink-600 transition">
            Mapa
          </Link>
        </li>
        {/* //! Link crítico: Aprobar/rechazar solicitudes de registro */}
        <li>
          <Link
            to="/admin/registrationrequests"
            className="hover:text-pink-600 transition"
          >
            Solicitudes de registro
          </Link>
        </li>
        <li>
          <Link
            to="/admin/profilesearch"
            className="hover:text-pink-600 transition"
          >
            Búsqueda de perfiles
          </Link>
        </li>
        <li>
          <Link
            to="/admin/globalview"
            className="hover:text-pink-600 transition"
          >
            Vista Global
          </Link>
        </li>
      </ul>
      <div className="flex items-center gap-4">
        <NavBarMenu profileType="admin" />
      </div>
    </nav>
  );
};
export default AdminNavBar;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * AdminNavBar = barra de navegación de administrador
 * profileType = tipo de perfil
 */
