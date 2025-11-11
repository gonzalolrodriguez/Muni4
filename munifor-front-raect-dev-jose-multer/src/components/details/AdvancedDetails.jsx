//* ========================================
//* COMPONENTE: AdvancedDetails
//* ========================================
//* Propósito: Panel lateral genérico para mostrar detalles avanzados de cualquier tipo de dato
//* Usado en: Mapas, páginas de gestión que necesiten mostrar información detallada
//* Props:
//*   - data: objeto - Cualquier tipo de dato (ProgressReport, Task, Report, etc.)
//*   - onClose: función - Cerrar el panel lateral
//* Lógica especial:
//*   - Detecta si es un ProgressReport por la presencia de campos (worker, crew, task, status)
//*   - Si es ProgressReport: muestra campos estructurados
//*   - Si no: muestra JSON formateado (fallback genérico)

const AdvancedDetails = ({ data, onClose }) => {
  //* ========================================
  //* DETECCIÓN: Verificar si es un ProgressReport
  //* ========================================
  //? Un ProgressReport tiene worker, crew, task o status
  const isProgressReport = !!(
    data &&
    (data.worker || data.crew || data.task || data.status)
  );

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
    <section
      className="absolute top-0 right-0 h-full max-w-md w-full bg-white shadow-2xl z-40 flex flex-col border-l border-gray-200"
      style={{ position: "absolute" }}
    >
      {/* //? Header con título y botón cerrar */}
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Detalles Avanzados</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          ✕
        </button>
      </div>

      {/* //? Contenido scrolleable */}
      <div className="p-6 flex-1 overflow-y-auto">
        {/* //! CASO 1: Es un ProgressReport */}
        {isProgressReport ? (
          <div className="space-y-3">
            <p>
              <span className="font-semibold">Título:</span> {data.title || "-"}
            </p>
            <p>
              <span className="font-semibold">Descripción:</span>{" "}
              {data.description || "-"}
            </p>
            {/* //? Trabajador: puede ser objeto con name o string */}
            <p>
              <span className="font-semibold">Trabajador:</span>{" "}
              {data.worker?.name || data.worker || "-"}
            </p>
            {/* //? Cuadrilla: puede ser objeto con name o string */}
            <p>
              <span className="font-semibold">Cuadrilla:</span>{" "}
              {data.crew?.name || data.crew || "-"}
            </p>
            {/* //? Tarea: puede ser objeto con title o string */}
            <p>
              <span className="font-semibold">Tarea:</span>{" "}
              {data.task?.title || data.task || "-"}
            </p>
            <p>
              <span className="font-semibold">Estado:</span>{" "}
              {data.status || "-"}
            </p>
            <p>
              <span className="font-semibold">Creado:</span>{" "}
              {formatDate(data.created_at)}
            </p>
            <p>
              <span className="font-semibold">Actualizado:</span>{" "}
              {formatDate(data.updated_at)}
            </p>
          </div>
        ) : (
          /* //? CASO 2: Fallback genérico - Mostrar JSON formateado */
          <pre className="whitespace-pre-wrap wrap-break-word">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </section>
  );
};

export default AdvancedDetails;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * AdvancedDetails = detalles avanzados
 * data = datos
 * onClose = al cerrar
 * isProgressReport = es reporte de progreso
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
