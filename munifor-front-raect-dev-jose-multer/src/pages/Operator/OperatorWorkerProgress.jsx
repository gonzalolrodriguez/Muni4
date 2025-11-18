//! ========================================
//! OPERATOR WORKER PROGRESS - AVANCES DE TRABAJADORES
//! ========================================
//* Propósito: Página para visualizar todos los avances/progresos reportados por trabajadores
//* Ruta: /operator/worker-progress
//* Layout: OperatorLayout (con OperatorNavBar)
//* Endpoint: GET /progress-report - Obtiene todos los reportes de progreso
//* Características:
//*   - Lista de avances con título, trabajador, cuadrilla y estado
//*   - Filtros por estado (Todos, Pendiente, En Progreso, Finalizado)
//*   - Búsqueda por título de avance
//*   - Modal de detalles con descripción, imágenes, información completa

import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import useFilter from "../../hooks/useFilter";
import ProgressWorkerDetail from "../../components/details/ProgressWorkerDetail";

//? ========================================
//? COMPONENTE PRINCIPAL - OPERATORWORKERPROGRESS
//? ========================================
//* Descripción: Muestra lista de avances con filtros y detalles
//* @returns {JSX.Element} - Lista de avances con modal de detalles
//* Uso: Operadores monitorean el progreso de tareas por parte de trabajadores
const OperatorWorkerProgress = () => {
  const { getFetchData } = useFetch();

  //? Estados para datos y selección
  const [progressReports, setProgressReports] = useState([]); //* Lista de reportes de progreso
  const [selectedProgress, setSelectedProgress] = useState(null); //* Progreso seleccionado para mostrar en modal

  //? Estados para filtros y búsqueda
  const [search, setSearch] = useState(""); //* Búsqueda por título
  const [statusFilter, setStatusFilter] = useState("Todos"); //* Filtro por estado

  const { filterBySearch, filterProgressByStatus } = useFilter();

  //? ========================================
  //? EFFECT: CARGAR REPORTES DE PROGRESO
  //? ========================================
  //* Se ejecuta al montar el componente
  useEffect(() => {
    const fetchProgressReports = async () => {
      try {
        //? Obtiene todos los reportes de progreso
        const data = await getFetchData("/progress-report");
        console.log(data);
        setProgressReports(data.progress_reports || []);
      } catch (error) {
        setProgressReports([]); //* Si hay error, muestra lista vacía
      }
    };
    fetchProgressReports();
  }, []); //* Solo al montar

  //? ========================================
  //? HANDLERS: ACCIONES DE PROGRESO
  //? ========================================

  //* Cierra el modal de detalles
  const closeModal = () => setSelectedProgress(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ========================================
          SECCIÓN: HEADER CON BÚSQUEDA Y FILTROS
          ======================================== */}
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-700">
            Avances de Trabajadores
          </h2>
        </div>

        {/* Input de búsqueda por título */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 w-full max-w-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Filtros por estado */}
        <div className="flex gap-2">
          {["Todos", "Pendiente", "En Progreso", "Finalizado"].map((opt) => (
            <button
              key={opt}
              className={`px-3 py-1 rounded border font-medium transition-colors duration-150 ${
                statusFilter === opt
                  ? "bg-blue-600 text-white" //* Estilo del filtro activo
                  : "bg-white text-blue-600 border-blue-600" //* Estilo del filtro inactivo
              }`}
              onClick={() => setStatusFilter(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================
          SECCIÓN: LISTA DE AVANCES
          ======================================== */}
      <div className="space-y-4">
        {/** Aplicar filtros por estado y búsqueda encadenados */}
        {filterBySearch(
          filterProgressByStatus(progressReports, statusFilter),
          search,
          "title"
        ).length === 0 ? (
          //* Mensaje cuando no hay avances
          <div className="flex flex-col items-center justify-center py-16">
            <h3>No hay avances registrados</h3>
          </div>
        ) : (
          //* Lista de avances filtrados
          filterBySearch(
            filterProgressByStatus(progressReports, statusFilter),
            search,
            "title"
          ).map((progress, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-3 flex justify-between items-center border border-gray-200 w-full max-w-2xl mx-auto min-h-14 hover:cursor-pointer"
              onClick={() => setSelectedProgress(progress)}
            >
              <div>
                <span className="block text-xl font-semibold text-gray-800">
                  {progress.title}
                </span>
                <span className="block text-sm text-gray-500">
                  Trabajador: {progress.worker?.username || progress.worker}
                </span>
                <span className="block text-sm text-gray-500">
                  Equipo: {progress.crew?.name || progress.crew}
                </span>
              </div>
              {/* Badge de estado con color según el estado */}
              <span
                className={`px-5 py-2 rounded-full text-base font-medium ${
                  progress.status === "Finalizado"
                    ? "bg-green-100 text-green-700"
                    : progress.status === "En Progreso"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {progress.status}
              </span>
            </div>
          ))
        )}

        {/* ========================================
            MODAL: DETALLES DEL AVANCE
            ======================================== 
            * Muestra título, descripción, trabajador, cuadrilla, estado
            * Muestra imágenes del progreso si existen
        */}
        {selectedProgress && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <ProgressWorkerDetail
                progress={selectedProgress}
                onClose={closeModal}
              />
              {/* Botón cerrar */}
              <button
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 w-full"
                onClick={closeModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatorWorkerProgress;

//! ========================================
//! TRADUCCIÓN DE CONSTANTES
//! ========================================
//* progressReports - reportes de progreso
//* selectedProgress - progreso seleccionado
//* search - búsqueda
//* statusFilter - filtro de estado
//* closeModal - cerrar modal
//* worker - trabajador
//* crew - cuadrilla
//* images - imágenes
