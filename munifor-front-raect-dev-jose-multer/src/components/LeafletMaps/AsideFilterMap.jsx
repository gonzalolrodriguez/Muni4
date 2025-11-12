//* ========================================
//* COMPONENTE: AsideFilterMap
//* ========================================
//* Propósito: Formulario de filtros para el mapa global
//* Usado en: GlobalLeafletMap (panel izquierdo con filtros)
//* Props:
//*   - onFilters: función - Callback que recibe los filtros aplicados
//* Campos del formulario:
//*   - dataType: "report" | "task" | "progress" (obligatorio)
//*   - Según dataType, muestra diferentes campos:
//*     * report: type (Bache, Alumbrado, Basura, Otro), status (Pendiente, Revisado, Aceptado, Completado, Rechazado)
//*     * task: type (Reparación, Mantenimiento, Recolección, Supervisión), priority (Alta, Media, Baja), status
//*     * progress: progressStatus (pendiente, en-progreso, finalizado)
//*   - timeRange: Rango de tiempo (1h, 6h, 12h, 24h, 7d, 1m, 3m, 6m, 1y, all)
//* Lógica:
//*   - Usa watch de react-hook-form para mostrar/ocultar campos según dataType
//*   - Normaliza datos antes de enviar al callback (compatible con filterForMap)

import { useForm } from "react-hook-form";

const AsideFilterMap = ({ onFilters }) => {
  const { register, handleSubmit, watch } = useForm();

  //* ========================================
  //* WATCH: Observar dataType para mostrar campos condicionales
  //* ========================================
  const dataType = watch("dataType");

  //* ========================================
  //* SUBMIT: Normalizar filtros y enviar al padre
  //* ========================================
  const onSubmit = (data) => {
    //? Crear objeto de filtros vacío
    const filters = {};
    if (data.dataType) filters.dataType = data.dataType;

    //! Normalizar campos según dataType
    switch (data.dataType) {
      case "report":
        //? Filtros de reportes: type y status
        if (data.type) filters.type = data.type;
        if (data.status) filters.status = data.status;
        break;
      case "task":
        //? Filtros de tareas: type, priority y status
        if (data.type) filters.type = data.type;
        if (data.priority) filters.priority = data.priority;
        if (data.status) filters.status = data.status;
        break;
      case "progress":
        //? Filtros de avances: progressStatus → status
        if (data.progressStatus) filters.status = data.progressStatus;
        break;
      default:
        break;
    }

    //* Agregar rango de tiempo si existe
    if (data.timeRange) filters.timeRange = data.timeRange;

    //! Llamar callback del padre con filtros normalizados
    if (typeof onFilters === "function") {
      onFilters(filters);
    } else {
      console.log("filters:", filters);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col gap-6 border border-cyan-200"
    >
      <h2 className="text-2xl font-extrabold text-cyan-700 mb-2 text-center tracking-tight drop-shadow">Filtros del Mapa</h2>
      <div className="flex flex-col gap-4">
        <label htmlFor="dataType" className="font-semibold text-cyan-700">Tipo de Dato:</label>
        <select id="dataType" {...register("dataType")} className="rounded-lg border border-cyan-300 p-2 focus:outline-none focus:ring-2 focus:ring-cyan-400">
          <option value="">Seleccione un tipo de dato</option>
          <option value="report">Reportes</option>
          <option value="task">Tareas</option>
          <option value="progress">Avance del trabajador</option>
        </select>

        {/* CAMPOS CONDICIONALES SEGÚN dataType */}
        {dataType === "report" && (
          <div className="flex flex-col gap-2">
            <label htmlFor="type" className="font-semibold text-cyan-700">Tipo de Reporte:</label>
            <select id="type" {...register("type")} className="rounded-lg border border-cyan-300 p-2">
              <option value="">Seleccione un tipo de reporte</option>
              <option value="Bache">Bache</option>
              <option value="Alumbrado">Alumbrado</option>
              <option value="Basura">Basura</option>
              <option value="Otro">Otro</option>
            </select>
            <label htmlFor="status" className="font-semibold text-cyan-700">Estado:</label>
            <select id="status" {...register("status")} className="rounded-lg border border-cyan-300 p-2">
              <option value="">Seleccione un estado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Revisado">Revisado</option>
              <option value="Aceptado">Aceptado</option>
              <option value="Completado">Completado</option>
              <option value="Rechazado">Rechazado</option>
            </select>
          </div>
        )}
        {dataType === "task" && (
          <div className="flex flex-col gap-2">
            <label htmlFor="type" className="font-semibold text-cyan-700">Tipo de Tarea:</label>
            <select id="type" {...register("type")} className="rounded-lg border border-cyan-300 p-2">
              <option value="">Seleccione un tipo de tarea</option>
              <option value="Reparación">Reparación</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Recolección">Recolección</option>
              <option value="Supervisión">Supervisión</option>
            </select>
            <label htmlFor="priority" className="font-semibold text-cyan-700">Prioridad:</label>
            <select id="priority" {...register("priority")} className="rounded-lg border border-cyan-300 p-2">
              <option value="">Seleccione una prioridad</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
            <label htmlFor="status" className="font-semibold text-cyan-700">Estado:</label>
            <select id="status" {...register("status")} className="rounded-lg border border-cyan-300 p-2">
              <option value="">Seleccione un estado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completado">Completado</option>
            </select>
          </div>
        )}
        {dataType === "progress" && (
          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="font-semibold text-cyan-700">Avances del Trabajador:</label>
            <select id="status" {...register("progressStatus")} className="rounded-lg border border-cyan-300 p-2">
              <option value="">Seleccione un avance</option>
              <option value="pendiente">Pendiente</option>
              <option value="en-progreso">En Progreso</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </div>
        )}
        <label htmlFor="timeRange" className="font-semibold text-cyan-700">Tiempo:</label>
        <select id="timeRange" {...register("timeRange")} className="rounded-lg border border-cyan-300 p-2">
          <option value="">Seleccione un rango de tiempo</option>
          <option value="1h">Última hora</option>
          <option value="6h">Últimas 6 horas</option>
          <option value="12h">Últimas 12 horas</option>
          <option value="24h">Últimas 24 horas</option>
          <option value="7d">Última semana</option>
          <option value="1m">Último mes</option>
          <option value="3m">Últimos 3 meses</option>
          <option value="6m">Últimos 6 meses</option>
          <option value="1y">Último año</option>
          <option value="all">Sin límite</option>
        </select>
      </div>
      <div className="flex justify-center mt-4">
        <button
          type="submit"
          className="px-6 py-2 rounded-xl bg-cyan-600 text-white font-bold shadow hover:bg-cyan-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          Aplicar Filtros
        </button>
      </div>
    </form>
  );
};

export default AsideFilterMap;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * AsideFilterMap = panel lateral de filtros de mapa
 * onFilters = al aplicar filtros
 * register = registrar (campo del formulario)
 * handleSubmit = manejar envío
 * watch = observar (valor del campo)
 * dataType = tipo de dato
 * data = datos
 * filters = filtros
 * type = tipo
 * status = estado
 * priority = prioridad
 * progressStatus = estado de avance
 * timeRange = rango de tiempo
 */
