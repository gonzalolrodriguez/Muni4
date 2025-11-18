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

import React from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useFilter from "../../hooks/useFilter";
import ReportDetails from "../../components/details/ReportDetails";
import Pagination from "../../components/Pagination";

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
  const [currentPage, setCurrentPage] = useState(1); //* Página actual
  const { filterReportsByStatus, filterBySearch, limitData } = useFilter();

  //? ========================================
  //? FUNCIÓN: CARGAR REPORTES
  //? ========================================
  //* Definida fuera del useEffect para reutilizarla (se llama al cerrar modal)
  const fetchReports = React.useCallback(async () => {
    try {
      //? Obtiene todos los reportes desde el endpoint del operador
      const data = await getFetchData("/report/operator");
      setReports(data.reports);
      console.log(data.reports);
    } catch (error) {
      console.error("Error al obtener los reportes ciudadanos:", error);
    }
  }, []);

  //? ========================================
  //? EFFECT: CARGAR REPORTES AL MONTAR
  //? ========================================
  useEffect(() => {
    fetchReports();
  }, []); //* Solo al montar

  //? ========================================
  //? EFFECT: RESETEAR PÁGINA AL CAMBIAR FILTROS
  //? ========================================
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  //? ========================================
  //? FILTROS: OPCIONES Y APLICACIÓN
  //? ========================================
  //* Opciones de filtro por estado
  const statusOptions = [
    "Todos",
    "Pendiente",
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

  //* Aplicar paginación (10 reportes por página)
  const { data: paginatedReports, totalPages } = limitData(
    filteredReports,
    15,
    currentPage
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
    console.log("Report selected:", reporte);
    //? Marca automáticamente como "Revisado" al abrirlo
    if (reporte.status === "Pendiente") putFetch("/report/review", reporte._id);
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#eaf4fe] to-[#d2e7fa]">
      {/* ========================================
          SECCIÓN: HEADER CON BÚSQUEDA
          ======================================== */}
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-4">
        <h2 className="text-3xl font-extrabold text-cyan-700 mb-2 drop-shadow">
          Reportes de Ciudadanos
        </h2>
        {/* Input de búsqueda por título */}
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-2 border-cyan-300 rounded-lg px-4 py-3 w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white shadow-sm placeholder-cyan-600/60 text-cyan-700"
        />
      </div>

      {/* ========================================
          SECCIÓN: FILTROS POR ESTADO
          ======================================== */}
      <div className="max-w-5xl mx-auto px-4 pb-6 flex gap-3 flex-wrap">
        {statusOptions.map((option) => (
          <button
            key={option}
            className={`px-6 py-2 rounded-full border-2 font-semibold transition-all duration-150 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-cyan-400
              ${
                filter === option
                  ? "bg-cyan-600 text-white border-cyan-600 scale-105 shadow-lg"
                  : "bg-white text-cyan-600 border-cyan-600 hover:bg-cyan-50"
              }`}
            onClick={() => setFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {/* ========================================
          SECCIÓN: PAGINACIÓN SUPERIOR
          ======================================== */}
      <div className="max-w-5xl mx-auto px-4 pb-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ========================================
          SECCIÓN: LISTA DE REPORTES
          ======================================== */}
      <div className="space-y-6">
        {filteredReports.length === 0 ? (
          //* Mensaje cuando no hay reportes
          <div className="flex flex-col items-center justify-center py-16">
            <h3 className="text-lg text-cyan-700 font-semibold">
              No hay reportes ciudadanos
            </h3>
          </div>
        ) : (
          //* Lista de reportes paginados
          paginatedReports.map((reporte, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg p-5 flex justify-between items-center border-2 border-cyan-300/20 w-full max-w-3xl mx-auto min-h-16 hover:cursor-pointer hover:shadow-xl transition-all duration-150"
              onClick={() => handleSelectReport(reporte)}
            >
              <div>
                <span className="block text-2xl font-bold text-cyan-700 mb-1">
                  {reporte.title}
                </span>
                <span className="block text-sm text-cyan-600/70">
                  Autor:{" "}
                  <span className="font-semibold text-cyan-700">
                    {reporte.author?.username}
                  </span>
                </span>
              </div>
              {/* Badge de estado con color según el estado */}
              <span
                className={`px-6 py-2 rounded-full text-base font-semibold shadow-sm border-2
                  ${
                    reporte.status === "Pendiente"
                      ? "bg-[#fef9c3] text-[#ca8a04] border-[#ca8a04]/30"
                      : reporte.status === "Revisado"
                      ? "bg-[#e0f7e9] text-[#059669] border-[#059669]/30"
                      : reporte.status === "Rechazado"
                      ? "bg-[#fee2e2] text-[#dc2626] border-[#dc2626]/30"
                      : reporte.status === "Aceptado"
                      ? "bg-[#dbeafe] text-cyan-700 border-cyan-300/30"
                      : reporte.status === "Completado"
                      ? "bg-[#e0e7ff] text-[#6366f1] border-[#6366f1]/30"
                      : "bg-gray-100 text-gray-500 border-gray-300"
                  }
                `}
              >
                {reporte.status}
              </span>
            </div>
          ))
        )}

        {/* ========================================
            SECCIÓN: PAGINACIÓN INFERIOR
            ======================================== */}
        <div className="max-w-5xl mx-auto px-4 pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            scrollToTop={true}
          />
        </div>

        {/* ========================================
            MODAL: DETALLES DEL REPORTE
            ======================================== 
            * Muestra información completa del reporte
            * Botones para aceptar o rechazar
        */}
        {selectedReport && (
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
              <ReportDetails
                report={selectedReport}
                onClose={closeModal}
                onReject={handleRejectReport}
                onAccept={handleAcceptReport}
                role={"Operador"}
              />
            </div>
          </div>
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
