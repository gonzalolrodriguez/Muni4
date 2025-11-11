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
    <nav className="flex items-center justify-between border p-1 mb-4">
      {/* //? Links de funcionalidad de administrador */}
      <ul className="flex gap-4">
        <li>
          <Link to="/admin/dashboard" className="border rounded">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/statistics" className="border rounded">
            Estadísticas
          </Link>
        </li>
        <li>
          <Link to="/admin/map" className="border rounded">
            Mapa
          </Link>
        </li>
        {/* //! Link crítico: Aprobar/rechazar solicitudes de registro */}
        <li>
          <Link to="/admin/registrationrequests" className="border rounded">
            Solicitudes de registro
          </Link>
        </li>
        <li>
          <Link to="/admin/profilesearch" className="border rounded">
            Búsqueda de perfiles
          </Link>
        </li>
        <li>
          <Link to="/admin/globalview" className="border rounded">
            Vista Global
          </Link>
        </li>
      </ul>

      {/* //! Menú desplegable: Perfil y Sign out */}
      <NavBarMenu profileType="admin" />
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
