//* ========================================
//* PÁGINA: ReportStatus
//* ========================================
//* Propósito: Lista de reportes del ciudadano con filtros y búsqueda
//* Ruta: /citizen/reportstatus
//* Layout: CitizenLayout
//* Características:
//*   - Muestra todos los reportes del usuario autenticado
//*   - Filtros por estado (6 opciones + Todos)
//*   - Búsqueda por título
//*   - Click en reporte: abre panel de detalles
//*   - Endpoint: /reports/author (reportes del usuario logueado por sesión)
//*   - Si no hay reportes: enlace a /citizen/reports

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import useFetch from "../../hooks/useFetch";
import ReportModal from "../../components/ReportModal";
import { Link } from "react-router-dom";
import ReportDetails from "../../components/details/ReportDetails";

const ReportStatus = () => {
  //* ========================================
  //* CONTEXTO Y ESTADO
  //* ========================================
  const { user } = useContext(UserContext);
  const { getFetchData } = useFetch();

  //? Estado de reportes del usuario
  const [reports, setReports] = useState([]);
  //? Reporte seleccionado para mostrar detalles
  const [selectedReport, setSelectedReport] = useState(null);
  //? Filtro por estado (Todos, Pendiente, Revisado, etc.)
  const [filter, setFilter] = useState("Todos");
  //? Búsqueda por título
  const [search, setSearch] = useState("");

  //* ========================================
  //* EFECTO: Cargar reportes del usuario
  //* ========================================
  useEffect(() => {
    const fetchReports = async () => {
      try {
        //! Endpoint que trae los reportes del usuario autenticado por sesión
        const data = await getFetchData("/reports/author");
        setReports(data.reports);
        console.log("Reportes obtenidos:", data.reports);
      } catch (error) {
        console.error("Error al obtener los reportes:", error);
      }
    };
    fetchReports();
  }, [user]);

  //* ========================================
  //* HANDLERS
  //* ========================================
  //? Cerrar panel de detalles
  const closeModal = () => {
    setSelectedReport(null);
  };

  //* ========================================
  //* OPCIONES DE FILTRO
  //* ========================================
  //? Opciones de estado según los estados del backend
  const statusOptions = [
    "Todos",
    "Pendiente",
    "Revisado",
    "Aceptado",
    "Completado",
    "Rechazado",
  ];

  //* ========================================
  //* FILTRADO DE REPORTES
  //* ========================================
  //! Aplicar filtro por estado y búsqueda por título
  const filteredReports = (
    filter === "Todos" ? reports : reports.filter((r) => r.status === filter)
  ).filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));

  //* ========================================
  //* RENDER
  //* ========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <div className="relative w-full flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-4 text-center">
          <h2 className="text-4xl font-bold text-blue-700 mb-2">Tus Reportes</h2>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full max-w-md mx-auto px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* //? ======================================== */}
        {/* //? BOTONES DE FILTRO POR ESTADO */}
        {/* //? ======================================== */}
        <div className="max-w-4xl mx-auto px-4 pb-4 flex gap-2">
          {statusOptions.map((option) => (
            <button
              key={option}
              className={`px-4 py-2 rounded border font-medium transition-colors duration-150
                ${filter === option
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border-blue-600"
                }`}
              onClick={() => setFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* //? ======================================== */}
        {/* //? LISTA DE REPORTES */}
        {/* //? ======================================== */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            //! Si no hay reportes, mostrar mensaje y enlace
            <div className="flex flex-col items-center justify-center py-16">
              <h3>¡Haz tu primer reporte!</h3>
              <Link to="/citizen/reports" className="border">
                Hacer reporte
              </Link>
            </div>
          ) : (
            //? Renderizar cada reporte como tarjeta clickeable
            filteredReports.map((reporte, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow p-3 flex justify-between items-center border border-gray-200 w-full max-w-2xl mx-auto min-h-14 hover:cursor-pointer"
                onClick={() => setSelectedReport(reporte)}
              >
                <div>
                  <span className="block text-xl font-semibold text-gray-800">
                    {reporte.title}
                  </span>
                </div>
                {/* //? Badge de estado con colores según status */}
                <span
                  className={`px-5 py-2 rounded-full text-base font-medium 
                    ${reporte.status === "Resuelto"
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

          {/* //? ======================================== */}
          {/* //? PANEL DE DETALLES (MODAL) */}
          {/* //? ======================================== */}
          {selectedReport && (
            <ReportDetails report={selectedReport} onClose={closeModal} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportStatus;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * ReportStatus = estado de reporte
 * user = usuario
 * UserContext = contexto de usuario
 * getFetchData = obtener datos del fetch
 * useFetch = usar fetch
 * reports = reportes
 * setReports = establecer reportes
 * selectedReport = reporte seleccionado
 * setSelectedReport = establecer reporte seleccionado
 * filter = filtro
 * setFilter = establecer filtro
 * search = búsqueda
 * setSearch = establecer búsqueda
 * fetchReports = obtener reportes
 * data = datos
 * error = error
 * closeModal = cerrar modal
 * statusOptions = opciones de estado
 * filteredReports = reportes filtrados
 * r = reporte (abreviatura)
 * status = estado
 * title = título
 * toLowerCase = a minúsculas
 * includes = incluye
 * e = evento
 * option = opción
 * reporte = reporte
 * idx = índice
 * ReportDetails = detalles de reporte
 * report = reporte
 * onClose = al cerrar
 */
