//* ========================================
//* COMPONENTE: ReportModal
//* ========================================
//* Propósito: Modal para ver detalles de reporte y convertirlo en tarea
//* Usado en: OperatorNewReports.jsx (gestión de reportes sin asignar)
//* Props:
//*   - report: objeto - Reporte completo con location, title, description, status, etc.
//*   - closeModal: función - Cerrar el modal
//*   - onReject: función - Rechazar el reporte (no crear tarea)
//*   - onAccept: función - Convertir reporte en tarea
//* Funcionalidad:
//*   - Muestra mapa con ubicación del reporte
//*   - Botón "Cómo llegar" abre Google Maps en nueva pestaña
//*   - Muestra autor (solo para admin/operator)
//*   - Botones de acción: Convertir en tarea, Rechazar, Cerrar

import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import ReportLeafletMap from "./LeafletMaps/ReportLeafletMap";

const ReportModal = ({ report, closeModal, onReject, onAccept }) => {
  const { user } = useContext(UserContext);

  //* ========================================
  //* FUNCIÓN: Abrir Google Maps en nueva pestaña
  //* ========================================
  const handleGetDirections = () => {
    const { lat, lng } = report.location;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    //* Backdrop: Click cierra el modal
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
      onClick={closeModal}
    >
      {/* //! Card principal: stopPropagation previene cierre al hacer click adentro */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col items-center justify-center p-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* //? ======================================== */}
        {/* //? SECCIÓN 1: Mapa y Coordenadas */}
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
        <div className="w-full px-8 py-6 flex flex-col items-center">
          {/* //! Autor: Solo visible para admin y operator */}
          {(user?.role === "admin" || user?.role === "operator") && (
            <div className="mb-2 w-full text-left">
              <span className="font-semibold text-gray-700">Autor:</span>
              <span className="ml-2 text-gray-600">{report.author}</span>
            </div>
          )}

          {/* //? Título y descripción */}
          <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">
            {report.title}
          </h2>
          <p className="text-gray-600 text-sm mb-3 text-center">
            {report.description}
          </p>

          {/* //? Tipo de reporte */}
          <div className="flex flex-row justify-center gap-6 w-full mb-2">
            <div>
              <span className="font-semibold text-gray-700">Tipo:</span>
              <span className="ml-2 text-gray-600">{report.report_type}</span>
            </div>
          </div>

          {/* //? Estado e ID del reporte */}
          <div className="flex flex-row justify-center gap-6 w-full mb-4">
            <div>
              <span className="font-semibold text-gray-700">Estado:</span>
              {/* //! Badge con color según estado */}
              <span
                className={`ml-2 px-3 py-1 rounded-full text-white text-xs font-bold ${
                  report.status === "Resuelto"
                    ? "bg-green-500"
                    : report.status === "En proceso"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                {report.status}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">ID:</span>
              <span className="ml-2 text-gray-700 font-mono">{report._id}</span>
            </div>
          </div>

          {/* //? ======================================== */}
          {/* //! BOTONES DE ACCIÓN */}
          {/* //? ======================================== */}
          <div>
            {/* //! Convertir reporte en tarea */}
            <button
              className="border p-1 m-1 hover:cursor-pointer"
              onClick={() => onAccept(report._id)}
            >
              Convertir en tarea
            </button>
            {/* //! Rechazar reporte */}
            <button
              className="border p-1 m-1 hover:cursor-pointer"
              onClick={() => onReject(report._id)}
            >
              Rechazar
            </button>
            {/* //? Cerrar modal */}
            <button
              className="border p-1 m-1 hover:cursor-pointer"
              onClick={closeModal}
            >
              cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * ReportModal = modal de reporte
 * report = reporte
 * closeModal = cerrar modal
 * onReject = al rechazar
 * onAccept = al aceptar
 * handleGetDirections = manejar obtener direcciones
 * user = usuario
 * location = ubicación
 * lat = latitud
 * lng = longitud
 * url = dirección web
 * author = autor
 * title = título
 * description = descripción
 * report_type = tipo de reporte
 * status = estado
 * _id = identificador
 */
