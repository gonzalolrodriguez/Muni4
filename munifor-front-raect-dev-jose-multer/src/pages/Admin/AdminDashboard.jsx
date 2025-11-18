//! ===============================================
//! ADMIN DASHBOARD - Panel principal administrador
//! ===============================================
//* Ruta: /admin
//* Layout: AdminLayout
//* Acceso: Solo rol "Administrador"

//* Propósito:
//? Panel de control principal para administradores del sistema
//? Muestra estadísticas generales (usuarios, reportes, trabajadores, operadores, eficiencia)
//? Endpoint: GET /dashboard/admin
//? Provee acceso rápido a las funciones principales de administración

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

/**
 * * Componente AdminDashboard
 * ? Panel de control principal para administradores del sistema
 * @returns {JSX.Element} Dashboard con estadísticas y acciones rápidas
 *
 * Características:
 * - Muestra 7 estadísticas principales (usuarios, reportes, trabajadores activos, etc.)
 * - Muestra tarjetas de acceso rápido a las principales funcionalidades
 * - Actualiza estadísticas en tiempo real desde el endpoint /dashboard/admin
 */
const AdminDashboard = () => {
  //? Estado para almacenar todas las estadísticas del sistema
  const [count, setCount] = useState({
    totalUsers: 0, //* Total de usuarios registrados (todos los roles)
    totalReports: 0, //* Total de reportes en el sistema
    newReports: 0, //* Reportes con estado "Nuevo" o "Pendiente"
    completedReports: 0, //* Reportes con estado "Completado"
    activeWorkers: 0, //* Trabajadores actualmente trabajando en tareas
    activeOperators: 0, //* Operadores actualmente activos en el sistema
    efficiencyRate: 0, //* Tasa de eficiencia general del sistema (%)
  });
  const navigate = useNavigate();
  const { getFetchData } = useFetch();

  /**
   * * useEffect - Cargar estadísticas del sistema
   * ? Se ejecuta al montar el componente
   * ! Endpoint: GET /dashboard/admin
   * ! Estructura de respuesta: { counts: { totalUsers, totalReports, ... } }
   */
  useEffect(() => {
    let isMounted = true; //? Flag para evitar actualizaciones de estado en componente desmontado

    const fetchStats = async () => {
      try {
        const data = await getFetchData("/dashboard/admin");
        if (isMounted) {
          setCount(data.counts); //* Actualiza todas las estadísticas recibidas del backend
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching stats:", error);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false; //? Cleanup: marca el componente como desmontado
    };
  }, [getFetchData]);

  //? ============================================
  //? RENDERIZADO JSX
  //? ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf4fe] to-[#d2e7fa] p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-cyan-700 mb-2 drop-shadow">
          🛡️ Dashboard Administrador
        </h1>
        <p className="text-cyan-600 text-lg">
          Panel de control y gestión completa del sistema municipal
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* ====== SECCIÓN: Estadísticas principales (7 tarjetas) ====== */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Tarjeta: Total usuarios */}
          <div className="bg-blue-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-blue-700 p-6 flex flex-col items-center justify-center border border-blue-300">
            <span className="text-3xl font-bold">{count.totalUsers}</span>
            <span className="mt-2 font-semibold">Total Usuarios</span>
          </div>

          {/* Tarjeta: Total reportes */}
          <div className="bg-green-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-green-700 p-6 flex flex-col items-center justify-center border border-green-300">
            <span className="text-3xl font-bold">{count.totalReports}</span>
            <span className="mt-2 font-semibold">Total Reportes</span>
          </div>

          {/* Tarjeta: Reportes nuevos */}
          <div className="bg-yellow-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-yellow-700 p-6 flex flex-col items-center justify-center border border-yellow-200">
            <span className="text-3xl font-bold">{count.newReports}</span>
            <span className="mt-2 font-semibold">Reportes Pendientes</span>
          </div>

          {/* Tarjeta: Reportes completados */}
          <div className="bg-purple-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-purple-700 p-6 flex flex-col items-center justify-center border border-purple-200">
            <span className="text-3xl font-bold">{count.completedReports}</span>
            <span className="mt-2 font-semibold">Completados</span>
          </div>

          {/* Tarjeta: Trabajadores activos */}
          <div className="bg-orange-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-orange-700 p-6 flex flex-col items-center justify-center border border-orange-200">
            <span className="text-3xl font-bold">{count.activeWorkers}</span>
            <span className="mt-2 font-semibold">Trabajadores Activos</span>
          </div>

          {/* Tarjeta: Operadores activos */}
          <div className="bg-teal-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-teal-700 p-6 flex flex-col items-center justify-center border border-teal-200">
            <span className="text-3xl font-bold">{count.activeOperators}</span>
            <span className="mt-2 font-semibold">Operadores Activos</span>
          </div>

          {/* Tarjeta: Tasa de eficiencia del sistema */}
          <div className="bg-pink-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-pink-700 p-6 flex flex-col items-center justify-center border border-pink-200 col-span-2">
            <span className="text-3xl font-bold">{count.efficiencyRate}%</span>
            <span className="mt-2 font-semibold">Tasa de Eficiencia</span>
          </div>
        </div>

        {/* ====== SECCIÓN: Acciones rápidas (navegación a otras vistas) ====== */}
        <div className="mb-4 text-center">
          <h2 className="text-3xl font-extrabold text-cyan-700 mb-2 drop-shadow">
            Acciones Rápidas
          </h2>
          <p className="text-cyan-600 text-lg">
            Acceso directo a las funciones principales
          </p>
        </div>

        {/*//* Grid de tarjetas clickeables que navegan a las principales funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
          {/* Acción: Gestionar usuarios */}
          <div
            className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-cyan-200 hover:scale-[1.03] transition-transform cursor-pointer"
            onClick={() => navigate("/admin/profilesearch")}
          >
            <div className="text-4xl mb-4 text-cyan-600">👥</div>
            <h3 className="text-xl font-bold text-cyan-700 mb-2">
              Gestionar Usuarios
            </h3>
            <p className="text-cyan-600 text-sm">
              Administrar cuentas de usuarios
            </p>
          </div>

          {/* Acción: Vista global del sistema */}
          <div
            className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-cyan-200 hover:scale-[1.03] transition-transform cursor-pointer"
            onClick={() => navigate("/admin/globalview")}
          >
            <div className="text-4xl mb-4 text-cyan-600">📋</div>
            <h3 className="text-xl font-bold text-cyan-700 mb-2">
              Vista General
            </h3>
          </div>

          {/* Acción: Ver estadísticas y gráficos */}
          <div
            className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-cyan-200 hover:scale-[1.03] transition-transform cursor-pointer"
            onClick={() => navigate("/admin/statistics")}
          >
            <div className="text-4xl mb-4 text-cyan-600">📊</div>
            <h3 className="text-xl font-bold text-cyan-700 mb-2">
              Estadísticas
            </h3>
            <p className="text-cyan-600 text-sm">
              Análisis detallado del sistema
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

//! ===============================================
//! TRADUCCIÓN DE CONSTANTES
//! ===============================================
/**
 * ESPAÑOL | INGLÉS
 * ----------------
 * totalUsers = total de usuarios
 * totalReports = total de reportes
 * newReports = reportes nuevos
 * completedReports = reportes completados
 * activeWorkers = trabajadores activos
 * activeOperators = operadores activos
 * efficiencyRate = tasa de eficiencia
 * count = conteo/contador
 * navigate = navegar
 * isMounted = está montado
 * fetchStats = obtener estadísticas
 */
