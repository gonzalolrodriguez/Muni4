//! ========================================
//! OPERATOR REPORTS - GESTIÓN DE REPORTES CIUDADANOS
//! ========================================
//* Propósito: Página para visualizar, filtrar y gestionar todos los reportes ciudadanos
//* Ruta: /operator/reports
//* Layout: OperatorLayout (con OperatorNavBar)
//* Endpoint: GET /report/operator - Obtiene todos los reportes
//*           PUT /report/accept - Acepta un reporte
//*           PUT /report/reject - Rechaza un reporte
//* Características:
//*   - Lista de reportes con título, autor y estado
//*   - Filtros por estado (Todos, Revisado, Aceptado, Completado, Rechazado)
//*   - Búsqueda por título de reporte
//*   - Modal de detalles con acciones (aceptar/rechazar)
//*   - Soporte para query params (?status=Rechazado desde dashboard)

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useFilter from "../../hooks/useFilter";
import ReportDetails from "../../components/details/ReportDetails";

//? ========================================
//? COMPONENTE PRINCIPAL - OPERATORREPORTS
//? ========================================
//* Descripción: Gestiona lista de reportes con filtros y acciones
//* @returns {JSX.Element} - Lista de reportes con filtros y modal de detalles
//* Uso: Operadores revisan, aceptan o rechazan reportes ciudadanos
const OperatorReports = () => {
  const { getFetchData, putFetch } = useFetch();

  //? Estados para datos y selección
  const [reports, setReports] = useState([]); //* Lista completa de reportes
  const [selectedReport, setSelectedReport] = useState(null); //* Reporte seleccionado para mostrar en modal

  //? Estados para filtros y búsqueda
  const [searchParams] = useSearchParams(); //* Para leer query params de la URL
  const statusParam = searchParams.get("status"); //* Obtiene ?status= de la URL
  const [filter, setFilter] = useState(() => statusParam || "Todos"); //* Inicializa filtro con statusParam o "Todos"
  const [search, setSearch] = useState(""); //* Búsqueda por título
  const { filterReportsByStatus, filterBySearch } = useFilter();

  //? ========================================
  //? FUNCIÓN: CARGAR REPORTES
  //? ========================================
  //* Definida fuera del useEffect para reutilizarla (se llama al cerrar modal)
  const fetchReports = async () => {
    try {
      //? Obtiene todos los reportes desde el endpoint del operador
      const data = await getFetchData("/report/operator");
      setReports(data.reports);
      console.log(data.reports);
    } catch (error) {
      console.error("Error al obtener los reportes ciudadanos:", error);
    }
  };

  //? ========================================
  //? EFFECT: CARGAR REPORTES AL MONTAR
  //? ========================================
  useEffect(() => {
    fetchReports();
  }, []); //* Solo al montar

  //? ========================================
  //? FILTROS: OPCIONES Y APLICACIÓN
  //? ========================================
  //* Opciones de filtro por estado
  const statusOptions = [
    "Todos",
    "Revisado",
    "Aceptado",
    "Completado",
    "Rechazado",
  ];

  //* Aplicar filtros encadenados: primero por estado, luego por búsqueda
  const filteredReports = filterBySearch(
    filterReportsByStatus(reports, filter), //* Filtra por estado seleccionado
    search, //* Luego filtra por texto de búsqueda
    "title" //* Campo a buscar
  );

  //? ========================================
  //? HANDLERS: ACCIONES DE REPORTES
  //? ========================================

  //* Cierra el modal y recarga la lista de reportes
  const closeModal = () => {
    setSelectedReport(null);
    fetchReports(); //* Recarga lista después de aceptar/rechazar
  };

  //* Abre el modal con los detalles del reporte seleccionado
  //* @param {Object} reporte - Reporte a visualizar
  const handleSelectReport = (reporte) => {
    setSelectedReport(reporte);
  };

  //* Rechaza un reporte
  //* @param {String} id - ID del reporte a rechazar
  const handleRejectReport = (id) => {
    console.log("Report rejected:", id);
    //? Llama al endpoint PUT /report/reject
    putFetch("/report/reject", id);
    closeModal(); //* Cierra modal y recarga lista
  };

  //* Acepta un reporte
  //* @param {String} id - ID del reporte a aceptar
  const handleAcceptReport = (id) => {
    console.log("Report accepted:", id);
    //? Llama al endpoint PUT /report/accept
    putFetch("/report/accept", id);
    closeModal(); //* Cierra modal y recarga lista
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ========================================
          SECCIÓN: HEADER CON BÚSQUEDA
          ======================================== */}
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-2">
        <h2 className="text-xl font-bold text-gray-700">
          Reportes de Ciudadanos
        </h2>
        {/* Input de búsqueda por título */}
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* ========================================
          SECCIÓN: FILTROS POR ESTADO
          ======================================== */}
      <div className="max-w-5xl mx-auto px-4 pb-4 flex gap-2">
        {statusOptions.map((option) => (
          <button
            key={option}
            className={`px-4 py-2 rounded border font-medium transition-colors duration-150
              ${
                filter === option
                  ? "bg-blue-600 text-white" //* Estilo del filtro activo
                  : "bg-white text-blue-600 border-blue-600" //* Estilo del filtro inactivo
              }`}
            onClick={() => setFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {/* ========================================
          SECCIÓN: LISTA DE REPORTES
          ======================================== */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          //* Mensaje cuando no hay reportes
          <div className="flex flex-col items-center justify-center py-16">
            <h3>No hay reportes ciudadanos</h3>
          </div>
        ) : (
          //* Lista de reportes filtrados
          filteredReports.map((reporte, idx) => (
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
                  Autor: {reporte.author?.username}
                </span>
              </div>
              {/* Badge de estado con color según el estado */}
              <span
                className={`px-5 py-2 rounded-full text-base font-medium 
                  ${
                    reporte.status === "Resuelto"
                      ? "bg-green-100 text-green-700"
                      : reporte.status === "En proceso"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }
                `}
              >
                {reporte.status}
              </span>
            </div>
          ))
        )}

        {/* ========================================
            MODAL: DETALLES DEL REPORTE
            ======================================== 
            * Muestra información completa del reporte
            * Botones para aceptar o rechazar
        */}
        {selectedReport && (
          <ReportDetails
            report={selectedReport}
            onClose={closeModal}
            onReject={handleRejectReport}
            onAccept={handleAcceptReport}
            role={"Operador"} //* Determina qué botones mostrar
          />
        )}
      </div>
    </div>
  );
};

export default OperatorReports;

//! ========================================
//! TRADUCCIÓN DE CONSTANTES
//! ========================================
//* reports - reportes
//* selectedReport - reporte seleccionado
//* filter - filtro
//* search - búsqueda
//* statusParam - parámetro de estado
//* statusOptions - opciones de estado
//* filteredReports - reportes filtrados
//* handleSelectReport - manejar selección de reporte
//* handleRejectReport - manejar rechazo de reporte
//* handleAcceptReport - manejar aceptación de reporte
//* closeModal - cerrar modal
//* fetchReports - obtener reportes
