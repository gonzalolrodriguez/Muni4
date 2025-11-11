//* ========================================
//* LAYOUT: CitizenLayout
//* ========================================
//* Propósito: Layout protegido para usuarios con rol "Ciudadano"
//* Rutas que usan este layout:
//*   - /citizen/dashboard
//*   - /citizen/profile
//*   - /citizen/reports
//*   - /citizen/contact
//*   - /citizen/reportstatus
//* Estructura:
//*   - CitizenNavBar: Navbar con links específicos del ciudadano
//*   - Outlet: Renderiza el componente hijo de la ruta
//*   - Footer: Footer común
//* Protección: Este layout debe verificar que el usuario esté autenticado

import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import CitizenNavBar from "../components/navbars/CitizenNavBar";

const CitizenLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="shadow-md">
        <CitizenNavBar />
      </header>
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CitizenLayout;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * Outlet = salida / contenedor de ruta hija
 * header = encabezado
 * main = principal
 * footer = pie de página
 */
