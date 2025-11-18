//* ========================================
//* COMPONENTE: TaskDetails
//* ========================================
//* Propósito: Panel lateral (aside) con detalles de una tarea
//* Usado en: Operator/Admin páginas de tareas, mapas con tareas
//* Props:
//*   - task: objeto - Tarea completa con title, description, status, etc.
//*   - onClose: función - Cerrar el panel lateral
//* Diseño: Panel absoluto a la derecha con scroll vertical

import ReportLeafletMap from "../LeafletMaps/ReportLeafletMap";

const TaskDetails = ({ task, onClose }) => {
  // Función: Abrir Google Maps
  const handleGetDirections = () => {
    const { lat, lng } = task.location || {};
    if (lat && lng) {
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, "_blank");
    }
  };
  return (
    //* Contenedor para modal centrado
    <div className="flex flex-col">
      {/* //? Header con título */}
      <h2 className="text-2xl font-bold mb-4 text-center">
        Detalles de la Tarea
      </h2>

      {/* //? Contenido con detalles de la tarea */}
      <div className="flex flex-col items-center gap-4">
        {/* Mapa de Leaflet con ubicación de la tarea */}
        <div className="w-80 h-80 mb-2 rounded-lg overflow-hidden shadow">
          {task.location && task.location.lat && task.location.lng ? (
            <ReportLeafletMap location={task.location} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
              Sin ubicación disponible
            </div>
          )}
        </div>
        {/* Coordenadas y botón "Cómo llegar" */}
        <div className="flex flex-row items-center justify-center gap-2 mb-2">
          <span className="font-semibold text-gray-700">Coordenadas:</span>
          <span className="text-blue-700 font-mono">
            {task.location && task.location.lat && task.location.lng
              ? `${task.location.lat}, ${task.location.lng}`
              : "Sin coordenadas"}
          </span>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm font-medium ml-2"
            onClick={handleGetDirections}
            disabled={
              !(task.location && task.location.lat && task.location.lng)
            }
          >
            Cómo llegar
          </button>
        </div>

        <p>
          <span className="font-semibold">Título:</span>{" "}
          {task?.title || <span className="text-gray-400">Sin título</span>}
        </p>
        <p>
          <span className="font-semibold">Tipo:</span>{" "}
          {task?.task_type || <span className="text-gray-400">Sin tipo</span>}
        </p>
        <p>
          <span className="font-semibold">Prioridad:</span>{" "}
          {task?.priority || (
            <span className="text-gray-400">Sin prioridad</span>
          )}
        </p>
        <p>
          <span className="font-semibold">Estado:</span>{" "}
          {task?.status || <span className="text-gray-400">Sin estado</span>}
        </p>
        {task?.crew && (
          <p>
            <span className="font-semibold">Cuadrilla:</span>{" "}
            {task.crew?.name || task.crew}
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * TaskDetails = detalles de tarea
 * task = tarea
 * onClose = al cerrar
 * title = título
 * description = descripción
 * status = estado
 */
