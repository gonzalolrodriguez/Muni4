//* ========================================
//* PÁGINA: WorkerTasks
//* ========================================
//* Propósito: Lista de tareas asignadas al equipo del trabajador
//* Ruta: /worker/tasks
//* Layout: WorkerLayout
//* Características:
//*   - Columna izquierda: Tarea actual + Tareas futuras
//*   - Columna derecha: Detalles de la tarea seleccionada
//*   - Endpoint: /task/worker (tareas del equipo del trabajador)
//*   - Solo el líder puede aceptar tareas (botón visible)
//*   - Tarea "En Progreso" se muestra como tarea actual
//*   - Click en tarea: muestra detalles en panel derecho

import { useContext, useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { UserContext } from "../../context/UserContext";

const WorkerTasks = () => {
  //* ========================================
  //* CONTEXTO Y ESTADO
  //* ========================================
  const { getFetchData, putFetch } = useFetch();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [leaderCrew, setLeaderCrew] = useState(null);
  const { user } = useContext(UserContext);

  //* ========================================
  //* FUNCIÓN: Refetch tareas (reutilizable)
  //* ========================================
  const fetchTasks = async () => {
    try {
      //! Endpoint que trae las tareas del equipo del trabajador
      const data = await getFetchData("/task/worker");
      setTasks(data.tasks);
      setLeaderCrew(data.crew.leader);
    } catch {
      setTasks([]);
    }
  };

  //* ========================================
  //* EFECTO: Cargar tareas al montar
  //* ========================================
  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      try {
        const data = await getFetchData("/task/worker");
        if (isMounted) {
          setTasks(data.tasks);
          setLeaderCrew(data.crew.leader);
        }
      } catch {
        if (isMounted) {
          setTasks([]);
        }
      }
    };

    loadTasks();

    return () => {
      isMounted = false;
    };
  }, [getFetchData]);

  console.log(leaderCrew);

  //* ========================================
  //* HANDLER: Aceptar tarea (solo líder)
  //* ========================================
  const handleAcceptTask = async (id) => {
    console.log("Tarea aceptada:", id);
    //! Endpoint para asignar tarea al equipo (cambiar status a "En Progreso")
    await putFetch("/task/assign", id);
    //? Volver a pedir los datos para refrescar la vista
    fetchTasks();
    setSelectedTask(null);
  };

  //* ========================================
  //* SEPARAR TAREAS
  //* ========================================
  //! Tarea actual: la que está "En Progreso"
  const currentTask = tasks.find((t) => t.status === "En Progreso") || null;
  //? Tareas futuras: todas las demás (excepto la actual)
  const futureTasks = tasks.filter((t) => t._id !== currentTask?._id);

  //* ========================================
  //* RENDER
  //* ========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 max-w-5xl mx-auto w-full py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* //? ======================================== */}
      {/* //? COLUMNA IZQUIERDA: LISTA DE TAREAS */}
      {/* //? ======================================== */}
      <div className="flex flex-col gap-6">
        {/* //? Sección 1: Tarea actual */}
        <h2 className="text-2xl font-bold text-cyan-700 mb-4 tracking-tight drop-shadow">Tarea actual</h2>
        {!currentTask ? (
          <div className="flex flex-1 items-center justify-center py-8 min-h-[120px]">
            <span className="text-gray-400 text-center">No tienes tarea actual asignada</span>
          </div>
        ) : (
          <div
            className={`bg-white rounded-xl shadow-md p-6 border w-full hover:cursor-pointer transition-all duration-200
              ${selectedTask?._id === currentTask._id
                ? "border-cyan-400 ring-2 ring-cyan-300"
                : "border-gray-200 hover:border-cyan-300 hover:shadow-lg"}
            `}
            onClick={() => setSelectedTask(currentTask)}
          >
            <h3 className="text-lg font-semibold text-cyan-700 mb-2">{currentTask.title}</h3>
            <span className="px-5 py-2 rounded-full text-base font-medium bg-cyan-100 text-cyan-700 drop-shadow">{currentTask.status ? currentTask.status : "Sin estado"}</span>
          </div>
        )}

        {/* //? Sección 2: Tareas futuras */}
        <h2 className="text-2xl font-bold text-cyan-700 mb-4 tracking-tight drop-shadow">Tareas futuras</h2>
        {futureTasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-8 min-h-[120px]">
            <span className="text-gray-400 text-center">No tienes tareas futuras asignadas</span>
          </div>
        ) : (
          futureTasks.map((task, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-xl shadow-md p-3 flex justify-between items-center border w-full mb-3 min-h-14 hover:cursor-pointer transition-all duration-200
                ${selectedTask?._id === task._id ? "border-cyan-400 ring-2 ring-cyan-300" : "border-gray-200 hover:border-cyan-300 hover:shadow-lg"}
              `}
              onClick={() => setSelectedTask(task)}
            >
              <span className="block text-base font-semibold text-cyan-700">{task.title}</span>
              <span className="px-5 py-2 rounded-full text-base font-medium bg-cyan-100 text-cyan-700 drop-shadow">{task.status ? task.status : "Sin estado"}</span>
            </div>
          ))
        )}
      </div>

      {/* //? ======================================== */}
      {/* //? COLUMNA DERECHA: DETALLES DE LA TAREA */}
      {/* //? ======================================== */}
      <div className="flex flex-col h-full">
        <h2 className="text-2xl font-bold text-cyan-700 mb-4 tracking-tight drop-shadow">Detalle de la tarea</h2>
        {!selectedTask ? (
          <div className="flex flex-1 items-center justify-center py-8 min-h-[120px]">
            <span className="text-gray-400 text-center">Selecciona una tarea para ver detalles</span>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 border border-cyan-200 w-full">
            <h3 className="text-lg font-semibold text-cyan-700 mb-2">{selectedTask.title}</h3>
            <p className="text-gray-600 mb-2">{selectedTask.description}</p>

            {/* //? Estado de la tarea */}
            <div className="mb-2">
              <span className="font-semibold text-cyan-700">Estado:</span>
              <span
                className={`ml-2 px-3 py-1 rounded-full text-white text-xs font-bold drop-shadow
                  ${selectedTask.status === "Finalizada"
                    ? "bg-green-500"
                    : selectedTask.status === "En Progreso"
                      ? "bg-cyan-500"
                      : "bg-red-500"}
                `}
              >
                {selectedTask.status}
              </span>
            </div>

            {/* //? Prioridad de la tarea */}
            <div className="mb-2">
              <span className="font-semibold text-cyan-700">Prioridad:</span>
              <span className="ml-2 text-gray-600">{selectedTask.priority}</span>
            </div>

            {/* //? ID de la tarea */}
            <div className="mb-2">
              <span className="font-semibold text-cyan-700">ID:</span>
              <span className="ml-2 text-cyan-700 font-mono">{selectedTask._id}</span>
            </div>

            {/* //! Botón "Aceptar tarea" (solo visible para el líder y si no hay tarea actual) */}
            {leaderCrew?.toString() === user._id?.toString() && !currentTask ? (
              <div className="mb-2">
                <button
                  className="mt-4 bg-cyan-600 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-700 transition"
                  onClick={() => handleAcceptTask(selectedTask._id)}
                >
                  aceptar tarea
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerTasks;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * WorkerTasks = tareas de trabajador
 * getFetchData = obtener datos del fetch
 * putFetch = PUT fetch
 * useFetch = usar fetch
 * tasks = tareas
 * setTasks = establecer tareas
 * selectedTask = tarea seleccionada
 * setSelectedTask = establecer tarea seleccionada
 * leaderCrew = líder del equipo
 * setLeaderCrew = establecer líder del equipo
 * user = usuario
 * UserContext = contexto de usuario
 * fetchTasks = obtener tareas
 * data = datos
 * crew = equipo
 * leader = líder
 * error = error
 * isMounted = está montado
 * loadTasks = cargar tareas
 * handleAcceptTask = manejar aceptar tarea
 * id = identificador
 * currentTask = tarea actual
 * futureTasks = tareas futuras
 * t = tarea (abreviatura)
 * status = estado
 * _id = identificador
 * task = tarea
 * idx = índice
 * title = título
 * description = descripción
 * priority = prioridad
 * toString = a cadena
 */
