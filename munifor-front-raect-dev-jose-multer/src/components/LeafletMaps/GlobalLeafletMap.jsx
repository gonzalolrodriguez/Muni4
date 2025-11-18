//* ========================================
//* COMPONENTE: GlobalLeafletMap
//* ========================================
//* Propósito: Mapa interactivo completo con filtros, marcadores y panel de detalles
//* Usado en: AdminMap, OperatorMap (vista completa del municipio)
//* Props:
//*   - role: string - Rol del usuario ("Operador", "Administrador")
//* Estructura del componente:
//*   - Panel izquierdo: Filtros (AsideFilterMap)
//*   - Centro: Mapa con marcadores (MapContainer)
//*   - Panel derecho: Detalles (ReportDetails - condicional)
//* Funcionalidad:
//*   - Carga datos del backend según rol (endpoint diferente)
//*   - Muestra marcadores de reportes, tareas o avances según filtro
//*   - Click en marcador: abre panel de detalles
//*   - Hover en marcador: muestra popup
//*   - Filtros dinámicos que actualizan marcadores
//* Endpoints:
//*   - Operador: /map/operator-data (solo su área)
//*   - Admin: /map/data (todos los datos)

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  getIconProgress,
  getIconReport,
  getIconTask,
} from "../../utils/getIconMap";
import useFetch from "../../hooks/useFetch";
import useFilter from "../../hooks/useFilter";
import { useEffect, useState } from "react";
import AsideFilterMap from "./AsideFilterMap";
import ReportDetails from "../details/ReportDetails";
import TaskDetails from "../details/TaskDetails";
import ProgressWorkerDetail from "../details/ProgressWorkerDetail";

