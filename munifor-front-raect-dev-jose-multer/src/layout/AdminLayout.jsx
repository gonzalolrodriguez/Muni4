//* ========================================
//* LAYOUT: AdminLayout
//* ========================================
//* Propósito: Layout protegido para usuarios con rol "Administrador"
//* Rutas que usan este layout:
//*   - /admin/dashboard
//*   - /admin/statistics
//*   - /admin/map
//*   - /admin/registrationrequests (Aprobar/rechazar solicitudes de registro)
//*   - /admin/profilesearch (Buscar y gestionar usuarios)
//*   - /admin/profile
//*   - /admin/globalview (Vista global del sistema)
//* Funcionalidades del administrador:
//*   - Aprobar/rechazar solicitudes de registro de operadores/trabajadores
//*   - Gestionar todos los usuarios del sistema
//*   - Ver estadísticas globales
//*   - Ver mapa global completo
//*   - Monitorear estado general del sistema
//*   - Acceso completo a todos los datos

import { Outlet } from "react-router-dom";
import AdminNavBar from "../components/navbars/AdminNavBar";
import Footer from "../components/Footer";

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="shadow-md">
        <AdminNavBar />
      </header>
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * Outlet = salida / contenedor de ruta hija
 * header = encabezado
 * main = principal
 * footer = pie de página
 */
