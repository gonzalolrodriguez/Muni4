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
    <nav className="bg-white/70 backdrop-blur-md shadow-lg px-6 py-4 flex items-center justify-between sticky top-0 z-20 border-b-4 border-cyan-500 rounded-b-2xl">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-extrabold text-cyan-700 tracking-tight">
          MuniFor
        </span>
      </div>
      <div className="flex-1 flex justify-center">
        <ul className="flex gap-4">
          <li>
            <Link
              to="/"
              className="text-cyan-700 font-bold hover:text-cyan-900 transition"
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/faq"
              className="text-cyan-700 font-bold hover:text-cyan-900 transition"
            >
              Preguntas Frecuentes
            </Link>
          </li>
        </ul>
      </div>
      <ul className="flex gap-2">
        <li>
          <Link
            to="/register"
            className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold shadow hover:bg-cyan-700 transition"
          >
            Registrarse
          </Link>
        </li>
        <li>
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl bg-white border border-cyan-600 text-cyan-600 font-bold shadow hover:bg-cyan-50 transition"
          >
            Iniciar sesión
          </Link>
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
