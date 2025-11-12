//! ===============================================
//! ADMIN GLOBAL VIEW - Vista global del sistema
//! ===============================================
//* Ruta: /admin/globalview
//* Layout: AdminLayout
//* Acceso: Solo rol "Administrador"

//* Propósito:
//? Vista completa de todos los recursos del sistema en un solo lugar
//? Endpoints: GET /reports, GET /tasks, GET /crews, GET /progress-report
//? Permite filtrar y buscar por cualquier recurso (Reportes, Tareas, Cuadrillas, Avances)
//? Muestra detalles de cualquier elemento seleccionado

import { useState } from "react";
import ReportDetails from "../../components/details/ReportDetails";
import TaskDetails from "../../components/details/TaskDetails";
import CrewDetails from "../../components/details/CrewDetails";
import ProgressWorkerDetail from "../../components/details/ProgressWorkerDetail";

/**
 * * Componente AdminGlobalView
 * ? Vista global que muestra todos los recursos del sistema con filtros y búsqueda
 * @returns {JSX.Element} Vista con filtros, búsqueda y listados de todos los recursos
 *
 * Características:
 * - Carga 4 tipos de recursos: Reportes, Tareas, Cuadrillas, Avances
 * - Filtro por tipo de recurso (All, Reports, Tasks, Crews, Progress)
 * - Búsqueda por diferentes campos según el tipo seleccionado
 * - Muestra detalles de cualquier elemento al hacer click
 * - Vista "All" muestra todos los recursos en secciones separadas
 */
const AdminGlobalView = () => {
  // Estado y hooks mínimos para evitar errores
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("");
  const [selectedDetail, setSelectedDetail] = useState(null);
  // Simulación de datos y opciones
  const reports = [];
  const tasks = [];
  const crews = [];
  const progress = [];
  const fieldOptionsByType = {
    All: ["title", "name"],
    Reports: ["title", "author"],
    Tasks: ["title", "status", "priority"],
    Crews: ["name", "members"],
    Progress: ["title", "worker"],
  };
  // Simulación de funciones de filtro
  const filterBySearch = (arr, val, field) => arr.filter((el) => (el[field] || "").toLowerCase().includes(val.toLowerCase()));
  const filteredReports = !search ? reports : filterBySearch(reports, search, searchField || "title");
  const filteredTasks = !search ? tasks : filterBySearch(tasks, search, searchField || "title");
  const filteredCrews = !search ? crews : filterBySearch(crews, search, searchField || "name");
  const filteredProgress = !search ? progress : filterBySearch(progress, search, searchField || "title");
  // Renderiza los elementos de cada tipo
  const renderItems = (items, type) => {
    if (!items || items.length === 0) return <div className="text-gray-400 italic">No hay datos disponibles.</div>;
    return (
      <ul className="divide-y divide-cyan-100">
        {items.map((item, idx) => (
          <li
            key={item._id || idx}
            className="py-3 px-2 cursor-pointer hover:bg-cyan-50 rounded transition"
            onClick={() => setSelectedDetail({ type, data: item })}
          >
            {/* Render básico, personaliza según tus datos reales */}
            <span className="font-semibold text-cyan-700">{item.title || item.name || `Elemento ${idx + 1}`}</span>
          </li>
        ))}
      </ul>
    );
  };
  /**
   * * Función renderList
   * ? Selecciona qué lista mostrar según el tipo de recurso seleccionado
   * @returns {JSX.Element} Lista de elementos del tipo seleccionado o todas las listas agrupadas
   */
  const renderList = () => {
    switch (selectedType) {
      case "Reports":
        return renderItems(filteredReports, "report");
      case "Tasks":
        return renderItems(filteredTasks, "task");
      case "Crews":
        return renderItems(filteredCrews, "crew");
      case "Progress":
        return renderItems(filteredProgress, "progress");
      default:
        return (
          <div className="space-y-6">
            {filteredReports.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold mb-2">Reportes</h3>
                {renderItems(filteredReports, "report")}
              </section>
            )}
            {filteredTasks.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold mb-2">Tareas</h3>
                {renderItems(filteredTasks, "task")}
              </section>
            )}
            {filteredCrews.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold mb-2">Cuadrillas</h3>
                {renderItems(filteredCrews, "crew")}
              </section>
            )}
            {filteredProgress.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold mb-2">Avances</h3>
                {renderItems(filteredProgress, "progress")}
              </section>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf4fe] to-[#d2e7fa] flex flex-col items-center py-12">
      {/* Título y descripción */}
      <div className="w-full max-w-5xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-extrabold text-cyan-700 mb-2 drop-shadow">Vista Global del Sistema</h1>
        <p className="text-base text-cyan-900/70 mb-2">Administra y visualiza todos los recursos del sistema en un solo lugar. Filtra y busca por reportes, tareas, cuadrillas y avances.</p>
      </div>
      {/* Panel de controles glassmorphism */}
      <div className="w-full max-w-5xl mx-auto bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-cyan-200 px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div className="flex gap-2 items-center justify-center flex-wrap">
          {["All", "Reports", "Tasks", "Crews", "Progress"].map((t) => (
            <button
              key={t}
              className={`px-4 py-2 rounded-xl font-bold shadow border transition-all duration-200 text-base tracking-tight drop-shadow ${selectedType === t
                ? "bg-cyan-600 text-white border-cyan-600"
                : "bg-white text-cyan-600 border-cyan-600 hover:bg-cyan-50"
                }`}
              onClick={() => setSelectedType(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center justify-center flex-wrap">
          <input
            type="text"
            placeholder={`Buscar por ${searchField || "campo"}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-cyan-300 rounded-xl px-4 py-3 w-64 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-700 bg-white/90"
          />
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="border border-cyan-300 rounded-xl px-2 py-2 shadow bg-white/90 text-cyan-700"
          >
            {(fieldOptionsByType[selectedType] || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Tarjeta principal con contenido */}
      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-cyan-300 p-10">
        {/* ====== SECCIÓN: Lista de recursos filtrados ====== */}
        <div className="space-y-8">{renderList()}</div>
        {/* ====== SECCIÓN: Modal de detalles ====== */}
        {selectedDetail && (
          <div>
            {selectedDetail.type === "report" && (
              <ReportDetails
                report={selectedDetail.data}
                onClose={() => setSelectedDetail(null)}
                role={"Administrador"}
              />
            )}
            {selectedDetail.type === "task" && (
              <TaskDetails
                task={selectedDetail.data}
                onClose={() => setSelectedDetail(null)}
              />
            )}
            {selectedDetail.type === "crew" && (
              <CrewDetails
                crew={selectedDetail.data}
                onClose={() => setSelectedDetail(null)}
              />
            )}
            {selectedDetail.type === "progress" && (
              <ProgressWorkerDetail
                progress={selectedDetail.data}
                onClose={() => setSelectedDetail(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminGlobalView;
