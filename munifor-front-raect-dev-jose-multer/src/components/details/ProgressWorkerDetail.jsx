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

import ReportLeafletMap from "../LeafletMaps/ReportLeafletMap";

const ProgressWorkerDetail = ({ progress, onClose }) => {
  // Función: Abrir Google Maps
  const handleGetDirections = () => {
    const { lat, lng } = progress.location || {};
    if (lat && lng) {
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, "_blank");
    }
  };
  // Helper para formatear fecha
  const formatDate = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleString();
    } catch (e) {
      return String(d);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header con título */}
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">
        {progress?.title || <span className="text-gray-400">Sin título</span>}
      </h2>
      {/* Descripción */}
      <p className="text-gray-600 mb-2 text-center">
        {progress?.description || (
          <span className="text-gray-400">Sin descripción</span>
        )}
      </p>

      {/* Mapa de Leaflet con ubicación del avance */}
      <div className="w-80 h-80 mb-2 rounded-lg overflow-hidden shadow mx-auto">
        {progress.location && progress.location.lat && progress.location.lng ? (
          <ReportLeafletMap location={progress.location} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
            Sin ubicación disponible
          </div>
        )}
      </div>
      {/* Coordenadas y botón "Cómo llegar" */}
      <div className="flex flex-row items-center justify-center gap-2 mb-4">
        <span className="font-semibold text-gray-700">Coordenadas:</span>
        <span className="text-blue-700 font-mono">
          {progress.location && progress.location.lat && progress.location.lng
            ? `${progress.location.lat}, ${progress.location.lng}`
            : "Sin coordenadas"}
        </span>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm font-medium ml-2"
          onClick={handleGetDirections}
          disabled={
            !(
              progress.location &&
              progress.location.lat &&
              progress.location.lng
            )
          }
        >
          Cómo llegar
        </button>
      </div>

      {/* Información del trabajador */}
      <div className="mb-2">
        <span className="font-semibold text-gray-700">Trabajador:</span>
        <span className="ml-2 text-gray-600">
          {progress?.worker?.username ||
            progress?.worker?.name ||
            progress?.worker ||
            "-"}
        </span>
      </div>
      {/* Información de la cuadrilla */}
      <div className="mb-2">
        <span className="font-semibold text-gray-700">Equipo:</span>
        <span className="ml-2 text-gray-600">
          {progress?.crew?.name || progress?.crew || "-"}
        </span>
      </div>
      {/* Información de la tarea */}
      <div className="mb-2">
        <span className="font-semibold text-gray-700">Tarea:</span>
        <span className="ml-2 text-gray-600">
          {progress?.task?.title || progress?.task || "-"}
        </span>
      </div>
      {/* Estado del progreso */}
      <div className="mb-2">
        <span className="font-semibold text-gray-700">Estado:</span>
        <span className="ml-2 text-gray-600">{progress?.status || "-"}</span>
      </div>
      {/* Fechas formateadas */}
      <div className="mb-2">
        <span className="font-semibold text-gray-700">Creado:</span>
        <span className="ml-2 text-gray-600">
          {formatDate(progress?.created_at)}
        </span>
      </div>
      <div className="mb-2">
        <span className="font-semibold text-gray-700">Actualizado:</span>
        <span className="ml-2 text-gray-600">
          {formatDate(progress?.updated_at)}
        </span>
      </div>

      {/* Imágenes del progreso */}
      {progress?.images && progress.images.length > 0 && (
        <div className="mb-2 mt-4">
          <span className="font-semibold text-gray-700">Imágenes:</span>
          <div className="flex gap-2 mt-2 flex-wrap">
            {progress.images.map((img, i) => (
              <img
                key={i}
                src={`http://localhost:3000/${img}`}
                alt="avance"
                className="h-20 w-20 object-cover rounded cursor-pointer hover:scale-105 transition"
                onClick={() =>
                  window.open(`http://localhost:3000/${img}`, "_blank")
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
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
