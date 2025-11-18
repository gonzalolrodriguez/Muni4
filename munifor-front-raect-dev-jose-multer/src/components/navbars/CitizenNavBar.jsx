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
    <nav className="flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur-md shadow-lg rounded-b-2xl border-b-4 border-cyan-500">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-extrabold text-cyan-700 tracking-tight">
          MuniFor
        </span>
        <span className="px-2 py-1 rounded bg-cyan-100 text-cyan-700 text-xs font-semibold">
          Ciudadano
        </span>
      </div>
      <ul className="flex gap-6 text-base font-bold">
        <li>
          <Link
            to="/citizen/dashboard"
            className="hover:text-cyan-600 transition"
          >
            Inicio
          </Link>
        </li>
        <li>
          <Link
            to="/citizen/reports"
            className="hover:text-cyan-600 transition"
          >
            Hacer Reporte
          </Link>
        </li>
        <li>
          <Link
            to="/citizen/reportstatus"
            className="hover:text-cyan-600 transition"
          >
            Mis Reportes
          </Link>
        </li>
        {/* <li>
          <Link
            to="/citizen/profile"
            className="hover:text-cyan-600 transition"
          >
            Mi Perfil
          </Link>
        </li> */}
        {/* <li>
          <Link
            to="/citizen/contact"
            className="hover:text-cyan-600 transition"
          >
            Contacto
          </Link>
        </li> */}
      </ul>
      <div className="flex items-center gap-4">
        <NavBarMenu profileType="citizen" />
      </div>
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
