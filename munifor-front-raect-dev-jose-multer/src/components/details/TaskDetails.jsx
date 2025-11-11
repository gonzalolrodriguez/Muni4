//* ========================================
//* COMPONENTE: TaskDetails
//* ========================================
//* Propósito: Panel lateral (aside) con detalles de una tarea
//* Usado en: Operator/Admin páginas de tareas, mapas con tareas
//* Props:
//*   - task: objeto - Tarea completa con title, description, status, etc.
//*   - onClose: función - Cerrar el panel lateral
//* Diseño: Panel absoluto a la derecha con scroll vertical

const TaskDetails = ({ task, onClose }) => {
  return (
    //* Panel lateral fijo a la derecha, ocupa toda la altura
    <section
      className="absolute top-0 right-0 h-full max-w-md w-full bg-white shadow-2xl z-40 flex flex-col border-l border-gray-200"
      style={{ position: "absolute" }}
    >
      {/* //? Header con título y botón cerrar */}
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Detalles de la Tarea</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          ✕
        </button>
      </div>

      {/* //? Contenido scrolleable con detalles de la tarea */}
      <div className="p-6 flex-1 overflow-y-auto">
        <p>
          <span className="font-semibold">Título:</span> {task?.title}
        </p>
        <p>
          <span className="font-semibold">Descripción:</span>{" "}
          {task?.description}
        </p>
        <p>
          <span className="font-semibold">Estado:</span> {task?.status}
        </p>
        {/* //? Se pueden agregar más campos según necesidad */}
      </div>
    </section>
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
