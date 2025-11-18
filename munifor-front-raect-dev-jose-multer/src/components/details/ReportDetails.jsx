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
  // Función: Abrir Google Maps
  const handleGetDirections = () => {
    const { lat, lng } = report.location || {};
    if (lat && lng) {
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, "_blank");
    }
  };

  const isOperatorOrAdmin = role === "Operador" || role === "Administrador";

  return (
    <div className="flex flex-col">
      {/* Header con título */}
      <h2 className="text-2xl font-bold mb-4 text-center">
        Detalles del Reporte
      </h2>
      {/* Contenido scrolleable */}
      <div className="flex flex-col items-center gap-4">
        {/* Mapa de Leaflet con ubicación del reporte */}
        <div className="w-80 h-80 mb-2 rounded-lg overflow-hidden shadow">
          {report.location && report.location.lat && report.location.lng ? (
            <ReportLeafletMap location={report.location} />
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
            {report.location && report.location.lat && report.location.lng
              ? `${report.location.lat}, ${report.location.lng}`
              : "Sin coordenadas"}
          </span>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm font-medium ml-2"
            onClick={handleGetDirections}
            disabled={
              !(report.location && report.location.lat && report.location.lng)
            }
          >
            Cómo llegar
          </button>
        </div>
        {/* Detalles del reporte */}
        <p>
          <span className="font-semibold">Título:</span>{" "}
          {report?.title || <span className="text-gray-400">Sin título</span>}
        </p>
        <p>
          <span className="font-semibold">Descripción:</span>{" "}
          {report?.description || (
            <span className="text-gray-400">Sin descripción</span>
          )}
        </p>
        <p>
          <span className="font-semibold">Estado:</span>{" "}
          {report?.status || <span className="text-gray-400">Sin estado</span>}
        </p>

        {/* Imágenes del reporte */}
        {report?.images && report.images.length > 0 && (
          <div className="w-full mt-4">
            <p className="font-semibold mb-2">Imágenes adjuntas:</p>
            <div className="grid grid-cols-2 gap-2">
              {report.images.map((img, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:3000/${img}`}
                  alt={`Imagen ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg shadow cursor-pointer hover:opacity-90 transition"
                  onClick={() =>
                    window.open(`http://localhost:3000/${img}`, "_blank")
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        {isOperatorOrAdmin && (
          <div className="flex gap-4 mt-4">
            {/* Mostrar botón Aceptar solo si el reporte NO está Aceptado ni Completado */}
            {report?.status !== "Aceptado" &&
              report?.status !== "Completado" && (
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  onClick={() => onAccept && onAccept(report._id)}
                >
                  Aceptar
                </button>
              )}

            {/* Mostrar botón Rechazar solo si el reporte está Pendiente o Revisado */}
            {(report?.status === "Pendiente" ||
              report?.status === "Revisado") && (
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={() => onReject && onReject(report._id)}
              >
                Rechazar
              </button>
            )}

            {/* Mostrar botón Cerrar si el reporte está Rechazado */}
            {report?.status === "Rechazado" && (
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                onClick={onClose}
              >
                Cerrar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
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
