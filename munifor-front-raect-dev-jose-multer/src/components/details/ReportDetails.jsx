//* ========================================
//* COMPONENTE: ReportDetails
//* ========================================
//* Propósito: Panel lateral (aside) con detalles de un reporte
//* Usado en: Operator/Admin páginas de reportes, mapas con reportes
//* Props:
//*   - report: objeto - Reporte completo con location, title, description, status, etc.
//*   - onClose: función - Cerrar el panel lateral
//*   - role: string - Rol del usuario actual ("Operador", "Administrador", etc.)
//*   - onAccept: función - Aceptar/convertir reporte (solo Operador/Admin)
//*   - onReject: función - Rechazar reporte (solo Operador/Admin)
//* Funcionalidad:
//*   - Muestra mapa de Leaflet con ubicación del reporte
//*   - Botón "Cómo llegar" abre Google Maps
//*   - Botones Aceptar/Rechazar solo para Operador y Administrador

import ReportLeafletMap from "../LeafletMaps/ReportLeafletMap";

const ReportDetails = ({ report, onClose, role, onAccept, onReject }) => {
  //* ========================================
  //* FUNCIÓN: Abrir Google Maps en nueva pestaña
  //* ========================================
  const handleGetDirections = () => {
    const { lat, lng } = report.location;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  //* Verificar si el usuario es Operador o Administrador
  const isOperatorOrAdmin = role === "Operador" || role === "Administrador";

  return (
    //* Panel lateral fijo a la derecha, ocupa toda la altura
    <section className="absolute top-0 right-0 h-full max-w-md w-full bg-white shadow-2xl z-40 flex flex-col border-l border-gray-200">
      {/* //? Header con título y botón cerrar */}
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Detalles del Reporte</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          ✕
        </button>
      </div>

      {/* //? Contenido scrolleable */}
      <div className="p-6 flex-1 overflow-y-auto">
        {/* //? ======================================== */}
        {/* //? SECCIÓN 1: Mapa y Ubicación */}
        {/* //? ======================================== */}
        <div className="w-full flex flex-col items-center">
          {/* //? Mapa de Leaflet con ubicación del reporte */}
          <div className="w-80 h-80 mb-2 rounded-lg overflow-hidden shadow">
            <ReportLeafletMap location={report.location} />
          </div>

          {/* //? Coordenadas y botón "Cómo llegar" */}
          <div className="flex flex-row items-center justify-center gap-2 mb-4">
            <span className="font-semibold text-gray-700">Coordenadas:</span>
            <span className="text-blue-700 font-mono">
              {report.location?.lat && report.location?.lng
                ? `${report.location.lat}, ${report.location.lng}`
                : "Sin coordenadas"}
            </span>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm font-medium ml-2"
              onClick={handleGetDirections}
              disabled={!(report.location?.lat && report.location?.lng)}
            >
              Cómo llegar
            </button>
          </div>
        </div>

        {/* //? ======================================== */}
        {/* //? SECCIÓN 2: Detalles del reporte */}
        {/* //? ======================================== */}
        <p>
          <span className="font-semibold">Título:</span> {report?.title}
        </p>
        <p>
          <span className="font-semibold">Descripción:</span>{" "}
          {report?.description}
        </p>
        <p>
          <span className="font-semibold">Estado:</span> {report?.status}
        </p>

        {/* //! ======================================== */}
        {/* //! BOTONES: Solo para Operador/Administrador */}
        {/* //! ======================================== */}
        {isOperatorOrAdmin && (
          <div className="flex gap-4 mt-6">
            {/* //! Aceptar: Convertir reporte en tarea */}
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              onClick={() => onAccept && onAccept(report._id)}
            >
              Aceptar
            </button>
            {/* //! Rechazar: Descartar reporte */}
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              onClick={() => onReject && onReject(report._id)}
            >
              Rechazar
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReportDetails;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * ReportDetails = detalles de reporte
 * report = reporte
 * onClose = al cerrar
 * role = rol
 * onAccept = al aceptar
 * onReject = al rechazar
 * handleGetDirections = manejar obtener direcciones
 * isOperatorOrAdmin = es operador o administrador
 * location = ubicación
 * lat = latitud
 * lng = longitud
 * url = dirección web
 * title = título
 * description = descripción
 * status = estado
 * _id = identificador
 */
