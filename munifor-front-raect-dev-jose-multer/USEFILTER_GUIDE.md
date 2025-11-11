# 📘 Guía de Uso de useFilter

Esta guía muestra cómo usar el hook `useFilter` en diferentes escenarios de MuniFor.

---

## 📚 Tabla de Contenidos

1. [Uso Básico](#uso-básico)
2. [Ejemplos por Componente](#ejemplos-por-componente)
3. [Filtro Dinámico para Mapa](#filtro-dinámico-para-mapa)
4. [Paginación](#paginación)
5. [Tips y Mejores Prácticas](#tips-y-mejores-prácticas)

---

## 🎯 Uso Básico

### Importar el Hook

```javascript
import useFilter from "../../hooks/useFilter";
```

### Inicializar

```javascript
const {
  filterBySearch,
  filterReportsByStatus,
  filterReportsByType,
  filterTasksByStatus,
  filterTasksByReportType,
  filterTasksByPriority,
  filterProgressByStatus,
  filterByTime,
  filterForMap,
  limitData,
  sortData,
  applyFilters,
} = useFilter();
```

---

## 📝 Ejemplos por Componente

### 1. OperatorReports.jsx - Filtrado Múltiple

```javascript
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import useFilter from "../../hooks/useFilter";
import ReportDetails from "../../components/details/ReportDetails";

const OperatorReports = () => {
  const { getFetchData, putFetch } = useFetch();
  const { filterBySearch, filterReportsByStatus, filterByTime, limitData } =
    useFilter();

  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  // Estados de filtros
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [timeRange, setTimeRange] = useState("24h"); // Filtro de tiempo por defecto
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getFetchData("/reports");
        setReports(data.reports);
      } catch (error) {
        console.error("Error al obtener los reportes:", error);
      }
    };
    fetchReports();
  }, [selectedReport]);

  // Aplicar filtros en cadena
  const filteredReports = (() => {
    let result = reports;

    // 1. Filtrar por tiempo (primero para reducir datos)
    result = filterByTime(result, timeRange);

    // 2. Filtrar por estado
    result = filterReportsByStatus(result, filter);

    // 3. Filtrar por búsqueda
    result = filterBySearch(result, search, "title");

    return result;
  })();

  // Paginar resultados (mostrar solo 50)
  const paginatedResult = limitData(filteredReports, 50, page);

  const statusOptions = [
    "Todos",
    "Pendiente",
    "Revisado",
    "Aceptado",
    "Completado",
    "Rechazado",
  ];

  const timeOptions = [
    { value: "1h", label: "Última hora" },
    { value: "6h", label: "Últimas 6 horas" },
    { value: "12h", label: "Últimas 12 horas" },
    { value: "24h", label: "Últimas 24 horas" },
    { value: "7d", label: "Última semana" },
    { value: "1m", label: "Último mes" },
    { value: "all", label: "Sin límite" },
  ];

  const handleSelectReport = (reporte) => {
    setSelectedReport(reporte);
    if (reporte.status === "Pendiente") {
      putFetch("/report/review", reporte._id);
    }
  };

  const closeModal = () => setSelectedReport(null);

  const handleRejectReport = (id) => {
    putFetch("/report/reject", id);
    closeModal();
  };

  const handleAcceptReport = (id) => {
    putFetch("/report/accept", id);
    closeModal();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-2">
        <h2 className="text-xl font-bold text-gray-700">
          Reportes de Ciudadanos
        </h2>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-md focus:outline-none focus:ring focus:border-blue-300"
        />

        {/* Selector de rango de tiempo */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-xs"
        >
          {timeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Botones de filtro por estado */}
      <div className="max-w-5xl mx-auto px-4 pb-4 flex gap-2">
        {statusOptions.map((option) => (
          <button
            key={option}
            className={`px-4 py-2 rounded border font-medium transition-colors duration-150
              ${
                filter === option
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border-blue-600"
              }`}
            onClick={() => setFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Resultados */}
      <div className="space-y-4">
        {/* Info de resultados */}
        <div className="max-w-5xl mx-auto px-4 text-gray-600 text-sm">
          Mostrando {paginatedResult.data.length} de {filteredReports.length}{" "}
          reportes
        </div>

        {paginatedResult.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <h3>No hay reportes que coincidan con los filtros</h3>
          </div>
        ) : (
          <>
            {paginatedResult.data.map((reporte, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow p-3 flex justify-between items-center border border-gray-200 w-full max-w-2xl mx-auto min-h-14 hover:cursor-pointer"
                onClick={() => handleSelectReport(reporte)}
              >
                <div>
                  <span className="block text-xl font-semibold text-gray-800">
                    {reporte.title}
                  </span>
                  <span className="block text-sm text-gray-500">
                    Autor: {reporte.author}
                  </span>
                </div>
                <span
                  className={`px-5 py-2 rounded-full text-base font-medium 
                    ${
                      reporte.status === "Completado"
                        ? "bg-green-100 text-green-700"
                        : reporte.status === "En Progreso"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                >
                  {reporte.status}
                </span>
              </div>
            ))}

            {/* Paginación */}
            {paginatedResult.hasMore && (
              <div className="flex justify-center py-4">
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Cargar más
                </button>
              </div>
            )}
          </>
        )}

        {selectedReport && (
          <ReportDetails
            report={selectedReport}
            onClose={closeModal}
            onReject={handleRejectReport}
            onAccept={handleAcceptReport}
            role={"Operador"}
          />
        )}
      </div>
    </div>
  );
};

