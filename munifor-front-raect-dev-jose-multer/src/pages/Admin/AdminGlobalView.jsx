//! ===============================================
//! ADMIN GLOBAL VIEW - Vista global del sistema
//! ===============================================
//* Ruta: /admin/globalview
//* Layout: AdminLayout
//* Acceso: Solo rol "Administrador"

//* Propósito:
//? Vista completa de todos los recursos del sistema en un solo lugar
//? Endpoints: GET /admin/globalview - Obtiene reportes, tareas, cuadrillas y avances
//? Permite filtrar y buscar por cualquier recurso (Reportes, Tareas, Cuadrillas, Avances)
//? Muestra detalles de cualquier elemento seleccionado

import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import ReportDetails from "../../components/details/ReportDetails";
import TaskDetails from "../../components/details/TaskDetails";
import CrewDetails from "../../components/details/CrewDetails";
import ProgressWorkerDetail from "../../components/details/ProgressWorkerDetail";
import Pagination from "../../components/Pagination";

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
  const { getFetchData } = useFetch();

  // Estados para los datos del sistema
  const [reports, setReports] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [crews, setCrews] = useState([]);
  const [progress, setProgress] = useState([]);

  // Estados de UI
  const [selectedType, setSelectedType] = useState("Reports"); //? Antes: "All"
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [selectedDetail, setSelectedDetail] = useState(null);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Cargar todos los datos al montar el componente
  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const response = await getFetchData("/admin/globalview");
        if (response?.data) {
          setReports(response.data.reports || []);
          setTasks(response.data.tasks || []);
          setCrews(response.data.crews || []);
          setProgress(response.data.progress || []);
        }
      } catch (error) {
        console.error("Error al cargar vista global:", error);
        setReports([]);
        setTasks([]);
        setCrews([]);
        setProgress([]);
      }
    };
    fetchGlobalData();
  }, []);

  // Opciones de búsqueda según el tipo seleccionado
  const fieldOptionsByType = {
    // All: ["title", "name"], //? Comentado: opción "All" removida
    Reports: ["title", "type", "status"],
    Tasks: ["title", "status", "priority"],
    Crews: ["name", "leader"],
    Progress: ["title", "status"],
  };
  // Función de filtro mejorada
  const filterBySearch = (arr, val, field) => {
    if (!val.trim()) return arr; // Si no hay búsqueda, mostrar todos
    return arr.filter((el) => {
      const fieldValue = el[field];
      if (!fieldValue) return false;
      // Convertir a string y buscar (case insensitive)
      return fieldValue.toString().toLowerCase().includes(val.toLowerCase());
    });
  };
  // Aplicar filtros según el campo de búsqueda seleccionado
  const filteredReports = filterBySearch(
    reports,
    search,
    searchField || "title"
  );
  const filteredTasks = filterBySearch(tasks, search, searchField || "title");
  const filteredCrews = filterBySearch(crews, search, searchField || "name");
  const filteredProgress = filterBySearch(
    progress,
    search,
    searchField || "title"
  );

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchField, selectedType]);
  // Renderiza los elementos de cada tipo con paginación
  const renderItems = (items, type, showPagination = true) => {
    if (!items || items.length === 0)
      return (
        <div className="text-gray-400 italic">No hay datos disponibles.</div>
      );

    // Calcular paginación
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    return (
      <>
        <ul className="divide-y divide-cyan-100">
          {paginatedItems.map((item, idx) => (
            <li
              key={item._id || idx}
              className="py-3 px-2 cursor-pointer hover:bg-cyan-50 rounded transition"
              onClick={() => setSelectedDetail({ type, data: item })}
            >
              {/* Render básico, personaliza según tus datos reales */}
              <span className="font-semibold text-cyan-700">
                {item.title || item.name || `Elemento ${idx + 1}`}
              </span>
            </li>
          ))}
        </ul>
        {showPagination && totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </>
    );
  };
  /**
   * * Función renderList
   * ? Selecciona qué lista mostrar según el tipo de recurso seleccionado
   * @returns {JSX.Element} Lista de elementos del tipo seleccionado
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
        return renderItems(filteredReports, "report");
    }

    //? ========================================
    //? CÓDIGO COMENTADO: Vista "All" (mostrar todos los recursos)
    //? ========================================
    //? Si se quiere volver a habilitar la opción "All", descomentar este código
    //? y agregar "All" en el array de botones y en fieldOptionsByType
    /*
    switch (selectedType) {
      case "Reports":
        return renderItems(filteredReports, "report");
      case "Tasks":
        return renderItems(filteredTasks, "task");
      case "Crews":
        return renderItems(filteredCrews, "crew");
      case "Progress":
        return renderItems(filteredProgress, "progress");
      default: // Caso "All"
        return (
          <div className="space-y-6">
            {filteredReports.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold mb-2">Reportes</h3>
                {renderItems(filteredReports, "report", false)}
              </section>
            )}
            {filteredTasks.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold mb-2">Tareas</h3>
                {renderItems(filteredTasks, "task", false)}
              </section>
            )}
            {filteredCrews.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold mb-2">Cuadrillas</h3>
                {renderItems(filteredCrews, "crew", false)}
              </section>
            )}
            {filteredProgress.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold mb-2">Avances</h3>
                {renderItems(filteredProgress, "progress", false)}
              </section>
            )}
          </div>
        );
    }
    */
  };
  const closeModal = () => {
    setSelectedDetail(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf4fe] to-[#d2e7fa] flex flex-col items-center py-12">
      {/* Título y descripción */}
      <div className="w-full max-w-5xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-extrabold text-cyan-700 mb-2 drop-shadow">
          Vista Global del Sistema
        </h1>
        <p className="text-base text-cyan-900/70 mb-2">
          Administra y visualiza todos los recursos del sistema en un solo
          lugar. Filtra y busca por reportes, tareas, cuadrillas y avances.
        </p>
      </div>
      {/* Panel de controles glassmorphism */}
      <div className="w-full max-w-5xl mx-auto bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-cyan-200 px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div className="flex gap-2 items-center justify-center flex-wrap">
          {/* Botón "All" comentado - Descomentar para mostrar todos los recursos */}
          {/* <button key="All" className={...} onClick={() => setSelectedType("All")}>All</button> */}
          {["Reports", "Tasks", "Crews", "Progress"].map((t) => (
            <button
              key={t}
              className={`px-4 py-2 rounded-xl font-bold shadow border transition-all duration-200 text-base tracking-tight drop-shadow ${
                selectedType === t
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
      </div>

      {/* ====== SECCIÓN: Modal de detalles ====== */}
      {selectedDetail && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl font-bold"
              onClick={closeModal}
              aria-label="Cerrar"
            >
              &times;
            </button>
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
              <CrewDetails onClose={() => setSelectedDetail(null)} />
            )}
            {selectedDetail.type === "progress" && (
              <ProgressWorkerDetail
                progress={selectedDetail.data}
                onClose={() => setSelectedDetail(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGlobalView;
