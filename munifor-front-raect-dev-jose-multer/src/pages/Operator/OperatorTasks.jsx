//! ========================================
//! OPERATOR TASKS - VISUALIZACIÓN Y GESTIÓN DE TAREAS
//! ========================================
//* Propósito: Página para visualizar todas las tareas asignadas a cuadrillas
//* Ruta: /operator/tasks
//* Layout: OperatorLayout (con OperatorNavBar)
//* Endpoint: GET /task/operator - Obtiene todas las tareas
//* Características:
//*   - Lista de tareas con título, prioridad y estado
//*   - Doble filtro: por estado (Pendiente, En Progreso, Finalizada) y por prioridad (Baja, Media, Alta)
//*   - Búsqueda por título de tarea
//*   - Modal de detalles con información completa de la tarea

import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import useFilter from "../../hooks/useFilter";
import TaskDetails from "../../components/details/TaskDetails";
import Pagination from "../../components/Pagination";

//? ========================================
//? COMPONENTE PRINCIPAL - OPERATORTASKS
//? ========================================
//* Descripción: Muestra lista de tareas con doble filtro y búsqueda
//* @returns {JSX.Element} - Lista de tareas con filtros y modal de detalles
//* Uso: Operadores visualizan estado y detalles de todas las tareas creadas
const OperatorTasks = () => {
  const { getFetchData } = useFetch();

  //? Estados para datos y selección
  const [tasks, setTasks] = useState([]); //* Lista completa de tareas
  const [selectedTask, setSelectedTask] = useState(null); //* Tarea seleccionada para mostrar en modal

  //? Estados para filtros y búsqueda
  const [statusFilter, setStatusFilter] = useState("Todos"); //* Filtro por estado
  const [priorityFilter, setPriorityFilter] = useState("Todos"); //* Filtro por prioridad
  const [search, setSearch] = useState(""); //* Búsqueda por título
  const [currentPage, setCurrentPage] = useState(1); //* Página actual
  const {
    filterTasksByStatus,
    filterTasksByPriority,
    filterBySearch,
    limitData,
  } = useFilter();

  //? ========================================
  //? EFFECT: CARGAR TAREAS
  //? ========================================
  //* Se ejecuta al montar y cuando se cierra el modal (para refrescar)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        //? Obtiene todas las tareas desde el endpoint del operador
        const data = await getFetchData("/task/operator");
        setTasks(data.tasks);
        console.log(data.tasks);
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
      }
    };
    fetchTasks();
  }, []); //* Se re-ejecuta cuando se cierra el modal

  //? ========================================
  //? EFFECT: RESETEAR PÁGINA AL CAMBIAR FILTROS
  //? ========================================
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, priorityFilter, search]);

  //? ========================================
  //? FILTROS: OPCIONES Y APLICACIÓN
  //? ========================================
  //* Opciones de filtro por estado
  const statusOptions = ["Todos", "Pendiente", "En Progreso", "Finalizada"];
  //* Opciones de filtro por prioridad
  const priorityOptions = ["Todos", "Baja", "Media", "Alta"];

  //* Aplicar filtros encadenados: estado → prioridad → búsqueda
  const filteredTasks = filterBySearch(
    filterTasksByPriority(
      filterTasksByStatus(tasks, statusFilter), //* Primero filtra por estado
      priorityFilter //* Luego filtra por prioridad
    ),
    search, //* Finalmente filtra por texto de búsqueda
    "title" //* Campo a buscar
  );

  //* Aplicar paginación (10 tareas por página)
  const { data: paginatedTasks, totalPages } = limitData(
    filteredTasks,
    15,
    currentPage
  );

  //? ========================================
  //? HANDLERS: ACCIONES DE TAREAS
  //? ========================================

  //* Abre el modal con los detalles de la tarea seleccionada
  //* @param {Object} task - Tarea a visualizar
  const handleSelectTask = (task) => {
    setSelectedTask(task);
  };

  //* Cierra el modal de detalles
  const closeModal = () => setSelectedTask(null);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#eaf4fe] to-[#d2e7fa]">
      {/* ========================================
          SECCIÓN: HEADER CON BÚSQUEDA
          ======================================== */}
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold text-cyan-700 mb-2 drop-shadow">
          Tareas
        </h2>
        {/* Input de búsqueda por título */}
        <input
          type="text"
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-2 border-cyan-300 rounded-lg px-4 py-3 w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white shadow-sm placeholder-cyan-600/60 text-cyan-700"
        />
      </div>

      {/* ========================================
          SECCIÓN: FILTROS POR ESTADO
          ======================================== */}
      <div className="max-w-5xl mx-auto px-4 pb-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">
          Filtrar por Estado:
        </h3>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((option) => (
            <button
              key={option}
              className={`px-6 py-2 rounded-full border-2 font-semibold transition-all duration-150 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-cyan-400
                ${
                  statusFilter === option
                    ? "bg-cyan-600 text-white border-cyan-600 scale-105 shadow-lg"
                    : "bg-white text-cyan-600 border-cyan-600 hover:bg-cyan-50"
                }`}
              onClick={() => setStatusFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================
          SECCIÓN: FILTROS POR PRIORIDAD
          ======================================== */}
      <div className="max-w-5xl mx-auto px-4 pb-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">
          Filtrar por Prioridad:
        </h3>
        <div className="flex gap-2 flex-wrap">
          {priorityOptions.map((option) => (
            <button
              key={option}
              className={`px-6 py-2 rounded-full border-2 font-semibold transition-all duration-150 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-cyan-400
                ${
                  priorityFilter === option
                    ? "bg-cyan-600 text-white border-cyan-600 scale-105 shadow-lg"
                    : "bg-white text-cyan-600 border-cyan-600 hover:bg-cyan-50"
                }`}
              onClick={() => setPriorityFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================
          SECCIÓN: PAGINACIÓN SUPERIOR
          ======================================== */}
      <div className="max-w-5xl mx-auto px-4 pb-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ========================================
          SECCIÓN: LISTA DE TAREAS
          ======================================== */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          //* Mensaje cuando no hay tareas
          <div className="flex flex-col items-center justify-center py-16">
            <h3 className="text-lg text-cyan-700 font-semibold">
              No hay tareas disponibles
            </h3>
          </div>
        ) : (
          //* Lista de tareas paginadas
          paginatedTasks.map((task, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg p-5 flex justify-between items-center border-2 border-cyan-300/20 w-full max-w-3xl mx-auto min-h-16 hover:cursor-pointer hover:shadow-xl transition-all duration-150"
              onClick={() => handleSelectTask(task)}
            >
              <div>
                <span className="block text-2xl font-bold text-cyan-700 mb-1">
                  {task.title}
                </span>
                <span className="block text-sm text-cyan-600/70">
                  Prioridad:{" "}
                  <span className="font-semibold text-cyan-700">
                    {task.priority}
                  </span>{" "}
                  | Estado:{" "}
                  <span className="font-semibold text-cyan-700">
                    {task.status}
                  </span>
                </span>
              </div>
              {/* Badge de prioridad con color según nivel */}
              <span
                className={`px-6 py-2 rounded-full text-base font-semibold shadow-sm border-2
                  ${
                    task.priority === "Alta"
                      ? "bg-[#fee2e2] text-[#dc2626] border-[#dc2626]/30"
                      : task.priority === "Media"
                      ? "bg-[#fef9c3] text-[#ca8a04] border-[#ca8a04]/30"
                      : task.priority === "Baja"
                      ? "bg-[#dbeafe] text-[#2563eb] border-[#2563eb]/30"
                      : "bg-gray-100 text-gray-500 border-gray-300"
                  }
                `}
              >
                {task.priority}
              </span>
            </div>
          ))
        )}

        {/* ========================================
            SECCIÓN: PAGINACIÓN INFERIOR
            ======================================== */}
        <div className="max-w-5xl mx-auto px-4 pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            scrollToTop={true}
          />
        </div>

        {/* ========================================
            MODAL: DETALLES DE LA TAREA
            ======================================== 
            * Muestra información completa de la tarea
            * Reportes asignados, cuadrilla, fechas, etc.
        */}

        {selectedTask && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl font-bold"
                onClick={closeModal}
                aria-label="Cerrar"
              >
                &times;
              </button>
              <TaskDetails task={selectedTask} onClose={closeModal} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatorTasks;

//! ========================================
//! TRADUCCIÓN DE CONSTANTES
//! ========================================
//* tasks - tareas
//* selectedTask - tarea seleccionada
//* statusFilter - filtro de estado
//* priorityFilter - filtro de prioridad
//* search - búsqueda
//* statusOptions - opciones de estado
//* priorityOptions - opciones de prioridad
//* filteredTasks - tareas filtradas
//* handleSelectTask - manejar selección de tarea
//* closePanel - cerrar panel
