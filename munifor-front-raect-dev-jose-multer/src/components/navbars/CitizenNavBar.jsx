//* ========================================
//* COMPONENTE: CitizenNavBar
//* ========================================
//* Propósito: Barra de navegación para usuarios con rol "Ciudadano"
//* Usado en: CitizenLayout.jsx
//* Links disponibles:
//*   - Dashboard (/citizen/dashboard)
//*   - Hacer reporte (/citizen/reports) - Crea reportes con imágenes
//*   - Estado de reportes (/citizen/reportstatus) - Ver reportes propios
//*   - Contacto (/citizen/contact)
//* Incluye: NavBarMenu con perfil y logout

import { Link } from "react-router-dom";
import NavBarMenu from "./NavBarMenu";

const CitizenNavBar = () => {
  return (
    //* Navbar: Links a la izquierda, menú de usuario a la derecha
    <nav className="flex items-center justify-between border p-1">
      {/* //? Links de funcionalidad de ciudadano */}
      <ul className="flex gap-4">
        <li>
          <Link to="/citizen/dashboard" className="border rounded">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/citizen/reports" className="border rounded">
            Hacer reporte
          </Link>
        </li>
        <li>
          <Link to="/citizen/reportstatus" className="border rounded">
            Estado de sus reportes
          </Link>
        </li>
        <li>
          <Link to="/citizen/contact" className="border rounded">
            Contactanos
          </Link>
        </li>
      </ul>

      {/* //! Menú desplegable: Perfil y Sign out */}
      <NavBarMenu profileType="citizen" />
    </nav>
  );
};

export default CitizenNavBar;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * CitizenNavBar = barra de navegación de ciudadano
 * profileType = tipo de perfil
 */
