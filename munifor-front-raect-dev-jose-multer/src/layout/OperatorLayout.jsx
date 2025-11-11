//* ========================================
//* LAYOUT: OperatorLayout
//* ========================================
//* Propósito: Layout protegido para usuarios con rol "Operador"
//* Rutas que usan este layout:
//*   - /operator/dashboard
//*   - /operator/reports
//*   - /operator/tasks
//*   - /operator/teams
//*   - /operator/profile
//*   - /operator/worker-progress
//*   - /operator/map (Mapa con filtros GlobalLeafletMap)
//*   - /operator/statistics
//*   - /operator/create-task (Crear tareas)
//*   - /operator/create-team (Crear cuadrillas)
//*   - /operator/new-reports (Nuevos reportes)
//* Funcionalidades del operador:
//*   - Gestionar reportes (revisar, aceptar, rechazar)
//*   - Crear y asignar tareas a cuadrillas
//*   - Gestionar cuadrillas (crear, editar, asignar trabajadores)
//*   - Monitorear progreso de trabajadores
//*   - Ver mapa global con filtros
//*   - Ver estadísticas

import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import OperatorNavBar from "../components/navbars/OperatorNavBar";

const OperatorLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="shadow-md">
        <OperatorNavBar />
      </header>
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default OperatorLayout;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * Outlet = salida / contenedor de ruta hija
 * header = encabezado
 * main = principal
 * footer = pie de página
 */
