//* ========================================
//* LAYOUT: WorkerLayout
//* ========================================
//* Propósito: Layout protegido para usuarios con rol "Trabajador"
//* Rutas que usan este layout:
//*   - /worker/dashboard
//*   - /worker/progress (IMPORTANTE: Formulario con imágenes)
//*   - /worker/progress-history
//*   - /worker/tasks
//*   - /worker/team
//*   - /worker/profile
//* Estructura:
//*   - WorkerNavBar: Navbar específico del trabajador
//*   - Outlet: Renderiza el componente hijo de la ruta
//*   - Footer: Footer común
//* Funcionalidades del trabajador:
//*   - Ver tareas asignadas a su cuadrilla
//*   - Aceptar tareas
//*   - Reportar progreso con imágenes
//*   - Ver historial de avances

import { Outlet } from "react-router-dom";
import WorkerNavBar from "../components/navbars/WorkerNavBar";
import Footer from "../components/Footer";

const WorkerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="shadow-md">
        <WorkerNavBar />
      </header>
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default WorkerLayout;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * Outlet = salida / contenedor de ruta hija
 * header = encabezado
 * main = principal
 * footer = pie de página
 */
