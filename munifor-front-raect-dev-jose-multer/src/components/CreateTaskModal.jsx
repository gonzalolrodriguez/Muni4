//* ========================================
//* COMPONENTE: CreateTaskModal
//* ========================================
//* Propósito: Modal para crear tarea asignando cuadrilla y reportes
//* Usado en: OperatorNewReports.jsx, OperatorCreateTask.jsx
//* Props:
//*   - onClose: función - Cerrar el modal
//*   - onSubmit: función - Enviar datos de la nueva tarea
//*   - crewSelected: string - ID de la cuadrilla seleccionada
//*   - reportSelected: array - IDs de reportes a asociar con la tarea
//* Campos del formulario:
//*   - title: string - Título de la tarea
//*   - taskType: enum - Tipo ("Reparación", "Mantenimiento", "Recolección", "Supervisión")
//*   - priority: enum - Prioridad ("Alta", "Media", "Baja")
//*   - location: objeto - Coordenadas {lat, lng} seleccionadas en mapa
//* Validación:
//*   - Todos los campos son obligatorios
//*   - Debe seleccionar ubicación en el mapa
//*   - Debe haber al menos 1 reporte seleccionado
//*   - Debe haber una cuadrilla seleccionada

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MapClickHandler from "./LeafletMaps/MapClick";
import "leaflet/dist/leaflet.css";

//* Constantes de opciones
const TASK_TYPES = [
  "Reparación",
  "Mantenimiento",
  "Recolección",
  "Supervisión",
];
const PRIORITIES = ["Alta", "Media", "Baja"];

const CreateTaskModal = ({
  onClose,
  onSubmit,
  crewSelected,
  reportSelected,
}) => {
  //* Estados locales del formulario
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState("");
  const [priority, setPriority] = useState("");
  const [markerPosition, setMarkerPosition] = useState(null); // [lat, lng]
  const [error, setError] = useState("");

  //* ========================================
  //* SUBMIT: Validar y enviar tarea
  //* ========================================
  const handleSubmit = (e) => {
    e.preventDefault();

    //! Validación: Todos los campos obligatorios
    if (
      !title ||
      !taskType ||
      !priority ||
      !crewSelected ||
      !reportSelected ||
      reportSelected.length === 0
    ) {
      setError(
        "Completa todos los campos y selecciona al menos un reporte y una cuadrilla."
      );
      return;
    }

    //! Validación: Debe marcar ubicación en el mapa
    if (!markerPosition) {
      setError("Por favor, marca la ubicación de la tarea en el mapa.");
      return;
    }

    //* Limpiar errores
    setError("");

    //* Construir payload
    const [lat, lng] = markerPosition;
    const payload = {
      title,
      crew: crewSelected,
      report: reportSelected,
      priority,
      task_type: taskType,
      location: { lat, lng },
    };

    //! Enviar y cerrar modal
    if (onSubmit) onSubmit(payload);
    onClose();
  };

  return (
    //* Backdrop: Click cierra el modal
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-4"
      onClick={onClose}
    >
      {/* //! Card principal con scroll vertical */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          className="w-full px-4 py-3 flex flex-col overflow-y-auto"
          onSubmit={handleSubmit}
        >
          <h1 className="text-xl font-bold text-gray-900 mb-3 text-center">
            Crear tarea
          </h1>

          {/* //! Mensaje de error */}
          {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}

          {/* //? ======================================== */}
          {/* //? CAMPO: Título */}
          {/* //? ======================================== */}
          <div className="mb-3 w-full">
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Título
            </label>
            <input
              type="text"
              id="title"
              className="border rounded w-full px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* //? ======================================== */}
          {/* //? CAMPO: Tipo de tarea */}
          {/* //? ======================================== */}
          <div className="mb-3 w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tipo de tarea
            </label>
            <select
              className="border rounded w-full px-3 py-2"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
            >
              <option value="">Seleccione</option>
              {TASK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* //? ======================================== */}
          {/* //? CAMPO: Prioridad */}
          {/* //? ======================================== */}
          <div className="mb-3 w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Prioridad
            </label>
            <select
              className="border rounded w-full px-3 py-2"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="">Seleccione</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* //? ======================================== */}
          {/* //! CAMPO: Ubicación (Mapa interactivo) */}
          {/* //? ======================================== */}
          <div className="mb-3 w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Ubicación de la tarea
            </label>
            {/* //! Mapa de Leaflet: Click en el mapa setea markerPosition */}
            <div className="w-full h-48 border rounded-lg overflow-hidden">
              <MapContainer
                center={[-26.1849, -58.1756]} // Centro: Formosa, Argentina
                zoom={15}
                scrollWheelZoom={true}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* //! MapClickHandler: Captura click y actualiza markerPosition */}
                <MapClickHandler onClickPosition={setMarkerPosition} />
                {/* //? Marker: Se muestra solo si hay posición seleccionada */}
                {markerPosition && (
                  <Marker position={markerPosition}>
                    <Popup>Ubicación de la tarea</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
            {/* //? Mostrar coordenadas seleccionadas */}
            {markerPosition && (
              <p className="text-sm text-gray-600 mt-2">
                Coordenadas: {markerPosition[0].toFixed(4)},{" "}
                {markerPosition[1].toFixed(4)}
              </p>
            )}
          </div>

          {/* //? ======================================== */}
          {/* //? BOTONES DE ACCIÓN */}
          {/* //? ======================================== */}
          <div className="flex justify-end w-full gap-2">
            <button
              type="button"
              className="border p-2 rounded hover:bg-gray-100"
              onClick={onClose}
            >
              Cancelar
            </button>
            {/* //! Botón de submit */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
            >
              Crear tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * CreateTaskModal = modal de crear tarea
 * onClose = al cerrar
 * onSubmit = al enviar
 * crewSelected = cuadrilla seleccionada
 * reportSelected = reporte(s) seleccionado(s)
 * title = título
 * taskType = tipo de tarea
 * priority = prioridad
 * markerPosition = posición del marcador
 * error = error
 * handleSubmit = manejar envío
 * payload = carga útil / datos a enviar
 * lat = latitud
 * lng = longitud
 * TASK_TYPES = tipos de tarea
 * PRIORITIES = prioridades
 */
