//* ========================================
//* COMPONENTE: GeneralNavBar
//* ========================================
//* Propósito: Barra de navegación para usuarios NO autenticados
//* Usado en: GeneralLayout.jsx (Home, Login, Register, FAQ, etc.)
//* Links principales:
//*   - Inicio (/)
//*   - Preguntas Frecuentes (/faq)
//*   - Registro (/register)
//*   - Login (/login)

import { Link } from "react-router-dom";

const GeneralNavBar = () => {
  return (
    <nav className="bg-white shadow-md px-4 py-2 flex items-center justify-between sticky top-0 z-20">
      <ul className="flex gap-4">
        <li>
          <Link to="/" className="text-blue-700 font-semibold hover:text-blue-900 transition">Inicio</Link>
        </li>
        <li>
          <Link to="/faq" className="text-blue-700 font-semibold hover:text-blue-900 transition">Preguntas Frecuentes</Link>
        </li>
      </ul>
      <ul className="flex gap-2">
        <li>
          <Link to="/register" className="px-4 py-1 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Registrarse</Link>
        </li>
        <li>
          <Link to="/login" className="px-4 py-1 rounded-lg bg-white border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition">Iniciar sesión</Link>
        </li>
      </ul>
    </nav>
  );
};
export default GeneralNavBar;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * GeneralNavBar = barra de navegación general
 * nav = navegación
 * Link = enlace
 */
