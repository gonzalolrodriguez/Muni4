//! ========================================
//! OPERATOR DASHBOARD - PANEL DE CONTROL DEL OPERADOR
//! ========================================
//* Propósito: Dashboard principal del operador con estadísticas y accesos rápidos
//* Ruta: /operator/dashboard
//* Layout: OperatorLayout (con OperatorNavBar)
//* Endpoint: GET /dashboard/operators - Obtiene contadores de estadísticas
//* Características:
//*   - 4 tarjetas de estadísticas principales (Nuevos reportes, Rechazados, En proceso, Completados)
//*   - 2 tarjetas de estadísticas secundarias (Cuadrillas activas, Tareas asignadas)
//*   - 4 tarjetas de acciones rápidas (Gestionar reportes, Asignar tareas, Ver mapa, Estadísticas)
//*   - Navegación a páginas específicas al hacer clic en tarjetas

import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";

//? ========================================
//? COMPONENTE PRINCIPAL - OPERATORDASHBOARD
//? ========================================
//* Descripción: Dashboard principal del operador con contadores y accesos rápidos
//* @returns {JSX.Element} - Dashboard con estadísticas y navegación rápida
//* Uso: Página inicial al iniciar sesión como operador
const OperatorDashboard = () => {
  //? Estado para contadores de estadísticas del operador
  const [counts, setCounts] = useState({
    totalNewReports: 0, //* Total de reportes nuevos (estado "Nuevo")
    inProcess: 0, //* Reportes en proceso (aceptados, con o sin tarea)
    completed: 0, //* Reportes completados
    rejected: 0, //* Reportes rechazados
    activeCrews: 0, //* Cuadrillas activas (no borradas)
    assignedTasks: 0, //* Tareas asignadas a cuadrillas
  });
  const { getFetchData } = useFetch();
  const navigate = useNavigate();

  //? ========================================
  //? EFFECT: CARGAR ESTADÍSTICAS DEL DASHBOARD
  //? ========================================
  //* Se ejecuta al montar el componente
  //* Obtiene contadores desde /dashboard/operators
  useEffect(() => {
    let isMounted = true; //* Flag para evitar actualizar estado si el componente se desmonta

    const fetchCounts = async () => {
      try {
        //? Llama al endpoint para obtener estadísticas del operador
        const data = await getFetchData("/dashboard/operators");
        if (isMounted && data.ok) {
          //? Actualiza estado con contadores del backend
          setCounts(data.counts);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
        }
      }
    };

    fetchCounts();

    //? Cleanup: evita memory leaks al desmontar
    return () => {
      isMounted = false;
    };
  }, [getFetchData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf4fe] to-[#d2e7fa] p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-cyan-700 mb-2 drop-shadow">Dashboard Operador</h1>
        <p className="text-cyan-600 text-lg">Panel de control y gestión de operaciones municipales</p>
      </div>

      <div className="flex flex-col gap-8">
        {/* ========================================
            SECCIÓN: ESTADÍSTICAS PRINCIPALES (4 TARJETAS)
            ======================================== 
            * Total de Nuevos Reportes - Navega a /operator/reports
            * Rechazados - Navega a /operator/reports?status=Rechazado
            * En Proceso - Navega a /operator/reports?status=Aceptado
            * Completados - Navega a /operator/reports?status=Completado
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* TARJETA 1: Total de Nuevos Reportes */}
          <div
            className="bg-blue-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-blue-700 p-6 flex flex-col items-center justify-center border border-blue-300 cursor-pointer transition-all"
            onClick={() => navigate("/operator/reports")}
          >
            <span className="text-3xl font-bold">{counts.totalNewReports}</span>
            <span className="mt-2 font-semibold">Total Reportes</span>
          </div>

          {/* TARJETA 2: Reportes Rechazados */}
          <div
            className="bg-yellow-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-yellow-700 p-6 flex flex-col items-center justify-center border border-yellow-200 cursor-pointer transition-all"
            onClick={() => navigate("/operator/reports?status=Rechazado")}
          >
            <span className="text-3xl font-bold">{counts.rejected}</span>
            <span className="mt-2 font-semibold">Rechazados</span>
          </div>

          {/* TARJETA 3: Reportes En Proceso */}
          <div
            className="bg-orange-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-orange-700 p-6 flex flex-col items-center justify-center border border-orange-200 cursor-pointer transition-all"
            onClick={() => navigate("/operator/reports?status=Aceptado")}
          >
            <span className="text-3xl font-bold">{counts.inProcess}</span>
            <span className="mt-2 font-semibold">En Proceso</span>
          </div>

          {/* TARJETA 4: Reportes Completados */}
          <div
            className="bg-purple-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-purple-700 p-6 flex flex-col items-center justify-center border border-purple-200 cursor-pointer transition-all"
            onClick={() => navigate("/operator/reports?status=Completado")}
          >
            <span className="text-3xl font-bold">{counts.completed}</span>
            <span className="mt-2 font-semibold">Completados</span>
          </div>
        </div>

        {/* ========================================
            SECCIÓN: ESTADÍSTICAS SECUNDARIAS (2 TARJETAS)
            ======================================== 
            * Cuadrillas Activas - Navega a /operator/teams
            * Tareas Asignadas - Navega a /operator/tasks
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TARJETA 5: Cuadrillas Activas */}
          <div
            className="bg-teal-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-teal-700 p-6 flex flex-col items-center justify-center border border-teal-200 cursor-pointer transition-all"
            onClick={() => navigate("/operator/teams")}
          >
            <span className="text-3xl font-bold">{counts.activeCrews}</span>
            <span className="mt-2 font-semibold">Cuadrillas Activas</span>
          </div>

          {/* TARJETA 6: Tareas Asignadas */}
          <div
            className="bg-pink-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-pink-700 p-6 flex flex-col items-center justify-center border border-pink-200 cursor-pointer transition-all"
            onClick={() => navigate("/operator/tasks")}
          >
            <span className="text-3xl font-bold">{counts.assignedTasks}</span>
            <span className="mt-2 font-semibold">Tareas Asignadas</span>
          </div>
        </div>

        {/* ========================================
            SECCIÓN: ACCIONES RÁPIDAS (4 TARJETAS)
            ======================================== */}
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-extrabold text-cyan-700 mb-2 drop-shadow">
            Acciones Rápidas
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* ACCIÓN 1: Gestionar Reportes */}
          <div
            className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-cyan-200 hover:scale-[1.03] transition-transform cursor-pointer"
            onClick={() => navigate("/operator/reports")}
          >
            <div className="text-4xl mb-4 text-cyan-600">📋</div>
            <h3 className="text-xl font-bold text-cyan-700 mb-2">Gestionar Reportes</h3>
            <p className="text-cyan-600 text-sm">Ver y administrar todos los reportes</p>
          </div>

          {/* ACCIÓN 2: Asignar Tareas */}
          <div
            className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-cyan-200 hover:scale-[1.03] transition-transform cursor-pointer"
            onClick={() => navigate("/operator/create-task")}
          >
            <div className="text-4xl mb-4 text-cyan-600">👥</div>
            <h3 className="text-xl font-bold text-cyan-700 mb-2">Asignar Tareas</h3>
            <p className="text-cyan-600 text-sm">Asignar trabajos a cuadrillas</p>
          </div>

          {/* ACCIÓN 3: Ver Mapa */}
          <div
            className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-cyan-200 hover:scale-[1.03] transition-transform cursor-pointer"
            onClick={() => navigate("/operator/map")}
          >
            <div className="text-4xl mb-4 text-cyan-600">🗺️</div>
            <h3 className="text-xl font-bold text-cyan-700 mb-2">Ver Mapa</h3>
            <p className="text-cyan-600 text-sm">Visualizar reportes en el mapa</p>
          </div>

          {/* ACCIÓN 4: Estadísticas */}
          <div
            className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-cyan-200 hover:scale-[1.03] transition-transform cursor-pointer"
            onClick={() => navigate("/operator/statistics")}
          >
            <div className="text-4xl mb-4 text-cyan-600">📊</div>
            <h3 className="text-xl font-bold text-cyan-700 mb-2">Estadísticas</h3>
            <p className="text-cyan-600 text-sm">Análisis y reportes detallados</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;

//! ========================================
//! TRADUCCIÓN DE CONSTANTES
//! ========================================
//* Dashboard - Panel de control
//* totalNewReports - Total de reportes nuevos
//* inProcess - En proceso
//* completed - Completados
//* rejected - Rechazados
//* activeCrews - Cuadrillas activas
//* assignedTasks - Tareas asignadas
//* navigate - navegar
//* counts - contadores