export default OperatorReports;
```

---

### 2. CitizenDashboard.jsx - Filtro de Tiempo

```javascript
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import useFetch from "../../hooks/useFetch";
import useFilter from "../../hooks/useFilter";
import { useNavigate } from "react-router-dom";

const CitizenDashboard = () => {
  const { user } = useContext(UserContext);
  const { getFetchData } = useFetch();
  const { filterByTime } = useFilter();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [timeRange, setTimeRange] = useState("1m"); // Último mes por defecto

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getFetchData("/reports/author");
        setReports(data.reports);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, [user]);

  // Filtrar reportes por tiempo
  const filteredReports = filterByTime(reports, timeRange);

  // Calcular estadísticas solo de reportes filtrados
  const counts = {
    pending: filteredReports.filter((r) => r.status === "Pendiente").length,
    reviewed: filteredReports.filter((r) => r.status === "Revisado").length,
    completed: filteredReports.filter((r) => r.status === "Completado").length,
    accepted: filteredReports.filter((r) => r.status === "Aceptado").length,
    rejected: filteredReports.filter((r) => r.status === "Rechazado").length,
    total: filteredReports.length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Título y descripción */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          ¡Bienvenido, Usuario!
        </h1>
        <p className="text-gray-600">Panel de control del ciudadano</p>

        {/* Selector de rango de tiempo */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-gray-700 mr-2">
            Mostrar estadísticas de:
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="24h">Últimas 24 horas</option>
            <option value="7d">Última semana</option>
            <option value="1m">Último mes</option>
            <option value="3m">Últimos 3 meses</option>
            <option value="6m">Últimos 6 meses</option>
            <option value="1y">Último año</option>
            <option value="all">Todo el tiempo</option>
          </select>
        </div>
      </div>

      {/* Tarjetas de estadísticas por status */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-yellow-600 mb-2">
            Pendientes
          </h3>
          <p className="text-4xl font-bold mb-2">{counts.pending}</p>
          <p className="text-gray-600 text-sm">Reportes sin revisar</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-blue-600 mb-2">
            Revisados
          </h3>
          <p className="text-4xl font-bold mb-2">{counts.reviewed}</p>
          <p className="text-gray-600 text-sm">En seguimiento</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-green-600 mb-2">
            Completados
          </h3>
          <p className="text-4xl font-bold mb-2">{counts.completed}</p>
          <p className="text-gray-600 text-sm">Resueltos exitosamente</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-cyan-600 mb-2">
            Aceptados
          </h3>
          <p className="text-4xl font-bold mb-2">{counts.accepted}</p>
          <p className="text-gray-600 text-sm">Convertidos en tarea</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Rechazados
          </h3>
          <p className="text-4xl font-bold mb-2">{counts.rejected}</p>
          <p className="text-gray-600 text-sm">No procedentes</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total</h3>
          <p className="text-4xl font-bold mb-2">{counts.total}</p>
          <p className="text-gray-600 text-sm">Reportes totales</p>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
```

---

### 3. OperatorTasks.jsx - Filtros Múltiples en Tareas

```javascript
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import useFilter from "../../hooks/useFilter";
import CreateTaskModal from "../../components/CreateTaskModal";

const OperatorTasks = () => {
  const { getFetchData } = useFetch();
  const { filterTasksByStatus, filterTasksByPriority, filterByTime, sortData } =
    useFilter();

  const [tasks, setTasks] = useState([]);
  const [acceptedReports, setAcceptedReports] = useState([]);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

  // Estados de filtros
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [priorityFilter, setPriorityFilter] = useState("Todos");
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getFetchData("/task");
        setTasks(Array.isArray(data?.task) ? data.task : []);
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
        setTasks([]);
      }
    };

    const fetchAcceptedReports = async () => {
      try {
        const data = await getFetchData("/reports/accepted");
        setAcceptedReports(Array.isArray(data?.reports) ? data.reports : []);
      } catch (error) {
        console.error("Error al obtener los reportes aceptados:", error);
        setAcceptedReports([]);
      }
    };

    fetchTasks();
    fetchAcceptedReports();
  }, []);

  // Aplicar filtros a las tareas
  const filteredTasks = (() => {
    let result = tasks;

    // Filtrar por tiempo
    result = filterByTime(result, timeRange);

    // Filtrar por estado
    result = filterTasksByStatus(result, statusFilter);

    // Filtrar por prioridad
    result = filterTasksByPriority(result, priorityFilter);

    // Ordenar por fecha de creación (más recientes primero)
    result = sortData(result, "created_at", "desc");

    return result;
  })();

  const handleCreateTask = () => {
    setShowCreateTaskModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-700">Tareas</h2>

        {/* Controles de filtro */}
        <div className="flex gap-4 flex-wrap">
          {/* Filtro de estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Finalizada">Finalizada</option>
          </select>

          {/* Filtro de prioridad */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="Todos">Todas las prioridades</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>

          {/* Filtro de tiempo */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="24h">Últimas 24 horas</option>
            <option value="7d">Última semana</option>
            <option value="1m">Último mes</option>
            <option value="all">Sin límite</option>
          </select>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ml-auto"
            onClick={() => setShowCreateTaskModal(true)}
          >
            Crear tarea
          </button>
        </div>

        {/* Info de resultados */}
        <div className="text-gray-600 text-sm">
          Mostrando {filteredTasks.length} tareas
        </div>

        {showCreateTaskModal && (
          <CreateTaskModal closeModal={handleCreateTask} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
        {/* Sección de reportes aceptados */}
        <div>
          <h3 className="text-lg font-semibold text-indigo-700 mb-4">
            Reportes aceptados
          </h3>
          {acceptedReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <span className="text-gray-500">No hay reportes aceptados</span>
            </div>
          ) : (
            acceptedReports.map((report, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow p-3 flex flex-col border border-gray-200 w-full mb-3 min-h-14"
              >
                <span className="block text-base font-semibold text-gray-800">
                  {report.title}
                </span>
                <span className="text-sm text-gray-500">
                  {report.description}
                </span>
                <span className="text-xs text-gray-400">
                  Autor: {report.author}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Sección de tareas asignadas */}
        <div>
          <h3 className="text-lg font-semibold text-blue-700 mb-4">
            Tareas asignadas
          </h3>
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <span className="text-gray-500">
                No hay tareas que coincidan con los filtros
              </span>
            </div>
          ) : (
            filteredTasks.map((task, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow p-3 flex justify-between items-center border border-gray-200 w-full mb-3 min-h-14"
              >
                <div>
                  <span className="block text-xl font-semibold text-gray-800">
                    {task.title}
                  </span>
                  <span className="text-sm text-gray-500">
                    Prioridad:{" "}
                    <span
                      className={`font-semibold ${
                        task.priority === "Alta"
                          ? "text-red-600"
                          : task.priority === "Media"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </span>
                </div>
                <span className="px-5 py-2 rounded-full text-base font-medium bg-indigo-100 text-indigo-700">
                  {task.status || "Sin estado"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OperatorTasks;
```

---

## 🗺️ Filtro Dinámico para Mapa

Este es el ejemplo para el `<aside/>` que mencionaste en OperatorMap/AdminMap:

```javascript
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import useFilter from "../../hooks/useFilter";
import OperatorLeafletMap from "../../components/LeafletMaps/OperatorLeafletMap";

const OperatorMap = () => {
  const { getFetchData } = useFetch();
  const { filterForMap, limitData } = useFilter();

  const [allReports, setAllReports] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [allProgress, setAllProgress] = useState([]);

  // Estados de filtros
  const [dataType, setDataType] = useState("report"); // report | task | progress
  const [status, setStatus] = useState("Todos");
  const [type, setType] = useState("Todos");
  const [priority, setPriority] = useState("Todos");
  const [timeRange, setTimeRange] = useState("24h");
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsData, tasksData, progressData] = await Promise.all([
          getFetchData("/reports"),
          getFetchData("/task"),
          getFetchData("/progress-report"),
        ]);

        setAllReports(reportsData.reports || []);
        setAllTasks(tasksData.task || []);
        setAllProgress(progressData.progress || []);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  // Obtener datos según el tipo seleccionado
  const getCurrentData = () => {
    switch (dataType) {
      case "report":
        return allReports;
      case "task":
        return allTasks;
      case "progress":
        return allProgress;
      default:
        return [];
    }
  };

  // Aplicar filtros
  const filteredData = filterForMap(getCurrentData(), {
    dataType,
    status,
    type,
    priority,
    timeRange,
  });

  // Limitar a 50 elementos por defecto (mejora el rendimiento del mapa)
  const limitedData = limitData(filteredData, 50, 1);

  // Opciones de filtro según el tipo de dato
  const getStatusOptions = () => {
    if (dataType === "report") {
      return [
        "Todos",
        "Pendiente",
        "Revisado",
        "Aceptado",
        "Completado",
        "Rechazado",
      ];
    } else if (dataType === "task") {
      return ["Todos", "Pendiente", "En Progreso", "Finalizada"];
    } else {
      return ["Todos", "Pendiente", "En Progreso", "Finalizado"];
    }
  };

  const getTypeOptions = () => {
    if (dataType === "report" || dataType === "task") {
      return ["Todos", "Bache", "Alumbrado", "Basura", "Incidente", "Otro"];
    }
    return ["Todos"];
  };

  // Resetear filtros cuando cambia el tipo de dato
  const handleDataTypeChange = (newType) => {
    setDataType(newType);
    setStatus("Todos");
    setType("Todos");
    setPriority("Todos");
  };

  return (
    <div className="relative w-full h-screen flex">
      {/* Aside de filtros */}
      <aside
        className={`${
          showFilters ? "w-80" : "w-0"
        } bg-white shadow-lg transition-all duration-300 overflow-hidden`}
      >
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-700">Filtros</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* 1. Tipo de dato */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de dato
            </label>
            <select
              value={dataType}
              onChange={(e) => handleDataTypeChange(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="report">Reportes</option>
              <option value="task">Tareas</option>
              <option value="progress">Avances</option>
            </select>
          </div>

          {/* 2. Estado */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            >
              {getStatusOptions().map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Tipo (solo para reportes y tareas) */}
          {(dataType === "report" || dataType === "task") && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de reporte
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              >
                {getTypeOptions().map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 4. Prioridad (solo para tareas) */}
          {dataType === "task" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="Todos">Todas</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          )}

          {/* 5. Rango de tiempo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Rango de tiempo
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            >
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

          {/* Información de resultados */}
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">
              Mostrando{" "}
              <span className="font-bold">{limitedData.data.length}</span> de{" "}
              <span className="font-bold">{filteredData.length}</span> elementos
            </p>
            {limitedData.hasMore && (
              <p className="text-xs text-amber-600 mt-1">
                ⚠️ Limitado a 50 elementos para mejor rendimiento
              </p>
            )}
          </div>

          {/* Botón de resetear */}
          <button
            onClick={() => {
              setStatus("Todos");
              setType("Todos");
              setPriority("Todos");
              setTimeRange("24h");
            }}
            className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Resetear filtros
          </button>
        </div>
      </aside>

      {/* Botón para mostrar filtros si está oculto */}
      {!showFilters && (
        <button
          onClick={() => setShowFilters(true)}
          className="absolute top-4 left-4 z-10 bg-white shadow-lg px-4 py-2 rounded-lg hover:bg-gray-50"
        >
          🔍 Mostrar filtros
        </button>
      )}

      {/* Mapa */}
      <div className="flex-1 relative">
        <OperatorLeafletMap data={limitedData.data} dataType={dataType} />
      </div>
    </div>
  );
};

export default OperatorMap;
```

---

## 💡 Tips y Mejores Prácticas

### 1. Performance

```javascript
// ✅ BUENO: Aplicar filtros en orden de más restrictivo a menos restrictivo
const filtered = (() => {
  let result = data;
  result = filterByTime(result, "24h"); // Reduce a 24 horas primero
  result = filterByStatus(result, "Pendiente"); // Luego filtra estado
  result = filterBySearch(result, search, "title"); // Búsqueda al final
  return result;
})();

// ❌ MALO: Orden ineficiente
const filtered = (() => {
  let result = data;
  result = filterBySearch(result, search, "title"); // Busca en todos primero
  result = filterByTime(result, "24h"); // Luego reduce
  return result;
})();
```

### 2. Memoización con useMemo

```javascript
import { useMemo } from "react";

const filteredData = useMemo(() => {
  let result = reports;
  result = filterByTime(result, timeRange);
  result = filterByStatus(result, status);
  return result;
}, [reports, timeRange, status]);
```

### 3. Combinar con sortData

```javascript
// Filtrar y ordenar
const filteredAndSorted = sortData(
  filterByTime(reports, "24h"),
  "created_at",
  "desc"
);
```

### 4. Uso del encadenamiento con applyFilters

```javascript
const filtered = applyFilters(reports, [
  (data) => filterByTime(data, "24h"),
  (data) => filterReportsByStatus(data, "Pendiente"),
  (data) => filterBySearch(data, search, "title"),
]);
```

---

## 🎯 Resumen

- ✅ Usa `filterByTime` con `"24h"` como valor por defecto
- ✅ Combina `limitData` con los filtros para mejorar performance
- ✅ Para el mapa, usa `filterForMap` con el objeto de configuración
- ✅ Aplica filtros de más restrictivo a menos restrictivo
- ✅ Usa `useMemo` para evitar recalcular en cada render

¡Listo para implementar! 🚀
