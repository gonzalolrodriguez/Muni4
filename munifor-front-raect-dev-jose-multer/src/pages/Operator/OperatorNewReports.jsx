//! ========================================
//! OPERATOR NEW REPORTS - REPORTES NUEVOS PENDIENTES DE REVISIÓN
//! ========================================
//* Propósito: Página para visualizar y gestionar reportes con estado "Nuevo" (sin revisar)
//* Ruta: /operator/new-reports
//* Layout: OperatorLayout (con OperatorNavBar)
//* Endpoint: GET /report/operator/new-reports - Obtiene reportes con estado "Nuevo"
//*           PUT /report/review - Marca reporte como "Revisado" al abrirlo
//*           PUT /report/accept - Acepta un reporte
//*           PUT /report/reject - Rechaza un reporte
//* Características:
//*   - Lista solo reportes nuevos (no revisados)
//*   - Búsqueda por título de reporte
//*   - Al hacer clic, marca automáticamente como "Revisado"
//*   - Modal de detalles con acciones (aceptar/rechazar)

import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import useFilter from "../../hooks/useFilter";
import ReportDetails from "../../components/details/ReportDetails";

//? ========================================
//? COMPONENTE PRINCIPAL - OPERATORNEWREPORTS
//? ========================================
//* Descripción: Muestra reportes pendientes de primera revisión
//* @returns {JSX.Element} - Lista de reportes nuevos con modal de detalles
//* Uso: Operadores revisan reportes recién creados por ciudadanos
const OperatorNewReports = () => {
  const { getFetchData, putFetch } = useFetch();

  //? Estados para datos y selección
  const [reports, setReports] = useState([]); //* Lista de reportes nuevos
  const [selectedReport, setSelectedReport] = useState(null); //* Reporte seleccionado para mostrar en modal

  //? Estados para búsqueda
  const [search, setSearch] = useState(""); //* Búsqueda por título
  const { filterBySearch } = useFilter();

  //? ========================================
  //? FUNCIÓN: CARGAR REPORTES NUEVOS
  //? ========================================
  //* Definida fuera del useEffect para reutilizarla (se llama al cerrar modal)
  const fetchReports = async () => {
    try {
      //? Obtiene solo reportes con estado "Nuevo"
      const data = await getFetchData("/report/operator/new-reports");
      setReports(data.reports);
    } catch (error) {
      setReports([]); //* Si hay error, muestra lista vacía
    }
  };

  //? ========================================
  //? EFFECT: CARGAR REPORTES AL MONTAR
  //? ========================================
  useEffect(() => {
    fetchReports();
  }, []); //* Solo al montar

  //? ========================================
  //? HANDLERS: ACCIONES DE REPORTES
  //? ========================================

  //* Abre el modal y marca el reporte como "Revisado"
  //* @param {Object} reporte - Reporte a visualizar
  const handleSelectReport = (reporte) => {
    setSelectedReport(reporte);
    console.log("Report selected:", reporte);
    //? Marca automáticamente como "Revisado" al abrirlo
    putFetch("/report/review", reporte._id);
  };

  //* Cierra el modal y recarga la lista de reportes
  const closeModal = () => {
    setSelectedReport(null);
    fetchReports(); //* Refresca lista (el reporte revisado ya no aparecerá)
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

  //? ========================================
  //? FILTROS: BÚSQUEDA POR TÍTULO
  //? ========================================
  //* Filtra reportes por título usando el hook useFilter
  const filteredReports = filterBySearch(reports, search, "title");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ========================================
          SECCIÓN: HEADER CON BÚSQUEDA
          ======================================== */}
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-2">
        <h2 className="text-xl font-bold text-gray-700">
          Nuevos Reportes Pendientes
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
          SECCIÓN: LISTA DE REPORTES NUEVOS
          ======================================== */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          //* Mensaje cuando no hay reportes pendientes
          <div className="flex flex-col items-center justify-center py-16">
            <h3>No hay reportes pendientes</h3>
          </div>
        ) : (
          //* Lista de reportes nuevos filtrados
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
                  Autor: {reporte?.author?.username}
                </span>
              </div>
              {/* Badge de estado "Pendiente" */}
              <span className="px-5 py-2 rounded-full text-base font-medium bg-yellow-100 text-yellow-700">
                Pendiente
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
            onReject={handleRejectReport}
            onAccept={handleAcceptReport}
            onClose={closeModal}
            role={"Operador"} //* Determina qué botones mostrar
          />
        )}
      </div>
    </div>
  );
};

export default OperatorNewReports;

//! ========================================
//! TRADUCCIÓN DE CONSTANTES
//! ========================================
//* reports - reportes
//* selectedReport - reporte seleccionado
//* search - búsqueda
//* filteredReports - reportes filtrados
//* handleSelectReport - manejar selección de reporte
//* handleRejectReport - manejar rechazo de reporte
//* handleAcceptReport - manejar aceptación de reporte
//* closeModal - cerrar modal
//* fetchReports - obtener reportes
