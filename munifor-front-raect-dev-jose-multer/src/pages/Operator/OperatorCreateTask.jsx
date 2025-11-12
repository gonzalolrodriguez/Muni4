//! ========================================
//! OPERATOR CREATE TASK - CREAR TAREAS Y ASIGNAR A CUADRILLAS
//! ========================================
//* Propósito: Página para crear tareas seleccionando reportes aceptados y asignándolos a una cuadrilla
//* Ruta: /operator/create-task
//* Layout: OperatorLayout (con OperatorNavBar)
//* Endpoint: GET /reports/operator/accepted - Obtiene reportes aceptados y cuadrillas activas
//*           POST /task - Crea tarea con reportes y cuadrilla seleccionados
//* Características:
//*   - Dos columnas: Reportes aceptados (izquierda) y Cuadrillas (derecha)
//*   - Selección múltiple de reportes
//*   - Selección única de cuadrilla
//*   - Búsqueda por título de reporte y nombre de cuadrilla
//*   - Modal para completar información de la tarea (título, descripción, fecha límite)

import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import CreateTaskModal from "../../components/CreateTaskModal";
import useFilter from "../../hooks/useFilter";

//? ========================================
//? COMPONENTE PRINCIPAL - OPERATORCREATETASK
//? ========================================
//* Descripción: Permite crear tareas asignando reportes aceptados a cuadrillas
//* @returns {JSX.Element} - Vista con 2 columnas (reportes + cuadrillas) y modal de creación
//* Uso: Operadores crean tareas para que trabajadores las completen
const OperatorCreateTask = () => {
  const { getFetchData, postFetchLocalStorage } = useFetch();

  //? Estados para datos desde el backend
  const [reports, setReports] = useState([]); //* Reportes con estado "Aceptado"
  const [crews, setCrews] = useState([]); //* Cuadrillas activas disponibles

  //? Estados para búsqueda
  const [searchReport, setSearchReport] = useState(""); //* Búsqueda por título de reporte
  const [searchCrew, setSearchCrew] = useState(""); //* Búsqueda por nombre de cuadrilla
  const { filterBySearch } = useFilter();

  //? Estados para selección
  const [modal, setModal] = useState(false); //* Controla visibilidad del modal
  const [reportSelected, setReportSelected] = useState([]); //* Array de IDs de reportes seleccionados
  const [crewSelected, setCrewSelected] = useState(null); //* ID de la cuadrilla seleccionada (única)

  //? ========================================
  //? EFFECT: CARGAR REPORTES Y CUADRILLAS
  //? ========================================
  //* Se ejecuta al montar el componente y cuando se cierra el modal
  //* Obtiene reportes con estado "Aceptado" y cuadrillas activas
  useEffect(() => {
    const fetchData = async () => {
      //? Llama al endpoint que devuelve reportes aceptados y cuadrillas
      const data = await getFetchData("/reports/operator/accepted");
      console.log(data);
      //? Actualiza estados con datos del backend (usa [] como default)
      setReports(data.reports || []);
      setCrews(data.crews || []);
    };
    fetchData();
  }, [modal, getFetchData]); //* Se re-ejecuta cuando modal cambia (para actualizar lista después de crear tarea)

  //? ========================================
  //? HANDLERS: GESTIÓN DE MODAL Y SELECCIONES
  //? ========================================

  //* Cierra el modal de creación de tarea
  const handleCloseModal = () => {
    setModal(false);
  };

  //* Selecciona/deselecciona un reporte (permite selección múltiple)
  //* @param {Object} report - Reporte a seleccionar/deseleccionar
  const handleSelectReport = (report) => {
    //? Si ya está seleccionado, lo quita; si no, lo agrega
    setReportSelected(
      (prev) =>
        prev.includes(report._id)
          ? prev.filter((id) => id !== report._id) //* Quita del array
          : [...prev, report._id] //* Agrega al array
    );
  };

  //* Selecciona una cuadrilla (solo permite una seleccionada)
  //* @param {Object} crew - Cuadrilla a seleccionar
  const handleSelectCrew = (crew) => {
    //? Si la cuadrilla ya está seleccionada, la deselecciona; si no, la selecciona
    setCrewSelected(crew._id === crewSelected ? null : crew._id);
  };

  //* Envía la tarea al backend y resetea selecciones
  //* @param {Object} payload - Datos de la tarea (título, descripción, fecha, reportes, cuadrilla)
  const handleSubmit = (payload) => {
    console.log(payload);
    //? Envía POST a /task con payload del modal
    postFetchLocalStorage("/task", payload);
    //? Resetea selecciones después de crear la tarea
    setCrewSelected(null);
    setReportSelected([]);
  };

  //? ========================================
  //? FILTROS: BÚSQUEDA DE REPORTES Y CUADRILLAS
  //? ========================================
  //* Filtra reportes por título usando el hook useFilter
  const filteredReports = filterBySearch(reports, searchReport, "title");
  //* Filtra cuadrillas por nombre usando el hook useFilter
  const filteredCrews = filterBySearch(crews, searchCrew, "name");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#eaf4fe] to-[#d2e7fa]">
      {/* ========================================
          SECCIÓN: HEADER CON BOTÓN CREAR TAREA
          ======================================== */}
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-cyan-700 mb-2 drop-shadow">Tareas</h2>
        {/* Botón para abrir modal de creación */}
        <button
          className="bg-cyan-600 text-white px-6 py-2 rounded-2xl shadow hover:bg-cyan-700 transition mt-2 font-bold"
          onClick={() => setModal(true)}
        >
          Crear tarea
        </button>
      </div>

      {/* ========================================
          SECCIÓN: DOS COLUMNAS (REPORTES + CUADRILLAS)
          ======================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
        {/* ========================================
            COLUMNA IZQUIERDA: REPORTES ACEPTADOS
            ======================================== */}
        <div>
          <h3 className="text-xl font-bold text-cyan-700 mb-4">Reportes aceptados</h3>
          {/* Input de búsqueda por título */}
          <input
            type="text"
            placeholder="Buscar por nombre de reporte..."
            className="border border-cyan-300 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-500 bg-white shadow-sm text-gray-700 mb-4"
            value={searchReport}
            onChange={(e) => setSearchReport(e.target.value)}
          />
          {/* Lista de reportes filtrados */}
          {filteredReports.map((reporte) => (
            <div
              key={reporte._id}
              className={`bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-3 flex flex-col border w-full mb-3 min-h-14 hover:scale-[1.02] transition-transform cursor-pointer
                ${reportSelected.includes(reporte._id)
                  ? "border-cyan-400 ring-2 ring-cyan-300"
                  : "border-gray-200"}
              `}
              onClick={() => handleSelectReport(reporte)}
            >
              <span className="block text-base font-bold text-cyan-700">
                {reporte.title}
              </span>
              <span className="text-sm text-cyan-600">
                {reporte.description}
              </span>
            </div>
          ))}
        </div>

        {/* ========================================
            COLUMNA DERECHA: CUADRILLAS
            ======================================== */}
        <div>
          <h3 className="text-xl font-bold text-cyan-700 mb-4">Cuadrillas</h3>
          {/* Input de búsqueda por nombre */}
          <input
            type="text"
            placeholder="Buscar por nombre de crew..."
            className="border border-cyan-300 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-500 bg-white shadow-sm text-gray-700 mb-4"
            value={searchCrew}
            onChange={(e) => setSearchCrew(e.target.value)}
          />
          {/* Lista de cuadrillas filtradas */}
          {filteredCrews.length > 0 ? (
            filteredCrews.map((crew) => (
              <div
                key={crew._id}
                className={`bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-3 flex flex-col border w-full mb-3 min-h-14 hover:scale-[1.02] transition-transform cursor-pointer
                  ${crewSelected === crew._id
                    ? "border-cyan-400 ring-2 ring-cyan-300"
                    : "border-gray-200"}
                `}
                onClick={() => handleSelectCrew(crew)}
              >
                <span className="block text-base font-bold text-cyan-700">
                  {crew.name}
                </span>
                <span className="text-sm text-cyan-600">
                  {crew.description}
                </span>
              </div>
            ))
          ) : (
            //* Mensaje cuando no hay cuadrillas disponibles
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-3 flex flex-col border border-gray-200 w-full mb-3 min-h-14">
              <span className="block text-base font-bold text-cyan-700">
                No hay cuadrillas disponibles
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================
          MODAL: CREAR TAREA
          ======================================== 
          * Se muestra cuando modal === true
          * Pide título, descripción, fecha límite
          * Recibe crewSelected y reportSelected como props
      */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <CreateTaskModal
            onClose={handleCloseModal}
            crewSelected={crewSelected}
            reportSelected={reportSelected}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default OperatorCreateTask;

//! ========================================
//! TRADUCCIÓN DE CONSTANTES
//! ========================================
//* reports - reportes
//* crews - cuadrillas
//* searchReport - búsqueda de reporte
//* searchCrew - búsqueda de cuadrilla
//* reportSelected - reportes seleccionados
//* crewSelected - cuadrilla seleccionada
//* modal - modal
//* filterBySearch - filtrar por búsqueda
//* handleSelectReport - manejar selección de reporte
//* handleSelectCrew - manejar selección de cuadrilla
//* handleSubmit - manejar envío
//* handleCloseModal - manejar cierre de modal
//* filteredReports - reportes filtrados
//* filteredCrews - cuadrillas filtradas
