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
  }, [user, getFetchData]);

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
    <div className="min-h-screen bg-[#eaf4fe] flex flex-col py-8 px-2">
      <div className="relative w-full flex-1">
        <div className="max-w-4xl mx-auto flex flex-col gap-6 text-center bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-cyan-300">
          <h2 className="text-5xl font-extrabold text-cyan-700 mb-2 tracking-tight drop-shadow">Tus Reportes</h2>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md mx-auto px-4 py-3 rounded-xl border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white text-lg"
          />
          {/* //? BOTONES DE FILTRO POR ESTADO */}
          <div className="flex flex-wrap justify-center gap-3 py-4 bg-white/60 backdrop-blur-md rounded-xl shadow border border-cyan-100">
            {statusOptions.map((option) => (
              <button
                key={option}
                className={`px-5 py-2 rounded-xl font-semibold border transition-colors duration-150 shadow-sm text-base
                  ${filter === option
                    ? "bg-cyan-600 text-white border-cyan-700"
                    : "bg-white text-cyan-600 border-cyan-400 hover:bg-cyan-50"
                  }`}
                onClick={() => setFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
          {/* //? LISTA DE REPORTES */}
          <div className="space-y-6 mt-6">
            {filteredReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <h3 className="text-2xl font-semibold text-cyan-700 mb-4">¡Haz tu primer reporte!</h3>
                <Link to="/citizen/reports" className="bg-cyan-600 text-white px-6 py-3 rounded-xl font-bold shadow hover:bg-cyan-700 transition">
                  Hacer reporte
                </Link>
              </div>
            ) : (
              filteredReports.map((reporte, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 flex justify-between items-center border border-cyan-200 w-full max-w-3xl mx-auto min-h-16 hover:scale-[1.02] transition-transform cursor-pointer"
                  onClick={() => setSelectedReport(reporte)}
                >
                  <div>
                    <span className="block text-2xl font-bold text-cyan-700 mb-1">
                      {reporte.title}
                    </span>
                  </div>
                  {/* //? Badge de estado con colores según status */}
                  <span
                    className={`px-6 py-2 rounded-full text-lg font-bold shadow-sm
                      ${reporte.status === "Pendiente"
                        ? "bg-yellow-100 text-yellow-700"
                        : reporte.status === "Revisado"
                          ? "bg-cyan-100 text-cyan-700"
                          : reporte.status === "Aceptado"
                            ? "bg-green-100 text-green-700"
                            : reporte.status === "Completado"
                              ? "bg-emerald-100 text-emerald-700"
                              : reporte.status === "Rechazado"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                      }
                    `}
                  >
                    {reporte.status}
                  </span>
                </div>
              ))
            )}
            {/* //? PANEL DE DETALLES (MODAL) */}
            {selectedReport && (
              <ReportDetails report={selectedReport} onClose={closeModal} />
            )}
          </div>
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
