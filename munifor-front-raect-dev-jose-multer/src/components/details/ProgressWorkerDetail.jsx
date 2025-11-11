//* ========================================
//* COMPONENTE: ProgressWorkerDetail
//* ========================================
//* Propósito: Panel lateral (aside) con detalles de un avance de trabajo
//* Usado en: Operator/Admin páginas de avances, mapas con avances
//* Props:
//*   - progress: objeto - Avance completo con title, description, worker, crew, task, status, etc.
//*   - onClose: función - Cerrar el panel lateral
//* Diseño: Panel absoluto a la derecha con scroll vertical
//* Muestra: worker, crew, task, estado, fechas de creación y actualización

const ProgressWorkerDetail = ({ progress, onClose }) => {
  //* ========================================
  //* HELPER: Formatear fecha a locale string
  //* ========================================
  const formatDate = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleString();
    } catch (e) {
      return String(d);
    }
  };

  return (
    //* Panel lateral fijo a la derecha, ocupa toda la altura
    <section className="absolute top-0 right-0 h-full max-w-md w-full bg-white shadow-2xl z-40 flex flex-col border-l border-gray-200">
      {/* //? Header con título y botón cerrar */}
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Detalles del Avance</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          ✕
        </button>
      </div>

      {/* //? Contenido scrolleable con detalles del avance */}
      <div className="p-6 flex-1 overflow-y-auto">
        <p>
          <span className="font-semibold">Título:</span>{" "}
          {progress?.title || "-"}
        </p>
        <p>
          <span className="font-semibold">Descripción:</span>{" "}
          {progress?.description || "-"}
        </p>
        {/* //? Trabajador: puede ser objeto con name o string */}
        <p>
          <span className="font-semibold">Trabajador:</span>{" "}
          {progress?.worker?.name || progress?.worker || "-"}
        </p>
        {/* //? Cuadrilla: puede ser objeto con name o string */}
        <p>
          <span className="font-semibold">Cuadrilla:</span>{" "}
          {progress?.crew?.name || progress?.crew || "-"}
        </p>
        {/* //? Tarea: puede ser objeto con title o string */}
        <p>
          <span className="font-semibold">Tarea:</span>{" "}
          {progress?.task?.title || progress?.task || "-"}
        </p>
        <p>
          <span className="font-semibold">Estado:</span>{" "}
          {progress?.status || "-"}
        </p>
        {/* //? Fechas formateadas */}
        <p>
          <span className="font-semibold">Creado:</span>{" "}
          {formatDate(progress?.created_at)}
        </p>
        <p>
          <span className="font-semibold">Actualizado:</span>{" "}
          {formatDate(progress?.updated_at)}
        </p>
      </div>
    </section>
  );
};

export default ProgressWorkerDetail;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * ProgressWorkerDetail = detalle de avance de trabajador
 * progress = avance / progreso
 * onClose = al cerrar
 * formatDate = formatear fecha
 * title = título
 * description = descripción
 * worker = trabajador
 * crew = cuadrilla / equipo
 * task = tarea
 * status = estado
 * created_at = creado en
 * updated_at = actualizado en
 * name = nombre
 */
