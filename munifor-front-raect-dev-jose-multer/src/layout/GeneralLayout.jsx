//* ========================================
//* LAYOUT: GeneralLayout
//* ========================================
//* Propósito: Layout para páginas públicas sin autenticación
//* Rutas que usan este layout:
//*   - / (Home)
//*   - /login
//*   - /register
//*   - /forgotpassword
//*   - /faq
//* Estructura:
//*   - GeneralNavBar: Navbar público con links a login/register
//*   - Outlet: Renderiza el componente hijo de la ruta
//*   - Footer: Footer común de toda la app

import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import GeneralNavBar from "../components/navbars/GeneralNavBar";

const GeneralLayout = () => {
  return (
    //* Contenedor flex que ocupa toda la altura de la pantalla
    <div className="flex flex-col min-h-screen">
      {/* Header con navbar público */}
      <header>
        <GeneralNavBar />
      </header>

      {/* Main: Contenido principal que crece para empujar el footer abajo */}
      <main className="flex-1">
        {/* Outlet: Aquí se renderiza el componente de la ruta actual */}
        {/* Ejemplos: <Home />, <Login />, <CitizenRegister />, etc. */}
        <Outlet />
      </main>

      {/* Footer fijo en la parte inferior */}
      <Footer />
    </div>
  );
};

export default GeneralLayout;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * Outlet = salida / contenedor de ruta hija
 * header = encabezado
 * main = principal
 * footer = pie de página
 */
