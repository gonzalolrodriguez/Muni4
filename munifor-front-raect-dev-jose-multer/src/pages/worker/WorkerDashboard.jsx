//* ========================================
//* PÁGINA: WorkerDashboard
//* ========================================
//* Propósito: Panel principal del trabajador con accesos rápidos y estadísticas de tareas
//* Ruta: /worker/dashboard
//* Layout: WorkerLayout
//* Características:
//*   - 5 tarjetas de acceso rápido: Ver tareas, Nuevo avance, Historial, Equipo, Historial de tareas
//*   - 4 tarjetas de estadísticas: Pendiente, En progreso, Finalizada, Total
//*   - Endpoint: /dashboard/workers (trae counts de tareas del trabajador)
//*   - Navegación con useNavigate al hacer click

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const WorkerDashboard = () => {
  //* ========================================
  //* ESTADO Y NAVEGACIÓN
  //* ========================================
  const navigate = useNavigate();
  //? Estado de contadores de tareas por status
  const [counts, setCounts] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    total: 0,
  });
  const { getFetchData } = useFetch();

  //* ========================================
  //* EFECTO: Cargar estadísticas del trabajador
  //* ========================================
  useEffect(() => {
    let isMounted = true; // Prevenir actualizaciones si se desmonta

    const fetchCounts = async () => {
      try {
        //! Endpoint que trae los counts de tareas del trabajador
        const data = await getFetchData("/dashboard/workers");
        if (isMounted && data.ok) {
          setCounts(data.counts);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
        }
      }
    };

    fetchCounts();

    //! Cleanup: marcar componente como desmontado
    return () => {
      isMounted = false;
    };
  }, []);

  //* ========================================
  //* RENDER
  //* ========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf4fe] to-[#d2e7fa] p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-cyan-700 mb-2 drop-shadow">
          Mis Tareas
        </h1>
        <p className="text-cyan-600">
          Gestiona y completa las tareas asignadas
        </p>
      </div>

      {/* //? Tarjetas de estadísticas de tareas (4) */}
      <div className="flex flex-col gap-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-orange-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-orange-700 p-6 flex flex-col items-center justify-center border border-orange-200">
            <span className="text-3xl font-bold">{counts.total}</span>
            <span className="mt-2 font-semibold">Total</span>
          </div>
          <div className="bg-yellow-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-yellow-700 p-6 flex flex-col items-center justify-center border border-yellow-200">
            <span className="text-3xl font-bold">{counts.pending}</span>
            <span className="mt-2 font-semibold">Pendientes</span>
          </div>
          <div className="bg-blue-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-blue-700 p-6 flex flex-col items-center justify-center border border-blue-300">
            <span className="text-3xl font-bold">{counts.inProgress}</span>
            <span className="mt-2 font-semibold">En Proceso</span>
          </div>
          <div className="bg-green-100/70 backdrop-blur-md shadow-2xl rounded-2xl text-green-700 p-6 flex flex-col items-center justify-center border border-green-200">
            <span className="text-3xl font-bold">{counts.completed}</span>
            <span className="mt-2 font-semibold">Completadas</span>
          </div>
        </div>
      </div>

      {/* //? TARJETAS DE ACCESO RÁPIDO (5) */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-cyan-700 mb-2 drop-shadow">
          Accesos Rápidos
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* //? Tarjeta 1: Ver tareas */}
        <div
          className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-cyan-200 hover:scale-[1.03] transition-transform cursor-pointer"
          onClick={() => navigate("/worker/tasks")}
        >
          <div className="text-4xl mb-4 text-cyan-600">�</div>
          <h3 className="text-xl font-bold text-cyan-700 mb-2">Ver Tareas</h3>
          <p className="text-cyan-600 text-sm">Listado completo</p>
        </div>

        {/* //? Tarjeta 2: Nuevo avance */}
        <div
          className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-cyan-200 hover:scale-[1.03] transition-transform cursor-pointer"
          onClick={() => navigate("/worker/progress")}
        >
          <div className="text-4xl mb-4 text-cyan-600">➕</div>
          <h3 className="text-xl font-bold text-cyan-700 mb-2">Nuevo Avance</h3>
          <p className="text-cyan-600 text-sm">Reportar avance</p>
        </div>

        {/* //? Tarjeta 3: Historial de avances */}
        <div
          className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-cyan-200 hover:scale-[1.03] transition-transform cursor-pointer"
          onClick={() => navigate("/worker/progress-history")}
        >
          <div className="text-4xl mb-4 text-cyan-600">�</div>
          <h3 className="text-xl font-bold text-cyan-700 mb-2">
            Historial de Avances
          </h3>
          <p className="text-cyan-600 text-sm">Ver avances previos</p>
        </div>

        {/* //? Tarjeta 4: Equipo */}
        <div
          className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-cyan-200 hover:scale-[1.03] transition-transform cursor-pointer"
          onClick={() => navigate("/worker/team")}
        >
          <div className="text-4xl mb-4 text-cyan-600">👥</div>
          <h3 className="text-xl font-bold text-cyan-700 mb-2">Equipo</h3>
          <p className="text-cyan-600 text-sm">Ver miembros</p>
        </div>

        {/* //? Tarjeta 5: Historial de tareas
        <div
          className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-cyan-200 hover:scale-[1.03] transition-transform cursor-pointer"
          onClick={() => navigate("x")}
        >
          <div className="text-4xl mb-4 text-cyan-600">🗂️</div>
          <h3 className="text-xl font-bold text-cyan-700 mb-2">Historial de avances</h3>
          <p className="text-cyan-600 text-sm">Tus avances</p>
        </div> */}
      </div>
    </div>
  );
};

export default WorkerDashboard;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * WorkerDashboard = panel de trabajador
 * navigate = navegar
 * useNavigate = usar navegar
 * counts = contadores
 * setCounts = establecer contadores
 * pending = pendiente
 * inProgress = en progreso
 * completed = completado
 * total = total
 * getFetchData = obtener datos del fetch
 * useFetch = usar fetch
 * isMounted = está montado
 * fetchCounts = obtener contadores
 * data = datos
 * err = error
 */
