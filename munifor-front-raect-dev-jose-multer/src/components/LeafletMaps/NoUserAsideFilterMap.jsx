//* ========================================
//* COMPONENTE: NoUsarAsideFilterMap
//* ========================================
//* Propósito: Panel lateral de filtros para el mapa con estado local y opciones predefinidas
//* Usado en: Vista pública del mapa (sin usuario autenticado)
//* Props:
//*   - show: boolean - Controla visibilidad del panel
//*   - onClose: función - Callback para cerrar el panel
//*   - onFilterChange: función - Callback al aplicar filtros
//*   - onDataTypeChange: función - Callback al cambiar tipo de dato
//* Características:
//*   - Estado local para todos los filtros
//*   - Opciones dinámicas según dataType
//*   - Botón de reset para limpiar filtros
//*   - Diseño con Tailwind CSS
//* Diferencias con AsideFilterMap:
//*   - Tiene props de show/onClose (panel deslizable)
//*   - Usa "Todos" como opción por defecto
//*   - Incluye emojis en las etiquetas
//*   - Más completo visualmente

import { useState } from "react";

/**
 * NoUsarAsideFilterMap.jsx
 * Barra lateral con filtros para el mapa (SIMPLE Y BÁSICO)
 *
 * Props:
 * - show: boolean - Si el aside está visible o no
 * - onClose: function - Función para cerrar el aside
 * - onFilterChange: function - Función que se ejecuta cuando se aplican los filtros
 * - onDataTypeChange: function - Función que se ejecuta cuando cambia el tipo de dato
 */

const NoUsarAsideFilterMap = ({
  show,
  onClose,
  onFilterChange,
  onDataTypeChange,
}) => {
  //* ========================================
  //* ESTADOS LOCALES DE LOS FILTROS
  //* ========================================
  const [dataType, setDataType] = useState("report");
  const [status, setStatus] = useState("Todos");
  const [type, setType] = useState("Todos");
  const [priority, setPriority] = useState("Todos");
  const [timeRange, setTimeRange] = useState("24h");

  //* ========================================
  //* OPCIONES DE LOS SELECT
  //* ========================================

  //? Opciones de estado según el tipo de dato (dinámico)
  const statusOptions = {
    report: [
      "Todos",
      "Pendiente",
      "Revisado",
      "Aceptado",
      "Completado",
      "Rechazado",
    ],
    task: ["Todos", "Pendiente", "En Progreso", "Finalizada"],
    progress: ["Todos", "Pendiente", "En Progreso", "Finalizado"],
  };

  //? Opciones de tipo de reporte (para reportes y tareas)
  const typeOptions = [
    "Todos",
    "Bache",
    "Alumbrado",
    "Basura",
    "Incidente",
    "Otro",
  ];

  //? Opciones de prioridad (solo para tareas)
  const priorityOptions = ["Todos", "Alta", "Media", "Baja"];

  //? Opciones de rango de tiempo (con etiquetas descriptivas)
  const timeOptions = [
    { value: "1h", label: "Última hora" },
    { value: "6h", label: "Últimas 6 horas" },
    { value: "12h", label: "Últimas 12 horas" },
    { value: "24h", label: "Últimas 24 horas" },
    { value: "7d", label: "Última semana" },
    { value: "1m", label: "Último mes" },
    { value: "3m", label: "Últimos 3 meses" },
    { value: "6m", label: "Últimos 6 meses" },
    { value: "1y", label: "Último año" },
    { value: "all", label: "Sin límite" },
  ];

  //* ========================================
  //* MANEJADORES DE CAMBIOS
  //* ========================================

  //! Cuando cambia el tipo de dato (report/task/progress)
  const handleDataTypeChange = (newType) => {
    setDataType(newType);
    //? Resetear los demás filtros para evitar inconsistencias
    setStatus("Todos");
    setType("Todos");
    setPriority("Todos");
    //! Notificar al componente padre para que recargue los datos
    if (onDataTypeChange) {
      onDataTypeChange(newType);
    }
  };

  //! Cuando se hace click en "Aplicar filtros"
  const handleApplyFilters = () => {
    onFilterChange({
      dataType,
      status,
      type,
      priority,
      timeRange,
    });
  };

  //! Resetear todos los filtros a valores por defecto
  const handleReset = () => {
    setDataType("report");
    setStatus("Todos");
    setType("Todos");
    setPriority("Todos");
    setTimeRange("24h");
  };

  //* ========================================
  //* RENDER
  //* ========================================

  //? Si no está visible, no renderizar nada
  if (!show) return null;

  return (
    <aside className="w-80 bg-white shadow-lg h-full overflow-y-auto">
      {/* //? ======================================== */}
      {/* //? HEADER DEL PANEL */}
      {/* //? ======================================== */}
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-700">🔍 Filtros</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
          title="Cerrar filtros"
        >
          ✕
        </button>
      </div>

      {/* //? ======================================== */}
      {/* //? CONTENIDO DEL PANEL - FORMULARIO */}
      {/* //? ======================================== */}
      <div className="p-6 space-y-6">
        {/* //? SELECT 1: Tipo de dato */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📊 Tipo de dato
          </label>
          <select
            value={dataType}
            onChange={(e) => handleDataTypeChange(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="report">Reportes</option>
            <option value="task">Tareas</option>
            <option value="progress">Avances</option>
          </select>
        </div>

        {/* //? SELECT 2: Estado (opciones dinámicas según dataType) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📋 Estado
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {/* //! Renderizar opciones según el dataType actual */}
            {statusOptions[dataType].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* //? SELECT 3: Tipo de reporte (solo para reportes y tareas) */}
        {(dataType === "report" || dataType === "task") && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🏷️ Tipo de reporte
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* //? SELECT 4: Prioridad (solo para tareas) */}
        {dataType === "task" && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ⚡ Prioridad
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {priorityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* //? SELECT 5: Rango de tiempo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ⏰ Rango de tiempo
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* //! Botón para aplicar filtros */}
        <button
          onClick={handleApplyFilters}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          ✅ Aplicar filtros
        </button>

        {/* //? Botón para resetear filtros */}
        <button
          onClick={handleReset}
          className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          🔄 Resetear filtros
        </button>
      </div>
    </aside>
  );
};

export default NoUsarAsideFilterMap;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * NoUsarAsideFilterMap = panel lateral de filtros (no usar - versión alternativa)
 * show = mostrar
 * onClose = al cerrar
 * onFilterChange = al cambiar filtro
 * onDataTypeChange = al cambiar tipo de dato
 * dataType = tipo de dato
 * setDataType = establecer tipo de dato
 * status = estado
 * setStatus = establecer estado
 * type = tipo
 * setType = establecer tipo
 * priority = prioridad
 * setPriority = establecer prioridad
 * timeRange = rango de tiempo
 * setTimeRange = establecer rango de tiempo
 * statusOptions = opciones de estado
 * typeOptions = opciones de tipo
 * priorityOptions = opciones de prioridad
 * timeOptions = opciones de tiempo
 * handleDataTypeChange = manejar cambio de tipo de dato
 * handleApplyFilters = manejar aplicar filtros
 * handleReset = manejar resetear
 * newType = nuevo tipo
 * e = evento
 * option = opción
 * value = valor
 * label = etiqueta
 */
