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
  }, [getFetchData]);

  //* ========================================
  //* RENDER
  //* ========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">Accesos Rápidos</h1>
      </div>

      {/* //? ======================================== */}
      {/* //? TARJETAS DE ACCESO RÁPIDO (5) */}
      {/* //? ======================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* //? Tarjeta 1: Ver tareas */}
        <div
          className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:cursor-pointer"
          onClick={() => navigate("/worker/tasks")}
        >
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">Ver Tareas</h3>
          <p className="text-gray-600 text-sm">Listado completo</p>
        </div>

        {/* //? Tarjeta 2: Nuevo avance */}
        <div
          className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:cursor-pointer"
          onClick={() => navigate("/worker/create-progress")}
        >
          <div className="text-4xl mb-4">➕</div>
          <h3 className="text-xl font-semibold mb-2">Nuevo Avance</h3>
          <p className="text-gray-600 text-sm">Reportar avance</p>
        </div>

        {/* //? Tarjeta 3: Historial de avances */}
        <div
          className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:cursor-pointer"
          onClick={() => navigate("/worker/progress-history")}
        >
          <div className="text-4xl mb-4">📈</div>
          <h3 className="text-xl font-semibold mb-2">Historial de Avances</h3>
          <p className="text-gray-600 text-sm">Ver avances previos</p>
        </div>

        {/* //? Tarjeta 4: Equipo */}
        <div
          className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:cursor-pointer"
          onClick={() => navigate("/worker/team")}
        >
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-xl font-semibold mb-2">Equipo</h3>
          <p className="text-gray-600 text-sm">Ver miembros</p>
        </div>

        {/* //? Tarjeta 5: Historial de tareas */}
        <div
          className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:cursor-pointer"
          onClick={() => navigate("/worker/history")}
        >
          <div className="text-4xl mb-4">🗂️</div>
          <h3 className="text-xl font-semibold mb-2">Historial</h3>
          <p className="text-gray-600 text-sm">Tareas completadas</p>
        </div>
      </div>

      {/* //? ======================================== */}
      {/* //? SECCIÓN DE ESTADÍSTICAS */}
      {/* //? ======================================== */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Tareas</h1>
        <p className="text-gray-600">
          Gestiona y completa las tareas asignadas
        </p>
      </div>

      {/* //? Tarjetas de estadísticas de tareas (4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* //? Estadística 1: Pendiente */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="text-4xl mb-4">⏱️</div>
          <p className="text-4xl font-bold mb-2">{counts.pending}</p>
          <h3 className="text-lg font-semibold">Pendiente</h3>
        </div>

        {/* //? Estadística 2: En progreso */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-4xl font-bold mb-2">{counts.inProgress}</p>
          <h3 className="text-lg font-semibold">En Progreso</h3>
        </div>

        {/* //? Estadística 3: Finalizada */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="text-4xl mb-4">✅</div>
          <p className="text-4xl font-bold mb-2">{counts.completed}</p>
          <h3 className="text-lg font-semibold">Finalizada</h3>
        </div>

        {/* //? Estadística 4: Total */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-4xl font-bold mb-2">{counts.total}</p>
          <h3 className="text-lg font-semibold">Total</h3>
        </div>
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
