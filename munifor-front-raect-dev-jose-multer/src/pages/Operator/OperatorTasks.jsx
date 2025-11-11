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
  const { filterTasksByStatus, filterTasksByPriority, filterBySearch } =
    useFilter();

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
  }, [selectedTask]); //* Se re-ejecuta cuando se cierra el modal

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

  //? ========================================
  //? HANDLERS: ACCIONES DE TAREAS
  //? ========================================

  //* Abre el modal con los detalles de la tarea seleccionada
  //* @param {Object} task - Tarea a visualizar
  const handleSelectTask = (task) => {
    setSelectedTask(task);
  };

  //* Cierra el modal de detalles
  const closePanel = () => setSelectedTask(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ========================================
          SECCIÓN: HEADER CON BÚSQUEDA
          ======================================== */}
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-2">
        <h2 className="text-xl font-bold text-gray-700">Tareas</h2>
        {/* Input de búsqueda por título */}
        <input
          type="text"
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-md focus:outline-none focus:ring focus:border-blue-300"
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
              className={`px-4 py-2 rounded border font-medium transition-colors duration-150
              ${
                statusFilter === option
                  ? "bg-blue-600 text-white" //* Estilo del filtro activo
                  : "bg-white text-blue-600 border-blue-600" //* Estilo del filtro inactivo
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
              className={`px-4 py-2 rounded border font-medium transition-colors duration-150
              ${
                priorityFilter === option
                  ? "bg-green-600 text-white" //* Estilo del filtro activo
                  : "bg-white text-green-600 border-green-600" //* Estilo del filtro inactivo
              }`}
              onClick={() => setPriorityFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================
          SECCIÓN: LISTA DE TAREAS
          ======================================== */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          //* Mensaje cuando no hay tareas
          <div className="flex flex-col items-center justify-center py-16">
            <h3>No hay tareas disponibles</h3>
          </div>
        ) : (
          //* Lista de tareas filtradas
          filteredTasks.map((task, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-3 flex justify-between items-center border border-gray-200 w-full max-w-2xl mx-auto min-h-14 hover:cursor-pointer"
              onClick={() => handleSelectTask(task)}
            >
              <div>
                <span className="block text-xl font-semibold text-gray-800">
                  {task.title}
                </span>
                <span className="block text-sm text-gray-500">
                  Prioridad: {task.priority} | Estado: {task.status}
                </span>
              </div>
              {/* Badge de prioridad con color según nivel */}
              <span
                className={`px-5 py-2 rounded-full text-base font-medium 
                  ${
                    task.priority === "Alta"
                      ? "bg-red-100 text-red-700"
                      : task.priority === "Media"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }
                `}
              >
                {task.priority}
              </span>
            </div>
          ))
        )}

        {/* ========================================
            MODAL: DETALLES DE LA TAREA
            ======================================== 
            * Muestra información completa de la tarea
            * Reportes asignados, cuadrilla, fechas, etc.
        */}
        {selectedTask && (
          <TaskDetails task={selectedTask} onClose={closePanel} />
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