const GlobalLeafletMap = ({ role }) => {
  //* ========================================
  //* ESTADO LOCAL
  //* ========================================
  //? Almacena todos los datos del backend (reportes, tareas, avances)
  const [allData, setAllData] = useState({
    reports: [],
    tasks: [],
    progress: [],
  });
  //? Filtros aplicados (dataType, status, type, priority, timeRange)
  const [filters, setFilters] = useState({ dataType: "report" });
  //? Reporte/tarea/avance seleccionado para mostrar detalles
  const [selectedDetail, setselectedDetail] = useState(null);

  //* Hooks personalizados
  const { getFetchData } = useFetch();
  const { filterForMap } = useFilter();

  //* ========================================
  //* EFECTO: Cargar datos del backend al montar
  //* ========================================
  useEffect(() => {
    let isMounted = true; // Prevenir actualizaciones si se desmonta

    const fetchData = async () => {
      try {
        //! Endpoint específico según el rol del usuario
        const endpoint =
          role === "Operador" ? "/map/operator-data" : "/map/data";

        const data = await getFetchData(endpoint);

        if (isMounted) {
          console.log(data.progress);
          //? Guardar datos separados por tipo
          setAllData({
            reports: data.reports || [],
            tasks: data.tasks || [],
            progress: data.progress || [],
          });
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error al cargar datos del mapa:", error);
          //? En caso de error, resetear datos
          setAllData({
            reports: [],
            tasks: [],
            progress: [],
          });
        }
      }
    };

    fetchData();

    //! Cleanup: marcar componente como desmontado
    return () => {
      isMounted = false;
    };
  }, [role]);

  //* ========================================
  //* HANDLERS
  //* ========================================
  //? Callback del panel de filtros
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  //? Callback al hacer click en un marcador
  const handleSelectReport = (reporte) => setselectedDetail(reporte);

  //? Callback para cerrar panel de detalles
  const closeModal = () => setselectedDetail(null);

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

  //* ========================================
  //* FILTRADO DE DATOS
  //* ========================================
  //! Aplicar filtros con useFilter.filterForMap
  const filteredData = filterForMap(allData, filters);

  //* ========================================
  //* RENDER
  //* ========================================
  return (
    <div className="flex flex-col md:flex-row h-full min-h-screen bg-gradient-to-br from-[#eaf4fe] to-[#d2e7fa]">
      {/* //? PANEL IZQUIERDO - FILTROS MODERNO */}
      <aside className="w-full md:w-[320px] min-w-0 bg-white/80 backdrop-blur-xl border-b-4 md:border-b-0 md:border-r-4 border-cyan-300 p-4 md:p-8 flex flex-col gap-8 shadow-2xl z-20 rounded-b-3xl md:rounded-b-none md:rounded-r-3xl mb-4 md:mb-8 md:ml-8 overflow-hidden">
        <div className="mb-4 md:mb-6 mt-4 md:mt-44">
          <h2 className="text-2xl md:text-3xl font-extrabold text-cyan-700 mb-2 text-center tracking-tight drop-shadow">
            Filtros
          </h2>
          <p className="text-cyan-600 text-base text-center mb-4">
            Personaliza la vista del mapa usando los filtros disponibles.
          </p>
        </div>
        <div className="flex-1 flex flex-col justify-start mt-2 md:mt-4">
          <AsideFilterMap onFilters={handleApplyFilters} />
        </div>
      </aside>

      {/* //? CONTENIDO CENTRAL - MAPA Y INFO */}
      <main className="flex-1 relative flex flex-col items-center justify-start">
        {/* //? Tarjeta informativa expandida */}
        <div className="w-full px-0 pt-4 md:pt-10 flex justify-center">
          <div className="w-full mx-0 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-cyan-400 p-4 md:p-8 mb-4 md:mb-6 flex flex-col gap-2 text-center">
            <h2 className="text-2xl md:text-4xl font-extrabold text-cyan-700 mb-2 tracking-tight">
              Mapa Global de Reportes
            </h2>
            <p className="text-cyan-600 text-base md:text-lg">
              Visualiza todos los reportes, tareas y avances en tiempo real. Haz
              clic en los marcadores para ver detalles.
            </p>
          </div>
        </div>
        <div className="flex-1 w-full flex items-center justify-center pb-4 md:pb-8">
          <div className="w-full h-[350px] md:h-full rounded-3xl overflow-hidden shadow-xl border border-cyan-300">
            <MapContainer
              center={[-26.1849, -58.1731]} // Formosa, Argentina
              zoom={13}
              className="h-full w-full z-0 min-h-[300px]"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
              />
              {/* //! MARCADORES SEGÚN TIPO DE DATO */}
              {filters.dataType === "report"
                ? filteredData
                    .filter((item) => item.location?.lat && item.location?.lng)
                    .map((item) => (
                      <Marker
                        key={item._id}
                        position={[item.location.lat, item.location.lng]}
                        icon={getIconReport(
                          item.type_report?.toLowerCase() || "otros",
                          item.status?.toLowerCase()
                        )}
                        eventHandlers={{
                          click: () => handleSelectReport(item),
                          mouseover: (e) => e.target.openPopup(),
                          mouseout: (e) => e.target.closePopup(),
                        }}
                      >
                        <Popup>
                          <div>
                            <b>{item.type_report?.toUpperCase()}</b>
                            <br />
                            <span>{item.title || item.description}</span>
                            {item.status && (
                              <>
                                <br />
                                <small className="text-gray-600">
                                  Estado: {item.status}
                                </small>
                              </>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    ))
                : filters.dataType === "task"
                ? filteredData
                    .filter((item) => item.location?.lat && item.location?.lng)
                    .map((item) => (
                      <Marker
                        key={item._id}
                        position={[item.location.lat, item.location.lng]}
                        icon={getIconTask(
                          item.task_type?.toLowerCase(),
                          item.priority?.toLowerCase()
                        )}
                        eventHandlers={{
                          click: () => handleSelectReport(item),
                          mouseover: (e) => e.target.openPopup(),
                          mouseout: (e) => e.target.closePopup(),
                        }}
                      >
                        <Popup>
                          <div>
                            <b>{item.task_type?.toUpperCase()}</b>
                            <br />
                            <span>{item.title || item.description}</span>
                            <br />
                            <small className="text-gray-600">
                              Estado: {item.status}
                            </small>
                          </div>
                        </Popup>
                      </Marker>
                    ))
                : filters.dataType === "progress" &&
                  filteredData
                    .filter((item) => item.location?.lat && item.location?.lng)
                    .map((item) => (
                      <Marker
                        key={item._id}
                        position={[item.location.lat, item.location.lng]}
                        icon={getIconProgress(item.status?.toLowerCase())}
                        eventHandlers={{
                          click: () => handleSelectReport(item),
                          mouseover: (e) => e.target.openPopup(),
                          mouseout: (e) => e.target.closePopup(),
                        }}
                      >
                        <Popup>
                          <div>
                            <b>PROGRESO</b>
                            <br />
                            <span>{item.worker?.name}</span>
                            <br />
                            <small className="text-gray-600">
                              Estado: {item.status}
                            </small>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
            </MapContainer>
          </div>
        </div>
        {/* //? PANEL DERECHO - DETALLES */}
        {selectedDetail && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl font-bold"
                onClick={closeModal}
                aria-label="Cerrar"
              >
                &times;
              </button>
              {/* //! Renderizar componente según dataType */}
              {filters.dataType === "report" && (
                <ReportDetails
                  report={selectedDetail}
                  onClose={closeModal}
                  onReject={handleRejectReport}
                  onAccept={handleAcceptReport}
                  role={role}
                />
              )}
              {filters.dataType === "task" && (
                <TaskDetails task={selectedDetail} onClose={closeModal} />
              )}
              {filters.dataType === "progress" && (
                <ProgressWorkerDetail
                  progress={selectedDetail}
                  onClose={closeModal}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GlobalLeafletMap;

//* ========================================
//* CONSTANTES EN ESPAÑOL
//* ========================================
/*
 * GlobalLeafletMap = mapa de leaflet global
 * role = rol
 * allData = todos los datos
 * setAllData = establecer todos los datos
 * reports = reportes
 * tasks = tareas
 * progress = avances
 * filters = filtros
 * setFilters = establecer filtros
 * dataType = tipo de dato
 * selectedDetail = reporte seleccionado
 * setselectedDetail = establecer reporte seleccionado
 * getFetchData = obtener datos del fetch
 * filterForMap = filtrar para mapa
 * isMounted = está montado
 * fetchData = obtener datos
 * endpoint = punto final (URL backend)
 * data = datos
 * handleApplyFilters = manejar aplicar filtros
 * newFilters = nuevos filtros
 * handleSelectReport = manejar seleccionar reporte
 * reporte = reporte
 * closeModal = cerrar modal
 * filteredData = datos filtrados
 * MapContainer = contenedor del mapa
 * center = centro
 * zoom = acercamiento
 * className = nombre de clase
 * TileLayer = capa de mosaicos
 * url = URL
 * attribution = atribución
 * item = elemento
 * location = ubicación
 * lat = latitud
 * lng = longitud
 * Marker = marcador
 * position = posición
 * icon = ícono
 * getIconReport = obtener ícono de reporte
 * getIconTask = obtener ícono de tarea
 * getIconProgress = obtener ícono de avance
 * report_type = tipo de reporte
 * toLowerCase = a minúsculas
 * toUpperCase = a mayúsculas
 * status = estado
 * eventHandlers = manejadores de eventos
 * click = click
 * mouseover = ratón encima
 * mouseout = ratón fuera
 * e = evento
 * target = objetivo
 * openPopup = abrir popup
 * closePopup = cerrar popup
 * Popup = popup
 * title = título
 * description = descripción
 * task_type = tipo de tarea
 * priority = prioridad
 * worker = trabajador
 * name = nombre
 * ReportDetails = detalles de reporte
 * report = reporte
 * onClose = al cerrar
 */
