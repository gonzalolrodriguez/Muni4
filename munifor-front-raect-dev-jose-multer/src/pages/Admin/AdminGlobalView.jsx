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

import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import useFilter from "../../hooks/useFilter";
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
  const { getFetchData } = useFetch();
  const { filterBySearch } = useFilter();

  //? Estados para almacenar los 4 tipos de recursos del sistema
  const [reports, setReports] = useState([]); //* Lista de todos los reportes
  const [tasks, setTasks] = useState([]); //* Lista de todas las tareas
  const [crews, setCrews] = useState([]); //* Lista de todas las cuadrillas
  const [progress, setProgress] = useState([]); //* Lista de todos los avances de trabajadores

  //? Estados para controlar filtros y selección
  const [selectedType, setSelectedType] = useState("All"); //* Tipo de recurso seleccionado (All, Reports, Tasks, Crews, Progress)
  const [search, setSearch] = useState(""); //* Texto de búsqueda ingresado por el usuario
  const [searchField, setSearchField] = useState(""); //* Campo por el cual buscar (title, author, name, worker.name)
  const [selectedDetail, setSelectedDetail] = useState(null); //* Elemento seleccionado para mostrar detalles

  /**
   * * useEffect - Cargar todos los recursos del sistema
   * ? Se ejecuta al montar el componente
   * ! Endpoints usados:
   * ! - GET /reports (obtiene todos los reportes)
   * ! - GET /tasks (obtiene todas las tareas)
   * ! - GET /crews (obtiene todas las cuadrillas)
   * ! - GET /progress-report (obtiene todos los avances de trabajadores)
   *
   * //* Usa Promise.all para cargar los 4 recursos en paralelo (más eficiente)
   */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [rRes, tRes, cRes, pRes] = await Promise.all([
          getFetchData("/reports"),
          getFetchData("/tasks"),
          getFetchData("/crews"),
          getFetchData("/progress-report"),
        ]);

        //? Manejo flexible de respuestas (pueden venir como {reports: [...]} o directamente [...])
        setReports(rRes?.reports || []);
        setTasks(tRes?.tasks || tRes || []);
        setCrews(cRes?.crews || cRes || []);
        setProgress(pRes?.progressReports || pRes || []);
      } catch (err) {
        console.error("Error fetching admin global data:", err);
      }
    };

    fetchAll();
  }, []);

  /**
   * * Mapeo de campos de búsqueda disponibles por tipo de recurso
   * ? Define qué campos se pueden usar para buscar según el tipo seleccionado
   */
  const fieldOptionsByType = {
    All: ["title", "author", "name", "worker.name"], //* Buscar en todos los campos disponibles
    Reports: ["title", "author"], //* Solo búsqueda por título o autor
    Tasks: ["title"], //* Solo búsqueda por título
    Crews: ["name"], //* Solo búsqueda por nombre de cuadrilla
    Progress: ["title", "worker.name"], //* Búsqueda por título o nombre de trabajador
  };

  /**
   * * useEffect - Actualizar campo de búsqueda al cambiar tipo
   * ? Cuando el usuario cambia el tipo de recurso, ajusta el campo de búsqueda a uno válido
   * ! Si el campo actual no está disponible para el nuevo tipo, selecciona el primero disponible
   */
  useEffect(() => {
    const opts = fieldOptionsByType[selectedType] || ["title"];
    setSearchField((prev) => (opts.includes(prev) ? prev : opts[0])); //? Mantiene el campo si es válido, sino usa el primero
  }, [selectedType]);

  /**
   * * Funciones auxiliares para obtener listas filtradas
   * ? Aplican el filtro de búsqueda a cada tipo de recurso según el campo seleccionado
   * ? Si no hay texto de búsqueda, devuelven la lista completa
   */

  //* Filtra reportes por título o autor
  const getFilteredReports = () => {
    if (!search) return reports;
    if (searchField === "author")
      return filterBySearch(reports, search, "author");
    return filterBySearch(reports, search, searchField || "title");
  };

  //* Filtra tareas por título
  const getFilteredTasks = () => {
    if (!search) return tasks;
    return filterBySearch(tasks, search, searchField || "title");
  };

  //* Filtra cuadrillas por nombre
  const getFilteredCrews = () => {
    if (!search) return crews;
    return filterBySearch(crews, search, searchField || "name");
  };

  //* Filtra avances por título o nombre de trabajador (worker.name soportado por filterBySearch)
  const getFilteredProgress = () => {
    if (!search) return progress;
    return filterBySearch(progress, search, searchField || "title");
  };

  //? Variables con las listas ya filtradas
  const filteredReports = getFilteredReports();
  const filteredTasks = getFilteredTasks();
  const filteredCrews = getFilteredCrews();
  const filteredProgress = getFilteredProgress();

  /**
   * * Función renderList
   * ? Selecciona qué lista mostrar según el tipo de recurso seleccionado
   * @returns {JSX.Element} Lista de elementos del tipo seleccionado o todas las listas agrupadas
   *
   * - Si selectedType es "Reports", "Tasks", "Crews" o "Progress": muestra solo ese tipo
   * - Si selectedType es "All": muestra las 4 listas en secciones separadas
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
      default: //? Vista "All": muestra todas las secciones
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

  /**
   * * Función renderItems
   * ? Renderiza una lista genérica de elementos
   * @param {Array} items - Array de elementos a renderizar
   * @param {string} type - Tipo de elemento ("report", "task", "crew", "progress")
   * @returns {JSX.Element} Lista de tarjetas clickeables o mensaje de "No hay elementos"
   *
   * Cada tarjeta muestra:
   * - Título principal (según el tipo)
   * - Subtítulo con información adicional (autor, estado, miembros, trabajador)
   * - Etiqueta del tipo de recurso
   */
  const renderItems = (items, type) => {
    if (!items || items.length === 0)
      return <p className="text-sm text-gray-500">No hay elementos</p>;

    return items.map((it, i) => {
      const key = it._id || it.id || i;

      //? Determinar título y subtítulo según tipo de recurso
      let title = "";
      let subtitle = "";
      switch (type) {
        case "report":
          title = it.title || it.name || "Sin título";
          subtitle = `Autor: ${it.author || it.author_name || "-"}`;
          break;
        case "task":
          title = it.title || "Sin título";
          subtitle = `Estado: ${it.status || "-"} • Prioridad: ${
            it.priority || "-"
          }`;
          break;
        case "crew":
          title = it.name || "Sin nombre";
          subtitle = `Miembros: ${it.members ? it.members.length : 0}`;
          break;
        case "progress":
          title = it.title || "Sin título";
          subtitle = `Trabajador: ${it.worker?.name || it.worker || "-"}`;
          break;
        default:
          title = JSON.stringify(it);
      }

      return (
        <div
          key={key}
          onClick={() => setSelectedDetail({ type, data: it })} //? Al hacer click, muestra los detalles del elemento
          className="bg-white rounded-lg shadow p-3 flex justify-between items-center border border-gray-200 w-full max-w-4xl mx-auto min-h-14 hover:cursor-pointer hover:bg-gray-50"
        >
          <div>
            <span className="block text-lg font-semibold text-gray-800">
              {title}
            </span>
            <span className="block text-sm text-gray-500">{subtitle}</span>
          </div>
          <span className="text-sm text-gray-400">{type}</span>
        </div>
      );
    });
  };

  //? ============================================
  //? RENDERIZADO JSX
  //? ============================================
  return (
    <div className="min-h-screen bg-gray-50 max-w-6xl mx-auto w-full py-8">
      {/* ====== SECCIÓN: Controles de filtro y búsqueda ====== */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Botones para seleccionar tipo de recurso */}
        <div className="flex gap-2 items-center">
          {["All", "Reports", "Tasks", "Crews", "Progress"].map((t) => (
            <button
              key={t}
              className={`px-3 py-1 rounded border font-medium ${
                selectedType === t
                  ? "bg-blue-600 text-white" //? Estilo para botón activo
                  : "bg-white text-blue-600 border-blue-600" //? Estilo para botón inactivo
              }`}
              onClick={() => setSelectedType(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Campo de búsqueda y selector de campo */}
        <div className="flex gap-2 items-center">
          {/*//* Input de búsqueda */}
          <input
            type="text"
            placeholder={`Buscar por ${searchField || "campo"}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 w-64 focus:outline-none focus:ring focus:border-blue-300"
          />

          {/*//* Selector de campo por el cual buscar */}
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {(fieldOptionsByType[selectedType] || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ====== SECCIÓN: Lista de recursos filtrados ====== */}
      <div className="space-y-6">{renderList()}</div>

      {/* ====== SECCIÓN: Modal de detalles ====== */}
      {/*//* Se muestra cuando el usuario hace click en un elemento */}
      {selectedDetail && (
        <div>
          {/* Modal de detalles para Reporte */}
          {selectedDetail.type === "report" && (
            <ReportDetails
              report={selectedDetail.data}
              onClose={() => setSelectedDetail(null)}
              role={"Administrador"}
            />
          )}

          {/* Modal de detalles para Tarea */}
          {selectedDetail.type === "task" && (
            <TaskDetails
              task={selectedDetail.data}
              onClose={() => setSelectedDetail(null)}
            />
          )}

          {/* Modal de detalles para Cuadrilla */}
          {selectedDetail.type === "crew" && (
            <CrewDetails
              crew={selectedDetail.data}
              onClose={() => setSelectedDetail(null)}
            />
          )}

          {/* Modal de detalles para Avance */}
          {selectedDetail.type === "progress" && (
            <ProgressWorkerDetail
              progress={selectedDetail.data}
              onClose={() => setSelectedDetail(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AdminGlobalView;

//! ===============================================
//! TRADUCCIÓN DE CONSTANTES
//! ===============================================
/**
 * ESPAÑOL | INGLÉS
 * ----------------
 * reports = reportes
 * tasks = tareas
 * crews = cuadrillas
 * progress = avances/progresos
 * selectedType = tipo seleccionado
 * search = búsqueda
 * searchField = campo de búsqueda
 * selectedDetail = detalle seleccionado
 * fetchAll = obtener todo
 * fieldOptionsByType = opciones de campo por tipo
 * getFilteredReports = obtener reportes filtrados
 * getFilteredTasks = obtener tareas filtradas
 * getFilteredCrews = obtener cuadrillas filtradas
 * getFilteredProgress = obtener avances filtrados
 * renderList = renderizar lista
 * renderItems = renderizar elementos
 * title = título
 * subtitle = subtítulo
 * author = autor
 * members = miembros
 * worker = trabajador
 */
